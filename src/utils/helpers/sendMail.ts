import nodemailer from "../modules/nodemailer";

const sendMail = async (from: string, to: string, subject: string, template: any): Promise<any> => {

    const emailData = {
        from: from,
        to: to,
        subject: subject,
        text: 'text',
        template: template
    };

    const sentEmail = await nodemailer.mailgunService.sendMail(emailData);

    return sentEmail;
}
export default sendMail;