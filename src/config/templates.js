/**
 * Email Templates and Subject Lines
 * Each template type has 5 variations for randomization
 * 
 * Variables available in templates:
 * - {firstName} - Contact's first name
 * - {lastName} - Contact's last name
 * - {email} - Contact's email
 * - {companyName} - Contact's company (if provided)
 */

const templates = {
  // Initial outreach templates
  initial: {
    subjects: [
      'Quick question about {companyName}',
      'Thought this might interest you',
      '{firstName}, I have an idea for you',
      'Could we connect briefly?',
      'Quick intro - {firstName}'
    ],
    bodies: [
      `Hi {firstName},

I came across {companyName} and was impressed by your work.

[PLACEHOLDER: Your initial pitch here]

Would you be open to a brief conversation?

Best regards,
[Your Name]`,

      `Hello {firstName},

I noticed your work in [industry] and wanted to reach out.

[PLACEHOLDER: Your value proposition]

Let me know if you'd like to chat.

Thanks,
[Your Name]`,

      `Hi {firstName},

Quick intro - I'm [Your Name] from [Your Company].

[PLACEHOLDER: Brief introduction and offer]

Would love to connect if this resonates.

Best,
[Your Name]`,

      `{firstName},

Hope this email finds you well.

[PLACEHOLDER: Personalized opening]

[PLACEHOLDER: Main pitch]

Looking forward to hearing from you.

Regards,
[Your Name]`,

      `Hello {firstName},

I've been following {companyName} and wanted to reach out.

[PLACEHOLDER: Why you're reaching out]

[PLACEHOLDER: What's in it for them]

Let me know if you're interested.

Best,
[Your Name]`
    ]
  },

  // First follow-up (3 days after initial)
  follow_up_1: {
    subjects: [
      'Following up - {firstName}',
      'Re: Quick question about {companyName}',
      'Circling back',
      'Did you see my last email?',
      'Just checking in'
    ],
    bodies: [
      `Hi {firstName},

Just wanted to follow up on my previous email.

[PLACEHOLDER: Brief reminder of your offer]

Still interested in connecting?

Best,
[Your Name]`,

      `Hello {firstName},

I know you're busy, so I'll keep this brief.

[PLACEHOLDER: Quick recap]

Would love to hear your thoughts.

Thanks,
[Your Name]`,

      `{firstName},

Wanted to circle back on my last message.

[PLACEHOLDER: Add additional value or context]

Let me know if this makes sense to discuss.

Regards,
[Your Name]`,

      `Hi {firstName},

Following up on my previous email about [topic].

[PLACEHOLDER: Different angle or additional benefit]

Any interest in learning more?

Best,
[Your Name]`,

      `Hello {firstName},

Just checking in to see if you had a chance to review my last email.

[PLACEHOLDER: Reinforce key benefit]

Happy to chat if you're interested.

Thanks,
[Your Name]`
    ]
  },

  // Second follow-up (5 days after first follow-up)
  follow_up_2: {
    subjects: [
      'One more try - {firstName}',
      'Last follow-up from me',
      '{firstName}, still on your radar?',
      'Final note',
      'Before I close this loop'
    ],
    bodies: [
      `Hi {firstName},

I wanted to reach out one more time.

[PLACEHOLDER: Final pitch or different approach]

If not interested, no worries - I'll stop here.

Best,
[Your Name]`,

      `Hello {firstName},

This will be my last email on this topic.

[PLACEHOLDER: Last attempt value proposition]

Let me know either way so I can plan accordingly.

Thanks,
[Your Name]`,

      `{firstName},

One final note before I close this loop.

[PLACEHOLDER: New angle or testimonial]

Would hate for you to miss out if this is valuable to you.

Regards,
[Your Name]`,

      `Hi {firstName},

I understand you might not be interested, and that's okay.

[PLACEHOLDER: Graceful exit with door open]

Feel free to reach out anytime if circumstances change.

Best,
[Your Name]`,

      `Hello {firstName},

Last attempt from me - I promise!

[PLACEHOLDER: Compelling final offer]

Either way, thanks for your time.

Best regards,
[Your Name]`
    ]
  },

  // Third follow-up (7 days after second follow-up)
  follow_up_3: {
    subjects: [
      'Closing the loop - {firstName}',
      'Final message',
      'Taking you off my list',
      'Last chance',
      'Goodbye for now'
    ],
    bodies: [
      `Hi {firstName},

This is my final email on this topic.

[PLACEHOLDER: Last message]

If I don't hear back, I'll assume you're not interested and won't reach out again.

Best of luck!
[Your Name]`,

      `Hello {firstName},

I'll take the silence as a no, which is totally fine.

[PLACEHOLDER: Breakup email approach]

Wishing you all the best.

Thanks,
[Your Name]`,

      `{firstName},

I'm closing this loop and removing you from my outreach list.

[PLACEHOLDER: Final attempt or different approach]

All the best with {companyName}!

Regards,
[Your Name]`,

      `Hi {firstName},

This is genuinely my last email.

[PLACEHOLDER: Final value proposition or takeaway]

Thanks for your time, even if just reading these emails.

Best,
[Your Name]`,

      `Hello {firstName},

Taking you off my list - no hard feelings!

[PLACEHOLDER: Leave door open for future]

Best of luck with everything.

Cheers,
[Your Name]`
    ]
  }
};

/**
 * Get a random template variation
 * @param {string} type - 'initial', 'follow_up_1', 'follow_up_2', or 'follow_up_3'
 * @returns {object} { subject: string, body: string }
 */
function getRandomTemplate(type) {
  if (!templates[type]) {
    throw new Error(`Invalid template type: ${type}`);
  }

  const templateSet = templates[type];
  const randomIndex = Math.floor(Math.random() * templateSet.subjects.length);

  return {
    subject: templateSet.subjects[randomIndex],
    body: templateSet.bodies[randomIndex],
    variationIndex: randomIndex
  };
}

/**
 * Replace variables in template
 * @param {string} template - Template string with variables
 * @param {object} contact - Contact data
 * @returns {string} Processed template
 */
function processTemplate(template, contact) {
  return template
    .replace(/{firstName}/g, contact.firstName || contact.name || 'there')
    .replace(/{lastName}/g, contact.lastName || '')
    .replace(/{email}/g, contact.email)
    .replace(/{companyName}/g, contact.companyName || 'your company');
}

module.exports = {
  templates,
  getRandomTemplate,
  processTemplate
};
