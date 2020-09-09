const mongoose = require('mongoose'); //reference mongoose package
//referencing schemas
const Author = require('./models/author');
const Book = require('./models/books');
let url='mongodb://localhost:27017/libDB';//url to MongoDB server

//import packages
const express = require("express");
const bodyparser = require('body-parser');
var randomstring = require("randomstring");

//Configure Express
const app = express();
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.static('public'));
app.use(bodyparser.urlencoded({ extended: false }));
app.listen(8080);

//static files
app.use(express.static('css'));
app.use(express.static('images'));

app.get('/', function (req, res) {
            res.sendFile(__dirname + '/views/index.html');
        });

//1. Insert a new Author: adds a new document to ‘Authors’ collection
app.get('/addAuthors', function (req, res) {
        res.render(__dirname + '/views/addAuthors.html')
    });

//2. Get all Authors page: shows all the Authors in a table format (including the _id field)
app.get('/getAuthors', function (req, res) {
    Author.find({},function (err,docs) {
        if (err) {
        console.log(err); 
    }
    res.render(__dirname + '/views/getAuthors.html', {authDB:docs});
     });
});

app.post('/addAuthors', function (req, res) {
        //add new document
        let author1 = new Author({
            _id: new mongoose.Types.ObjectId(),
            name: {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
            },
            dob: req.body.dob,
            address: {
                state: req.body.state,
                suburb: req.body.suburb,
                street: req.body.street,
                unit: req.body.unit
            },
            numBooks: req.body.numBooks,
        });
        author1.save(function (err, docs) {
            if (err) {
                console.log(err);
                res.redirect('/addAuthors'); }
            else{res.redirect('/getAuthors')}
        });
});

//3. Insert new book page
app.get('/addBook', function (req, res) {
        let isbn = randomstring.generate({
            length: 13,
            charset: 'numeric'
          });
        res.render(__dirname + '/views/addBook.html', {isbn: isbn})
    });

//4. Get all books page: shows all the books in a table format
app.get('/getBooks', function (req, res) {
    Book.find({}).populate('author').exec(function (err, docs) {//bring all books, each book has author id and populate takes authorid to get all details
        console.log(docs)
        res.render('getBooks.html', {bookDB: docs});
     });
    });

app.post('/addBook', function (req, res) {
        var book1 = new Book({
        _id: new mongoose.Types.ObjectId(),
        title: req.body.title,
        author: req.body.author,
        isbn: req.body.isbn,
        date: req.body.date,
        summary: req.body.summary
    });
    
        console.log(book1)
        book1.save(function (err) {
            if (err) {console.log(err)}
            res.redirect('/getBooks');
    })
 
        Author.findByIdAndUpdate({_id: req.body.author},{$inc: {numBooks: 1}}, function(err,docs){
            console.log(docs)
            if(err) {
                console.log(err)
                res.redirect('/addBooks')
            }
    });
});

//5.  Delete book by book ISBN
app.get('/deleteBook', function (req, res) { //send page to client to enter isbn
            res.sendFile(__dirname + '/views/deleteBook.html');
        });

app.post('/deleteBook', function (req, res) {
    Book.deleteOne({ isbn: req.body.isbn }, function (err, doc) {
        console.log(doc);
    });
        res.redirect('/getBooks');
    });

//6. Update Author status by _id
//the page takes as input the author _id and the number of books written by that author. 
//It sets the new number of books to the author with _id.
app.get('/updateAuthor', function (req, res) {
        res.sendFile(__dirname + '/views/updateAuthor.html');
    });

app.post('/updateAuthor', function (req, res) {
    let details = req.body;
    let newDetails = details.newnumBooks;
    let theUpdate = { $set: {numBooks:newDetails} };
    Author.findByIdAndUpdate({ _id: req.body.id }, theUpdate, {new:true},function (err, doc) {
        console.log(doc);
    });
        res.redirect('/getAuthors');
    });

mongoose.connect(url, function (err) {
    if (err) {
        console.log('Error in Mongoose connection');
            throw err;
    }
    console.log('Successfully connected');
    });

app.get('/*',function(req,res) { //* allows any characters at that position
        res.sendFile(__dirname + '/views/404.html');
        });

console.log('http://127.0.0.1:8080/');