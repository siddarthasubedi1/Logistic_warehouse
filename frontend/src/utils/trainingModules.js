function slug(value) {
    return String(value || "").trim().toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
}
export function canonicalModuleKey(value) { return slug(value); }
export function moduleKey(module) { return String(module?.key || "").trim() || slug(module?.name || ""); }
export function getTrainingModuleLabel(value, modules = []) {
    const key = canonicalModuleKey(value);
    return modules.find((module) => moduleKey(module) === key)?.name || value || "";
}

// Compatibility helper for legacy UI components. Dynamic module screens must load
// the authoritative list from /api/training-modules; this helper intentionally
// contains no built-in/default modules.
export function getActiveTrainingModules(modules = []) {
    return (Array.isArray(modules) ? modules : [])
        .filter((module) => String(module?.status || "active").toLowerCase() === "active")
        .map((module) => ({
            ...module,
            id: moduleKey(module),
            key: moduleKey(module),
            name: module?.name || getTrainingModuleLabel(moduleKey(module), modules),
        }));
}
