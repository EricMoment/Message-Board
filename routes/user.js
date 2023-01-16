var express = require('express');
var router = express.Router();
const { body, validationResult } = require("express-validator");
const User = require('../models/user')
const passport = require("../passport");
const bcrypt = require("bcryptjs");

/* GET users listing. */
router.get('/sign-up', function(req, res, next) {
  if (req.user) {
    console.log(req.user);
    return res.redirect('/')
  }
  res.json("Sign Up")
});

router.post("/sign-up", [
  body("username", "Username required").trim().isLength({ min: 1, max: 20}).escape(),
  body("password", "Password required").trim().isLength({ min: 6 }).escape(),
  body("confirm-password", "Confirm Password required").trim().isLength({ min: 6 }).escape()
  .custom((value, { req }) => value === req.body.password),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) { return res.json({title: 'Sign Up', errors: errors.array()}) }
    User.findOne({username: req.body.username}).exec((err, user) => {
      if (err) return next(err)
      if (user) {
        return res.json({error: 'Username exists'})
      } else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          if (err) { return next(err) }
          new User({
            username: req.body.username,
            password: hashedPassword,
          }).save(err => {
            if (err) { return next(err) }
            res.redirect("/");
          });
        });
      }
    });
  }
]);
router.get("/log-in", (req, res, next) => {
    if (req.user) {
      console.log(req.user);
      return res.redirect('/')
    }
    res.json("Log In")
  }
);
router.post("/log-in",
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/user/log-in"
  })
);
router.get("/log-out", (req, res, next) => {
  req.logout(function (err) {
    if (err) { return next(err) }
    res.redirect("/");
  });
});

module.exports = router;
