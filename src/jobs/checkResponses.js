const inboxMonitor = require('../services/inboxMonitor');
const logger = require('../utils/logger');

/**
 * Check Responses Job
 * Triggered by cron schedule to check inbox for responses
 */
async function checkResponsesJob() {
  try {
    logger.info('========================================');
    logger.info('📬 CHECK RESPONSES JOB STARTED');
    logger.info('========================================');

    const results = await inboxMonitor.checkForResponses(7); // Check last 7 days
    
    logger.info('========================================');
    logger.info('📬 CHECK RESPONSES JOB COMPLETED');
    logger.info(`Results: ${results.responses} responses found, ${results.checked} emails checked, ${results.errors} errors`);
    logger.info('========================================');

    return results;
  } catch (error) {
    logger.error('========================================');
    logger.error('❌ CHECK RESPONSES JOB FAILED');
    logger.error('Error:', error);
    logger.error('========================================');
    
    // Try to disconnect and reconnect for next run
    try {
      await inboxMonitor.disconnect();
    } catch (disconnectError) {
      logger.error('Error disconnecting from IMAP:', disconnectError);
    }
    
    throw error;
  }
}

module.exports = checkResponsesJob;
