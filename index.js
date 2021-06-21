"use strict";

const express = require("express");
const helmet = require("helmet");
const bodyParser = require("body-parser");
const models = require("./models/index");

const port = process.env.PORT || 5000;
const app = express();
app.use(helmet());

app.use(bodyParser.json()); // for parsing application/json
// Serve static files
app.use(express.static(__dirname + "/public"));
console.log('after public')

// Routes assignment
// pricing route
app.use("/api", require("./routes/price"));
console.log('after price api')

// Log unhandled Promise rejections
process.on("unhandledRejection", (reason, p) => {
  console.error(`Unhandled Rejection at: Promise ${p} reason: ${reason}`);
});
console.log('after unhandled rejection')

//Handle unknown routes
app.use((req, res) => {
  console.error("The request didn't match any endpoint");
  return res.status(404).send("404 – Not Found");
});
console.log('before sequalize')

// Connect to the database and then Serve the app
models.sequelize.sync().then(() => {
  console.log('sequalize sync')
  app.listen(port, () => {
    console.log(`App listening on port ${port}!`);
  });
});
