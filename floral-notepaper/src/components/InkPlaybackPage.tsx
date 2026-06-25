import { useMemo } from "react";

interface TimeEvent {
  id: number;
  noteTitle: string;
  enterTime: Date;
  exitTime: Date;
  charCount: number;
}

// 模拟数据 — 后续对接墨迹数据
const mockEvents: TimeEvent[] = [
  {
    id: 1,
    noteTitle: "日记 · 2026-06-25",
    enterTime: new Date("2026-06-25T08:12:00"),
    exitTime: new Date("2026-06-25T08:45:00"),
    charCount: 342,
  },
  {
    id: 2,
    noteTitle: "日记 · 2026-06-25",
    enterTime: new Date("2026-06-25T11:30:00"),
    exitTime: new Date("2026-06-25T12:10:00"),
    charCount: 518,
  },
  {
    id: 3,
    noteTitle: "日记 · 2026-06-25",
    enterTime: new Date("2026-06-25T15:05:00"),
    exitTime: new Date("2026-06-25T15:52:00"),
    charCount: 427,
  },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatTime(d: Date): string {
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function formatDuration(ms: number): string {
  const totalMin = Math.round(ms / 60000);
  if (totalMin < 60) return `${totalMin} 分钟`;
  const h = Math.floor(totalMin / 60);
  const m = totalMin % 60;
  return m > 0 ? `${h} 小时 ${m} 分钟` : `${h} 小时`;
}

export function InkPlaybackPage() {
  const totalDuration = useMemo(() => {
    if (mockEvents.length === 0) return 0;
    const first = mockEvents[0].enterTime.getTime();
    const last = mockEvents[mockEvents.length - 1].exitTime.getTime();
    return last - first;
  }, []);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-paper">
      {/* 主体：左侧回放区 + 右侧时间事件侧栏 */}
      <div className="flex-1 flex min-h-0">
        {/* 左侧：文本回放区域（占位） */}
        <div className="flex-1 flex items-center justify-center min-w-0">
          <div className="text-center text-ink-ghost select-none">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mx-auto mb-3 opacity-30"
            >
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
            <p className="text-[13px]">选择右侧时间事件开始回放</p>
          </div>
        </div>

        {/* 右侧：时间事件卡片侧栏 */}
        <div className="w-[280px] shrink-0 border-l border-paper-deep/30 flex flex-col bg-cloud/50">
          {/* 侧栏标题 */}
          <div className="px-4 pt-4 pb-2 shrink-0">
            <h3 className="text-[12px] font-display font-semibold text-ink-soft tracking-wide">
              写作时间线
            </h3>
            <p className="text-[10px] text-ink-ghost mt-0.5">
              {mockEvents.length} 次写作会话
            </p>
          </div>

          {/* 时间事件卡片列表 */}
          <div className="flex-1 overflow-y-auto px-3 pb-3">
            <div className="relative pl-5">
              {/* 时间线竖线 */}
              <div className="absolute left-[9px] top-2 bottom-2 w-px bg-paper-deep/40" />

              {mockEvents.map((event, index) => {
                const duration = event.exitTime.getTime() - event.enterTime.getTime();
                const progressPct =
                  totalDuration > 0
                    ? ((event.enterTime.getTime() - mockEvents[0].enterTime.getTime()) /
                        totalDuration) *
                      100
                    : 0;

                return (
                  <div key={event.id} className="relative pb-4 last:pb-0">
                    {/* 时间线圆点 */}
                    <div
                      className="absolute left-[-17px] top-2 w-[9px] h-[9px] rounded-full border-2 border-bamboo bg-cloud z-10"
                    />

                    {/* 卡片 */}
                    <div className="rounded-xl border border-paper-deep/25 bg-paper/70 p-3 hover:border-bamboo/25 hover:bg-bamboo-mist/30 transition-all duration-300 cursor-pointer group">
                      {/* 头部：事件序号 + 笔记名 */}
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-[10px] font-mono text-bamboo bg-bamboo-mist/60 px-1.5 py-0.5 rounded-full">
                          事件 {event.id}
                        </span>
                        <span className="text-[11px] text-ink-faint truncate flex-1">
                          {event.noteTitle}
                        </span>
                      </div>

                      {/* 时间区间 */}
                      <div className="flex items-center gap-1.5 text-[11px] text-ink-soft font-mono mb-1.5">
                        <span>{formatTime(event.enterTime)}</span>
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="text-ink-ghost/50"
                        >
                          <path d="M5 12h14" />
                          <path d="m12 5 7 7-7 7" />
                        </svg>
                        <span>{formatTime(event.exitTime)}</span>
                      </div>

                      {/* 底部信息：时长 + 字数 */}
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-ink-ghost">
                          {formatDuration(duration)}
                        </span>
                        <span className="text-[10px] text-ink-ghost font-mono">
                          {event.charCount} 字
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* 底部进度条 */}
      <div className="h-12 shrink-0 border-t border-paper-deep/30 bg-cloud/70 flex items-center px-5 gap-3">
        {/* 播放/暂停按钮（装饰占位） */}
        <button
          className="w-7 h-7 flex items-center justify-center rounded-full border border-paper-deep/40 text-ink-ghost hover:text-bamboo hover:border-bamboo/40 transition-colors cursor-pointer"
          title="播放"
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
        </button>

        {/* 时间显示 */}
        <span className="text-[10px] text-ink-ghost font-mono tabular-nums w-10 text-right shrink-0">
          00:00
        </span>

        {/* 进度条轨道 */}
        <div className="flex-1 h-1.5 rounded-full bg-paper-deep/40 overflow-hidden">
          <div
            className="h-full rounded-full bg-bamboo/50 transition-all duration-300"
            style={{ width: "24%" }}
          />
        </div>

        {/* 总时长 */}
        <span className="text-[10px] text-ink-ghost font-mono tabular-nums w-10 shrink-0">
          {formatDuration(totalDuration)}
        </span>
      </div>
    </div>
  );
}
