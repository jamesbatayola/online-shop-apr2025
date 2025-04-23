BEGIN;

INSERT INTO users(name, email, password)
VALUES
    ('john', 'jogn@email.com', '$2b$10$VxN9DW60LnSv2O0nH8VUaOm7x0T2qqGUdEPIt6WQTiRc5MF4ZCX8e'),
    ('marry', 'marry@email.com', '$2b$10$VxN9DW60LnSv2O0nH8VUaOm7x0T2qqGUdEPIt6WQTiRc5MF4ZCX8e'),
    ('rain', 'rain@email.com', '$2b$10$VxN9DW60LnSv2O0nH8VUaOm7x0T2qqGUdEPIt6WQTiRc5MF4ZCX8e'),
    ('claire', 'claire@email.com', '$2b$10$VxN9DW60LnSv2O0nH8VUaOm7x0T2qqGUdEPIt6WQTiRc5MF4ZCX8e');

COMMIT;