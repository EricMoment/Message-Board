var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require('../models/user')
const passport = require("../passport");
const bcrypt = require("bcryptjs");

/* GET users listing. */
router.get('/sign-up', function(req, res, next) {
  //if (req.user) {
  //  return res.status(400).json({error: '(sign-up) User already logged in!'})
  //}
  res.status(200).json('Signing Up!')
});

router.post("/sign-up", [
  body("username", "Username needs 3 letters").trim().isLength({ min: 3, max: 20}).escape()
  .custom((value) => value !== 'Guest' && value !== 'guest').withMessage('Username cannot be Guest.'),
  body("password", "Password needs 6 letters").trim().isLength({ min: 6 }).escape(),
  body("confirmPassword", "Confirm Password needs 6 letters").trim().isLength({ min: 6 }).escape()
  .custom((value, { req }) => value === req.body.password).withMessage('Confirm Password does not match :('),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() })
    User.findOne({username: req.body.username}).exec((err, user) => {
      if (user) return res.status(400).json({ error: 'Username exists' })
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return res.status(400).json({ error: 'Error while saving password' }) }
        new User({
          username: req.body.username,
          password: hashedPassword,
        }).save(
          res.status(200).json({ message: 'User is successfully saved :3' })
        );
      });
      
    });
  }
]);
router.get("/log-in", (req, res, next) => {
    if (req.user) {
      return res.status(400).json({error: '(log-in) User already logged in!'})
    }
    res.status(200).json({message: 'logging in!'})
  }
);

router.post("/log-in",
  passport.authenticate('local'), 
  function(req, res) {
    res.status(200).json({username: req.user.username, userMessages: req.user.user_messages});
  }
);
router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return res.status(400).json('Error while logging out') }
    res.status(200).json('Successfully logged out');
  });
});

module.exports = router;
