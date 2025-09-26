/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private readonly transporter;

  constructor(private readonly configService: ConfigService) {
    const port = this.configService.get('SMTP_PORT');
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('SMTP_HOST'),
      port: port ? parseInt(port) : 587,
      secure: false, 
      auth: {
        user: this.configService.get('SMTP_USER'),
        pass: this.configService.get('SMTP_PASS'),
      },
    });
  }

  //envoi d'email
  async sendEmail(to: string, subject: string, text: string): Promise<void> {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await this.transporter.sendMail({
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        from: this.configService.get('SMTP_FROM'),
        to,
        subject,
        text,
      });
      this.logger.debug(`Email envoye a ${to}`);
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email a ${to}:`, error);
      throw error;
    }
  }

  //rappel d'arrosage
  async sendWateringReminder(email: string, plantName: string, waterAmount: number): Promise<void> {
    const subject = 'Rappel d\'arrosage - Plantify';
    const text = 
      `Bonjour,\n\n` +
      `Votre plante "${plantName}" a besoin d'être arrosée aujourd'hui !\n` +
      `Quantité d'eau recommandée : ${waterAmount}ml\n\n` +
      `N'oubliez pas de marquer la plante comme arrosée dans l'application une fois que c'est fait.\n\n` +
      'À bientôt,\nPlantify';

    await this.sendEmail(email, subject, text);
  }

  //rappel d'arrosage manque
  async sendMissedWateringReminder(email: string, plantName: string, waterAmount: number): Promise<void> {
    const subject = 'Rappel : Arrosage manqué - Plantify';
    const text = 
      `Bonjour,\n\n` +
      `Il semble que vous n'ayez pas encore arrosé votre plante "${plantName}" hier.\n` +
      `Il n'est pas trop tard ! Votre plante a besoin de ${waterAmount}ml d'eau.\n\n` +
      `N'oubliez pas de marquer la plante comme arrosée dans l'application une fois que c'est fait.\n\n` +
      'À bientôt,\nPlantify';

    await this.sendEmail(email, subject, text);
  }
}
