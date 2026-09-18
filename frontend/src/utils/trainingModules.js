import { getModules } from "./moduleStorage";

function slug(value) {
    return String(value || "")
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
}

// Keep the three approved Sprint 2 modules on stable database keys even when
// an Admin used a short module code (MH/WAH/CA) or the common "Awarness" typo.
export function canonicalModuleKey(value) {
    const key = slug(value);

    if (["manual-handling", "manualhandling", "mh"].includes(key)) {
        return "manual-handling";
    }

    if ([
        "working-at-height",
        "working-at-heights",
        "workingatheight",
        "wah",
    ].includes(key)) {
        return "working-at-height";
    }

    if ([
        "cyber-awareness",
        "cyber-awarness",
        "cyberawareness",
        "cyberawarness",
        "ca",
    ].includes(key)) {
        return "cyber-awareness";
    }

    return key;
}

export function moduleKey(module) {
    // For the approved modules, the module NAME is the source of truth. This
    // prevents a display code such as CA from becoming programmeType="ca".
    const nameKey = canonicalModuleKey(module?.name);

    if (["manual-handling", "working-at-height", "cyber-awareness"].includes(nameKey)) {
        return nameKey;
    }

    return canonicalModuleKey(module?.code || module?.name || module?.id || "");
}

export function getActiveTrainingModules() {
    return getModules()
        .filter((module) => String(module?.status || "active").toLowerCase() === "active")
        .map((module) => ({
            id: moduleKey(module),
            name: module.name,
            label: module.name,
            description: module.description || "",
            code: module.code || "",
            moduleId: module.id,
            image: module.image || "",
        }))
        .filter((module) => module.id && module.name);
}

export function getTrainingModuleLabel(value) {
    const key = canonicalModuleKey(value);
    return getActiveTrainingModules().find((module) => module.id === key)?.name || value || "";
}
