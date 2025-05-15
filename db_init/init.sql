-- Ce script est exécuté par le premier nœud MariaDB lors de l'initialisation.
-- La base de données ticketing_db devrait déjà être créée par les variables d'environnement.
-- Assurons-nous de l'utiliser.
USE ticketing_db;

CREATE TABLE IF NOT EXISTS events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    dateTime DATETIME NOT NULL, -- Renommé de session_date_time pour la simplicité
    totalCapacity INT NOT NULL,
    availableSeats INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    -- Pour la gestion admin
    isCancelled BOOLEAN DEFAULT FALSE,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB; -- InnoDB est requis pour Galera

CREATE TABLE IF NOT EXISTS bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eventId INT NOT NULL,
    userName VARCHAR(255) NOT NULL, -- Gardons simple, pas de table User dédiée pour l'instant
    numberOfSeats INT NOT NULL,
    totalPrice DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'CONFIRMED', -- e.g., CONFIRMED, CANCELLED
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (eventId) REFERENCES events(id) ON DELETE CASCADE, -- Si un event est supprimé, ses réservations aussi
    INDEX idx_booking_event (eventId)
) ENGINE=InnoDB;

-- Données initiales pour les tests (optionnel mais utile)
INSERT INTO events (name, description, dateTime, totalCapacity, availableSeats, price)
VALUES
    ('Concert de Rock Épique', 'Un concert inoubliable avec les meilleurs riffs.', '2024-12-10 20:00:00', 100, 100, 35.00),
    ('Conférence "Tech du Futur"', 'Découvrez les innovations qui vont changer le monde.', '2024-11-25 09:30:00', 50, 50, 15.50),
    ('Festival électro "Open Air"', 'Dansez toute la nuit sous les étoiles.', '2025-07-04 18:00:00', 500, 500, 75.00);

-- On pourrait ajouter une table Users/Admins plus tard si besoin
-- CREATE TABLE IF NOT EXISTS users (
--     id INT AUTO_INCREMENT PRIMARY KEY,
--     username VARCHAR(100) NOT NULL UNIQUE,
--     password_hash VARCHAR(255) NOT NULL, -- Stocker les hashs, jamais les mots de passe en clair
--     email VARCHAR(255) UNIQUE,
--     role ENUM('CLIENT', 'ADMIN') NOT NULL DEFAULT 'CLIENT',
--     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- ) ENGINE=InnoDB;