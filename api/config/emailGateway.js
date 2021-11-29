//import package
import nodemailer from 'nodemailer';

// import lib
import config from './config';

export const sendEmail = async (to, content) => {
    console.log("EEEEE");
    try {

        console.log(content, "saran");
        const { subject, template } = content;

        let transporter = nodemailer.createTransport(config.emailGateway.nodemailer);
        let info = await transporter.sendMail({
            from: config.emailGateway.fromMail,
            to,
            subject: subject,
            html: template
        });
        console.log("Message sent: %s", info.messageId);
    }
    catch (err) {
        console.log("-------------err", err)
    }
}

// sendEmail({
//     to: "ajith@britisheducationonline.org",
//     templateId: "d-90a65545a4404f4b9bfe3fd29c7af6b3",
//     content: {
//         confirmUrl: "https://alwin.io/"
//     }
// })