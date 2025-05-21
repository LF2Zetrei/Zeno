CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE "user" (
                        id_user UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                        last_name VARCHAR(255),
                        first_name VARCHAR(255),
                        pseudo VARCHAR(255) UNIQUE,
                        email VARCHAR(255) UNIQUE,
                        password VARCHAR(255),
                        phone VARCHAR(50),
                        country VARCHAR(100),
                        address TEXT,
                        postal_code VARCHAR(20),
                        identity_card_url TEXT,
                        role VARCHAR(50),
                        rating_average DECIMAL(3,2),
                        deliver_since DATE,
                        basic_subscription BOOLEAN,
                        basic_subscription_since TIMESTAMP,
                        premium_subscription BOOLEAN,
                        premium_subscription_since TIMESTAMP,
                        created_at TIMESTAMP,
                        updated_at TIMESTAMP
);
