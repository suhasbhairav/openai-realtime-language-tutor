"use client";

import { useMemo, useState } from "react";

const starterPrompts = [
  "A voice language tutor starter with session setup, speaking goals, and live practice scaffolding.",
  "Create a production-ready workflow with risks, data flow, and owner handoffs.",
  "Generate a sample user journey and API contract for this starter.",
  "Give me a launch checklist and extension roadmap for this template."
];
const metrics = [
  "Server route",
  "Responsive UI",
  "Env setup"
];
const steps = [
  "Capture input",
  "Run server route",
  "Return structured output"
];
const chips = [
  "Realtime voice",
  "Next.js",
  "OpenAI",
  "Mobile ready"
];
const endpoint = "/api/realtime-token";

export default function Home() {
  const [prompt, setPrompt] = useState(starterPrompts[0]);
  const [result, setResult] = useState(null);
  const [isRunning, setIsRunning] = useState(false);
  const [error, setError] = useState("");

  const status = useMemo(() => {
    if (isRunning) return "Running";
    if (result?.demo) return "Local response";
    if (result) return "Completed";
    return "Ready";
  }, [isRunning, result]);

  async function submit(event) {
    event.preventDefault();
    const cleanPrompt = prompt.trim();
    if (!cleanPrompt || isRunning) return;

    setIsRunning(true);
    setError("");
    setResult(null);

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: cleanPrompt }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Template run failed.");
      setResult(data);
    } catch (runError) {
      setError(runError.message);
    } finally {
      setIsRunning(false);
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0d0a16] text-white">
      <section className="mx-auto min-h-screen max-w-[1440px] px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-5 lg:grid-cols-[1fr_420px]"><div className="rounded-[1.75rem] border bg-white/9 border-white/12 p-6"><div className="grid size-20 place-items-center rounded-full text-xl font-black text-black" style={{ backgroundColor: "#f0abfc" }}>ORL</div><h1 className="mt-6 text-5xl font-black sm:text-7xl">OpenAI Realtime Language Tutor</h1><p className="mt-5 max-w-3xl leading-8 text-white/62">A voice language tutor starter with session setup, speaking goals, and live practice scaffolding.</p></div><div className="grid gap-3">{steps.map((step) => <div className="rounded-[1.75rem] border bg-white/9 border-white/12 p-4" key={step}><p className="font-black">{step}</p></div>)}</div></div>
        <div className="mt-5 grid gap-5 lg:grid-cols-[.8fr_1.2fr]"><div className="rounded-[1.75rem] border bg-white/9 border-white/12 p-4">{starterPrompts.map((example) => (
                <button
                  key={example}
                  className="w-full border border-current/10 bg-white/45 px-3 py-3 text-left text-sm leading-6 opacity-80 transition hover:opacity-100"
                  onClick={() => setPrompt(example)}
                  type="button"
                >
                  {example}
                </button>
              ))}</div><div className="rounded-[1.75rem] border bg-white/9 border-white/12 p-4"><form className="space-y-3" onSubmit={submit}>
              <textarea
                className="min-h-44 w-full resize-y border border-current/10 bg-white/70 px-4 py-3 text-sm leading-7 outline-none placeholder:opacity-40 focus:border-current/30"
                onChange={(event) => setPrompt(event.target.value)}
                value={prompt}
              />
              <button
                className="min-h-12 w-full px-5 text-sm font-black transition disabled:cursor-not-allowed disabled:opacity-40 bg-fuchsia-200 text-zinc-950 hover:bg-white"
                disabled={isRunning || !prompt.trim()}
                type="submit"
              >
                {isRunning ? "Running..." : "Prepare session"}
              </button>
            </form><div className="mt-4">{error ? <div className="border border-red-400/40 bg-red-500/10 p-3 text-sm text-red-700 dark:text-red-100">{error}</div> : null}
            {result ? (
              <article className="border border-current/10 bg-white/60 p-4 text-sm leading-7 shadow-sm">
                <div className="flex flex-wrap items-center gap-2">
                  <strong>Result</strong>
                  <span className="border border-current/10 px-2 py-1 text-xs opacity-60">{result.model || "local"}</span>
                </div>
                <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap bg-black/5 p-4 text-sm leading-7">
                  {result.output || result.clientSecret || JSON.stringify(result, null, 2)}
                </pre>
              </article>
            ) : null}</div></div></div>
      </section>
    </main>
  );
}
