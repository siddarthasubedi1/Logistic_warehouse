import { useState } from "react";

import api from "../../services/api";
import {
    getSessionUser,
    updateSessionUser,
} from "../../utils/session";
import useDisplayMode from "../../hooks/useDisplayMode";

function ThemeToggle() {
    const [displayMode, setDisplayMode] = useDisplayMode();
    const [saving, setSaving] = useState(false);

    const toggle = async () => {
        if (saving) return;

        const previous = displayMode;
        const next = previous === "dark" ? "light" : "dark";

        setDisplayMode(next);
        setSaving(true);

        const currentUser = getSessionUser();
        if (currentUser) {
            updateSessionUser({ ...currentUser, displayMode: next });
        }

        try {
            const response = await api.patch(
                "/users/me/display-mode",
                { displayMode: next }
            );

            const latestUser = getSessionUser() || {};
            updateSessionUser({
                ...latestUser,
                ...(response.data?.user || {}),
                displayMode: response.data?.displayMode || next,
            });
        } catch (error) {
            // Keep the locally selected mode. A temporary API/network failure
            // should not make the interface flash back to the previous theme.
            // The preference will be synced again the next time it is changed.
            console.warn("Unable to sync display mode preference:", error);
        } finally {
            setSaving(false);
        }
    };

    const dark = displayMode === "dark";

    return (
        <button
            type="button"
            className="app-theme-toggle"
            onClick={toggle}
            disabled={saving}
            aria-label={`Switch to ${dark ? "light" : "dark"} mode`}
            aria-pressed={dark}
            title={`Switch to ${dark ? "light" : "dark"} mode`}
        >
            <span className="app-theme-toggle__icon" aria-hidden="true">
                {dark ? (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
                    </svg>
                ) : (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20.5 14.5A8.4 8.4 0 0 1 9.5 3.5 8.5 8.5 0 1 0 20.5 14.5Z" />
                    </svg>
                )}
            </span>
            <span className="app-theme-toggle__label">
                {dark ? "Light mode" : "Dark mode"}
            </span>
        </button>
    );
}

export default ThemeToggle;
