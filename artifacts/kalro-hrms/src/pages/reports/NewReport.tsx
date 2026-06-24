import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ChevronRight, Plus, Trash2, Upload, X } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import * as reportsStore from "@/utils/reportsStore";
import type { ActivityRow, ReportFormData } from "@/utils/reportsStore";

interface FieldProps {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}

function Field({ label, value, onChange, placeholder, type = "text" }: FieldProps) {
  return (
    <div className="space-y-1.5">
      <Label className="text-xs font-medium">{label}</Label>
      <Input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </div>
  );
}

interface SectionProps {
  index: number;
  title: string;
  children: React.ReactNode;
}

function Section({ index, title, children }: SectionProps) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-[var(--brand-green)] text-xs font-bold text-white">
            {index}
          </span>
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

const EMPTY_FORM: Omit<ReportFormData, "activities" | "fundsAllocated" | "fundsReceived" | "fundsUtilized"> = {
  quarter: "",
  financialYear: "",
  sourceOfFund: "",
  donor: "",
  project: "",
  subComponent: "",
  valueChain: "",
  projectTitle: "",
  keyResultArea: "",
  strategicObjective: "",
  strategies: "",
  startDate: "",
  endDate: "",
  duration: "",
  leadInstitute: "",
  principalInvestigator: "",
  coPrincipalInvestigator: "",
  address: "",
  email: "",
  telephone: "",
  countiesTargeted: "",
  subCounty: "",
  ward: "",
  numberOfBeneficiaries: "",
  women: "",
  youths: "",
  vmgs: "",
  pwds: "",
  expectedOutcomes: "",
  achievements: "",
  sustainabilityMeasures: "",
  challenges: "",
  lessonsLearned: "",
  recommendations: "",
  wayForward: "",
};

export default function NewReport() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [activities, setActivities] = useState<ActivityRow[]>([
    { id: crypto.randomUUID(), output: "", activity: "", achievement: "" },
  ]);
  const [allocated, setAllocated] = useState(0);
  const [received, setReceived] = useState(0);
  const [utilized, setUtilized] = useState(0);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const set = (k: keyof typeof EMPTY_FORM, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const absorbed = useMemo(
    () => (received > 0 ? ((utilized / received) * 100).toFixed(1) : "0.0"),
    [received, utilized],
  );

  const buildFormData = (): ReportFormData => ({
    ...form,
    activities,
    fundsAllocated: allocated,
    fundsReceived: received,
    fundsUtilized: utilized,
  });

  const addActivity = () =>
    setActivities((a) => [
      ...a,
      { id: crypto.randomUUID(), output: "", activity: "", achievement: "" },
    ]);

  const removeActivity = (id: string) =>
    setActivities((a) => (a.length > 1 ? a.filter((x) => x.id !== id) : a));

  const updateActivity = (id: string, key: keyof ActivityRow, value: string) =>
    setActivities((a) => a.map((row) => (row.id === id ? { ...row, [key]: value } : row)));

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    setFiles((f) => [...f, ...Array.from(e.dataTransfer.files)]);
  };

  const saveDraft = () => {
    reportsStore.addTechnicalReport(buildFormData(), true);
    toast.success("Draft saved — visible in Technical Reports");
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = buildFormData();
    reportsStore.addTechnicalReport(data, false);
    reportsStore.addFinancialReport(data);
    toast.success("Report submitted for review");
    navigate("/technical-reports");
  };

  return (
    <>
      <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to="/technical-reports" className="hover:text-foreground">Technical Reports</Link>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">New Report</span>
      </div>
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold">Project Reporting Form</h1>
          <p className="text-sm text-muted-foreground">
            Generated from the official KALRO Project Reporting Template.
          </p>
        </div>
        <div className="flex gap-2">
          <Link to="/technical-reports">
            <Button variant="outline">Cancel</Button>
          </Link>
          <Button onClick={submit} className="bg-[var(--brand-navy)] hover:opacity-90">
            Submit Report
          </Button>
        </div>
      </div>

      <form onSubmit={submit} className="space-y-5">
        <Section index={1} title="Project Information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Quarter" value={form.quarter} onChange={(v) => set("quarter", v)} placeholder="Q1" />
            <Field label="Financial Year" value={form.financialYear} onChange={(v) => set("financialYear", v)} placeholder="2025/2026" />
            <Field label="Source of Fund" value={form.sourceOfFund} onChange={(v) => set("sourceOfFund", v)} placeholder="GoK / Donor" />
            <Field label="Donor" value={form.donor} onChange={(v) => set("donor", v)} placeholder="World Bank" />
            <Field label="Project" value={form.project} onChange={(v) => set("project", v)} placeholder="Project name" />
            <Field label="Sub-Component" value={form.subComponent} onChange={(v) => set("subComponent", v)} placeholder="Sub-component" />
            <Field label="Value Chain" value={form.valueChain} onChange={(v) => set("valueChain", v)} placeholder="Dairy" />
            <Field label="Project Title" value={form.projectTitle} onChange={(v) => set("projectTitle", v)} placeholder="Full title" />
          </div>
        </Section>

        <Section index={2} title="Strategic Alignment">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Key Result Area" value={form.keyResultArea} onChange={(v) => set("keyResultArea", v)} />
            <Field label="Strategic Objective" value={form.strategicObjective} onChange={(v) => set("strategicObjective", v)} />
            <Field label="Strategies" value={form.strategies} onChange={(v) => set("strategies", v)} />
          </div>
        </Section>

        <Section index={3} title="Project Duration">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <Field label="Start Date" type="date" value={form.startDate} onChange={(v) => set("startDate", v)} />
            <Field label="End Date" type="date" value={form.endDate} onChange={(v) => set("endDate", v)} />
            <Field label="Duration" value={form.duration} onChange={(v) => set("duration", v)} placeholder="e.g. 36 months" />
          </div>
        </Section>

        <Section index={4} title="Team Information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            <Field label="Lead Institute / Centre" value={form.leadInstitute} onChange={(v) => set("leadInstitute", v)} />
            <Field label="Principal Investigator" value={form.principalInvestigator} onChange={(v) => set("principalInvestigator", v)} />
            <Field label="Co-Principal Investigator" value={form.coPrincipalInvestigator} onChange={(v) => set("coPrincipalInvestigator", v)} />
            <Field label="Address" value={form.address} onChange={(v) => set("address", v)} />
            <Field label="Email" type="email" value={form.email} onChange={(v) => set("email", v)} />
            <Field label="Telephone" type="tel" value={form.telephone} onChange={(v) => set("telephone", v)} />
          </div>
        </Section>

        <Section index={5} title="Beneficiary Information">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
            <Field label="Counties Targeted" value={form.countiesTargeted} onChange={(v) => set("countiesTargeted", v)} />
            <Field label="Sub-county" value={form.subCounty} onChange={(v) => set("subCounty", v)} />
            <Field label="Ward" value={form.ward} onChange={(v) => set("ward", v)} />
            <Field label="Number of Beneficiaries" type="number" value={form.numberOfBeneficiaries} onChange={(v) => set("numberOfBeneficiaries", v)} />
            <Field label="Women" type="number" value={form.women} onChange={(v) => set("women", v)} />
            <Field label="Youths" type="number" value={form.youths} onChange={(v) => set("youths", v)} />
            <Field label="VMGs" type="number" value={form.vmgs} onChange={(v) => set("vmgs", v)} />
            <Field label="PWDs" type="number" value={form.pwds} onChange={(v) => set("pwds", v)} />
          </div>
        </Section>

        <Section index={6} title="Project Progress">
          <div className="space-y-3">
            <AnimatePresence initial={false}>
              {activities.map((a, idx) => (
                <motion.div
                  key={a.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="grid grid-cols-1 gap-3 rounded-lg border bg-muted/20 p-3 md:grid-cols-[1fr_1fr_1fr_auto]">
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Output #{idx + 1}</Label>
                      <Input value={a.output} onChange={(e) => updateActivity(a.id, "output", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Activity</Label>
                      <Input value={a.activity} onChange={(e) => updateActivity(a.id, "activity", e.target.value)} />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-xs font-medium">Achievement</Label>
                      <Input value={a.achievement} onChange={(e) => updateActivity(a.id, "achievement", e.target.value)} />
                    </div>
                    <div className="flex items-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeActivity(a.id)}
                        disabled={activities.length === 1}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <Button type="button" variant="outline" onClick={addActivity} className="gap-1.5">
              <Plus className="h-4 w-4" /> Add Activity Row
            </Button>
          </div>
        </Section>

        <Section index={7} title="Outcomes & Sustainability">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Expected outcomes</Label>
              <Textarea rows={4} value={form.expectedOutcomes} onChange={(e) => set("expectedOutcomes", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Achievements</Label>
              <Textarea rows={4} value={form.achievements} onChange={(e) => set("achievements", e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Sustainability measures</Label>
              <Textarea rows={4} value={form.sustainabilityMeasures} onChange={(e) => set("sustainabilityMeasures", e.target.value)} />
            </div>
          </div>
        </Section>

        <Section index={8} title="Financial Tracking">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Funds allocated (b)</Label>
              <Input type="number" value={allocated || ""} onChange={(e) => setAllocated(+e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Funds received</Label>
              <Input type="number" value={received || ""} onChange={(e) => setReceived(+e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Funds utilized (c)</Label>
              <Input type="number" value={utilized || ""} onChange={(e) => setUtilized(+e.target.value)} />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-medium">Proportion absorbed (c/b × 100)</Label>
              <div className="grid h-9 place-items-center rounded-md border bg-muted/40 text-sm font-semibold text-[var(--brand-green)]">
                {absorbed}%
              </div>
            </div>
          </div>
        </Section>

        <Section index={9} title="Challenges & Corrective Actions">
          <Textarea rows={4} placeholder="Describe challenges & corrective actions…" value={form.challenges} onChange={(e) => set("challenges", e.target.value)} />
        </Section>

        <Section index={10} title="Lessons Learned">
          <Textarea rows={4} placeholder="Describe lessons learned…" value={form.lessonsLearned} onChange={(e) => set("lessonsLearned", e.target.value)} />
        </Section>

        <Section index={11} title="Recommendations">
          <Textarea rows={4} placeholder="Describe recommendations…" value={form.recommendations} onChange={(e) => set("recommendations", e.target.value)} />
        </Section>

        <Section index={12} title="Way Forward">
          <Textarea rows={4} placeholder="Describe way forward…" value={form.wayForward} onChange={(e) => set("wayForward", e.target.value)} />
        </Section>

        <Section index={13} title="Publications">
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={onDrop}
            className={`grid place-items-center rounded-lg border-2 border-dashed p-8 text-center transition ${
              dragOver ? "border-[var(--brand-green)] bg-green-50" : "border-muted-foreground/30"
            }`}
          >
            <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
            <div className="text-sm font-medium">Drag &amp; drop publications here</div>
            <div className="text-xs text-muted-foreground">PDF, DOCX, PPTX up to 25 MB each</div>
            <label className="mt-3 inline-flex">
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => setFiles((f) => [...f, ...Array.from(e.target.files ?? [])])}
              />
              <span className="cursor-pointer rounded-md bg-[var(--brand-navy)] px-3 py-1.5 text-xs font-medium text-white">
                Browse files
              </span>
            </label>
          </div>
          {files.length > 0 && (
            <ul className="mt-4 space-y-2">
              {files.map((f, i) => (
                <li key={i} className="flex items-center justify-between rounded-md border bg-muted/20 px-3 py-2 text-sm">
                  <span className="truncate">{f.name}</span>
                  <button type="button" onClick={() => setFiles((fs) => fs.filter((_, j) => j !== i))}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-red-500" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </Section>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={saveDraft}>Save Draft</Button>
          <Button type="submit" className="bg-[var(--brand-navy)] hover:opacity-90">Submit Report</Button>
        </div>
      </form>
    </>
  );
}
