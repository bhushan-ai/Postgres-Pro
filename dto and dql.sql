-- DTO  Data transfer Object
-- Refers to structures used to transfer data between different layers of an application
--  typically between the database and  the application layer 
-- DTO's are designed to be simple containers for carrying  data through DTO  is a concept applied 
-- at application layer, SQL result are often mapped in DTOs

-- This SELECT Query represent a DTO that transfer product information
SELECT name, price, stock
FROM products;



-- DQL 
-- Data Query Language
-- Often Consider part of DML, specially focusing on Queries
-- that retrieves data from the database SELECT is the DQL command.