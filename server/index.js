require('dotenv').config();
const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env;

const app = express();

// CONTROLLERS
const ac = require('./controllers/authController');

// MIDDLEWARE
app.use(bodyParser.json())
app.use(session({
    secret: SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24
    }
}))

// CONNECTION TO DB
massive(CONNECTION_STRING).then(db => {
    app.set(db, 'db')
    console.log(`db is live`)
    app.listen(SERVER_PORT, () => console.log(`Port ${SERVER_PORT} reporting for booty!`))
})

// ENDPOINTS
app.post('/auth/register', ac.register)