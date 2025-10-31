const contactManager = require('./contactManager');
const emailSender = require('./emailSender');
const { timingConfig } = require('../config/timing');
const logger = require('../utils/logger');

/**
 * State Manager Service
 * Handles contact state transitions and follow-up logic
 */
class StateManager {
  /**
   * Process follow-ups for all contacts
   * Checks for contacts that need follow-ups and transitions them
   * @returns {object} Results { processed: number, transitioned: number }
   */
  async processFollowUps() {
    const results = {
      processed: 0,
      transitioned: 0
    };

    try {
      // Check for contacts needing first follow-up (3 days after initial)
      const needFollowUp1 = contactManager.getContactsNeedingFollowUp(
        timingConfig.followUp.afterInitial,
        'contacted_1'
      );

      // Check for contacts needing second follow-up (5 days after first follow-up)
      const needFollowUp2 = contactManager.getContactsNeedingFollowUp(
        timingConfig.followUp.afterFollowUp1,
        'follow_up_1'
      );

      // Check for contacts needing third follow-up (7 days after second follow-up)
      const needFollowUp3 = contactManager.getContactsNeedingFollowUp(
        timingConfig.followUp.afterFollowUp2,
        'follow_up_2'
      );

      const allNeedingFollowUp = [
        ...needFollowUp1.map(c => ({ contact: c, type: 'follow_up_1' })),
        ...needFollowUp2.map(c => ({ contact: c, type: 'follow_up_2' })),
        ...needFollowUp3.map(c => ({ contact: c, type: 'follow_up_3' }))
      ];

      results.processed = allNeedingFollowUp.length;

      if (allNeedingFollowUp.length > 0) {
        logger.info(`Found ${allNeedingFollowUp.length} contacts needing follow-ups`);
      }

      return results;
    } catch (error) {
      logger.error('Error processing follow-ups:', error);
      throw error;
    }
  }

  /**
   * Get all contacts eligible for sending today
   * Includes: pending contacts and those needing follow-ups
   * @returns {Array} Array of { contact, messageType }
   */
  async getEligibleContacts() {
    const eligible = [];

    // Get pending contacts (never contacted)
    const pending = contactManager.getContactsByStatus('pending');
    eligible.push(...pending.map(c => ({ contact: c, messageType: 'initial' })));

    // Get contacts needing first follow-up
    const needFollowUp1 = contactManager.getContactsNeedingFollowUp(
      timingConfig.followUp.afterInitial,
      'contacted_1'
    );
    eligible.push(...needFollowUp1.map(c => ({ contact: c, messageType: 'follow_up_1' })));

    // Get contacts needing second follow-up
    const needFollowUp2 = contactManager.getContactsNeedingFollowUp(
      timingConfig.followUp.afterFollowUp1,
      'follow_up_1'
    );
    eligible.push(...needFollowUp2.map(c => ({ contact: c, messageType: 'follow_up_2' })));

    // Get contacts needing third follow-up
    const needFollowUp3 = contactManager.getContactsNeedingFollowUp(
      timingConfig.followUp.afterFollowUp2,
      'follow_up_2'
    );
    eligible.push(...needFollowUp3.map(c => ({ contact: c, messageType: 'follow_up_3' })));

    logger.info(`Found ${eligible.length} eligible contacts for outreach`);
    
    return eligible;
  }

  /**
   * Get statistics about contact states
   * @returns {object} Statistics
   */
  getStatistics() {
    const stats = contactManager.getStatistics();
    
    // Add follow-up needed counts
    stats.needFollowUp1 = contactManager.getContactsNeedingFollowUp(
      timingConfig.followUp.afterInitial,
      'contacted_1'
    ).length;
    
    stats.needFollowUp2 = contactManager.getContactsNeedingFollowUp(
      timingConfig.followUp.afterFollowUp1,
      'follow_up_1'
    ).length;
    
    stats.needFollowUp3 = contactManager.getContactsNeedingFollowUp(
      timingConfig.followUp.afterFollowUp2,
      'follow_up_2'
    ).length;

    return stats;
  }
}

// Create singleton instance
const stateManager = new StateManager();

module.exports = stateManager;
