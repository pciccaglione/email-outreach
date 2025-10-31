/**
 * Email parsing utilities for response detection
 */

/**
 * Extract email address from various formats
 * @param {string} emailString - Email string (e.g., "Name <email@domain.com>")
 * @returns {string|null} Extracted email address
 */
function extractEmailAddress(emailString) {
  if (!emailString) return null;
  
  // Match email in angle brackets: "Name <email@domain.com>"
  const bracketMatch = emailString.match(/<([^>]+)>/);
  if (bracketMatch) {
    return bracketMatch[1].toLowerCase().trim();
  }
  
  // Match plain email address
  const emailMatch = emailString.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9_-]+)/);
  if (emailMatch) {
    return emailMatch[1].toLowerCase().trim();
  }
  
  return emailString.toLowerCase().trim();
}

/**
 * Check if email is an auto-reply
 * @param {object} email - Email object with subject and body
 * @returns {boolean} True if auto-reply
 */
function isAutoReply(email) {
  const subject = (email.subject || '').toLowerCase();
  const body = (email.body || '').toLowerCase();
  
  const autoReplyIndicators = [
    'out of office',
    'out of the office',
    'automatic reply',
    'auto-reply',
    'autoreply',
    'vacation',
    'away from my desk',
    'currently unavailable',
    'do not reply',
    'automated response',
    'delivery status notification'
  ];
  
  return autoReplyIndicators.some(indicator => 
    subject.includes(indicator) || body.includes(indicator)
  );
}

/**
 * Check if email is a bounce/failure notification
 * @param {object} email - Email object
 * @returns {boolean} True if bounce
 */
function isBounce(email) {
  const from = (email.from || '').toLowerCase();
  const subject = (email.subject || '').toLowerCase();
  
  const bounceIndicators = [
    'mailer-daemon',
    'postmaster',
    'mail delivery',
    'delivery status',
    'undeliverable',
    'failure notice',
    'returned mail',
    'delivery failed'
  ];
  
  return bounceIndicators.some(indicator =>
    from.includes(indicator) || subject.includes(indicator)
  );
}

/**
 * Check if message is a legitimate reply
 * @param {object} email - Email object
 * @returns {boolean} True if legitimate reply
 */
function isLegitimateReply(email) {
  return !isAutoReply(email) && !isBounce(email);
}

/**
 * Parse email headers
 * @param {object} headerParts - Header parts from IMAP
 * @returns {object} Parsed headers
 */
function parseHeaders(headerParts) {
  const headers = {};
  
  if (headerParts.from && headerParts.from[0]) {
    headers.from = extractEmailAddress(headerParts.from[0]);
  }
  
  if (headerParts.to && headerParts.to[0]) {
    headers.to = extractEmailAddress(headerParts.to[0]);
  }
  
  if (headerParts.subject && headerParts.subject[0]) {
    headers.subject = headerParts.subject[0];
  }
  
  if (headerParts.date && headerParts.date[0]) {
    headers.date = new Date(headerParts.date[0]);
  }
  
  if (headerParts['message-id'] && headerParts['message-id'][0]) {
    headers.messageId = headerParts['message-id'][0];
  }
  
  return headers;
}

/**
 * Extract plain text from email body
 * @param {string} body - Email body (may contain HTML)
 * @returns {string} Plain text
 */
function extractPlainText(body) {
  if (!body) return '';
  
  // Remove HTML tags
  let text = body.replace(/<[^>]*>/g, ' ');
  
  // Decode HTML entities
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&');
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

module.exports = {
  extractEmailAddress,
  isAutoReply,
  isBounce,
  isLegitimateReply,
  parseHeaders,
  extractPlainText
};
