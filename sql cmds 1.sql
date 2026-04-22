


-- Change the colm name 
SELECT chai_name AS "CHAI NAME", price AS "Cost in inr" FROM chai_store;


-- select perticular row
SELECT *
FROM chai_stor
WHERE chai_name= 'Green chai';

-- Select name which could start and end with anything but has "chai" in it 
SELECT *
FROM chai_store
WHERE chai_name LIKE '%chai%';

-- select where price is less than 30
SELECT *
FROM chai_store
WHERE price < 30;

-- Sort from highest to lowest price
SELECT *
FROM chai_store
ORDER BY price DESC;

-- update iced chai
UPDATE chai_store 
SET price= 38.00,available = TRUE
WHERE chai_name = 'Iced chai';

DELETE FROM chai_store
WHERE chai_name = 'Black chai';