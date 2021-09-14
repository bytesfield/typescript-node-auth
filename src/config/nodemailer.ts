import nodemailer from "nodemailer";
import mg, { Options, MailgunTransport } from "nodemailer-mailgun-transport";
import config from "./index";

const mailgunAuth = {
    auth: {
        api_key: config.services.mailgun.secret,
        domain: config.services.mailgun.domain,
    },
    host: config.services.email.host
    //proxy: 'http://user:pass@localhost:8080' // optional proxy, default is false
} as Options;

const emailServiceAuth: object = {

    host: config.services.email.host,
    port: config.services.email.port,
    secure: true,
    auth: {
        user: config.services.email.username,
        pass: config.services.email.password,

    },
};

const emailService = nodemailer.createTransport(emailServiceAuth);
const mailgunService: nodemailer.Transporter = nodemailer.createTransport(mg(mailgunAuth));

export default {
    emailService,
    mailgunService
}
