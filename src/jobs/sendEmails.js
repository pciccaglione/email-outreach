const scheduler = require('../services/scheduler');
const logger = require('../utils/logger');

/**
 * Send Emails Job
 * Triggered by cron schedule to send batch of emails
 */
async function sendEmailsJob() {
  try {
    logger.info('========================================');
    logger.info('📤 SEND EMAILS JOB STARTED');
    logger.info('========================================');

    const results = await scheduler.sendEmailBatch();
    
    logger.info('========================================');
    logger.info('📤 SEND EMAILS JOB COMPLETED');
    logger.info(`Results: ${results.sent} sent, ${results.failed} failed, ${results.skipped} skipped`);
    logger.info('========================================');

    return results;
  } catch (error) {
    logger.error('========================================');
    logger.error('❌ SEND EMAILS JOB FAILED');
    logger.error('Error:', error);
    logger.error('========================================');
    throw error;
  }
}

module.exports = sendEmailsJob;
