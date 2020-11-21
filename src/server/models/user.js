const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const Schema = mongoose.Schema

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      maxlength: 20,
      unique: true
    },
    password: { type: String, required: true, trim: true }
  },
  {
    timestamps: true
  }
)

UserSchema.statics.findByLogin = async function(username, callback) {
  if (!callback) {
    return await this.findOne({ username })
  }
  
  let user;
  try {
    user = await this.findOne({ username })
  } catch (error) {
    callback(error)
  }
  callback(null, user)
}

UserSchema.statics.validate = async function(password) {
  const user = this
  const match = await bcrypt.compare(password, user.password)

  return match
}

const UserModel = mongoose.model('User', UserSchema)
exports.UserModel = UserModel