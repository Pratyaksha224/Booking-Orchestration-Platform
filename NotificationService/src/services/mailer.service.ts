import { serverConfig } from "../config";
import transporter from "../config/mailer.config";
import { InternalServerError } from "../utils/errors/app.error";
import logger from "../config/logger.config";

export async function sendEmail(to: string, subject: string, body: string) {
    try {
        await transporter.sendMail({
            from: serverConfig.MAILER_USER,
            to: to,
            subject: subject,
            html: body,
        })
        logger.info("Email sent", { to, subject });
    } catch (error) {
        logger.error("Error sending email", { error });
        throw new InternalServerError("Failed to send email");
    }
}