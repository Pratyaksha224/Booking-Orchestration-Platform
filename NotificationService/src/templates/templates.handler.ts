import fs from "fs/promises";
import path from "path";
import handlebars from "handlebars";
import { InternalServerError } from "../utils/errors/app.error";

export async function renderMailTemplate(templateId: string, params: Record<string, any>): Promise<string> {
    const templatePath = path.join(__dirname, "mailer", `${templateId}.hbs`);
    try {
        const content = await fs.readFile(templatePath, "utf-8");
        const finalTemplate = handlebars.compile(content);
        return finalTemplate(params);
    } catch (error) {
        throw new InternalServerError(`Template Not Found: ${templateId}`);
    }
}