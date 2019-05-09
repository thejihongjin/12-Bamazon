// ### Challenge #1: Customer View (Minimum Requirement)
// 5. Then create a Node application called `bamazonCustomer.js`. Running this application will first display all of the items available for sale. Include the ids, names, and prices of products for sale.
// 6. The app should then prompt users with two messages.
//    * The first should ask them the ID of the product they would like to buy.
//    * The second message should ask how many units of the product they would like to buy.
// 7. Once the customer has placed the order, your application should check if your store has enough of the product to meet the customer's request.
//    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
// 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
//    * This means updating the SQL database to reflect the remaining quantity.
//    * Once the update goes through, show the customer the total cost of their purchase.
// - - -

var inquirer = require("inquirer");
var mysql = require("mysql");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon"
});

initialPrompt();

function initialPrompt() {
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer.prompt([
            {
                type: "rawlist",
                message: "What product would you like to buy?",
                choices: function () {
                    var productArr = [];
                    for (var i = 0; i < results.length; i++) {
                        productArr.push(results[i].product_name); //push id/entire object?
                    }
                    return productArr;
                },
                name: "product"
            },
            {
                type: "input",
                message: "How many units would you like to buy?",
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
            for (var i = 0; i < results.length; i++) {
                if (results[i].product_name === response.product) {
                    chosenProduct = results[i];
                }
            }


            // check if your store has enough of the product to meet the customer's request.
            //    * If not, the app should log a phrase like `Insufficient quantity!`, and then prevent the order from going through.
            // 8. However, if your store _does_ have enough of the product, you should fulfill the customer's order.
            //    * This means updating the SQL database to reflect the remaining quantity.
            //    * Once the update goes through, show the customer the total cost of their purchase.
            // if (parseInt(response.bid > chosenProduct.highest_bid)) {
            //     connection.query(
            //         "UPDATE auctions SET ? WHERE ?",
            //         [
            //             {
            //                 highest_bid: chosenProduct.highest_bid
            //             },
            //             {
            //                 id: chosenProduct.id
            //             }
            //         ],
            //         function (err) {
            //             if (err) throw err;
            //             console.log("Bid placed successfully!");
            //             initialPrompt();
            //         }
            //     );
            // } else if (parseInt(response.bid <= chosenProduct.highest_bid)) {
            //     console.log("Sorry, your bid was too low. Try again.");
            //     initialPrompt();
            // }
        });
    });
}
