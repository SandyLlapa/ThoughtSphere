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


// Create account -> GET
app.get('/createAccount.html', function (req, res) {
  if (req.session && req.session.loggedIn) {
    res.redirect('/profile.html'); //if successful redirect to contacts page 
  } else {
    res.sendFile('createAccount.html', { root: 'static/html' }); // if not try again
  }
});

app.post('/createAccount', function (req, res) {
  const SALT_ROUNDS_COUNT = 10;
  const username = req.body.username;
  const password = req.body.password;

  // hash password to store in database 
  const hashedPassword = bcrypt.hashSync(password, SALT_ROUNDS_COUNT);
  connection.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword], function (err, results) {

    if (err) {
      console.error('Error creating account: ', err);
      console.log('body =', req.body);
      console.log('username ID =', req.body.id);
      console.log('username username =', req.body.username);
      console.log('username password =', req.body.password);

      if (err.code == '23505') {
        return res.status(409).send('Username already exists');
      }
      return res.status(500).send('Failed to create account');
    }

    // regenerate session
    req.session.regenerate((err) => {
      if (err) {
        console.error('Error in regenerating session');
        return res.status(500).send('Failed to regenerate session');
      }
      req.session.loggedIn = true;
      req.session.username = username;
      res.status(200).send('Successfully created account');
    });
  });
});



// Get route: Log out 
app.get('/logout', function (req, res) {

  if (req.session) {
    req.session.destroy(err => {
      if (err) {
        console.error("Error in destroying session: ", err);
        return res.status(500).send('Error logging out');
      }

      // Redirect to login page
      console.log("Session Destroyed");
      res.redirect('/login.html');
    });
  }
  else {
    console.log("Not logged in, cannot destroy session");
    res.redirect('/login.html');
  }
});


//get login.html route
app.get('/login.html', function (req, res) {
  if (req.session && req.session.loggedIn) {
    res.redirect('/home.html');
  }
  else {
    res.sendFile('login.html', { root: 'static/html' });
  }
});


//post login route
app.post('/login', function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  connection.query('SELECT password FROM users WHERE username = $1', [username], function (err, results) {
    if (err) {
      console.error("Error in database: ", err);
      return res.status(500).send('Error');
    }

    if (results.rows.length == 0) {
      return res.status(401).send('Invalid username');
    }

    // check if password matches 
    const passwordDB = results.rows[0].password;
    const passwordMatch = bcrypt.compareSync(password, passwordDB);

    if (!passwordMatch) {
      console.log("PASSWORD DOES NOT MATCH");
      return res.status(401).send('Invalid password');
    }

    // regenerate session
    req.session.regenerate((err) => {
      if (err) {
        return res.status(401).send('Failed to regenerate session');
      }

      req.session.loggedIn = true;
      req.session.username = username;
      res.status(200).send('Login was successful');
    });
  }
  );
});



app.post('/add-thought', function (req, res) {
  if (req.session && req.session.loggedIn) {
    const postData = req.body;
    const username = req.session.username;


    const query='INSERT INTO thoughts (username,thought) VALUES($1,$2)';
    connection.query(query, [postData.thought,username], function (err, result) {
      if (err) {
        throw err;
      }
      else {
        console.log("Values inserted");
        res.redirect(302, '/profile.html');
      }
    });
  }
});

// show table contents  -> GET
app.get('/thoughts', function (req, res) {

  if (req.session && req.session.loggedIn) {
    const username = req.session.username;

    connection.query('SELECT * FROM thoughts WHERE username=$1', [username], function (err, results) {
      if (err) throw err;

      if (results.rows.length == 0) {
        console.log("No entries in thoughts table");
        console.log(results.body);
      }
      else {

        for (var i = 0; i < results.rows.length; i++) {
          console.log(results.rows[i].id + " " + results.rows[i].status + " " + results.rows[i].todo_item + " " + results.rows[i].deadline);
        }
      }
      res.json(results.rows);
      console.log("\n" + JSON.stringify(results.rows));
    });
  }
  else {
    res.redirect('/login.html');
  }
});


