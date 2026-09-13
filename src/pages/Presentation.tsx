import { AnimatePresence } from "framer-motion";
import { ShieldCheck, Smartphone } from "lucide-react";
import { useDemoSequence } from "@/hooks/useDemoSequence";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import { ChildPhone } from "@/components/child/ChildPhone";
import { GuardianPhone } from "@/components/guardian/GuardianPhone";
import { FlowCenter } from "@/components/presentation/FlowCenter";
import { AlertOverlay } from "@/components/presentation/AlertOverlay";
import { DemoControls } from "@/components/presentation/DemoControls";

export default function Presentation() {
  const demo = useDemoSequence();
  const mobile = useMediaQuery("(max-width: 1023px)");

  return (
    <div className="bg-hero min-h-full overflow-hidden text-white">
      <div className="relative mx-auto flex w-full max-w-6xl flex-col items-center px-4 pb-12 pt-6 sm:px-6">
        {/* Header da marca */}
        <header className="flex w-full flex-col items-center gap-3 sm:flex-row sm:justify-between">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-brand ring-1 ring-black/5">
              <img src="/diana-icon.png" alt="DIANA" className="h-9 w-9 object-contain" />
            </div>
            <div className="leading-tight">
              <p className="text-xl font-extrabold tracking-tight">DIANA</p>
              <p className="text-[11px] text-white/80">Inteligência para ajudar a proteger.</p>
            </div>
          </div>
        </header>

        {/* Título */}
        <div className="mt-8 flex flex-col items-center text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
            Conversa → Análise → Detecção → Orientação → Alerta
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/80">
            Acompanhe em tempo real como a DIANA identifica um comportamento potencialmente perigoso
            em uma conversa, avisa o responsável e explica exatamente por que aquele alerta aconteceu.
          </p>
        </div>

        {/* Controles */}
        <div className="mt-7 w-full">
          <DemoControls
            stage={demo.stage}
            scenarioId={demo.scenarioId}
            onSelectScenario={demo.changeScenario}
            onStart={demo.start}
            onReset={demo.reset}
          />
        </div>

        {/* Os dois celulares */}
        <div className="mt-9 flex w-full flex-col items-center justify-center gap-6 lg:flex-row lg:items-stretch lg:gap-7">
          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/80">
              <Smartphone className="h-3.5 w-3.5" />
              Celular da Criança
            </div>
            <ChildPhone
              scenario={demo.scenario}
              stage={demo.stage}
              visibleCount={demo.visibleCount}
              highlightedMessageIds={demo.highlightedMessageIds}
            />
          </div>

          <div className="flex w-full max-w-56 items-center justify-center lg:w-44 lg:flex-1">
            <FlowCenter
              stage={demo.stage}
              scenario={demo.scenario}
              mobile={mobile}
              analysis={demo.analysis}
            />
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-white/80">
              <ShieldCheck className="h-3.5 w-3.5 text-white/90" />
              Celular do Responsável
            </div>
            <GuardianPhone
              scenario={demo.scenario}
              analysis={demo.analysis}
              showAlertNotification={demo.guardianAlertVisible}
              onViewAlert={demo.viewAlert}
              alertDetailOpen={demo.alertDetailOpen}
              onCloseAlertDetail={demo.closeAlertDetail}
            />
          </div>
        </div>

        {/* Rodapé */}
        <footer className="mt-14 flex flex-col items-center gap-1 text-center">
          <p className="text-sm font-bold text-white">
            DIANA está protegendo o que importa.
          </p>
          <p className="text-[11px] text-white/70">
            Protótipo demonstrativo · Pipeline de análise simulado (MOCK) · 2026
          </p>
        </footer>
      </div>

      {/* Overlay de detecção */}
      <AnimatePresence>
        {demo.riskOverlay && (
          <AlertOverlay open scenario={demo.scenario} analysis={demo.analysis} />
        )}
      </AnimatePresence>
    </div>
  );
}
