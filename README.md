# Northcoders News API

An Express server built on NodeJS and PostgreSQL with a list of available API endpoints, to serve up data on:

* topics
* users
* articles
* comments

The application is designed to store and manage articles with users able to comment and vote on articles.

## Getting Started

To run the application on a local development machine, clone or fork the project from: https://github.com/hayeskg/portfolio_nc_news 

### Prerequisites 

* NodeJS: https://nodejs.org/en/download/ 
* PostgreSQL: https://www.postgresql.org/download/ 

### Run locally

To start the application after download navigate to the directory and run the following commands:
```
npm i -D
```
This will install developer dependencies as outlined in the package.json file.

Once the dependencies are installed, only the following command will be needed:
```
npm run start
```
This will start the server and run it locally on PORT 9090 - use client to access the API endpoints.

### Test mode

To verify server functionality, simply run:
```
npm test app
```
This will initiate a Jest [https://jestjs.io/] test suite and provide feedback on individiual endpoints and methods - happy paths and edge cases.

For database realted scripts, please see package.json file.


## Available API endpoints

* GET /api/topics
* GET /api/users/:username
* GET /api/articles/:article_id
* PATCH /api/articles/:article_id
* POST /api/articles/:article_id/comments
* GET /api/articles/:article_id/comments
* GET /api/articles
* PATCH /api/comments/:comment_id
* DELETE /api/comments/:comment_id
* GET /api

## Authors

Kristof Hayes - Northcoders