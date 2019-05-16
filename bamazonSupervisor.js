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
            choices: ["View product sales by department", "Create new department", "EXIT"],
            name: "action"
        }
    ]).then(function (response) {
        if (response.action === "View product sales by department") {
            displaySalesByDepartment();
        }
        else if (response.action === "Create new department") {
            addNewDepartment();
        } else {
            connection.end();
        }
    });
}

function displaySalesByDepartment() { // displays product sales by department
    connection.query("SELECT distinct department_id,d.department_name,overhead_costs,SUM(ifnull(product_sales,0)) total_product_sales,SUM(ifnull(product_sales,0))-overhead_costs total_profit FROM products p RIGHT JOIN departments d ON p.department_name=d.department_name GROUP BY department_id,d.department_name,overhead_costs ORDER BY department_id", function (err, results) {
        if (err) throw err;
        console.table(results);
        initialPrompt();
    });
}

function addNewDepartment() {// allows manager to add a completely new department to the store
    inquirer
        .prompt([
            {
                type: "input",
                message: "What is the department name?",
                name: "department"
            },
            {
                type: "input",
                message: "What are the overhead costs of the department?",
                name: "overhead",
                validate: function (value) {
                    if (isNaN(value) === false) {
                        return true;
                    }
                    return false;
                }
            }
        ])
        .then(function (answer) {
            connection.query(
                "INSERT INTO departments SET ?",
                {
                    department_name: answer.department,
                    overhead_costs: parseInt(answer.overhead) || 0
                },
                function (err) {
                    if (err) throw err;
                    console.log("Your department was added successfully!");
                    inquirer.prompt([
                        {
                            type: "list",
                            message: "Would you like to add other departments?",
                            name: "add",
                            choices: ["Y", "N"],
                        }
                    ]).then(function (response) {
                        if (response.add === 'Y') {
                            addNewDepartment();
                        } else {
                            initialPrompt();
                        }
                    });
                }
            );
        });
}