const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const DATETIME_LOCAL_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/;
const ISO_WITH_TIMEZONE_PATTERN = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})$/;

function buildLocalDate(
  year: number,
  month: number,
  day: number,
  hours = 0,
  minutes = 0,
  seconds = 0,
  milliseconds = 0
): Date {
  return new Date(year, month - 1, day, hours, minutes, seconds, milliseconds);
}

function isValidDate(date: Date): boolean {
  return !Number.isNaN(date.getTime());
}

export function parseScheduledDelivery(value: string): Date | null {
  const trimmed = value.trim();

  if (ISO_WITH_TIMEZONE_PATTERN.test(trimmed)) {
    const parsed = new Date(trimmed);
    return isValidDate(parsed) ? parsed : null;
  }

  if (DATETIME_LOCAL_PATTERN.test(trimmed)) {
    const [datePart, timePart] = trimmed.split("T");
    const [year, month, day] = datePart.split("-").map(Number);
    const [hours, minutes] = timePart.split(":").map(Number);
    const parsed = buildLocalDate(year, month, day, hours, minutes);
    return isValidDate(parsed) ? parsed : null;
  }

  if (DATE_ONLY_PATTERN.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    const parsed = buildLocalDate(year, month, day, 0, 1);
    return isValidDate(parsed) ? parsed : null;
  }

  return null;
}

export function normalizeScheduledDelivery(value: string): string {
  // If the user provided a date-only string that represents today, treat it as "send now".
  // This matches the UI text: "Today sends immediately. Future dates send at 00:01 on that day.".
  const trimmed = value.trim();
  if (DATE_ONLY_PATTERN.test(trimmed)) {
    const [year, month, day] = trimmed.split("-").map(Number);
    const today = new Date();
    if (
      year === today.getFullYear() &&
      month === today.getMonth() + 1 &&
      day === today.getDate()
    ) {
      return new Date().toISOString();
    }
  }

  const parsed = parseScheduledDelivery(value);

  if (!parsed) {
    throw new Error("Invalid send date");
  }

  return parsed.toISOString();
}

export function isScheduledDeliveryDue(value: string, now: Date = new Date()): boolean {
  const parsed = parseScheduledDelivery(value);

  if (!parsed) {
    return false;
  }

  return parsed.getTime() <= now.getTime();
}

export function formatScheduledDelivery(value?: string): string {
  if (!value) {
    return "Not scheduled";
  }

  const parsed = parseScheduledDelivery(value);
  if (!parsed) {
    return value;
  }

  return parsed.toLocaleString();
}

export function getDeliveryStatus(sendAt?: string, emailSentAt?: string, now: Date = new Date()): "Sent" | "Scheduled" | "Not scheduled" {
  if (emailSentAt) {
    return "Sent";
  }

  if (!sendAt) {
    return "Not scheduled";
  }

  return isScheduledDeliveryDue(sendAt, now) ? "Sent" : "Scheduled";
}

export function formatDeliveryStatus(sendAt?: string, emailSentAt?: string, now: Date = new Date()): string {
  const status = getDeliveryStatus(sendAt, emailSentAt, now);

  if (status === "Sent") {
    return "Sent";
  }

  if (status === "Scheduled" && sendAt) {
    return formatScheduledDelivery(sendAt);
  }

  return "Not scheduled";
}

export function getLocalDateTimeInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getLocalDateInputValue(date: Date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
