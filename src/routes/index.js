var fs = require("fs");
var uuid = require("uuid");

var express = require("express");
var router = express.Router();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var storage = require("../services/storage");
var mail = require("../services/mail");

router.get("/confirmation/:uniqueId", function (request, response) {
  var uniqueId = request.params.uniqueId;
  console.log(uniqueId);

  //TODO: find email in confirmations table by unique id
  //TODO: update entity by email in registrations table and set is confirmed to true
  //TODO: send second email to the user that his email is confirmed
  //TODO: if everything is ok render confirmation-successful view, otherwise render confirmation-failed view
});

router.get("/", function(req, res, next) {
  res.render("index", { title: "Global Azure Bootcamp 2019 in Kyiv" });
});

router.get("/agenda", function(request, response){
  //TODO: rewrite with files module
  var content = fs.readFileSync("./data/agenda.json", "utf8");
  var agenda = JSON.parse(content);
  response.render("agenda", { agenda: agenda, title: "Agenda of Global Azure Bootcamp 2019 in Kyiv"  });
});

router.get("/speakers", function(request, response){
  //TODO: rewrite with files module
  var content = fs.readFileSync("./data/speakers.json", "utf8");
  var speakers = JSON.parse(content);
  response.render("speakers", { speakers: speakers, title: "Speakers of Global Azure Bootcamp 2019 in Kyiv" });
});

router.get("/partners", function(request, response){
  //TODO: rewrite with files module
  var content = fs.readFileSync("./data/partners.json", "utf8");
  var partners = JSON.parse(content);
  response.render("partners", { partners: partners, title: "Partners of Global Azure Bootcamp 2019 in Kyiv"  });
});

router.get("/registration", function(request, response){
  response.render("registration");
});

router.post("/registration", urlencodedParser, function (request, response) {
  var uniqueId = uuid.v4();
  var link = request.protocol + "://" + request.hostname + "/confirmation/" + uniqueId;

  console.log(link);

  Promise.all([
    storage.addAttendee(),      //TODO: fill parameters
    storage.addConfirmation()   //TODO: fill parameters
  ]).then(function() {
    //TODO: send first email with unique id
    return mail.sendConfirmationEmail() //TODO: fill parameters
  }, function(error){
    //TODO: render error view
  }).then(function() {
    //TODO: render confirmation-sent view
  }, function(error) {
    //TODO: render error view
  });
});

module.exports = router;