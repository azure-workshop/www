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

service.addAttendee = function(email, firstName, lastName, company, jobTitle) {
    var attendee = {
        PartitionKey: { '_': '2019-04' },
        RowKey: { '_': email.toLowerCase() },
        FirstName: { '_': firstName },
        LastName: { '_': lastName },
        JobTitle: { '_': jobTitle },
        Company: { '_': company },
        isConfirmed: { '_': false, '$': 'Edm.Boolean' }
      };

    retrieve(tableNames.registrations, '2019-04', email.toLowerCase(), function(data){
      console.log(data);
        if (data === null){
            return Promise.resolve(insert(tableNames.registrations, attendee));
        }
        return Promise.resolve(console.log("error"));
    });
};

service.addConfirmation = function(email, uniqueId) {
    var confirmation = {
        PartitionKey: { '_': '2019-04' },
        RowKey: { '_': uniqueId },
        Email: { '_': email.toLowerCase() },
    };
    return Promise.resolve(insert(tableNames.confirmations, confirmation));
};

service.confirmAttendee = function(email) {
    return new Promise(function(resolve, reject){
        retrieve(tableNames.registrations,"2019-04", email, function(user) {
            console.log(user);
            user.isConfirmed._ = true;
            resolve(replace(tableNames.registrations, user));
        });
    });
};

service.findAttendeeEmail = function(uniqueId) {
    return new Promise(function(resolve, reject) {
        retrieve(tableNames.confirmations,"2019-04", uniqueId, function(data) {
            if (data === null){
              reject(null);
            }
            resolve(data.Email._);
        });
    });
};

var insert = function (tableName, entity) {
    tableSvc.insertEntity(tableName, entity, function (error, result, response) {
        if (!error) {
            console.log(result);
        }
        else {
            console.log(error);
        }
        
    });
};

var retrieve = function (tableName, PartitionKey, RowKey, callback) {
    tableSvc.retrieveEntity(tableName, PartitionKey, RowKey, function (error, result, response) {
        if (!error) {
            callback(result);
        }
        else {
            callback(null);
        }
    });
};

var replace = function (tableName, name) {
    tableSvc.replaceEntity(tableName, name, function (error, result, response) {

    });
};

module.exports = service;