const Event = require('../models/Event');
const { Router } = require('express');

const router = Router();

router.get('/', async (req, res) => {
  const events = await Event.find().populate('createdBy');
  res.status(200).json(events);
});

router.post('/', async (req, res) => {
  const { title, time, location, maxJoinees, type, createdBy } = req.body;

  try {
    const event = await Event.create({
      title,
      time,
      location,
      maxJoinees,
      type,
      createdBy,
    });

    console.log(event);

    res
      .status(201)
      .json({ status: 'ok', message: 'event created', data: event });
  } catch (err) {
    console.error(JSON.stringify(err));
    res.status(500).json({ status: 'error', error: err.message });
  }
});

module.exports = router;
