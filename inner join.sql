CREATE TABLE customers(
customer_id INT PRIMARY KEY,
customer_name VARCHAR(100)
);

CREATE TABLE orders(
order_id INT PRIMARY KEY,
customer_id INT,
product_name VARCHAR(100),
quantity INT,
FOREIGN KEY (customer_id) REFERENCES customers(customer_id)
);



INSERT INTO customers (customer_id, customer_name) 
VALUES
(1, 'bhushan'),
(2, 'op'),
(3, 'rustin'),
(4, 'bruce'),
(5, 'anakin');

INSERT INTO orders (order_id, customer_id, product_name,  quantity)
VALUES 
( 101, 1,'T-shirt', 2 ),
( 102, 1,'Jeans', 4 ),
( 103, 2,'Jacket', 1 ),
( 104, Null,'Snikers', 3 );

SELECT * FROM orders;
SELECT * FROM  customers;


-- Inner Join