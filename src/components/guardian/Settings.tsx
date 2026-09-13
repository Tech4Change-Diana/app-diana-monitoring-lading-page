import { useState } from "react";
import { Settings, ChevronRight, ShieldCheck } from "lucide-react";
import { settingsSections } from "@/data/dashboard";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";

const linkIds = new Set(["perfil", "crianca", "notificacoes"]);

export function SettingsView() {
  const [enabled, setEnabled] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    settingsSections.forEach((section) =>
      section.items.forEach((item) => {
        init[item.id] = item.enabled;
      }),
    );
    return init;
  });

  return (
    <div className="flex flex-col gap-3 px-3.5 pt-3">
      <div className="flex items-center gap-2">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <Settings className="h-4 w-4" />
        </div>
        <div>
          <h1 className="text-lg font-extrabold tracking-tight text-foreground">Configurações</h1>
          <p className="text-[10px] text-muted-foreground">Preferências da conta</p>
        </div>
      </div>

      <div className="flex flex-col gap-3 pb-2">
        {settingsSections.map((section) => (
          <div
            key={section.id}
            className="rounded-2xl border border-border bg-white shadow-card"
          >
            <div className="flex items-center gap-1.5 border-b border-border px-3.5 py-2.5">
              <ShieldCheck className="h-3.5 w-3.5 text-brand" />
              <p className="text-[11px] font-bold text-foreground">{section.title}</p>
            </div>
            <div className="flex flex-col">
              {section.items.map((item, i) => {
                const isLink = linkIds.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-2.5",
                      i < section.items.length - 1 && "border-b border-border/60",
                    )}
                  >
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-semibold text-foreground">{item.label}</p>
                      <p className="text-[9px] text-muted-foreground">{item.description}</p>
                    </div>
                    {isLink ? (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Switch
                        checked={enabled[item.id]}
                        onCheckedChange={(v) => setEnabled((prev) => ({ ...prev, [item.id]: v }))}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <p className="pb-2 text-center text-[9px] text-muted-foreground/70">
        Protótipo demonstrativo · DIANA 2026
      </p>
    </div>
  );
}
