var path = require("path");
var uuid = require("uuid");

var express = require("express");
var router = express.Router();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var storage = require("../services/storage");
var mail = require("../services/mail");
var file = require("../services/file");

router.get("/confirmation/:uniqueId", function (request, response) {
  var uniqueId = request.params.uniqueId;
 
  storage.findAttendeeEmail(uniqueId)
  .then(function(data){
    return storage.confirmAttendee(data);
  },function(error){
    response.render("confirmation-failed");
  }).then(function() {
    return mail.sendRegistrationEmail(data);
  }, function(error) {
    response.render("confirmation-failed");
  })
  .then(function() {
    response.render("confirmation-successful");
  }, function(error) {
    response.render("confirmation-failed");
  });
});

router.get("/", function(req, res, next) {
  res.render("index", { title: "Global Azure Bootcamp 2019 in Kyiv" });
});

router.get("/agenda", function(request, response){
  file.getFileContent(path.join(__dirname, "..", "data", "agenda.json"))
  .then(function(content){
    var agenda = JSON.parse(content);
    response.render("agenda", { agenda: agenda, title: "Agenda of Global Azure Bootcamp 2019 in Kyiv"  })
  }, function(error) {
    let message = "ERROR";
    response.render("_error", {error: error, message: message});
  });
});

router.get("/speakers", function(request, response){
  file.getFileContent(path.join(__dirname, "..", "data", "speakers.json"))
  .then(function(content){
    var speakers = JSON.parse(content);
    response.render("speakers", { speakers: speakers, title: "Speakers of Global Azure Bootcamp 2019 in Kyiv" })
  }, function(error) {
    let message = "ERROR";
    response.render("_error", {error: error, message: message});
  });
});

router.get("/partners", function(request, response){
  file.getFileContent(path.join(__dirname, "..", "data", "partners.json"))
  .then(function(content){
    var partners = JSON.parse(content);
    response.render("partners", { partners: partners, title: "Partners of Global Azure Bootcamp 2019 in Kyiv"  })
  }, function(error) {
    let message = "ERROR";
    response.render("_error", {error: error, message: message});
  });
});

router.get("/registration", function(request, response){
  response.render("registration");
});

router.post("/registration", urlencodedParser, function (request, response) {
  var uniqueId = uuid.v4();
  var link = request.protocol + "://" + request.hostname + "/confirmation/" + uniqueId;

  console.log(link);

  Promise.all([
    storage.addAttendee(request.body.contactEmail,
      request.body.firstName,
      request.body.lastName,
      request.body.company,
      request.body.jobTitle),     
    storage.addConfirmation(request.body.contactEmail, uniqueId)   
  ]).then(function() {
    return mail.sendConfirmationEmail(request.body.contactEmail, link) 
  }, function(error){
    let message = "ERROR";
    response.render("_error", {error: error, message: message});
  }).then(function() {
    response.render("confirmation-sent");
  }, function(error) {
    let message = "ERROR";
    response.render("_error", {error: error, message: message});
  });
});

module.exports = router;