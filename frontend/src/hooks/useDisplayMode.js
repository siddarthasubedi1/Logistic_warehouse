import { useEffect, useState } from "react";
import { applyDisplayMode, getStoredDisplayMode, rememberDisplayMode } from "../utils/theme";

// Keep every visible display-mode control in sync, including other tabs.
export default function useDisplayMode() {
  const [displayMode, setDisplayMode] = useState(getStoredDisplayMode);

  useEffect(() => {
    const sync = () => {
      const stored = getStoredDisplayMode();
      applyDisplayMode(stored);
      setDisplayMode(stored);
    };
    window.addEventListener("logiware-theme-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("logiware-theme-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const changeDisplayMode = (next) => {
    const applied = rememberDisplayMode(next);
    setDisplayMode(applied);
    return applied;
  };

  return [displayMode, changeDisplayMode];
}
