function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function buildEmailTemplate(firstName: string, link: string): string {
  const safeName = escapeHtml(firstName);
  const safeLink = escapeHtml(link);

  return `
    <div style="font-family: Arial, sans-serif; background-color: #fef3c7; padding: 24px; color: #111827;">
      <h1 style="font-size: 28px; color: #b91c1c; margin-bottom: 16px;">Happy Birthday, ${safeName}!</h1>
      <p style="font-size: 16px; line-height: 1.6; margin-bottom: 20px;">
        Someone sent you a special birthday card. Open it here:
      </p>
      <p style="margin-bottom: 24px;">
        <a href="${safeLink}" style="display: inline-block; background-color: #ef4444; color: #ffffff; padding: 12px 20px; border-radius: 8px; text-decoration: none; font-weight: bold;">
          View Your Card
        </a>
      </p>
      <p style="font-size: 14px; color: #4b5563;">If the button doesn’t work, copy and paste this link into your browser:</p>
      <p style="font-size: 14px; color: #1f2937; word-break: break-all;">${safeLink}</p>
    </div>
  `;
}
