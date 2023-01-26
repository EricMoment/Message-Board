const express = require('express');
const router = express.Router();
const Message = require('../models/message')
const MessageGuest = require('../models/messageGuest')
const User = require('../models/user');
const { body, validationResult } = require("express-validator");

/* GET home page. */
//.sort([['timestamp', 'ascending']])
router.get('/', async function(req, res) {
  const messages = await Message.find().sort({ timestamp: -1 }).limit(50).populate('message_user')
  const guestMessages = await MessageGuest.find().sort({ timestamp: -1 }).limit(50) // -1 is tested
  res.status(200).json([...messages, ...guestMessages]);
});

/* POST new message to DB */
router.post('/new-message', [
  body("content", "Content required").trim().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) return res.status(400).json(errors)
    let time = Date.now()
    if (req.body.message_user === 'Guest' || req.body.message_userid === undefined) {
      const newMessageGuest = new MessageGuest({
        timestamp: time,
        content: req.body.content,
      })
      newMessageGuest.save((err) => {
        if (err) return res.status(400).json("Error saving new message.")
        return res.status(200).json(`${req.body.message_username} posted a message.`)
      });
    } else {
      const newMessage = new Message({
        timestamp: time,
        content: req.body.content,
        message_user: req.body.message_userid
      })
      Promise.all([User.findOneAndUpdate({ _id: req.body.message_userid }, 
        {$push: {user_messages: newMessage}}, 
        {safe: true, upsert: true}), newMessage.save()])
        .then(value => { return res.status(200).json(`${req.body.message_username} posted a message.`) })
        .catch(err => { return res.status(400).json(err)} )
    }
  }
])

router.put('/update-message', [
  body("content", "Content required").trim().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) return res.status(400).json(errors)
    Message.findOneAndUpdate({ _id: req.body.message_id },
      { content: req.body.content }, { safe: true }, 
      (err) => {
      if (err) return res.status(400).json("Error updating message.")
      return res.status(200).json("Content Updated.")
    })
  }
])

router.delete('/delete-message', (req, res) => {
  Promise.all([
    Message.findByIdAndDelete(req.body.message_id),
    User.findByIdAndUpdate(req.body.message_userid, {
      $pull: { user_messages: req.body.message_id}
    })
  ]).then(value => { return res.status(200).json(`Message Deleted.`) })
  .catch(err => { return res.status(400).json(err)} )
})
module.exports = router;
