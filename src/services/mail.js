const nodemailer = require("nodemailer");
const uuidv4 = require('uuid/v4');
const config = require("./config");

var createMail = {
    id: uuidv4(),
    mail: function (name, lastName, email, job, company, link) {
        return `
        <h1>Вы получили это письмо, так как заполнили форму регистрации Global Azure Bootcamp</h1>
        <h3>Вы указали следующие данные</h3>
        <ul>
        <li>First Name: ${name}</li>
        <li>Last Name: ${lastName}</li>
        <li>Contact Email: ${email.toLowerCase()}</li>
        <li>Job Title: ${job}</li>
        <li>Company: ${company}</li>
        </ul>
        <a href="${link}">Подтвердить регистрацию</a> 
  `},

    transporter: nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
            user: config.get("mailAdress"),
            pass: config.get("mailPass")
        },
        tls: {
            rejectUnauthorized: false
        }
    })
}
module.exports = createMail;

