const { Schema, model, SchemaTypes } = require('mongoose');

const eventSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  time: {
    type: Date,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['Basketball', 'Cycling', 'Cricket', 'Football'],
    required: true,
  },
  maxJoinees: {
    type: Number,
    required: true,
    min: 1,
  },
  createdBy: {
    type: SchemaTypes.ObjectId,
    ref: 'User',
    required: true,
  },
  joinees: {
    type: [SchemaTypes.ObjectId],
    ref: 'User',
    required: true,
  },
});

eventSchema.pre('save', function (next) {
  this.joinees.push(this.createdBy);
  next();
});

module.exports = model('Event', eventSchema);
