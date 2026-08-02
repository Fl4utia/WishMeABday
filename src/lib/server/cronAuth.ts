export function getConfiguredCronSecrets(): string[] {
  return [
    process.env.CRON_SECRET,
    process.env.VERCEL_CRON_SECRET,
    process.env.NEXT_PUBLIC_CRON_SECRET,
  ].filter((value): value is string => Boolean(value && value.trim().length > 0));
}

export function isAuthorizedCronRequest(request: Request): boolean {
  const configuredSecrets = getConfiguredCronSecrets();

  if (configuredSecrets.length === 0) {
    return true;
  }

  const searchParams = new URL(request.url).searchParams;
  const providedSecret = [
    searchParams.get("secret"),
    request.headers.get("x-cron-secret"),
    request.headers.get("x-vercel-cron-secret"),
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "").trim(),
  ].find((value): value is string => Boolean(value && value.trim().length > 0));

  if (!providedSecret) {
    return false;
  }

  const normalizedProvidedSecret = providedSecret.trim();
  return configuredSecrets.some(
    (configuredSecret) => configuredSecret.trim() === normalizedProvidedSecret
  );
}
