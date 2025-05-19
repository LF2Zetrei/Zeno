CREATE TABLE product (
                         id_product UUID PRIMARY KEY,
                         name VARCHAR(255) NOT NULL,
                         description TEXT,
                         photo_url TEXT,
                         weight FLOAT,
                         quantity INTEGER,
                         estimated_price FLOAT,
                         created_at TIMESTAMP DEFAULT NOW(),
                         updated_at TIMESTAMP DEFAULT NOW()
);