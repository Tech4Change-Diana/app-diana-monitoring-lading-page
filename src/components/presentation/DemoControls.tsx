import { Play, RotateCcw } from "lucide-react";
import { demoScenarios } from "@/data/scenarios";
import type { DemoStage } from "@/data/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DemoControlsProps {
  stage: DemoStage;
  scenarioId: string;
  onSelectScenario: (id: string) => void;
  onStart: () => void;
  onReset: () => void;
}

export function DemoControls({
  stage,
  scenarioId,
  onSelectScenario,
  onStart,
  onReset,
}: DemoControlsProps) {
  const running = stage !== "idle";

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col items-center gap-4">
      {/* Seletor de demonstração */}
      <div className="flex w-full flex-col items-center gap-1.5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-white">
          Escolha a demonstração
        </p>
        <div className="flex flex-wrap items-center justify-center gap-2">
          {demoScenarios.map((s) => (
            <button
              key={s.id}
              onClick={() => onSelectScenario(s.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-semibold backdrop-blur transition",
                scenarioId === s.id
                  ? "border-white bg-[#004CA8] text-white shadow-glow"
                  : "border-white bg-[#325b7b] text-white hover:bg-[#3a6b8f]",
              )}
            >
              <span
                className={cn(
                  "h-1.5 w-1.5 rounded-full",
                  s.priority === "alta" && "bg-red-400",
                  s.priority === "media" && "bg-amber-400",
                  s.priority === "baixa" && "bg-sky-400",
                )}
              />
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Botão principal */}
      {!running ? (
        <Button onClick={onStart} size="xl" variant="premium" className="px-10">
          <Play className="h-5 w-5 fill-current" />
          INICIAR DEMONSTRAÇÃO
        </Button>
      ) : (
        <Button onClick={onReset} variant="glass" size="lg">
          <RotateCcw className="h-4 w-4" />
          Reiniciar demonstração
        </Button>
      )}
    </div>
  );
}
