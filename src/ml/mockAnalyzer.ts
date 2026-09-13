/**
 * DIANA — Mock ML Analyzer.
 *
 * Simula o comportamento de um modelo real: extrai características, detecta
 * sinais, avalia contexto, calcula risco e gera explicação.
 *
 * ⚠️ MOCK / PROTOTYPE
 * O restante da aplicação deve depender da interface `RiskAnalyzer` e nunca
 * chamar este mock diretamente.
 */
import type {
  AnalysisResult,
  Conversation,
  ConversationFeatures,
  DetectedSignal,
  ModelMetadata,
  PiiFinding,
  RiskAssessment,
  SignalSeverity,
} from "./types";
import { preprocessConversation } from "./preprocess";
import { extractFeatures } from "./featureExtractor";
import { analyzeContext } from "./contextualAnalyzer";
import { evaluateRisk } from "./riskEngine";
import { buildExplanation } from "./explainability";
import { CONFIDENCE_FLOOR, CONFIDENCE_CEILING, CONFIDENCE_STEP } from "./thresholds";

/** Contrato: o restante da aplicação depende desta interface. */
export interface RiskAnalyzer {
  analyzeConversation(conversation: Conversation): Promise<AnalysisResult>;
}

export interface ModelPrediction {
  signals: DetectedSignal[];
  features: ConversationFeatures;
}

interface SignalCatalogEntry {
  title: string;
  description: string;
  severity: SignalSeverity;
}

const SIGNAL_CATALOG: Record<string, SignalCatalogEntry> = {
  secrecy_request: {
    title: "Pedido de segredo",
    description:
      "A outra pessoa pediu que a criança mantivesse a conversa escondida dos responsáveis.",
    severity: "high",
  },
  image_request: {
    title: "Solicitação de imagem",
    description:
      "Foi identificada uma solicitação para que a criança envie uma foto pessoal.",
    severity: "high",
  },
  isolation_attempt: {
    title: "Tentativa de isolamento",
    description:
      "A conversa contém linguagem que pode desencorajar a criança de conversar com os responsáveis.",
    severity: "high",
  },
  personal_information_request: {
    title: "Solicitação de dados pessoais",
    description:
      "Perguntas por informações que permitem identificar ou localizar a criança.",
    severity: "medium",
  },
  personal_information_shared: {
    title: "Dados pessoais compartilhados",
    description: "A criança compartilhou informações pessoais na conversa.",
    severity: "low",
  },
  threat: {
    title: "Ameaça",
    description: "Mensagens com tom de intimidação ou ameaça.",
    severity: "medium",
  },
  insult: {
    title: "Insulto / agressão verbal",
    description: "Linguagem depreciativa ou hostil direcionada à criança.",
    severity: "medium",
  },
  blackmail: {
    title: "Chantagem",
    description: "Tentativa de pressionar a criança usando segredos ou informações.",
    severity: "high",
  },
  sexual_language: {
    title: "Linguagem de conotação sexual",
    description: "Conteúdo ou linguagem sexualizada inadequada para a faixa etária.",
    severity: "high",
  },
  emotional_distress: {
    title: "Sinais de sofrimento emocional",
    description: "A criança demonstra desconforto, tristeza ou angústia.",
    severity: "low",
  },
  self_harm: {
    title: "Linguagem de automutilação",
    description: "Menções a automutilação ou desesperança.",
    severity: "high",
  },
};

const MODEL_METADATA: ModelMetadata = {
  modelName: "DIANA Risk Analyzer",
  version: "v0.1.0",
  environment: "mock",
};

export { MODEL_METADATA };

export class MockRiskAnalyzer implements RiskAnalyzer {
  /** Predição do "modelo": sinais + features (sem explicação). */
  predict(conversation: Conversation): ModelPrediction {
    const { features, matches } = extractFeatures(conversation);

    const signals: DetectedSignal[] = Object.entries(SIGNAL_CATALOG)
      .map(([key, entry]) => {
        const messageIds = matches
          .filter((m) => m.signalKeys.includes(key))
          .map((m) => m.messageId);
        if (messageIds.length === 0) return null;

        const confidence = Math.min(
          CONFIDENCE_CEILING,
          CONFIDENCE_FLOOR + CONFIDENCE_STEP * (messageIds.length - 1),
        );

        return {
          id: `sig-${key}`,
          type: key,
          confidence: Math.round(confidence * 100) / 100,
          messageIds,
          title: entry.title,
          description: entry.description,
          severity: entry.severity,
        };
      })
      .filter((s): s is DetectedSignal => s !== null);

    return { signals, features };
  }

  /** Implementação da interface `RiskAnalyzer` (pipeline completo, sem latência). */
  async analyzeConversation(conversation: Conversation): Promise<AnalysisResult> {
    const { conversation: prepared, privacy, piiFindings } = preprocessConversation(conversation);
    const { features, matches } = extractFeatures(prepared);
    const { signals } = this.predict(prepared);

    const factors = analyzeContext(features, signals);
    const assessment = evaluateRisk(features, signals, factors);
    const explanation = buildExplanation(assessment, signals, factors);

    return {
      conversationId: conversation.id,
      assessment,
      signals,
      explanation,
      features,
      model: MODEL_METADATA,
      privacy,
      audit: buildAudit(matches.length, piiFindings, assessment),
      processedAt: new Date().toISOString(),
    };
  }
}

function buildAudit(
  messageCount: number,
  piiFindings: PiiFinding[],
  assessment: RiskAssessment,
) {
  const now = () =>
    new Date().toLocaleTimeString("pt-BR", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return [
    { timestamp: now(), stage: "received" as const, description: "Mensagem recebida" },
    {
      timestamp: now(),
      stage: "preprocessing" as const,
      description: `Dados preparados${piiFindings.length ? ` · ${piiFindings.length} PII minimizada(s)` : ""}`,
    },
    {
      timestamp: now(),
      stage: "feature_extraction" as const,
      description: `${messageCount} mensagens analisadas`,
    },
    { timestamp: now(), stage: "ml_analysis" as const, description: "Modelo mock avaliou padrões" },
    { timestamp: now(), stage: "context_analysis" as const, description: "Contexto relacionado" },
    {
      timestamp: now(),
      stage: "risk_engine" as const,
      description: `Prioridade: ${assessment.priority}`,
    },
    { timestamp: now(), stage: "explainability" as const, description: "Explicação gerada" },
    { timestamp: now(), stage: "alert" as const, description: "Alerta gerado" },
    { timestamp: now(), stage: "notified" as const, description: "Responsável notificado" },
  ];
}
