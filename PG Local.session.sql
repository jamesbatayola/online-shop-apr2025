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

DROP TABLE checkout_items

ALTER TABLE checkout_items 
UPDATE COLUMN cart

DELETE FROM checkout_items;
DELETE FROM checkouts;