/**
 * Price Routes module.
 * @module routes/price
 * @description Routes defining the pricing API (v1).
 */

const express = require("express");
const router = express.Router();

const priceController = require("../controllers/price.js");

/**
  @description all the routes defined here should hold the version of this api in order to allow code regression
 */
router.post("/price/", priceController.postPrice);

module.exports = router;
