var mysql = require("mysql");
var inquirer = require("inquirer");
var Table = require("cli-table2");

var connection = mysql.createConnection({
  host: "localhost",
  user: "",
  password: "",
  database: "bamazon_db",
  port: 3306
});

connection.connect();

var display = function() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    console.log("-----------------------------");
    console.log("      Welcome To Bamazon    ");
    console.log("-----------------------------");
    console.log("");
    console.log("Find below our Products List");
    console.log("");
    var table = new Table({
      head: ["Product Id", "Product Description", "Cost"],
      colWidths: [12, 50, 8],
      colAligns: ["center", "left", "right"],
      style: {
        head: ["red"],
        compact: true
        // 'padding-right' : 1,
      }
    });

    for (var i = 0; i < res.length; i++) {
      table.push([res[i].id, res[i].products_name, res[i].price]);
    }

    console.log(table.toString());
    console.log("");
    shopping();
  }); //End Connection to products
};

var shopping = function() {
  inquirer
    .prompt({
      name: "productToBuy",
      type: "input",
      message: "Please enter the Product Id of the item you wish to purchase.!"
    })
    .then(function(answer1) {
      var selection = answer1.productToBuy;
      connection.query("SELECT * FROM products WHERE Id=?", selection, function(
        err,
        res
      ) {
        if (err) throw err;
        if (res.length === 0) {
          console.log(
            "That Product doesn't exist, Please enter a Product Id from the list above"
          );

          shopping();
        } else {
          inquirer
            .prompt({
              name: "quantity",
              type: "input",
              message: "How many items woul you like to purchase?"
            })
            .then(function(answer2) {
              var quantity = answer2.quantity;
              if (quantity > res[0].stock_quantity) {
                console.log(
                  "Our Apologies we only have " +
                    res[0].stock_quantity +
                    " items of the product selected"
                );
                shopping();
              } else {
                console.log("");
                console.log(res[0].products_name + " purchased");
                console.log(quantity + " qty @ $" + res[0].price);

                var newQuantity = res[0].stock_quantity - quantity;
                connection.query(
                  "UPDATE products SET stock_quantity = " +
                    newQuantity +
                    " WHERE id = " +
                    res[0].id,
                  function(err, resUpdate) {
                    if (err) throw err;
                    console.log("");
                    console.log("Your Order has been Processed");
                    console.log("Thank you for Shopping with us...!");
                    console.log("");
                    connection.end();
                  }
                );
              }
            });
        }
      });
    });
};

display();

// //  NPM mySQL, inquirer, cli-table
// var mysql = require('mysql');
// var inquirer = require('inquirer');
// var Table = require('cli-table');
// var table = new Table({
//   head: ['Item ID', 'product', 'Name', 'Price', 'Stock'],
//   colWidths: [20, 40, 40, 10, 5]
// });

// // connection variable
// var connection = mysql.createConnection({
//   host: "localhost",
//   port: 3306,
//   user: "root",
//   password: "",
//   database: "bamazon_db"
// });

// connection.connect(function (err) {
//   if (err) throw err;
//   console.log("connected as id " + connection.threadId);
// });

// //Start the appliciton
// letsShop();

// //Displays products in database table
// function letsShop() {
//   connection.query('SELECT * FROM Products', function (err, res) {
//     // Display products and price to user. Push the recordset from the DB into the CLI-table
//     for (var i = 0; i < res.length; i++) {
//       table.push([res[i].item_id, res[i].product_name, res[i].price.toFixed(2), res[i].stock_quantity])
//     }
//     console.log(table.toString());

//     // Ask user questions for purchase
//     inquirer.prompt([{
//       // Ask user to choose a product to purchase
//       name: "choice",
//       type: "list",
//       message: "What would you like to puchase today?",
//       //This code will use the res object and grab the product names available.
//       choices: function (value) {
//         var choiceArray = [];
//         for (var i = 0; i < res.length; i++) {
//           choiceArray.push(res[i].product_name);
//         }
//         return choiceArray;
//       }
//     }, {
//       // Ask user to enter a quantity to purchase
//       name: "quantity",
//       type: "input",
//       message: "How many would you like to purchase?",
//       validate: function (value) {
//         if (isNaN(value) == false) {
//           return true;
//         } else {
//           return false;
//         }
//       }
//     }]).then(function (answer) {
//       // Grabs the entire object for the product the user chose
//       for (var i = 0; i < res.length; i++) {
//         if (res[i].product_name == answer.choice) {
//           var chosenItem = res[i];
//         }
//       }
//       // Calculate remaining stock if purchase occurs
//       var updateStock = parseInt(chosenItem.stock_quantity) - parseInt(answer.quantity);
//       var pSales = parseFloat(chosenItem.product_sales).toFixed(2);

//       // If customer wants to purchase more than available in stock, user will be asked if he wants to make another purchase
//       if (chosenItem.stock_quantity < parseInt(answer.quantity)) {
//         console.log(`${FgCyan} Insufficient quantity! ${FgWhite}`);
//         repeat();
//       }
//       // If the customer wants to purchase an amount that is in stock, the remaining stock quantity will be updated in the database and the price presented to the customer

//     }); // .then of inquirer prompt

//   }); // first connection.query of the database

// } // letsShop function

// //Function used to make the experience of the CLI mode like a program. Provides an exit choice to the user.
// function repeat() {
//   inquirer.prompt({
//     // Ask user if he wants to purchase another item
//     name: "repurchase",
//     type: "list",
//     choices: ["Yes", "No"],
//     message: "Would you like to purchase another item?"
//   }).then(function (answer) {
//     if (answer.repurchase == "Yes") {
//       letsShop();
//     }
//     else {
//       console.log(` Thanks for shopping with us. Have a great day! )
//       connection.end();
//     }
//   });
// }
