const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema(
  {
    username: {type: String, required: true, maxLength: 100},
    password: {type: String, required: true, max: 100, min: 6},
    user_messages: [{type: Schema.Types.ObjectId, ref: 'Message'}],
  }
)

UserSchema.virtual('url').get(function() {
  return `/user/${this._id}`
})

module.exports = mongoose.model('User', UserSchema)