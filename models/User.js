const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, // Unique email for each user
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    // User Image
    type: String,
  },
  isAdmin: {
    // Role of user it will be (normal or admin )
    type: Boolean,
    default: false,
  },
  history: {
    // order history
    type: Array,
    default: [],
  },
  products:[
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Products"
    }
  ]
}, {timestamps: true});

module.exports = User = mongoose.model('User', UserSchema )

