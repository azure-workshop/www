const express = require("express");
const app = express();
const fs = require("fs");
 
app.set("view engine", "hbs");

app.use(express.static(__dirname + '/app/public'));

app.use("/speakers", function(request, response){
    var content = fs.readFileSync("./app/data/speakers.json", "utf8");
    var speakers = JSON.parse(content);
    response.render("speakers.hbs", {speakers:speakers});
});

app.use("/partners", function(request, response){
    var content = fs.readFileSync("./app/data/partners.json", "utf8");
    var partners = JSON.parse(content);
    response.render("partners.hbs", {partners:partners});
});

app.use("/registration", function(request, response){
    response.render("registration.hbs");
});

app.use("/agenda", function(request, response){
    var content = fs.readFileSync("./app/data/agenda.json", "utf8");
    var agenda = JSON.parse(content);
    response.render("agenda.hbs", {agenda:agenda});
});

app.use("/", function(request, response){
    response.render("start.hbs");
});

app.listen(3000);