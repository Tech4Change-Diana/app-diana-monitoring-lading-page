import { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, ShieldCheck, Scan, Mic, Smile, AlertTriangle, ChevronLeft, Phone, MoreVertical } from "lucide-react";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import type { DemoScenario, DemoStage } from "@/data/types";
import { cn } from "@/lib/utils";

interface ChildPhoneProps {
  scenario: DemoScenario;
  stage: DemoStage;
  visibleCount: number;
  highlightedMessageIds: string[];
}

export function ChildPhone({
  scenario,
  stage,
  visibleCount,
  highlightedMessageIds,
}: ChildPhoneProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const running = stage !== "idle";
  // O indicador discreto aparece quando a conversa começa a apresentar sinais.
  const analyzing =
    running &&
    visibleCount > scenario.riskStartIndex &&
    !["risk", "sending", "delivered", "detail"].includes(stage);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [visibleCount, stage]);

  return (
    <PhoneFrame>
      {/* Header do chat */}
      <div className="relative flex h-14 shrink-0 items-center gap-3 border-b border-border bg-white px-3">
        <ChevronLeft className="h-5 w-5 text-muted-foreground" />
        <div className="relative">
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-700 to-blue-950">
            <User className="h-5 w-5 text-white" />
          </div>
          <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-white bg-emerald-500" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-semibold text-foreground">{scenario.contactName}</p>
          <p className="text-[11px] text-emerald-600">online agora</p>
        </div>
        <div className="flex items-center gap-3 text-muted-foreground">
          <Phone className="h-5 w-5" />
          <MoreVertical className="h-5 w-5" />
        </div>
      </div>

      {/* Área de mensagens */}
      <div className="relative flex-1 overflow-hidden">
        <div
          ref={scrollRef}
          className="no-scrollbar relative flex h-full flex-col gap-1.5 overflow-y-auto bg-white px-3 pb-4 pt-2"
        >
          {/* Chip de proteção */}
          <div className="mx-auto mb-2 flex items-center gap-1.5 rounded-full border border-brand/20 bg-white/80 px-3 py-1 text-[10px] font-medium text-brand shadow-sm backdrop-blur">
            <ShieldCheck className="h-3 w-3 text-brand" />
            Proteção DIANA ativa
          </div>

          {!running && (
            <div className="flex flex-1 flex-col items-center justify-center gap-2 text-center opacity-70">
              <Scan className="h-8 w-8 text-brand/60" />
              <p className="text-xs text-muted-foreground">
                A conversa com {scenario.contactName} aparecerá aqui.
              </p>
            </div>
          )}

          <AnimatePresence initial={false}>
            {scenario.messages.slice(0, visibleCount).map((msg, i) => {
              const mine = msg.author === "child";
              const isHighlight = highlightedMessageIds.includes(`m${i}`);
              return (
                <motion.div
                  key={`${scenario.id}-${i}`}
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={cn("flex w-full", mine ? "justify-end" : "justify-start")}
                >
                  <div className={cn("max-w-[80%]", mine && "items-end")}>
                    <div
                      className={cn(
                        "rounded-3xl px-3.5 py-2 text-[13px] leading-snug shadow-sm",
                        mine
                          ? "rounded-br-md bg-brand text-white"
                          : "rounded-bl-md border border-border bg-white text-foreground",
                        isHighlight && "ring-2 ring-red-500",
                      )}
                    >
                      {msg.text}
                      <span
                        className={cn(
                          "mt-1 block text-right text-[9px]",
                          mine ? "text-white/70" : "text-muted-foreground",
                        )}
                      >
                        {msg.time}
                      </span>
                    </div>
                    {isHighlight && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-1.5 flex items-center gap-1 self-start rounded-full bg-red-100 px-2 py-0.5 text-[10px] font-semibold text-red-600"
                      >
                        <span className="h-1.5 w-1.5 animate-alert-blink rounded-full bg-red-500" />
                        Possível risco identificado
                      </motion.div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          {/* Indicador de análise */}
          <AnimatePresence>
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="mx-auto mt-1 flex items-center gap-2 rounded-full border border-brand/20 bg-white px-3 py-1.5 shadow-md"
              >
                <Scan className="h-3.5 w-3.5 animate-pulse text-brand" />
                <span className="text-[10px] font-medium text-brand">
                  DIANA está analisando padrões…
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Linha de varredura durante a análise */}
        {analyzing && (
          <div className="pointer-events-none absolute inset-x-0 top-0 h-full overflow-hidden">
            <div className="h-16 w-full animate-scan-y bg-gradient-to-b from-transparent via-blue-400/15 to-transparent" />
          </div>
        )}
      </div>

      {/* Barra de entrada (simulada) */}
      <div className="flex shrink-0 items-center gap-2 border-t border-border bg-white px-3 py-2.5">
        <div className="flex flex-1 items-center rounded-full border border-input bg-muted px-3.5 py-2">
          <span className="text-[12px] text-muted-foreground">Mensagem</span>
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-md">
          <Smile className="h-5 w-5" />
        </div>
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand text-white shadow-md">
          <Mic className="h-5 w-5" />
        </div>
      </div>

      {/* Aviso de risco (banner discreto) */}
      <AnimatePresence>
        {(stage === "risk" || stage === "sending") && (
          <motion.div
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="absolute inset-x-2 bottom-16 z-10 flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50/95 px-3 py-2 shadow-lg backdrop-blur"
          >
            <AlertTriangle className="h-4 w-4 shrink-0 animate-alert-blink text-red-600" />
            <div className="text-[10px] leading-tight text-red-700">
              <p className="font-semibold">Alerta de segurança ativo</p>
              <p>O responsável já foi notificado sobre esta conversa.</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </PhoneFrame>
  );
}
