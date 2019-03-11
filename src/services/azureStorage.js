const config = require("./config");
const azure = require("azure-storage");
const tableSvc = azure.createTableService(config.get("azureAccountName"), config.get("azureAccountKey"));


var storage = {};

storage.init = function () {
    tableSvc.createTableIfNotExists('users', function (error, result, response) {
        console.log(result)
    });
    tableSvc.createTableIfNotExists('confirm', function (error, result, response) {
        console.log(result)
    });
};

storage.insert = function (tableName, entity) {
    tableSvc.insertEntity(tableName, entity, function (error, result, response) {
        if (!error) {
            console.log(result);
        }
        console.log(error);
    });
};

storage.retrieve = function (tableName, PartitionKey, RowKey, callback) {
    tableSvc.retrieveEntity(tableName, PartitionKey, RowKey, function (error, result, response) {
        if (!error) {
            callback(result);
        }
        else {
            callback(null);
        }
    });
};

storage.replace = function (tableName, name) {
    tableSvc.replaceEntity(tableName, name, function (error, result, response) {

    });
}

module.exports = storage;