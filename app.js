const xlsx = require("node-xlsx").default;

const workSheetsFromFile = xlsx.parse(`${__dirname}/books.xlsx`);
const books = workSheetsFromFile[0].data;
const authors = workSheetsFromFile[1].data;
