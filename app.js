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
        var author;
        var category;
        var book;

        var booksAuthor = authors.find(a=> a.name === books[i].author);
        await axios.put("http://localhost:3000/api/authors", booksAuthor).then(response => {
            author = response.data.response;
        },async (error) => {
            if(error.response.data.response === "Author already exists")
            {
                await axios.post("http://localhost:3000/api/authors",{filter: booksAuthor}).then(response =>{
                    author = response.data.response[0];
                }, error => {
                    
                error.response.data.row = i;
                errorHandler(error.response.data);
                });
            }
            else{
                error.response.data.row = i;
                errorHandler(error.response.data);
            }
        });

        if(author)
        {
            await axios.put("http://localhost:3000/api/categories", {name: books[i].category}).then(response => {
                category = response.data.response;
            },async (error) => {
                if(error.response.data.response === "Category already exists")
                {
                    await axios.post("http://localhost:3000/api/categories",{filter: {name: books[i].category}}).then(response =>{
                        category = response.data.response[0];
                    }, error => {
                        
                    error.response.data.row = i;
                    errorHandler(error.response.data);
                    });
                }
                else
                {
                    error.response.data.row = i;
                    errorHandler(error.response.data);
                }
            });

            if(category)
            {
                books[i].author = author.id;
                books[i].category = category.id;
                await axios.put("http://localhost:3000/api/books", books[i]).then(response => {
                    book = response.data.response;
                },error => {
                    error.response.data.row = i;
                    errorHandler(error.response.data);
                });
                
                if(book) console.log(book);
            }   
        }
    }
})();
