const DISPLAY_MODE_KEY = "displayMode";

export function normalizeDisplayMode(value) {
    return String(value || "").trim().toLowerCase() === "dark"
        ? "dark"
        : "light";
}

export function getStoredDisplayMode(fallback = "light") {
    if (typeof window === "undefined") {
        return normalizeDisplayMode(fallback);
    }

    return normalizeDisplayMode(
        window.localStorage.getItem(DISPLAY_MODE_KEY) || fallback
    );
}

export function applyDisplayMode(value) {
    const displayMode = normalizeDisplayMode(value);

    if (typeof document !== "undefined") {
        document.documentElement.dataset.theme = displayMode;
        document.documentElement.style.colorScheme = displayMode;
    }

    return displayMode;
}

export function rememberDisplayMode(value) {
    const displayMode = applyDisplayMode(value);

    if (typeof window !== "undefined") {
        window.localStorage.setItem(DISPLAY_MODE_KEY, displayMode);
    }

    return displayMode;
}

export function initializeDisplayMode(user = null) {
    return rememberDisplayMode(
        user?.displayMode || getStoredDisplayMode("light")
    );
}
