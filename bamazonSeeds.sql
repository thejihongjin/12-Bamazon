DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE bamazon;

CREATE TABLE products (
    product_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(100) NOT NULL,
    department_name VARCHAR(100),
    price INT default 0,
    stock_quantity INT default 0,
    PRIMARY KEY (product_id)
);

-- 4. Populate this database with around 10 different products. (i.e. Insert "mock" data rows into this database and table).
--INSERT INTO products (product_name, department_name, price, stock_quantity)
-- VALUES ("", "", 0, 0),
-- ("", "", 0, 0),
-- ("", "", 0, 0), 
-- ("", "", 0, 0),
-- ("", "", 0, 0), 
-- ("", "", 0, 0),
-- ("", "", 0, 0), 
-- ("", "", 0, 0),
-- ("", "", 0, 0), 
-- ("", "", 0, 0);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    overhead_costs INT default 0,
    PRIMARY KEY (department_id)
);

ALTER TABLE products ADD product_sales INT default 0;