/**
 * Comprehensive Application Test Script
 * Tests all major components before deployment
 */

require('dotenv').config();
const contactManager = require('./src/services/contactManager');
const emailSender = require('./src/services/emailSender');
const inboxMonitor = require('./src/services/inboxMonitor');
const stateManager = require('./src/services/stateManager');
const scheduler = require('./src/services/scheduler');
const { getRandomTemplate, processTemplate } = require('./src/config/templates');
const { isBusinessHours } = require('./src/config/timing');
const logger = require('./src/utils/logger');

// Test results tracking
const results = {
  passed: 0,
  failed: 0,
  tests: []
};

function logTest(name, success, message = '') {
  const status = success ? '✅ PASS' : '❌ FAIL';
  console.log(`${status}: ${name}`);
  if (message) console.log(`   ${message}`);
  
  results.tests.push({ name, success, message });
  if (success) results.passed++;
  else results.failed++;
}

async function runTests() {
  console.log('========================================');
  console.log('🧪 RUNNING APPLICATION TESTS');
  console.log('========================================\n');

  try {
    // Test 1: Environment Variables
    console.log('📋 Test 1: Environment Variables');
    const requiredVars = ['EMAIL_USER', 'EMAIL_PASS', 'SMTP_HOST', 'IMAP_HOST'];
    const missingVars = requiredVars.filter(v => !process.env[v]);
    logTest('Environment Variables', missingVars.length === 0, 
      missingVars.length > 0 ? `Missing: ${missingVars.join(', ')}` : 'All required vars present');
    console.log('');

    // Test 2: Contact Manager
    console.log('📋 Test 2: Contact Manager');
    try {
      await contactManager.initialize();
      logTest('Contact Manager Initialization', true, `Loaded ${contactManager.contacts.length} contacts`);
      
      // Test adding a contact
      const testContact = {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        companyName: 'Test Corp'
      };
      await contactManager.addContact(testContact);
      const added = contactManager.getContactByEmail('test@example.com');
      logTest('Add Contact', added !== null, 'Contact added successfully');
      
      // Clean up test contact
      contactManager.contacts = contactManager.contacts.filter(c => c.email !== 'test@example.com');
      await contactManager.save();
    } catch (error) {
      logTest('Contact Manager', false, error.message);
    }
    console.log('');

    // Test 3: Email Sender (SMTP)
    console.log('📋 Test 3: Email Sender (SMTP)');
    try {
      await emailSender.initialize();
      logTest('SMTP Connection', true, 'Connected successfully');
    } catch (error) {
      logTest('SMTP Connection', false, error.message);
    }
    console.log('');

    // Test 4: Inbox Monitor (IMAP)
    console.log('📋 Test 4: Inbox Monitor (IMAP)');
    try {
      await inboxMonitor.connect();
      logTest('IMAP Connection', true, 'Connected successfully');
      await inboxMonitor.disconnect();
      logTest('IMAP Disconnect', true, 'Disconnected successfully');
    } catch (error) {
      logTest('IMAP Connection', false, error.message);
    }
    console.log('');

    // Test 5: Template System
    console.log('📋 Test 5: Template System');
    try {
      const template = getRandomTemplate('initial');
      logTest('Get Random Template', template && template.subject && template.body, 
        `Got variation ${template.variationIndex}`);
      
      const processed = processTemplate(template.subject, {
        firstName: 'John',
        email: 'john@example.com',
        companyName: 'Acme Corp'
      });
      const hasReplacement = processed.includes('John') || processed.includes('Acme Corp');
      logTest('Process Template', hasReplacement, hasReplacement ? 'Template variables replaced' : 'Failed to replace variables');
    } catch (error) {
      logTest('Template System', false, error.message);
    }
    console.log('');

    // Test 6: State Manager
    console.log('📋 Test 6: State Manager');
    try {
      const eligible = await stateManager.getEligibleContacts();
      logTest('Get Eligible Contacts', Array.isArray(eligible), 
        `Found ${eligible.length} eligible contacts`);
      
      const stats = stateManager.getStatistics();
      logTest('Get Statistics', stats && typeof stats.total === 'number', 
        `Total contacts: ${stats.total}`);
    } catch (error) {
      logTest('State Manager', false, error.message);
    }
    console.log('');

    // Test 7: Timing Functions
    console.log('📋 Test 7: Timing Functions');
    try {
      const inBusiness = isBusinessHours();
      logTest('Business Hours Check', typeof inBusiness === 'boolean', 
        `Currently in business hours: ${inBusiness}`);
    } catch (error) {
      logTest('Timing Functions', false, error.message);
    }
    console.log('');

    // Test 8: Scheduler
    console.log('📋 Test 8: Scheduler');
    try {
      const status = scheduler.getStatus();
      logTest('Scheduler Status', status && typeof status.isSending === 'boolean',
        `Is sending: ${status.isSending}, Daily sent: ${status.dailySent}`);
    } catch (error) {
      logTest('Scheduler', false, error.message);
    }
    console.log('');

    // Print Summary
    console.log('========================================');
    console.log('📊 TEST SUMMARY');
    console.log('========================================');
    console.log(`Total Tests: ${results.passed + results.failed}`);
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log('');

    if (results.failed > 0) {
      console.log('Failed Tests:');
      results.tests.filter(t => !t.success).forEach(t => {
        console.log(`  - ${t.name}: ${t.message}`);
      });
      console.log('');
    }

    // Close connections
    emailSender.close();

    if (results.failed === 0) {
      console.log('🎉 ALL TESTS PASSED! Ready for deployment.');
      process.exit(0);
    } else {
      console.log('⚠️  SOME TESTS FAILED. Please fix before deployment.');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ FATAL TEST ERROR:', error);
    process.exit(1);
  }
}

// Run tests
runTests();
