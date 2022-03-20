const express = require('express');
const routes = require('./routes/main');

const app = express();

app.use(routes);

module.exports = app;
