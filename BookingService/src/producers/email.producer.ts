import { NotificationDto } from "../dto/notification.dto";
import { mailerQueue } from "../queues/email.queues";
import logger from "../config/logger.config";

export const MAILER_PAYLOAD = "payload:mail"

export const addEmailToQueue = async (payload: NotificationDto) => {
    await mailerQueue.add(MAILER_PAYLOAD, payload);
    logger.info("Email added to queue", { to: payload.to, subject: payload.subject, correlationId: payload.correlationId });
};
