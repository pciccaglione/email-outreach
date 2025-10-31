/**
 * Email Templates and Subject Lines
 * Each template type has 5 variations for randomization
 * 
 * Variables available in templates:
 * - {firstName} - Contact's first name
 * - {lastName} - Contact's last name
 * - {email} - Contact's email
 * - {companyName} - Contact's company (if provided)
 * - {city} - City name (if provided)
 */

const templates = {
  // Initial outreach templates (Email 1 - Local Intro + Quick Win)
  initial: {
    subjects: [
      "Milford mortgage partner – fast 2-hour pre-approvals + local results",
      "Helping {companyName} buyers close faster in {city}",
      "Local lender who got a Walnut Beach condo funded 👇",
      "{city} mortgage broker – funding tricky deals + fast closings",
      "Your {city} buyers deserve 2-hour pre-approvals"
    ],
    bodies: [
      `Hi {firstName},

I'm AJ, a mortgage broker based right here in Milford. My wife's from Trumbull, and we moved back from Hawaii last year after our daughter was born — so I've been rebuilding my local realtor network across {city} and surrounding towns.

At Barrett Financial Group, I work with 100+ wholesale lenders to help buyers get creative financing and faster closings. Here's a quick example:

I recently funded a condo purchase at Walnut Beach in Milford — a building that had been on Fannie Mae's "Do Not Lend" list for years. After working directly with the HOA and the lender's underwriters, I found a single-unit approval product that got my clients funded in just 10 days.

If you ever have a tricky deal like that, I'd love to help get it across the finish line. I can typically get pre-approval letters in under 2 hours once the application's complete.

Would you be open to a quick 10-minute call next week to connect?

Best,
AJ Doerr
Mortgage Broker — Barrett Financial Group
📞 808-226-9421 | 📍 Milford, CT

Serving agents across Milford, Orange, Stratford, and Fairfield County

P.S. I'm always happy to review your toughest loan scenarios — even if it's just to confirm what's possible. Sometimes I can find solutions others miss.`,

      `Hi {firstName},

I'm AJ Doerr, a mortgage broker working with {city} realtors to help their buyers close faster with creative financing solutions.

At Barrett Financial Group, I have access to 100+ wholesale lenders, which means I can often find financing for deals that other lenders turn down. Here's what that looks like in practice:

Recently, I funded a Walnut Beach condo in Milford that had been on Fannie Mae's "Do Not Lend" list. By working directly with the HOA and finding the right single-unit approval product, we got the deal closed in 10 days.

I can typically deliver pre-approval letters in under 2 hours once we have a complete application — which helps your buyers' offers stand out in competitive markets.

Would you be open to a brief 10-minute intro call next week?

Thanks,
AJ Doerr
Barrett Financial Group
📞 808-226-9421 | 📍 Milford, CT

P.S. Feel free to send me your trickiest scenarios anytime — I love the challenge of finding solutions.`,

      `Hi {firstName},

Quick intro — I'm AJ, a local mortgage broker in Milford working to rebuild my network after moving back from Hawaii last year.

I work with Barrett Financial Group and have access to 100+ wholesale lenders, so I can usually find creative solutions for tough deals. For example:

I just funded a Walnut Beach condo that had been blacklisted by Fannie Mae for years. After coordinating with the HOA and the right lender, we closed in 10 days using a single-unit approval product.

If you ever have a deal like that — or just want faster pre-approvals for your buyers — I'd love to connect.

I typically turn around pre-approval letters in under 2 hours once the application is complete.

Would next week work for a quick 10-minute call?

Best,
AJ Doerr
📞 808-226-9421
Barrett Financial Group | Milford, CT

P.S. I'm always happy to review tricky loan scenarios, even if just to confirm what's possible.`,

      `Hi {firstName},

I'm AJ, a mortgage broker based in Milford, CT. My wife's from Trumbull, and we recently moved back from Hawaii to raise our daughter closer to family.

I work with Barrett Financial Group and specialize in creative financing for {city} buyers — especially on deals that require fast closings or unique lending solutions.

For example, I recently funded a Walnut Beach condo in Milford that had been on Fannie Mae's restricted list. By working with the HOA and finding the right lender, we got my clients funded in just 10 days.

I can also provide pre-approval letters in under 2 hours, which helps your buyers compete in fast-moving markets.

If you'd like to connect for a quick intro call, I'd love to learn more about your business and see if we can help each other.

Does next week work for a brief 10-minute chat?

Thanks,
AJ Doerr
Mortgage Broker — Barrett Financial Group
📞 808-226-9421 | 📍 Milford, CT

P.S. Feel free to send over any tough loan scenarios — sometimes I can find solutions others miss.`,

      `Hi {firstName},

I'm AJ Doerr, a local mortgage broker rebuilding my realtor network across {city} and Fairfield County.

I work with Barrett Financial Group and have access to 100+ wholesale lenders, which means I can often solve financing problems that other lenders can't.

Case in point: I recently funded a Walnut Beach condo in Milford that had been on Fannie Mae's "Do Not Lend" list for years. By coordinating with the HOA and the underwriters, we closed in 10 days using a single-unit approval product.

If you ever have a tricky deal or just want faster service for your buyers, I'd love to help. I typically deliver pre-approval letters in under 2 hours.

Would you be open to a quick 10-minute intro call next week?

Best,
AJ Doerr
📞 808-226-9421
Barrett Financial Group | Milford, CT

Serving agents across Milford, Orange, Stratford, and Fairfield County

P.S. Send me your toughest scenarios anytime — I love finding creative solutions.`
    ]
  },

  // First follow-up (Email 2 - Authority + Problem Solver)
  follow_up_1: {
    subjects: [
      "Saved a 30-day closing in Milford — thought you'd appreciate this one",
      "How I helped a realtor secure $300k in 2 weeks",
      "When your buyer's short on funds… here's what worked",
      "{firstName}, quick follow-up on creative financing",
      "Solved a tricky HELOC deal in {city} last month"
    ],
    bodies: [
      `Hey {firstName},

Just wanted to follow up in case my first note got buried — and share another quick story from right here in {city}.

A Milford realtor called last month — her buyer had an investment property under contract but was short on funds for the down payment and closing costs. We met the next day and mapped out a first-lien HELOC on another property he owned free and clear. Within two weeks, we accessed $300k, allowing him to close on time and finish repairs to get renters in within a month.

That's the kind of creative, fast-moving lending I focus on — solving problems other lenders can't, and helping realtors protect their deals.

Even if you don't have a file right now, I'd love to connect for a quick intro call and explore how we can make {companyName} buyers' offers stand out.

Does next week work for a short chat?

Thanks,
AJ

📞 808-226-9421 | 📍 Milford, CT
Barrett Financial Group — Licensed in 49 states`,

      `Hey {firstName},

Following up from my last email — wanted to share another quick win from right here in {city}.

Last month, a local realtor reached out with a buyer who was short on funds for an investment property closing. We solved it fast by setting up a first-lien HELOC on another property the buyer owned free and clear.

Result: $300k accessed in two weeks, closed on time, and the buyer finished repairs to get renters in within a month.

This is what I do — find creative solutions that protect your deals and help your buyers close faster.

Would you be open to a brief intro call next week to explore how we can work together?

Thanks,
AJ Doerr
📞 808-226-9421
Barrett Financial Group | Milford, CT`,

      `Hey {firstName},

Circling back in case you missed my first note. Here's another example of how I help {city} realtors close tough deals:

A Milford agent called with a buyer who needed funds fast for an investment property. The buyer had another property owned free and clear, so we structured a first-lien HELOC and accessed $300k within two weeks — closing on time and getting renters in within a month.

That's the kind of problem-solving I bring to every deal.

Even if you don't have a file right now, I'd love to connect and see how we can help your buyers stand out.

Does next week work for a quick 10-minute call?

Best,
AJ
📞 808-226-9421
Barrett Financial Group | Milford, CT`,

      `Hey {firstName},

Quick follow-up from my previous email. Here's another success story from {city}:

A realtor reached out last month with a buyer short on funds for an investment closing. We structured a first-lien HELOC on another property the buyer owned, accessed $300k in two weeks, and closed on time.

The buyer finished repairs within a month and got renters in place — protecting the realtor's commission and making everyone happy.

This is the kind of creative financing I specialize in.

Would you be open to a brief 10-minute call to explore how we can help your buyers?

Thanks,
AJ Doerr
808-226-9421
Barrett Financial Group`,

      `Hey {firstName},

Following up — wanted to share how I recently helped a {city} realtor save a deal.

Her buyer needed funds fast for an investment property. We set up a first-lien HELOC on another property he owned free and clear, accessed $300k within two weeks, and closed on time. He finished repairs within a month and got renters in place.

That's what I do — solve problems that keep your deals moving.

Would next week work for a quick intro call?

Best,
AJ
📞 808-226-9421 | Milford, CT
Barrett Financial Group`
    ]
  },

  // Second follow-up (Email 3 - Social Proof + Trust Builder)
  follow_up_2: {
    subjects: [
      "Before I close the loop – one more local success story",
      "Fairfield County $4M close — smoothest file of the year",
      "P.S. – A lender you can actually reach when it counts",
      "{firstName}, one final story before I move on",
      "Last note – here's how I saved a $4M deal"
    ],
    bodies: [
      `Hi {firstName},

Before I close the loop, I wanted to share one last story that shows how I work.

A few months ago I handled a $4M purchase in Fairfield County with a $1M down payment. By structuring the borrower's main income correctly, we avoided using rental income and cut out over 50 lender conditions. We got clear-to-close two weeks ahead of schedule — giving the realtor and buyer total peace of mind while they simultaneously sold their existing home.

That's what I aim for on every file — fast, transparent, local, and reliable.

If you ever want to grab coffee or hop on a quick call, I'd love to connect. Here's my direct line and calendar:
📞 808-226-9421
📅 [Insert Calendly link]

Take care,
AJ Doerr
Mortgage Broker — Barrett Financial Group
📍 Milford, CT

Serving agents across Milford, Orange, Stratford, and Fairfield County

P.S. I'm always happy to review or troubleshoot loan scenarios for your clients — even if another lender is already working the file. Sometimes I can save deals at the 11th hour.`,

      `Hi {firstName},

One last note before I stop reaching out.

Recently, I handled a $4M purchase in Fairfield County. By structuring the income correctly upfront, we avoided 50+ lender conditions and cleared to close two weeks early — giving everyone peace of mind.

That's what I focus on: fast, transparent, reliable service for {city} realtors and their buyers.

If you'd like to connect, here's my direct line:
📞 808-226-9421

Otherwise, no worries — I'll stop here.

Take care,
AJ Doerr
Barrett Financial Group | Milford, CT

P.S. Feel free to send over any tricky loan scenarios — I'm always happy to review them, even if another lender is already involved.`,

      `Hi {firstName},

Before I close the loop, here's one more success story from Fairfield County:

I recently funded a $4M purchase with a $1M down payment. By structuring the borrower's income correctly, we avoided rental income complications and eliminated 50+ lender conditions. We cleared to close two weeks early, giving the realtor and buyer complete peace of mind.

That's what I aim for — fast, reliable, local service.

If you'd like to connect, I'm here:
📞 808-226-9421

Thanks,
AJ Doerr
Mortgage Broker | Barrett Financial Group
Milford, CT

P.S. I'm always happy to review tough loan scenarios, even if another lender is working the file.`,

      `Hi {firstName},

One final story before I stop reaching out.

A few months ago, I closed a $4M purchase in Fairfield County. By structuring the borrower's income correctly, we cut out 50+ lender conditions and cleared to close two weeks early.

The realtor told me it was the smoothest high-dollar file she'd ever worked — and the buyers were thrilled.

If that sounds like the kind of service you'd want for your clients, let's connect:
📞 808-226-9421

Best,
AJ Doerr
Barrett Financial Group
Milford, CT

P.S. I'm always happy to troubleshoot loan scenarios — even if you're already working with another lender.`,

      `Hi {firstName},

Before I close the loop, here's my favorite success story from this year:

$4M purchase in Fairfield County. $1M down payment. By structuring the income correctly, we avoided rental income complications and eliminated 50+ lender conditions. Clear-to-close two weeks ahead of schedule.

That's what fast, reliable, local lending looks like.

If you'd ever like to connect, here's my direct line:
📞 808-226-9421

Take care,
AJ Doerr
Mortgage Broker | Barrett Financial Group
Milford, CT

P.S. Feel free to send over any tough scenarios — I love solving problems other lenders can't.`
    ]
  },

  // Third follow-up (Final breakup email)
  follow_up_3: {
    subjects: [
      "Closing the loop - {firstName}",
      "Final message from AJ",
      "Taking you off my list",
      "Last note — thanks for your time",
      "Goodbye for now"
    ],
    bodies: [
      `Hi {firstName},

This is my final email — I'll take the silence as a no, which is totally fine.

If anything changes and you'd like to connect down the road, feel free to reach out anytime:
📞 808-226-9421

Best of luck with {companyName} and all your future closings!

Thanks,
AJ Doerr
Barrett Financial Group | Milford, CT`,

      `Hi {firstName},

I'm closing the loop and removing you from my outreach list.

If circumstances change and you'd like to connect in the future, here's my info:
📞 808-226-9421
AJ Doerr | Barrett Financial Group

All the best with {companyName}!

Thanks,
AJ`,

      `Hi {firstName},

This is genuinely my last email. I'll assume you're not interested, which is completely fine.

If anything changes, feel free to reach out:
📞 808-226-9421

Best of luck with everything!

AJ Doerr
Mortgage Broker | Milford, CT`,

      `Hi {firstName},

Taking you off my list — no hard feelings!

If you ever need creative financing or fast closings for your buyers, here's my info:
📞 808-226-9421

Best,
AJ Doerr
Barrett Financial Group`,

      `Hi {firstName},

Final note from me. If things change and you'd like to connect, feel free to reach out anytime:
📞 808-226-9421

Otherwise, best of luck with {companyName}!

Thanks,
AJ`
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
    .replace(/{companyName}/g, contact.companyName || 'your company')
    .replace(/{city}/g, contact.city || 'your area');
}

module.exports = {
  templates,
  getRandomTemplate,
  processTemplate
};
