import nodemailer from "nodemailer";

import { serverConfig } from ".";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: serverConfig.MAILER_USER,
        pass: serverConfig.MAILER_PASS
    },
});

export default transporter;