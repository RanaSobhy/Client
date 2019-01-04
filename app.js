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

( async  () => {
    for (var i = 1; i < books.length; i++) {
        try{
            var booksAuthor = authors.find(a=> a.name === books[i].author);
            var author = await axios
            .put("http://localhost:3000/api/authors", booksAuthor);

            var category = await axios
            .put("http://localhost:3000/api/categories", {
            name: books[i].category
            });

            books[i].author = author.data.response.id;
            books[i].category = category.data.response.id;

            var book = await axios
            .put("http://localhost:3000/api/books", books[i]);

            console.log(book.data);
        }
        catch(error){
            error.response.data.row = i;
            errorHandler(error.response.data);
        }
    }
})();
