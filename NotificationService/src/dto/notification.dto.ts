export interface NotificationDto {
    to: string;
    subject: string;
    templateId: string; // ID of the email template to use
    params: Record<string, any>; // Parameters to replace in the template
    correlationId?: string;
}
