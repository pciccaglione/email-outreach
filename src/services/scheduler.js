const contactManager = require('./contactManager');
const emailSender = require('./emailSender');
const stateManager = require('./stateManager');
const { isBusinessHours, getRandomDelay, getRandomDailyTarget } = require('../config/timing');
const { shuffleArray } = require('../utils/randomizer');
const logger = require('../utils/logger');

/**
 * Scheduler Service
 * Handles scheduling and randomization of email sends
 */
class Scheduler {
  constructor() {
    this.isSending = false;
  }

  /**
   * Send batch of emails for this run
   * @returns {object} Results { sent: number, failed: number, skipped: number }
   */
  async sendEmailBatch() {
    if (this.isSending) {
      logger.warn('Email batch already in progress, skipping');
      return { sent: 0, failed: 0, skipped: 0 };
    }

    this.isSending = true;

    const results = {
      sent: 0,
      failed: 0,
      skipped: 0
    };

    try {
      // Check if we're in business hours
      if (!isBusinessHours()) {
        logger.info('Outside business hours, skipping email batch');
        return results;
      }

      // Get current daily count
      await contactManager.resetDailyCounterIfNeeded();
      const currentCount = contactManager.getDailySendCount();
      
      // Get daily target (randomized)
      const dailyTarget = getRandomDailyTarget();
      
      if (currentCount >= dailyTarget) {
        logger.info(`Daily limit reached (${currentCount}/${dailyTarget}), skipping batch`);
        return results;
      }

      // Calculate how many emails to send in this batch
      const remaining = dailyTarget - currentCount;
      const batchSize = Math.min(remaining, Math.ceil(remaining / 2)); // Send up to half of remaining
      
      logger.info(`Starting email batch: ${batchSize} emails (${currentCount}/${dailyTarget} sent today)`);

      // Get eligible contacts
      const eligible = await stateManager.getEligibleContacts();
      
      if (eligible.length === 0) {
        logger.info('No eligible contacts for outreach');
        return results;
      }

      // Randomly select contacts for this batch
      const shuffled = shuffleArray(eligible);
      const selected = shuffled.slice(0, batchSize);

      logger.info(`Selected ${selected.length} contacts from ${eligible.length} eligible`);

      // Send emails with random delays
      for (const { contact, messageType } of selected) {
        try {
          // Send email
          const sendResult = await emailSender.sendEmail(contact, messageType);
          
          if (sendResult.success) {
            // Record in database
            await contactManager.recordMessageSent(
              contact.id,
              messageType,
              sendResult.templateIndex,
              sendResult.subjectIndex
            );
            
            results.sent++;
            logger.info(`✅ Sent ${messageType} to ${contact.email} (${results.sent}/${selected.length})`);
          } else {
            results.failed++;
            logger.error(`❌ Failed to send to ${contact.email}: ${sendResult.error}`);
          }

          // Random delay before next email (except for last one)
          if (results.sent + results.failed < selected.length) {
            const delay = getRandomDelay();
            const delayMinutes = Math.round(delay / 60000);
            logger.info(`⏱️  Waiting ${delayMinutes} minutes before next email...`);
            await this.sleep(delay);
          }

        } catch (error) {
          results.failed++;
          logger.error(`Error sending to ${contact.email}:`, error);
        }
      }

      logger.info(`Email batch complete: ${results.sent} sent, ${results.failed} failed`);
      
      // Log statistics
      const stats = stateManager.getStatistics();
      logger.info('Current statistics:', stats);

      return results;
    } catch (error) {
      logger.error('Error in email batch:', error);
      throw error;
    } finally {
      this.isSending = false;
    }
  }

  /**
   * Sleep for specified milliseconds
   * @param {number} ms - Milliseconds to sleep
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get sending status
   * @returns {object} Status information
   */
  getStatus() {
    return {
      isSending: this.isSending,
      isBusinessHours: isBusinessHours(),
      dailySent: contactManager.getDailySendCount(),
      statistics: stateManager.getStatistics()
    };
  }
}

// Create singleton instance
const scheduler = new Scheduler();

module.exports = scheduler;
