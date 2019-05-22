'use strict';

const express = require('express');
const app     = express();
require('dotenv').config()
const axios = require('axios');
const db = require('./db/db.js');
const PORT    = 8000;

app.use(express.json({url_encoded:true}));

app.get('/api/books', (req, res) => {
    const bookSearch = req.query.q
    db.getSearch(bookSearch, (err, results) => {
        if (err) {
            res.end()
        } else {
            if (!results.length) {
                axios.get(`https://www.googleapis.com/books/v1/volumes?q=${bookSearch}&key=${process.env.API_KEY}`)
                .then(data => {
                    db.postSearch(bookSearch, (err, success) => {
                        if (err) {
                            res.end()
                        } else {
                            const searchHistory_Id = success[0].searchhistory_id
                            for (let i = 0; i < data.data.items.length; i++) {
                                postAllBooks(data.data.items[i].volumeInfo, searchHistory_Id, data.data.items.length, i, res);
                            }
                        }
                    })
                    
                })
                .catch(err => {
                    res.end()
                })
            } else {
                db.getBooks(results[0].searchhistory_id, (err,data) => {
                    if (err) {
                        res.end()
                    } else {
                        res.send(data)
                    }
                })
            }
        }
    })
});

app.listen(PORT);

console.log("Listening on port:", PORT);

const postAllBooks = (volume, searchHistory_Id, length, index, res) => {
    db.postBooks(volume,searchHistory_Id, (err, data) => {
        if (err) {
            res.end()
        } else {
            if (index === length - 1) {
                db.getBooks(searchHistory_Id, (err, final) => {
                    if (err) {
                        res.end()
                    } else {
                        res.send(final);
                    }
                })
            }
        }
    });
}