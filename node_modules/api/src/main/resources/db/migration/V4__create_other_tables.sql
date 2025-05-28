CREATE TABLE mission (
                         id_mission UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         traveler_id UUID,
                         order_id UUID NOT NULL,
                         acceptance_date DATE,
                         status VARCHAR(100),
                         created_at TIMESTAMP,
                         updated_at TIMESTAMP,
                         CONSTRAINT fk_traveler FOREIGN KEY (traveler_id) REFERENCES "user"(id_user),
                         CONSTRAINT fk_order FOREIGN KEY (order_id) REFERENCES "order"(id_order)
);

CREATE TABLE tracking (
                          id_tracking UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                          mission_id UUID,
                          latitude FLOAT,
                          longitude FLOAT,
                          timestamp TIMESTAMP,
                          created_at TIMESTAMP,
                          updated_at TIMESTAMP,
                          CONSTRAINT fk_mission_tracking FOREIGN KEY (mission_id) REFERENCES mission(id_mission)
);

CREATE TABLE message (
                         id_message UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         sender_id UUID NOT NULL,
                         recipient_id UUID NOT NULL,
                         content TEXT,
                         sent_since TIMESTAMPTZ,
                         CONSTRAINT fk_sender FOREIGN KEY (sender_id) REFERENCES "user"(id_user),
                         CONSTRAINT fk_recipient FOREIGN KEY (recipient_id) REFERENCES "user"(id_user)
);

CREATE TABLE payment (
                         id_payment UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                         amount FLOAT,
                         status VARCHAR(100),
                         stripe_id VARCHAR(255),
                         mission_id UUID NOT NULL,
                         created_at TIMESTAMP,
                         updated_at TIMESTAMP,
                         CONSTRAINT fk_payment_mission FOREIGN KEY (mission_id) REFERENCES mission(id_mission)
);

CREATE TABLE badge (
                       id_badge UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                       nom VARCHAR(255),
                       description TEXT,
                       created_at TIMESTAMP,
                       updated_at TIMESTAMP
);

CREATE TABLE order_product (
                               order_id UUID NOT NULL,
                               product_id UUID NOT NULL,
                               price_at_order FLOAT,
                               PRIMARY KEY (order_id, product_id),
                               CONSTRAINT fk_op_order FOREIGN KEY (order_id) REFERENCES "order"(id_order),
                               CONSTRAINT fk_op_product FOREIGN KEY (product_id) REFERENCES product(id_product)
);

CREATE TABLE user_badge (
                            user_id UUID NOT NULL,
                            badge_id UUID NOT NULL,
                            earned_at TIMESTAMP,
                            PRIMARY KEY (user_id, badge_id),
                            CONSTRAINT fk_ub_user FOREIGN KEY (user_id) REFERENCES "user"(id_user),
                            CONSTRAINT fk_ub_badge FOREIGN KEY (badge_id) REFERENCES badge(id_badge)
);

CREATE TABLE notification (
                              id_notification UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
                              user_id UUID NOT NULL,
                              title VARCHAR(255),
                              message TEXT,
                              is_read BOOLEAN DEFAULT FALSE,
                              created_at TIMESTAMP,
                              CONSTRAINT fk_notification_user FOREIGN KEY (user_id) REFERENCES "user"(id_user)
);