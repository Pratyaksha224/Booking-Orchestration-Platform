import { mailerQueue } from "../queues/mailer.queue";
import { NotificationDto } from "../dto/notification.dto";
import logger from "../config/logger.config";

export const MAILER_PAYLOAD = "payload:mail"

export const addEmailToQueue = async (payload: NotificationDto) => {
  await mailerQueue.add(MAILER_PAYLOAD, payload);
  logger.info("Email added to queue", { payload });
};
