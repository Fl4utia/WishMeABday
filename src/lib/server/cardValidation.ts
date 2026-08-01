const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface CreateCardInput {
  id: string;
  name: string;
  email: string;
  birthday: string;
  cardType: string;
  message: string;
  mode: string;
}

export interface SanitizedCardData {
  id: string;
  name: string;
  email: string;
  birthday: string;
  cardType: string;
  message: string;
  mode: string;
  link: string;
  createdAt: string;
}

function cleanText(value: string): string {
  return value.replace(/[\u0000-\u001f\u007f<>]/g, "").trim();
}

function isValidBirthday(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00.000Z`);
  return !Number.isNaN(date.getTime());
}

export function validateCardInput(input: unknown): CreateCardInput {
  if (!input || typeof input !== "object") {
    throw new Error("Invalid card payload");
  }

  const candidate = input as Partial<Record<keyof CreateCardInput, unknown>>;
  const requiredFields: Array<keyof CreateCardInput> = ["id", "name", "email", "birthday", "cardType", "message", "mode"];

  for (const field of requiredFields) {
    if (typeof candidate[field] !== "string" || !candidate[field]?.trim()) {
      throw new Error(`Missing or invalid ${field}`);
    }
  }

  const id = cleanText(candidate.id as string);
  const name = cleanText(candidate.name as string);
  const email = cleanText(candidate.email as string).toLowerCase();
  const birthday = cleanText(candidate.birthday as string);
  const cardType = cleanText(candidate.cardType as string);
  const message = cleanText(candidate.message as string);
  const mode = cleanText(candidate.mode as string);

  if (!UUID_REGEX.test(id)) {
    throw new Error("Invalid card id");
  }

  if (name.length > 80) {
    throw new Error("Name is too long");
  }

  if (email.length > 254 || !EMAIL_REGEX.test(email)) {
    throw new Error("Invalid email address");
  }

  if (!isValidBirthday(birthday)) {
    throw new Error("Invalid birthday");
  }

  if (!["1", "2", "3"].includes(cardType)) {
    throw new Error("Invalid card type");
  }

  if (message.length > 500) {
    throw new Error("Message is too long");
  }

  if (!["AI", "MANUAL"].includes(mode)) {
    throw new Error("Invalid mode");
  }

  return {
    id,
    name,
    email,
    birthday,
    cardType,
    message,
    mode,
  };
}

export function buildCardData(input: CreateCardInput, origin: string): SanitizedCardData {
  const cardPath = input.cardType === "1"
    ? `/birthday1/${input.id}`
    : input.cardType === "2"
      ? `/birthday2/${input.id}`
      : `/birthday3/${input.id}`;

  return {
    ...input,
    link: `${origin}${cardPath}`,
    createdAt: new Date().toISOString(),
  };
}
