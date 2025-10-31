const fs = require('fs').promises;
const path = require('path');
const logger = require('../utils/logger');
const { getRandomItem } = require('../utils/randomizer');

const CONTACTS_FILE = path.join(__dirname, '../data/contacts.json');

/**
 * Contact Manager Service
 * Handles CRUD operations for contacts
 */
class ContactManager {
  constructor() {
    this.contacts = [];
    this.metadata = {
      lastUpdated: null,
      totalContacts: 0,
      contactedToday: 0,
      lastResetDate: null
    };
  }

  /**
   * Initialize and load contacts from file
   */
  async initialize() {
    try {
      const data = await fs.readFile(CONTACTS_FILE, 'utf8');
      const parsed = JSON.parse(data);
      this.contacts = parsed.contacts || [];
      this.metadata = parsed.metadata || this.metadata;
      
      // Reset daily counter if it's a new day
      await this.resetDailyCounterIfNeeded();
      
      logger.info(`Loaded ${this.contacts.length} contacts from database`);
    } catch (error) {
      if (error.code === 'ENOENT') {
        logger.info('No contacts file found, starting with empty list');
        await this.save();
      } else {
        logger.error('Error loading contacts:', error);
        throw error;
      }
    }
  }

  /**
   * Save contacts to file
   */
  async save() {
    try {
      this.metadata.lastUpdated = new Date().toISOString();
      this.metadata.totalContacts = this.contacts.length;
      
      const data = {
        contacts: this.contacts,
        metadata: this.metadata
      };
      
      await fs.writeFile(CONTACTS_FILE, JSON.stringify(data, null, 2));
      logger.debug('Contacts saved to database');
    } catch (error) {
      logger.error('Error saving contacts:', error);
      throw error;
    }
  }

  /**
   * Add new contact
   * @param {object} contact - Contact data
   */
  async addContact(contact) {
    if (!contact.email) {
      throw new Error('Contact must have an email');
    }

    // Check for duplicate
    const existing = this.contacts.find(c => 
      c.email.toLowerCase() === contact.email.toLowerCase()
    );
    
    if (existing) {
      logger.warn(`Contact already exists: ${contact.email}`);
      return existing;
    }

    const newContact = {
      id: this.generateId(),
      email: contact.email.toLowerCase(),
      firstName: contact.firstName || '',
      lastName: contact.lastName || '',
      name: contact.name || contact.firstName || '',
      companyName: contact.companyName || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      lastContacted: null,
      templatesUsed: [],
      subjectsUsed: [],
      messageHistory: []
    };

    this.contacts.push(newContact);
    await this.save();
    
    logger.info(`Added new contact: ${newContact.email}`);
    return newContact;
  }

  /**
   * Add multiple contacts in bulk
   * @param {Array} contactList - Array of contact objects
   */
  async addBulkContacts(contactList) {
    const results = {
      added: 0,
      skipped: 0,
      errors: []
    };

    for (const contact of contactList) {
      try {
        const existing = this.contacts.find(c => 
          c.email.toLowerCase() === contact.email.toLowerCase()
        );
        
        if (existing) {
          results.skipped++;
          continue;
        }

        await this.addContact(contact);
        results.added++;
      } catch (error) {
        results.errors.push({ contact, error: error.message });
        logger.error(`Error adding contact ${contact.email}:`, error);
      }
    }

    logger.info(`Bulk import complete: ${results.added} added, ${results.skipped} skipped`);
    return results;
  }

  /**
   * Get contact by ID
   */
  getContactById(id) {
    return this.contacts.find(c => c.id === id);
  }

  /**
   * Get contact by email
   */
  getContactByEmail(email) {
    return this.contacts.find(c => 
      c.email.toLowerCase() === email.toLowerCase()
    );
  }

  /**
   * Update contact
   */
  async updateContact(id, updates) {
    const contact = this.getContactById(id);
    if (!contact) {
      throw new Error(`Contact not found: ${id}`);
    }

    Object.assign(contact, updates);
    await this.save();
    
    logger.debug(`Updated contact: ${contact.email}`);
    return contact;
  }

  /**
   * Get contacts by status
   */
  getContactsByStatus(status) {
    return this.contacts.filter(c => c.status === status);
  }

  /**
   * Get random contact by status
   */
  getRandomContactByStatus(status) {
    const eligible = this.getContactsByStatus(status);
    return getRandomItem(eligible);
  }

  /**
   * Get contacts needing follow-up
   * @param {number} daysAgo - Days since last contact
   * @param {string} currentStatus - Current status to filter
   */
  getContactsNeedingFollowUp(daysAgo, currentStatus) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysAgo);

    return this.contacts.filter(contact => {
      if (contact.status !== currentStatus) return false;
      if (!contact.lastContacted) return false;
      
      const lastContactDate = new Date(contact.lastContacted);
      return lastContactDate <= cutoffDate;
    });
  }

  /**
   * Mark contact as responded
   */
  async markAsResponded(id) {
    const contact = this.getContactById(id);
    if (!contact) {
      throw new Error(`Contact not found: ${id}`);
    }

    contact.status = 'responded';
    contact.respondedAt = new Date().toISOString();
    await this.save();
    
    logger.info(`Contact marked as responded: ${contact.email}`);
    return contact;
  }

  /**
   * Record message sent
   */
  async recordMessageSent(id, messageType, templateIndex, subjectIndex) {
    const contact = this.getContactById(id);
    if (!contact) {
      throw new Error(`Contact not found: ${id}`);
    }

    contact.lastContacted = new Date().toISOString();
    contact.templatesUsed.push(templateIndex);
    contact.subjectsUsed.push(subjectIndex);
    contact.messageHistory.push({
      type: messageType,
      sentAt: new Date().toISOString(),
      templateIndex,
      subjectIndex
    });

    // Update status based on message type
    if (messageType === 'initial') {
      contact.status = 'contacted_1';
    } else if (messageType === 'follow_up_1') {
      contact.status = 'follow_up_1';
    } else if (messageType === 'follow_up_2') {
      contact.status = 'follow_up_2';
    } else if (messageType === 'follow_up_3') {
      contact.status = 'follow_up_3';
    }

    // Increment daily counter
    this.metadata.contactedToday++;
    
    await this.save();
    
    logger.info(`Recorded ${messageType} sent to: ${contact.email}`);
    return contact;
  }

  /**
   * Get daily send count
   */
  getDailySendCount() {
    return this.metadata.contactedToday;
  }

  /**
   * Reset daily counter if it's a new day
   */
  async resetDailyCounterIfNeeded() {
    const today = new Date().toISOString().split('T')[0];
    const lastReset = this.metadata.lastResetDate;

    if (lastReset !== today) {
      this.metadata.contactedToday = 0;
      this.metadata.lastResetDate = today;
      await this.save();
      logger.info('Daily send counter reset');
    }
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `contact_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      total: this.contacts.length,
      pending: this.getContactsByStatus('pending').length,
      contacted_1: this.getContactsByStatus('contacted_1').length,
      follow_up_1: this.getContactsByStatus('follow_up_1').length,
      follow_up_2: this.getContactsByStatus('follow_up_2').length,
      follow_up_3: this.getContactsByStatus('follow_up_3').length,
      responded: this.getContactsByStatus('responded').length,
      contactedToday: this.metadata.contactedToday
    };
  }
}

// Create singleton instance
const contactManager = new ContactManager();

module.exports = contactManager;
