DROP DATABASE IF EXISTS bamazon;
CREATE DATABASE bamazon;
USE bamazon;

CREATE TABLE forsale (
    item_id INT(10) NOT NULL AUTO_INCREMENT,
    item_name VARCHAR(50) NOT NULL,
    category VARCHAR(50),
    price DEC(10,2),
    stock INT(10),
    PRIMARY KEY (item_id)
);

SELECT * FROM forsale;