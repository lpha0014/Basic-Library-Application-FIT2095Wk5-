Basic library application. It has the ability to add new books, update, delete and list the available books. The app has the following specifications:

It uses MongoDB to store all the entries instead of arrays
Each book has the following fields: title, author, ISBN, data of publication, summary, Pages
Functionalities:
- add new book: adds a new document (i.e. new book) to the DB
- Get all books: shows all the books in a table format
- Delete book by ISBN: the page takes an ISBN as input and deletes its document from the DB
- Update a book by ISBN: the page takes an ISBN and all other fields as input. The server must update all the fields for that given ISBN.
- redirect the client to the get all books page after the insert, update and delete operations.
