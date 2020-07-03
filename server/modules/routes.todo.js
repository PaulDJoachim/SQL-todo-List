const express = require('express')
const pool = require('./pool')
const router = express.Router()


/// ROUTES ///
router.get('/',(req, res)=>{
  console.log('GETing list from database')
  let queryString = `SELECT * FROM "todo_list" ORDER BY id`;
  pool.query(queryString).then((result)=>{
    res.send(result.rows);
  }).catch((err)=>{
    res.sendStatus(500);
  })
})


router.post('/',(req, res)=>{
  res.send('Add a book')
})


router.put('/',(req, res)=>{
  res.send('Update the book')
})


  module.exports = router;


//   koalaRouter.get( '/', (req,res)=>{
//     console.log( 'GETing from /koala');
//     let queryString = `SELECT * FROM "koala_table" ORDER BY id`;
//     pool.query(queryString).then((result)=>{
//         res.send(result.rows);
//     }).catch((err)=>{
//         res.send(500);
//     })
// })