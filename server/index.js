require('dotenv').config();
const ac = require('./controllers/authController')
const tc = require('./controllers/treasureController')
const auth = require('./middleware/authMIddleware')

const express = require('express');
const session = require('express-session');
const massive = require('massive');
const bodyParser = require('body-parser');
const { CONNECTION_STRING, SESSION_SECRET, SERVER_PORT } = process.env;

const app = express();

app.use(bodyParser.json())

app.use(session({
   secret: SESSION_SECRET,
   resave: false,
   saveUninitialized: false,
   cookie: {
       maxAge: 1000000000000
   }
}))

massive(CONNECTION_STRING).then(db => {
   app.set('db', db)
   console.log('db is live')

   app.listen(SERVER_PORT, () => {
       console.log(`${SERVER_PORT} reporting for booty!`)
   })
}).catch(err => console.log(err) );

// AUTH ENDPOINTS
app.post('/auth/register', ac.register)
app.post('/auth/login', ac.login)
app.get('/auth/logout', ac.logout)

// TREASURE ENPOINTS
app.get('/api/treasure/dragon', tc.dragonTreasure)
app.get('/api/treasure/user', auth.usersOnly, tc.getUserTreasure)
app.post('/api/treasure/user', auth.usersOnly, tc.addUserTreasure)