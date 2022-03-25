const { Schema, model, SchemaTypes } = require('mongoose');
const locationMap = require('../utils/locationMap');

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
  locationCoords: {
    type: locationSchema,
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
  let coordinates;
  locationMap.forEach(location => {
    if (location.place === this.location) {
      coordinates = location.coords;
    }
  });
  console.log(coordinates);
  this.locationCoords = {
    type: 'Point',
    coordinates,
  };
  next();
});

module.exports = model('Event', eventSchema);
