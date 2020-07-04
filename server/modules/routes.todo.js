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


router.delete( '/:id' , ( req, res )=>{
  console.log( '/todo DELETE hit:', req.params.id );
  let queryString = `DELETE FROM todo_list WHERE id=${ req.params.id };`;
  pool.query( queryString ).then( ( results )=>{
      res.sendStatus( 200 );
  }).catch( ( err )=>{
      console.log( err );
      res.sendStatus( 500 );
  })
})

  module.exports = router;