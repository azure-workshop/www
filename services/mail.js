const path = require("path");

const sendGrid = require("@sendgrid/mail");
const hbs = require("hbs");

const config = require("./config");
const file = require("./file");

sendGrid.setApiKey(config.sendgrid.key);

function renderTemplate(templateName, templateData) {
    var templatePath = path.join(__dirname, "templates", templateName + ".hbs");

    return file.getFileContent(templatePath).then(function(templateContent) {
        var template = hbs.compile(templateContent);
        var result = template(templateData);
        return Promise.resolve(result);
    }, function (error) {
        return Promise.reject(error);
    });
}

var service = {};

service.sendConfirmationEmail = function(recepientEmail, link) {
    var data = {
        link: link
    };

    return Promise.all([
        renderTemplate("confirmation-plain", data),
        renderTemplate("confirmation-html", data)
    ]).then(function(text) {
        let message = {
            to: recepientEmail,
            from: "me@boykoant.pro",
            subject: "Global Azure Bootcamp 2019 Kyiv - email confirmation",
            text: text[0],
            html: text[1]
        };

        return sendGrid.send(message).then(function() {
            return Promise.resolve();
        }, function(error) {
            return Promise.reject(error);
        });
    }, function(err) {
        return Promise.reject(err)
    });
}

service.sendRegistrationEmail = function(recepientEmail) {
    return Promise.all([
        renderTemplate("registration-plain", {}),
        renderTemplate("registration-html", {})
    ]).then(function(text) {
        let message = {
            to: recepientEmail,
            from: "me@boykoant.pro",
            subject: "Global Azure Bootcamp 2019 Kyiv - welcome on board",
            text: text[0],
            html: text[1]
        };
        
        return sendGrid.send(message).then(function() {
            return Promise.resolve();
        }, function(error) {
            return Promise.reject(error);
        });
    }, function(err) {
        return Promise.reject(err)
    });
}

module.exports = service;

