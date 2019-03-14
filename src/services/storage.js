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
    // var attendee = {
    //     PartitionKey: { '_': '2019-04' },
    //     RowKey: { '_': request.body.contactEmail.toLowerCase() },
    //     FirstName: { '_': request.body.firstName },
    //     LastName: { '_': request.body.lastName },
    //     JobTitle: { '_': request.body.jobTitle },
    //     Company: { '_': request.body.company },
    //     isConfirmed: { '_': false, '$': 'Edm.Boolean' }
    //   };

    //TODO: check if user with this email is registered, if yes - do nothing and resolve promise
    //TODO: insert new attendee to registrations table and resolve promise

    return Promise.resolve();
}

service.addConfirmation = function(email, uniqueId) {
    // var confirmation = {
    //     PartitionKey: { '_': '2019-04' },
    //     RowKey: { '_': mail.id },
    //     Email: { '_': request.body.contactEmail.toLowerCase() },
    // };

    //TODO: insert new confirmation to confirmations table and resolve promise

    return Promise.resolve();
}

service.confirmAttendee = function(email) {
    //TODO: retreive attendee by email
    //TODO: set is confirmed to true
    //TODO: update attendee and resolve promise
}

service.findAttendeeEmail = function(uniqueId) {
    //TODO: retreive entity from confirmation table by unique id
    //TODO: if entity is empty, resolve promise with null value, otherwise resolve it with email value
}

//TODO: this method should be private
service.insert = function (tableName, entity) {
    tableSvc.insertEntity(tableName, entity, function (error, result, response) {
        if (!error) {
            console.log(result);
        }
        console.log(error);
    });
};

//TODO: this method should be private
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

//TODO: this method should be private
service.replace = function (tableName, name) {
    tableSvc.replaceEntity(tableName, name, function (error, result, response) {

    });
}

module.exports = service;