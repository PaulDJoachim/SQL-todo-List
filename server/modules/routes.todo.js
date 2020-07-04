const express = require('express')
const pool = require('./pool')
const router = express.Router()


/// ROUTES ///
router.get('/',(req, res)=>{
  console.log('GETing list from database')
  let queryString = `SELECT * FROM todo_list ORDER BY due_date ASC`;
  pool.query(queryString).then((result)=>{
    res.send(result.rows);
  }).catch((err)=>{
    console.log('error GETing from database:', err);
    res.sendStatus(500);
  })
})


router.post('/',(req, res)=>{
  console.log('POSTing to /todo', req.body);
  let queryString = `INSERT INTO todo_list
    (task, details, due_date)
    VALUES ($1, $2, $3)`;
  pool.query(queryString,
    [req.body.task, req.body.details, req.body.due_date]).then((result)=>{
      res.sendStatus(201);
    }).catch((error)=>{
      console.log('Error POSTing to DB @/todo:', error);
      res.sendStatus(500);
    })
})


router.put('/',(req, res)=>{
  res.send('Update the book')
})


  module.exports = router;


//   koalaRouter.post ( '/', (req,res)=>{
//     console.log('POSTing to /koala');
//     let queryString = `INSERT INTO "koala_table" 
//         ("name", "age", "gender", "ready_to_transfer", "notes")
//         VALUES ( $1, $2, $3, $4, $5)`;
//     pool.query(queryString,
//         [ req.body.name, req.body.age, req.body.gender, req.body.ready_to_transfer, req.body.notes]).then((result)=>{
//             res.sendStatus(201);
//         }).catch((error)=>{
//             console.log('Error on /koala POST to database:', error);
//             res.sendStatus(500);
//         })
// })
