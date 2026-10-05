import { useEffect } from "react";

// Start a stable request callback after mount has committed. Cancelling the
// discarded Strict Mode setup prevents it from issuing a duplicate request.
// The callback handles request errors; event-driven refreshes call it directly.
export default function useInitialLoad(load) {
    useEffect(() => {
        let cancelled = false;
        Promise.resolve().then(() => {
            if (!cancelled) return load();
        });
        return () => { cancelled = true; };
    }, [load]);
}
