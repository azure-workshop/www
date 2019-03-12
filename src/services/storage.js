const config = require("./config");

const azure = require("azure-storage");

const tableSvc = azure.createTableService(config.azure.storage.name, config.azure.storage.key);

const tableNames = {
    registrations: "Registrations",
    confirmations: "Confirmations"
};

function InitializeTable(tableName) {
    return new Promise(function(resolve, reject) {
        tableSvc.createTableIfNotExists(tableName, function(error) {
            if (!error) {
                resolve();
            } else {
                reject(error);
            }
        });
    });
}

var service = {};

service.init = function () {
    return Promise.all([
        InitializeTable(tableNames.registrations),
        InitializeTable(tableNames.confirmations)
    ]);
};

service.insert = function (tableName, entity) {
    tableSvc.insertEntity(tableName, entity, function (error, result, response) {
        if (!error) {
            console.log(result);
        }
        console.log(error);
    });
};

service.retrieve = function (tableName, PartitionKey, RowKey, callback) {
    tableSvc.retrieveEntity(tableName, PartitionKey, RowKey, function (error, result, response) {
        if (!error) {
            callback(result);
        }
        else {
            callback(null);
        }
    });
};

service.replace = function (tableName, name) {
    tableSvc.replaceEntity(tableName, name, function (error, result, response) {

    });
}

module.exports = service;