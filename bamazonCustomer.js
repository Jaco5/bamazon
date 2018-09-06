//load node packages
var inquirer = require("inquirer");
var mysql = require("mysql");

//Connect to my DB
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "root",
    database: "bamazon"
});
//This function will print the items in stock
function showStock() {
    var line = "\n--------------------------------";
    console.log("\nWhat would you like to purchase?\n" + line);
    connection.query("SELECT * FROM forsale", function(err, res) {
        if (err) throw err;
        res.forEach(function(item) {
            console.log(item.item_name + " Item ID: " + item.item_id + ", $" + item.price + "\n" + item.stock + " in stock" + "\nDepartment: " + item.department_name + line);
        });
        console.log("\n");
      promptUser();
    });
};

function promptUser() {
    inquirer.prompt([
        {
            message: "Purchase ID:",
            type: "input",
            name: "id"
        },
        {
            message: "Quantity:",
            type: "input",
            name: "units"
        }
    ])
    .then(function(response) {
        connection.query("SELECT * FROM forsale WHERE item_id=" + response.id, function(err, res) {
            if (err) throw err;

            var itemStock = res[0].stock;
            var unitPrice = res[0].price;
            if (response.units <= itemStock) {
                var modStock = itemStock - response.units;
                connection.query("UPDATE forsale SET ? WHERE ?", 
                [
                    {
                        stock: modStock
                    },
                    {
                        item_id: response.id
                    }
                ], function(err, res) {
                    if (err) throw err;
                    var totalCost = response.units * unitPrice;
                    console.log("Your total cost is $" + totalCost + ".");
                    showStock();
                })
            } else {
                console.log("THIS IS OUT OF STOCK.");
                showStock();
            }
        })
    })
}

connection.connect(function(err) {
    if (err) throw err;
    showStock();
});