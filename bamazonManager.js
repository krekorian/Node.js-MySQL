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
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Quit"],

        })
        .then(function (answer) {
            // console.log(answer);
            if (answer.id === "View Products for Sale") {
                viewInventory();
            } else if (answer.id === "View Low Inventory") {
                viewLowInventory();
            } else if (answer.id === "Add to Inventory") {
                addInventory();
            } else if (answer.id === "Add New Product") {
                addProduct();
            } else if (answer.id === "Quit") {
                endApplition();
            }

        })

}



function viewInventory() {



    connection.query("Select * from products",

        function (err, res) {

            var data = {};
            for (var i = 0; i < res.length; i++) {

                var d = {};
                d["Product Name"] = res[i].product_name;
                d["Department"] = res[i].department_name;
                d["Item in stock"] = res[i].stock_quantity;
                d["Price $"] = res[i].price;

                data[res[i].id] = d;

            }
            console.table(data);
            mainMenu()

        });
}

function viewLowInventory() {



    connection.query("Select * from products",

        function (err, res) {

            var data = {};
            for (var i = 0; i < res.length; i++) {
                if (res[i].stock_quantity < 50) {
                    var d = {};
                    d["Product Name"] = res[i].product_name;
                    d["Department"] = res[i].department_name;
                    d["Item in stock"] = res[i].stock_quantity;
                    d["Price $"] = res[i].price;

                    data[res[i].id] = d;
                }


            }
            console.table(data);
            mainMenu()

        });
}

function addInventory() {
    connection.query("Select id,product_name from products",

        function (err, res) {
            var viewList = [];
            res.forEach(function (l, index) {
                viewList.push(l.id + ">" + l.product_name);
            })
            viewList.push(">>>>>Quit to Main Menu")
            console.log("Select and item to add inventory")
            inquirer
                .prompt({
                    name: "id",
                    type: "list",
                    choices: viewList,

                })
                .then(function (answer) {
                    // console.log(answer);
                    if (answer.id === ">>>>>Quit to Main Menu") {
                        mainMenu();
                    } else {
                        addingItemToInventory(answer.id);
                        // console.log(answer.id);
                    }

                })
            // console.log(viewList);
            // connection.end();
        });
}

function addingItemToInventory(productInfo) {
    var id = productInfo.split(">")[0];
    var name = productInfo.split(">")[1];
    console.log(id);
    inquirer
        .prompt({
            name: "id",
            type: "input",
            message: "Enter quantity for " + productInfo.split(">")[1],

        })
        .then(function (answer) {
            var inputQuan = parseInt(answer.id);

            if (isNaN(inputQuan) || inputQuan <= 0) {
                console.log("Enter a valid number");
                addingItemToInventory(productInfo)
            } else {
                inquirer
                    .prompt({
                        name: "id",
                        type: "list",
                        message: "Are you sure to add " + inputQuan + " items to " + productInfo.split(">")[1] + "?\n Select abort to exit Add inventory module\n",
                        choices: ["Yes", "No", "Abort"],

                    })
                    .then(function (answer) {
                        if (answer.id === "Yes") {
                            console.log();
                            saveAddedInventory(id, inputQuan, name);
                        } else if (answer.id === "No") {
                            addingItemToInventory(productInfo);
                        } else {
                            mainMenu()
                        }
                    });
            }
        });

}

function saveAddedInventory(id, quantity, name) {
    connection.query(
        "UPDATE products SET stock_quantity=stock_quantity+? WHERE id=?",
        [quantity
            ,
            id
        ],
        function (err, res) {
            console.log(quantity + " Item added to " + name + "!\n");
            addInventory();
        }
    );
}



function addProduct() {
    connection.query(
        "select department_name from products GROUP BY department_name;",

        function (err, res) {
            var dept = []
            res.forEach(l => {
                dept.push(l.department_name);
            })
            // console.log(dept);




            inquirer
                .prompt([{
                    name: "name",
                    type: "input",
                    message: "Enter item name",

                }, {
                    name: "department",
                    type: "list",
                    message: "Select department",
                    choices: dept
                }, {
                    name: "price",
                    type: "input",
                    message: "Enter item price",

                }, {
                    name: "quantity",
                    type: "input",
                    message: "Enter item quantity",

                }

                ])
                .then(function (answer) {
                    // console.log(answer);
                    if (isNaN(answer.price)) {
                        console.log();
                        console.log("You must enter a number for price");
                        console.log();
                        addProduct()
                    }
                    else if (isNaN(answer.quantity)) {
                        console.log();
                        console.log("You must enter a number for Quantity");
                        console.log();
                        addProduct()
                    } else {

                        inquirer
                            .prompt({
                                name: "id",
                                type: "list",
                                message: "\n\nAre you sure to add " + answer.name + " item to " + answer.department + " department?\n Price set to $" + answer.price + " and quantity to " + answer.quantity + "\n\nSelect abort to exit Add inventory module\n",
                                choices: ["Yes", "No", "Abort"],

                            })
                            .then(function (ans) {
                                if (ans.id === "Yes") {
                                    console.log();

                                    addProductConfirmed(answer.name, answer.department, answer.price, answer.quantity);
                                } else if (ans.id === "No") {
                                    console.log("Cancelling Add product, back to Add product\n");
                                    addProduct(productInfo);
                                } else {
                                    mainMenu()
                                }
                            });


                    }
                });

        }
    )
}

function addProductConfirmed(name, deprtment, price, quantity) {
    connection.query(
        "INSERT INTO products (product_name,department_name,price,stock_quantity) VALUES (?,?,?,?)", [name, deprtment, price, quantity],

        function (err, res) {
            console.log("Product added!");
            endOfQuery()
        });
}
function endOfQuery() {

    inquirer
        .prompt({
            name: "command",
            type: "input",
            message: "Please input the h for Home Menu or q to quit: ",

        })
        .then(function (answer) {
            console.log(answer.command);

            if (answer.command === 'q') {

                endApplition()
            } else if (answer.command === 'h') {

                mainMenu()
            } else {
                endOfQuery();
            }

        });
}


function endApplition() {
    console.log("Ending the application, Goodbye!!!!!");
    connection.end();
}










