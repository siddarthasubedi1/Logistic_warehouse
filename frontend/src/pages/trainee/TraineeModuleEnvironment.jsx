import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { PanoramaCanvas } from "./Trainee360Environment";
import api, { API_BASE_URL } from "../../services/api";
import { parseArrayResponse, sortLearningSections } from "../../utils/training";
import "./Training360Flow.css";

export default function TraineeModuleEnvironment() {
    const { programmeId, moduleType } = useParams();
    const navigate = useNavigate();
    const [programme, setProgramme] = useState(null);
    const [moduleProgrammes, setModuleProgrammes] = useState([]);
    const [sections, setSections] = useState([]);
    const [environmentPanorama, setEnvironmentPanorama] = useState(null);
    const [selectedSection, setSelectedSection] = useState(0);
    const [panel, setPanel] = useState("menu");
    const [loadError, setLoadError] = useState("");
    const [imageFailed, setImageFailed] = useState(false);
    const [yaw, setYaw] = useState(0);
    const [pitch, setPitch] = useState(0);
    const [fov, setFov] = useState(80);

    useEffect(() => {
        let alive = true;
        if (programmeId) {
            Promise.all([
                api.get(`/my-training/${programmeId}`),
                api.get(`/my-training/${programmeId}/sections`).catch(() => ({ data: { sections: [] } })),
                api.get(`/programmes/${programmeId}/environment`).catch((error) => ({ data: { panorama: null, fallback: error?.response?.data?.message || "Module panorama is not configured." } })),
            ])
                .then(([programmeResponse, sectionsResponse, environmentResponse]) => {
                    if (!alive) return;
                    setProgramme(programmeResponse.data?.programme || sectionsResponse.data?.programme || null);
                    setSections(sortLearningSections(parseArrayResponse(sectionsResponse.data, "sections")));
                    setEnvironmentPanorama(environmentResponse.data?.panorama || null);
                    if (!environmentResponse.data?.panorama && environmentResponse.data?.fallback) setLoadError(environmentResponse.data.fallback);
                })
                .catch((error) => {
                    if (alive) setLoadError(error?.response?.data?.message || "Unable to load this training programme.");
                });
        } else if (moduleType) {
            api.get("/my-training")
                .then((response) => {
                    if (!alive) return;
                    const assignments = parseArrayResponse(response.data, "assignments");
                    const matching = assignments
                        .map((assignment) => assignment.programme || assignment.trainingProgramme || assignment.programmeId)
                        .filter((item) => item && typeof item === "object" && String(item.programmeType || "").toLowerCase() === String(moduleType).toLowerCase());
                    setModuleProgrammes(matching);
                })
                .catch((error) => {
                    if (alive) setLoadError(error?.response?.data?.message || "Unable to load programmes for this module.");
                });
        }
        return () => { alive = false; };
    }, [programmeId, moduleType]);

    const activeType = String(programme?.programmeType || moduleType || "manual-handling").toLowerCase();
    const moduleMeta = useMemo(() => ({
        "manual-handling": { title: "Manual Handling", subtitle: "Manual-handling interactive training environment", panorama: "/panoramas/manual-handling.png" },
        "working-at-height": { title: "Working at Height", subtitle: "Working-at-height interactive training environment", panorama: "/panoramas/working-height.png" },
        "cyber-awareness": { title: "Cyber Awareness", subtitle: "Cyber-awareness interactive training environment", panorama: "/panoramas/training-selection.png" },
    }), []);
    const meta = moduleMeta[activeType] || { title: activeType.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()), subtitle: "Interactive training environment", panorama: "/panoramas/training-selection.png" };
    const title = programme?.title || programme?.name || meta.title;
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
    const panorama = environmentPanorama?.imageUrl
        ? (/^https?:\/\//i.test(environmentPanorama.imageUrl) ? environmentPanorama.imageUrl : `${backendOrigin}${environmentPanorama.imageUrl}`)
        : meta.panorama;
    const current = sections[selectedSection] || null;

    const menuItems = [
        { key: "learning", icon: "▤", title: "Learning Content", text: sections.length ? `${sections.length} learning sections` : "View lessons inside the 360° environment" },
        { key: "exercise", icon: "◎", title: "360° Hazard Exercise", text: "Practice identifying workplace hazards" },
        { key: "quiz", icon: "?", title: "Module Quiz", text: "Complete the knowledge check" },
        { key: "progress", icon: "↗", title: "My Progress", text: "View training completion and scores" },
    ];

    const choose = (key) => {
        if (key === "learning") { setPanel("learning"); return; }
        if (key === "exercise") {
            if (programmeId) navigate(`/my-training/${programmeId}/exercise`);
            else setLoadError("An active module assignment is required to start the exercise.");
            return;
        }
        if (key === "quiz") {
            if (programmeId) navigate(`/my-training/${programmeId}/exercise`);
            else setLoadError("Choose an assigned programme before opening assessments.");
            return;
        }
        if (key === "progress") navigate("/trainee/progress");
    };

    return (
        <DashboardLayout role="trainee" title={`${title} — 360° Training`} subtitle="Explore the training environment and choose an activity from inside the scene.">
            <div className="training360-flow">
                <div className="training360-flow__viewer training360-flow__viewer--module">
                    <PanoramaCanvas src={panorama} yaw={yaw} pitch={pitch} fov={fov}
                        onImageError={() => setImageFailed(true)}
                        onViewChange={(nextYaw, nextPitch, nextFov) => { setYaw(nextYaw); setPitch(nextPitch); setFov(nextFov); }} />
                    <div className="training360-flow__shade" />

                    <div className="training360-flow__intro">
                        <strong>{title}</strong>
                        <span>{meta.subtitle}</span>
                    </div>

                    <aside className="training360-activity">
                        <div className="training360-activity__head">
                            {panel === "learning" && <button onClick={() => setPanel("menu")}>←</button>}
                            <div><small>TRAINING MODULE</small><h3>{!programmeId ? "Choose a programme" : panel === "learning" ? "Learning Content" : "Choose an activity"}</h3></div>
                        </div>

                        {!programmeId ? (
                            <div className="training360-activity__list">
                                {moduleProgrammes.length ? moduleProgrammes.map((item, index) => (
                                    <button key={item._id || index} onClick={() => navigate(`/my-training/${item._id}/environment`)}>
                                        <b>{index + 1}</b><span><strong>{item.title || `Programme ${index + 1}`}</strong><small>{item.description || "Open learning content and activities"}</small></span><i>›</i>
                                    </button>
                                )) : <p>No assigned programmes are available in this module yet.</p>}
                            </div>
                        ) : panel === "menu" ? (
                            <div className="training360-activity__list">
                                {menuItems.map((item, index) => (
                                    <button key={item.key} onClick={() => choose(item.key)}>
                                        <b>{item.icon}</b><span><strong>{index + 1}. {item.title}</strong><small>{item.text}</small></span><i>›</i>
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="training360-learning">
                                <div className="training360-learning__sections">
                                    {sections.length ? sections.map((section, index) => (
                                        <button className={index === selectedSection ? "active" : ""} key={section._id || index} onClick={() => setSelectedSection(index)}>
                                            <b>{index + 1}</b><span>{section.title || `Learning Section ${index + 1}`}</span>
                                        </button>
                                    )) : <p>No learning sections are available for this module yet.</p>}
                                </div>
                                {current && <div className="training360-learning__content">
                                    <small>SECTION {selectedSection + 1} OF {sections.length}</small>
                                    <h4>{current.title}</h4>
                                    <div>{String(current.content || "No content has been added to this section yet.").split(/\n+/).map((p, i) => <p key={i}>{p}</p>)}</div>
                                    <div className="training360-learning__nav">
                                        <button disabled={selectedSection === 0} onClick={() => setSelectedSection(v => Math.max(0, v - 1))}>← Previous</button>
                                        <button disabled={selectedSection >= sections.length - 1} onClick={() => setSelectedSection(v => Math.min(sections.length - 1, v + 1))}>Next →</button>
                                    </div>
                                </div>}
                            </div>
                        )}
                    </aside>

                    <div className="training360-flow__controls"><button onClick={() => setFov(v => Math.max(45, v - 8))}>+</button><button onClick={() => setFov(v => Math.min(105, v + 8))}>−</button></div>
                    <div className="training360-flow__hint">Drag to look around • Scroll to zoom • Training content stays inside this 360° environment</div>
                    {(loadError || imageFailed) && <div className="training360-flow__message training360-flow__message--overlay training360-flow__message--error">{imageFailed ? `The local panorama ${panorama} could not be loaded.` : loadError}</div>}
                </div>
            </div>
        </DashboardLayout>
    );
}
