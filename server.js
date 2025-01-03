import express from 'express';
import bodyParser from 'body-parser';
import session from 'express-session';
import pkg from 'pg';
import bcrypt from 'bcrypt';
const { Pool } = pkg;



var app = express();
app.use(express.json());

var connection = new Pool({
  host: "localhost",
  user: "sandyllapa",
  password: "123",
  database: "sandyllapa",
  port: 5432
});
// server listens on port 4131 for incoming connections 
const port = 4131
app.listen(port, () => console.log('Listening on port: ' + port + '!'));

console.log("Connected to POSTGRESQL database!");


app.use(session({
  secret: 'secret',
  resave: false,
  saveUninitialized: true,
}));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', 'static/views');
app.set('view engine', 'pug');
app.use('/js', express.static('static/js'));
app.use('/css', express.static('static/css'));
app.use('/images', express.static('static/images'));

app.get('/profile.html', function (req, res) {
  if (req.session && req.session.loggedIn) { // if logged in, redirect to contacts page 
    res.sendFile('/profile.html', { root: 'static/html' });
  }
  else {
    res.redirect('/login.html');
  }
});

//get login.html route
app.get('/login.html', function (req, res) {
  if (req.session && req.session.loggedIn) {
    res.redirect('/profile.html');
  }
  else {
    res.sendFile('login.html', { root: 'static/html' });
  }
});



