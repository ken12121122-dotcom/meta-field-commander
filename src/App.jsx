import React from "react";
import {
  Sparkles,
  ShieldCheck,
  Map,
  Swords,
  BrainCircuit,
  TerminalSquare,
  ArrowRight,
} from "lucide-react";
import { homeMeta, homeModules, homeStats } from "./data/homeConfig";

const iconMap = {
  BrainCircuit,
  Map,
  Swords,
  ShieldCheck,
};

function App() {
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
            <p className="mt-2 text-sm text-slate-400">
              {homeMeta.subtitle}
            </p>
          </div>

          <div className="rounded-2xl border border-cyan-300/20 bg-cyan-300/10 p-3">
            <Sparkles className="h-6 w-6 text-cyan-200" />
          </div>
        </header>

        <section className="grid gap-4 rounded-[2rem] border border-white/10 bg-white/[0.04] p-5 shadow-2xl">
          <div>
            <p className="text-sm font-bold text-amber-200">
              {homeMeta.version} {homeMeta.label}
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

        <section className="mt-6 rounded-[2rem] border border-white/10 bg-black/20 p-5">
          <div className="mb-4 flex items-center gap-2">
            <TerminalSquare className="h-5 w-5 text-emerald-200" />
            <h2 className="text-lg font-black">七大能力值</h2>
          </div>

          <div className="grid gap-3">
            {homeStats.map((stat) => (
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
          {homeMeta.footer}
        </footer>
      </section>
    </main>
  );
}

export default App;
