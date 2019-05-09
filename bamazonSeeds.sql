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

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("hat", "clothing", 15, 10),
-- ("", "books", 10, 10),
("soccer ball", "sports", 20, 50), 
("mp3 player", "electronics", 50, 20),
("Spirited Away", "movies", 20, 5), 
("bubble tea", "food", 5, 100),
("coffee", "food", 5, 100), 
("sweatshirt", "clothing", 25, 0),
("laptop", "electronics", 500, 5), 
("soccer cleats", "sports", 150, 5);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    overhead_costs INT default 0,
    PRIMARY KEY (department_id)
);

ALTER TABLE products ADD product_sales INT default 0;