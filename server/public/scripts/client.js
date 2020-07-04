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
        <div id="clockdiv${array[i].id}"></div>
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


function getTimeRemaining(endtime){
  const total = Date.parse(endtime) - Date.parse(new Date());
  const seconds = Math.floor( (total/1000) % 60 );
  const minutes = Math.floor( (total/1000/60) % 60 );
  const hours = Math.floor( (total/(1000*60*60)) % 24 );
  const days = Math.floor( total/(1000*60*60*24) );
  return {
    total,
    days,
    hours,
    minutes,
    seconds
  };
}


function initializeClock(id, endtime) {
  let reformat = endtime.substring(0,10) + ' ' + endtime.substring(11,19)
  console.log(reformat)
  const clock = document.getElementById(id);
  const timeinterval = setInterval(() => {
    const t = getTimeRemaining(reformat);
    clock.innerHTML = 'days: ' + t.days + '<br>' +
                      'hours: '+ t.hours + '<br>' +
                      'minutes: ' + t.minutes + '<br>' +
                      'seconds: ' + t.seconds;
    if (t.total <= 0) {
      clearInterval(timeinterval);
      $(`#${id}`).empty();
      $(`#${id}`).append('PAST DUE');
    }
  },1000);
}

console.log(Date.parse('2020-07-03 20:36:00') - Date.parse(new Date()));