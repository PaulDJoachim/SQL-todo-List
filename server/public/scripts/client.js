console.log('client.js working!');
taskMemory = [];

$(document).ready(()=>{
  console.log('jQuery Working');
  getTasks();
  createEventHandlers();
})


function createEventHandlers(){
  $('#addTaskBtn').on('click', addTask);
  $('#listDisplay').on('click','.delete', deleteTask);
  $('#listDisplay').on('click','.done', finishTask);
}


function getTasks(){
  $.ajax({
    method: 'GET',
    url: '/todo'
  }).then((response)=>{
    console.log('back from /todo GET with:', response);
    taskMemory = response;
    printList(response);
  }).catch((error)=>{
    console.log('error GETing @/todo:', error);
  })
}


// add a task
function addTask(){
  const newTask = {
    task: $('#taskTitle').val(),
    details: $('#taskDetails').val(),
    due_date: $('#dueDate').val() + ' ' + $('#dueTime').val() +'+0' 
  }
  console.log('POSTing @/todo:', newTask);
  $.ajax({
    method: 'POST',
    url: '/todo',
    data: newTask
  }).then((response)=>{
    console.log('POSTed @/todo, reply:', response);
    getTasks();
  }).catch((error)=>{
    console.log('error POSTing @/todo:', error);
  })
}


// delete a task
function deleteTask(){
  const thisTask = taskMemory[$(this).data('index')];
  console.log( 'in deleteTask targeting task with ID#', thisTask.id );
  // send this to server via a delete request
  $.ajax({
      type: "DELETE",
      url: '/todo/' + thisTask.id
  }).then((response)=>{
      console.log( 'back from delete, got:', response );
      getTasks();
  }).catch((error)=>{
      console.log(`error when trying to DELETE @/todo:`, error );
  })
}


// toggle the 'complete' status of a task
function finishTask(){
  console.log('in finishTask');
  // get user input and place in an object to send
  const thisTask = taskMemory[$(this).data('index')];
  let dataToSend 
    // change the 'complete' status on both server & taskMemory
    // because GET will reprint the whole page and close open tasks
    if (!thisTask.complete) {
      dataToSend = {complete: true}
      thisTask.complete = true;
    } else {
      dataToSend = {complete: false}
      thisTask.complete = false;
    }
  // send put req to server
  $.ajax({
      type: 'PUT',
      url: '/todo/' + thisTask.id,
      data: dataToSend
  }).then((response)=>{
      console.log( 'back from PUT with:', response );
      taskPainter(thisTask);
  }).catch((error)=>{
      console.log(`failed to PUT at /todo:`, error );
  })
}


// print task list entries for everything in an array
function printList(array){
  console.log('printList will print:', array);
  $('#listDisplay').empty();
  for (let i=0; i<array.length; i++){
    let created = array[i].created_at.replace('T',' ').slice(0,16);
    let due = array[i].due_date.replace('T',' ').slice(0,16);
    $('#listDisplay').append(`
    <tr id="taskRow${array[i].id}" data-toggle="collapse" data-target="#collapse_id${array[i].id}" class="clickable table-warning font-weight-bold">
      <td style="padding:6px;">${array[i].task}</td>
      <td style="text-align: center; padding:6px;">
        <div id="clockdiv${array[i].id}" class="clockdiv">
            <span class="days"></span>
            <span class="hours"></span>
            <span class="minutes"></span>
        </div>
        <div id="complete${array[i].id}">COMPLETE</div>
      </td>
    </tr>
    <tr id="detalsHolder">
      <td colspan="2" style="padding:0;">
        <div id="collapse_id${array[i].id}" class="collapse">
          <div id="cardBody${array[i].id}"class="card card-body d-flex flex-column py-0" style="min-height: 200px;">
            <div id="infoBoxes" class="d-flex flex-row justify-content-between" style="text-align:center">  
              <div id="cardText${array[i].id}" class="card card-details p-2 m-2">
                ${array[i].details}
              </div>
              <div id="cardTime${array[i].id}" class="card card-time p-2 m-2">
                <strong>Created: </strong>${created}
                <strong>Deadline: </strong>${due}
              </div>
            </div>
            <div class="editBtn">
              <button type="button" data-index="${i}" class="btn btn-success border-dark font-weight-bold done">&#10003</button>
              <button type="button" data-index="${i}" class="btn btn-danger border-dark float-right font-weight-bold delete">&#9747</button>
              <!-- <button type="button" data-index="${i}" class="btn btn-danger border-dark float-right font-weight-bold mr-3" style="color: black;">Edit</button> -->
              </div>
            </div>
        </div>
      </td>
    </tr>
    `)
    // initialize the countdown for each item
    initializeClock(`clockdiv${array[i].id}`, array[i]);
    taskPainter(array[i]);
  }
}


// re-colors a task depending on its 'complete' & 'overdue' status
function taskPainter(task){
  console.log('in taskPainter')
  if (task.complete){
    $(`#taskRow${task.id}`).removeClass("table-warning");
    $(`#taskRow${task.id}`).removeClass("bg-danger");
    $(`#taskRow${task.id}`).addClass("bg-success");
    $(`#cardText${task.id}`).css("background-color","#d3ffdd");
    $(`#cardTime${task.id}`).css("background-color","#d3ffdd");
    $(`#cardBody${task.id}`).css("background-color","#85b97b");
    $(`#clockdiv${task.id}`).hide();
    $(`#complete${task.id}`).show();
  } else {
    if (task.overdue){
      $(`#taskRow${task.id}`).removeClass("table-warning");
      $(`#taskRow${task.id}`).addClass("bg-danger");
      $(`#cardText${task.id}`).css("background-color","#ffd3d3");
      $(`#cardTime${task.id}`).css("background-color","#ffd3d3");
      $(`#cardBody${task.id}`).css("background-color","#b97b7b");
      $(`#complete${task.id}`).hide();
      $(`#clockdiv${task.id}`).show();
    } else if (!task.complete && !task.overdue) {
      $(`#taskRow${task.id}`).removeClass("bg-danger");
      $(`#taskRow${task.id}`).removeClass("bg-success");
      $(`#taskRow${task.id}`).addClass("table-warning");
      $(`#cardText${task.id}`).css("background-color","#ffeeba");
      $(`#cardTime${task.id}`).css("background-color","#ffeeba");
      $(`#cardBody${task.id}`).css("background-color","#d9c8a0");
      $(`#complete${task.id}`).hide();
      $(`#clockdiv${task.id}`).show();
    }
  }
}


// Calculate the time remaining until task deadline
function getTimeRemaining(endtime){
  const total = Date.parse(endtime) - Date.parse(new Date());
  //const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );
  return {
    total,
    days,
    hours,
    minutes,
    //seconds
  };
}


// Create a clock for each task and display the time remaining
function initializeClock(id, task) {
  // reformat the server time into something Date.parser can actually use
  let reformat = task.due_date.slice(0,10) + ' ' + task.due_date.slice(11,19);
  const clock = document.getElementById(id);
  const daysSpan = clock.querySelector('.days');
  const hoursSpan = clock.querySelector('.hours');
  const minutesSpan = clock.querySelector('.minutes');
  //const secondsSpan = clock.querySelector('.seconds');

  function updateClock() {
    const t = getTimeRemaining(reformat);
    daysSpan.innerHTML = t.days + ' D';
    hoursSpan.innerHTML = ('0' + t.hours).slice(-2) + ' H';
    minutesSpan.innerHTML = ('0' + t.minutes).slice(-2) + ' M';
    //secondsSpan.innerHTML = ('0' + t.seconds).slice(-2);
    if (t.total <= 0) {
      $(`#${id}`).empty();
      $(`#${id}`).append('PAST DUE');
      // add an 'overdue' property to the object when/if it is overdue
      task.overdue = true;
      // re-color the task as soon it's overdue (unless it's complete already)
      if (!task.complete){
        $(`#taskRow${task.id}`).removeClass("table-warning");
        $(`#taskRow${task.id}`).addClass("bg-danger");
        $(`#cardText${task.id}`).css("background-color","#ffd3d3");
        $(`#cardBody${task.id}`).css("background-color","#b97b7b");
      }
      //clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 15000);
}