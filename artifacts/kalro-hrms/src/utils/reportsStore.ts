const LS_KEY_TECH = "kalro_technical_reports_v1";
const LS_KEY_FIN = "kalro_financial_reports_v1";

type Listener = () => void;
const listeners = new Set<Listener>();

export type TechStatus = "Approved" | "Under Review" | "Draft" | "Submitted";
export type FinStatus = "Approved" | "Under Review" | "Draft" | "Rejected";

export interface TechnicalReport {
  id: string;
  project: string;
  quarter: string;
  submitted: string;
  category: string;
  progress: string;
  status: TechStatus;
  formData?: ReportFormData;
}

export interface FinancialReport {
  id: string;
  project: string;
  quarter: string;
  submitted: string;
  budget: string;
  utilized: string;
  rate: string;
  status: FinStatus;
}

export interface ActivityRow {
  id: string;
  output: string;
  activity: string;
  achievement: string;
}

export interface ReportFormData {
  quarter: string;
  financialYear: string;
  sourceOfFund: string;
  donor: string;
  project: string;
  subComponent: string;
  valueChain: string;
  projectTitle: string;
  keyResultArea: string;
  strategicObjective: string;
  strategies: string;
  startDate: string;
  endDate: string;
  duration: string;
  leadInstitute: string;
  principalInvestigator: string;
  coPrincipalInvestigator: string;
  address: string;
  email: string;
  telephone: string;
  countiesTargeted: string;
  subCounty: string;
  ward: string;
  numberOfBeneficiaries: string;
  women: string;
  youths: string;
  vmgs: string;
  pwds: string;
  activities: ActivityRow[];
  expectedOutcomes: string;
  achievements: string;
  sustainabilityMeasures: string;
  fundsAllocated: number;
  fundsReceived: number;
  fundsUtilized: number;
  challenges: string;
  lessonsLearned: string;
  recommendations: string;
  wayForward: string;
}

const SEED_TECH: TechnicalReport[] = [
  { id: "TR-2025-001", project: "Climate-Smart Agriculture Initiative", quarter: "Q1 FY2025/26", submitted: "Oct 15, 2025", category: "Research", progress: "75%", status: "Approved" },
  { id: "TR-2025-002", project: "Drought-Tolerant Crops Program", quarter: "Q1 FY2025/26", submitted: "Oct 18, 2025", category: "Development", progress: "60%", status: "Under Review" },
  { id: "TR-2025-003", project: "Livestock Value Chain Improvement", quarter: "Q2 FY2025/26", submitted: "Jan 12, 2026", category: "Innovation", progress: "88%", status: "Draft" },
  { id: "TR-2025-004", project: "Irrigation Systems Enhancement", quarter: "Q2 FY2025/26", submitted: "Jan 14, 2026", category: "Infrastructure", progress: "92%", status: "Submitted" },
  { id: "TR-2025-005", project: "Post-Harvest Loss Reduction", quarter: "Q3 FY2025/26", submitted: "Apr 8, 2026", category: "Research", progress: "45%", status: "Approved" },
  { id: "TR-2025-006", project: "Market Access Program", quarter: "Q3 FY2025/26", submitted: "Apr 11, 2026", category: "Capacity Building", progress: "68%", status: "Under Review" },
];

const SEED_FIN: FinancialReport[] = [
  { id: "FR-2025-001", project: "Climate-Smart Agriculture Initiative", quarter: "Q1 FY2025/26", submitted: "Oct 15, 2025", budget: "KES 24.5M", utilized: "KES 18.2M", rate: "74.3%", status: "Approved" },
  { id: "FR-2025-002", project: "Drought-Tolerant Crops Program", quarter: "Q1 FY2025/26", submitted: "Oct 18, 2025", budget: "KES 18.0M", utilized: "KES 12.6M", rate: "70.0%", status: "Under Review" },
  { id: "FR-2025-003", project: "Livestock Value Chain Improvement", quarter: "Q2 FY2025/26", submitted: "Jan 12, 2026", budget: "KES 32.1M", utilized: "KES 28.7M", rate: "89.4%", status: "Draft" },
  { id: "FR-2025-004", project: "Irrigation Systems Enhancement", quarter: "Q2 FY2025/26", submitted: "Jan 14, 2026", budget: "KES 45.8M", utilized: "KES 41.2M", rate: "89.9%", status: "Approved" },
  { id: "FR-2025-005", project: "Post-Harvest Loss Reduction", quarter: "Q3 FY2025/26", submitted: "Apr 8, 2026", budget: "KES 12.4M", utilized: "KES 9.1M", rate: "73.4%", status: "Rejected" },
  { id: "FR-2025-006", project: "Market Access Program", quarter: "Q3 FY2025/26", submitted: "Apr 11, 2026", budget: "KES 8.6M", utilized: "KES 7.3M", rate: "84.9%", status: "Under Review" },
];

function loadTech(): TechnicalReport[] {
  try {
    const raw = localStorage.getItem(LS_KEY_TECH);
    if (raw) return JSON.parse(raw) as TechnicalReport[];
  } catch {}
  return SEED_TECH;
}

function loadFin(): FinancialReport[] {
  try {
    const raw = localStorage.getItem(LS_KEY_FIN);
    if (raw) return JSON.parse(raw) as FinancialReport[];
  } catch {}
  return SEED_FIN;
}

function saveTech(data: TechnicalReport[]): void {
  try { localStorage.setItem(LS_KEY_TECH, JSON.stringify(data)); } catch {}
}

function saveFin(data: FinancialReport[]): void {
  try { localStorage.setItem(LS_KEY_FIN, JSON.stringify(data)); } catch {}
}

let techReports = loadTech();
let finReports = loadFin();

export function getTechnicalReports(): TechnicalReport[] {
  return techReports;
}

export function getFinancialReports(): FinancialReport[] {
  return finReports;
}

function nextTechId(): string {
  const nums = techReports.map((r) => parseInt(r.id.replace(/\D/g, ""), 10)).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `TR-2025-${String(next).padStart(3, "0")}`;
}

function nextFinId(): string {
  const nums = finReports.map((r) => parseInt(r.id.replace(/\D/g, ""), 10)).filter(Boolean);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `FR-2025-${String(next).padStart(3, "0")}`;
}

export function addTechnicalReport(data: ReportFormData, isDraft: boolean): TechnicalReport {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const report: TechnicalReport = {
    id: nextTechId(),
    project: data.projectTitle || data.project || "Untitled Project",
    quarter: data.quarter || "—",
    submitted: now,
    category: data.valueChain || "General",
    progress: "0%",
    status: isDraft ? "Draft" : "Submitted",
    formData: data,
  };
  techReports = [...techReports, report];
  saveTech(techReports);
  listeners.forEach((l) => l());
  return report;
}

export function addFinancialReport(data: ReportFormData): FinancialReport {
  const now = new Date().toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const allocated = data.fundsAllocated || 0;
  const utilized = data.fundsUtilized || 0;
  const rate = allocated > 0 ? ((utilized / allocated) * 100).toFixed(1) + "%" : "0.0%";
  const report: FinancialReport = {
    id: nextFinId(),
    project: data.projectTitle || data.project || "Untitled Project",
    quarter: data.quarter || "—",
    submitted: now,
    budget: allocated > 0 ? `KES ${(allocated / 1_000_000).toFixed(1)}M` : "—",
    utilized: utilized > 0 ? `KES ${(utilized / 1_000_000).toFixed(1)}M` : "—",
    rate,
    status: "Submitted" as unknown as FinStatus,
  };
  finReports = [...finReports, report];
  saveFin(finReports);
  listeners.forEach((l) => l());
  return report;
}

export function subscribe(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
