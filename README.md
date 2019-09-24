# Achieve Real Time Pricing using CPQ Quote Calculator Plugin &amp; Restful APEX

TrailheaDX 2019 session

## Salesforce CPQ Quote Calculator Plugin

THDX-Pricing-QCP.js

Create a new Custom Script (SBQQ**CustomScript**c sObject) in Salesforce.
Name the new Custom Script.
Copy the QCP javascript code into the Code field on the Custom Script.
Save the Custom Script.
Copy the name of the custom script.

In Salesforce navigate to Setup -> Installed Packages -> Salesforce CPQ and click configure.

Go to the Plugins tab in Salesforce CPQ settings and add the new Custom Script name into the Quote Calculator Plugin field.

## Apex REST class

QCP-REST folder

In the force-app/main/default/classes folder there is a single Apex class

CPQB_ExtPricing.cls

You can either create a new Apex class in Salesforce and copy in the code or use SFDX to deploy to the org.

## Heroku App

index.js
Procfile
package.json
controllers/
models/
public/
routes/

Simple NodeJS app that can be run on Heroku with the free postgres DB add-on.

[![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)

Create a new heroku app.
Add the heroku remote to your local copy.
Push to heroku to deploy the app and get it running.
