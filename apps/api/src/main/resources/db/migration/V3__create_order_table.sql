CREATE TABLE "order" (
                         id_order UUID PRIMARY KEY,
                         buyer_id UUID NOT NULL,
                         purchase_address VARCHAR(255),
                         purchase_country VARCHAR(100),
                         deadline DATE,
                         price_estimation FLOAT,
                         artisan_name VARCHAR(255),
                         created_at TIMESTAMP,
                         updated_at TIMESTAMP,
                         CONSTRAINT fk_buyer FOREIGN KEY (buyer_id) REFERENCES "user"(id_user)
);