const nodemailer = require('nodemailer');
const emailConfig = require('../config/email');
const { getRandomTemplate, processTemplate } = require('../config/templates');
const logger = require('../utils/logger');

/**
 * Email Sender Service
 * Handles sending emails via SMTP
 */
class EmailSender {
  constructor() {
    this.transporter = null;
  }

  /**
   * Initialize SMTP transporter
   */
  async initialize() {
    try {
      this.transporter = nodemailer.createTransport(emailConfig.smtp);
      
      // Verify connection
      await this.transporter.verify();
      logger.info(`SMTP connection verified for ${emailConfig.provider}`);
    } catch (error) {
      logger.error('Failed to initialize SMTP connection:', error);
      throw error;
    }
  }

  /**
   * Send email to contact
   * @param {object} contact - Contact object
   * @param {string} messageType - 'initial', 'follow_up_1', 'follow_up_2', or 'follow_up_3'
   * @returns {object} { success: boolean, templateIndex, subjectIndex, messageId }
   */
  async sendEmail(contact, messageType) {
    if (!this.transporter) {
      throw new Error('Email sender not initialized');
    }

    try {
      // Get random template variation
      const { subject, body, variationIndex } = getRandomTemplate(messageType);

      // Process template with contact data
      const processedSubject = processTemplate(subject, contact);
      const processedBody = processTemplate(body, contact);

      // Send email
      const mailOptions = {
        from: {
          name: emailConfig.from.name,
          address: emailConfig.from.address
        },
        to: contact.email,
        subject: processedSubject,
        text: processedBody,
        html: this.convertToHtml(processedBody)
      };

      const info = await this.transporter.sendMail(mailOptions);

      logger.info(`Email sent to ${contact.email}`, {
        messageType,
        variationIndex,
        messageId: info.messageId
      });

      return {
        success: true,
        templateIndex: variationIndex,
        subjectIndex: variationIndex,
        messageId: info.messageId
      };
    } catch (error) {
      logger.error(`Failed to send email to ${contact.email}:`, error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Convert plain text to simple HTML
   * @param {string} text - Plain text
   * @returns {string} HTML
   */
  convertToHtml(text) {
    // Convert line breaks to <br> tags
    let html = text.replace(/\n/g, '<br>');
    
    // Wrap in basic HTML structure
    html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
  ${html}
</body>
</html>
    `.trim();
    
    return html;
  }

  /**
   * Send test email
   * @param {string} toEmail - Recipient email
   * @returns {object} Result
   */
  async sendTestEmail(toEmail) {
    if (!this.transporter) {
      throw new Error('Email sender not initialized');
    }

    try {
      const mailOptions = {
        from: {
          name: emailConfig.from.name,
          address: emailConfig.from.address
        },
        to: toEmail,
        subject: 'Test Email from Outreach App',
        text: 'This is a test email to verify SMTP configuration is working correctly.',
        html: '<p>This is a test email to verify SMTP configuration is working correctly.</p>'
      };

      const info = await this.transporter.sendMail(mailOptions);
      
      logger.info(`Test email sent to ${toEmail}`, { messageId: info.messageId });
      
      return {
        success: true,
        messageId: info.messageId
      };
    } catch (error) {
      logger.error(`Failed to send test email:`, error);
      
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Close transporter connection
   */
  close() {
    if (this.transporter) {
      this.transporter.close();
      logger.info('SMTP connection closed');
    }
  }
}

// Create singleton instance
const emailSender = new EmailSender();

module.exports = emailSender;
