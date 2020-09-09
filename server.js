//import packages
const mongodb = require('mongodb'); //get instance of MongoDB
const MongoClient = mongodb.MongoClient; //reference MongoDB client - configure MongoDB
const url = 'mongodb://localhost:27017/'; //url to MongoDB server
const express = require("express");
const bodyparser = require('body-parser');
var randomstring = require("randomstring");
//const morgan = require('morgan');
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
let db;//reference to the database (i.e. collection)
MongoClient.connect(url, { useNewUrlParser: true },
    function (err, client) {
        if (err) { //err object that gets value if an error occurs
            console.log("Err  ", err);
        } else {
            console.log("Connected successfully to server");
            db = client.db("fit2095db");
        }
    });
//Routes Handlers
//GET request: send the page to the client
app.get('/', function (req, res) {
    res.sendFile(__dirname + '/views/index.html');
});
//List all books
//GET request: send the page to the client. Get the list of documents from the collections and send it to the rendering engine
app.get('/getBooks', function (req, res) {
    db.collection('books').find({}).toArray(function (err, data) {
        res.render('getBooks', { bookDB: data });
    });
});
//Update book: 
//GET request: send the page to the client 
app.get('/updateBook', function (req, res) {
    res.sendFile(__dirname + '/views/updateBook.html');
});
app.get('/addBook', function (req, res) {
    let isbn = randomstring.generate({
        length: 13,
        charset: 'numeric'
      });
    res.render('addBook.html', {bookDB: db, isbn: isbn})
});
app.get('/getBooks', function (req, res) {
        let ID = Math.round(Math.random()*1000);
        res.render('getBooks.html', {bookDB:db,id:ID});
    });
app.get('/deleteBook', function (req, res) {
        res.sendFile(__dirname + '/views/deleteBook.html');
    });
//POST request: receive the details from the client and insert new document (i.e. object) to the collection (i.e. table)
app.post('/addBook', function (req, res) {
    let bookInfo = req.body;
    let ID = Math.round(Math.random()*1000);
    db.collection('books').insertOne({ id: ID, title: bookInfo.title, author: bookInfo.author, ISBN: bookInfo.ISBN, date: bookInfo.date, summary: bookInfo.summary });
    res.redirect('/getBooks'); 
});
//POST request: receive the details from the client and do the update
app.post('/updateBook', function (req, res) {
    let bookInfo = req.body;
    let filter = { ISBN: bookInfo.ISBN };
    let theUpdate = { $set: { ISBN: bookInfo.ISBN, title: bookInfo.title, author: bookInfo.author, date: bookInfo.date, summary: bookInfo.summary } };
    db.collection('books').updateOne(filter, theUpdate);
    res.redirect('/getBooks');
})
app.post('/deleteBook', function (req, res) {
    let bookDetails = req.body;
    let filter = { ISBN: bookDetails.ISBN };
    db.collection('books').deleteOne(filter);
    res.redirect('/getBooks');
});
app.get('/*',function(req,res) { //* allows any characters at that position
    res.sendFile(__dirname + '/views/404.html');
    });
console.log('http://127.0.0.1:8080/');
