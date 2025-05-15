const eventRepository = require('../repositories/eventRepository');
const bookingRepository = require('../repositories/bookingRepository');

const isAdmin = (req, res, next) => {
    if (req.headers['x-admin-key'] === 'SUPER_SECRET_ADMIN_KEY' || req.query.admin === 'true') {
        next();
    } else {
        res.status(403).json({ message: 'Forbidden: Admin access required.' });
    }
};

// --- Event Management ---
const createEvent = async (req, res, next) => {
    try {
        const eventData = req.body;
        if (!eventData.name || !eventData.dateTime || !eventData.totalCapacity || !eventData.price) {
            return res.status(400).json({ message: 'Missing required event fields.' });
        }
        eventData.availableSeats = eventData.availableSeats !== undefined ? eventData.availableSeats : eventData.totalCapacity;
        const newEvent = await eventRepository.create(eventData);
        res.status(201).json(newEvent);
    } catch (error) {
        next(error);
    }
};

const getAllEventsAdmin = async (req, res, next) => {
    try {
        const events = await eventRepository.adminFindAll();
        res.json(events);
    } catch (error) {
        next(error);
    }
};

const getEventByIdAdmin = async (req, res, next) => {
    try {
        const eventId = parseInt(req.params.id, 10);
        if (isNaN(eventId)) return res.status(400).json({ message: "Invalid event ID."});
        const event = await eventRepository.adminFindById(eventId);
        if (event) {
            res.json(event);
        } else {
            res.status(404).json({ message: 'Event not found.' });
        }
    } catch (error) {
        next(error);
    }
};

const updateEvent = async (req, res, next) => {
    try {
        const eventId = parseInt(req.params.id, 10);
        if (isNaN(eventId)) return res.status(400).json({ message: "Invalid event ID."});
        const eventData = req.body;
        const updatedEvent = await eventRepository.update(eventId, eventData);
        if (updatedEvent) {
            res.json(updatedEvent);
        } else {
            res.status(404).json({ message: 'Event not found or update failed.' });
        }
    } catch (error) {
        next(error);
    }
};

const deleteEvent = async (req, res, next) => {
    try {
        const eventId = parseInt(req.params.id, 10);
        if (isNaN(eventId)) return res.status(400).json({ message: "Invalid event ID."});
        const success = await eventRepository.remove(eventId);
        if (success) {
            res.status(204).send(); // No Content
        } else {
            res.status(404).json({ message: 'Event not found.' });
        }
    } catch (error) {
        next(error);
    }
};

// --- Booking Management (Admin) ---
const getAllBookingsAdmin = async (req, res, next) => {
    try {
        const bookings = await bookingRepository.adminFindAll();
        res.json(bookings);
    } catch (error) {
        next(error);
    }
};


module.exports = {
    isAdmin, // Exporter le middleware
    createEvent,
    getAllEventsAdmin,
    getEventByIdAdmin,
    updateEvent,
    deleteEvent,
    getAllBookingsAdmin
};