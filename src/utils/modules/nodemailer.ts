import nodemailer from "nodemailer";
import mg from "nodemailer-mailgun-transport";
import config from "../../config";

const mailgunAuth: { auth: { api_key: string, domain: string }} = {
    auth: {
        api_key: config.service.mailgun.secret,
        domain: config.service.mailgun.domain,
    }

};

const emailServiceAuth: object = {

    host: config.service.email.host,
    port: config.service.email.port,
    secure: true,
    auth: {
        user: config.service.email.username,
        pass: config.service.email.password,
    },
};

const emailService = nodemailer.createTransport(emailServiceAuth);
const mailgunService: nodemailer.Transporter = nodemailer.createTransport(mg(mailgunAuth));

export default {
    emailService,
    mailgunService
}
