ALTER TABLE users
ADD COLUMN password TEXT NOT NULL,
ADD CONSTRAINT password_length CHECK (char_length(password) >= 4);
