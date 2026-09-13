export type Author = "child" | "other";

export interface Message {
  author: Author;
  text: string;
  time: string;
}

export type Priority = "alta" | "media" | "baixa";

export type SignalIconKey =
  | "lock"
  | "camera"
  | "isolation"
  | "aggression"
  | "repetition"
  | "emotional"
  | "personal-data"
  | "sensitive"
  | "unknown"
  | "approach";

export interface Signal {
  id: string;
  icon: SignalIconKey;
  title: string;
  description: string;
}

export interface Excerpt {
  author: Author;
  text: string;
  signalId: string;
}

export interface RiskCategory {
  id: string;
  name: string;
  priority: Priority;
  description: string;
  examples: string[];
  orientation: string;
}

export interface DemoScenario {
  id: string;
  label: string;
  category: string;
  priority: Priority;
  childName: string;
  contactName: string;
  messages: Message[];
  /** Índice (em messages) a partir do qual começam os sinais de risco. */
  riskStartIndex: number;
  /** Índice da mensagem que dispara a detecção/alerta em destaque. */
  riskHighlightIndex: number;
  signals: Signal[];
  excerpts: Excerpt[];
  summary: string;
}

export interface AlertItem {
  id: string;
  title: string;
  child: string;
  time: string;
  priority: Priority;
  read: boolean;
  category: string;
}

export type GuardianTab = "home" | "alerts" | "safety" | "settings";

export type DemoStage =
  | "idle"
  | "normal"
  | "warning"
  | "preprocessing"
  | "feature_extraction"
  | "ml_analysis"
  | "context_analysis"
  | "risk_engine"
  | "explainability"
  | "risk"
  | "sending"
  | "delivered"
  | "detail";

export type AlertPriorityConfig = {
  label: string;
  dot: string;
  text: string;
  bg: string;
};
