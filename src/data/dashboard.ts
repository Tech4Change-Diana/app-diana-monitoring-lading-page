import type { AlertItem } from "./types";

export const dashboardStats = [
  { id: "conversations", label: "Conversas analisadas", value: "128", hint: "+12 esta semana" },
  { id: "alerts-today", label: "Alertas hoje", value: "3", hint: "2 médios · 1 alto" },
  { id: "high-priority", label: "Alta prioridade", value: "1", hint: "requer atenção" },
  { id: "tracked", label: "Situações acompanhadas", value: "12", hint: "em monitoramento" },
] as const;

export const recentAlerts: AlertItem[] = [
  {
    id: "grm-001",
    title: "Possível grooming",
    child: "Caio",
    time: "Agora",
    priority: "alta",
    read: false,
    category: "Possível grooming / aliciamento",
  },
  {
    id: "cbl-002",
    title: "Cyberbullying",
    child: "Caio",
    time: "Ontem",
    priority: "media",
    read: true,
    category: "Cyberbullying",
  },
  {
    id: "pii-003",
    title: "Informação pessoal",
    child: "Caio",
    time: "Ontem",
    priority: "baixa",
    read: true,
    category: "Compartilhamento de informação pessoal",
  },
  {
    id: "iso-004",
    title: "Tentativa de isolamento",
    child: "Caio",
    time: "Seg",
    priority: "baixa",
    read: true,
    category: "Tentativa de isolamento",
  },
  {
    id: "scx-005",
    title: "Conteúdo potencialmente sexual",
    child: "Caio",
    time: "Dom",
    priority: "media",
    read: true,
    category: "Conteúdo potencialmente sexual",
  },
];

export const activityData = [
  { day: "Seg", mensagens: 82, alertas: 0 },
  { day: "Ter", mensagens: 104, alertas: 1 },
  { day: "Qua", mensagens: 71, alertas: 0 },
  { day: "Qui", mensagens: 128, alertas: 2 },
  { day: "Sex", mensagens: 96, alertas: 0 },
  { day: "Sáb", mensagens: 141, alertas: 1 },
  { day: "Dom", mensagens: 88, alertas: 0 },
];

export const settingsSections = [
  {
    id: "protecao",
    title: "Proteção",
    items: [
      { id: "alertas-alta", label: "Alertas de alta prioridade", description: "Notificações imediatas para riscos críticos", enabled: true },
      { id: "alertas-medios", label: "Alertas médios", description: "Notificações para riscos moderados", enabled: true },
      { id: "resumo-diario", label: "Resumo diário", description: "Resumo das análises enviado todos os dias", enabled: false },
    ],
  },
  {
    id: "privacidade",
    title: "Privacidade",
    items: [
      { id: "protecao-dados", label: "Proteção de dados", description: "Criptografia das conversas analisadas", enabled: true },
      { id: "controle-info", label: "Controle de informações", description: "Gerencie quais dados a DIANA utiliza", enabled: true },
      { id: "historico", label: "Histórico", description: "Guarda local de análises anteriores", enabled: false },
    ],
  },
  {
    id: "responsavel",
    title: "Responsável",
    items: [
      { id: "perfil", label: "Perfil", description: "Seus dados de conta e verificação", enabled: true },
      { id: "crianca", label: "Criança vinculada", description: "Caio · 10 anos · Proteção ativa", enabled: true },
      { id: "notificacoes", label: "Preferências de notificação", description: "Canais de alerta (push, e-mail, SMS)", enabled: true },
    ],
  },
];
