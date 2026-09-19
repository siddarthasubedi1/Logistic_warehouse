import api from "../services/api";
export function getModules() { return []; }
export function getModuleById() { return undefined; }
export async function loadModulesFromDatabase() { const r = await api.get("/training-modules"); return Array.isArray(r.data?.modules) ? r.data.modules : []; }
export async function loadModuleById(id) { const r = await api.get(`/training-modules/${id}`); return r.data?.module || null; }
export async function createModule(data) { const r = await api.post("/training-modules", data); return r.data?.module; }
export async function updateModule(id, data) { const r = await api.patch(`/training-modules/${id}`, data); return r.data?.module; }
export async function deleteModule(id) { await api.delete(`/training-modules/${id}`); }
