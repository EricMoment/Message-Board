const express = require('express');
const router = express.Router();
const Message = require('../models/message')
const MessageGuest = require('../models/messageGuest')
const User = require('../models/user');
const { body, validationResult } = require("express-validator");

/* GET home page. */
//.sort([['timestamp', 'ascending']])
router.get('/', async function(req, res) {
  const messages = await Message.find().populate('message_user')
  const guestMessages = await MessageGuest.find()
  res.status(200).json([...messages, ...guestMessages]);
});

/* POST new message to DB */
router.post('/new-message', [
  body("content", "Content required").trim().isLength({ min: 1 }),
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty) return res.status(400).json({ error: errors.array() })
    let time = Date.now()
    if (req.body.message_userid === undefined) {
      const newMessageGuest = new MessageGuest({
        timestamp: time,
        content: req.body.content,
      })
      newMessageGuest.save((err) => {
        if (err) return res.status(400).json({ error: "Error saving new message." })
        return res.status(200).json(`${req.body.message_username} posted a message.`)
      });
    } else {
      const newMessage = new Message({
        timestamp: time,
        content: req.body.content,
        message_user: req.body.message_userid
      })
      User.findOneAndUpdate({ _id: req.body.message_userid }, 
        {$push: {user_messages: newMessage}}, 
        {safe: true, upsert: true}, 
        (err) => {
          if (err) return res.status(400).json({ error: "Error updating user's messages." })
          newMessage.save((err) => {
            if (err) return res.status(400).json({ error: "Error saving new message." })
            return res.status(200).json(`${req.body.message_username} posted a message.`)
          });
        }
      )
    }
  }
])

module.exports = router;
