import React, { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  BrainCircuit,
  CheckCircle2,
  ClipboardList,
  RotateCcw,
  ShieldCheck,
  Swords,
  Trash2,
} from "lucide-react";
import { getTaskReward, taskTypes } from "./data/taskConfig";

const STORAGE_KEY = "meta-field-commander-tasks";

function loadSavedTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

const baseStats = {
  能力: 10,
  資本: 8,
  治理: 6,
  資安: 5,
  體力: 7,
  自由: 4,
  信任: 5,
};

export default function App() {
  const [taskText, setTaskText] = useState("");
  const [taskType, setTaskType] = useState(taskTypes?.[0] ?? "學習");
  const [tasks, setTasks] = useState(() => loadSavedTasks());
  const [bossResult, setBossResult] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const completedTasks = useMemo(
    () => tasks.filter((task) => task.done),
    [tasks]
  );

  const totalReward = completedTasks.reduce((sum, task) => {
    const reward = getTaskReward(task.type);
    return sum + Object.values(reward).reduce((a, b) => a + b, 0);
  }, 0);

  const stats = useMemo(() => {
    const next = { ...baseStats };

    completedTasks.forEach((task) => {
      const reward = getTaskReward(task.type);
      Object.entries(reward).forEach(([key, value]) => {
        next[key] = (next[key] ?? 0) + value;
      });
    });

    return next;
  }, [completedTasks]);

  const completionRate =
    tasks.length === 0 ? 0 : Math.round((completedTasks.length / tasks.length) * 100);

  const dailyStatus =
    tasks.length === 0
      ? "尚未啟動"
      : completionRate >= 80
        ? "高效推進"
        : completionRate >= 40
          ? "穩定累積"
          : "需要收斂";

  const bossPower = completionRate + totalReward;
  const bossDifficulty = 75;
  const bossWinRate = Math.max(
    5,
    Math.min(95, Math.round((bossPower / bossDifficulty) * 70))
  );

  const addTask = () => {
    const cleanText = taskText.trim();
    if (!cleanText) return;

    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        text: cleanText,
        type: taskType,
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    setTaskText("");
    setBossResult(null);
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, done: !task.done } : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
    setBossResult(null);
  };

  const clearTasks = () => {
    setTasks([]);
    setBossResult(null);
  };

  const challengeBoss = () => {
    const victory = bossPower >= bossDifficulty;

    setBossResult({
      victory,
      title: victory ? "稽核壓制成功" : "稽核暫時壓過你",
      text: victory
        ? "你用今日任務紀錄與成長數據擋下了混亂稽核獸。治理場域穩定度上升。"
        : "證據鏈還不夠完整。先完成更多任務，累積今日成長，再回來挑戰。",
    });
  };

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-6 text-slate-100">
      <section className="mx-auto max-w-5xl">
        <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black tracking-[0.3em] text-cyan-200">
                META FIELD COMMANDER
              </p>
              <h1 className="mt-3 text-3xl font-black">元場域指揮官</h1>
              <p className="mt-3 text-sm leading-6 text-slate-300">
                v3.0 可玩 MVP：任務新增、完成、刪除、清空、每日結算與 Boss 戰。
              </p>
            </div>
            <div className="rounded-2xl bg-cyan-300 px-4 py-2 text-sm font-black text-slate-950">
              {dailyStatus}
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_160px_auto]">
            <input
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              placeholder="輸入今日任務，例如：整理資安清單"
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <select
              value={taskType}
              onChange={(event) => setTaskType(event.target.value)}
              className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-sm text-white outline-none"
            >
              {taskTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              onClick={addTask}
              className="flex items-center justify-center gap-2 rounded-2xl bg-cyan-300 px-5 py-3 text-sm font-black text-slate-950"
            >
              新增任務
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <button
              onClick={clearTasks}
              className="flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/[0.06] px-5 py-3 text-sm font-black text-slate-200"
            >
              <RotateCcw className="h-4 w-4" />
              清空今日任務
            </button>
            <div className="rounded-2xl border border-white/10 bg-black/20 px-5 py-3 text-sm text-slate-300">
              已完成 {completedTasks.length} / {tasks.length}｜今日成長 +{totalReward}
            </div>
          </div>
        </div>

        <section className="mt-6 rounded-[2rem] border border-amber-200/10 bg-amber-200/[0.06] p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.25em] text-amber-200">
                DAILY SETTLEMENT
              </p>
              <h2 className="mt-2 text-lg font-black">每日結算面板</h2>
            </div>
            <ClipboardList className="h-7 w-7 text-amber-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            <Metric label="任務總數" value={tasks.length} />
            <Metric label="完成任務" value={completedTasks.length} />
            <Metric label="完成率" value={`${completionRate}%`} />
            <Metric label="今日成長" value={`+${totalReward}`} />
          </div>
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
            <Swords className="h-8 w-8 text-red-200" />
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Metric label="戰力" value={bossPower} />
            <Metric label="難度" value={bossDifficulty} />
            <button
              onClick={challengeBoss}
              className="rounded-2xl bg-red-300 px-5 py-4 text-sm font-black text-slate-950"
            >
              挑戰 Boss｜勝率 {bossWinRate}%
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

        <section className="mt-6 grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2">
              <BrainCircuit className="h-5 w-5 text-cyan-200" />
              <h2 className="text-lg font-black">七大能力值</h2>
            </div>

            <div className="grid gap-3">
              {Object.entries(stats).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-1 flex justify-between text-xs">
                    <span className="text-slate-300">{key}</span>
                    <span className="font-black text-cyan-100">{value}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div
                      className="h-2 rounded-full bg-cyan-300"
                      style={{ width: `${Math.min(100, value * 6)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-5">
            <div className="mb-4 flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-emerald-200" />
              <h2 className="text-lg font-black">今日任務清單</h2>
            </div>

            {tasks.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-white/10 p-5 text-sm text-slate-400">
                尚未新增任務。先丟一顆任務種子進來，今天的場域就會開始長。
              </p>
            ) : (
              <div className="grid gap-3">
                {tasks.map((task) => {
                  const reward = getTaskReward(task.type);

                  return (
                    <div
                      key={task.id}
                      className="flex items-center justify-between gap-3 rounded-2xl border border-white/10 bg-slate-900/70 p-3"
                    >
                      <button
                        onClick={() => toggleTask(task.id)}
                        className="flex flex-1 items-center justify-between gap-3 text-left"
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
                          className={`h-5 w-5 ${
                            task.done ? "text-emerald-300" : "text-slate-600"
                          }`}
                        />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        className="grid h-9 w-9 place-items-center rounded-xl border border-red-300/20 bg-red-300/10 text-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-black/20 p-4">
      <p className="text-xs text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-black text-white">{value}</p>
    </div>
  );
}
