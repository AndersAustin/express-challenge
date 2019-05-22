DROP DATABASE IF EXISTS bookshelf;
create database bookshelf;
\c bookshelf; 

CREATE TABLE searchHistory (
  searchHistory_id serial PRIMARY key,
  searchString varchar(50) NOT NULL UNIQUE,
  created_at timestamp
);

/*
I decided not to use join tables for authors and categories in the interest of time, as well as creating more readable code for the 
challenge. I'd be happy to refactor the code to utilize a schema more conforming to 3rd normalized form if the team would like to see
my capabilities in that area
*/

CREATE TABLE books (
  book_id SERIAL PRIMARY KEY,
  title VARCHAR (100) NOT NULL,
  authors varchar(100) not null, --concatenated array
  descr varchar(140) not null,
  categories varchar(100) not null, --concatenated array
  publisher varchar(100) not null,
  Published_date varchar(20) not null,
  preview_link varchar(500) not null,
  searchHistory_id INT references searchHistory(searchHistory_id)
);

CREATE INDEX idx_searchHistory 
ON searchHistory(searchString);

alter table searchHistory
alter column created_at set default now();