var fs = require('fs');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Global Azure Bootcamp 2019 in Kyiv' });
});

router.get("/speakers", function(request, response){
  var content = fs.readFileSync("./data/speakers.json", "utf8");
  var speakers = JSON.parse(content);
  response.render("speakers", { speakers:speakers, title: "Speakers of Global Azure Bootcamp 2019 in Kyiv" });
});

router.get("/partners", function(request, response){
  var content = fs.readFileSync("./data/partners.json", "utf8");
  var partners = JSON.parse(content);
  response.render("partners", { partners:partners, title: "Partners of Global Azure Bootcamp 2019 in Kyiv"  });
});

router.get("/registration", function(request, response){
  response.render("registration");
});

router.get("/agenda", function(request, response){
  var content = fs.readFileSync("./data/agenda.json", "utf8");
  var agenda = JSON.parse(content);
  response.render("agenda", { agenda:agenda, title: "Agenda of Global Azure Bootcamp 2019 in Kyiv"  });
});

module.exports = router;
