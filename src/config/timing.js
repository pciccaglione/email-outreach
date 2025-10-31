require('dotenv').config();

const timingConfig = {
  // Follow-up intervals (in days)
  followUp: {
    afterInitial: parseInt(process.env.FOLLOW_UP_1_DAYS) || 3,
    afterFollowUp1: parseInt(process.env.FOLLOW_UP_2_DAYS) || 5,
    afterFollowUp2: parseInt(process.env.FOLLOW_UP_3_DAYS) || 7
  },

  // Business hours (Monday-Friday)
  businessHours: {
    start: parseInt(process.env.BUSINESS_HOURS_START) || 8,
    end: parseInt(process.env.BUSINESS_HOURS_END) || 17,
    timezone: process.env.TIMEZONE || 'America/New_York',
    daysOfWeek: [1, 2, 3, 4, 5] // Monday through Friday
  },

  // Daily sending limits
  dailyLimits: {
    max: parseInt(process.env.MAX_DAILY_EMAILS) || 40,
    min: parseInt(process.env.MIN_DAILY_EMAILS) || 18,
    target: parseInt(process.env.TARGET_DAILY_EMAILS) || 25
  },

  // Delay between individual emails (in minutes)
  emailDelay: {
    min: parseInt(process.env.MIN_DELAY_MINUTES) || 5,
    max: parseInt(process.env.MAX_DELAY_MINUTES) || 20
  },

  // Cron schedules for jobs
  cronSchedules: {
    // Check for emails to send (4 times per day during business hours)
    sendEmails: '0 9,12,15,18 * * 1-5', // 9 AM, 12 PM, 3 PM, 6 PM Mon-Fri
    
    // Check inbox for responses (every 30 minutes)
    checkResponses: '*/30 * * * *' // Every 30 minutes
  }
};

/**
 * Check if current time is within business hours
 * @returns {boolean}
 */
function isBusinessHours() {
  const now = new Date();
  const options = { timeZone: timingConfig.businessHours.timezone };
  const localTime = new Date(now.toLocaleString('en-US', options));
  
  const hour = localTime.getHours();
  const day = localTime.getDay();
  
  return (
    timingConfig.businessHours.daysOfWeek.includes(day) &&
    hour >= timingConfig.businessHours.start &&
    hour < timingConfig.businessHours.end
  );
}

/**
 * Get random delay in milliseconds
 * @returns {number} Delay in milliseconds
 */
function getRandomDelay() {
  const minMs = timingConfig.emailDelay.min * 60 * 1000;
  const maxMs = timingConfig.emailDelay.max * 60 * 1000;
  return Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs;
}

/**
 * Get random daily target (between min and max)
 * @returns {number} Number of emails to send today
 */
function getRandomDailyTarget() {
  const { min, max } = timingConfig.dailyLimits;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
  timingConfig,
  isBusinessHours,
  getRandomDelay,
  getRandomDailyTarget
};
