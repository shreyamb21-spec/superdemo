export interface Champion {
  name: string;
  role: string;
  evidence: string;
}

export interface Workflow {
  id: string;
  name: string;
  department: string;
  pain: string;
  people: string[];
  systems: string[];
  champion: Champion | null;
  evidence_quote: string;
}

export interface Stage1Output {
  customer_context: string;
  workflows: Workflow[];
}

export interface Scores {
  impact: number;
  data_readiness: number;
  governance_simplicity: number;
  champion_strength: number;
  overall: number;
}

export interface Rationales {
  impact: string;
  data_readiness: string;
  governance_simplicity: string;
  champion_strength: string;
}

export interface ScoredWorkflow {
  id: string;
  scores: Scores;
  rationales: Rationales;
}

export interface RolloutPhase {
  phase: string;
  items: string[];
  champion_moves: string;
  proof_metric: string;
}

export interface Stage2Output {
  scored: ScoredWorkflow[];
  rollout: RolloutPhase[];
}

export interface Integration {
  integration: string;
  shared_to_group: string;
  access_level: string;
  why: string;
}

export interface RbacNote {
  role: string;
  who: string;
  why: string;
}

export interface KnowledgeFile {
  filename: string;
  level: string;
  body: string;
}

export interface Metric {
  metric: string;
  target: string;
  how_measured: string;
}

export interface Stage3Output {
  use_case_id: string;
  clark_prompt: string;
  integrations: Integration[];
  rbac_notes: RbacNote[];
  knowledge_files: KnowledgeFile[];
  metrics: Metric[];
}

export interface PipelineResult {
  stage1: Stage1Output;
  stage2: Stage2Output;
  stage3: Stage3Output;
}

export interface Persona {
  id: string;
  name: string;
  cardCopy: string;
  material: string;
}
