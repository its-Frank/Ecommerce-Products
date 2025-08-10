-- Lavender's Gloss Database Schema
-- Run this script in your MySQL database

CREATE DATABASE IF NOT EXISTS lavenders_gloss;
USE lavenders_gloss;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    is_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Products table
CREATE TABLE products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    image VARCHAR(255) DEFAULT '/images/placeholder-product.jpg',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    service_name VARCHAR(255) NOT NULL,
    service_price DECIMAL(10, 2) NOT NULL,
    appointment_date DATE NOT NULL,
    appointment_time TIME NOT NULL,
    skin_type ENUM('oily', 'dry', 'combination', 'sensitive', 'normal') NOT NULL,
    notes TEXT,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    payment_status ENUM('pending', 'paid') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Cart table
CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    product_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    UNIQUE KEY unique_user_product (user_id, product_id)
);

-- Orders table
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    items JSON NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'delivered') DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Table for storing contact form messages
CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Insert sample admin user (password: admin123)
INSERT INTO users (name, email, password, phone, is_admin) VALUES 
('Admin User', 'admin@lavendersgloss.com', '$2b$10$rQZ8kHp4rQZ8kHp4rQZ8kOuKl2.vQZ8kHp4rQZ8kHp4rQZ8kHp4rQ', '+254700000000', TRUE);

-- Insert sample products
INSERT INTO products (name, description, price, stock) VALUES 
('Luxury Foundation', 'Full coverage foundation for all skin types', 45.00, 25),
('Matte Lipstick Set', 'Long-lasting matte lipsticks in 6 shades', 35.00, 15),
('Eyeshadow Palette', 'Professional 12-color eyeshadow palette', 55.00, 20),
('Makeup Brushes Set', 'Premium synthetic brush set (10 pieces)', 65.00, 12),
('Highlighter Compact', 'Illuminating highlighter for radiant glow', 28.00, 30),
('Concealer Stick', 'High coverage concealer stick', 22.00, 40),
('Blush Palette', 'Multi-shade blush palette', 38.00, 18),
('Setting Spray', 'Long-lasting makeup setting spray', 32.00, 25);
