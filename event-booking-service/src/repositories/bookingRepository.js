const pool = require('../config/db');

const create = async (bookingData, connection) => {
  const conn = connection || pool; 
  const { eventId, userName, numberOfSeats, totalPrice, status } = bookingData;
  const [result] = await conn.execute(
    'INSERT INTO bookings (eventId, userName, numberOfSeats, totalPrice, status) VALUES (?, ?, ?, ?, ?)',
    [eventId, userName, numberOfSeats, totalPrice, status || 'CONFIRMED']
  );
  return { id: result.insertId, ...bookingData, status: status || 'CONFIRMED' };
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return rows[0];
};

const findByEventId = async (eventId) => {
  const [rows] = await pool.query('SELECT b.*, e.name as eventName FROM bookings b JOIN events e ON b.eventId = e.id WHERE b.eventId = ? ORDER BY b.createdAt DESC', [eventId]);
  return rows;
};

const findByUserName = async (userName) => {
  const [rows] = await pool.query('SELECT b.*, e.name as eventName FROM bookings b JOIN events e ON b.eventId = e.id WHERE b.userName = ? ORDER BY b.createdAt DESC', [userName]);
  return rows;
};

const adminFindAll = async () => {
    const [rows] = await pool.query(
      'SELECT b.id as bookingId, b.userName, b.numberOfSeats, b.totalPrice, b.status, b.createdAt as bookingCreatedAt, ' +
      'e.id as eventId, e.name as eventName, e.dateTime as eventDateTime ' +
      'FROM bookings b ' +
      'JOIN events e ON b.eventId = e.id ' +
      'ORDER BY b.createdAt DESC'
    );
    return rows;
};

module.exports = {
  create,
  findById,
  findByEventId,
  findByUserName,
  adminFindAll,
};