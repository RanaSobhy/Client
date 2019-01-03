const axios = require("axios");
const errorHandler = require("./Handler/error");
const excelToJson = require('convert-excel-to-json');
 
const result = excelToJson({
    sourceFile: 'books.xlsx',
    columnToKey: {
        '*': '{{columnHeader}}'
    }
});
const books = result["books"];
const authors = result["authors"];

// var book = {};
// book[books[0][0]] = books[1][0];
// book[books[0][1]] = books[1][1];
// book[books[0][2]] = books[1][2];
// book[books[0][3]] = books[1][3];
// book[books[0][4]] = books[1][4];
// book[books[0][5]] = books[1][5];
// book[books[0][6]] = books[1][6];
// book[books[0][7]] = books[1][7];

// console.log(book);

// for (var i = 1; i < books.length; i++) {

//   axios
//     .put("http://localhost:3000/api/categories", {
//       name: books[i].category
//     })
//     .then(function(response) {
//       console.log(response.status);
//       console.log(response.data);
//     })
//     .catch(function(error) {
//       errorHandler({
//         status: error.response.status,
//         message: error.response.data.response
//       });
//     });
// }
