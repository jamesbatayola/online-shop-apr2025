BEGIN;

INSERT INTO users(name, email, password)
VALUES
    ('marry', 'marry@email.com', '1234'),
    ('rain', 'rain@email.com', '1234'),
    ('claire', 'claire@email.com', '1234');

COMMIT;