import { motion, AnimatePresence } from "framer-motion";
import {
  MessageSquare,
  Lock,
  Brain,
  Network,
  Gauge,
  Sparkles,
  BellRing,
  ArrowDown,
  ArrowRight,
  AlertTriangle,
  Radar,
  ShieldCheck,
} from "lucide-react";
import type { DemoScenario, DemoStage } from "@/data/types";
import type { AnalysisResult } from "@/ml/types";
import { SignalIcon } from "@/components/shared/SignalIcon";
import { cn } from "@/lib/utils";

interface FlowCenterProps {
  stage: DemoStage;
  scenario: DemoScenario;
  mobile: boolean;
  analysis: AnalysisResult | null;
}

const flowSteps = [
  { key: "conversa", label: "CONVERSA", detail: "Mensagem recebida", icon: MessageSquare },
  { key: "privacidade", label: "PRIVACIDADE", detail: "Preparando dados", icon: Lock },
  { key: "ml", label: "ML", detail: "Analisando padrões", icon: Brain },
  { key: "contexto", label: "CONTEXTO", detail: "Relacionando sinais", icon: Network },
  { key: "risk", label: "RISK ENGINE", detail: "Avaliando prioridade", icon: Gauge },
  { key: "explain", label: "EXPLAINABILITY", detail: "Preparando explicação", icon: Sparkles },
  { key: "alerta", label: "ALERTA", detail: "Responsável notificado", icon: BellRing },
];

const activeClasses = [
  "border-[#1187E0]/70 bg-[#004CA8] text-white",
  "border-cyan-400/50 bg-cyan-700/80 text-white",
  "border-[#1187E0]/70 bg-[#004CA8] text-white",
  "border-amber-400/50 bg-amber-600/80 text-white",
  "border-red-400/50 bg-red-600/80 text-white",
  "border-cyan-400/50 bg-cyan-700/80 text-white",
  "border-emerald-400/50 bg-emerald-600/80 text-white",
];

const activeIconClasses = [
  "text-white",
  "text-white",
  "text-white",
  "text-white",
  "text-white",
  "text-white",
  "text-white",
];

const captions: Record<DemoStage, string> = {
  idle: "Pronto para demonstrar",
  normal: "Recebendo a conversa",
  warning: "Comportamento mudou · preparando dados",
  preprocessing: "Pré-processamento e privacidade",
  feature_extraction: "Extraindo características",
  ml_analysis: "Modelo analisando padrões",
  context_analysis: "Relacionando sinais e contexto",
  risk_engine: "Avaliando prioridade do risco",
  explainability: "Preparando explicação para o responsável",
  risk: "Possível situação de risco identificada",
  sending: "Alerta enviado ao responsável",
  delivered: "Alerta entregue ao responsável",
  detail: "Explicação aberta pelo responsável",
};

const stageToFlowStep: Record<DemoStage, number> = {
  idle: -1,
  normal: 0,
  warning: 1,
  preprocessing: 2,
  feature_extraction: 2,
  ml_analysis: 2,
  context_analysis: 3,
  risk_engine: 4,
  explainability: 5,
  risk: 6,
  sending: 6,
  delivered: 6,
  detail: 6,
};

interface StepPillProps {
  step: (typeof flowSteps)[number];
  state: "done" | "active" | "pending";
  compact: boolean;
}

function StepPill({ step, state, compact }: StepPillProps) {
  const Icon = step.icon;
  const index = flowSteps.findIndex((s) => s.key === step.key);

  if (compact) {
    return (
      <motion.div
        animate={state === "active" ? { scale: [1, 1.1, 1] } : {}}
        transition={{ duration: 1.2, repeat: state === "active" ? Infinity : 0 }}
        title={step.label}
        className={cn(
          "flex h-9 w-9 min-w-0 flex-1 max-w-11 items-center justify-center rounded-xl border backdrop-blur transition-colors",
          state === "active" && activeClasses[index],
          state === "done" && "border-emerald-400/50 bg-emerald-500/20 text-emerald-300",
          state === "pending" && "border-white/25 bg-[#325b7b] text-white",
        )}
      >
        <Icon className={cn("h-4 w-4", state === "active" && activeIconClasses[index])} />
      </motion.div>
    );
  }

  return (
    <motion.div
      animate={
        state === "active"
          ? {
              boxShadow: [
                `0 0 0 0 ${state === "active" ? "hsl(206 86% 47% / 0.35)" : "rgba(0,0,0,0)"}`,
                "0 0 0 10px rgba(0,0,0,0)",
                "0 0 0 0 rgba(0,0,0,0)",
              ],
            }
          : {}
      }
      transition={{ duration: 1.8, repeat: state === "active" ? Infinity : 0 }}
      className={cn(
        "flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-bold backdrop-blur transition-colors",
        state === "active" && activeClasses[index],
        state === "done" && "border-emerald-400/50 bg-emerald-500/20 text-emerald-300",
        state === "pending" && "border-white/25 bg-[#325b7b] text-white",
      )}
    >
      <Icon
        className={cn(
          "h-4 w-4",
          state === "active" && activeIconClasses[index],
          state === "done" && "text-emerald-300",
        )}
      />
      <span>{step.label}</span>
      <span className="hidden text-[10px] font-medium text-white/80 xl:inline">
        · {step.detail}
      </span>
    </motion.div>
  );
}

export function FlowCenter({ stage, scenario, mobile, analysis }: FlowCenterProps) {
  const Arrow = mobile ? ArrowRight : ArrowDown;
  const activeStep = stageToFlowStep[stage];
  const processing =
    stage !== "idle" && stage !== "risk" && stage !== "sending" && stage !== "delivered" && stage !== "detail";
  const showResult = analysis && ["risk", "sending", "delivered", "detail"].includes(stage);

  const currentFlowStep = activeStep >= 0 ? flowSteps[activeStep] : null;
  const captionText =
    stage === "idle"
      ? captions.idle
      : currentFlowStep
        ? `${currentFlowStep.label} · ${currentFlowStep.detail}`
        : captions[stage];

  return (
    <div className="relative flex w-full flex-col items-center gap-2">
      {/* Etapas do pipeline */}
      {mobile ? (
        <div className="flex w-full items-center gap-1">
          {flowSteps.map((step, i) => (
            <StepPill
              key={step.key}
              step={step}
              compact
              state={i < activeStep ? "done" : i === activeStep ? "active" : "pending"}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center gap-1.5">
          {flowSteps.map((step, i) => (
            <div key={step.key} className="flex flex-col items-center">
              <StepPill
                step={step}
                compact={false}
                state={i < activeStep ? "done" : i === activeStep ? "active" : "pending"}
              />
              {i < flowSteps.length - 1 && (
                <Arrow
                  className={cn(
                    "my-0.5 h-4 w-4",
                    i < activeStep ? "text-emerald-400" : "text-white/30",
                  )}
                />
              )}
            </div>
          ))}
        </div>
      )}

      {/* Legenda do estágio atual */}
      <AnimatePresence mode="wait">
        <motion.div
          key={stage}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.2 }}
          className="mt-2 flex w-full items-center justify-center gap-1.5 text-center"
        >
          {processing && <Radar className="h-3.5 w-3.5 animate-pulse text-white" />}
          {stage === "risk" && (
            <AlertTriangle className="h-3.5 w-3.5 animate-alert-blink text-red-300" />
          )}
          {(stage === "delivered" || stage === "detail") && (
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-300" />
          )}
          <p className="rounded-full bg-[#325b7b] px-3 py-1 text-[11px] font-semibold text-white">
            {captionText}
          </p>
        </motion.div>
      </AnimatePresence>

      {/* Sinais identificados + força dos sinais */}
      <AnimatePresence>
        {showResult && analysis && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
            className={cn(
              "flex w-full gap-3 rounded-2xl border border-white/15 bg-white/5 p-3 backdrop-blur",
              mobile ? "flex-row flex-wrap justify-center" : "flex-col",
            )}
          >
            <div className="min-w-0 flex-1">
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">
                Sinais identificados
              </p>
              <div className="mt-1.5 flex flex-col gap-1.5">
                {analysis.explanation.topSignals.map((signal, i) => (
                  <motion.div
                    key={signal.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.15 + i * 0.18 }}
                    className="flex items-center gap-2"
                  >
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-red-500/20">
                      <SignalIcon icon={signal.type} className="h-3 w-3 text-red-300" />
                    </span>
                    <span className="truncate text-[11px] font-medium text-white/90">
                      {signal.title}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className={cn(mobile && "w-full", "min-w-0 flex-1")}>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/80">
                Força dos sinais
              </p>
              <div className="mt-2 flex h-2 w-full overflow-hidden rounded-full bg-white/10">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${analysis.assessment.score}%` }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                  className={cn(
                    "h-full rounded-full",
                    analysis.assessment.priority === "high"
                      ? "bg-gradient-to-r from-amber-400 to-red-500"
                      : "bg-gradient-to-r from-[#1187E0] to-[#004CA8]",
                  )}
                />
              </div>
              <div className="mt-1 flex items-center justify-between">
                <span className="text-[9px] text-white/80">
                  {analysis.explanation.topSignals.length} sinais relevantes
                </span>
                <span className="text-[10px] font-bold text-white">
                  {analysis.assessment.score}/100
                </span>
              </div>
              <p className="mt-1 text-[8px] leading-snug text-white/50">
                Indicador técnico simulado · não representa probabilidade de ocorrência.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Notificação "voando" da criança para o responsável */}
      <div className="pointer-events-none absolute inset-0 z-30">
        <AnimatePresence>
          {stage === "sending" && (
            <motion.div
              key={`fly-${scenario.id}`}
              initial={{ opacity: 0, x: -150, scale: 0.6 }}
              animate={{ opacity: 1, x: 150, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
              className="absolute inset-0 m-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-500 text-white shadow-lg shadow-red-500/50"
            >
              <BellRing className="h-5 w-5" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
