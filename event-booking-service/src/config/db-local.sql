-- event-booking-service/setup_local_db.sql
-- A exécuter manuellement sur ta base de données locale (ex: ticketing_db_local)

-- USE ticketing_db_local; -- Décommente si ton client SQL ne sélectionne pas la DB automatiquement

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dateTime DATETIME NOT NULL,
    totalCapacity INT NOT NULL,
    availableSeats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    isCancelled BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    userName VARCHAR(255) NOT NULL,
    numberOfSeats INT NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED',
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE,
    INDEX idx_booking_event (eventId)
) ENGINE=InnoDB;

-- Supprimer les anciennes données pour éviter les doublons lors de ré-exécutions
DELETE FROM bookings;
DELETE FROM events;

-- Réinitialiser l'auto-incrémentation (optionnel, utile pour des tests propres)
ALTER TABLE events AUTO_INCREMENT = 1;
ALTER TABLE bookings AUTO_INCREMENT = 1;


-- Données initiales pour les tests
INSERT INTO events (name, description, dateTime, totalCapacity, availableSeats, price)
VALUES
    ('Concert Local Rock', 'Un super groupe local en live.', '2024-12-15 20:00:00', 100, 100, 25.00),
    ('Atelier de Poterie', 'Apprenez à créer vos propres poteries.', '2024-11-30 14:00:00', 10, 8, 45.00),
    ('Marché de Noël Artisanal', 'Trouvez des cadeaux uniques et locaux.', '2024-12-01 10:00:00', 1000, 1000, 0.00);