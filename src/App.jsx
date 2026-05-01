import React, { useEffect, useMemo, useState } from "react";
import {
  Sparkles,
  ShieldCheck,
  Map,
  Swords,
  BrainCircuit,
  TerminalSquare,
  ArrowRight,
  Plus,
  ClipboardList,
  CheckCircle2,
} from "lucide-react";
import { homeMeta, homeModules, homeStats } from "./data/homeConfig";
import { getTaskReward, rewardMap, taskTypes } from "./data/taskConfig";

const iconMap = { BrainCircuit, Map, Swords, ShieldCheck };

const STORAGE_KEY = "meta-field-commander-tasks";

function loadSavedTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const taskTypes = ["學習", "工作", "資安", "治理", "健身", "生活", "創作"];

const rewardMap = {
  學習: { 能力: 4, 自由: 1 },
  工作: { 資本: 3, 治理: 2 },
  資安: { 資安: 5, 治理: 1 },
  治理: { 治理: 4, 信任: 2 },
  健身: { 體力: 5, 自由: 1 },
  生活: { 體力: 2, 自由: 3 },
  創作: { 能力: 3, 信任: 1 },
};

function clamp(value) {
  return Math.max(0, Math.min(100, value));
}

function App() {
  const [taskText, setTaskText] = useState("");
  const [taskType, setTaskType] = useState("學習");
  const [tasks, setTasks] = useState(() => loadSavedTasks());
  const [bossResult, setBossResult] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const addTask = () => {
    const trimmed = taskText.trim();
    if (!trimmed) return;

    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        text: trimmed,
        type: taskType,
        done: false,
      },
      ...prev,
    ]);

    setTaskText("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const completedTasks = tasks.filter((task) => task.done);

  const currentStats = useMemo(() => {
    const next = homeStats.map((stat) => ({ ...stat }));

    completedTasks.forEach((task) => {
      const reward = getTaskReward(task.type);
      Object.entries(reward).forEach(([label, value]) => {
        const target = next.find((stat) => stat.label === label);
        if (target) target.value = clamp(target.value + value);
      });
    });

    return next;
  }, [completedTasks]);

  const totalReward = completedTasks.reduce((sum, task) => {
    const reward = getTaskReward(task.type);
    return sum + Object.values(reward).reduce((a, b) => a + b, 0);
  }, 0);

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto flex min-h-screen max-w-5xl flex-col px-5 py-8">
        <header className="mb-8 flex items-center justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.35em] text-cyan-300">
              {homeMeta.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-black tracking-tight">
              {homeMeta.title}
            </h1>
            <p className="mt-2 text-sm text-slate-400">{homeMeta.subtitle}</p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">
            <Sparkles className="h-6 w-6 text-cyan-200" />
          </div>
        </header>

        <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <div>
            <p className="text-sm font-bold text-amber-200">
              v2.5 任務完成 → 能力值變動
            </p>
            <h2 className="mt-2 text-2xl font-black">今日啟動流程</h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
              {homeMeta.description}
            </p>
          </div>

          <button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-cyan-300/20">
            開始今日流程
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>

        <section className="mt-6 rounded-[2rem] border border-cyan-200/10 bg-black/20 p-5">
          <div className="mb-4 flex items-center gap-2">
            <ClipboardList className="h-5 w-5 text-cyan-200" />
            <h2 className="text-lg font-black">今日任務輸入器</h2>
          </div>

          <div className="grid gap-3 md:grid-cols-[1fr_160px_auto]">
            <input
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") addTask();
              }}
              placeholder="輸入今日任務，例如：整理資安清單 30 分鐘"
              className="rounded-2xl border border-white/10 bg-white/[0.06] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-cyan-300/60"
            />

            <select
              value={taskType}
              onChange={(event) => setTaskType(event.target.value)}
              className="rounded-2xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none focus:border-cyan-300/60"
            >
              {taskTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              onClick={addTask}
              className="flex items-center justify-center gap-2 rounded-2xl bg-emerald-300 px-5 py-3 text-sm font-black text-slate-950 shadow-lg shadow-emerald-300/20"
            >
              <Plus className="h-5 w-5" />
              加入任務
            </button>
          </div>

          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.035] p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-black text-white">今日任務清單</p>
                <p className="mt-1 text-[11px] text-slate-500">
                  任務會自動保存於此裝置
                </p>
              </div>
              <p className="text-xs text-slate-400">
                已完成 {completedTasks.length} / {tasks.length}｜成長 +{totalReward}
              </p>
            </div>

            {tasks.length === 0 ? (
              <p className="rounded-xl border border-dashed border-white/10 p-4 text-center text-sm text-slate-500">
                尚未加入任務。先丟一顆任務種子進來吧。
              </p>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => {
                  const reward = getTaskReward(task.type);
                  return (
                    <button
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex w-full items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3 text-left"
                    >
                      <div>
                        <span className="mb-1 inline-flex rounded-full bg-cyan-300/10 px-2 py-1 text-[10px] font-black text-cyan-100">
                          {task.type}
                        </span>
                        <p
                          className={`text-sm font-bold ${
                            task.done
                              ? "text-slate-500 line-through"
                              : "text-slate-100"
                          }`}
                        >
                          {task.text}
                        </p>
                        <p className="mt-1 text-[11px] text-slate-500">
                          獎勵：
                          {Object.entries(reward)
                            .map(([key, value]) => `${key}+${value}`)
                            .join("、")}
                        </p>
                      </div>

                      <CheckCircle2
                        className={`h-5 w-5 shrink-0 ${
                          task.done ? "text-emerald-300" : "text-slate-600"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        <section className="mt-6 rounded-[2rem] border border-amber-200/10 bg-amber-200/[0.06] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-amber-200">
                DAILY SETTLEMENT
              </p>
              <h2 className="mt-2 text-lg font-black">每日結算面板</h2>
            </div>
            <div className="rounded-2xl bg-amber-200 px-4 py-2 text-sm font-black text-slate-950">
              {dailyStatus}
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">任務總數</p>
              <p className="mt-2 text-2xl font-black">{tasks.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">完成任務</p>
              <p className="mt-2 text-2xl font-black">{completedTasks.length}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">完成率</p>
              <p className="mt-2 text-2xl font-black">{completionRate}%</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">今日成長</p>
              <p className="mt-2 text-2xl font-black">+{totalReward}</p>
            </div>
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-400">
            今日結算會根據已完成任務即時更新。這是未來每日回顧、Boss 戰門檻與能力成長曲線的基礎。
          </p>
        </section>

        <section className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {homeModules.map((item) => {
            const Icon = iconMap[item.icon] ?? BrainCircuit;
            return (
              <article
                key={item.title}
                className="rounded-3xl border border-white/10 bg-white/[0.035] p-4"
              >
                <Icon className="mb-3 h-6 w-6 text-cyan-200" />
                <h3 className="font-black">{item.title}</h3>
                <p className="mt-2 text-xs leading-5 text-slate-400">
                  {item.desc}
                </p>
              </article>
            );
          })}
        </section>

        <section className="mt-6 rounded-[2rem] border border-red-300/20 bg-red-500/[0.06] p-5">
          <div className="mb-4 flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-red-200">
                BOSS ENCOUNTER
              </p>
              <h2 className="mt-2 text-xl font-black">混亂稽核獸</h2>
              <p className="mt-2 text-sm leading-6 text-slate-300">
                牠會追問：你今天到底完成了什麼？你的證據鏈在哪裡？
              </p>
            </div>
            <div className="rounded-2xl border border-red-200/20 bg-black/20 px-4 py-3 text-center">
              <p className="text-[10px] text-slate-400">勝率</p>
              <p className="text-2xl font-black text-red-100">{bossWinRate}%</p>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">戰力</p>
              <p className="mt-2 text-2xl font-black">{bossPower}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p className="text-xs text-slate-400">難度</p>
              <p className="mt-2 text-2xl font-black">{bossDifficulty}</p>
            </div>
            <button
              onClick={challengeBoss}
              className="rounded-2xl bg-red-300 px-5 py-4 text-sm font-black text-slate-950 shadow-lg shadow-red-300/20"
            >
              挑戰 Boss
            </button>
          </div>

          {bossResult && (
            <div
              className={`mt-4 rounded-2xl border p-4 ${
                bossResult.victory
                  ? "border-emerald-300/20 bg-emerald-300/10"
                  : "border-amber-300/20 bg-amber-300/10"
              }`}
            >
              <p className="text-sm font-black text-white">{bossResult.title}</p>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                {bossResult.text}
              </p>
            </div>
          )}
        </section>

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-black/20 p-5">
          <div className="mb-4 flex items-center gap-2">
            <TerminalSquare className="h-5 w-5 text-emerald-200" />
            <h2 className="text-lg font-black">七大能力值</h2>
          </div>

          <div className="grid gap-3">
            {currentStats.map((stat) => (
              <div key={stat.label}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="font-bold text-slate-300">{stat.label}</span>
                  <span className="text-cyan-200">{stat.value}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-300"
                    style={{ width: `${stat.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <footer className="mt-auto pt-8 text-center text-xs text-slate-500">
          v2.9｜第一個 Boss 戰已接入｜下一步：可玩 MVP 封板
        </footer>
      </section>
    </main>
  );
}

export default App;
