const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageGuestSchema = new Schema({
  timestamp: {type: Date, required: true, expires: 120},
  content: {type: String, required: true}
})
/* expires: second, not millisecond */

module.exports = mongoose.model('MessageGuest', MessageGuestSchema)