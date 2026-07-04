import { Worker } from "bullmq";

import { MAILER_QUEUE } from "../queues/mailer.queue";
import { NotificationDto } from "../dto/notification.dto";
import { getRedisConnObject } from "../config/redis.config";
import { MAILER_PAYLOAD } from "../producers/email.producer";
import { renderMailTemplate } from "../templates/templates.handler";
import { sendEmail } from "../services/mailer.service";
import logger from "../config/logger.config";
import { asyncLocalStorage } from "../utils/helpers/request.helpers";
import { v4 as uuidV4 } from 'uuid';

export const setupMailerWorker = () => {
    const emailProcessor = new Worker<NotificationDto> (
        MAILER_QUEUE,
        async (job) => {
            
            if(job.name !== MAILER_PAYLOAD) {
                throw new Error("Invalid job name");
            }
            // Call the Service Layer from here
            else {
                const payload = job.data;
                const correlationId = payload.correlationId || uuidV4();
                
                await asyncLocalStorage.run({ correlationId }, async () => {
                    const emailContent = await renderMailTemplate(payload.templateId, payload.params)
                    await sendEmail(payload.to, payload.subject, emailContent);
                    logger.info("Email sent successfully", { to: payload.to, subject: payload.subject });
                });
            }

        }, {
            connection: getRedisConnObject() as any
        }
    )

    emailProcessor.on("failed", (job, error) => {
        logger.error("Email processor failed", { jobId: job?.id, error: error.message });
    });

    emailProcessor.on("completed", (job) => {
        logger.info("Email processor completed successfully", { jobId: job?.id });
    });
}