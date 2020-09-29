const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  apiId: {
    type: mongoose.Types.ObjectId,
    unique: true,
  },
  chatId: {
    type: String,
    required: true,
    unique: true,
  },
  state: {
    type: String,
    enum: ['Inactive', 'WaitingToken', 'Loggedin', 'Activated'],
    default: 'Inactive',
  },
  name: {
    type: String,
  },
  lastVisit: {
    type: Date,
    default: Date.now(),
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
