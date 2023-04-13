// ℹ️ Gets access to environment variables/settings
require('dotenv/config');
// Handles http requests (express is node js framework)
const express = require('express');
require("./db");
// Handles the handlebars
const hbs = require('hbs');
const app = express();

// ℹ️ This function is getting exported from the config folder. It runs most middlewares
require('./config')(app);

// 👇 Start handling routes here
const index = require('./routes/index');
app.use('/', index);

// ❗ To handle errors. Routes that don't exist or errors that you handle in specific routes
require('./error-handling')(app);

module.exports = app;