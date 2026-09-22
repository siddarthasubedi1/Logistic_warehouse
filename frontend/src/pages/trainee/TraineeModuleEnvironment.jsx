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
    const [levelProgrammes, setLevelProgrammes] = useState([]);
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
    const [scenarioAttemptedIds, setScenarioAttemptedIds] = useState([]);
    const [assessmentLevel, setAssessmentLevel] = useState("basic");
    const [assessmentAttemptId, setAssessmentAttemptId] = useState(null);
    const [assessmentAttemptNumber, setAssessmentAttemptNumber] = useState(null);
    const [assessmentAnsweredIds, setAssessmentAnsweredIds] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [assessmentQuestionIndex, setAssessmentQuestionIndex] = useState(0);
    const [assessmentQuestionFeedback, setAssessmentQuestionFeedback] = useState(null);
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
                const loadedProgramme = p.data?.programme || s.data?.programme || null;
                setProgramme(loadedProgramme);
                setLevelAccess(p.data?.levelAccess || {});
                setSections(sortLearningSections(parseArrayResponse(s.data, "sections")));
                setEnvironmentPanorama(e.data?.panorama || null);
                setProgress(pr.data?.progress || null);

                // Also load every assigned programme in the SAME module + SAME level.
                // This makes the Learning hotspot level-aware instead of looking like
                // one programme is the whole Beginner/Intermediate/Advanced level.
                api.get("/my-training").then(allRes => {
                    if (!alive || !loadedProgramme) return;
                    const sameLevel = parseArrayResponse(allRes.data, "assignments")
                        .map(a => a.programme || a.trainingProgramme || a.programmeId)
                        .filter(item => item && typeof item === "object")
                        .filter(item => String(item.programmeType).toLowerCase() === String(loadedProgramme.programmeType).toLowerCase())
                        .filter(item => String(item.level || "beginner").toLowerCase() === String(loadedProgramme.level || "beginner").toLowerCase());
                    setLevelProgrammes(sameLevel);
                }).catch(() => setLevelProgrammes(loadedProgramme ? [loadedProgramme] : []));
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
    const completedSectionIds = useMemo(() => new Set((progress?.completedSections || []).map(id => String(id?._id || id))), [progress]);
    const currentCompleted = current?._id ? completedSectionIds.has(String(current._id)) : false;
    const canOpenSection = (index) => index === 0 || completedSectionIds.has(String(sections[index - 1]?._id));
    const currentScenario = scenarios[scenarioIndex] || null;
    const currentScenarioAttempted = currentScenario ? scenarioAttemptedIds.includes(String(currentScenario._id)) : false;
    const allScenariosAttempted = scenarios.length > 0 && scenarios.every(item => scenarioAttemptedIds.includes(String(item._id)));
    const nextRequiredAssessmentLevel = progress?.retryRequiredLevel || (!progress?.basicPassed ? "basic" : !progress?.intermediatePassed ? "intermediate" : "high");

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
                const attempted = r.data?.attemptedScenarioIds || [];
                const firstPending = rows.findIndex(item => !attempted.includes(String(item._id)));
                setScenarios(rows);
                setScenarioAttemptedIds(attempted);
                setScenarioIndex(firstPending >= 0 ? firstPending : 0);
                setScenarioResponse("");
                if (!rows.length) {
                    setActivityMessage("No active scenario has been added to this programme yet. Ask the Administrator or authorised Trainer to add and activate one from Training Programmes → Scenarios & Assessments.");
                } else if (r.data?.scenarioCompleted) {
                    setActivityMessage("Scenario exercise completed. Continue to the assessment when you are ready.");
                } else {
                    setActivityMessage("");
                }
                setOverlay("scenario");
            } catch (e) {
                const code = e.response?.data?.code;
                setActivityMessage(code === "LEARNING_INCOMPLETE" ? "Complete all Learning Sections first. The Scenario Exercise will unlock automatically." : (e.response?.data?.message || "Scenario Exercise is not available yet."));
                setOverlay("scenario");
            } finally { setActivityLoading(false); }
            return;
        }
        if (key === "quiz") { setOverlay("assessment"); await loadAssessment(nextRequiredAssessmentLevel); }
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
        const item = scenarios[scenarioIndex]; if (!item || !scenarioResponse || scenarioFeedback) return;
        setActivityLoading(true); setActivityMessage("");
        try {
            const r = await api.post(`/sprint2/trainee/${programmeId}/scenarios/${item._id}/submit`, { response: scenarioResponse });
            setScenarioFeedback({ correct: !!r.data?.correct, text: r.data?.feedback || (r.data?.correct ? "Correct." : "Incorrect. Review the feedback, then continue.") });
            setScenarioAttemptedIds(ids => Array.from(new Set([...ids, String(item._id)])));
            setProgress(r.data?.progress || progress);
        } catch (e) { setActivityMessage(e.response?.data?.message || "Unable to submit scenario response."); }
        finally { setActivityLoading(false); }
    };

    const nextScenario = () => {
        const nextIndex = scenarios.findIndex((item, index) => index > scenarioIndex && !scenarioAttemptedIds.includes(String(item._id)));
        if (nextIndex >= 0) {
            setScenarioIndex(nextIndex);
            setScenarioResponse("");
            setScenarioFeedback(null);
            setActivityMessage("");
            return;
        }
        setScenarioFeedback(null);
        setScenarioResponse("");
        setOverlay("assessment");
        loadAssessment(nextRequiredAssessmentLevel);
    };

    const loadAssessment = async (level) => {
        setActivityLoading(true);
        setActivityMessage("");
        setAssessmentResult(null);
        setAnswers({});
        setAssessmentLevel(level);
        setAssessmentAttemptId(null);
        setAssessmentAttemptNumber(null);
        setAssessmentQuestionIndex(0);
        setAssessmentQuestionFeedback(null);
        setAssessmentAnsweredIds([]);
        try {
            const r = await api.get(`/sprint2/trainee/${programmeId}/assessments/${level}`);
            const rows = r.data?.questions || [];
            const answeredRows = r.data?.answered || [];
            const answeredMap = Object.fromEntries(answeredRows.map(a => [String(a.questionId), a.answer]));
            const answeredIds = new Set(answeredRows.map(a => String(a.questionId)));
            const firstUnanswered = rows.findIndex(q => !answeredIds.has(String(q._id)));
            setQuestions(rows);
            setAnswers(answeredMap);
            setAssessmentAttemptId(r.data?.attemptId || null);
            setAssessmentAttemptNumber(r.data?.attemptNumber || null);
            setAssessmentAnsweredIds(answeredRows.map(a => String(a.questionId)));
            setAssessmentQuestionIndex(firstUnanswered >= 0 ? firstUnanswered : Math.max(0, rows.length - 1));
            if (answeredRows.length === rows.length && rows.length) {
                setActivityMessage("All questions have been answered. Finish the assessment to record your score.");
            }
        } catch (e) {
            setQuestions([]);
            setAssessmentAttemptId(null);
            setActivityMessage(e.response?.data?.message || "This assessment is not available yet.");
        } finally {
            setActivityLoading(false);
        }
    };

    const submitAssessmentQuestion = async () => {
        const q = questions[assessmentQuestionIndex];
        const answer = q ? answers[q._id] : "";
        if (!q || !answer) return;
        setActivityLoading(true);
        setActivityMessage("");
        try {
            const r = await api.post(`/sprint2/trainee/${programmeId}/assessments/${assessmentLevel}/questions/${q._id}/check`, { answer, attemptId: assessmentAttemptId });
            setAssessmentQuestionFeedback({
                correct: !!r.data?.correct,
                text: r.data?.feedback || (r.data?.correct ? "Correct." : "Incorrect. Review the feedback, then continue."),
            });
            setAssessmentAnsweredIds(ids => Array.from(new Set([...ids, String(q._id)])));
        } catch (e) {
            setActivityMessage(e.response?.data?.message || "Unable to check this response.");
        } finally {
            setActivityLoading(false);
        }
    };

    const nextAssessmentQuestion = () => {
        if (assessmentQuestionIndex < questions.length - 1) {
            setAssessmentQuestionIndex(v => v + 1);
            setAssessmentQuestionFeedback(null);
            setActivityMessage("");
        }
    };

    const submitAssessment = async () => {
        if (!assessmentAttemptId) return;
        setActivityLoading(true); setActivityMessage("");
        try {
            const r = await api.post(`/sprint2/trainee/${programmeId}/assessments/${assessmentLevel}/submit`, { attemptId: assessmentAttemptId });
            setAssessmentResult(r.data?.attempt || null);
            setProgress(r.data?.progress || progress);
            if (r.data?.relearnRequired) {
                setActivityMessage("Your score is below the pass mark. Relearn the programme sections and complete the scenario again before your next randomized attempt.");
            }
        } catch (e) { setActivityMessage(e.response?.data?.message || "Unable to submit assessment."); }
        finally { setActivityLoading(false); }
    };

    const relearnProgramme = async () => {
        await refreshProgress();
        setAssessmentResult(null);
        setQuestions([]);
        setAnswers({});
        setAssessmentAttemptId(null);
        setAssessmentQuestionFeedback(null);
        setAssessmentAnsweredIds([]);
        setSelectedSection(0);
        setOverlay("learning");
        setActivityMessage("Relearn each section, mark it complete, then repeat the scenario before starting a new quiz attempt.");
    };

    const goScene = (index) => { setSceneIndex(index); setYaw(0); setPitch(0); setFov(80); };
    const nextScene = () => goScene((sceneIndex + 1) % scenes.length);
    const prevScene = () => goScene((sceneIndex - 1 + scenes.length) % scenes.length);

    return <DashboardLayout role="trainee" title={`${programme?.title || meta.title} — 360° Training`} subtitle="Move around the environment and discover your training activities.">
        <section className="training360-flow immersive-module">
            <div className="training360-flow__viewer training360-flow__viewer--module immersive-module__viewer">
                <PanoramaCanvas src={panorama} yaw={yaw} pitch={pitch} fov={fov} onViewChange={(y, p, f) => { setYaw(y); setPitch(p); setFov(f); }} />
                <div className="training360-flow__shade" />
                <div className="immersive-module__badge"><b>{meta.title}</b><span>{programmeId ? `${pretty(programme?.level || "beginner")} Level · ${scene?.name}` : `Choose your training level · ${scene?.name}`}</span></div>
                {!overlay && <div className="immersive-scene-tools"><button onClick={() => setShowMap(v => !v)}>▣ Map</button><button onClick={prevScene}>← Previous area</button><button onClick={nextScene}>Next area →</button></div>}
                {!overlay && showMap && <aside className="immersive-map"><div className="immersive-map__head"><b>{meta.title} Map</b><button onClick={() => setShowMap(false)}>×</button></div><div className="immersive-map__floor">{scenes.map((s, i) => <button key={s.name} className={i === sceneIndex ? "active" : ""} style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => goScene(i)}><i></i><span>{s.name}</span></button>)}</div><small>Blue marker = current area · Click any area to move</small></aside>}
                {!overlay && <button className="immersive-area-hotspot immersive-area-hotspot--left" onClick={prevScene}>← <span>{scenes[(sceneIndex - 1 + scenes.length) % scenes.length]?.name}</span></button>}
                {!overlay && <button className="immersive-area-hotspot immersive-area-hotspot--right" onClick={nextScene}><span>{scenes[(sceneIndex + 1) % scenes.length]?.name}</span> →</button>}

                {!overlay && !programmeId && byLevel.map(({ level, items, gate }) => <div className="immersive-level" style={levelPositions[level]} key={level}>
                    <div className={`immersive-hotspot ${gate.unlocked ? "" : "locked"}`}>{gate.completed ? "✓" : gate.unlocked ? "→" : "🔒"}</div>
                    <div className="immersive-card">
                        <small>{pretty(level)} LEVEL</small><strong>{pretty(level)} Training</strong>
                        <span>{gate.completed ? "Completed — next level unlocked" : gate.unlocked ? `${items.length} assigned programme${items.length === 1 ? "" : "s"}` : "Pass the previous level to unlock"}</span>
                        {gate.unlocked && items.map(p => <button key={p._id} onClick={() => navigate(`/my-training/${p._id}/environment`)}>{p.title}<em>{p.passMark}% pass mark</em></button>)}
                    </div>
                </div>)}

                {!overlay && programmeId && <>
                    <button className="immersive-activity" style={activityPositions.learning} onClick={() => openActivity("learning")}><i>▤</i><span><b>Learning Sections</b><small>{sections.length} sections</small></span></button>
                    <button className="immersive-activity" style={activityPositions.scenario} onClick={() => openActivity("scenario")}><i>◎</i><span><b>Scenario Exercise</b><small>Interactive practice</small></span></button>
                    <button className="immersive-activity" style={activityPositions.quiz} onClick={() => openActivity("quiz")}><i>?</i><span><b>Assessment</b><small>Pass mark {programme?.passMark}%</small></span></button>
                    <button className="immersive-activity" style={activityPositions.progress} onClick={() => openActivity("progress")}><i>↗</i><span><b>My Progress</b><small>Scores & completion</small></span></button>
                    <button className="immersive-back" onClick={() => navigate(`/my-training/module/${encodeURIComponent(type)}/environment`)}>← Levels</button>
                </>}

                {overlay === "learning" && <div className="immersive-overlay immersive-overlay--learning">
                    <div className="immersive-overlay__head"><div><small>{pretty(programme?.level || "beginner")} LEVEL LEARNING</small><h3>{meta.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-level-programmes">
                        <span>Programmes in this level</span>
                        <div>{(levelProgrammes.length ? levelProgrammes : (programme ? [programme] : [])).map(p => <button key={p._id} className={String(p._id) === String(programmeId) ? "active" : ""} onClick={() => { if (String(p._id) !== String(programmeId)) navigate(`/my-training/${p._id}/environment`); }}><b>{p.title}</b><small>{p.passMark}% pass mark</small></button>)}</div>
                    </div>
                    <div className="immersive-overlay__body">
                        <nav>{sections.map((s, i) => { const done = completedSectionIds.has(String(s._id)); const unlocked = canOpenSection(i); return <button disabled={!unlocked} className={`${i === selectedSection ? "active" : ""} ${done ? "completed" : ""} ${!unlocked ? "locked" : ""}`} key={s._id || i} onClick={() => unlocked && setSelectedSection(i)}><b>{done ? "✓" : i + 1}</b><span>{s.title}</span></button>; })}</nav>
                        <article>{current ? <><small>SECTION {selectedSection + 1} OF {sections.length}</small><h2>{current.title}</h2>{String(current.content || "No content added yet.").split(/\n+/).map((x, i) => <p key={i}>{x}</p>)}<div className="immersive-overlay__nav"><button disabled={!selectedSection} onClick={() => setSelectedSection(v => v - 1)}>← Previous</button><button className={currentCompleted ? "section-complete" : ""} onClick={completeLearningSection} disabled={activityLoading || currentCompleted}>{activityLoading ? "Saving…" : currentCompleted ? "✓ Completed" : "Mark Complete"}</button>{selectedSection < sections.length - 1 ? <button disabled={!currentCompleted} title={!currentCompleted ? "Mark this section complete first" : ""} onClick={() => currentCompleted && setSelectedSection(v => v + 1)}>Next →</button> : progress?.learningCompleted ? <button className="immersive-primary" onClick={() => openActivity("scenario")}>Continue to Scenario →</button> : <button disabled>Complete this section first</button>}</div>{activityMessage && <p className="immersive-status">{activityMessage}</p>}</> : <p>No active learning sections are available.</p>}</article>
                    </div>
                </div>}

                {overlay === "scenario" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>SCENARIO EXERCISE</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single">
                        {activityLoading && <p>Loading scenario…</p>}
                        {activityMessage && <div className="immersive-notice">{activityMessage}</div>}
                        {currentScenario && (!allScenariosAttempted || scenarioFeedback) && <article><small>SCENARIO {scenarioIndex + 1} OF {scenarios.length}</small><h2>{currentScenario.title}</h2><p>{currentScenario.prompt}</p>
                            <div className="immersive-options">{currentScenario.options?.length ? currentScenario.options.map(o => <label key={o}><input type="radio" name="scenarioResponse" checked={scenarioResponse === o} disabled={!!scenarioFeedback || currentScenarioAttempted} onChange={() => !scenarioFeedback && !currentScenarioAttempted && setScenarioResponse(o)} /><span>{o}</span></label>) : <textarea value={scenarioResponse} disabled={!!scenarioFeedback || currentScenarioAttempted} onChange={e => setScenarioResponse(e.target.value)} placeholder="Enter your response" />}</div>
                            <div className="immersive-overlay__nav immersive-assessment-nav">
                                <span></span>
                                {!scenarioFeedback && !currentScenarioAttempted ? <button className="immersive-primary" disabled={!scenarioResponse || activityLoading} onClick={submitScenario}>{activityLoading ? "Submitting…" : "Submit Response"}</button> : <span></span>}
                                {(scenarioFeedback || currentScenarioAttempted) ? <button className="immersive-primary" onClick={nextScenario}>{scenarioIndex < scenarios.length - 1 ? "Next Scenario →" : "Continue to Assessment →"}</button> : <button disabled>{scenarioIndex < scenarios.length - 1 ? "Next Scenario →" : "Continue to Assessment →"}</button>}
                            </div>
                            {scenarioFeedback && <div className={`immersive-feedback ${scenarioFeedback.correct ? "correct" : "incorrect"}`}><b>{scenarioFeedback.correct ? "Correct" : "Incorrect — attempt recorded"}</b><p>{scenarioFeedback.text}</p></div>}
                        </article>}
                        {scenarios.length > 0 && allScenariosAttempted && !scenarioFeedback && <div className="immersive-result passed"><h2>Scenario exercise completed</h2><p>Each scenario has been answered once. Continue to the assessment.</p><button className="immersive-primary" onClick={() => { setOverlay("assessment"); loadAssessment(nextRequiredAssessmentLevel); }}>Continue to Assessment →</button></div>}
                    </div>
                </div>}

                {overlay === "assessment" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>ASSESSMENT</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single">
                        <div className="immersive-assessment-tabs">{["basic", "intermediate", "high"].map(l => <button key={l} className={assessmentLevel === l ? "active" : ""} onClick={() => loadAssessment(l)}>{pretty(l)}</button>)}</div>
                        <p>Programme pass mark: <b>{programme?.passMark}%</b>. Each attempt uses up to 10 randomly selected questions from the active question pool. Each question can be answered once.</p>
                        {assessmentAttemptNumber && <p className="immersive-attempt-note">Attempt <b>{assessmentAttemptNumber}</b> · {questions.length || 0} question{questions.length === 1 ? "" : "s"} in this attempt</p>}
                        {activityMessage && <div className="immersive-notice">{activityMessage}</div>}
                        {!!questions.length && !assessmentResult && (() => {
                            const q = questions[assessmentQuestionIndex];
                            const selected = q ? (answers[q._id] || "") : "";
                            const isLast = assessmentQuestionIndex === questions.length - 1;
                            const alreadyAnswered = q ? assessmentAnsweredIds.includes(String(q._id)) : false;
                            return q ? <div className="immersive-question immersive-question--single" key={q._id}>
                                <small>QUESTION {assessmentQuestionIndex + 1} OF {questions.length}</small>
                                <h2>{q.question}</h2>
                                <div className="immersive-options">
                                    {q.options?.map(o => <label key={o}>
                                        <input type="radio" name={`assessment-${q._id}`} checked={selected === o} disabled={!!assessmentQuestionFeedback || alreadyAnswered} onChange={() => { if (!alreadyAnswered) { setAnswers(a => ({ ...a, [q._id]: o })); setAssessmentQuestionFeedback(null); } }} />
                                        <span>{o}</span>
                                    </label>)}
                                </div>
                                <div className="immersive-overlay__nav immersive-assessment-nav">
                                    <span></span>
                                    {!assessmentQuestionFeedback && !alreadyAnswered
                                        ? <button className="immersive-primary" onClick={submitAssessmentQuestion} disabled={!selected || activityLoading || !assessmentAttemptId}>{activityLoading ? "Checking…" : "Submit Response"}</button>
                                        : <span></span>}
                                    {(assessmentQuestionFeedback || alreadyAnswered) && !isLast
                                        ? <button className="immersive-primary" onClick={nextAssessmentQuestion}>Next Question →</button>
                                        : (assessmentQuestionFeedback || alreadyAnswered) && isLast
                                            ? <button className="immersive-primary" onClick={submitAssessment} disabled={activityLoading || assessmentAnsweredIds.length !== questions.length}>{activityLoading ? "Saving…" : "Finish Assessment →"}</button>
                                            : <button disabled>Next Question →</button>}
                                </div>
                                {assessmentQuestionFeedback && <div className={`immersive-feedback ${assessmentQuestionFeedback.correct ? "correct" : "incorrect"}`}>
                                    <b>{assessmentQuestionFeedback.correct ? "Correct" : "Incorrect"}</b>
                                    <p>{assessmentQuestionFeedback.text}</p>
                                </div>}
                            </div> : null;
                        })()}
                        {assessmentResult && <div className={`immersive-result ${assessmentResult.passed ? "passed" : "failed"}`}><h2>{assessmentResult.passed ? "Passed" : "Pass mark not reached"}</h2><p>Score: <b>{assessmentResult.percentage}%</b> · Required: <b>{programme?.passMark}%</b> · Attempt {assessmentResult.attemptNumber}</p>{assessmentResult.passed && assessmentLevel !== "high" ? <button className="immersive-primary" onClick={() => loadAssessment(assessmentLevel === "basic" ? "intermediate" : "high")}>Next Assessment →</button> : !assessmentResult.passed ? <button className="immersive-primary" onClick={relearnProgramme}>Relearn Sections →</button> : <button className="immersive-primary" onClick={() => navigate(`/my-training/module/${encodeURIComponent(type)}/environment`)}>Return to Levels →</button>}</div>}
                    </div>
                </div>}

                {overlay === "progress" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>MY PROGRESS</small><h3>{programme?.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single"><div className="immersive-progress-grid"><div><span>Overall</span><b>{progress?.progress || 0}%</b></div><div><span>Learning</span><b>{progress?.learningCompleted ? "Complete" : "In progress"}</b></div><div><span>Scenario</span><b>{progress?.scenarioCompleted ? "Complete" : "Pending"}</b></div><div><span>Basic</span><b>{progress?.basicPassed ? "Passed" : "Pending"}</b></div><div><span>Intermediate</span><b>{progress?.intermediatePassed ? "Passed" : "Locked / pending"}</b></div><div><span>High</span><b>{progress?.highPassed ? "Passed" : "Locked / pending"}</b></div></div></div>
                </div>}

                {!overlay && <div className="training360-flow__controls"><button onClick={() => setFov(v => Math.max(45, v - 8))}>+</button><button onClick={() => setFov(v => Math.min(105, v + 8))}>−</button></div>}
                {!overlay && <div className="immersive-hint">Drag left/right to explore • Scroll to zoom • Click a hotspot to open training</div>}
                {error && <div className="training360-flow__message training360-flow__message--overlay training360-flow__message--error">{error}</div>}
            </div>
        </section>
    </DashboardLayout>;
}
