import { motion } from "framer-motion";
import { ShieldAlert, AlertTriangle, ScanSearch } from "lucide-react";
import type { DemoScenario } from "@/data/types";
import type { AnalysisResult, RiskPriority } from "@/ml/types";
import { riskCategoryLabels } from "@/ml/types";
import { Badge } from "@/components/ui/badge";
import { priorityTheme } from "@/components/shared/priorityTheme";

interface AlertOverlayProps {
  open: boolean;
  scenario: DemoScenario;
  analysis: AnalysisResult | null;
}

const badgeVariant: Record<RiskPriority, "high" | "medium" | "low"> = {
  high: "high",
  medium: "medium",
  low: "low",
};

export function AlertOverlay({ open, scenario, analysis }: AlertOverlayProps) {
  const priority: RiskPriority = analysis?.assessment.priority ?? "high";
  const theme = priorityTheme[priority];
  const category =
    analysis?.assessment.categories[0]?.category &&
    riskCategoryLabels[analysis.assessment.categories[0].category];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: open ? 1 : 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.25 }}
      className="pointer-events-none fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.85, y: 20, opacity: 0 }}
        animate={{ scale: open ? 1 : 0.9, y: open ? 0 : 16, opacity: open ? 1 : 0 }}
        exit={{ scale: 0.9, y: 16, opacity: 0 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
        className="w-full max-w-sm rounded-3xl border border-border bg-white p-6 text-center shadow-2xl"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-brand ring-1 ring-black/5">
          <img src="/diana-icon.png" alt="DIANA" className="h-12 w-12 object-contain" />
        </div>
        <p className="mt-3 text-xs font-extrabold uppercase tracking-[0.25em] text-brand">
          DIANA
        </p>
        <h3 className="mt-2 text-lg font-extrabold leading-tight text-foreground">
          Possível situação de risco identificada.
        </h3>

        <div
          className={`relative mt-4 flex items-center justify-center gap-2.5 rounded-2xl border-2 ${theme.softBorder} ${theme.softBg} px-4 py-3`}
        >
          <AlertTriangle
            className={`h-5 w-5 shrink-0 animate-alert-blink ${theme.textSoft}`}
          />
          <div>
            <p
              className={`text-xs font-extrabold uppercase tracking-wide ${theme.textStrong}`}
            >
              {theme.label}
            </p>
            <p className={`text-[11px] ${theme.textSoft}`}>Análise automatizada concluída</p>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-center gap-2">
          <Badge variant={badgeVariant[priority]}>{theme.label}</Badge>
          <span className="rounded-full bg-muted px-3 py-1 text-[11px] font-semibold text-foreground">
            {category ?? scenario.category}
          </span>
        </div>

        <div className="mt-4 flex items-center justify-center gap-1.5 text-[10px] text-muted-foreground">
          <ScanSearch className="h-3.5 w-3.5 text-brand" />
          A DIANA está notificando o responsável…
        </div>
      </motion.div>
    </motion.div>
  );
}
