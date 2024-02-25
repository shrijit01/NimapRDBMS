const express = require('express');
const bodyParser = require('body-parser');
const connection = require('./models/db');

const app = express();
const PORT = process.env.PORT || 3000;

//view engine
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/', require('./Routes'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});