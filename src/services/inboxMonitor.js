const imaps = require('imap-simple');
const emailConfig = require('../config/email');
const contactManager = require('./contactManager');
const { extractEmailAddress, isLegitimateReply, parseHeaders } = require('../utils/emailParser');
const logger = require('../utils/logger');

/**
 * Inbox Monitor Service
 * Monitors inbox for responses via IMAP
 */
class InboxMonitor {
  constructor() {
    this.connection = null;
    this.isMonitoring = false;
  }

  /**
   * Connect to IMAP server
   */
  async connect() {
    try {
      const config = {
        imap: emailConfig.imap
      };

      this.connection = await imaps.connect(config);
      logger.info('Connected to IMAP server');
      
      return true;
    } catch (error) {
      logger.error('Failed to connect to IMAP server:', error);
      throw error;
    }
  }

  /**
   * Disconnect from IMAP server
   */
  async disconnect() {
    if (this.connection) {
      this.connection.end();
      this.connection = null;
      logger.info('Disconnected from IMAP server');
    }
  }

  /**
   * Check inbox for responses
   * @param {number} daysBack - Number of days to look back for responses
   * @returns {object} Results { checked: number, responses: number, errors: number }
   */
  async checkForResponses(daysBack = 7) {
    const results = {
      checked: 0,
      responses: 0,
      errors: 0
    };

    try {
      // Connect if not already connected
      if (!this.connection) {
        await this.connect();
      }

      // Open inbox
      await this.connection.openBox('INBOX');
      logger.debug('Opened INBOX');

      // Search for recent emails
      const sinceDate = new Date();
      sinceDate.setDate(sinceDate.getDate() - daysBack);
      const sinceDateStr = sinceDate.toISOString().split('T')[0];

      const searchCriteria = [['SINCE', sinceDateStr]];
      const fetchOptions = {
        bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)', 'TEXT'],
        struct: true,
        markSeen: false
      };

      const messages = await this.connection.search(searchCriteria, fetchOptions);
      results.checked = messages.length;

      logger.info(`Found ${messages.length} emails in the last ${daysBack} days`);

      // Process each message
      for (const message of messages) {
        try {
          await this.processMessage(message);
          results.responses++;
        } catch (error) {
          logger.error('Error processing message:', error);
          results.errors++;
        }
      }

      logger.info(`Inbox check complete: ${results.responses} responses found, ${results.errors} errors`);
      
      return results;
    } catch (error) {
      logger.error('Error checking inbox:', error);
      throw error;
    }
  }

  /**
   * Process individual message
   * @param {object} message - IMAP message
   */
  async processMessage(message) {
    try {
      // Extract headers
      const headerPart = message.parts.find(part => 
        part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE MESSAGE-ID)'
      );
      
      if (!headerPart) {
        logger.warn('No headers found in message');
        return;
      }

      const headers = parseHeaders(headerPart.body);
      
      // Extract sender email
      const senderEmail = extractEmailAddress(headers.from);
      if (!senderEmail) {
        logger.warn('Could not extract sender email');
        return;
      }

      // Check if sender is in our contacts
      const contact = contactManager.getContactByEmail(senderEmail);
      if (!contact) {
        // Not a contact we've reached out to
        return;
      }

      // Check if already marked as responded
      if (contact.status === 'responded') {
        // Already processed this response
        return;
      }

      // Extract body
      const textPart = message.parts.find(part => part.which === 'TEXT');
      const body = textPart ? textPart.body : '';

      // Check if legitimate reply (not auto-reply or bounce)
      const email = {
        from: headers.from,
        subject: headers.subject,
        body: body
      };

      if (!isLegitimateReply(email)) {
        logger.debug(`Skipping non-legitimate reply from ${senderEmail}`);
        return;
      }

      // Mark contact as responded
      await contactManager.markAsResponded(contact.id);
      
      logger.info(`✅ Response detected from ${senderEmail}!`, {
        subject: headers.subject,
        previousStatus: contact.status
      });

    } catch (error) {
      logger.error('Error processing message:', error);
      throw error;
    }
  }

  /**
   * Monitor inbox continuously (for testing)
   * @param {number} intervalMinutes - Check interval in minutes
   */
  async startMonitoring(intervalMinutes = 30) {
    if (this.isMonitoring) {
      logger.warn('Already monitoring inbox');
      return;
    }

    this.isMonitoring = true;
    logger.info(`Started inbox monitoring (checking every ${intervalMinutes} minutes)`);

    const check = async () => {
      if (!this.isMonitoring) return;

      try {
        await this.checkForResponses();
      } catch (error) {
        logger.error('Error during inbox monitoring:', error);
        // Try to reconnect
        try {
          await this.disconnect();
          await this.connect();
        } catch (reconnectError) {
          logger.error('Failed to reconnect:', reconnectError);
        }
      }

      if (this.isMonitoring) {
        setTimeout(check, intervalMinutes * 60 * 1000);
      }
    };

    // Start first check
    await check();
  }

  /**
   * Stop monitoring inbox
   */
  stopMonitoring() {
    this.isMonitoring = false;
    logger.info('Stopped inbox monitoring');
  }
}

// Create singleton instance
const inboxMonitor = new InboxMonitor();

module.exports = inboxMonitor;
