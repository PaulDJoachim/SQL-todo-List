console.log('client.js working!');
taskMemory = [];

$(document).ready(()=>{
  console.log('jQuery Working');
  getTasks();
  createEventHandlers();
  taskPainter(taskMemory);
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


function finishTask(){
  console.log('in finishTask');
  // get user input and place in an object to send
  const thisTask = taskMemory[$(this).data('index') ];
  let dataToSend 
    if (!thisTask.complete) {
      dataToSend = {complete: true}
    } else {
      dataToSend = {complete: false}
    }
  // send put req to server
  $.ajax({
      type: 'PUT',
      url: '/todo/' + thisTask.id,
      data: dataToSend
  }).then((response)=>{
      console.log( 'back from PUT with:', response );
      getTasks();
  }).catch((error)=>{
      console.log(`failed to PUT at /todo:`, error );
  })
}



function printList(array){
  console.log('printList will print:', array);
  $('#listDisplay').empty();
  for (let i=0; i<array.length; i++){
    $('#listDisplay').append(`
    <tr id="taskRow${array[i].id}" data-toggle="collapse" data-target="#collapse_id${array[i].id}" class="clickable table-info font-weight-bold">
      <td>${array[i].task}</td>
      <td>
        <div id="clockdiv${array[i].id}" class="clockdiv">
            <span class="days"></span>
            <span class="hours"></span>
            <span class="minutes"></span>
        </div>
      </td>
    </tr>
    <tr id="detalsHolder">
      <td colspan="2" style="padding:0;">
        <div id="collapse_id${array[i].id}" class="collapse">
          <div id="cardBody${array[i].id}"class="card card-body py-0" style="min-height: 200px;">
            <div id="cardText${array[i].id}" class="card card-text p-2 m-2">
              ${array[i].details}
            </div>
            <div class="editBtn">
              <button type="button" data-index="${i}" class="btn btn-success font-weight-bold done">&#10003</button>
              <button type="button" data-index="${i}" class="btn btn-danger float-right font-weight-bold delete">&#9747</button>
              <!-- <button type="button" data-index="${i}" class="btn btn-danger float-right font-weight-bold mr-3" style="color: black;">Edit</button> -->
            </div>
          </div>
        </div>
      </td>
    </tr>
    `)
    // initialize the countdown for each item
    initializeClock(`clockdiv${array[i].id}`, array[i].due_date);
  }
  taskPainter(taskMemory);
}


// re-colors the tasks depending on their status
function taskPainter(array){
  console.log('in taskPainter')
  for (let item of array) {
    console.log(item.complete);
    if (item.complete === true){
      console.log($(this).data('index'))
      $(`#taskRow${item.id}`).removeClass("table-info");
      $(`#taskRow${item.id}`).addClass("bg-success");
      $(`#cardText${item.id}`).css("background-color","#c3e6cb");
      $(`#cardBody${item.id}`).css("background-color","#b6d3bc");
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
function initializeClock(id, endtime) {
  // reformat the server time into something Date.parser can actually use
  let reformat = endtime.slice(0,10) + ' ' + endtime.slice(11,19);
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
      //clearInterval(timeinterval);
    }
  }

  updateClock();
  const timeinterval = setInterval(updateClock, 15000);
}