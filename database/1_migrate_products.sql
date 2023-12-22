CREATE TABLE products (
    id INT PRIMARY KEY,
    serial_number INT UNIQUE,
    product_name VARCHAR(255) NOT NULL,
    description VARCHAR(255),
    quantity INT,
    created_at DATE DEFAULT CURRENT_DATE
);