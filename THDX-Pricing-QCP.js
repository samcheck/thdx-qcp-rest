/**
 * @file THDX-Pricing-QCP.js
 * @author Sam Check
 * @since 1.0.0
 * @description Sample Salesforce CPQ Quote Calculator Plugin for demoing a call out to an external system
 * @license MIT
 */

// Path to Apex REST Resource
const PATH = "/services/apexrest/pricing/";

/**
 * This method is called by the calculator before calculation begins, but after formula fields have been evaluated.
 * @param {QuoteModel} quote JS representation of the quote being evaluated
 * @param {QuoteLineModel[]} lines An array containing JS representations of all lines in the quote
 * @param {Object} conn JSforce connection object
 * @returns {Promise}
 */

export function onBeforeCalculate(quote, lines, conn) {
  // Logging of models provided
  console.log("--- QCP: start onBeforeCalculate function ---");
  console.log("Quote Model: ");
  console.log(quote);
  console.log("Quote Line Models: ");
  console.log(lines);

  if (lines.length === 0) {
    console.log("No quotelines, skipping call to External Pricing Service");
    console.log("--- QCP: end onBeforeCalculate function ---");
    return Promise.resolve();
  }

  // Generate the request body to be sent
  const productIds = lines.map(line => line.Product__c);
  const body = {
    productIds: [...new Set(productIds)]
  };

  // Construct the URL to call
  const baseUrl = conn.instanceUrl + PATH;
  // replace the SBQQ visualforce domain with Salesforce my domain
  const url = baseUrl.replace("--sbqq.visualforce", ".my.salesforce");

  console.log(`URL: ${url}`);
  console.log("Request Body: ");
  console.log(body);

  // Make Post Request to Salesforce Apex REST class
  // JSforce conn returns a promise
  return conn
    .requestPost(url, body)
    .then(res => {
      // Parse the response
      const priceResponse = JSON.parse(res);
      console.log("Response: ");
      console.log(priceResponse);
      const extPrices = priceResponse.prices;

      // Price the quote lines based on response
      priceLines(lines, extPrices);
      console.log("--- QCP: end onBeforeCalculate function ---");
    })
    .catch(err => {
      // catch any errors
      console.log("External Pricing Error", err);
    });
}

/**
 * This method is used to reprice quote lines based on an array of external prices
 * @param {QuoteLineModel[]} lines An array containing JS representations of all lines in the quote
 * @param {Array} priceArray An array containing JS representations of all lines in the quote
 * @returns {Promise}
 */

function priceLines(lines, priceArray) {
  lines.forEach(line => {
    // Find the external price object by matching the product Id
    // in the response to the product Id on the quote line record
    let externalPrice = priceArray.find(price => {
      return price.productId === line.record.SBQQ__Product__c;
    });

    console.log(
      `Line #${line.record.SBQQ__Number__c} - ${
        line.record.SBQQ__ProductName__c
      }:`
    );
    console.log(externalPrice);

    // Check if there is an external price object
    if (externalPrice) {
      // Check if the price is not null
      if (externalPrice.price != null) {
        // Use the Special Price field on the quote line to put the
        // external price in. Also set a timestamp on the line.
        line.record.SBQQ__SpecialPrice__c = externalPrice.price;
        line.record.SBQQ__SpecialPriceType__c = "Custom";
        line.record.SBQQ__SpecialPriceDescription__c =
          "Price received from external system";

        line.record.Last_External_Calculated_Time__c = new Date().toISOString();
      
      } else {
        // If no external price, log it on the line and set a timestamp.
        line.record.SBQQ__SpecialPriceDescription__c =
          "No price from external system";

        line.record.Last_External_Calculated_Time__c = new Date().toISOString();
      }
    }
  });
}
