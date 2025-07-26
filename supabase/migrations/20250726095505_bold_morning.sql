-- Base de dades per al sistema de tràmits de Tarragona
CREATE DATABASE IF NOT EXISTS tarragona_tramits CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE tarragona_tramits;

-- Taula de sessions de xat
CREATE TABLE IF NOT EXISTS chat_sessions (
    id VARCHAR(36) PRIMARY KEY,
    form_type VARCHAR(100) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    form_data TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_form_type (form_type),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
);

-- Taula de missatges del xat
CREATE TABLE IF NOT EXISTS chat_messages (
    id VARCHAR(36) PRIMARY KEY,
    session_id VARCHAR(36) NOT NULL,
    content TEXT NOT NULL,
    sender VARCHAR(10) NOT NULL,
    metadata TEXT,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (session_id) REFERENCES chat_sessions(id) ON DELETE CASCADE,
    INDEX idx_session_id (session_id),
    INDEX idx_sender (sender),
    INDEX idx_timestamp (timestamp)
);

-- Taula de plantilles de formularis
CREATE TABLE IF NOT EXISTS form_templates (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    description TEXT,
    fields JSON NOT NULL,
    pdf_template VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_name (name)
);

-- Taula d'estadístiques d'ús
CREATE TABLE IF NOT EXISTS usage_stats (
    id INT AUTO_INCREMENT PRIMARY KEY,
    form_type VARCHAR(100) NOT NULL,
    session_id VARCHAR(36),
    action VARCHAR(50) NOT NULL, -- 'session_created', 'form_completed', 'pdf_generated'
    user_agent TEXT,
    ip_address VARCHAR(45),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_form_type (form_type),
    INDEX idx_action (action),
    INDEX idx_timestamp (timestamp)
);

-- Inserir plantilles de formularis per defecte
INSERT INTO form_templates (id, name, description, fields) VALUES 
(
    'solicitud-generica',
    'Sol·licitud Genèrica',
    'Formulari general per a qualsevol tipus de sol·licitud administrativa',
    JSON_ARRAY(
        JSON_OBJECT('name', 'nom_cognoms', 'label', 'Nom i cognoms', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'dni', 'label', 'DNI/NIE', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'telefon', 'label', 'Telèfon', 'type', 'phone', 'required', true),
        JSON_OBJECT('name', 'email', 'label', 'Correu electrònic', 'type', 'email', 'required', true),
        JSON_OBJECT('name', 'adreca', 'label', 'Adreça', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'motiu_solicitud', 'label', 'Motiu de la sol·licitud', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'documentacio_adjunta', 'label', 'Documentació que s\'adjunta', 'type', 'text', 'required', false)
    )
),
(
    'certificado-residencia',
    'Certificat de Residència',
    'Sol·licitud de certificat d\'empadronament i residència',
    JSON_ARRAY(
        JSON_OBJECT('name', 'nom_cognoms', 'label', 'Nom i cognoms', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'dni', 'label', 'DNI/NIE', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'telefon', 'label', 'Telèfon', 'type', 'phone', 'required', true),
        JSON_OBJECT('name', 'adreca_empadronament', 'label', 'Adreça d\'empadronament', 'type', 'text', 'required', true),
        JSON_OBJECT('name', 'finalitat', 'label', 'Finalitat del certificat', 'type', 'text', 'required', true)
    )
);

-- Crear usuari per a l'aplicació (opcional, ajustar credencials)
-- CREATE USER 'tarragona_user'@'localhost' IDENTIFIED BY 'secure_password_123';
-- GRANT ALL PRIVILEGES ON tarragona_tramits.* TO 'tarragona_user'@'localhost';
-- FLUSH PRIVILEGES;