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
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "EXIT"],
            name: "action"
        }
    ]).then(function (response) {
        if (response.action === "View products for sale") {
            displayProducts();
        }
        else if (response.action === "View low inventory") {
            displayLowInventory();
        }
        else if (response.action === "Add to inventory") {
            restockInventory();
        }
        else if (response.action === "Add new product") {
            addNewProduct();
        } else {
            connection.end();
        }
    });
}

function displayProducts() { // displays all products available for sale
    connection.query("SELECT product_id,product_name,price,stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        console.table(results);
        initialPrompt();
    });
}

function displayLowInventory() { // displays all products with inventory count lower than five
    connection.query("SELECT product_id,product_name,price,stock_quantity FROM products WHERE stock_quantity<5", function (err, results) {
        if (err) throw err;
        if (results) {
            console.table(results);
        } else {
            console.log("All products are sufficiently stocked.")
        }
        initialPrompt();
    });
}

function restockInventory() {
    connection.query("SELECT product_id,product_name,price,stock_quantity FROM products", function (err, results) {
        if (err) throw err;
        console.table(results); // displays all products available for sale

        inquirer.prompt([
            {
                type: "input",
                message: "What is the id of the product you would like to restock?",
                name: "id",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                message: "How many units would you like to restock?",
                name: "quantity",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (response) {
            var chosenProduct;
            var newStockQty = 0;
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_id == response.id) {
                    chosenProduct = results[i];
                }
            }

            newStockQty = parseInt(chosenProduct.stock_quantity + response.quantity);
            connection.query(
                "UPDATE products SET ? WHERE ?",
                [
                    {
                        stock_quantity: newStockQty
                    },
                    {
                        product_id: chosenProduct.product_id
                    }
                ],
                function (err) {
                    if (err) throw err;
                    console.log("Your product was restocked successfully!");
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Would you like to restock other products?",
                            name: "restock",
                            choices: ["Y", "N"],
                        }
                    ]).then(function (response) {
                        if (response.restock === 'Y') {
                            restockInventory();
                        } else {
                            initialPrompt();
                        }
                    });
                }
            );
        });
    });
}

function addNewProduct() { // allows manager to add a completely new product to the store
    connection.query("SELECT * FROM departments", function (err, results) {
        if (err) throw err;
        inquirer.prompt([
            {
                type: "input",
                message: "What is the product name?",
                name: "product"
            },
            {
                type: "rawlist",
                message: "What department is the product in?",
                choices: function () {
                    var departmentArr = [];
                    for (var i = 0; i < results.length; i++) {
                        departmentArr.push(results[i].department_name);
                    }
                    return departmentArr;
                },
                name: "department"
            },
            {
                type: "input",
                message: "How much does the product cost?",
                name: "price",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            },
            {
                type: "input",
                message: "How many units of this product would you like to stock?",
                name: "quantity",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ]).then(function (answer) {
            connection.query(
                "INSERT INTO products SET ?",
                {
                    product_name: answer.product,
                    department_name: answer.department,
                    price: parseInt(answer.price) || 0,
                    stock_quantity: parseInt(answer.quantity) || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your product was added successfully!");
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Would you like to add other products?",
                            name: "add",
                            choices: ["Y", "N"],
                        }
                    ]).then(function (response) {
                        if (response.add === 'Y') {
                            addNewProduct();
                        } else {
                            initialPrompt();
                        }
                    });
                }
            );
        });
    });
}