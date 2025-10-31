/**
 * IMAP Connection Test Script
 * This script tests your Gmail/Office 365 inbox connection via IMAP
 * 
 * BEFORE RUNNING:
 * 1. Copy .env.example to .env
 * 2. Fill in your email credentials
 * 3. For Gmail: Enable IMAP and generate App Password
 * 4. Run: node test-imap.js
 */

require('dotenv').config();
const imaps = require('imap-simple');

const config = {
  imap: {
    user: process.env.EMAIL_USER,
    password: process.env.EMAIL_PASS,
    host: process.env.IMAP_HOST,
    port: parseInt(process.env.IMAP_PORT),
    tls: true,
    tlsOptions: { rejectUnauthorized: false },
    authTimeout: 10000
  }
};

async function testImapConnection() {
  console.log('🔍 Testing IMAP Connection...\n');
  console.log(`Provider: ${process.env.EMAIL_PROVIDER}`);
  console.log(`Host: ${process.env.IMAP_HOST}`);
  console.log(`Port: ${process.env.IMAP_PORT}`);
  console.log(`User: ${process.env.EMAIL_USER}\n`);

  let connection;

  try {
    // Connect to inbox
    console.log('📡 Connecting to IMAP server...');
    connection = await imaps.connect(config);
    console.log('✅ Successfully connected to IMAP server!\n');

    // Open INBOX
    console.log('📬 Opening INBOX...');
    await connection.openBox('INBOX');
    console.log('✅ Successfully opened INBOX!\n');

    // Search for recent emails (last 5)
    console.log('📧 Fetching last 5 emails...');
    const searchCriteria = ['ALL'];
    const fetchOptions = {
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)'],
      struct: true,
      markSeen: false
    };

    const messages = await connection.search(searchCriteria, fetchOptions);
    
    if (messages.length === 0) {
      console.log('⚠️  No emails found in inbox\n');
    } else {
      // Get last 5 messages
      const recentMessages = messages.slice(-5).reverse();
      
      console.log(`✅ Found ${messages.length} total emails in inbox`);
      console.log(`\n📋 Showing last ${recentMessages.length} emails:\n`);

      recentMessages.forEach((message, index) => {
        const header = message.parts.find(part => part.which === 'HEADER.FIELDS (FROM TO SUBJECT DATE)');
        const headerLines = header.body;
        
        console.log(`Email #${index + 1}:`);
        console.log(`  From: ${headerLines.from?.[0] || 'N/A'}`);
        console.log(`  To: ${headerLines.to?.[0] || 'N/A'}`);
        console.log(`  Subject: ${headerLines.subject?.[0] || 'N/A'}`);
        console.log(`  Date: ${headerLines.date?.[0] || 'N/A'}`);
        console.log('');
      });
    }

    // Test searching for specific emails
    console.log('🔍 Testing search functionality...');
    const todayDate = new Date();
    const weekAgo = new Date(todayDate);
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentSearchCriteria = [
      ['SINCE', weekAgo.toISOString().split('T')[0].replace(/-/g, '-')]
    ];
    
    const recentEmails = await connection.search(recentSearchCriteria, fetchOptions);
    console.log(`✅ Found ${recentEmails.length} emails from the last 7 days\n`);

    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎉 IMAP TEST SUCCESSFUL!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('\n✅ Your IMAP connection is working correctly!');
    console.log('✅ You can read emails from your inbox');
    console.log('✅ You can search for specific emails');
    console.log('\n👉 Next step: Run the full application');

  } catch (error) {
    console.error('\n❌ IMAP Connection Failed!\n');
    console.error('Error:', error.message);
    
    if (error.message.includes('Invalid credentials')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Check your email and password in .env file');
      console.error('   - For Gmail: Enable IMAP in Gmail settings');
      console.error('   - For Gmail: Use App Password, not regular password');
      console.error('   - For Office 365: Enable basic auth or use App Password');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ETIMEDOUT')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Check your IMAP_HOST setting in .env file');
      console.error('   - Verify you have internet connection');
      console.error('   - Check if firewall is blocking IMAP port');
    } else if (error.message.includes('self signed certificate')) {
      console.error('\n💡 Troubleshooting:');
      console.error('   - Your email provider may use self-signed certificates');
      console.error('   - This is usually OK for Office 365/GoDaddy');
    }
    
    process.exit(1);
  } finally {
    if (connection) {
      connection.end();
      console.log('\n🔌 Disconnected from IMAP server');
    }
  }
}

// Run the test
if (require.main === module) {
  testImapConnection().catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });
}

module.exports = { testImapConnection };
