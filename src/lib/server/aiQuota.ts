interface DailyQuotaStore {
  dateKey: string;
  usedCount: number;
}

interface QuotaStatus {
  dailyLimit: number;
  usedCount: number;
  remainingRequests: number;
  resetAt: string;
  aiAvailable: boolean;
}

interface QuotaConsumeResult {
  allowed: boolean;
  status: QuotaStatus;
}

declare global {
  // eslint-disable-next-line no-var
  var __wishmeabdayDailyQuotaStore: DailyQuotaStore | undefined;
}

function getDailyLimit(): number {
  const parsed = Number(process.env.AI_DAILY_QUOTA ?? 25);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return 25;
  }

  return Math.floor(parsed);
}

function getDateKeyUtc(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getNextUtcMidnightIso(now: Date): string {
  const nextMidnight = new Date(Date.UTC(
    now.getUTCFullYear(),
    now.getUTCMonth(),
    now.getUTCDate() + 1,
    0,
    0,
    0,
    0
  ));

  return nextMidnight.toISOString();
}

function getOrInitStore(now: Date): DailyQuotaStore {
  const todayKey = getDateKeyUtc(now);

  if (!global.__wishmeabdayDailyQuotaStore) {
    global.__wishmeabdayDailyQuotaStore = {
      dateKey: todayKey,
      usedCount: 0,
    };
  }

  if (global.__wishmeabdayDailyQuotaStore.dateKey !== todayKey) {
    global.__wishmeabdayDailyQuotaStore = {
      dateKey: todayKey,
      usedCount: 0,
    };
  }

  return global.__wishmeabdayDailyQuotaStore;
}

function buildStatus(now: Date, store: DailyQuotaStore): QuotaStatus {
  const dailyLimit = getDailyLimit();
  const remainingRequests = Math.max(0, dailyLimit - store.usedCount);

  return {
    dailyLimit,
    usedCount: store.usedCount,
    remainingRequests,
    resetAt: getNextUtcMidnightIso(now),
    aiAvailable: remainingRequests > 0,
  };
}

export function getQuotaStatus(): QuotaStatus {
  const now = new Date();
  const store = getOrInitStore(now);
  return buildStatus(now, store);
}

export function consumeQuotaRequest(): QuotaConsumeResult {
  const now = new Date();
  const store = getOrInitStore(now);
  const statusBefore = buildStatus(now, store);

  if (!statusBefore.aiAvailable) {
    return {
      allowed: false,
      status: statusBefore,
    };
  }

  store.usedCount += 1;

  return {
    allowed: true,
    status: buildStatus(now, store),
  };
}
