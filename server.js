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



app.get('/signup', function (req, res) {
  console.log('GET /signup triggered');

  if (req.session && req.session.loggedIn) {
    console.log('User is logged in, redirecting to /profile');
    res.redirect('/profile'); // Redirect to the profile if already logged in
  } else {
    console.log('User is not logged in, serving signup.html');
    res.sendFile('signup.html', { root: 'static/html' }); // Serve the static signup.html file
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


app.get('/home.html', function (req, res) {
  if (req.session && req.session.loggedIn) {
    // Serve the home.html file directly
    res.sendFile('home.html', { root: 'static/html' });
  } else {
    res.redirect('/login.html');
  }
});




app.post('/add-thought', function (req, res) {
  if (req.session && req.session.loggedIn) {
    const postData = req.body;
    const username = req.session.username;
    console.log("THOUGHT ENTRY: ", req.body.thought);
    console.log("POST ADD-THOUGHT");


    const query = 'INSERT INTO thoughts (username,thought) VALUES($1,$2)';
    connection.query(query, [username, postData.thought], function (err, result) {
      if (err) {
        throw err;
      }
      else {
        console.log("Values inserted");
        res.redirect(302, '/profile');
      }
    });
  }
});


// show table contents  -> GET
app.get('/thoughts', function (req, res) {
  const username = req.query.username || req.session.username; // Use query parameter or fallback to session

  if (!username) {
    return res.status(400).send('Username is required');
  }

  const query = `
    SELECT thought, created_at
    FROM thoughts
    WHERE username = $1
    ORDER BY created_at DESC;
  `;

  connection.query(query, [username], function (err, results) {
    if (err) {
      console.error('Error fetching thoughts:', err);
      return res.status(500).send('Error fetching thoughts');
    }

    res.json(results.rows);
  });
});





app.get('/profile', (req, res) => {
  if (req.session && req.session.loggedIn) {
    const username = req.session.username;
    console.log("HELLO");
    // console.log("USER COLOR: ", users.background);
    console.log("BYE");

    const query = `
      SELECT users.profile_image, about_me.name, about_me.location, about_me.birthday, about_me.hobby, users.background
      FROM users
      LEFT JOIN about_me ON users.username = about_me.username
      WHERE users.username = $1;
    `;
    connection.query(query, [username], (err, result) => {
      if (err) {
        console.error('Error fetching profile data:', err);
        return res.status(500).send('Failed to load profile');
      }

      const profileData = result.rows[0] || {};
      const profileImage = profileData.profile_image || '/uploads/default-profile.png';
      const profileBackground = profileData.background || 'linear-gradient(rgb(55, 218, 255), rgba(207, 120, 237, 0.909))';
      console.log("PROFILE BACKGROUND: ", profileBackground);

      

      const birthday = profileData.birthday
        ? new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(new Date(profileData.birthday))
        : '';

      res.render('profile', {
        username,
        profileImage,
        profileBackground,
        aboutMe: {
          name: profileData.name || '',
          location: profileData.location || '',
          birthday: birthday || '',
          hobby: profileData.hobby || '',
        },
      });
    });
  } else {
    res.redirect('/login.html');
  }
});



app.post('/saveAboutMe', (req, res) => {
  const username = req.session.username;
  var { name, location, birthday, hobby } = req.body;

  

  const query = `
    INSERT INTO about_me (username, name, location, birthday, hobby)
    VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (username)
    DO UPDATE SET
      name = EXCLUDED.name,
      location = EXCLUDED.location,
      birthday = EXCLUDED.birthday,
      hobby = EXCLUDED.hobby
  `;

  connection.query(query, [username, name, location, birthday, hobby], (err) => {
    if (err) {
      console.error('Error saving About Me:', err);
      return res.status(500).send('Failed to save About Me information');
    }

    res.redirect('/profile'); // Redirect to profile to reflect changes
  });
});


app.post('/saveBackgroundColor', (req, res) => {
  const username = req.session.username;
  const { background } = req.body;

  console.log("BACKGROUND BODY: ", background);

  const query = `
    UPDATE users
    SET background = $1
    WHERE username = $2
  `;
  connection.query(query, [background, username], (err) => {
    if (err) {
      console.error('Error saving background color:', err);
      res.status(500).send('Error saving background color');
    } else {
      res.redirect('/profile');
    }
  });
});



app.get('/getAboutMe', (req, res) => {
  const username = req.session.username; // Assuming you store the logged-in user's ID in the session
  const query = `SELECT * FROM about_me WHERE username = $1`;
  connection.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error fetching About Me:', err);
      res.status(500).send('Error fetching About Me data');
    } else {
      res.status(200).json(result.rows);
      res.redirect('/profile');

    }
  });
});


app.get('/customize', (req, res) => {
  if (req.session && req.session.loggedIn) {
    const username = req.session.username;

    const query = `
      SELECT users.background, about_me.name, about_me.location, about_me.birthday, about_me.hobby
      FROM users
      LEFT JOIN about_me ON users.username = about_me.username
      WHERE users.username = $1;
    `;

    connection.query(query, [username], (err, result) => {
      if (err) {
        console.error('Error fetching customization data:', err);
        return res.status(500).send('Failed to load customization page');
      }

      const customizationData = result.rows[0] || {
        background: 'linear-gradient(rgb(55, 218, 255), rgba(207, 120, 237, 0.909))',
        name: '',
        location: '',
        birthday: '',
        hobby: '',
      };

      if (customizationData.birthday) {
        customizationData.birthday = new Date(customizationData.birthday).toISOString().split('T')[0];
      }

      res.render('customize', {
        username,
        customizationData,
      });
    });
  } else {
    res.redirect('/login.html');
  }
});

app.get('/search', (req, res) => {
  if (!req.session || !req.session.loggedIn) {
    return res.redirect('/login.html');
  }

  const username = req.query.username;

  console.log("USERNAME SEARCHED FOR: ",username);



  const query = `SELECT username FROM users WHERE username = $1`;
  connection.query(query, [username], (err, result) => {
    if (err) {
      console.error('Error searching for user:', err);
      return res.status(500).send('Error searching for user');
    }

    if (result.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    // Redirect to the friend's profile
    res.redirect(`/profile/${username}`);
  });
});


app.get('/profile/:username', (req, res) => {
  if (!req.session || !req.session.loggedIn) {
    return res.redirect('/login.html');
  }

  const loggedInUsername = req.session.username; // The logged-in user's username
  const profileUsername = req.params.username; // The friend's username from the route parameter

  console.log("Logged-in username: ", loggedInUsername);
  console.log("Profile being viewed: ", profileUsername);

  // Query to get profile information
  const profileQuery = `
    SELECT profile_image, name, location, birthday, hobby, background
    FROM users
    LEFT JOIN about_me ON users.username = about_me.username
    WHERE users.username = $1;
  `;

  // Query to get thoughts of the friend being viewed
  const thoughtsQuery = `
    SELECT thought, created_at
    FROM thoughts
    WHERE username = $1
    ORDER BY created_at DESC;
  `;

  // Fetch profile data
  connection.query(profileQuery, [profileUsername], (err, profileResult) => {
    if (err) {
      console.error('Error fetching user profile:', err);
      return res.status(500).send('Error loading user profile');
    }

    if (profileResult.rows.length === 0) {
      return res.status(404).send('User not found');
    }

    const profileData = profileResult.rows[0]; // Friend's profile data

    // Fetch the thoughts for the friend's profile
    connection.query(thoughtsQuery, [profileUsername], (err, thoughtsResult) => {
      if (err) {
        console.error('Error fetching user thoughts:', err);
        return res.status(500).send('Error loading user thoughts');
      }

      // Format the thoughts with readable dates
      const thoughts = thoughtsResult.rows.map(thought => ({
        ...thought,
        formattedDate: new Date(thought.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        }),
      }));

      console.log("Thoughts fetched: ", thoughts);

      // Render the profile page with the friend's data and thoughts
      res.render('profile', {
        username: profileUsername, // Friend's username
        profileImage: profileData.profile_image || '/uploads/default-profile.png',
        profileBackground: profileData.background || 'linear-gradient(rgb(55, 218, 255), rgba(207, 120, 237, 0.909))',
        aboutMe: {
          name: profileData.name || '',
          location: profileData.location || '',
          birthday: profileData.birthday || '',
          hobby: profileData.hobby || '',
        },
        thoughts, // Pass the friend's thoughts
        isFriendProfile: loggedInUsername !== profileUsername, // Check if the current user is viewing someone else's profile
      });
    });
  });
});






app.post('/add-friend/:friendUsername', (req, res) => {
  if (!req.session || !req.session.loggedIn) {
    return res.redirect('/login.html');
  }

  const userUsername = req.session.username; // The logged-in user's username
  const friendUsername = req.params.friendUsername; // The friend's username from the route parameter

  if (userUsername === friendUsername) {
    return res.status(400).send('You cannot add yourself as a friend');
  }

  const query = `
    INSERT INTO friends (user_username, friend_username)
    VALUES ($1, $2)
    ON CONFLICT DO NOTHING; -- Avoid duplicate entries
  `;

  connection.query(query, [userUsername, friendUsername], (err) => {
    if (err) {
      console.error('Error adding friend:', err);
      return res.status(500).send('Error adding friend');
    }

    // Redirect to the friend's profile after adding them
    res.redirect(`/profile/${friendUsername}`);
  });
});




app.post('/uploadImage', (req, res) => {
  console.log("POST /uploadImage triggered");
  if (req.session && req.session.loggedIn) {
    const username = req.session.username;
    const imageLink = req.body.imageLink;

    // Save the image URL in the database
    const query = 'UPDATE users SET profile_image = $1 WHERE username = $2';
    connection.query(query, [imageLink, username], (err) => {
      if (err) {
        console.error('Error saving profile image URL:', err);
        return res.status(500).send('Failed to save profile image');
      }
      console.log('Profile image URL updated successfully');
      res.redirect('/profile');
    });
  } else {
    res.status(401).send('Unauthorized');
  }
});