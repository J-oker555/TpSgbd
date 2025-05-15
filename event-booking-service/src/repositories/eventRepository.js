const pool = require('../config/db');

const findAll = async () => {
  const [rows] = await pool.query('SELECT * FROM events WHERE isCancelled = FALSE AND availableSeats > 0 ORDER BY dateTime ASC');
  return rows;
};

const findById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM events WHERE id = ? AND isCancelled = FALSE', [id]);
  return rows[0]; // Retourne l'événement ou undefined
};

// Pour les admins
const adminFindAll = async () => {
  const [rows] = await pool.query('SELECT * FROM events ORDER BY dateTime ASC');
  return rows;
};

const adminFindById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM events WHERE id = ?', [id]);
    return rows[0];
};

const create = async (eventData) => {
  const { name, description, dateTime, totalCapacity, availableSeats, price } = eventData;
  const [result] = await pool.execute(
    'INSERT INTO events (name, description, dateTime, totalCapacity, availableSeats, price) VALUES (?, ?, ?, ?, ?, ?)',
    [name, description, dateTime, totalCapacity, availableSeats, price]
  );
  return { id: result.insertId, ...eventData };
};

const update = async (id, eventData) => {
  // Construire dynamiquement la requête UPDATE pour ne mettre à jour que les champs fournis
  const fields = [];
  const values = [];
  for (const [key, value] of Object.entries(eventData)) {
    if (value !== undefined) { // Ne pas mettre à jour si la valeur est undefined
      fields.push(`${key} = ?`);
      values.push(value);
    }
  }
  if (fields.length === 0) {
    return findById(id); // Pas de champs à mettre à jour, retourne l'événement actuel
  }
  values.push(id); // Ajouter l'id pour la clause WHERE
  const sql = `UPDATE events SET ${fields.join(', ')} WHERE id = ?`;
  const [result] = await pool.execute(sql, values);
  return result.affectedRows > 0 ? findById(id) : null;
};

const remove = async (id) => {
  // On pourrait préférer une suppression logique (isCancelled = TRUE)
  // Pour ce TP, une suppression physique est ok pour l'admin
  const [result] = await pool.execute('DELETE FROM events WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

// Méthode critique pour les réservations, doit être transactionnelle
const decreaseAvailability = async (eventId, quantity, connection) => {
  const conn = connection || pool; // Utiliser la connexion transactionnelle si fournie
  const [result] = await conn.execute(
    'UPDATE events SET availableSeats = availableSeats - ? WHERE id = ? AND availableSeats >= ?',
    [quantity, eventId, quantity]
  );
  return result.affectedRows > 0; // True si la mise à jour a réussi (assez de places)
};

module.exports = {
  findAll,
  findById,
  adminFindAll,
  adminFindById,
  create,
  update,
  remove,
  decreaseAvailability,
};