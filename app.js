const xlsx = require("node-xlsx").default;
const axios = require("axios");

const workSheetsFromFile = xlsx.parse(`${__dirname}/books.xlsx`);
const books = workSheetsFromFile[0].data;
const authors = workSheetsFromFile[1].data;

axios
  .post("http://localhost:3000/api/categories")
  .then(function(response) {
    console.log(response.data);
  })
  .catch(function(error) {
    console.log(error);
  });
