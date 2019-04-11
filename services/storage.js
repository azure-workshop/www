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

    let filter = "PartitionKey eq '2019-04' and RowKey eq '" + email.toLowerCase() + "'";

    return select(tableNames.registrations, filter)
        .then(function(data){
            if (data.length == 0) {
                return insert(tableNames.registrations, attendee);
            } else {
                return Promise.resolve(data);
            }
        }, function(error){
            return Promise.reject(error);
        });
};

service.addConfirmation = function(email, uniqueId) {
    var confirmation = {
        PartitionKey: { '_': '2019-04' },
        RowKey: { '_': uniqueId },
        Email: { '_': email.toLowerCase() },
    };
    return insert(tableNames.confirmations, confirmation);
};

service.confirmAttendee = function(email) {
    return retrieve(tableNames.registrations, "2019-04", email.toLowerCase())
        .then(function(attendee) {
            if (!attendee) {
                return Promise.reject("Entity not found");
            } else {
                attendee.isConfirmed._ = true;
                return replace(tableNames.registrations, attendee);
            }
        }, function (error) {
            return Promise.reject(error);
        })
        .then(function(data) {
            return Promise.resolve(email);
        }, function (error) {
            return Promise.reject(error);
        });
};

service.findAttendeeEmail = function(uniqueId) {
    let filter = "PartitionKey eq '2019-04' and RowKey eq '" + uniqueId + "'";

    return select(tableNames.confirmations, filter)
        .then(function(data){
            if (data.length == 0) {
                return Promise.resolve(null);
            } else {
                return Promise.resolve(data[0].Email._);
            }
        }, function (error) {
            return Promise.reject(error);
        });
};

var insert = function (tableName, entity) {
    return new Promise(function(resolve, reject) {
        tableSvc.insertEntity(tableName, entity, function (error, result, response) {
            if (!error) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
    });
};

var retrieve = function (tableName, PartitionKey, RowKey) {
    return new Promise(function(resolve, reject) {
        tableSvc.retrieveEntity(tableName, PartitionKey, RowKey, function (error, result, response) {
            if (!error) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
    });
};

var select = function (tableName, filter) {
    return new Promise(function(resolve, reject) {
        let query = new azure.TableQuery().where(filter);
        tableSvc.queryEntities(tableName, query, null, function(error, result, response) {
            if(!error) {
                resolve(result.entries);
            } else {
                reject(error);
            }
          });
    });
}

var replace = function (tableName, entity) {
    return new Promise(function(resolve, reject) {
        tableSvc.replaceEntity(tableName, entity, function (error, result, response) {
            if (!error) {
                resolve(result);
            }
            else {
                reject(error);
            }
        });
    });
};

module.exports = service;