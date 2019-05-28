"use strict";

const express = require("express");

const port = process.env.PORT || 5000;
const app = express();
const bodyParser = require("body-parser");
const models = require("./models/index");

app.use(bodyParser.json()); // for parsing application/json
// Serve static files
app.use(express.static(__dirname + "/public"));

// Routes assignment
// pricing route
app.use("/api", require("./routes/price"));

// Log unhandled Promise rejections
process.on("unhandledRejection", (reason, p) => {
  console.error(`Unhandled Rejection at: Promise ${p} reason: ${reason}`);
});

//Handle unknown routes
app.use((req, res) => {
  console.error("The request didn't match any endpoint");
  return res.status(404).send("404 – Not Found");
});

// Connect to the database and then Serve the app
models.sequelize.sync().then(() => {
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
});
