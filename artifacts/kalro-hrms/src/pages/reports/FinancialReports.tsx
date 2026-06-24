import { useState, useMemo, useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronRight, Download, FileText, Plus, Search, SlidersHorizontal } from "lucide-react";
import * as reportsStore from "@/utils/reportsStore";

const primaryTabs = ["Q1 FY2025/26", "Q2 FY2025/26", "Q3 FY2025/26", "Q4 FY2025/26", "Annual"];

type StatusKey = "Approved" | "Under Review" | "Draft" | "Rejected";

const statusTone: Record<string, string> = {
  Approved: "bg-green-100 text-green-800",
  "Under Review": "bg-amber-100 text-amber-800",
  Draft: "bg-slate-100 text-slate-700",
  Rejected: "bg-red-100 text-red-800",
  Submitted: "bg-blue-100 text-blue-800",
};

export default function FinancialReports() {
  const reports = useSyncExternalStore(
    reportsStore.subscribe,
    reportsStore.getFinancialReports,
    reportsStore.getFinancialReports,
  );
  const [tab, setTab] = useState(primaryTabs[0]);
  const [q, setQ] = useState("");

  const filtered = useMemo(() =>
    reports.filter((r) =>
      (tab === "Annual" || r.quarter === tab) &&
      (!q || r.project.toLowerCase().includes(q.toLowerCase()) || r.id.toLowerCase().includes(q.toLowerCase()))
    ), [tab, q, reports]);

  return (
    <>
      <div className="mb-4 flex items-center gap-1 text-xs text-muted-foreground">
        <span>Dashboard</span>
        <ChevronRight className="h-3 w-3" />
        <span className="text-foreground">Financial Reports</span>
      </div>
      <h1 className="mb-5 text-2xl font-semibold">Financial Reports</h1>

      <div className="mb-4 flex gap-1 overflow-x-auto rounded-lg border bg-white p-1 shadow-sm">
        {primaryTabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={cn(
              "whitespace-nowrap rounded-md px-3 py-1.5 text-sm font-medium transition",
              tab === t
                ? "bg-[var(--brand-green)] text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      <motion.div key={tab} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Card className="p-5">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search reports..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                className="w-64 pl-9 text-sm"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" size="sm" className="gap-1.5">
                <SlidersHorizontal className="h-4 w-4" /> Filter
              </Button>
              <Button variant="outline" size="sm" className="gap-1.5">
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button asChild size="sm" className="gap-1.5 bg-[var(--brand-green)] text-white hover:opacity-90">
                <Link to="/new-report"><Plus className="h-4 w-4" /> New Report</Link>
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                  <th className="py-2.5 text-left font-medium">Report ID</th>
                  <th className="py-2.5 text-left font-medium">Project</th>
                  <th className="py-2.5 text-left font-medium">Submitted</th>
                  <th className="py-2.5 text-left font-medium">Budget</th>
                  <th className="py-2.5 text-left font-medium">Utilized</th>
                  <th className="py-2.5 text-left font-medium">Rate</th>
                  <th className="py-2.5 text-left font-medium">Status</th>
                  <th className="py-2.5 text-left font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="py-10 text-center text-muted-foreground">No reports found.</td></tr>
                )}
                {filtered.map((r) => (
                  <tr key={r.id} className="border-b last:border-0 hover:bg-muted/30">
                    <td className="py-3">
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="font-mono text-xs">{r.id}</span>
                      </div>
                    </td>
                    <td className="max-w-52 py-3">
                      <div className="truncate font-medium">{r.project}</div>
                      <div className="text-xs text-muted-foreground">{r.quarter}</div>
                    </td>
                    <td className="py-3 text-muted-foreground">{r.submitted}</td>
                    <td className="py-3 font-medium">{r.budget}</td>
                    <td className="py-3">{r.utilized}</td>
                    <td className="py-3 font-semibold text-[var(--brand-green)]">{r.rate}</td>
                    <td className="py-3">
                      <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-medium", statusTone[r.status] ?? "bg-slate-100 text-slate-700")}>
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button variant="outline" size="sm" className="gap-1.5">
                        <Download className="h-3.5 w-3.5" /> Download
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-3 text-xs text-muted-foreground">
            Showing {filtered.length} of {reports.length} reports
          </div>
        </Card>
      </motion.div>
    </>
  );
}
