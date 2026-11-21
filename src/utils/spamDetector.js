export function normalizeNumber(number) {
  return String(number).replace(/[^\d]/g, '');
}

export function analyzeActivity({
  phoneNumber,
  message = '',
  type = 'Call',
  whitelist = [],
  blocklist = [],
  prefixes = [],
  regexRules = [],
  history = [],
  meetingMode = false,
  offTimeMode = false,
}) {
  const normalizedNumber = normalizeNumber(phoneNumber);
  const normalizedWhitelist = whitelist.map(normalizeNumber);
  const normalizedBlocklist = blocklist.map(normalizeNumber);
  const reasons = [];

  if (!normalizedNumber) {
    return {
      classification: 'Unknown',
      risk: 'Low',
      score: 20,
      reasons: ['No phone number was provided'],
    };
  }

  if (normalizedWhitelist.includes(normalizedNumber)) {
    return {
      classification: 'Trusted',
      risk: 'Low',
      score: 10,
      reasons: ['The number is in the whitelist'],
    };
  }

  if (normalizedBlocklist.includes(normalizedNumber)) {
    reasons.push('The number is in the blocklist');
  }

  prefixes.forEach((prefix) => {
    const normalizedPrefix = normalizeNumber(prefix);
    if (normalizedPrefix && normalizedNumber.startsWith(normalizedPrefix)) {
      reasons.push(`Number starts with suspicious prefix ${prefix}`);
    }
  });

  regexRules.forEach((rule) => {
    try {
      if (new RegExp(rule, 'i').test(normalizedNumber)) {
        reasons.push(`Number matches regex rule ${rule}`);
      }
    } catch {
      // Invalid rules are ignored so they cannot stop detection.
    }
  });

  if (type === 'SMS') {
    const spamWords = ['winner', 'prize', 'free', 'urgent', 'otp', 'loan'];
    const lowerMessage = message.toLowerCase();
    const matchedWords = spamWords.filter((word) => lowerMessage.includes(word));

    if (matchedWords.length > 0) {
      reasons.push(`Message contains spam words: ${matchedWords.join(', ')}`);
    }
  }

  if (type === 'Call') {
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    const repeatedCalls = history.filter(
      (item) =>
        item.type === 'Call' &&
        normalizeNumber(item.number) === normalizedNumber &&
        new Date(item.time).getTime() >= tenMinutesAgo
    ).length;

    if (repeatedCalls >= 2) {
      reasons.push(`Number called ${repeatedCalls + 1} times within 10 minutes`);
    }
  }

  if (meetingMode) {
    reasons.push('Meeting mode is enabled');
  }

  if (offTimeMode) {
    reasons.push('Off-time protection is enabled');
  }

  let classification = 'Unknown';
  let risk = 'Low';
  let score = 25;

  if (reasons.length >= 2) {
    classification = 'Spam';
    risk = 'High';
    score = 85;
  } else if (reasons.length === 1) {
    classification = 'Suspicious';
    risk = 'Medium';
    score = 60;
  }

  if (reasons.length === 0) {
    reasons.push('No suspicious rule matched');
  }

  return { classification, risk, score, reasons };
}
