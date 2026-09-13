import { useState } from "react";
import { AlertTriangle, Bell, ArrowRight, Loader2 } from "lucide-react";
import { recentAlerts } from "@/data/dashboard";
import { demoScenarios } from "@/data/scenarios";
import type { AlertItem, Priority } from "@/data/types";
import { analyzeConversation, INSTANT_LATENCY } from "@/ml/pipeline";
import { scenarioToConversation } from "@/ml/adapter";
import type { AnalysisResult } from "@/ml/types";
import { AlertDetail } from "@/components/guardian/AlertDetail";
import { cn } from "@/lib/utils";

type Filter = "todos" | Priority;

const filters: { id: Filter; label: string }[] = [
  { id: "todos", label: "Todos" },
  { id: "alta", label: "Alta" },
  { id: "media", label: "Média" },
  { id: "baixa", label: "Baixa" },
];

const alertAccent: Record<AlertItem["priority"], string> = {
  alta: "bg-red-100 text-red-600",
  media: "bg-amber-100 text-amber-600",
  baixa: "bg-sky-100 text-sky-600",
};

const filterDot: Record<AlertItem["priority"], string> = {
  alta: "bg-red-500",
  media: "bg-amber-500",
  baixa: "bg-sky-500",
};

export function AlertsList() {
  const [filter, setFilter] = useState<Filter>("todos");
  const [selected, setSelected] = useState<AlertItem | null>(null);
  const [selectedAnalysis, setSelectedAnalysis] = useState<AnalysisResult | null>(null);

  const handleSelect = async (alert: AlertItem) => {
    setSelected(alert);
    setSelectedAnalysis(null);
    const scenario =
      demoScenarios.find((s) => s.category === alert.category) ?? demoScenarios[0];
    const result = await analyzeConversation(scenarioToConversation(scenario), {
      latency: INSTANT_LATENCY,
    });
    setSelectedAnalysis(result);
  };

  const handleBack = () => {
    setSelected(null);
    setSelectedAnalysis(null);
  };

  if (selected && selectedAnalysis) {
    const scenario =
      demoScenarios.find((s) => s.category === selected.category) ?? demoScenarios[0];
    return (
      <AlertDetail
        analysis={selectedAnalysis}
        childName={selected.child}
        detectedTime={selected.time}
        onBack={handleBack}
      />
    );
  }

  const alerts = recentAlerts.filter((a) => filter === "todos" || a.priority === filter);

  return (
    <div className="flex flex-col gap-3 px-3.5 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <Bell className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">Alertas</h1>
          <p className="text-[10px] text-muted-foreground">Histórico de análises</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-1.5">
        {filters.map((f) => (
          <button
            key={f.id}
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[10px] font-semibold transition",
              filter === f.id
                ? "bg-brand text-white shadow-sm"
                : "border border-border bg-white text-muted-foreground hover:text-foreground",
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="flex flex-col gap-2 pb-2">
        {alerts.map((alert) => (
          <button
            key={alert.id}
            onClick={() => void handleSelect(alert)}
            className="flex items-center gap-2.5 rounded-2xl border border-border bg-white p-2.5 text-left shadow-card transition hover:border-brand/30 hover:shadow-md"
          >
            <span
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                alertAccent[alert.priority],
              )}
            >
              {selected?.id === alert.id ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <AlertTriangle className="h-4 w-4" />
              )}
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-xs font-bold text-foreground">{alert.title}</p>
                <span className={cn("h-1.5 w-1.5 shrink-0 rounded-full", filterDot[alert.priority])} />
              </div>
              <p className="text-[9px] text-muted-foreground">
                {alert.child} · {alert.time} · {alert.category}
              </p>
            </div>
            <ArrowRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
          </button>
        ))}
        {alerts.length === 0 && (
          <p className="py-8 text-center text-xs text-muted-foreground">
            Nenhum alerta nesta categoria.
          </p>
        )}
      </div>
    </div>
  );
}
