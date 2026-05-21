const KEY = "cc_analysis_usage";
const MAX_FREE = 5;

type UsageRecord = { date: string; count: number };

export function getTodayKey() {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD
}

export function getUsage(): UsageRecord {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { date: getTodayKey(), count: 0 };
    const parsed: UsageRecord = JSON.parse(raw);
    // Reset if it's a new day
    if (parsed.date !== getTodayKey()) return { date: getTodayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

export function incrementUsage(): number {
  const usage = getUsage();
  const updated = { date: getTodayKey(), count: usage.count + 1 };
  localStorage.setItem(KEY, JSON.stringify(updated));
  return updated.count;
}

export function getRemainingAnalyses(): number {
  return Math.max(0, MAX_FREE - getUsage().count);
}

export function hasReachedLimit(): boolean {
  return getUsage().count >= MAX_FREE;
}

export { MAX_FREE };
