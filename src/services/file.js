const fs = require("fs");

var service = {};

service.getFileContent = function(filePath) {
    return new Promise(function(resolve, reject) {
        fs.readFile(filePath, "utf8", function(err, content) {
            if (!err) {
                resolve(content);
            } else {
                reject(err);
            }
        });
    });
}

module.exports = service;