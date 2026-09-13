/**
 * DIANA — Adaptadores entre dados de demonstração e o domínio de ML.
 */
import type { DemoScenario } from "@/data/types";
import type { Conversation } from "./types";

/** Converte um cenário de demonstração em uma `Conversation` para o pipeline. */
export function scenarioToConversation(scenario: DemoScenario): Conversation {
  return {
    id: `conv-${scenario.id}-${Date.now()}`,
    childId: `child-${scenario.id}`,
    childName: scenario.childName,
    contactId: `contact-${scenario.id}`,
    contactName: scenario.contactName,
    startedAt: new Date().toISOString(),
    messages: scenario.messages.map((m, i) => ({
      id: `m${i}`,
      author: m.author,
      text: m.text,
      timestamp: `2026-09-10T${m.time}:00`,
    })),
  };
}
