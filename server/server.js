const express = require('express');
const app = express();

const todo = require('./modules/routes.todo');

const PORT = 5000;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('server/public'));

/// ROUTES ///
app.use('/todo', todo);

/// LISTEN ///
app.listen(PORT, ()=>{
    console.log('Server up! Listening on port:', PORT);
})