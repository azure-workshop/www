var fs = require('fs');

var mail = require("../services/mail");

var express = require('express');
var router = express.Router();

const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

var link, host;

router.post("/registration", urlencodedParser, function (request, response) {
  host = request.get('host');
  link = "http://" + request.get('host') + "/api/confirm?id=" + mail.id;

  var user = {
    PartitionKey: { '_': '2019-04' },
    RowKey: { '_': request.body.contactEmail.toLowerCase() },
    FirstName: { '_': request.body.firstName },
    LastName: { '_': request.body.lastName },
    JobTitle: { '_': request.body.jobTitle },
    Company: { '_': request.body.company },
    isConfirmed: { '_': false, '$': 'Edm.Boolean' }
  };

  var confirmation = {
    PartitionKey: { '_': '2019-04' },
    RowKey: { '_': mail.id },
    Email: { '_': request.body.contactEmail.toLowerCase() },
  };

  storage.insert("users", user);
  storage.insert("confirm", confirmation);

  mailOptions = {
    from: '"Global Azure Bootcamp" <lex030382@gmail.com>',
    to: `${request.body.contactEmail}`,
    subject: "Global Azure Bootcamp",
    text: "Hello",
    html: mail.mail(request.body.firstName, request.body.lastName, request.body.contactEmail,
      request.body.jobTitle, request.body.company, link)
  };
var storage = require("../services/storage");

  mail.transporter.sendMail(mailOptions, (err, info) => {
    if (err) { 
      console.log(err);
    }
  });

  response.render("registration", { message: "На указанный вами Email было отправлено письмо для подтверждения регистрации." });
});

router.get('/api/confirm', function (request, response) {
  console.log(request.protocol + ":/" + request.get('host'));

  if ((request.protocol + "://" + request.get('host')) == ("http://" + host)) {
    console.log("Domain is matched. Information is from Authentic email");
    if (request.query.id == mail.id) {
      storage.retrieve("confirm", '2019-04', request.query.id, function (data) {
        storage.retrieve("users", '2019-04', `${data.Email._}`, function (user) {
          user.isConfirmed._ = true;
          storage.replace("users", user);
        });
        response.end("<h1>Email " + mailOptions.to + " is been Successfully verified");
      });

    }
    else {
      console.log("email is not verified");
      response.end("<h1>Bad Request</h1>");
    }
  }
  else {
    response.end("<h1>Request is from unknown source");
  }
});


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
