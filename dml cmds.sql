-- 1. DML 
-- Data Manipulation Language
-- Its deal with manipulation of Data inside the table.

-- INSERT : Insert new data in table
-- UPDATE : Modifies Existing data in Table
-- DELETE : Removes rows from Table
-- SELECT : Retrieves data from table

-- Insert
INSERT INTO products ( name, price, stock)
VALUES("T-shirt", 240, 50);

-- Update
UPDATE products 
SET price = 800.00
WHERE name= "T-shirt";

-- Delete
DELETE FROM products
WHERE name = "T-shirt";

