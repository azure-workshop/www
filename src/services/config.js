var path = require("path");
var config = require("nconf");

config.argv()
   .env()
   .file(path.join(__dirname, "..", "config.json"));

var service = {
   azure: {
      storage: {
         name: config.get("Azure.Storage.Name"),
         key: config.get("Azure.Storage.Key")
      }
   },
   sendgrid: {
      key: config.get("SendGrid.APIKey")
   }
};

module.exports = service;