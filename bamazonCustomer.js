var mysql = require("mysql");
var inquirer = require("inquirer");
var await = require('await');
var purchaseList = [];
var checkout = false;
var Item = require("./list.js");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "Ucla1234",
    database: "bamazon"
});


connection.connect(function (err) {
    if (err) throw err;

    runapplication()
});

function runapplication() {
    a = "id";
    b = "product_name";
    c = "price";
    var q = "Select " + a + "," + b + "," + c + " from products";

    connection.query(q,

        function (err, res) {

            var data = {};
            for (var i = 0; i < res.length; i++) {

                var d = {};
                d["Product Name"] = res[i].product_name;
                d["Price $"] = res[i].price;

                data[res[i].id] = d;

            }
            console.table(data);
            runSearch()

        });
}

function runSearch() {
    // console.log("Entering the function");
    if (checkout === false) {
        inquirer
            .prompt({
                name: "id",
                type: "input",
                message: "Please select product ID, press d if done",

            })
            .then(function (answer) {
                // console.log(answer);

                if (answer.id === "d") {
                    console.log("Checking out");
                    checkout = true;
                    runSearch();
                }
                else if (answer.id === "q") {

                    endApplition()
                } else if
                    (isNaN(answer.id) || answer.id > 11 || answer.id < 1) {
                    console.log("Please enter a valid ID");
                    runSearch()


                } else {

                    var quant = getQuantity(answer.id);
                    quant.then(function (result) {
                        // console.log("answer.id=" + answer.id);
                        console.log("result" + result)
                        checkQuantity(answer.id, result)
                    })

                }

            });
    } else {
        calculateBill()

    }


};

function getQuantity(productID) {

    var qual = inquirer
        .prompt({
            name: "number",
            type: "input",
            message: "Please input the number of item to purchase: ",

        })
        .then(function (answer) {
            // console.log(answer.number);

            if (isNaN(answer.number) || answer.number < 1) {
                console.log("Please enter a valid number");
                getQuantity();
            }
            else {
                console.log(productID, answer.number);
                // quantity = answer.number;
                return answer.number;
                // console.log("returned qantity" + quant);
            }

        });
    return qual;
}


function checkQuantity(productID, quan) {


    var quad = [];
    connection.query("select stock_quantity,product_name,price from products where id =?", [productID],

        function (err, res) {

            if (quan > res[0].stock_quantity) {
                console.log("There is no enough inventory for this item");
                runapplication()
            } else {
                createShoppingItem(productID, res[0].product_name, quan, (res[0].stock_quantity - quan), res[0].price);
            }

        });

}
function createShoppingItem(id, name, quan, quanRemain, price) {

    console.log("remainder quan=" + quanRemain);
    var list = new Item(name, quan, price);
    purchaseList.push(list);
    // console.log(purchaseList);
    console.log(purchaseList[0].calculate());
    var query = connection.query(
        "UPDATE products SET stock_quantity=? WHERE id=?",
        [quanRemain
            ,
            id
        ],
        function (err, res) {
            console.log(res.affectedRows + " Item added!\n");
            runapplication();
        }
    );

}


function calculateBill() {
    var finalBill = {};
    var total = 0;
    for (var i = 0; i < purchaseList.length; i++) {

        console.log(purchaseList[i]);
        var unitTotal = purchaseList[i].calculate();
        total += parseFloat(unitTotal);
        var bill = {};
        bill["Product Name"] = purchaseList[i].item;
        bill["Product quantity"] = purchaseList[i].quantity;
        bill["Unit Price $"] = purchaseList[i].price;
        bill["Item total $"] = unitTotal;
        finalBill[(i + 1)] = bill;

        console.log(finalBill);
    }
    console.table(finalBill);
    console.log("Total Amount>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>   $" + total.toFixed(2));
    console.log();
    console.log();
    endOfQuery()
}


function endOfQuery() {

    inquirer
        .prompt({
            name: "command",
            type: "input",
            message: "Please input the n for the next client or q to quit: ",

        })
        .then(function (answer) {
            console.log(answer.command);

            if (answer.command === 'q') {

                endApplition()
            } else if (answer.command === 'n') {
                purchaseList = [];
                checkout = false;
                runapplication();
            } else {
                endOfQuery();
            }

        });
}

function endApplition() {
    console.log("Ending the application, Goodbye!!!!!");
    connection.end();
}


