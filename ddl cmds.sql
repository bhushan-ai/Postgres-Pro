-- 1. DDL 
-- Data Definition Language
-- Used to define and manage the database objects like tables, indexes views etc 
-- Its deal with structure and schema of the database

-- CREATE : Create a new a DB Object (eg. Table, index, View)
-- Alter : Modifies and Existing object (eg. Adds/Removes columns, Change)
-- Drop : Delete an Object (eg. Table, index)
-- Truncate : Removes all rows from table but keeps the structure  
-- Rename : Rename an Existing Object (eg. Table, Columns)

-- Alter example : modify existing object
ALTER TABLE products ADD stock INT DEFAULT 0;


-- modify the datatype
ALTER TABLE products 
ALTER COLUMN price TYPE DECIMAL(12,2);

-- REMOVE  column
ALTER TABLE products
DROP COLUMN category;

-- Delete Table
DROP TABLE products;

-- Truncate : removes the rows
TRUNCATE TABLE products;

-- Rename
ALTER TABLE products
RENAME TO inventory;

-- Rename column
ALTER TABLE products
RENAME COLUMN p_name TO product_name;