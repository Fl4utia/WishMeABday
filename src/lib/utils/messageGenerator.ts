function normalizePrompt(prompt: string): string {
  return prompt
    .replace(/^(write a birthday message|generate a birthday message).*?(based on the following description:|for a friend)/i, "")
    .replace(/\(don't mention names\)/i, "")
    .replace(/\s+/g, " ")
    .trim();
}

export function buildLocalBirthdayMessage(prompt: string): string {
  const description = normalizePrompt(prompt);

  if (description) {
    return `Happy Birthday! I hope your day is filled with joy, laughter, and a few extra sweet surprises. Since you ${description.toLowerCase()}, I thought it was only fitting to make today feel extra special. Wishing you a year full of fun, comfort, and all the little things that make life bright.`;
  }

  return "Happy Birthday! I hope your day is filled with joy, laughter, and beautiful moments. Wishing you a wonderful year ahead full of love, peace, and plenty of reasons to smile.";
}
