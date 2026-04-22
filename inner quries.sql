-- Inner Queries and Agreegate functions

SELECT customer_name
FROM customers
WHERE customer_id IN (
   SELECT  SUM(quantity) 
   FROM orders
   WHERE product_name = 'Jacket'
);