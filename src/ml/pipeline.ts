/**
 * DIANA — Pipeline de análise.
 *
 * Orquestra todo o fluxo com latência simulada por etapa (para a demonstração)
 * e gera o `AnalysisResult` consumido pela interface:
 *
 *   Conversation
 *      ↓
 *   Preprocessing / Privacy
 *      ↓
 *   Feature Extraction
 *      ↓
 *   Mock ML Analyzer
 *      ↓
 *   Contextual Analysis
 *      ↓
 *   Risk Engine
 *      ↓
 *   Explainability
 *      ↓
 *   AnalysisResult
 *
 * O frontend recebe somente o resultado final.
 */
import type {
  AnalysisResult,
  AuditEntry,
  Conversation,
  PipelineStage,
} from "./types";
import { preprocessConversation } from "./preprocess";
import { extractFeatures } from "./featureExtractor";
import { MockRiskAnalyzer } from "./mockAnalyzer";
import { analyzeContext } from "./contextualAnalyzer";
import { evaluateRisk } from "./riskEngine";
import { buildExplanation } from "./explainability";
import { MODEL_METADATA } from "./mockAnalyzer";

export const PIPELINE_STAGES: PipelineStage[] = [
  "received",
  "preprocessing",
  "feature_extraction",
  "ml_analysis",
  "context_analysis",
  "risk_engine",
  "explainability",
];

export interface PipelineOptions {
  /** Latência por etapa (ms). Cada etapa ~400–1200ms na demonstração. */
  latency?: Partial<Record<PipelineStage, number>>;
  /** Chamado ao concluir cada etapa (para visualização do pipeline). */
  onStep?: (step: PipelineStage, index: number) => void;
}

const DEFAULT_LATENCY: Record<PipelineStage, number> = {
  received: 700,
  preprocessing: 1500,
  feature_extraction: 1900,
  ml_analysis: 2200,
  context_analysis: 1800,
  risk_engine: 1600,
  explainability: 1500,
};

/** Latência zero — usado para análises instantâneas fora da demonstração. */
export const INSTANT_LATENCY: Record<PipelineStage, number> = {
  received: 0,
  preprocessing: 0,
  feature_extraction: 0,
  ml_analysis: 0,
  context_analysis: 0,
  risk_engine: 0,
  explainability: 0,
};

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

function stamp(): string {
  return new Date().toLocaleTimeString("pt-BR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export async function analyzeConversation(
  conversation: Conversation,
  options: PipelineOptions = {},
): Promise<AnalysisResult> {
  const latency = options.latency ?? {};
  const onStep = options.onStep;

  const audit: AuditEntry[] = [];
  const addAudit = (stage: AuditEntry["stage"], description: string) => {
    audit.push({ timestamp: stamp(), stage, description });
  };

  const step = async (stage: PipelineStage, ms: number) => {
    await sleep(ms);
    onStep?.(stage, PIPELINE_STAGES.indexOf(stage));
  };

  const analyzer = new MockRiskAnalyzer();

  // 1 · Recebimento
  await step("received", latency.received ?? DEFAULT_LATENCY.received);
  addAudit("received", "Mensagem recebida");

  // 2 · Pré-processamento / privacidade
  await step("preprocessing", latency.preprocessing ?? DEFAULT_LATENCY.preprocessing);
  const prepared = preprocessConversation(conversation);
  addAudit(
    "preprocessing",
    prepared.piiFindings.length
      ? `Dados preparados · ${prepared.piiFindings.length} PII minimizada(s)`
      : "Dados preparados",
  );

  // 3 · Extração de características
  await step("feature_extraction", latency.feature_extraction ?? DEFAULT_LATENCY.feature_extraction);
  const { features } = extractFeatures(prepared.conversation);
  addAudit("feature_extraction", `${features.messageCount} mensagens analisadas`);

  // 4 · Modelo ML (mock)
  await step("ml_analysis", latency.ml_analysis ?? DEFAULT_LATENCY.ml_analysis);
  const { signals } = analyzer.predict(prepared.conversation);
  addAudit("ml_analysis", `${signals.length} sinais identificados`);

  // 5 · Análise contextual
  await step("context_analysis", latency.context_analysis ?? DEFAULT_LATENCY.context_analysis);
  const factors = analyzeContext(features, signals);
  addAudit("context_analysis", "Contexto relacionado");

  // 6 · Risk Engine
  await step("risk_engine", latency.risk_engine ?? DEFAULT_LATENCY.risk_engine);
  const assessment = evaluateRisk(features, signals, factors);
  addAudit("risk_engine", `Prioridade: ${assessment.priority} · score ${assessment.score}`);

  // 7 · Explainability
  await step("explainability", latency.explainability ?? DEFAULT_LATENCY.explainability);
  const explanation = buildExplanation(assessment, signals, factors);
  addAudit("explainability", "Explicação gerada");

  addAudit("alert", "Alerta gerado");
  addAudit("notified", "Responsável notificado");

  return {
    conversationId: conversation.id,
    assessment,
    signals,
    explanation,
    features,
    model: MODEL_METADATA,
    privacy: prepared.privacy,
    audit,
    processedAt: new Date().toISOString(),
  };
}
