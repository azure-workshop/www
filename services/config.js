var path = require("path");
var config = require("nconf");

config.argv()
   .env()
   .file(path.join(__dirname, "..", "config.json"));

var service = {
   azure: {
      storage: {
         name: config.get("Azure_Storage_Name"),
         key: config.get("Azure_Storage_Key")
      }
   },
   sendgrid: {
      key: config.get("SendGrid_APIKey")
   }
};

module.exports = service;