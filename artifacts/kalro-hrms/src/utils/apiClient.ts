import {
  projectsStore,
  componentsStore,
  objectivesStore,
  strategiesStore,
  keyActivitiesStore,
  expectedOutputsStore,
  outputIndicatorsStore,
  baselinesStore,
  projectDocumentsStore,
  projectDocumentDataStore,
  projectMappingsStore,
  trackingRowsStore,
  trackingEvidenceStore,
} from "./projectsModuleStore";

type B = Record<string, unknown>;

function str(v: unknown): string {
  return v == null ? "" : String(v);
}

function dispatch(method: string, rawPath: string, body: unknown): unknown {
  const qIdx = rawPath.indexOf("?");
  const pathPart = qIdx >= 0 ? rawPath.slice(0, qIdx) : rawPath;
  const query = qIdx >= 0 ? new URLSearchParams(rawPath.slice(qIdx + 1)) : new URLSearchParams();
  const path = pathPart.replace(/\/$/, "");

  /* ---- projects ---- */
  if (path === "/projects") {
    if (method === "GET") return projectsStore.getAll();
    if (method === "POST") {
      const b = body as B;
      return projectsStore.create({
        name: str(b.name),
        logo: str(b.logo) || "PR",
        startDate: str(b.startDate),
        endDate: str(b.endDate),
        status: (str(b.status) || "Pending") as import("./types").ProjectStatus,
        description: str(b.description),
      } as Parameters<typeof projectsStore.create>[0]);
    }
  }
  const projM = path.match(/^\/projects\/(.+)$/);
  if (projM) {
    const id = projM[1];
    if (method === "GET") return projectsStore.getById(id) ?? null;
    if (method === "PUT" || method === "PATCH") {
      const b = body as B;
      return projectsStore.update(id, {
        name: b.name !== undefined ? str(b.name) : undefined,
        logo: b.logo !== undefined ? str(b.logo) : undefined,
        startDate: b.startDate !== undefined ? str(b.startDate) : undefined,
        endDate: b.endDate !== undefined ? str(b.endDate) : undefined,
        status: b.status !== undefined ? str(b.status) as import("./types").ProjectStatus : undefined,
        description: b.description !== undefined ? str(b.description) : undefined,
      });
    }
    if (method === "DELETE") { projectsStore.softDelete(id); return null; }
  }

  /* ---- kras ---- */
  if (path === "/kras") {
    if (method === "GET") return componentsStore.getAll();
    if (method === "POST") return componentsStore.create(str((body as B).title));
  }
  const kraM = path.match(/^\/kras\/(.+)$/);
  if (kraM) {
    const id = kraM[1];
    if (method === "PUT") { componentsStore.update(id, str((body as B).title)); return componentsStore.getById(id); }
    if (method === "DELETE") { componentsStore.delete(id); return null; }
  }

  /* ---- strategic-objectives ---- */
  if (path === "/strategic-objectives") {
    if (method === "GET") return objectivesStore.getAll();
    if (method === "POST") {
      const b = body as B;
      return objectivesStore.create(str(b.componentId), str(b.text));
    }
  }
  const soM = path.match(/^\/strategic-objectives\/(.+)$/);
  if (soM) {
    const id = soM[1];
    if (method === "PUT") {
      const b = body as B;
      objectivesStore.update(id, str(b.componentId), str(b.text));
      return objectivesStore.getById(id);
    }
    if (method === "DELETE") { objectivesStore.delete(id); return null; }
  }

  /* ---- strategies ---- */
  if (path === "/strategies") {
    if (method === "GET") return strategiesStore.getAll();
    if (method === "POST") {
      const b = body as B;
      return strategiesStore.create(str(b.componentId), str(b.objectiveId), str(b.text));
    }
  }
  const stM = path.match(/^\/strategies\/(.+)$/);
  if (stM) {
    const id = stM[1];
    if (method === "PUT") {
      const b = body as B;
      strategiesStore.update(id, str(b.componentId), str(b.objectiveId), str(b.text));
      return strategiesStore.getById(id);
    }
    if (method === "DELETE") { strategiesStore.delete(id); return null; }
  }

  /* ---- key-activities ---- */
  if (path === "/key-activities") {
    if (method === "GET") return keyActivitiesStore.getAll();
    if (method === "POST") {
      const b = body as B;
      return keyActivitiesStore.create(str(b.strategyId), str(b.text));
    }
  }
  const kaM = path.match(/^\/key-activities\/(.+)$/);
  if (kaM) {
    const id = kaM[1];
    if (method === "PUT") {
      const b = body as B;
      keyActivitiesStore.update(id, str(b.strategyId), str(b.text));
      return keyActivitiesStore.getById(id);
    }
    if (method === "DELETE") { keyActivitiesStore.delete(id); return null; }
  }

  /* ---- expected-outputs ---- */
  if (path === "/expected-outputs") {
    if (method === "GET") return expectedOutputsStore.getAll();
    if (method === "POST") {
      const b = body as B;
      return expectedOutputsStore.create(str(b.strategyId), str(b.keyActivityId), str(b.text));
    }
  }
  const eoM = path.match(/^\/expected-outputs\/(.+)$/);
  if (eoM) {
    const id = eoM[1];
    if (method === "PUT") {
      const b = body as B;
      expectedOutputsStore.update(id, str(b.strategyId), str(b.keyActivityId), str(b.text));
      return expectedOutputsStore.getById(id);
    }
    if (method === "DELETE") { expectedOutputsStore.delete(id); return null; }
  }

  /* ---- output-indicators ---- */
  if (path === "/output-indicators") {
    if (method === "GET") return outputIndicatorsStore.getAll();
    if (method === "POST") {
      const b = body as B;
      return outputIndicatorsStore.create(str(b.strategyId), str(b.keyActivityId), str(b.expectedOutputId), str(b.text));
    }
  }
  const oiM = path.match(/^\/output-indicators\/(.+)$/);
  if (oiM) {
    const id = oiM[1];
    if (method === "PUT") {
      const b = body as B;
      outputIndicatorsStore.update(id, str(b.strategyId), str(b.keyActivityId), str(b.expectedOutputId), str(b.text));
      return outputIndicatorsStore.getById(id);
    }
    if (method === "DELETE") { outputIndicatorsStore.delete(id); return null; }
  }

  /* ---- baselines ---- */
  if (path === "/baselines") {
    if (method === "GET") return baselinesStore.getAll();
    if (method === "POST") {
      const b = body as B;
      const n = (v: unknown) => (v == null ? null : Number(v));
      return baselinesStore.create(str(b.outputIndicatorId), n(b.year1), n(b.year2), n(b.year3), n(b.year4), n(b.year5));
    }
  }
  const blM = path.match(/^\/baselines\/(.+)$/);
  if (blM) {
    const id = blM[1];
    if (method === "PUT") {
      const b = body as B;
      const n = (v: unknown) => (v == null ? null : Number(v));
      baselinesStore.update(id, str(b.outputIndicatorId), n(b.year1), n(b.year2), n(b.year3), n(b.year4), n(b.year5));
      return baselinesStore.getById(id);
    }
    if (method === "DELETE") { baselinesStore.delete(id); return null; }
  }

  /* ---- project-documents ---- */
  if (path === "/project-documents") {
    if (method === "GET") {
      const projectId = query.get("project") ?? "";
      return projectDocumentsStore.getForProject(projectId);
    }
    if (method === "POSTFORM") {
      const form = body as FormData;
      const projectId = str(form.get("project"));
      const name = str(form.get("name"));
      const size = Number(form.get("size") ?? 0);
      const type = str(form.get("type"));
      const file = form.get("file");
      const doc = projectDocumentsStore.addDocument(projectId, { name, size, type });
      if (file instanceof File) {
        const reader = new FileReader();
        reader.onload = () => projectDocumentDataStore.save(doc.id, reader.result as string);
        reader.readAsDataURL(file);
      }
      return doc;
    }
  }
  const pdM = path.match(/^\/project-documents\/(.+)$/);
  if (pdM) {
    const id = pdM[1];
    if (method === "DELETE") {
      const projectId = query.get("project") ?? "";
      projectDocumentsStore.removeDocument(projectId, id);
      return null;
    }
  }

  /* ---- project-mappings ---- */
  if (path === "/project-mappings") {
    if (method === "GET") {
      const projectId = query.get("project");
      if (projectId) {
        const m = projectMappingsStore.getForProject(projectId);
        return m ? [{ ...m, project: projectId }] : [];
      }
      const all = localStorage.getItem("kalro_pm_project_mappings");
      if (!all) return [];
      const record = JSON.parse(all) as Record<string, unknown>;
      return Object.entries(record).map(([pid, m]) => ({ ...(m as object), project: pid }));
    }
    if (method === "POST") {
      const b = body as B;
      const pid = str(b.project);
      const toStr = (arr: unknown) => (Array.isArray(arr) ? (arr as unknown[]).map(str) : []);
      projectMappingsStore.save(pid, toStr(b.kraIds), toStr(b.objectiveIds), toStr(b.strategyIds), toStr(b.keyActivityIds), toStr(b.expectedOutputIds), toStr(b.outputIndicatorIds));
      return { ...projectMappingsStore.getForProject(pid), project: pid };
    }
  }

  /* ---- indicator-tracking ---- */
  if (path === "/indicator-tracking") {
    if (method === "GET") {
      const projectId = query.get("project") ?? "";
      return trackingRowsStore.getForProject(projectId);
    }
  }
  if (path === "/indicator-tracking/bulk-save") {
    if (method === "POST") {
      const b = body as B;
      const projectId = str(b.project);
      const oiId = str(b.outputIndicatorId);
      const entries = (b.entries as { year: number; target: number | null; achievement: string; evidenceName: string }[]) ?? [];
      return trackingRowsStore.bulkSave(projectId, oiId, entries);
    }
  }
  const evidenceM = path.match(/^\/indicator-tracking\/(.+)\/upload-evidence$/);
  if (evidenceM) {
    if (method === "POSTFORM") {
      const rowId = evidenceM[1];
      const form = body as FormData;
      const file = form.get("evidence");
      if (file instanceof File) {
        const reader = new FileReader();
        const row = trackingRowsStore.getById(rowId);
        reader.onload = () => {
          const dataUrl = reader.result as string;
          trackingEvidenceStore.save(rowId, dataUrl);
          trackingRowsStore.updateEvidence(rowId, dataUrl);
        };
        reader.readAsDataURL(file);
        return { ...row, evidenceName: file.name };
      }
      return trackingRowsStore.getById(rowId);
    }
  }

  console.warn(`[apiClient] Unhandled route: ${method} ${rawPath}`);
  return null;
}

export const api = {
  get: <T = unknown>(path: string): Promise<T> =>
    Promise.resolve(dispatch("GET", path, null) as T),

  post: <T = unknown>(path: string, body?: unknown): Promise<T> =>
    Promise.resolve(dispatch("POST", path, body ?? null) as T),

  put: <T = unknown>(path: string, body?: unknown): Promise<T> =>
    Promise.resolve(dispatch("PUT", path, body ?? null) as T),

  patch: <T = unknown>(path: string, body?: unknown): Promise<T> =>
    Promise.resolve(dispatch("PATCH", path, body ?? null) as T),

  postForm: <T = unknown>(path: string, form: FormData): Promise<T> =>
    Promise.resolve(dispatch("POSTFORM", path, form) as T),

  del: (path: string): Promise<void> => {
    dispatch("DELETE", path, null);
    return Promise.resolve();
  },
};
