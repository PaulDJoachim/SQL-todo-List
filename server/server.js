const express = require('express');
const bodyParser = require('body-parser');
const router = require('./modules/routes.todo');


const app = express();
const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

/// ROUTES ///
app.use('/todo', router);

/// LISTEN ///
app.listen(PORT, ()=>{
    console.log('Server up! Listening on port:', PORT);

})