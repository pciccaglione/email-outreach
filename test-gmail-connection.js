const nodemailer = require('nodemailer');

async function testGmailConnection() {
  console.log('🧪 Testing NEW Gmail Account...');
  console.log('Email: ajdoerr7@gmail.com');
  console.log('');

  // Test BOTH - with spaces and without spaces
  const passwordWithSpaces = 'hjmz efil jhep avln';
  const passwordWithoutSpaces = 'hjmzefiljhepavln';

  console.log('Test 1: Password WITH spaces: "' + passwordWithSpaces + '"');
  const transporter1 = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'ajdoerr7@gmail.com',
      pass: passwordWithSpaces
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    }
  });

  try {
    await transporter1.verify();
    console.log('✅ WITH SPACES - SUCCESS!');
    console.log('Use password: "qwjl qucj dtpg xqf"');
    console.log('');
    return passwordWithSpaces;
  } catch (error) {
    console.log('❌ WITH SPACES - FAILED:', error.message);
  }

  console.log('');
  console.log('Test 2: Password WITHOUT spaces: "' + passwordWithoutSpaces + '"');
  const transporter2 = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'ajdoerr7@gmail.com',
      pass: passwordWithoutSpaces
    },
    tls: {
      rejectUnauthorized: false,
      minVersion: 'TLSv1.2'
    }
  });

  try {
    await transporter2.verify();
    console.log('✅ WITHOUT SPACES - SUCCESS!');
    console.log('Use password: "qwjlqucjdtpgxqf"');
    console.log('');
    return passwordWithoutSpaces;
  } catch (error) {
    console.log('❌ WITHOUT SPACES - FAILED:', error.message);
    console.log('');
    console.log('BOTH TESTS FAILED!');
    console.log('The app password may be invalid or revoked.');
    console.log('Please generate a NEW app password at:');
    console.log('https://myaccount.google.com/apppasswords');
    return false;
  }
}

testGmailConnection();
