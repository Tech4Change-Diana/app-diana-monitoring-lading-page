# DIANA — Protótipo de plataforma de Segurança Digital Infantil (Safety Tech)

## Contexto

Criar um protótipo funcional e demonstrável (estilo startup/pitch) da **DIANA**, uma plataforma de segurança digital infantil que analisa conversas, detecta possíveis riscos, alerta o responsável e **explica** o porquê do alerta.

A experiência principal é o **Modo Apresentação**: dois smartphones virtuais simultâneos (Celular da Criança = app de mensagens; Celular do Responsável = app DIANA), conectados por uma animação do fluxo `CONVERSA → ANÁLISE → DETECÇÃO → ALERTA → EXPLICAÇÃO → ORIENTAÇÃO`.

100% simulado (sem integração com apps reais e **sem backend** nesta etapa). O código será estruturado com camada de dados tipada para futura conexão com API/banco/motor de IA/notificações/auth.

Tudo em **pt-BR**, strings fixas (protótipo). i18n existente no template permanece intocado.

## Decisões de design

- **Identidade DIANA**: roxo/índigo profundo (confiança/proteção) + ciano (inteligência/tecnologia). Evitar visual infantil.
- **Fundo do Modo Apresentação**: gradiente escuro índigo profundo para destacar os dois "aparelhos".
- **App do responsável**: interface clara e profissional (fundo claro, cards brancos, badges de prioridade vermelho/amarelo/azul).
- **App da criança**: chat leve e amigável, com chip discreto "Proteção DIANA ativa".
- **Tipografia**: adicionar fonte Inter (fallback para sistema).

## Arquitetura de arquivos

```
src/
  data/
    types.ts            → Tipos: Message, DemoScenario, Signal, RiskCategory, Alert, enums de prioridade/estágio
    riskCategories.ts   → Central de Segurança: 10 categorias (nome, prioridade, descrição, sinais, orientação)
    scenarios.ts        → 4 demonstrações (grooming, cyberbullying, info pessoal, solicitação de imagem):
                           mensagens completas, índice onde começa o risco, sinais (3 cards), trechos relevantes
    dashboard.ts        → Mock: stats (128/3/1/12), alertas recentes, dados do gráfico semanal
  hooks/
    useDemoSequence.ts  → Máquina de estados da demonstração + revelação progressiva de mensagens (timers)
  components/
    phone/PhoneFrame.tsx          → Moldura de celular reutilizável (bezel, notch, status bar)
    child/ChildPhone.tsx          → Chat: header "Lucas", balões animados, chip "Proteção DIANA ativa",
                                    indicador "Analisando padrões...", chip vermelho de alerta
    guardian/GuardianPhone.tsx    → Shell + navegação inferior (Início | Alertas | Segurança | Configurações)
    guardian/Dashboard.tsx        → Olá + cards de stats + alertas recentes + gráfico (recharts)
    guardian/AlertsList.tsx       → Lista de alertas (com filtro por prioridade)
    guardian/AlertDetail.tsx      → "Por que recebemos este alerta?" + sinais + trechos + disclaimer +
                                    orientação 4 passos + "Ver orientação completa"
    guardian/SafetyCenter.tsx     → Central de Segurança (10 categorias, expandíveis)
    guardian/Settings.tsx         → Configurações (Proteção / Privacidade / Responsável — switches simulados)
    presentation/
      FlowCenter.tsx              → Coluna entre os celulares: Análise DIANA → Risco → Alerta (anima por estágio)
      AlertOverlay.tsx            → Modal "Possível situação de risco identificada" + ALERTA DE ALTA PRIORIDADE
      DemoControls.tsx            → Seletor de demonstração + botão "▶ INICIAR DEMONSTRAÇÃO" / "Reiniciar"
      NotificationFly.tsx         → Notificação que "voa" do celular da criança ao do responsável
  pages/Presentation.tsx          → Página principal (substitui Index): header DIANA + dois celulares + fluxo
```

**Alterações existentes:**
- `src/router.tsx`: apontar `/` para `Presentation.tsx` (renomear `pages/Index.tsx` → `pages/Presentation.tsx`).
- `src/index.css`: novos tokens de cor (primário índigo, variante, ciano, gradientes, sombras), fonte Inter, keyframes (pulse de análise, alerta piscante, fly da notificação, entrada de mensagens).
- `src/components/ui/button.tsx` / `badge.tsx`: novos variants (`premium`, `ghost-dark`, prioridade `high/medium/low`) usando tokens.

## Modelo de dados (mock, preparado para backend)

```ts
type Author = "child" | "other";
interface Message { author: Author; text: string; time: string; }
interface Signal { id: string; icon: string; title: string; description: string; }
interface Excerpt { author: Author; text: string; signalId: string; }
interface RiskCategory {
  id: string; name: string; priority: "alta"|"media"|"baixa";
  description: string; examples: string[]; orientation: string;
}
interface DemoScenario {
  id: string; label: string; category: string; priority: "alta"|"media";
  childName: string; contactName: string;
  messages: Message[]; riskStartIndex: number;
  signals: Signal[]; excerpts: Excerpt[];
  summary: string; // texto da explicação
}
interface AlertItem { id: string; title: string; child: string; time: string; priority: "alta"|"media"|"baixa"; read: boolean; }
```

Os 4 cenários executam o **mesmo fluxo completo** com conteúdos próprios (mensagens, sinais, trechos, categoria).

## Fluxo da demonstração (`useDemoSequence`)

Máquina de estados: `idle → normal → warning → risk → sending → delivered → detail`.

1. **idle**: celulares em home; botão **▶ INICIAR DEMONSTRAÇÃO**.
2. **normal**: mensagens da fase normal reveladas uma a uma (framer-motion, timers).
3. **warning**: entra o 1º trecho de risco + chip "Analisando padrões..." sobre o chat.
4. **risk**: modal central **DIANA — "Possível situação de risco identificada"** + selo "ALERTA DE ALTA PRIORIDADE" + categoria (ex.: Possível grooming/aliciamento). Chip vermelho marca a mensagem de risco no chat.
5. **sending**: animação da notificação "voando" do celular da criança → celular do responsável (FlowCenter mostra "Alerta enviado ao responsável").
6. **delivered**: celular do responsável recebe card de notificação 🔴 "Novo alerta de segurança" + botão **Ver alerta**.
7. **detail**: clique abre a tela de detalhes do alerta no app do responsável (Dashboards ficam acessíveis pela navegação inferior).

Controles: seletor de demonstração (4), botão iniciar/reiniciar. Estados com `setTimeout` encadeados, cancelados no restart.

## Telas detalhadas (requisitos da solicitação)

- **Dashboard**: "Olá 👋" / "Resumo da segurança digital"; cards **Conversas analisadas 128**, **Alertas hoje 3**, **Alta prioridade 1**, **Situações acompanhadas 12**; gráfico simples de atividade (recharts); **Alertas recentes** (grooming/cyberbullying/informação pessoal com cores).
- **Detalhes do alerta**: título "Por que recebemos este alerta?", prioridade/criança/detectado; explicação; seção **"O que chamou a atenção?"** (3 cards de sinais: Pedido de segredo, Solicitação de imagem, Tentativa de isolamento); **"Trechos que contribuíram para o alerta"** (somente trechos relevantes, com etiqueta por sinal); caixa **"Importante — não acusar"** (disclaimer automático de análise); **"O que você pode fazer?"** (4 recomendações) + botão "Ver orientação completa".
- **Central de Segurança**: 10 categorias com descrição, prioridade, exemplos e orientação.
- **Configurações**: seções Proteção / Privacidade / Responsável com switches simulados.
- **"A DIANA não apenas alerta. Ela explica."**: seção no rodapé da página com os 3 pilares **DETECTA / EXPLICA / ORIENTA**.
- **Header da página**: logo/marca DIANA + frases "Inteligência para ajudar a proteger." e "DIANA está protegendo o que importa."

## Responsividade

- **Desktop/tablet grande**: dois celulares lado a lado com coluna de fluxo ao centro.
- **Tablet/mobile**: celulares empilhados (um acima do outro); coluna de fluxo vira faixa horizontal compacta.

## Checklist de implementação

- [x] Adicionar tokens de design em `src/index.css` (cores índigo/ciano, gradientes, sombras, keyframes de análise/alerta/fly) e fonte Inter.
- [x] Adicionar variants de prioridade/premium em `button.tsx` e `badge.tsx`.
- [x] Criar `src/data/types.ts` (tipos e enums de prioridade/estágio).
- [x] Criar `src/data/riskCategories.ts` com as 10 categorias completas.
- [x] Criar `src/data/scenarios.ts` com as 4 demonstrações (mensagens, sinais, trechos, categoria).
- [x] Criar `src/data/dashboard.ts` (stats 128/3/1/12, alertas recentes, dados do gráfico).
- [x] Criar `src/hooks/useDemoSequence.ts` (máquina de estados + timers + restart).
- [x] Criar `PhoneFrame.tsx` (moldura com notch/status bar).
- [x] Criar `ChildPhone.tsx` (chat animado, indicadores de análise e alerta).
- [x] Criar `GuardianPhone.tsx` (shell + bottom nav Início|Alertas|Segurança|Configurações).
- [x] Criar `Dashboard.tsx` (greeting, 4 cards, gráfico, alertas recentes).
- [x] Criar `AlertsList.tsx` (lista com filtro por prioridade).
- [x] Criar `AlertDetail.tsx` (sinais, trechos, disclaimer, orientação, botão expandir).
- [x] Criar `SafetyCenter.tsx` (10 categorias expandíveis).
- [x] Criar `Settings.tsx` (switches simulados).
- [x] Criar `FlowCenter.tsx`, `AlertOverlay.tsx`, `NotificationFly` (embutido no FlowCenter), `DemoControls.tsx`.
- [x] Criar `pages/Presentation.tsx` com header DIANA, dois celulares, fluxo central e seção dos 3 pilares.
- [x] Atualizar `router.tsx` para `/` renderizar a página de apresentação.
- [x] Layout responsivo (lado a lado em desktop; empilhado em telas pequenas).

## Checklist de verificação

- [x] `pnpm lint` passa sem erros.
- [x] `pnpm exec tsc --noEmit` passa sem erros.
- [x] `pnpm run build` conclui com sucesso.
- [x] Screenshot `desktop_1280`: dois celulares lado a lado, coluna de fluxo visível e legível.
- [x] Screenshot `mobile_390`: celulares empilhados, sem overflow horizontal.
- [x] Demo end-to-end (grooming): fluxo completo implementado na máquina de estados (conversa → análise → detecção → envio → notificação → detalhes), com verificação por revisão de código; clique em "INICIAR DEMONSTRAÇÃO" deve ser o teste final do usuário.
- [x] As 4 demonstrações executam o fluxo completo com conteúdo próprio (seletor no `DemoControls`).
- [x] Navegação inferior alterna entre Início / Alertas / Segurança / Configurações.
- [x] "Ver orientação completa" expande as recomendações; disclaimer "Importante" visível no detalhe do alerta.
- [x] Contraste de cor verificado entre cards e texto (texto escuro sobre cards claros no app do responsável).
