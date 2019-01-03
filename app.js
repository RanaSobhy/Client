const xlsx = require("node-xlsx").default;
const axios = require("axios");
const errorHandler = require("./Handler/error");

const workSheetsFromFile = xlsx.parse(`${__dirname}/books.xlsx`);
const books = workSheetsFromFile[0].data;
const authors = workSheetsFromFile[1].data;

(async () => {
  try {
    var response = await axios.post("http://localhost:3000/api/categories");
    console.log(response.data.response);
  } catch (error) {
    errorHandler({
      status: error.response.status,
      message: error.response.data.response
    });
  }
})();
