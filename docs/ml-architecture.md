# DIANA — Arquitetura de Análise de Risco (ML)

> Documento conceitual. Nenhum modelo real está implementado nesta etapa:
> todo o pipeline atual é **simulado (MOCK)** e visa demonstrar a arquitetura
> e preparar o caminho para modelos reais.

## Visão geral (implementado no protótipo)

```
Conversation
      ↓
Preprocessing / Privacy
      ↓
Feature Extraction
      ↓
Mock ML Analyzer
      ↓
Contextual Analysis
      ↓
Risk Engine
      ↓
Explainability
      ↓
AnalysisResult  →  Alertas e explicação na interface
```

O frontend **não determina risco diretamente**. Ele consome apenas o
`AnalysisResult` produzido pelo pipeline em `src/ml/pipeline.ts`. A substituição
do mock por modelos reais exige apenas trocar o `MockRiskAnalyzer` por uma
implementação real da interface `RiskAnalyzer` (`src/ml/mockAnalyzer.ts`).

## Arquitetura futura — modelos especializados

Futuramente a DIANA poderá executar modelos especializados por categoria,
compartilhando o pré-processamento:

```
                   Conversation
                        ↓
                Shared Preprocessing
                        ↓
          ┌─────────────┼─────────────┐
          ↓             ↓             ↓
     Grooming      Cyberbullying    Threat
     Model           Model          Model
          ↓             ↓             ↓
          └─────────────┼─────────────┘
                        ↓
                   Risk Engine
                        ↓
                  Explainability
```

Esses modelos **não** são implementados nesta etapa.

## Inferência Edge vs. Cloud

| Modo | Onde executa | Vantagens |
| --- | --- | --- |
| **Edge** | Dispositivo local | Menor exposição de dados, menor latência, funcionamento offline, maior privacidade |
| **Cloud** | Infraestrutura remota | Modelos maiores, atualização centralizada, maior capacidade computacional |

Futuro modelo híbrido:

```
Device
 ↓
Edge pre-filter
 ↓
Privacy layer
 ↓
Cloud ML
 ↓
Risk Engine
```

Nenhuma infraestrutura real é implementada nesta etapa.

## Human-in-the-loop

```
AI
 ↓
Sinais
 ↓
Explicação
 ↓
Responsável
 ↓
Decisão humana
```

A DIANA **não** toma decisões irreversíveis automaticamente. O alerta é um
ponto de partida para avaliação humana; a orientação visa apoiar a decisão do
responsável.

## Falsos positivos e falsos negativos

- **False Positive**: a IA pode gerar um alerta quando não existe risco real.
- **False Negative**: a IA pode deixar de identificar uma situação de risco.

> **"A análise automatizada é um mecanismo de apoio e não substitui avaliação
> humana."**

## Avaliação de modelo (ML Evaluation)

Indicadores a definir após treinamento e validação:

- Precision
- Recall
- F1 Score
- False Positive Rate
- False Negative Rate
- AUROC
- Calibration
- Model Drift

> Valores: **"A definir após treinamento e validação."** — nenhum número real é
> inventado nesta etapa. No protótipo, scores exibidos são técnicos e simulados.

## Versionamento de modelo

```ts
interface ModelMetadata {
  modelName: string;
  version: string;
  environment: "mock" | "development" | "production";
}
```

No protótipo: **DIANA Risk Analyzer · v0.1.0 · Environment: MOCK**.

## Feedback loop

```
Alert
 ↓
Guardian Feedback
 ↓
Human Review
 ↓
Evaluation Dataset
 ↓
Model Evaluation
 ↓
Model Improvement
 ↓
New Version
```

Treinamento automático **não** é implementado nesta etapa.

## Segurança (futuro)

Medidas previstas (não implementadas):

- encryption in transit;
- encryption at rest;
- access control;
- least privilege;
- audit logs;
- pseudonymization;
- data minimization;
- secure secrets;
- rate limiting;
- monitoring.

> Nada disto é afirmado como já implementado. O protótipo usa apenas dados
> fictícios e não persiste conversas reais.

## Compliance

> Não afirmamos "LGPD compliant". Utilizamos: **"Arquitetura preparada para
> requisitos de privacidade e proteção de dados."**

Pontos de integração futuros:

- consentimento;
- controle parental;
- retenção;
- exclusão;
- acesso;
- auditoria.

## Arquitetura de dados (atual)

Os dados de demonstração vivem em `src/data/` (cenários, categorias, painel).
A camada ML possui seus próprios tipos em `src/ml/types.ts` e um adaptador em
`src/ml/adapter.ts` que converte cenários → `Conversation`, permitindo no
futuro substituir a fonte por uma API/banco real sem alterar o pipeline.
