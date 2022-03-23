const { Schema, model } = require('mongoose');

const locationSchema = new Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: String,
  location: {
    type: locationSchema,
    required: true,
  },
  gender: {
    type: String,
    enum: ['M', 'F'],
  },
  interests: {
    type: [String],
    enum: ['Basketball', 'Cricket', 'Football', 'Cycling'],
  },
});

module.exports = model('User', userSchema);
