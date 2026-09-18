const STORAGE_KEY = "logiware_training_modules";

export function getModules() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);

        if (!stored) {
            return [];
        }

        const modules = JSON.parse(stored);

        return Array.isArray(modules) ? modules : [];
    } catch (error) {
        console.error("Unable to load modules:", error);
        return [];
    }
}

export function getModuleById(id) {
    return getModules().find(
        (module) => String(module.id) === String(id)
    );
}

export function createModule(data) {
    const modules = getModules();

    const newModule = {
        id:
            window.crypto?.randomUUID?.() ||
            `module-${Date.now()}`,

        name: data.name.trim(),
        code: data.code.trim(),
        description: data.description.trim(),
        status: data.status || "active",
        image: data.image || "",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    };

    const updatedModules = [
        ...modules,
        newModule,
    ];

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedModules)
    );

    return newModule;
}

export function updateModule(id, data) {
    const modules = getModules();

    const updatedModules = modules.map((module) =>
        String(module.id) === String(id)
            ? {
                ...module,
                ...data,
                id: module.id,
                updatedAt: new Date().toISOString(),
            }
            : module
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedModules)
    );

    return getModuleById(id);
}

export function deleteModule(id) {
    const modules = getModules();

    const updatedModules = modules.filter(
        (module) =>
            String(module.id) !== String(id)
    );

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(updatedModules)
    );
}