const express = require('express');
const passport = require('passport');
const authRoutes = express.Router();

//Register user
authRoutes.post('/register', (req, res) => {
  console.log(req.body);
  User.findOne({ username: req.body.username }, async (err, user) => {
    if (err) throw err;
    if (user) res.send('User Exist');
    if (!user) {
      const newUser = new User({
        username: req.body.username,
        password: req.body.password, // Store password as plain text
      });
      await newUser.save();
      res.status(200).json({ user: newUser });
    }
  });
});

authRoutes.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) throw err;
    if (!user) res.status(402).json({ msg: 'Invalid username/password' });
    else {
      req.logIn(user, err => {
        if (err) throw err;
        res.status(200).json({ user });
        console.log(req.user);
      });
    }
  })(req, res, next);
});

module.exports = authRoutes;
