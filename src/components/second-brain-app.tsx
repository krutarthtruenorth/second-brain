"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  Archive,
  AudioLines,
  BookOpen,
  Brain,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CircleDot,
  Command,
  FileAudio,
  FileText,
  Filter,
  Gauge,
  Lightbulb,
  Link2,
  Mic,
  Pause,
  Play,
  Plus,
  Search,
  Send,
  Sparkles,
  Tags,
  Upload,
  Waves,
  Zap,
  type LucideIcon,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const memories = [
  {
    title: "Interview loop reflection",
    source: "Project journal",
    time: "Today, 9:18 AM",
    type: "Work",
    summary:
      "You perform better when you open with a concise architecture map before diving into implementation details.",
    tags: ["interviews", "systems", "confidence"],
    score: 94,
  },
  {
    title: "Lisbon travel note",
    source: "Voice memory",
    time: "Yesterday",
    type: "Travel",
    summary:
      "Slow mornings created better recall and stronger writing than packed itineraries or late-night planning.",
    tags: ["travel", "energy", "writing"],
    score: 87,
  },
  {
    title: "Launch week lesson",
    source: "Meeting debrief",
    time: "May 19",
    type: "Product",
    summary:
      "Demo quality improved when the team used one narrative metric instead of a broad feature checklist.",
    tags: ["demo", "product", "focus"],
    score: 91,
  },
];

const insights = [
  {
    label: "Recurring pattern",
    title: "Clarity before speed",
    body: "Across 14 memories, your strongest outcomes came after writing a short decision frame first.",
    tone: "cyan",
  },
  {
    label: "Forgotten lesson",
    title: "Energy is a planning input",
    body: "Travel, study, and project notes all mention better output when demanding work is moved earlier.",
    tone: "green",
  },
  {
    label: "Actionable recommendation",
    title: "Create a pre-demo ritual",
    body: "Before your next presentation, write the audience question, one proof point, and one takeaway.",
    tone: "amber",
  },
];

const activityData = [
  { day: "Mon", memories: 3, insights: 2 },
  { day: "Tue", memories: 4, insights: 3 },
  { day: "Wed", memories: 2, insights: 2 },
  { day: "Thu", memories: 6, insights: 4 },
  { day: "Fri", memories: 5, insights: 5 },
  { day: "Sat", memories: 8, insights: 6 },
];

const patternData = [
  { name: "Focus", value: 82 },
  { name: "Energy", value: 68 },
  { name: "People", value: 51 },
  { name: "Learning", value: 76 },
  { name: "Ideas", value: 59 },
];

const graphNodes = [
  { label: "Interview reflection", x: "12%", y: "24%", color: "bg-sky-300" },
  { label: "Launch lesson", x: "64%", y: "18%", color: "bg-emerald-300" },
  { label: "Clarity pattern", x: "42%", y: "48%", color: "bg-amber-300" },
  { label: "Travel note", x: "18%", y: "72%", color: "bg-rose-300" },
  { label: "Energy ritual", x: "72%", y: "70%", color: "bg-violet-300" },
];

function Metric({ label, value, icon: Icon }: { label: string; value: string; icon: LucideIcon }) {
  return (
    <div className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">{label}</span>
        <Icon className="size-4 text-primary" />
      </div>
      <div className="font-mono text-2xl font-semibold tracking-normal">{value}</div>
    </div>
  );
}

function MemoryCard({ memory, active }: { memory: (typeof memories)[number]; active?: boolean }) {
  return (
    <Card
      className={cn(
        "bg-white/[0.045] transition-colors hover:bg-white/[0.07]",
        active && "border-primary/50 bg-primary/[0.08]",
      )}
    >
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between gap-3">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <Badge variant={memory.type === "Travel" ? "warning" : "secondary"}>{memory.type}</Badge>
              <span className="text-xs text-muted-foreground">{memory.time}</span>
            </div>
            <h3 className="text-sm font-semibold">{memory.title}</h3>
          </div>
          <div className="rounded-md border border-white/10 bg-white/[0.05] px-2 py-1 font-mono text-xs text-primary">
            {memory.score}
          </div>
        </div>
        <p className="mb-4 text-sm leading-6 text-muted-foreground">{memory.summary}</p>
        <div className="flex flex-wrap gap-2">
          {memory.tags.map((tag) => (
            <span key={tag} className="rounded-full bg-white/[0.06] px-2 py-1 text-xs text-muted-foreground">
              #{tag}
            </span>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

export function SecondBrainApp() {
  const [captureMode, setCaptureMode] = useState<"text" | "voice">("text");
  const [isRecording, setIsRecording] = useState(false);
  const [query, setQuery] = useState("What keeps showing up before my best work?");

  const selectedInsight = useMemo(() => insights[0], []);
  const navItems: Array<[string, LucideIcon]> = [
    ["Dashboard", Gauge],
    ["Capture", Plus],
    ["Search", Search],
    ["Patterns", Activity],
    ["Archive", Archive],
  ];
  const pipelineItems: Array<[string, number, LucideIcon]> = [
    ["Capture", 100, FileAudio],
    ["Transcribe", 78, AudioLines],
    ["Extract entities", 64, Tags],
    ["Generate insight", 42, Brain],
  ];

  return (
    <main className="min-h-screen overflow-hidden">
      <div className="mx-auto flex w-full max-w-[1440px] gap-6 px-4 py-4 lg:px-6">
        <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-64 shrink-0 flex-col justify-between rounded-lg border border-white/10 bg-black/25 p-4 xl:flex">
          <div>
            <div className="mb-8 flex items-center gap-3">
              <div className="grid size-10 place-items-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="size-5" />
              </div>
              <div>
                <div className="text-sm font-semibold">Second Brain</div>
                <div className="text-xs text-muted-foreground">AI memory engine</div>
              </div>
            </div>
            <nav className="space-y-1">
              {navItems.map(([label, Icon]) => (
                <button
                  key={label}
                  className={cn(
                    "flex h-10 w-full items-center gap-3 rounded-md px-3 text-sm text-muted-foreground transition-colors hover:bg-white/[0.06] hover:text-foreground",
                    label === "Dashboard" && "bg-white/[0.08] text-foreground",
                  )}
                >
                  <Icon className="size-4" />
                  {label}
                </button>
              ))}
            </nav>
          </div>
          <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
            <div className="mb-2 flex items-center gap-2 text-sm font-medium">
              <Sparkles className="size-4 text-amber-200" />
              Phase 1 demo
            </div>
            <p className="text-xs leading-5 text-muted-foreground">
              Frontend-only prototype with mocked memory extraction, search, and insight states.
            </p>
          </div>
        </aside>

        <section className="min-w-0 flex-1">
          <header className="mb-5 flex flex-col gap-4 rounded-lg border border-white/10 bg-black/20 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <Badge className="mb-3" variant="success">
                Second Brain helps you learn from your own life
              </Badge>
              <h1 className="max-w-4xl text-3xl font-semibold tracking-normal text-balance sm:text-5xl">
                Turn scattered notes and voice memories into personal insights.
              </h1>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Upload />
                Import
              </Button>
              <Button>
                <Plus />
                New memory
              </Button>
            </div>
          </header>

          <div className="grid gap-5 lg:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
            <div className="space-y-5">
              <section className="glass-panel rounded-lg border border-white/10 p-5">
                <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Capture memory</h2>
                    <p className="text-sm text-muted-foreground">
                      Mock intake for text notes, voice reflections, files, and future transcription.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 rounded-md border border-white/10 bg-white/[0.04] p-1">
                    <Button
                      size="sm"
                      variant={captureMode === "text" ? "default" : "ghost"}
                      onClick={() => setCaptureMode("text")}
                    >
                      <FileText />
                      Text
                    </Button>
                    <Button
                      size="sm"
                      variant={captureMode === "voice" ? "default" : "ghost"}
                      onClick={() => setCaptureMode("voice")}
                    >
                      <AudioLines />
                      Voice
                    </Button>
                  </div>
                </div>

                {captureMode === "text" ? (
                  <div className="grid gap-4">
                    <Textarea
                      defaultValue="I noticed I explain technical projects better when I first describe the tradeoff, then the architecture, then the implementation detail."
                      aria-label="Memory text"
                    />
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex flex-wrap gap-2">
                        <Badge variant="secondary">auto-tag preview</Badge>
                        <Badge variant="secondary">reflection</Badge>
                        <Badge variant="secondary">work</Badge>
                      </div>
                      <Button>
                        <Sparkles />
                        Structure memory
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-lg border border-white/10 bg-black/20 p-5">
                    <div className="mb-5 flex items-center justify-between">
                      <div>
                        <div className="text-sm font-medium">Voice reflection mock</div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {isRecording ? "00:38 recording" : "Ready to capture"}
                        </div>
                      </div>
                      <Button size="icon" onClick={() => setIsRecording((value) => !value)}>
                        {isRecording ? <Pause /> : <Mic />}
                      </Button>
                    </div>
                    <div className="flex h-24 items-center gap-1">
                      {Array.from({ length: 42 }).map((_, index) => (
                        <motion.div
                          key={index}
                          className="w-full rounded-full bg-primary/70"
                          animate={{ height: isRecording ? [12, 56 - (index % 9) * 4, 18] : 10 + (index % 5) * 4 }}
                          transition={{ duration: 1.2, repeat: isRecording ? Infinity : 0, delay: index * 0.015 }}
                        />
                      ))}
                    </div>
                    <div className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle2 className="size-4 text-emerald-300" />
                      Placeholder transcription and memory extraction state
                    </div>
                  </div>
                )}
              </section>

              <section className="grid gap-5 md:grid-cols-3">
                <Metric label="Structured memories" value="128" icon={BookOpen} />
                <Metric label="Detected patterns" value="34" icon={Waves} />
                <Metric label="Action items" value="17" icon={Zap} />
              </section>

              <section className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <div className="mb-5 flex items-center justify-between">
                    <div>
                      <h2 className="text-lg font-semibold">Reflection velocity</h2>
                      <p className="text-sm text-muted-foreground">Mock weekly memory and insight extraction.</p>
                    </div>
                    <Badge variant="secondary">demo data</Badge>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={activityData}>
                        <defs>
                          <linearGradient id="memories" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7dd3fc" stopOpacity={0.45} />
                            <stop offset="95%" stopColor="#7dd3fc" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" vertical={false} />
                        <XAxis dataKey="day" stroke="#9ca8b8" tickLine={false} axisLine={false} />
                        <YAxis stroke="#9ca8b8" tickLine={false} axisLine={false} />
                        <Tooltip
                          contentStyle={{
                            background: "#0d1118",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 8,
                          }}
                        />
                        <Area type="monotone" dataKey="memories" stroke="#7dd3fc" fill="url(#memories)" />
                        <Area type="monotone" dataKey="insights" stroke="#a7f3d0" fill="transparent" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold">Life pattern index</h2>
                    <p className="text-sm text-muted-foreground">Themes extracted from recent memories.</p>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={patternData} layout="vertical" margin={{ left: 12, right: 12 }}>
                        <CartesianGrid stroke="rgba(255,255,255,0.08)" horizontal={false} />
                        <XAxis type="number" hide />
                        <YAxis
                          type="category"
                          dataKey="name"
                          stroke="#9ca8b8"
                          tickLine={false}
                          axisLine={false}
                          width={72}
                        />
                        <Tooltip
                          cursor={{ fill: "rgba(255,255,255,0.04)" }}
                          contentStyle={{
                            background: "#0d1118",
                            border: "1px solid rgba(255,255,255,0.12)",
                            borderRadius: 8,
                          }}
                        />
                        <Bar dataKey="value" fill="#fbbf24" radius={[0, 6, 6, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-5 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold">Memory graph</h2>
                    <p className="text-sm text-muted-foreground">A mock view of how memories connect into patterns.</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Link2 />
                    Explore
                  </Button>
                </div>
                <div className="relative h-72 overflow-hidden rounded-lg border border-white/10 bg-black/25">
                  <svg className="absolute inset-0 size-full" aria-hidden="true">
                    <line x1="18%" y1="72%" x2="42%" y2="48%" stroke="rgba(255,255,255,0.18)" />
                    <line x1="12%" y1="24%" x2="42%" y2="48%" stroke="rgba(255,255,255,0.18)" />
                    <line x1="64%" y1="18%" x2="42%" y2="48%" stroke="rgba(255,255,255,0.18)" />
                    <line x1="72%" y1="70%" x2="42%" y2="48%" stroke="rgba(255,255,255,0.18)" />
                  </svg>
                  {graphNodes.map((node) => (
                    <div
                      key={node.label}
                      className="absolute -translate-x-1/2 -translate-y-1/2 rounded-lg border border-white/10 bg-[#0d1118] px-3 py-2 shadow-2xl"
                      style={{ left: `clamp(76px, ${node.x}, calc(100% - 76px))`, top: node.y }}
                    >
                      <div className="flex max-w-[112px] items-center gap-2 text-xs sm:max-w-none sm:whitespace-nowrap">
                        <span className={cn("size-2 rounded-full", node.color)} />
                        {node.label}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <aside className="space-y-5">
              <section className="glass-panel rounded-lg border border-white/10 p-5">
                <div className="mb-4 flex items-center gap-2">
                  <Command className="size-4 text-primary" />
                  <h2 className="text-lg font-semibold">Ask your life archive</h2>
                </div>
                <div className="mb-3 flex gap-2">
                  <Input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search question" />
                  <Button size="icon" aria-label="Ask">
                    <Send />
                  </Button>
                </div>
                <div className="rounded-lg border border-white/10 bg-black/25 p-4">
                  <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                    <Sparkles className="size-4 text-primary" />
                    Mock AI answer
                  </div>
                  <p className="text-sm leading-6 text-muted-foreground">
                    Your best work usually follows a short clarification step: naming the tradeoff, sketching the system,
                    then reducing the demo to one memorable outcome.
                  </p>
                  <div className="mt-4 space-y-2">
                    {["Interview loop reflection", "Launch week lesson", "Project debrief notes"].map((source) => (
                      <div key={source} className="flex items-center justify-between rounded-md bg-white/[0.05] px-3 py-2">
                        <span className="text-xs text-muted-foreground">{source}</span>
                        <ChevronRight className="size-4 text-muted-foreground" />
                      </div>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Insight queue</h2>
                  <Badge variant="secondary">3 new</Badge>
                </div>
                <div className="space-y-3">
                  {insights.map((insight) => (
                    <div key={insight.title} className="rounded-lg border border-white/10 bg-black/20 p-4">
                      <div className="mb-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Lightbulb className="size-4 text-amber-200" />
                        {insight.label}
                      </div>
                      <h3 className="mb-2 text-sm font-semibold">{insight.title}</h3>
                      <p className="text-sm leading-6 text-muted-foreground">{insight.body}</p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-lg border border-white/10 bg-white/[0.035] p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Processing pipeline</h2>
                  <CircleDot className="size-4 text-emerald-300" />
                </div>
                <div className="space-y-4">
                  {pipelineItems.map(([label, value, Icon]) => (
                    <div key={label}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2 text-muted-foreground">
                          <Icon className="size-4" />
                          {label}
                        </span>
                        <span className="font-mono text-xs">{value}%</span>
                      </div>
                      <Progress value={value} />
                    </div>
                  ))}
                </div>
              </section>
            </aside>
          </div>

          <section className="mt-5 rounded-lg border border-white/10 bg-white/[0.035] p-5">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold">Recent memories</h2>
                <p className="text-sm text-muted-foreground">Structured memory cards with sources, tags, and recall score.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Filter />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <CalendarDays />
                  This week
                </Button>
              </div>
            </div>
            <div className="grid gap-4 lg:grid-cols-3">
              {memories.map((memory, index) => (
                <MemoryCard key={memory.title} memory={memory} active={index === 0} />
              ))}
            </div>
          </section>

          <footer className="py-8 text-center text-xs text-muted-foreground">
            Phase 1 UI only. Backend, AI calls, auth, vector search, transcription, and persistence are intentionally mocked.
            Current featured insight: {selectedInsight.title}.
          </footer>
        </section>
      </div>
    </main>
  );
}
