CREATE TABLE IF NOT EXISTS checkout_items (
    id SERIAL PRIMARY KEY,
    checkout_id INTEGER NOT NULL,
    cart_id INTEGER NOT NULL,
    cart_item_id INTEGER NOT NULL,
    user_id UUID NOT NULL,
    total_ammount DECIMAL(10, 2) NOT NULL,

    FOREIGN KEY (checkout_id) REFERENCES checkouts (id) ON DELETE CASCADE,
    FOREIGN KEY (cart_id) REFERENCES carts (id) ON DELETE CASCADE,
    FOREIGN KEY (cart_item_id) REFERENCES cart_items (id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)

DROP TABLE checkout_items

ALTER TABLE checkout_items 
RENAME total_ammount TO total_amount;