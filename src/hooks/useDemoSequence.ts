import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getScenario, demoScenarios } from "@/data/scenarios";
import type { DemoStage } from "@/data/types";
import { analyzeConversation, PIPELINE_STAGES } from "@/ml/pipeline";
import { scenarioToConversation } from "@/ml/adapter";
import type { AnalysisResult, PipelineStage } from "@/ml/types";

export interface PipelineProgressItem {
  stage: PipelineStage;
  done: boolean;
  active: boolean;
}

const NORMAL_MESSAGE_DELAY = 1200;
const RISK_MESSAGE_DELAY = 3000;

const PIPELINE_TO_STAGE: Record<PipelineStage, DemoStage> = {
  received: "normal",
  preprocessing: "preprocessing",
  feature_extraction: "feature_extraction",
  ml_analysis: "ml_analysis",
  context_analysis: "context_analysis",
  risk_engine: "risk_engine",
  explainability: "explainability",
};

export function useDemoSequence() {
  const [scenarioId, setScenarioId] = useState(demoScenarios[0].id);
  const [stage, setStage] = useState<DemoStage>("idle");
  const [visibleCount, setVisibleCount] = useState(0);
  const [riskOverlay, setRiskOverlay] = useState(false);
  const [guardianAlertVisible, setGuardianAlertVisible] = useState(false);
  const [alertDetailOpen, setAlertDetailOpen] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [pipelineRunning, setPipelineRunning] = useState(false);
  const [pipelineProgress, setPipelineProgress] = useState<PipelineProgressItem[]>([]);

  const timers = useRef<number[]>([]);
  const runIdRef = useRef(0);

  const clearTimers = useCallback(() => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  }, []);

  const schedule = useCallback((fn: () => void, ms: number) => {
    const id = window.setTimeout(fn, ms);
    timers.current.push(id);
  }, []);

  const reset = useCallback(() => {
    runIdRef.current += 1;
    clearTimers();
    setStage("idle");
    setVisibleCount(0);
    setRiskOverlay(false);
    setGuardianAlertVisible(false);
    setAlertDetailOpen(false);
    setAnalysis(null);
    setPipelineRunning(false);
    setPipelineProgress([]);
  }, [clearTimers]);

  const scenario = getScenario(scenarioId);

  const start = useCallback(() => {
    clearTimers();
    const runId = ++runIdRef.current;

    setStage("normal");
    setVisibleCount(0);
    setRiskOverlay(false);
    setGuardianAlertVisible(false);
    setAlertDetailOpen(false);
    setAnalysis(null);
    setPipelineProgress(
      PIPELINE_STAGES.map((s) => ({ stage: s, done: false, active: false })),
    );
    setPipelineRunning(true);

    const scn = getScenario(scenarioId);
    const conversation = scenarioToConversation(scn);
    const startedAt = Date.now();

    // Revela as mensagens progressivamente. As mensagens de risco (a partir de
    // riskStartIndex) permanecem mais tempo na tela, pois são o foco da demo.
    let acc = 0;
    let totalRevealMs = 0;
    scn.messages.forEach((_, i) => {
      acc += i < scn.riskStartIndex ? NORMAL_MESSAGE_DELAY : RISK_MESSAGE_DELAY;
      totalRevealMs = acc;
      schedule(() => setVisibleCount(i + 1), acc);
    });

    // Executa o pipeline de análise — as etapas avançam o estágio da demo
    void analyzeConversation(conversation, {
      onStep: (step, index) => {
        if (runIdRef.current !== runId) return;
        setPipelineProgress((prev) =>
          prev.map((item, i) => ({
            ...item,
            done: i < index,
            active: i === index,
          })),
        );
        setStage(PIPELINE_TO_STAGE[step]);
      },
    })
      .then((result) => {
        if (runIdRef.current !== runId) return;
        setAnalysis(result);
        setPipelineRunning(false);
        setPipelineProgress((prev) =>
          prev.map((item) => ({ ...item, done: true, active: false })),
        );

        if (result.assessment.requiresGuardianAttention) {
          // Garante que a conversa termine de aparecer antes de disparar o alerta
          const elapsed = Date.now() - startedAt;
          const wait = Math.max(0, totalRevealMs + 900 - elapsed);

          schedule(() => setStage("risk"), wait + 500);
          schedule(() => setRiskOverlay(true), wait + 1600);
          schedule(() => {
            setRiskOverlay(false);
            setStage("sending");
          }, wait + 6600);
          schedule(() => {
            setStage("delivered");
            setGuardianAlertVisible(true);
          }, wait + 10400);
        } else {
          // Sem risco identificado: conversa termina sem alerta
          setStage("normal");
        }
      });
  }, [clearTimers, schedule, scenarioId]);

  const changeScenario = useCallback(
    (id: string) => {
      reset();
      setScenarioId(id);
    },
    [reset],
  );

  const viewAlert = useCallback(() => {
    setGuardianAlertVisible(false);
    setAlertDetailOpen(true);
    setStage("detail");
  }, []);

  const closeAlertDetail = useCallback(() => {
    setAlertDetailOpen(false);
    setStage("delivered");
  }, []);

  // Mensagens sinalizadas pelo pipeline (para destacar no chat da criança)
  const highlightedMessageIds = useMemo(() => {
    if (!analysis) return [];
    return Array.from(new Set(analysis.signals.flatMap((s) => s.messageIds)));
  }, [analysis]);

  useEffect(() => clearTimers, [clearTimers]);

  return {
    scenario,
    scenarioId,
    changeScenario,
    stage,
    visibleCount,
    riskOverlay,
    guardianAlertVisible,
    alertDetailOpen,
    analysis,
    pipelineRunning,
    pipelineProgress,
    highlightedMessageIds,
    start,
    reset,
    viewAlert,
    closeAlertDetail,
  };
}
