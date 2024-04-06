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
        return res.status(404).json({message: "Username and/or password missing"});
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
    const isbn = parseInt(req.params.isbn);
    let filtered_reviews = books[isbn].reviews;
    if(filtered_reviews.length > 0) {
        let filtered_review = filtered_reviews[0];
        let review = req.query.review;
        if(review) {
            filtered_review.review = review;
        }
    }
    filtered_reviews.push(newReview);
    return res.status(300).json({ message: "Yet to be implemented" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
