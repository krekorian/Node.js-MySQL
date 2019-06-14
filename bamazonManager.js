var mysql = require("mysql");
var inquirer = require("inquirer");
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

    mainMenu()
});

function mainMenu() {
    // console.log("Entering the function");

    inquirer
        .prompt({
            name: "id",
            type: "list",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],

        })
        .then(function (answer) {
            console.log(answer);
            if (answer.id === "View Products for Sale") {
                console.log("1111");
            } else if (answer.id === "View Low Inventory") {
                console.log("2222");
            } else if (answer.id === "Add to Inventory") {
                console.log("3333");
            } else if (answer.id === "Add New Product") {
                console.log("4444");
            }

        })

}



// function runapplication() {
//     a = "id";
//     b = "product_name";
//     c = "price";
//     var q = "Select " + a + "," + b + "," + c + " from products";

//     connection.query(q,

//         function (err, res) {

//             var data = {};
//             for (var i = 0; i < res.length; i++) {

//                 var d = {};
//                 d["Product Name"] = res[i].product_name;
//                 d["Price $"] = res[i].price;

//                 data[res[i].id] = d;

//             }
//             console.table(data);
//             runSearch()

//         });
// }










