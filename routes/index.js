var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  if (!req.user) {
    res.status(200).json({username: 'Guest', userMessages: []})
    return
  }
  res.status(200).json({username: req.user.username, userMessages: req.user.user_messages});
});

module.exports = router;
