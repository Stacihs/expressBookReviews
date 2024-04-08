const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
    let sameusername = users.some(function (user) {
        return user.username === username;
    });
    if (sameusername.length > 0) {
        return true;
    } else {
        return false;
    }
};

const authenticatedUser = (username, password) => {
    let validusers = users.filter(function (user) {
        return ((user.username === username) && (user.password === password));
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
};

//only registered users can login
regd_users.post("/login", (req, res) => {
    const username = req.query.username;
    const password = req.query.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Username and/or password missing" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    };
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        if (book.reviews.hasOwnProperty(username)) {
            book.reviews[username].review = review;
            return res.status(200).json({ message: "Review modified successfully" });
        } else {
            // Add a new review for the user
            book.reviews[username] = {
                review: review,
            };
            return res.status(200).json({ message: "Review added successfully" });
        }
    } else {
        return res.status(404).json({ message: "Book not found" });
    }
});

// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
    const isbn = req.params.isbn;
    const review = req.query.review;
    const username = req.session.authorization.username;

    if (books.hasOwnProperty(isbn)) {
        const book = books[isbn];
        deletedReviews = [];
        if (book.reviews.hasOwnProperty(username)) {
            book.reviews[username].review = review;
            if(book.reviews[username] === username) {
                deletedReviews.push(review);
            }
            return res.status(200).json({ message: "Review deleted successfully" });
        } 
    }
});



module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
