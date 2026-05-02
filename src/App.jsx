import React, { useEffect, useMemo, useState } from "react";
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Crown,
  Gem,
  HeartHandshake,
  Mail,
  RotateCcw,
  Shield,
  ShieldCheck,
  Sparkles,
  Swords,
  Target,
  Trash2,
  Trophy,
  Users,
  Camera,
  Zap,
} from "lucide-react";
import { getTaskReward, taskTypes } from "./data/taskConfig";

const STORAGE_KEY = "meta-field-commander-tasks-v31";

const resourceIcons = {
  體力: Zap,
  資本: Gem,
  資安: Shield,
  治理: BarChart3,
  能力: Sparkles,
  自由: Crown,
  信任: HeartHandshake,
};

const resourceColors = {
  體力: "text-sky-300",
  資本: "text-amber-300",
  資安: "text-cyan-300",
  治理: "text-emerald-300",
  能力: "text-violet-300",
  自由: "text-yellow-200",
  信任: "text-orange-200",
};

const baseStats = {
  體力: 120,
  資本: 88650,
  資安: 32680,
  治理: 27450,
  能力: 41380,
  自由: 75,
  信任: 9850,
};

const missionTemplates = [
  {
    id: "abc",
    title: "建立 A/B/C 三區隔離架構",
    desc: "完成資訊與權限隔離，強化治理安全基礎。",
    type: "資安",
    progress: 65,
    difficulty: 4,
  },
  {
    id: "office",
    title: "A 棟 2 樓研發辦公室規劃",
    desc: "優化動線與辦公配置，提升團隊效能。",
    type: "治理",
    progress: 40,
    difficulty: 3,
  },
  {
    id: "crypto",
    title: "零等待學習：晶片安全密碼學",
    desc: "掌握硬體安全與加密原理，強化資安核心能力。",
    type: "學習",
    progress: 30,
    difficulty: 5,
  },
  {
    id: "sleep",
    title: "8 小時睡眠＋訓練週",
    desc: "打造高效身心節律，讓體能成為長期資本。",
    type: "體力",
    progress: 70,
    difficulty: 3,
  },
  {
    id: "investment",
    title: "半自動投資檢討模型",
    desc: "建立數據驅動的檢核流程，提升策略穩定性。",
    type: "資本",
    progress: 25,
    difficulty: 4,
  },
];

function loadTasks() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function createTemplateTask(template) {
  return {
    id: crypto.randomUUID(),
    title: template.title,
    text: template.desc,
    type: template.type,
    progress: template.progress,
    difficulty: template.difficulty,
    done: false,
    createdAt: new Date().toISOString(),
  };
}

function ResourceChip({ name, value }) {
  const Icon = resourceIcons[name] ?? Sparkles;
  const color = resourceColors[name] ?? "text-cyan-200";

  return (
    <div className="flex min-w-[92px] items-center gap-2 rounded-xl border border-[#b9995b]/25 bg-[#07111f]/80 px-3 py-2 shadow-[0_0_18px_rgba(56,189,248,0.08)]">
      <Icon className={`h-4 w-4 ${color}`} />
      <div>
        <p className="text-[10px] font-bold tracking-wider text-[#bca777]">{name}</p>
        <p className="text-sm font-black text-slate-100">
          {name === "自由" ? `${value}%` : value.toLocaleString()}
        </p>
      </div>
      <span className="ml-auto text-[#d7b76a]">＋</span>
    </div>
  );
}

function StarRank({ count }) {
  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }).map((_, index) => (
        <span
          key={index}
          className={index < count ? "text-[#f7c96a]" : "text-slate-700"}
        >
          ★
        </span>
      ))}
    </div>
  );
}

function BottomNav() {
  const items = [
    ["任務", Target],
    ["成就", Trophy],
    ["戰略圖譜", Swords],
    ["排行榜", Crown],
    ["聯盟", Users],
    ["商店", Gem],
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#c9a45c]/30 bg-[#06101e]/95 px-2 pb-2 pt-2 shadow-[0_-10px_30px_rgba(0,0,0,0.45)] backdrop-blur">
      <div className="mx-auto grid max-w-5xl grid-cols-6 gap-1">
        {items.map(([label, Icon], index) => (
          <button
            key={label}
            className={`relative flex flex-col items-center justify-center rounded-xl px-1 py-2 text-[11px] font-bold ${
              index === 0
                ? "border border-[#d5b46f]/40 bg-[#10233c] text-[#f3d38a]"
                : "text-slate-300"
            }`}
          >
            {(index === 0 || index === 4) && (
              <span className="absolute right-2 top-1 h-2 w-2 rounded-full bg-red-500" />
            )}
            <Icon className="mb-1 h-5 w-5" />
            {label}
          </button>
        ))}
      </div>
      <div className="mx-auto mt-1 flex max-w-5xl items-center justify-between rounded-lg border border-[#c9a45c]/25 bg-black/30 px-3 py-1 text-[11px] text-slate-300">
        <span className="text-[#d7b76a]">系統公告</span>
        <span className="truncate px-2">恭喜指揮官突破等級 42！解鎖「資本配置」高階模組</span>
        <button className="rounded border border-[#c9a45c]/40 px-3 py-1 text-[#f3d38a]">
          查看
        </button>
      </div>
    </nav>
  );
}

function MissionCard({ mission, index, onStart, onToggle, onDelete }) {
  const reward = getTaskReward(mission.type);
  const progress = mission.done ? 100 : mission.progress ?? 20;

  return (
    <article className="relative overflow-hidden rounded-2xl border border-[#c9a45c]/35 bg-[#071424]/95 p-3 shadow-[0_0_28px_rgba(14,165,233,0.10)]">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.16),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(245,158,11,0.10),transparent_25%)]" />

      <div className="relative grid grid-cols-[86px_1fr] gap-3">
        <div className="relative h-[86px] overflow-hidden rounded-xl border border-[#c9a45c]/30 bg-[#0b1a2c]">
          <div className="absolute inset-0 bg-[radial-gradient(circle,rgba(56,189,248,0.35),transparent_55%)]" />
          <div className="absolute inset-3 rounded-xl border border-cyan-300/30" />
          <div className="absolute left-2 top-2 rounded-lg border border-[#d7b76a]/50 bg-black/50 px-2 py-1 text-xs font-black text-[#f3d38a]">
            {String(index + 1).padStart(2, "0")}
          </div>
          <div className="absolute bottom-3 left-1/2 h-8 w-8 -translate-x-1/2 rounded-full border border-cyan-200/50 bg-cyan-300/20 shadow-[0_0_20px_rgba(56,189,248,0.6)]" />
        </div>

        <div className="relative min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h3 className="truncate text-lg font-black text-slate-50">
                {mission.title}
              </h3>
              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-300">
                {mission.text}
              </p>
            </div>

            <button
              onClick={() => onToggle(mission.id)}
              className={`shrink-0 rounded-xl border px-3 py-2 text-xs font-black ${
                mission.done
                  ? "border-emerald-300/40 bg-emerald-300/15 text-emerald-200"
                  : "border-[#d7b76a]/50 bg-[#7a5420] text-[#ffe4a3]"
              }`}
            >
              {mission.done ? "已完成" : "開始任務"}
            </button>
          </div>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="text-[#d7b76a]">難度</span>
            <StarRank count={mission.difficulty ?? 3} />
          </div>

          <div className="mt-2 flex flex-wrap gap-2">
            {Object.entries(reward).map(([key, value]) => {
              const Icon = resourceIcons[key] ?? Sparkles;
              return (
                <span
                  key={key}
                  className="inline-flex items-center gap-1 rounded-lg border border-white/10 bg-black/30 px-2 py-1 text-[11px] text-slate-200"
                >
                  <Icon className={`h-3 w-3 ${resourceColors[key] ?? "text-cyan-200"}`} />
                  {key} +{value}
                </span>
              );
            })}
          </div>

          <div className="mt-3 flex items-center gap-3">
            <span className="text-xs text-slate-400">進度</span>
            <div className="h-2 flex-1 overflow-hidden rounded-full bg-black/50">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-[#f3d38a]"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="w-10 text-right text-xs text-slate-300">{progress}%</span>
          </div>

          <div className="mt-3 grid grid-cols-2 gap-2">
            <button
              onClick={() => onStart(mission)}
              className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-2 text-xs font-bold text-cyan-100"
            >
              交給 AI
            </button>
            <button
              onClick={() => onDelete(mission.id)}
              className="rounded-xl border border-red-300/25 bg-red-300/10 px-3 py-2 text-xs font-bold text-red-100"
            >
              刪除
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

function SidePanel({ completionRate, total, done, onBoss }) {
  return (
    <aside className="grid gap-4">
      <section className="rounded-2xl border border-[#c9a45c]/35 bg-[#071424]/95 p-4">
        <p className="text-center text-sm font-black tracking-widest text-[#f3d38a]">
          本日重點
        </p>
        <div className="mx-auto my-4 grid h-20 w-20 place-items-center rounded-full border border-[#d7b76a]/40 bg-[#0b1a2c] shadow-[0_0_25px_rgba(245,158,11,0.12)]">
          <Target className="h-9 w-9 text-[#f3d38a]" />
        </div>
        <p className="text-center text-xs leading-5 text-slate-300">
          優先目標：強化資安與治理基礎
        </p>
        <button
          onClick={onBoss}
          className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-[#d7b76a]/40 bg-[#7a5420]/70 px-3 py-2 text-xs font-black text-[#ffe4a3]"
        >
          分析建議 <ChevronRight className="h-4 w-4" />
        </button>
      </section>

      <section className="rounded-2xl border border-cyan-300/25 bg-[#071424]/95 p-4">
        <p className="text-center text-sm font-black tracking-widest text-cyan-200">
          完成度
        </p>
        <div className="mx-auto my-4 grid h-24 w-24 place-items-center rounded-full border-[10px] border-cyan-400/70 bg-black/30">
          <div className="text-center">
            <p className="text-2xl font-black text-[#f3d38a]">{completionRate}%</p>
            <p className="text-[10px] text-slate-300">總進度</p>
          </div>
        </div>
        <div className="space-y-2 text-xs text-slate-300">
          <p>✅ 已完成　{done}</p>
          <p>🔵 進行中　{Math.max(total - done, 0)}</p>
          <p>⚪ 待開始　{total === 0 ? 1 : 0}</p>
        </div>
      </section>

      <section className="rounded-2xl border border-[#c9a45c]/35 bg-[#071424]/95 p-4">
        <p className="text-center text-sm font-black tracking-widest text-[#f3d38a]">
          快速行動
        </p>
        <div className="mt-3 grid grid-cols-2 gap-2">
          <button className="rounded-xl border border-[#d7b76a]/30 bg-black/30 p-3 text-xs text-[#f3d38a]">
            任務推薦
          </button>
          <button className="rounded-xl border border-cyan-300/30 bg-cyan-300/10 p-3 text-xs text-cyan-100">
            AI 排程
          </button>
          <button className="col-span-2 rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-slate-200">
            專注模式
          </button>
        </div>
      </section>
    </aside>
  );
}

export default function App() {
  const [taskText, setTaskText] = useState("");
  const [taskType, setTaskType] = useState(taskTypes?.[0] ?? "學習");
  const [tasks, setTasks] = useState(() => {
    const saved = loadTasks();
    return saved.length ? saved : missionTemplates.map(createTemplateTask);
  });
  const [bossMessage, setBossMessage] = useState("");
  const [scoutImage, setScoutImage] = useState(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  const doneTasks = tasks.filter((task) => task.done);

  const stats = useMemo(() => {
    const next = { ...baseStats };
    doneTasks.forEach((task) => {
      const reward = getTaskReward(task.type);
      Object.entries(reward).forEach(([key, value]) => {
        next[key] = (next[key] ?? 0) + value;
      });
    });
    return next;
  }, [doneTasks]);

  const totalReward = doneTasks.reduce((sum, task) => {
    const reward = getTaskReward(task.type);
    return sum + Object.values(reward).reduce((a, b) => a + b, 0);
  }, 0);

  const completionRate =
    tasks.length === 0 ? 0 : Math.round((doneTasks.length / tasks.length) * 100);

  const addTask = () => {
    const title = taskText.trim();
    if (!title) return;

    setTasks((prev) => [
      {
        id: crypto.randomUUID(),
        title,
        text: "由指揮官手動建立的今日治理任務。",
        type: taskType,
        progress: 0,
        difficulty: 3,
        done: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setTaskText("");
  };

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id
          ? { ...task, done: !task.done, progress: task.done ? 50 : 100 }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id));
  };

  const clearTasks = () => {
    setTasks([]);
    setBossMessage("");
  };

  const resetDefault = () => {
    setTasks(missionTemplates.map(createTemplateTask));
    setBossMessage("");
  };

  const bossCheck = () => {
    if (completionRate >= 60) {
      setBossMessage("✅ 今日治理場域穩定。可以推進下一層：任務分類、成長圖譜或事件系統。");
    } else {
      setBossMessage("⚠️ 今日完成度偏低。建議先完成 2 個任務，再挑戰場域事件。");
    }
  };

  const handleScoutImage = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    setScoutImage({
      url: previewUrl,
      name: file.name,
      sizeKB: Math.round(file.size / 1024),
      type: file.type || "image",
      capturedAt: new Date().toLocaleString("zh-TW"),
    });

    event.target.value = "";
  };

  const clearScoutImage = () => {
    if (scoutImage?.url) {
      URL.revokeObjectURL(scoutImage.url);
    }
    setScoutImage(null);
  };

  return (
    <main className="min-h-screen bg-[#020815] pb-28 text-slate-100">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_50%_0%,rgba(14,165,233,0.22),transparent_35%),radial-gradient(circle_at_50%_65%,rgba(245,158,11,0.10),transparent_40%)]" />

      <header className="sticky top-0 z-40 border-b border-[#c9a45c]/25 bg-[#020815]/95 px-3 py-3 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-3">
          <div className="grid h-14 w-14 place-items-center rounded-full border border-[#d7b76a]/50 bg-[#0b1a2c]">
            <Crown className="h-7 w-7 text-[#f3d38a]" />
          </div>

          <div className="min-w-[110px]">
            <p className="text-sm font-black">指揮官</p>
            <p className="text-xs text-slate-300">等級 42</p>
            <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-black/50">
              <div className="h-full w-[72%] bg-[#f3d38a]" />
            </div>
            <p className="mt-1 text-[10px] text-slate-400">8,750 / 12,000</p>
          </div>

          <div className="flex flex-1 gap-2 overflow-x-auto pb-1">
            {Object.entries(stats).map(([key, value]) => (
              <ResourceChip key={key} name={key} value={value} />
            ))}
          </div>

          <div className="hidden gap-2 sm:flex">
            <button className="grid h-10 w-10 place-items-center rounded-xl border border-white/10 bg-white/5">
              <Mail className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-4 py-6">
        <div className="mb-6 text-center">
          <p className="text-xs font-black tracking-[0.55em] text-[#d7b76a]">
            今日治理計畫
          </p>
          <h1 className="mt-2 text-5xl font-black tracking-wider text-[#f8d98c] drop-shadow-[0_0_18px_rgba(245,158,11,0.35)]">
            任務中心
          </h1>
          <div className="mx-auto mt-3 h-px w-64 bg-gradient-to-r from-transparent via-[#d7b76a] to-transparent" />
        </div>

        <div className="mb-5 rounded-2xl border border-[#c9a45c]/35 bg-[#071424]/95 p-4">
          <div className="grid gap-3 sm:grid-cols-[1fr_140px_auto_auto]">
            <input
              value={taskText}
              onChange={(event) => setTaskText(event.target.value)}
              placeholder="輸入任務，例如：整理資安稽核清單"
              className="rounded-xl border border-[#c9a45c]/25 bg-black/40 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-500"
            />

            <select
              value={taskType}
              onChange={(event) => setTaskType(event.target.value)}
              className="rounded-xl border border-[#c9a45c]/25 bg-black/40 px-4 py-3 text-sm text-white outline-none"
            >
              {taskTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <button
              onClick={addTask}
              className="rounded-xl border border-[#f3d38a]/50 bg-[#7a5420] px-5 py-3 text-sm font-black text-[#ffe4a3]"
            >
              新增任務
            </button>

            <button
              onClick={resetDefault}
              className="rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100"
            >
              載入範例
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3 rounded-xl border border-white/10 bg-black/30 px-4 py-3 text-xs text-slate-300">
            <span>
              已完成 {doneTasks.length} / {tasks.length}｜今日成長 +{totalReward}
            </span>
            <button
              onClick={clearTasks}
              className="inline-flex items-center gap-1 text-red-200"
            >
              <RotateCcw className="h-4 w-4" />
              清空
            </button>
          </div>
        </div>

        <section className="mb-5 rounded-2xl border border-cyan-300/25 bg-[#071424]/95 p-4 shadow-[0_0_28px_rgba(14,165,233,0.10)]">
          <div className="mb-3 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-black tracking-[0.3em] text-cyan-200">
                FIELD SCOUT
              </p>
              <h2 className="mt-2 text-xl font-black text-[#f8d98c]">
                現場偵查
              </h2>
              <p className="mt-2 text-xs leading-5 text-slate-300">
                第一階段僅提供臨時拍照 / 選圖預覽，不保存、不上傳、不寫入證據庫。
              </p>
            </div>
            <Camera className="h-7 w-7 shrink-0 text-cyan-200" />
          </div>

          <div className="rounded-xl border border-amber-300/20 bg-amber-300/10 p-3 text-xs leading-5 text-amber-100">
            請勿拍攝機密文件、帳號密碼、客戶資料、內部 IP、門禁細節或未授權區域。
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-300/30 bg-cyan-300/10 px-5 py-3 text-sm font-black text-cyan-100">
              <Camera className="h-5 w-5" />
              拍攝 / 選擇偵查影像
              <input
                type="file"
                accept="image/*"
                capture="environment"
                onChange={handleScoutImage}
                className="hidden"
              />
            </label>

            <button
              onClick={clearScoutImage}
              disabled={!scoutImage}
              className={`rounded-xl border px-5 py-3 text-sm font-black ${
                scoutImage
                  ? "border-red-300/30 bg-red-300/10 text-red-100"
                  : "cursor-not-allowed border-white/10 bg-white/5 text-slate-600"
              }`}
            >
              清除預覽
            </button>
          </div>

          {scoutImage ? (
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#c9a45c]/35 bg-black/30">
              <img
                src={scoutImage.url}
                alt="現場偵查預覽"
                className="max-h-[420px] w-full object-contain"
              />
              <div className="grid gap-1 border-t border-white/10 p-3 text-xs text-slate-300">
                <p className="font-black text-[#f8d98c]">偵查影像已取得</p>
                <p>檔名：{scoutImage.name}</p>
                <p>大小：約 {scoutImage.sizeKB} KB</p>
                <p>時間：{scoutImage.capturedAt}</p>
                <p className="text-cyan-200">
                  目前不保存。離開、重新整理或清除後，此預覽會消失。
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-4 rounded-2xl border border-dashed border-white/10 bg-black/20 p-5 text-center text-sm text-slate-400">
              尚未取得偵查影像。點擊上方按鈕測試相機 / 相簿入口。
            </div>
          )}
        </section>

        <div className="grid gap-5 lg:grid-cols-[1fr_230px]">
          <section className="grid gap-4">
            {tasks.map((mission, index) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                index={index}
                onStart={() => setBossMessage("🤖 已交給 AI：下一版會把任務拆成可執行步驟。")}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}

            {tasks.length === 0 && (
              <div className="rounded-2xl border border-dashed border-[#c9a45c]/35 bg-[#071424]/80 p-8 text-center text-slate-300">
                今日尚無任務。載入範例或建立第一個任務，任務中心才會亮起來。
              </div>
            )}
          </section>

          <SidePanel
            completionRate={completionRate}
            total={tasks.length}
            done={doneTasks.length}
            onBoss={bossCheck}
          />
        </div>

        {bossMessage && (
          <section className="mt-5 rounded-2xl border border-[#d7b76a]/35 bg-black/40 p-4 text-sm leading-6 text-[#ffe4a3]">
            {bossMessage}
          </section>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
