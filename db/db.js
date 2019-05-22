const { Client } = require("pg");
require("dotenv").config();

const client = new Client({
  user: process.env.DB_USER,
  host: 'localhost',
  database: 'bookshelf',
  password: process.env.DB_PASS,
  port: 5432
});

client.connect(err => {
  if (err) {
    console.log("error connecting to client at DB :", err);
  } else {
    console.log("connected to DB");
  }
});

//check to see if the current search has been searched before
const getSearch = (searchString, cb) => {
    client.query(`select searchHistory_id from searchHistory where searchString = '${searchString}'`, (err, data) => {
        if (err) {
            cb(err);
        } else {
            cb(null,data.rows);
        }
    })
};

//using the product from getSearch, query the books table to get the info
const getBooks = (searchHistoryID, cb) => {
  client.query(`SELECT title, authors, descr, categories, publisher, published_date, preview_link FROM books WHERE searchHistory_id = ${searchHistoryID}`, (err, data) => {
      if (err) {
        cb(err);
      } else {
        cb(null, data.rows);
      }
    });
};

const postSearch = (searchString, cb) => {
    client.query(`insert into searchHistory (searchString) values ('${searchString}')`, (err, data) => {
        if (err) {
            cb(err);
        } else {
            client.query(`select searchHistory_id from searchHistory where searchString = '${searchString}';`, (err, data) => {
                if (err) {
                    console.log(err)
                    cb(err);
                } else {
                    cb(null, data.rows);
                }
            })
        }
    })
};

const postBooks = (data, searchHistory_id, cb) => {
    client.query(`insert into books (title, authors, descr, categories, publisher, published_date, preview_link, searchHistory_id) 
    values ('${data.title ? data.title.replace(`'`,`''`) : ''}', 
            '${data.authors ? data.authors.join(', ').replace(`'`,`''`) : ''}', 
            '${data.description ? data.description.slice(0,140).replace(`'`,`''`) : ''}', 
            '${data.categories ? data.categories.join(', ').replace(`'`,`''`) : ''}',
            '${data.publisher ? data.publisher.replace(`'`,`''`) : ''}', 
            '${data.publishedDate ? data.publishedDate.replace(`'`,`''`) : ''}',
            '${data.previewLink ? data.previewLink : ''}',
            ${searchHistory_id})`, 
            (err, data) => {
                if (err) {
                    cb(err);
                } else {
                    cb(null, data);
                }
            })
};

module.exports = { getSearch, getBooks, postSearch, postBooks };