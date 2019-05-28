@RestResource(urlMapping='/pricing/*')
global without sharing class CPQB_ExtPricing {

    @HttpPost
    global static String postExternalPricing(List<String> productIds) {
        System.debug('CPQB_ExtPricing | postExternalPricing');
        System.debug(productIds);
        
        // Set up the HTTP request to the external service
        String urlToQuery = 'https://thdx-qcp-rest.herokuapp.com/api/price/';
        HttpRequest req = new HttpRequest();
        req.setEndpoint(urlToQuery);
        req.setMethod('POST');
        req.setHeader('Content-Type', 'application/json');
        req.setHeader('Accept', 'application/json');

        //Generate the JSON that we are sending to the endpoint
        JSONGenerator gen = JSON.createGenerator(false);
        gen.writeStartObject();
        gen.writeFieldName('productIds');
        gen.writeObject(productIds);
        gen.writeEndObject();

        System.debug(gen.getAsString());
        String json = gen.getAsString();

        // Set the Body and send the request
        req.setBody(json);
        Http http = new Http();
        HTTPResponse res = http.send(req);

        // Get the response from the external system and return it
        String returnValue = res.getBody();
        System.debug(res.getBody());
        return returnValue;
    }

}