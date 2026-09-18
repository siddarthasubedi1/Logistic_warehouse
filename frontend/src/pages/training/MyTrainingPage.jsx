import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { PanoramaCanvas } from "../trainee/Trainee360Environment";
import api from "../../services/api";
import { getApiErrorMessage, getAssignmentProgramme, parseArrayResponse } from "../../utils/training";
import "../trainee/Training360Flow.css";


export default function MyTrainingPage() {
    const navigate = useNavigate();
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [fov, setFov] = useState(82);
    const [imageFailed, setImageFailed] = useState(false);

    const load = useCallback(async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get("/my-training");
            setAssignments(parseArrayResponse(response.data, "assignments"));
        } catch (err) {
            setError(getApiErrorMessage(err, "Unable to load assigned training."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    const modules = useMemo(
        () => assignments
            .map((assignment) => ({ assignment, programme: getAssignmentProgramme(assignment) }))
            .filter((item) => item.programme),
        [assignments]
    );

    const groupedModules = useMemo(() => {
        const groups = new Map();
        modules.forEach((item) => {
            const key = String(item.programme.programmeType || "other").trim().toLowerCase();
            if (!groups.has(key)) groups.set(key, []);
            groups.get(key).push(item);
        });
        return Array.from(groups.entries()).map(([key, programmes]) => ({ key, programmes }));
    }, [modules]);

    const moduleMeta = {
        "manual-handling": { title: "Manual Handling", description: "Safe lifting and carrying techniques", thumb: "/panoramas/training-reference-manual.jpg", pin: "◆", className: "training360-flow__module--manual" },
        "working-at-height": { title: "Working at Height", description: "Safety when working at height", thumb: "/panoramas/training-reference-inspection.jpg", pin: "⌂", className: "training360-flow__module--height" },
        "cyber-awareness": { title: "Cyber Awareness", description: "Cyber safety, phishing and secure working", thumb: "/panoramas/training-reference-forklift.jpg", pin: "●", className: "" },
    };

    const openModule = (moduleType) => {
        navigate(`/my-training/module/${encodeURIComponent(moduleType)}/environment`);
    };

    return (
        <DashboardLayout
            role="trainee"
            title="My Training – 360° Module Selection"
            subtitle="Select a module by exploring the 360° environment. Click on a highlighted area to enter."
        >
            <section className="training360-flow">
                <div className="training360-flow__viewer training360-flow__viewer--selection">
                    <PanoramaCanvas
                        src="/panoramas/training-selection.png"
                        yaw={yaw}
                        pitch={pitch}
                        fov={fov}
                        onImageError={() => setImageFailed(true)}
                        onViewChange={(nextYaw, nextPitch, nextFov) => {
                            setYaw(nextYaw); setPitch(nextPitch); setFov(nextFov);
                        }}
                    />
                    <div className="training360-flow__shade" />
                    {imageFailed && (
                        <div className="training360-flow__message training360-flow__message--overlay training360-flow__message--error">
                            The local 360° training environment could not be loaded. Check frontend/public/panoramas/training-selection.png.
                        </div>
                    )}

                    <div className="training360-flow__intro">
                        <strong>⌖ &nbsp; My Training</strong>
                        <span>Select a module by exploring the 360° environment. Click on a highlighted area to enter.</span>
                    </div>

                    {groupedModules.map((group, index) => {
                        const meta = moduleMeta[group.key] || {
                            title: group.programmes[0]?.programme?.moduleName || group.programmes[0]?.programme?.programmeType || "Training Module",
                            description: `${group.programmes.length} assigned programme${group.programmes.length === 1 ? "" : "s"}`,
                            thumb: "/panoramas/training-reference-manual.jpg",
                            pin: "◆",
                            className: "",
                        };
                        const positions = [
                            { left: "13%", top: "38%" },
                            { right: "13%", top: "35%" },
                            { left: "50%", top: "66%", transform: "translateX(-50%)" },
                        ];
                        return (
                            <button
                                type="button"
                                key={group.key}
                                className={`training360-flow__module ${meta.className}`}
                                style={positions[index % positions.length]}
                                onClick={() => openModule(group.key)}
                                disabled={loading}
                                aria-label={`Open ${meta.title} 360 degree module`}
                            >
                                <span className="training360-flow__module-pin training360-flow__module-pin--blue">{meta.pin}</span>
                                <span className="training360-flow__module-card">
                                    <img className="training360-flow__module-thumb" src={meta.thumb} alt={`${meta.title} training area`} />
                                    <span className="training360-flow__module-copy">
                                        <strong>{meta.title}</strong>
                                        <small>{group.programmes.length} assigned programme{group.programmes.length === 1 ? "" : "s"} • {meta.description}</small>
                                    </span>
                                    <span className="training360-flow__module-arrow">›</span>
                                </span>
                            </button>
                        );
                    })}

                    <div className="training360-flow__controls">
                        <button onClick={() => setFov((value) => Math.max(45, value - 8))}>+</button>
                        <button onClick={() => setFov((value) => Math.min(105, value + 8))}>−</button>
                    </div>

                    <div className="training360-flow__hint">ⓘ &nbsp; Explore the environment and click a module.</div>
                </div>

                {loading && <div className="training360-flow__message">Loading your assigned modules…</div>}
                {error && <div className="training360-flow__message training360-flow__message--error">{error}</div>}
                {!loading && !error && groupedModules.length === 0 && (
                    <div className="training360-flow__message">No training programmes have been assigned to your account yet.</div>
                )}
            </section>

        </DashboardLayout>
    );
}
