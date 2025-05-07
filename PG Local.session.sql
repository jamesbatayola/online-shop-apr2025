CREATE TABLE IF NOT EXISTS checkouts (
    id SERIAL PRIMARY KEY,
    cart_id INTEGER NOT NULL,
    status ENUM('on_process', 'delivered') DEFAULT 'on_process',
    checkout_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS checkout_items (
    id SERIAL PRIMARY KEY,
    checkout_id INTEGER NOT NULL,

    cart_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,

    total_quantity INTEGER DEFAULT 1,
    total_price DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (checkout_id) REFERENCES checkouts (id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

DROP TABLE checkout_items;

--  define ENUM type
CREATE TYPE order_status AS ENUM ('on_process', 'delivered');

ALTER TABLE checkouts
ADD COLUMN status order_status DEFAULT 'on_process';

ALTER TABLE checkout_items 
UPDATE COLUMN cart

DELETE FROM checkout_items;
DELETE FROM checkouts;
DELETE FROM carts;

