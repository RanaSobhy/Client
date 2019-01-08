const axios = require("axios");
const errorHandler = require("./Handler/error");
const excelToJson = require("convert-excel-to-json");
const express = require("express");
const app = express();
var errorsArray = [];
app.use(express.json());

app.get("/api/add", async (req, res) => {
  errorsArray = [];

  var BooksAdded = 0;
  var errors = 0;
  const result = excelToJson({
    sourceFile: "books.xlsx",
    columnToKey: {
      "*": "{{columnHeader}}"
    }
  });
  const books = result["books"];
  const authors = result["authors"];

  for (var i = 1; i < books.length; i++) {
    var author;
    var category;
    var book;

    var booksAuthor = authors.find(a => a.name === books[i].author);
    await axios.put("http://localhost:3000/api/authors", booksAuthor).then(
      response => {
        author = response.data.response;
      },
      async error => {
        if (error.response.data.response === "Author already exists") {
          await axios
            .post("http://localhost:3000/api/authors", { filter: booksAuthor })
            .then(
              response => {
                author = response.data.response[0];
              },
              error => {
                error.response.data.row = i;
                errorsArray.push(error.response.data);
                errorHandler(error.response.data);
                errors += 1;
              }
            );
        } else {
          error.response.data.row = i;
          errorsArray.push(error.response.data);
          errorHandler(error.response.data);
          errors += 1;
        }
      }
    );

    if (author) {
      await axios
        .put("http://localhost:3000/api/categories", {
          name: books[i].category
        })
        .then(
          response => {
            category = response.data.response;
          },
          async error => {
            if (error.response.data.response === "Category already exists") {
              await axios
                .post("http://localhost:3000/api/categories", {
                  filter: { name: books[i].category }
                })
                .then(
                  response => {
                    category = response.data.response[0];
                  },
                  error => {
                    error.response.data.row = i;
                    errorsArray.push(error.response.data);
                    errorHandler(error.response.data);
                    errors += 1;
                  }
                );
            } else {
              error.response.data.row = i;
              errorsArray.push(error.response.data);
              errorHandler(error.response.data);
              errors += 1;
            }
          }
        );

      if (category) {
        books[i].author = author.id;
        books[i].category = category.id;
        await axios.put("http://localhost:3000/api/books", books[i]).then(
          response => {
            book = response.data.response;
            BooksAdded += 1;
          },
          error => {
            error.response.data.row = i;
            errorsArray.push(error.response.data);
            errorHandler(error.response.data);
            errors += 1;
          }
        );
      }
    }
  }

  res.send({
    BooksAdded,
    errors,
    message: "to view errors go to http://localhost:8080/api/errors"
  });
});

app.get("/api/errors", async (req, res) => {
  res.send(errorsArray);
});

const port = process.env.PORT || 8080;
app.listen(port, () => console.log(`Listening on port ${port}...`));

module.exports.app = app;
