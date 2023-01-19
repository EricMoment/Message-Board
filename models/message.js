const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  timestamp: {type: Date, required: true},
  content: {type: String, required: true},
  message_user: {type: Schema.Types.ObjectId, ref: 'User'}
})

/* expires: second, not millisecond */

module.exports = mongoose.model('Message', MessageSchema)