import { useState } from "react";
import { Home, Bell, ShieldCheck, Settings, ShieldAlert, type LucideIcon } from "lucide-react";
import { PhoneFrame } from "@/components/phone/PhoneFrame";
import { Dashboard } from "@/components/guardian/Dashboard";
import { AlertsList } from "@/components/guardian/AlertsList";
import { SafetyCenter } from "@/components/guardian/SafetyCenter";
import { SettingsView } from "@/components/guardian/Settings";
import { AlertDetail } from "@/components/guardian/AlertDetail";
import type { DemoScenario, GuardianTab } from "@/data/types";
import type { AnalysisResult } from "@/ml/types";
import { riskCategoryLabels } from "@/ml/types";
import { priorityTheme } from "@/components/shared/priorityTheme";
import { cn } from "@/lib/utils";

interface GuardianPhoneProps {
  scenario: DemoScenario;
  analysis: AnalysisResult | null;
  showAlertNotification: boolean;
  onViewAlert: () => void;
  alertDetailOpen: boolean;
  onCloseAlertDetail: () => void;
}

const tabs: { id: GuardianTab; label: string; icon: LucideIcon }[] = [
  { id: "home", label: "Início", icon: Home },
  { id: "alerts", label: "Alertas", icon: Bell },
  { id: "safety", label: "Segurança", icon: ShieldCheck },
  { id: "settings", label: "Configurações", icon: Settings },
];

export function GuardianPhone({
  scenario,
  analysis,
  showAlertNotification,
  onViewAlert,
  alertDetailOpen,
  onCloseAlertDetail,
}: GuardianPhoneProps) {
  const [tab, setTab] = useState<GuardianTab>("home");

  const activeTab: GuardianTab = alertDetailOpen ? "home" : tab;
  const theme = priorityTheme[analysis?.assessment.priority ?? "high"];
  const categoryLabel =
    analysis?.assessment.categories[0]?.category &&
    riskCategoryLabels[analysis.assessment.categories[0].category];

  return (
    <PhoneFrame screenClassName="bg-[#f6f7fb]">
      {/* App bar DIANA */}
      <div className="flex h-14 shrink-0 items-center justify-between bg-brand-gradient px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-xl bg-white">
            <img src="/diana-icon.png" alt="DIANA" className="h-7 w-7 object-contain" />
          </div>
          <span className="text-base font-extrabold tracking-tight text-white">DIANA</span>
        </div>
        <div className="relative">
          <Bell className="h-5 w-5 text-white/90" />
          {showAlertNotification && (
            <span
              className={`absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full ${theme.solidBg} text-[9px] font-bold text-white`}
            >
              1
            </span>
          )}
        </div>
      </div>

      {/* Conteúdo */}
      <div className="relative flex-1 overflow-hidden">
        {/* Notificação de alerta */}
        {showAlertNotification && (
          <div className="absolute inset-x-3 top-3 z-20 animate-fade-up">
            <div
              className={`overflow-hidden rounded-2xl border ${theme.softBorder} bg-white shadow-xl ${theme.shadow}`}
            >
              <div className={`flex items-center gap-2.5 ${theme.softBg} px-3.5 py-2`}>
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${theme.solidBg} text-white`}
                >
                  <ShieldAlert className="h-4 w-4" />
                </span>
                <div>
                  <p className={`text-xs font-bold ${theme.textStrong}`}>
                    DIANA · Novo alerta de segurança
                  </p>
                  <p className={`text-[10px] ${theme.textSoft}`}>Agora</p>
                </div>
              </div>
              <div className="px-3.5 py-2.5">
                <p className="text-[11px] leading-snug text-muted-foreground">
                  Identificamos uma possível situação de risco em uma conversa de{" "}
                  {scenario.childName}.
                </p>
                {categoryLabel && (
                  <p className={`mt-1 text-[10px] font-semibold ${theme.textSoft}`}>
                    {categoryLabel}
                  </p>
                )}
                <button
                  onClick={onViewAlert}
                  className={`mt-2.5 w-full rounded-xl ${theme.button} py-2.5 text-xs font-bold text-white shadow-sm transition`}
                >
                  Ver alerta
                </button>
              </div>
            </div>
          </div>
        )}

        {alertDetailOpen && analysis ? (
          <AlertDetail
            analysis={analysis}
            childName={scenario.childName}
            onBack={onCloseAlertDetail}
          />
        ) : (
          <div className="h-full overflow-y-auto pb-20 no-scrollbar">
            {activeTab === "home" && <Dashboard onViewAlerts={() => setTab("alerts")} />}
            {activeTab === "alerts" && <AlertsList />}
            {activeTab === "safety" && <SafetyCenter />}
            {activeTab === "settings" && <SettingsView />}
          </div>
        )}
      </div>

      {/* Navegação inferior */}
      <div className="absolute inset-x-0 bottom-0 z-10 flex items-center justify-around border-t border-border bg-white/95 px-2 pb-5 pt-1.5 backdrop-blur">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={cn(
                "relative flex flex-col items-center gap-0.5 rounded-xl px-3 py-1 text-[9px] font-medium transition",
                active ? "text-brand" : "text-muted-foreground",
              )}
            >
              {id === "alerts" && showAlertNotification && !active && (
                <span
                  className={`absolute right-1 top-0 h-1.5 w-1.5 rounded-full ${theme.dot}`}
                />
              )}
              <Icon className="h-5 w-5" />
              {label}
            </button>
          );
        })}
      </div>
    </PhoneFrame>
  );
}
