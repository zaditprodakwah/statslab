export type TabType = 
  | 'overview' 
  | 'tasks' 
  | 'validation' 
  | 'sus' 
  | 'instruments'
  | 'psychometrics'
  | 'downloads'
  | 'references' 
  | 'glossary' 
  | 'guide';

export type ItemStatus = 'resmi_proposal' | 'usulan_revisi' | 'tambahan_ahli';

export interface TaskData {
  id: string;
  shortName: string;
  title: string;
  watsonLevel: string;
  gaisePhase: string;
  islamicValue: string;
  islamicPrinciple: string;
  indicator: string;
  context: string;
  question: string;
  interactiveFeature: string;
  mathConcept: string;
  defaultAnswer?: number | string;
  status: ItemStatus;
  statusNote?: string;
  tableRef?: string;
  rubric: {
    2: string;
    1: string;
    0: string;
  };
  sampleSolution: string;
}

export interface ValidationItem {
  id: string;
  statement: string;
  indicator: string;
  r1: number;
  r2: number;
  r3: number;
  status: ItemStatus;
  statusNote?: string;
  aspect?: string;
  tableRef?: string;
}

export interface SUSItem {
  id: number;
  text: string;
  score: number;
  isPositive: boolean;
  dimension: string;
  status: ItemStatus;
  statusNote?: string;
  tableRef?: string;
}

export interface ReferenceItem {
  id: string;
  tag: string;
  authors: string;
  year: string;
  title: string;
  source: string;
  doi?: string;
  formattedHtml: string;
  plainText: string;
  category: 'Metodologi' | 'Statistika' | 'Pendidikan Islam' | 'Cognitive Load';
}

export interface GlossaryItem {
  term: string;
  arabic?: string;
  definition: string;
  relevance: string;
  category: 'Statistika' | 'Keislaman' | 'Psikometri' | 'Media';
}
