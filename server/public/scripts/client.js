console.log('client.js working!');
taskMemory = [];

$(document).ready(()=>{
  console.log('jQuery Working');
  getTasks();
  createEventHandlers();
})


function createEventHandlers(){
  $('#addTaskBtn').on('click', addTask);
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


function printList(array){
  console.log('printList will print:', array);
  $('#listDisplay').empty();
  for (let i=0; i<array.length; i++){
    $('#listDisplay').append(`
    <tr data-toggle="collapse" data-target="#collapse_id${array[i].id}" class="clickable">
      <td>${array[i].task}</td>
      <td>
        <div id="clockdiv${array[i].id}" class="clockdiv">

            <span class="days"></span>
            <span class="hours"></span>
            <span class="minutes"></span>

        </div>
      </td>
    </tr>
    <tr>
      <td colspan="2" style="padding:0;">
        <div id="collapse_id${array[i].id}" class="collapse">
          <div class="card card-body">
          ${array[i].details}
          </div>
        </div>
      </td>
    </tr>
    `)
    // initialize the countdown for each item
    initializeClock(`clockdiv${array[i].id}`, array[i].due_date);
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