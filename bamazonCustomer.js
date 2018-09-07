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
        .then(function (response) {
            connection.query("SELECT * FROM forsale WHERE item_id=" + response.id, function (err, res) {
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
                        ], function (err, res) {
                            if (err) throw err;
                            var total = response.units * unitPrice;
                            console.log("TOTAL:$" + total );
                            showStock();
                        })
                } else {
                    console.log("THIS IS OUT OF STOCK.");
                    showStock();
                }
            })
        })
}

//This function will print the items in stock
function showStock() {
    var line = "\n--------------------------------";
    console.log("\nWhat would you like to purchase?\n" + line);
    connection.query("SELECT * FROM forsale", function (err, res) {
        if (err) throw err;
        res.forEach(function (item) {
            console.log(item.item_name + "\nItem ID: " + item.item_id + ", $" + item.price + "\n" + item.stock + " in stock" + "\ncategory: " + item.category + line);
        });

        promptUser();
    });
};

connection.connect(function (err) {
    if (err) throw err;
    showStock();
});