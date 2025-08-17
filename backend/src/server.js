const express = require('express');
const session = require('express-session');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;
const sqlite3 = require('sqlite3').verbose();

// Connect to SQLite database
const db = new sqlite3.Database('./database.sqlite');

const app = express();
const port = 3000; // Or any port you prefer

app.use(session({
  secret: 'your-secret-key', // Replace with a strong secret
  resave: false,
  saveUninitialized: true,
});

app.use(passport.initialize());
app.use(passport.session());

// Create users table if it doesn't exist
db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, googleId TEXT UNIQUE, email TEXT UNIQUE, password TEXT)");
});

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  db.get('SELECT * FROM users WHERE id = ?', [id], (err, row) => {
    if (err) {
      return done(err);
    }
    done(null, row);
  });
});

// Local Strategy (for email and password)
passport.use(new LocalStrategy(
  (email, password, done) => { // Changed 'username' to 'email' for clarity
    // Find user by email in the database
  // Find user by id in your database
  const user = users.find(u => u.id === id);
  done(null, user);
});

// Google OAuth 2.0 Strategy
passport.use(new GoogleStrategy({
    clientID: '34797897511-2ejm64fd8fcfobra5r6muv87tnnbkn7d.apps.googleusercontent.com', // Replace with your Google Client ID
    clientSecret: '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', // Replace with your Google Client Secret
    callbackURL: "http://localhost:3000/auth/google/callback" // Replace with your callback URL
  },
  (accessToken, refreshToken, profile, done) => {
    // Here you would find or create a user in your database
    // based on the Google profile information
    console.log(profile);
    return done(null, profile);
  }
));

// Local Strategy (for email and password)
passport.use(new LocalStrategy(
  (username, password, done) => {
    // Here you would find a user in your database by email (username)
    // and compare the password (you should hash passwords)
    const user = users.find(u => u.email === username);
    if (!user || user.password !== password) {
      return done(null, false, { message: 'Incorrect email or password.' });
    }
    return done(null, user);
  }
));

// Routes
app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => { res.redirect('/'); });
app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => { res.redirect('/'); });
app.get('/logout', (req, res) => { req.logout(); res.redirect('/'); });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});