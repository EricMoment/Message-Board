const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require('../models/user')
const passport = require("../passport");
const bcrypt = require("bcryptjs");

router.post("/sign-up", [
  body("username", "Username needs 3 letters").trim().isLength({ min: 3, max: 20}).escape().
  custom((value) => value !== 'Guest' && value !== 'guest').withMessage('Username cannot be Guest.'),
  body("password", "Password needs 6 letters").trim().isLength({ min: 6 }).escape(),
  body("confirmPassword", "Confirm Password needs 6 letters").trim().isLength({ min: 6 }).escape()
  .custom((value, { req }) => value === req.body.password).withMessage('Confirm Password does not match :('),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ error: errors.array() })
    User.findOne({username: req.body.username}).exec((err, user) => {
      if (user) return res.status(400).json({ error: ['Username exists'] })
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) { return res.status(400).json({ error: ['Error while saving password'] }) }
        new User({
          username: req.body.username,
          password: hashedPassword,
        }).save(
          res.status(200).json('User is successfully saved.')
        );
      });
    });
  }
]);
//post sign-up and post log-in are done.
router.post("/log-in",
  passport.authenticate('local'), 
  function(req, res) {
    //url: req.user.url, 
    res.status(200).json({userid: req.user._id, username: req.user.username, userMessages: req.user.user_messages});
  }
);
router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return res.status(400).json('Error while logging out') }
    res.status(200).json('Successfully logged out');
  });
});

router.get("/:username", async (req, res) => {
  const user = await User.findOne({username: req.params.username})
  .populate({
    path: 'user_messages',
    options: {
      limit: 50,
      sort: { timestamp: -1 }
    }
  }).select({username: 1, user_messages: 1})
  if (!user) return res.status(400).json(req.params.username + ' is not registered.')
  res.status(200).json(user);
})
module.exports = router;
