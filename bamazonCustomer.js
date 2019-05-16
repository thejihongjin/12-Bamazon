var inquirer = require("inquirer");
var mysql = require("mysql");
var consoleTable = require("console.table");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    initialPrompt();
});

function initialPrompt() {
    displayProducts();

    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the id of the product would you like to buy? [Press Q to quit.]",
                name: "id",
                validate: function (value) {
                    return !isNaN(value) || value.toLowerCase() === "q";
                }
            }
        ]).then(function (response) {
            if (response.id === 'q') {
                connection.end();
            } else {
                var chosenProduct;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_id == response.id) {
                        chosenProduct = results[i];
                    }
                }
                qtyPrompt(chosenProduct);
            }
        });
    });
}

function displayProducts() {
    connection.query("SELECT product_id,product_name,price,stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        console.table(results); // displays all products available for sale
    });
}

function qtyPrompt(product) {
    inquirer.prompt([
        {
            type: "input",
            message: "How many units would you like to buy? [Press Q to quit.]",
            name: "quantity",
            validate: function (value) {
                return !isNaN(value) || value.toLowerCase() === "q";
            }
        }
    ]).then(function (response) {
        if (response.quantity === 'q') {
            connection.end();
        } else {
            if (parseInt(response.quantity) > parseInt(product.stock_quantity)) {
                console.log("Insufficient quantity!");
                initialPrompt();
            } else if (parseInt(response.quantity) <= parseInt(product.stock_quantity)) {
                var orderCost = parseInt(response.quantity * product.price);
                var newStockQty = parseInt(product.stock_quantity - response.quantity);
                var newProductSales = parseInt(product.product_sales + orderCost); 
                connection.query(
                    "UPDATE products SET ? WHERE ?",
                    [
                        {
                            stock_quantity: newStockQty,
                            product_sales: newProductSales
                        },
                        {
                            product_id: product.product_id
                        }
                    ],
                    function (err) {
                        if (err) throw err;
                        console.log("Thanks for your order!\n" + response.quantity + " unit(s) of " + product.product_name + " is $" + orderCost + "\n\n");
                        initialPrompt();
                    }
                );
            }
        }
    });
}