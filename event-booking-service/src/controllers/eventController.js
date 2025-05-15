const eventRepository = require('../repositories/eventRepository');

// Pour les clients
const getAvailableEvents = async (req, res, next) => {
  try {
    const events = await eventRepository.findAll();
    res.json(events);
  } catch (error) {
    next(error); 
  }
};

const getEventById = async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id, 10);
    if (isNaN(eventId)) {
        return res.status(400).json({ message: "Invalid event ID format."});
    }
    const event = await eventRepository.findById(eventId);
    if (event) {
      res.json(event);
    } else {
      res.status(404).json({ message: 'Event not found or not available.' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAvailableEvents,
  getEventById,
};