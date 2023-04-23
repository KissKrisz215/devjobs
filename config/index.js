// We reuse this import in order to have access to the `body` property in requests
const express = require("express");

// ℹ️ global package used to `normalize` paths amongst different operating systems
const path = require("path");

const cookieParser = require("cookie-parser");
const session = require("express-session");

// Middleware configuration
module.exports = (app) => {
  // To have access to `body` property in the request
  app.use(express.json());
  app.use(session({
    secret: process.env.SESS_SECRET,
  }))
  app.use(express.urlencoded({ extended: false }));
  // Normalizes the path to the views folder
  app.use(cookieParser());
  app.set("views", path.join(__dirname, "..", "views"));

  // Sets the view engine to handlebars
  app.set("view engine", "hbs");
  
  // Handles access to the public folder
  app.use(express.static(path.join(__dirname, "..", "public")));
};