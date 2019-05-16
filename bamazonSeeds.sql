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
("The Giving Tree", "books", 10, 10),
("soccer ball", "sports", 20, 50), 
("mp3 player", "electronics", 50, 20),
("Spirited Away", "movies", 20, 5), 
("bubble tea", "food", 5, 100),
("coffee", "food", 5, 100), 
("sweatshirt", "clothing", 25, 11),
("laptop", "electronics", 500, 5), 
("soccer cleats", "sports", 150, 5);

-- UPDATE products SET stock_quantity=10 WHERE product_id=1;
-- UPDATE products SET stock_quantity=10 WHERE product_id=2;
-- UPDATE products SET stock_quantity=50 WHERE product_id=3;
-- UPDATE products SET stock_quantity=20 WHERE product_id=4;
-- UPDATE products SET stock_quantity=5 WHERE product_id=5;
-- UPDATE products SET stock_quantity=100 WHERE product_id=6;
-- UPDATE products SET stock_quantity=100 WHERE product_id=7;
-- UPDATE products SET stock_quantity=11 WHERE product_id=8;
-- UPDATE products SET stock_quantity=5 WHERE product_id=9;
-- UPDATE products SET stock_quantity=5 WHERE product_id=10;

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(100) NOT NULL,
    overhead_costs INT default 0,
    PRIMARY KEY (department_id)
);

INSERT INTO departments (department_name,overhead_costs)
VALUES ("clothing", 250),
("books", 500),
("sports", 1000),
("electronics", 2500),
("movies", 100),
("food", 5000);

ALTER TABLE products ADD product_sales INT default 0;