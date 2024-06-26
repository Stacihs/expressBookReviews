const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;
    const newUser = { "username": username, "password": password };
    const usernameExists = users.some(function (user) {
        return user.username === newUser.username;
    });
    if (usernameExists) {
        return res.status(400).json({ message: "That username already exists. Choose another one." });
    } else if (username === "" || password === "") {
        return res.status(400).json({ message: "Username and/or password cannot be empty" });
    } else {
        users.push(newUser);
        return res.status(201).json({ message: "The user" + (' ') + (newUser.username) + " has been added!" });
    }
});


// Get the book list available in the shop
public_users.get('/', function (req, res) {
    new Promise((resolve, reject) => {
        resolve(JSON.stringify(books, null, 4));
    })
    .then(jsonString => {
        res.setHeader('Content-Type', 'application/json');
        res.send(jsonString);
    })
    .catch(err => {
        res.status(500).send(err);
    });
});


// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
    let isbn = parseInt(req.params.isbn);
    new Promise((resolve, reject) => {
        let book = books[isbn];
        resolve(book);
    })
        .then(book => {
            return res.status(200).json({ message: "Success", book });
        })
        .catch(err => {
            console.log("Error:", err);
            res.status(400).json({ message: "Book not found" });
        })
});



// Get book details based on author
public_users.get('/author/:author', function (req, res) {
    const author = req.params.author;
    new Promise((resolve, reject) => {
        let filtered_authors = [];
        for (let bookId in books) {
            if (books.hasOwnProperty(bookId)) {
                let book = books[bookId];
                if (book.author === author) {
                    filtered_authors.push(book);
                }
            }
        }
        resolve(filtered_authors);
    })
        .then(filtered_authors => {
            return res.status(200).json({ message: "Success", filtered_authors });
        })
        .catch(err => {
            console.log("Error", err);
            return res.status(400).json({ message: "Author not found" });
        })
});


// Get all books based on title
public_users.get('/title/:title', function (req, res) {
    const title = req.params.title;
    new Promise((resolve, reject) => {
        let filtered_titles = [];
        for (let bookId in books) {
            if (books.hasOwnProperty(bookId)) {
                let book = books[bookId];
                if (book.title === title) {
                    filtered_titles.push(book);
                }
            }
        }
        resolve(filtered_titles);
    })
        .then(filtered_titles => {
            return res.status(200).json({ message: "Success", filtered_titles });
        })
        .catch(err => {
            console.log("Error", err);
            return res.status(400).json({ message: "Title not found" });
        })
});


//  Get book review
public_users.get('/review/:isbn', function (req, res) {
    let isbn = parseInt(req.params.isbn);
    let filtered_reviews = books[isbn].reviews;
    res.send(filtered_reviews);
    return res.status(200).json({ message: "Success" });
});

module.exports.general = public_users;
