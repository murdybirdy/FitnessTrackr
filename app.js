require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const apiRouter = require('./api'); // references the index.js in that folder by default
const client = require('./db/client');

app.use(cors());

// Setup your Middleware and API Router here
const morgan = require('morgan');
app.use(morgan('dev'));
app.use(express.json());
app.use('/api', apiRouter);
client.connect();

app.use((error, req, res, next) => {
  res.send({
    error: error.error,
    message: error.message,
    name: error.name
  });
  next();
});

module.exports = app;
