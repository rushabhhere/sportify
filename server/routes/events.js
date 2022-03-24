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

    res
      .status(201)
      .json({ status: 'ok', message: 'event created', data: event });
  } catch (err) {
    console.error(JSON.stringify(err));
    res.status(500).json({ status: 'error', error: err.message });
  }
});

router.patch('/add-joinee/:event_id', async (req, res) => {
  const { event_id } = req.params;
  const { user_id } = req.body;

  const event = await Event.updateOne(
    { _id: event_id },
    { $addToSet: { joinees: user_id } }
  );

  res.json({ status: 'ok', message: 'added one user' });
});

router.patch('/delete-joinee/:event_id', async (req, res) => {
  const { event_id } = req.params;
  const { user_id } = req.body;

  const event = await Event.updateOne(
    { _id: event_id },
    { $pull: { joinees: user_id } }
  );

  res.json({ status: 'ok', message: 'deleted one user' });
});

module.exports = router;
