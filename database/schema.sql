-- Schéma fidèle au diagramme PlantUML fourni, tous les prix en DZD

DROP DATABASE IF EXISTS le_cactus_db;
CREATE DATABASE le_cactus_db;
USE le_cactus_db;

-- Table des utilisateurs (User)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    date_naissance DATE NOT NULL,
    telephone VARCHAR(20) NOT NULL,
    carte_identite VARCHAR(50) NOT NULL UNIQUE
);

-- Table des administrateurs (Admin)
CREATE TABLE admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    mot_de_passe VARCHAR(255) NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL
);

-- Table des salles (Salle)
CREATE TABLE salles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    capacity INT NOT NULL,
    prix INT NOT NULL DEFAULT 0
);

-- Table des plats (Plat)
CREATE TABLE plats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix INT NOT NULL,
    categorie VARCHAR(100) NOT NULL,
    salle_id INT NOT NULL,
    FOREIGN KEY (salle_id) REFERENCES salles(id) ON DELETE CASCADE
);

-- Table des services (Service)
CREATE TABLE services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    prix INT NOT NULL,
    salle_id INT NOT NULL,
    FOREIGN KEY (salle_id) REFERENCES salles(id) ON DELETE CASCADE
);

-- Table des réservations (Reservation)
CREATE TABLE reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    date DATE NOT NULL,
    heure_debut TIME NOT NULL,
    duree INT NOT NULL,
    total INT NOT NULL,
    status ENUM('en_attente', 'confirmee', 'rejetee') NOT NULL DEFAULT 'en_attente',
    admin_message TEXT,
    reject_reason TEXT,
    user_id INT NOT NULL,
    salle_id INT NOT NULL,
    admin_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (salle_id) REFERENCES salles(id) ON DELETE CASCADE,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Table de liaison reservation_plat (plusieurs plats par réservation)
CREATE TABLE reservation_plat (
    reservation_id INT NOT NULL,
    plat_id INT NOT NULL,
    PRIMARY KEY (reservation_id, plat_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (plat_id) REFERENCES plats(id) ON DELETE CASCADE
);

-- Table de liaison reservation_service (plusieurs services par réservation)
CREATE TABLE reservation_service (
    reservation_id INT NOT NULL,
    service_id INT NOT NULL,
    PRIMARY KEY (reservation_id, service_id),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE CASCADE
);

-- Table des avis (Avis)
CREATE TABLE avis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    commentaire TEXT NOT NULL,
    date DATE NOT NULL,
    deleted BOOLEAN DEFAULT FALSE,
    user_id INT NOT NULL,
    reservation_id INT,
    admin_id INT,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE SET NULL,
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE SET NULL
);

-- Insertion de données de test (utilisateurs)
INSERT INTO users (nom, prenom, date_naissance, telephone, carte_identite, email, mot_de_passe) VALUES
('Alami', 'Sarah', '1990-05-15', '+213 6 12 34 56 78', 'DZ123456', 'sarah.alami@email.com', 'password123'),
('Benali', 'Ahmed', '1985-08-22', '+213 6 87 65 43 21', 'DZ789012', 'ahmed.benali@email.com', 'password123'),
('Lahlou', 'Fatima', '1992-12-03', '+213 6 55 44 33 22', 'DZ345678', 'fatima.lahlou@email.com', 'password123');

-- Insertion d'avis de test
INSERT INTO avis (user_id, rating, commentaire, date) VALUES
(1, 5, 'Un lieu magique pour notre mariage ! L''équipe était aux petits soins.', '2024-01-01'),
(2, 5, 'Parfait pour notre conférence d''entreprise. Équipements de qualité.', '2024-01-02'),
(3, 4, 'Très belle salle pour l''anniversaire de ma fille. Recommandé !', '2024-01-03');

-- Insertion des salles de base
INSERT INTO salles (nom, capacity) VALUES
('conference', 50),
('mariage', 150),
('evenement', 100);

-- Insertion d'un admin par défaut
INSERT INTO admins (email, mot_de_passe, nom, prenom) VALUES
('admin@email.com', 'admin', 'Admin', 'Admin');

-- Insertion de services pour la salle de conférence (prix en DZD)
INSERT INTO services (nom, prix, salle_id) VALUES
('Climatisation', 5000, 1),
('Système de sonorisation professionnel', 15000, 1),
('Projecteur HD + écran', 8000, 1),
('Internet haut débit Wi-Fi', 3000, 1),
('Disposition style théâtre (50 places)', 4000, 1),
('Disposition en U (30 places)', 4500, 1),
('Pause-café du matin (viennoiseries, café, thé, jus)', 3500, 1),
('Pause-café après-midi (pâtisseries, café, thé, jus)', 3500, 1),
('Pack papeterie (bloc-notes, stylos, eau)', 2000, 1),
('Personnel d''accueil', 7000, 1),
('Service de traduction simultanée', 20000, 1),
('Enregistrement audio/vidéo', 10000, 1),
('Service de streaming en direct', 12000, 1);

-- Insertion de plats pour la salle de conférence (prix en DZD)
INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Pause café', 1000, 'Pause', 1),
('Déjeuner d\'affaires', 2500, 'Déjeuner', 1),
('Cocktail', 2000, 'Cocktail', 1);

-- Exemple d'insertion de services et plats pour les autres salles (prix en DZD)
-- Mariage
INSERT INTO services (nom, prix, salle_id) VALUES
('Décoration florale', 20000, 2),
('DJ et animation', 25000, 2),
('Photographe professionnel', 18000, 2),
('Service traiteur complet', 40000, 2),
('Voiture de mariage', 15000, 2);

INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Menu mariage standard', 3500, 'Menu', 2),
('Menu mariage premium', 6000, 'Menu', 2),
('Buffet desserts', 2500, 'Dessert', 2);

-- Evenement
INSERT INTO services (nom, prix, salle_id) VALUES
('Sécurité', 8000, 3),
('Service de nettoyage', 5000, 3),
('Gestion des invités', 6000, 3);

INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Buffet événement', 3000, 'Buffet', 3),
('Cocktail événement', 2000, 'Cocktail', 3);

-- Plats algériens par catégorie pour toutes les salles
-- Entrées
INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Salade Méchouia', 800, 'Entrée', 1),('Salade Méchouia', 800, 'Entrée', 2),('Salade Méchouia', 800, 'Entrée', 3),
('Chorba Frik', 700, 'Entrée', 1),('Chorba Frik', 700, 'Entrée', 2),('Chorba Frik', 700, 'Entrée', 3),
('Bourek viande', 900, 'Entrée', 1),('Bourek viande', 900, 'Entrée', 2),('Bourek viande', 900, 'Entrée', 3),
('Salade de poivrons grillés', 850, 'Entrée', 1),('Salade de poivrons grillés', 850, 'Entrée', 2),('Salade de poivrons grillés', 850, 'Entrée', 3),
('Brick à l\'oeuf', 950, 'Entrée', 1),('Brick à l\'oeuf', 950, 'Entrée', 2),('Brick à l\'oeuf', 950, 'Entrée', 3),
('Salade de pommes de terre', 700, 'Entrée', 1),('Salade de pommes de terre', 700, 'Entrée', 2),('Salade de pommes de terre', 700, 'Entrée', 3),
('Tajine zitoune (entrée)', 1000, 'Entrée', 1),('Tajine zitoune (entrée)', 1000, 'Entrée', 2),('Tajine zitoune (entrée)', 1000, 'Entrée', 3),
('Salade algérienne', 750, 'Entrée', 1),('Salade algérienne', 750, 'Entrée', 2),('Salade algérienne', 750, 'Entrée', 3),
('Soupe blanche', 700, 'Entrée', 1),('Soupe blanche', 700, 'Entrée', 2),('Soupe blanche', 700, 'Entrée', 3),
('Salade de carottes à l\'orange', 800, 'Entrée', 1),('Salade de carottes à l\'orange', 800, 'Entrée', 2),('Salade de carottes à l\'orange', 800, 'Entrée', 3),
('Tchoutchouka', 850, 'Entrée', 1),('Tchoutchouka', 850, 'Entrée', 2),('Tchoutchouka', 850, 'Entrée', 3),
('Salade de riz', 700, 'Entrée', 1),('Salade de riz', 700, 'Entrée', 2),('Salade de riz', 700, 'Entrée', 3);

-- Plats principaux
INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Couscous royal', 2500, 'Plat principal', 1),('Couscous royal', 2500, 'Plat principal', 2),('Couscous royal', 2500, 'Plat principal', 3),
('Tajine zitoune', 2200, 'Plat principal', 1),('Tajine zitoune', 2200, 'Plat principal', 2),('Tajine zitoune', 2200, 'Plat principal', 3),
('Rechta au poulet', 2000, 'Plat principal', 1),('Rechta au poulet', 2000, 'Plat principal', 2),('Rechta au poulet', 2000, 'Plat principal', 3),
('Chakhchoukha', 2100, 'Plat principal', 1),('Chakhchoukha', 2100, 'Plat principal', 2),('Chakhchoukha', 2100, 'Plat principal', 3),
('Mhadjeb farcis', 1800, 'Plat principal', 1),('Mhadjeb farcis', 1800, 'Plat principal', 2),('Mhadjeb farcis', 1800, 'Plat principal', 3),
('Poisson au four', 2700, 'Plat principal', 1),('Poisson au four', 2700, 'Plat principal', 2),('Poisson au four', 2700, 'Plat principal', 3),
('Poulet rôti aux olives', 2300, 'Plat principal', 1),('Poulet rôti aux olives', 2300, 'Plat principal', 2),('Poulet rôti aux olives', 2300, 'Plat principal', 3),
('Tlitli', 2000, 'Plat principal', 1),('Tlitli', 2000, 'Plat principal', 2),('Tlitli', 2000, 'Plat principal', 3),
('Lham lahlou', 1900, 'Plat principal', 1),('Lham lahlou', 1900, 'Plat principal', 2),('Lham lahlou', 1900, 'Plat principal', 3),
('Dolma courgettes', 2100, 'Plat principal', 1),('Dolma courgettes', 2100, 'Plat principal', 2),('Dolma courgettes', 2100, 'Plat principal', 3),
('Grillades mixtes', 2600, 'Plat principal', 1),('Grillades mixtes', 2600, 'Plat principal', 2),('Grillades mixtes', 2600, 'Plat principal', 3);

-- Desserts
INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Makroud', 700, 'Dessert', 1),('Makroud', 700, 'Dessert', 2),('Makroud', 700, 'Dessert', 3),
('Tamina', 600, 'Dessert', 1),('Tamina', 600, 'Dessert', 2),('Tamina', 600, 'Dessert', 3),
('Kalb el louz', 800, 'Dessert', 1),('Kalb el louz', 800, 'Dessert', 2),('Kalb el louz', 800, 'Dessert', 3),
('Zlabia', 700, 'Dessert', 1),('Zlabia', 700, 'Dessert', 2),('Zlabia', 700, 'Dessert', 3),
('Baklawa', 900, 'Dessert', 1),('Baklawa', 900, 'Dessert', 2),('Baklawa', 900, 'Dessert', 3),
('Griwech', 750, 'Dessert', 1),('Griwech', 750, 'Dessert', 2),('Griwech', 750, 'Dessert', 3),
('Tcharek', 800, 'Dessert', 1),('Tcharek', 800, 'Dessert', 2),('Tcharek', 800, 'Dessert', 3),
('Basboussa', 700, 'Dessert', 1),('Basboussa', 700, 'Dessert', 2),('Basboussa', 700, 'Dessert', 3),
('Mkhabez', 850, 'Dessert', 1),('Mkhabez', 850, 'Dessert', 2),('Mkhabez', 850, 'Dessert', 3),
('Cornes de gazelle', 900, 'Dessert', 1),('Cornes de gazelle', 900, 'Dessert', 2),('Cornes de gazelle', 900, 'Dessert', 3);

-- Boissons
INSERT INTO plats (nom, prix, categorie, salle_id) VALUES
('Thé à la menthe', 400, 'Boisson', 1),('Thé à la menthe', 400, 'Boisson', 2),('Thé à la menthe', 400, 'Boisson', 3),
('Café noir', 350, 'Boisson', 1),('Café noir', 350, 'Boisson', 2),('Café noir', 350, 'Boisson', 3),
('Jus d\'orange frais', 600, 'Boisson', 1),('Jus d\'orange frais', 600, 'Boisson', 2),('Jus d\'orange frais', 600, 'Boisson', 3),
('Jus de grenade', 700, 'Boisson', 1),('Jus de grenade', 700, 'Boisson', 2),('Jus de grenade', 700, 'Boisson', 3),
('Limonade maison', 500, 'Boisson', 1),('Limonade maison', 500, 'Boisson', 2),('Limonade maison', 500, 'Boisson', 3),
('Eau minérale', 200, 'Boisson', 1),('Eau minérale', 200, 'Boisson', 2),('Eau minérale', 200, 'Boisson', 3),
('Jus de carotte', 650, 'Boisson', 1),('Jus de carotte', 650, 'Boisson', 2),('Jus de carotte', 650, 'Boisson', 3),
('Jus de pomme', 600, 'Boisson', 1),('Jus de pomme', 600, 'Boisson', 2),('Jus de pomme', 600, 'Boisson', 3),
('Soda', 400, 'Boisson', 1),('Soda', 400, 'Boisson', 2),('Soda', 400, 'Boisson', 3),
('Jus multifruits', 700, 'Boisson', 1),('Jus multifruits', 700, 'Boisson', 2),('Jus multifruits', 700, 'Boisson', 3);
