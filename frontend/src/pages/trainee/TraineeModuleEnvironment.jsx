import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { PanoramaCanvas } from "./Trainee360Environment";
import api, { API_BASE_URL } from "../../services/api";
import { parseArrayResponse, sortLearningSections } from "../../utils/training";
import "./Training360Flow.css";

const LEVELS = ["beginner", "intermediate", "advanced"];
const pretty = (v) => String(v || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());

export default function TraineeModuleEnvironment() {
    const { programmeId, moduleType } = useParams();
    const navigate = useNavigate();
    const [programme, setProgramme] = useState(null);
    const [programmes, setProgrammes] = useState([]);
    const [levelAccess, setLevelAccess] = useState({});
    const [sections, setSections] = useState([]);
    const [environmentPanorama, setEnvironmentPanorama] = useState(null);
    const [selectedSection, setSelectedSection] = useState(0);
    const [overlay, setOverlay] = useState(null);
    const [error, setError] = useState("");
    const [yaw, setYaw] = useState(0), [pitch, setPitch] = useState(0), [fov, setFov] = useState(80);
    const [sceneIndex, setSceneIndex] = useState(0);
    const [showMap, setShowMap] = useState(true);
    const [progress, setProgress] = useState(null);
    const [scenarios, setScenarios] = useState([]);
    const [scenarioIndex, setScenarioIndex] = useState(0);
    const [scenarioResponse, setScenarioResponse] = useState("");
    const [scenarioFeedback, setScenarioFeedback] = useState(null);
    const [assessmentLevel, setAssessmentLevel] = useState("basic");
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [activityLoading, setActivityLoading] = useState(false);
    const [activityMessage, setActivityMessage] = useState("");

    useEffect(() => {
        let alive = true;
        setError("");
        if (programmeId) {
            Promise.all([
                api.get(`/my-training/${programmeId}`),
                api.get(`/my-training/${programmeId}/sections`).catch(() => ({ data: { sections: [] } })),
                api.get(`/programmes/${programmeId}/environment`).catch(() => ({ data: { panorama: null } })),
                api.get(`/sprint2/trainee/${programmeId}/progress`).catch(() => ({ data: { progress: null } })),
            ]).then(([p, s, e, pr]) => {
                if (!alive) return;
                setProgramme(p.data?.programme || s.data?.programme || null);
                setLevelAccess(p.data?.levelAccess || {});
                setSections(sortLearningSections(parseArrayResponse(s.data, "sections")));
                setEnvironmentPanorama(e.data?.panorama || null);
                setProgress(pr.data?.progress || null);
            }).catch(err => alive && setError(err?.response?.data?.message || "Unable to load this training programme."));
        } else if (moduleType) {
            api.get("/my-training").then(res => {
                if (!alive) return;
                const all = parseArrayResponse(res.data, "assignments")
                    .map(a => a.programme || a.trainingProgramme || a.programmeId)
                    .filter(p => p && typeof p === "object" && String(p.programmeType).toLowerCase() === String(moduleType).toLowerCase());
                setProgrammes(all);
                setLevelAccess(res.data?.levelAccess?.[moduleType] || {});
            }).catch(err => alive && setError(err?.response?.data?.message || "Unable to load this module."));
        }
        return () => { alive = false; };
    }, [programmeId, moduleType]);

    const type = String(programme?.programmeType || moduleType || "manual-handling").toLowerCase();
    const metaMap = useMemo(() => ({
        "manual-handling": {
            title: "Manual Handling",
            scenes: [
                { name: "Handling & Packing Area", panorama: "/panoramas/manual-handling.png", x: 25, y: 63, note: "Safe lifting, carrying and packing" },
                { name: "Loading & Dispatch", panorama: "/panoramas/loading-dispatch.png", x: 72, y: 68, note: "Loading, unloading and route planning" },
                { name: "Storage & Pallet Area", panorama: "/panoramas/entrance-storage.png", x: 53, y: 25, note: "Stacking, pallet handling and access routes" },
            ],
        },
        "working-at-height": {
            title: "Working at Height",
            scenes: [
                { name: "Mezzanine & Height Area", panorama: "/panoramas/working-height.png", x: 25, y: 24, note: "Edges, platforms and elevated work" },
                { name: "Warehouse Access Area", panorama: "/panoramas/logistics-indoor.png", x: 70, y: 30, note: "Access equipment and surrounding hazards" },
                { name: "Loading Transition Area", panorama: "/panoramas/loading-transition.png", x: 53, y: 72, note: "Vehicle interfaces and elevated access" },
            ],
        },
        "cyber-awareness": {
            title: "Cyber Awareness",
            scenes: [
                { name: "Cyber Office", panorama: "/panoramas/cyber-awareness.png", x: 25, y: 58, note: "Phishing, passwords, USB and workstation security" },
                { name: "Office & Access Control", panorama: "/panoramas/site-office.jpg", x: 72, y: 58, note: "Secure access, devices and information handling" },
                { name: "Training & Response Room", panorama: "/panoramas/training-room.jpg", x: 50, y: 24, note: "Awareness, reporting and secure working" },
            ],
        },
    }), []);
    const meta = metaMap[type] || { title: pretty(type), scenes: [{ name: "Training Area", panorama: "/panoramas/training-selection.png", x: 50, y: 50, note: "Training environment" }] };
    const backendOrigin = API_BASE_URL.replace(/\/api\/?$/, "");
    const scenes = useMemo(() => {
        const base = meta.scenes || [];
        if (!environmentPanorama?.imageUrl) return base;
        const uploaded = /^https?:\/\//i.test(environmentPanorama.imageUrl) ? environmentPanorama.imageUrl : `${backendOrigin}${environmentPanorama.imageUrl}`;
        return [{ ...base[0], name: environmentPanorama.name || base[0]?.name || "Training Area", panorama: uploaded }, ...base.slice(1)];
    }, [meta, environmentPanorama, backendOrigin]);
    const scene = scenes[Math.min(sceneIndex, Math.max(0, scenes.length - 1))] || scenes[0];
    const panorama = scene?.panorama || "/panoramas/training-selection.png";
    const current = sections[selectedSection] || null;

    const byLevel = LEVELS.map(level => ({ level, items: programmes.filter(p => (p.level || "beginner") === level), gate: levelAccess[level] || { unlocked: level === "beginner", completed: false } }));
    const levelPositions = { beginner: { left: "19%", top: "52%" }, intermediate: { left: "50%", top: "38%" }, advanced: { left: "80%", top: "55%" } };
    const activityPositions = {
        learning: { left: "18%", top: "50%" }, scenario: { left: "42%", top: "35%" }, quiz: { left: "68%", top: "46%" }, progress: { left: "84%", top: "66%" }
    };

    const refreshProgress = async () => {
        if (!programmeId) return null;
        try { const r = await api.get(`/sprint2/trainee/${programmeId}/progress`); setProgress(r.data?.progress || null); return r.data?.progress || null; }
        catch { return null; }
    };

    const openActivity = async (key) => {
        setActivityMessage(""); setScenarioFeedback(null);
        if (key === "learning") return setOverlay("learning");
        if (key === "progress") { await refreshProgress(); return setOverlay("progress"); }
        if (key === "scenario") {
            setActivityLoading(true);
            try {
                const r = await api.get(`/sprint2/trainee/${programmeId}/scenarios`);
                const rows = r.data?.scenarios || [];
                setScenarios(rows); setScenarioIndex(0); setScenarioResponse("");
                setActivityMessage(rows.length ? "" : "No active scenario has been added to this programme yet. Ask the Administrator or authorised Trainer to add and activate one from Training Programmes → Scenarios & Assessments.");
                setOverlay("scenario");
            } catch (e) {
                const code = e.response?.data?.code;
                setActivityMessage(code === "LEARNING_INCOMPLETE" ? "Complete all Learning Sections first. The Scenario Exercise will unlock automatically." : (e.response?.data?.message || "Scenario Exercise is not available yet."));
                setOverlay("scenario");
            } finally { setActivityLoading(false); }
            return;
        }
        if (key === "quiz") { setOverlay("assessment"); await loadAssessment("basic"); }
    };

    const completeLearningSection = async () => {
        if (!current?._id) return;
        setActivityLoading(true); setActivityMessage("");
        try {
            const r = await api.post(`/sprint2/trainee/${programmeId}/sections/${current._id}/complete`);
            setProgress(r.data?.progress || progress);
            setActivityMessage("Section completed. Your progress has been saved.");
            if (selectedSection < sections.length - 1) setSelectedSection(v => v + 1);
        } catch (e) { setActivityMessage(e.response?.data?.message || "Unable to save section completion."); }
        finally { setActivityLoading(false); }
    };

    const submitScenario = async () => {
        const item = scenarios[scenarioIndex]; if (!item || !scenarioResponse) return;
        setActivityLoading(true); setActivityMessage("");
        try {
            const r = await api.post(`/sprint2/trainee/${programmeId}/scenarios/${item._id}/submit`, { response: scenarioResponse });
            setScenarioFeedback({ correct: r.data?.correct, text: r.data?.feedback || (r.data?.correct ? "Correct." : "Try again.") });
            setProgress(r.data?.progress || progress);
            if (r.data?.correct && scenarioIndex < scenarios.length - 1) setTimeout(() => { setScenarioIndex(v => v + 1); setScenarioResponse(""); setScenarioFeedback(null); }, 700);
        } catch (e) { setActivityMessage(e.response?.data?.message || "Unable to submit scenario response."); }
        finally { setActivityLoading(false); }
    };

    const loadAssessment = async (level) => {
        setActivityLoading(true); setActivityMessage(""); setAssessmentResult(null); setAnswers({}); setAssessmentLevel(level);
        try { const r = await api.get(`/sprint2/trainee/${programmeId}/assessments/${level}`); setQuestions(r.data?.questions || []); }
        catch (e) { setQuestions([]); setActivityMessage(e.response?.data?.message || "This assessment is not available yet."); }
        finally { setActivityLoading(false); }
    };

    const submitAssessment = async () => {
        setActivityLoading(true); setActivityMessage("");
        try {
            const payload = { answers: questions.map(q => ({ questionId: q._id, answer: answers[q._id] || "" })) };
            const r = await api.post(`/sprint2/trainee/${programmeId}/assessments/${assessmentLevel}/submit`, payload);
            setAssessmentResult(r.data?.attempt || null); setProgress(r.data?.progress || progress);
        } catch (e) { setActivityMessage(e.response?.data?.message || "Unable to submit assessment."); }
        finally { setActivityLoading(false); }
    };

    const goScene = (index) => { setSceneIndex(index); setYaw(0); setPitch(0); setFov(80); };
    const nextScene = () => goScene((sceneIndex + 1) % scenes.length);
    const prevScene = () => goScene((sceneIndex - 1 + scenes.length) % scenes.length);
    const related = type === "manual-handling"
        ? ["Safe lifting point", "Trolley & pallet aid", "Route hazard check"]
        : type === "working-at-height"
            ? ["Ladder safety", "Edge protection", "Falling-object check"]
            : ["Phishing check", "Password & MFA", "USB / device security"];

    return <DashboardLayout role="trainee" title={`${programme?.title || meta.title} — 360° Training`} subtitle="Move around the environment and discover your training activities.">
        <section className="training360-flow immersive-module">
            <div className="training360-flow__viewer training360-flow__viewer--module immersive-module__viewer">
                <PanoramaCanvas src={panorama} yaw={yaw} pitch={pitch} fov={fov} onViewChange={(y, p, f) => { setYaw(y); setPitch(p); setFov(f); }} />
                <div className="training360-flow__shade" />
                <div className="immersive-module__badge"><b>{meta.title}</b><span>{programmeId ? `${pretty(programme?.level || "beginner")} Level · ${scene?.name}` : `Choose your training level · ${scene?.name}`}</span></div>
                <div className="immersive-scene-tools"><button onClick={() => setShowMap(v => !v)}>▣ Map</button><button onClick={prevScene}>← Previous area</button><button onClick={nextScene}>Next area →</button></div>
                {showMap && <aside className="immersive-map"><div className="immersive-map__head"><b>{meta.title} Map</b><button onClick={() => setShowMap(false)}>×</button></div><div className="immersive-map__floor">{scenes.map((s, i) => <button key={s.name} className={i === sceneIndex ? "active" : ""} style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => goScene(i)}><i></i><span>{s.name}</span></button>)}</div><small>Blue marker = current area · Click any area to move</small></aside>}
                <button className="immersive-area-hotspot immersive-area-hotspot--left" onClick={prevScene}>← <span>{scenes[(sceneIndex - 1 + scenes.length) % scenes.length]?.name}</span></button>
                <button className="immersive-area-hotspot immersive-area-hotspot--right" onClick={nextScene}><span>{scenes[(sceneIndex + 1) % scenes.length]?.name}</span> →</button>

                {!programmeId && byLevel.map(({ level, items, gate }) => <div className="immersive-level" style={levelPositions[level]} key={level}>
                    <div className={`immersive-hotspot ${gate.unlocked ? "" : "locked"}`}>{gate.completed ? "✓" : gate.unlocked ? "→" : "🔒"}</div>
                    <div className="immersive-card">
                        <small>{pretty(level)} LEVEL</small><strong>{pretty(level)} Training</strong>
                        <span>{gate.completed ? "Completed — next level unlocked" : gate.unlocked ? `${items.length} assigned programme${items.length === 1 ? "" : "s"}` : "Pass the previous level to unlock"}</span>
                        {gate.unlocked && items.map(p => <button key={p._id} onClick={() => navigate(`/my-training/${p._id}/environment`)}>{p.title}<em>{p.passMark}% pass mark</em></button>)}
                    </div>
                </div>)}

                {programmeId && <>
                    {related.map((label, i) => <button key={label} className={`immersive-related immersive-related--${i + 1}`} onClick={() => setOverlay("learning")}><i>●</i><span>{label}</span></button>)}
                    <button className="immersive-activity" style={activityPositions.learning} onClick={() => openActivity("learning")}><i>▤</i><span><b>Learning Sections</b><small>{sections.length} sections</small></span></button>
                    <button className="immersive-activity" style={activityPositions.scenario} onClick={() => openActivity("scenario")}><i>◎</i><span><b>Scenario Exercise</b><small>Interactive practice</small></span></button>
                    <button className="immersive-activity" style={activityPositions.quiz} onClick={() => openActivity("quiz")}><i>?</i><span><b>Assessment</b><small>Pass mark {programme?.passMark}%</small></span></button>
                    <button className="immersive-activity" style={activityPositions.progress} onClick={() => openActivity("progress")}><i>↗</i><span><b>My Progress</b><small>Scores & completion</small></span></button>
                    <button className="immersive-back" onClick={() => navigate(`/my-training/module/${encodeURIComponent(type)}/environment`)}>← Levels</button>
                </>}

                {overlay === "learning" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>LEARNING SECTIONS</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__body">
                        <nav>{sections.map((s, i) => <button className={i === selectedSection ? "active" : ""} key={s._id || i} onClick={() => setSelectedSection(i)}><b>{i + 1}</b>{s.title}</button>)}</nav>
                        <article>{current ? <><small>SECTION {selectedSection + 1} OF {sections.length}</small><h2>{current.title}</h2>{String(current.content || "No content added yet.").split(/\n+/).map((x, i) => <p key={i}>{x}</p>)}<div className="immersive-overlay__nav"><button disabled={!selectedSection} onClick={() => setSelectedSection(v => v - 1)}>← Previous</button><button onClick={completeLearningSection} disabled={activityLoading}>{activityLoading ? "Saving…" : "✓ Mark Complete"}</button><button disabled={selectedSection >= sections.length - 1} onClick={() => setSelectedSection(v => v + 1)}>Next →</button></div>{activityMessage && <p className="immersive-status">{activityMessage}</p>}</> : <p>No active learning sections are available.</p>}</article>
                    </div>
                </div>}

                {overlay === "scenario" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>SCENARIO EXERCISE</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single">
                        {activityLoading && <p>Loading scenario…</p>}
                        {activityMessage && <div className="immersive-notice">{activityMessage}</div>}
                        {scenarios[scenarioIndex] && <article><small>SCENARIO {scenarioIndex + 1} OF {scenarios.length}</small><h2>{scenarios[scenarioIndex].title}</h2><p>{scenarios[scenarioIndex].prompt}</p>
                            <div className="immersive-options">{scenarios[scenarioIndex].options?.length ? scenarios[scenarioIndex].options.map(o => <label key={o}><input type="radio" name="scenarioResponse" checked={scenarioResponse === o} onChange={() => setScenarioResponse(o)} /><span>{o}</span></label>) : <textarea value={scenarioResponse} onChange={e => setScenarioResponse(e.target.value)} placeholder="Enter your response" />}</div>
                            <button className="immersive-primary" disabled={!scenarioResponse || activityLoading} onClick={submitScenario}>Submit Response</button>
                            {scenarioFeedback && <div className={`immersive-feedback ${scenarioFeedback.correct ? "correct" : "incorrect"}`}><b>{scenarioFeedback.correct ? "Correct" : "Review and try again"}</b><p>{scenarioFeedback.text}</p></div>}
                        </article>}
                    </div>
                </div>}

                {overlay === "assessment" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>ASSESSMENT</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single">
                        <div className="immersive-assessment-tabs">{["basic", "intermediate", "high"].map(l => <button key={l} className={assessmentLevel === l ? "active" : ""} onClick={() => loadAssessment(l)}>{pretty(l)}</button>)}</div>
                        <p>Programme pass mark: <b>{programme?.passMark}%</b>. Assessment levels unlock in order.</p>
                        {activityMessage && <div className="immersive-notice">{activityMessage}</div>}
                        {questions.map((q, i) => <div className="immersive-question" key={q._id}><b>{i + 1}. {q.question}</b>{q.options?.map(o => <label key={o}><input type="radio" name={q._id} checked={answers[q._id] === o} onChange={() => setAnswers(a => ({ ...a, [q._id]: o }))} /><span>{o}</span></label>)}</div>)}
                        {!!questions.length && !assessmentResult && <button className="immersive-primary" onClick={submitAssessment} disabled={activityLoading}>Submit {pretty(assessmentLevel)} Assessment</button>}
                        {assessmentResult && <div className={`immersive-result ${assessmentResult.passed ? "passed" : "failed"}`}><h2>{assessmentResult.passed ? "Passed" : "Not passed yet"}</h2><p>Score: <b>{assessmentResult.percentage}%</b> · Required: <b>{programme?.passMark}%</b> · Attempt {assessmentResult.attemptNumber}</p>{assessmentResult.passed && assessmentLevel !== "high" ? <button className="immersive-primary" onClick={() => loadAssessment(assessmentLevel === "basic" ? "intermediate" : "high")}>Next Assessment →</button> : !assessmentResult.passed ? <button className="immersive-primary" onClick={() => loadAssessment(assessmentLevel)}>Try Again</button> : <button className="immersive-primary" onClick={() => navigate(`/my-training/module/${encodeURIComponent(type)}/environment`)}>Return to Levels →</button>}</div>}
                    </div>
                </div>}

                {overlay === "progress" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>MY PROGRESS</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single"><div className="immersive-progress-grid"><div><span>Overall</span><b>{progress?.progress || 0}%</b></div><div><span>Learning</span><b>{progress?.learningCompleted ? "Complete" : "In progress"}</b></div><div><span>Scenario</span><b>{progress?.scenarioCompleted ? "Complete" : "Pending"}</b></div><div><span>Basic</span><b>{progress?.basicPassed ? "Passed" : "Pending"}</b></div><div><span>Intermediate</span><b>{progress?.intermediatePassed ? "Passed" : "Locked / pending"}</b></div><div><span>High</span><b>{progress?.highPassed ? "Passed" : "Locked / pending"}</b></div></div></div>
                </div>}

                <div className="training360-flow__controls"><button onClick={() => setFov(v => Math.max(45, v - 8))}>+</button><button onClick={() => setFov(v => Math.min(105, v + 8))}>−</button></div>
                <div className="immersive-hint">Drag left/right to explore • Scroll to zoom • Click a hotspot to open training</div>
                {error && <div className="training360-flow__message training360-flow__message--overlay training360-flow__message--error">{error}</div>}
            </div>
        </section>
    </DashboardLayout>;
}
