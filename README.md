# Email Outreach Automation App

A lightweight Node.js application for automated email outreach with follow-ups, inbox monitoring, and response tracking.

## Features

- ✉️ Automated email sending via SMTP (Gmail or Office 365)
- 📬 Inbox monitoring via IMAP to detect responses
- 🔄 Automatic follow-up sequences (up to 3 follow-ups)
- 🎲 Randomized sending patterns (time, templates, subject lines)
- 📊 Contact state management with JSON storage
- 🚦 Daily sending limits (18-40 emails/day)
- ⏰ Business hours scheduling (Mon-Fri, 8 AM - 5 PM ET)
- 🔀 Template and subject line rotation (5 variations each)

## Quick Start - Test IMAP First!

### Step 1: Setup Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your credentials
# For Gmail: Use App Password (see instructions below)
# For Office 365: Use email password or App Password
```

### Step 2: Test IMAP Connection

Before building the full app, test that inbox polling works:

```bash
node test-imap.js
```

This will:
- Connect to your email inbox via IMAP
- List your recent emails
- Verify search functionality
- Confirm everything is working

### Step 3: Gmail Setup (If Using Gmail)

1. **Enable IMAP:**
   - Go to Gmail → Settings → See all settings
   - Click "Forwarding and POP/IMAP" tab
   - Enable IMAP → Save Changes

2. **Generate App Password:**
   - Go to Google Account → Security
   - Enable 2-Step Verification (if not already enabled)
   - Search for "App Passwords"
   - Select "Mail" and generate password
   - Copy the 16-character password to your .env file

### Step 4: Office 365 Setup (If Using Office 365)

1. **Update .env file:**
   ```
   EMAIL_PROVIDER=office365
   SMTP_HOST=smtp.office365.com
   IMAP_HOST=outlook.office365.com
   ```

2. **Authentication:**
   - Option 1: Use your regular email password (if basic auth is enabled)
   - Option 2: Generate App Password from Office 365 security settings

## Project Structure

```
email-outreach-app/
├── src/
│   ├── config/
│   │   ├── email.js         # Email provider configuration
│   │   ├── templates.js     # Email templates & subjects
│   │   └── timing.js        # Follow-up timing settings
│   ├── services/
│   │   ├── emailSender.js   # Send emails via SMTP
│   │   ├── inboxMonitor.js  # Monitor inbox via IMAP
│   │   ├── contactManager.js # Contact CRUD operations
│   │   ├── stateManager.js   # State transitions
│   │   └── scheduler.js      # Sending scheduler
│   ├── utils/
│   │   ├── logger.js        # Logging utility
│   │   ├── randomizer.js    # Random selection helpers
│   │   └── emailParser.js   # Parse email responses
│   ├── jobs/
│   │   ├── sendEmails.js    # Cron job for sending
│   │   └── checkResponses.js # Cron job for monitoring
│   └── data/
│       └── contacts.json    # Contact database
├── index.js                  # Main application entry
├── test-imap.js             # IMAP connection test
└── .env                     # Environment variables (create from .env.example)
```

## Contact States

- `pending` - New contact, not yet contacted
- `contacted_1` - Initial email sent
- `follow_up_1` - First follow-up sent
- `follow_up_2` - Second follow-up sent
- `follow_up_3` - Third follow-up sent
- `responded` - Contact replied (no more emails)

## Follow-up Timing

- Initial → Follow-up 1: 3 days
- Follow-up 1 → Follow-up 2: 5 days
- Follow-up 2 → Follow-up 3: 7 days

## Daily Sending Limits

- Maximum: 40 emails/day
- Minimum: 18 emails/day
- Target: 20-30 emails/day (randomized)

## Deployment to Render

### Prerequisites
- Paid Render account
- Email credentials configured

### Setup

1. **Create Background Worker:**
   - New → Background Worker
   - Connect your GitHub repository
   - Build Command: `npm install`
   - Start Command: `node index.js`

2. **Set Environment Variables:**
   - Add all variables from .env file
   - Settings → Environment → Environment Variables

3. **Deploy:**
   - Render will automatically deploy and start the worker
   - Check logs to confirm cron jobs are running

## Switching Between Gmail and Office 365

Simply update these values in your `.env` file:

**For Gmail:**
```env
EMAIL_PROVIDER=gmail
SMTP_HOST=smtp.gmail.com
IMAP_HOST=imap.gmail.com
```

**For Office 365:**
```env
EMAIL_PROVIDER=office365
SMTP_HOST=smtp.office365.com
IMAP_HOST=outlook.office365.com
```

## Security Notes

- ⚠️ Never commit `.env` file to version control
- ✅ Use App Passwords, not regular passwords
- ✅ Keep daily limits reasonable to avoid spam flags
- ✅ Include unsubscribe links in templates
- ✅ Monitor bounce rates and deliverability

## Troubleshooting

### IMAP Connection Failed
- Verify IMAP is enabled in your email settings
- Check credentials in .env file
- For Gmail: Must use App Password, not regular password
- For Office 365: Verify basic auth is enabled or use App Password

### Emails Not Sending
- Check SMTP credentials
- Verify sending limits haven't been reached
- Check logs for error messages
- Ensure business hours settings are correct

### Responses Not Detected
- Verify IMAP connection is working (run test-imap.js)
- Check that response detection logic matches your email format
- Review logs for inbox monitoring errors

## License

ISC
