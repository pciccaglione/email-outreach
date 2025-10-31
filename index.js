require('dotenv').config();
const cron = require('node-cron');
const contactManager = require('./src/services/contactManager');
const emailSender = require('./src/services/emailSender');
const logger = require('./src/utils/logger');
const { timingConfig } = require('./src/config/timing');
const sendEmailsJob = require('./src/jobs/sendEmails');
const checkResponsesJob = require('./src/jobs/checkResponses');

/**
 * Email Outreach Automation App
 * Main entry point
 */

let isInitialized = false;

/**
 * Initialize all services
 */
async function initialize() {
  try {
    logger.info('🚀 Email Outreach App Starting...');
    logger.info('========================================');

    // Initialize contact manager
    logger.info('📊 Initializing contact manager...');
    await contactManager.initialize();

    // Initialize email sender
    logger.info('📧 Initializing email sender...');
    await emailSender.initialize();

    // Log initial statistics
    const stats = contactManager.getStatistics();
    logger.info('📈 Initial Statistics:', stats);

    logger.info('========================================');
    logger.info('✅ Initialization Complete!');
    logger.info('========================================');

    isInitialized = true;
  } catch (error) {
    logger.error('❌ Initialization failed:', error);
    process.exit(1);
  }
}

/**
 * Setup cron jobs
 */
function setupCronJobs() {
  logger.info('⏰ Setting up cron jobs...');

  // Send emails job (4 times per day during business hours)
  // Schedule: 9 AM, 12 PM, 3 PM, 6 PM Mon-Fri
  const sendEmailsCron = cron.schedule(
    timingConfig.cronSchedules.sendEmails,
    async () => {
      if (!isInitialized) {
        logger.warn('App not initialized, skipping send emails job');
        return;
      }
      
      try {
        await sendEmailsJob();
      } catch (error) {
        logger.error('Send emails job error:', error);
      }
    },
    {
      timezone: timingConfig.businessHours.timezone
    }
  );

  // Check responses job (every 30 minutes)
  const checkResponsesCron = cron.schedule(
    timingConfig.cronSchedules.checkResponses,
    async () => {
      if (!isInitialized) {
        logger.warn('App not initialized, skipping check responses job');
        return;
      }
      
      try {
        await checkResponsesJob();
      } catch (error) {
        logger.error('Check responses job error:', error);
      }
    }
  );

  logger.info('✅ Cron jobs configured:');
  logger.info(`   📤 Send Emails: ${timingConfig.cronSchedules.sendEmails} (${timingConfig.businessHours.timezone})`);
  logger.info(`   📬 Check Responses: ${timingConfig.cronSchedules.checkResponses}`);

  return { sendEmailsCron, checkResponsesCron };
}

/**
 * Graceful shutdown
 */
function setupGracefulShutdown(cronJobs) {
  const shutdown = async (signal) => {
    logger.info(`\n${signal} received, shutting down gracefully...`);

    // Stop cron jobs
    if (cronJobs.sendEmailsCron) {
      cronJobs.sendEmailsCron.stop();
    }
    if (cronJobs.checkResponsesCron) {
      cronJobs.checkResponsesCron.stop();
    }

    // Close email sender
    emailSender.close();

    logger.info('Shutdown complete');
    process.exit(0);
  };

  process.on('SIGINT', () => shutdown('SIGINT'));
  process.on('SIGTERM', () => shutdown('SIGTERM'));
}

/**
 * Main function
 */
async function main() {
  try {
    // Initialize services
    await initialize();

    // Setup cron jobs
    const cronJobs = setupCronJobs();

    // Setup graceful shutdown
    setupGracefulShutdown(cronJobs);

    logger.info('========================================');
    logger.info('🎯 Email Outreach App is running!');
    logger.info('========================================');
    logger.info('Press Ctrl+C to stop');
    logger.info('');

    // Keep process alive
    setInterval(() => {
      // Heartbeat - keeps process running
    }, 60000);

  } catch (error) {
    logger.error('Fatal error:', error);
    process.exit(1);
  }
}

// Start the application
main();

// Export for testing
module.exports = {
  initialize,
  setupCronJobs
};
