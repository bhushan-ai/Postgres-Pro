-- Left Right Outer Join

-- LEFT JOIN
SELECT c.customer_name, o.product_name, o.quantity
FROM customers c
LEFT JOIN orders o ON c.customer_id = o.customer_id;


-- RIGHT JOIN
SELECT c.customer_name, o.product_name, o.quantity
FROM customers c
RIGHT JOIN orders o ON c.customer_id = o.customer_id;


--  Outer Join
SELECT c.customer_name, o.product_name, o.quantity
FROM customers c
FULL OUTER JOIN orders o ON c.customer_id = o.customer_id;

--  CROSS Join
SELECT c.customer_name, o.product_name, o.quantity
FROM customers c
CROSS JOIN orders o;

