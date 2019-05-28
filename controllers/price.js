const model = require("../models/index");
const { Price } = model;

/**
 * @description postPrice demo REST API
 * @param {Object} req Request Object
 * @param {Object} res Response Object
 * @return {Object} JSON object of id and price or Error
 */
async function postPrice(req, res) {
  const productIds = req.body.productIds;
  console.log(productIds);
  try {
    const promises = productIds.map(getPrice);
    Promise.all(promises)
      .then(results => {
        console.log(results);
        const restResponse = { prices: results };
        res.status(200).json(restResponse);
      })
      .catch(err => {
        console.error(err);
      });
  } catch (e) {
    res.status(500).json(e);
  }
}

/**
 * @description getPrice function to query the database for a matching product Id and price
 * @param {String} productId product Id to match in database
 * @returns {Object}
 */
const getPrice = function(productId) {
  return Price.findOne({
    raw: true,
    where: { productId: productId }
  })
    .then(product => {
      console.log(product);
      return {
        productId: productId,
        price: product.price
      };
    })
    .catch(err => {
      console.error(err);
      return {
        productId: productId,
        price: null
      };
    });
};

module.exports = {
  postPrice
};
