import { invoke } from "@tauri-apps/api/core";

export interface DayActivity {
  date: string;
  count: number;
}

export interface DayUsage {
  date: string;
  totalTokens: number;
  inputTokens: number;
  outputTokens: number;
  cachedTokens: number;
  providerTokens: Record<string, number>;
}

export interface StatsData {
  dailyActivity: DayActivity[];
  tokenUsage: DayUsage[];
  totalSummaries: number;
}

export function getStats(): Promise<StatsData> {
  return invoke<StatsData>("stats_get");
}

export function logUsage(
  provider: string,
  inputTokens: number,
  outputTokens: number,
  cachedTokens: number,
): Promise<void> {
  return invoke("stats_log_usage", {
    provider,
    inputTokens,
    outputTokens,
    cachedTokens,
  });
}
