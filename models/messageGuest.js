const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MessageGuestSchema = new Schema({
  timestamp: {type: Date, required: true, expires: 1800},
  content: {type: String, required: true}
})
/* expires: second, not millisecond */
/* You can't just change the expiry time. You have to
delete the folder in MongoDB to apply the change */

module.exports = mongoose.model('MessageGuest', MessageGuestSchema)