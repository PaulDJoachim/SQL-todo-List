console.log('client.js working!');
taskMemory = [];

$(document).ready(()=>{
  console.log('jQuery Working');
  getTasks();
})


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


function printList(array){
  console.log('printList will print:', array);
  for (let i=0; i<array.length; i++){
    $('#listDisplay').append(`
    <tr data-toggle="collapse" data-target="#collapse_id${array[i].id}" class="clickable">
      <td>${array[i].task}</td>
      <td>${array[i].due_date}</td>
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
  }
}

// tr data-toggle="collapse" data-target="#accordion" class="clickable">
//             <td>Some Stuff</td>
//             <td>Some more stuff</td>
//             <td>And some more</td>
//         </tr>
//         <tr>
//             <td colspan="3">
//                 <div id="accordion" class="collapse">Hidden by default</div>
//             </td>
//         </tr>