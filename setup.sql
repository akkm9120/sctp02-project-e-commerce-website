-- CREATE USER 'noname'@'%' IDENTIFIED BY 'noname1123';

-- grant all privileges on *.* to 'noname'@'%';

FLUSH PRIVILEGES;

CREATE DATABASE ecommerce_local;

use ecommerce_local;

INSERT into categories (id,name)
VALUES 
    (1,'Vegan'),
    (2,'Non-Vegan');



-- INSERT INTO orders (order_date, total_cost, delivery_date, delivery_time, delivery_address)
-- VALUES
-- ('2025-01-08 15:05:25', 44.00, '2025-01-08', '10:00:00', '123 Main Street');

-- INSERT INTO orders (order_date, total_cost, delivery_date, delivery_time, delivery_address)
-- VALUES
-- ('2025-01-08 16:10:30', 55.50, '2025-01-09', '12:00:00', '456 Elm Street');

    

-- INSERT INTO order_items (order_id, product_name, quantity, price_pe r_unit, subtotal)
-- VALUES
-- (1, 'Chicken rice', 2, 10.00, 20.00),
-- (1, 'Pork Belly sushi', 1, 14.00, 14.00),
-- (1, 'Ice Tea', 1, 10.00, 10.00);

-- INSERT INTO order_items (order_id, product_name, quantity, price_per_unit, subtotal)
-- VALUES
-- (2, 'Beef Burger', 2, 12.50, 25.00),
-- (2, 'Sushi Rolls', 1, 18.00, 18.00),
-- (2, 'Lemonade', 1, 12.50, 12.50);

--    ALTER TABLE orders
-- RENAME COLUMN orderid to order_id;

-- CREATE TABLE orders (
--     order_id INT AUTO_INCREMENT PRIMARY KEY,   
--     order_date DATETIME NOT NULL,               
--     total_cost DECIMAL(10, 2) NOT NULL,       
--     delivery_date DATE NOT NULL,              
--     delivery_time TIME NOT NULL,                
--     delivery_address VARCHAR(255) NOT NULL     
-- );


-- CREATE TABLE order_items (
--     order_item_id INT AUTO_INCREMENT PRIMARY KEY, -- Unique order item identifier
--     order_id INT,                                  -- Foreign key to the Orders table
--     product_name VARCHAR(255) NOT NULL,             -- Product name
--     quantity INT NOT NULL,                         -- Quantity of the product in the order
--     price_per_unit DECIMAL(10, 2) NOT NULL,        -- Price per unit of the product
--     subtotal DECIMAL(10, 2) NOT NULL,             -- Subtotal (price_per_unit * quantity)
--     FOREIGN KEY (order_id) REFERENCES orders(order_id) -- Foreign key linking back to the Orders table
-- );



-- ALTER TABLE orders
-- MODIFY order_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
-- MODIFY total_cost DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
-- MODIFY delivery_date DATE NOT NULL DEFAULT '1970-01-01',
-- MODIFY delivery_time TIME NOT NULL DEFAULT '00:00:00',
-- MODIFY delivery_address VARCHAR(255) NOT NULL DEFAULT 'No Address Provided';
