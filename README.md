# ThoughtSphere - A Social Media Application

ThoughtSphere is a social media platform where users can share thoughts, upload images, interact with friends, and manage personal profiles. This project is built using Node.js, Express, PostgreSQL, and Pug.

Features: 
- User Authentication: Sign up, log in, and log out securely.
- Profile Customization: Users can update their profile images and background themes.
- Thought Threads: Users can post their thoughts and view others’ thoughts in a thread format.
- Friend Management: Add friends, view their profiles, and interact with their posts.
- Responsive Design: Fully functional across different screen sizes.

Project Setup: 
1. Clone the repository: 
  - $ git clone git@github.com:SandyLlapa/ThoughtSphere.git
  - $ cd ThoughtSphere

2. Intall Dependencies: 
  - npm install express body-parser express-session pg bcrypt



Database Setup: 
1. Create a PostgreSQL Database
  - Open your PostgreSQL client (e.g., psql).

2. Create a database named thoughtsphere:
  - Open your PostgreSQL client (e.g., psql).
    - Create a database named thoughtsphere

3. Create the required tables using the schema below: 

    CREATE TABLE IF NOT EXISTS users (
        username VARCHAR(255) PRIMARY KEY,           -- Unique username as the primary key
        password VARCHAR(255) NOT NULL,              -- Password field
        profile_image VARCHAR(255) DEFAULT '/images/default_profile.png', -- Profile image with default value
        background TEXT DEFAULT 'linear-gradient(rgb(55, 218, 255), rgba(207, 120, 237, 0.909))' -- Background with default value
    );

    CREATE TABLE IF NOT EXISTS thoughts (
        thought_id SERIAL PRIMARY KEY,               -- Unique ID for each thought
        username VARCHAR(255) NOT NULL,              -- Foreign key referencing 'users' table
        thought TEXT NOT NULL,                       -- Thought text
        created_at TIMESTAMP DEFAULT NOW(),          -- Timestamp for creation
        CONSTRAINT fk_username FOREIGN KEY (username) REFERENCES users(username) ON DELETE CASCADE -- Cascade delete with user
    );

    CREATE TABLE IF NOT EXISTS about_me (
        id SERIAL PRIMARY KEY,                       -- Unique ID
        username VARCHAR(255) UNIQUE NOT NULL,       -- Foreign key referencing 'users', must be unique
        name VARCHAR(255) NOT NULL,                  -- Name
        location VARCHAR(255) NOT NULL,              -- Location
        birthday DATE NOT NULL,                      -- Birthday
        hobby VARCHAR(255)                           -- Hobby
    );

    CREATE TABLE IF NOT EXISTS friends (
        id SERIAL PRIMARY KEY,                       -- Unique ID
        user_username VARCHAR(255) NOT NULL,         -- User's username
        friend_username VARCHAR(255) NOT NULL,       -- Friend's username
        UNIQUE (user_username, friend_username),     -- Prevent duplicate friendships
        CONSTRAINT fk_user FOREIGN KEY (user_username) REFERENCES users(username) ON DELETE CASCADE, -- Cascade delete
        CONSTRAINT fk_friend FOREIGN KEY (friend_username) REFERENCES users(username) ON DELETE CASCADE -- Cascade delete
    );

4. Update the database credentials in server.js


Running the Application:
1. Start the server
    $ npm start

  The server will start on http://localhost:4131

2. Access the Application
  Open your browser and navigate to: http://localhost:4131/login.html
  This will take you to the Login page

