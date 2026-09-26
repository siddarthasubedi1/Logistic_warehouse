import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { PanoramaCanvas } from "./Trainee360Environment";
import api, { API_BASE_URL } from "../../services/api";
import { parseArrayResponse, sortLearningSections } from "../../utils/training";
import "./Training360Flow.css";

const LEVELS = ["beginner", "intermediate", "advanced"];
const ASSESSMENT_LEVEL_BY_PROGRAMME_LEVEL = {
    beginner: "basic",
    intermediate: "intermediate",
    advanced: "high",
};
const pretty = (v) => String(v || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const canonicalProgrammeLevel = (value) => ({
    easy: "beginner",
    basic: "beginner",
    beginner: "beginner",
    medium: "intermediate",
    intermediate: "intermediate",
    high: "advanced",
    advanced: "advanced",
}[String(value || "").trim().toLowerCase()] || "beginner");
const sortProgrammes = (items = []) => [...items].sort((a, b) => {
    const aTime = new Date(a?.createdAt || 0).getTime();
    const bTime = new Date(b?.createdAt || 0).getTime();
    if (aTime !== bTime) return aTime - bTime;
    return String(a?._id || "").localeCompare(String(b?._id || ""));
});

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
    const [scenarioAttemptedIds, setScenarioAttemptedIds] = useState([]);
    const [scenarioAttemptId, setScenarioAttemptId] = useState(null);
    const [scenarioAttemptNumber, setScenarioAttemptNumber] = useState(null);
    const [scenarioResult, setScenarioResult] = useState(null);
    const [assessmentLevel, setAssessmentLevel] = useState("basic");
    const [assessmentAttemptId, setAssessmentAttemptId] = useState(null);
    const [assessmentAttemptNumber, setAssessmentAttemptNumber] = useState(null);
    const [assessmentAnsweredIds, setAssessmentAnsweredIds] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [assessmentResult, setAssessmentResult] = useState(null);
    const [assessmentQuestionIndex, setAssessmentQuestionIndex] = useState(0);
    const [assessmentQuestionFeedback, setAssessmentQuestionFeedback] = useState(null);
    const [assessmentResultDetails, setAssessmentResultDetails] = useState(null);
    const [activityLoading, setActivityLoading] = useState(false);
    const [activityMessage, setActivityMessage] = useState("");

    useEffect(() => {
        let alive = true;
        if (programmeId) {
            Promise.all([
                api.get(`/my-training/${programmeId}`),
                api.get(`/my-training/${programmeId}/sections`).catch(() => ({ data: { sections: [] } })),
                api.get(`/programmes/${programmeId}/environment`).catch(() => ({ data: { panorama: null } })),
                api.get(`/training-content/trainee/${programmeId}/progress`).catch(() => ({ data: { progress: null } })),
            ]).then(([p, s, e, pr]) => {
                if (!alive) return;
                const canonicalProgrammeId = p.data?.canonicalProgrammeId || s.data?.canonicalProgrammeId;
                if (canonicalProgrammeId && String(canonicalProgrammeId) !== String(programmeId)) {
                    navigate(`/my-training/${canonicalProgrammeId}/environment`, { replace: true });
                    return;
                }
                setError("");
                const loadedProgramme = p.data?.programme || s.data?.programme || null;
                setProgramme(loadedProgramme);
                setLevelAccess(p.data?.levelAccess || {});
                setSections(sortLearningSections(parseArrayResponse(s.data, "sections")));
                setEnvironmentPanorama(e.data?.panorama || null);
                setProgress(pr.data?.progress || null);

                // Keep the complete assigned module pathway in memory. This is
                // required after a pass so the newly unlocked Intermediate/Advanced
                // programme can be opened immediately instead of showing an unlocked
                // level with no working navigation target.
                api.get("/my-training").then(allRes => {
                    if (!alive || !loadedProgramme) return;
                    const moduleKey = String(loadedProgramme.programmeType || "").trim().toLowerCase();
                    const allInModule = sortProgrammes(parseArrayResponse(allRes.data, "assignments")
                        .map(a => a.programme || a.trainingProgramme || a.programmeId)
                        .filter(item => item && typeof item === "object")
                        .filter(item => String(item.programmeType || "").trim().toLowerCase() === moduleKey));
                    setProgrammes(allInModule);
                    setLevelAccess(allRes.data?.levelAccess?.[moduleKey] || p.data?.levelAccess || {});
                }).catch(() => {
                    setProgrammes(loadedProgramme ? [loadedProgramme] : []);
                });
            }).catch(err => alive && setError(err?.response?.data?.message || "Unable to load this training programme."));
        } else if (moduleType) {
            api.get("/my-training").then(res => {
                if (!alive) return;
                setError("");
                const all = sortProgrammes(parseArrayResponse(res.data, "assignments")
                    .map(a => a.programme || a.trainingProgramme || a.programmeId)
                    .filter(p => p && typeof p === "object" && String(p.programmeType).toLowerCase() === String(moduleType).toLowerCase()));
                setProgrammes(all);
                setLevelAccess(res.data?.levelAccess?.[String(moduleType || "").trim().toLowerCase()] || {});
            }).catch(err => alive && setError(err?.response?.data?.message || "Unable to load this module."));
        }
        return () => { alive = false; };
    }, [programmeId, moduleType, navigate]);

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
    const meta = useMemo(() => metaMap[type] || ({
        title: pretty(type),
        scenes: [{ name: "Training Area", panorama: "/panoramas/training-selection.png", x: 50, y: 50, note: "Training environment" }],
    }), [metaMap, type]);
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
    const programmeLevel = canonicalProgrammeLevel(programme?.level);
    const requiredAssessmentLevel = progress?.retryRequiredLevel
        || ASSESSMENT_LEVEL_BY_PROGRAMME_LEVEL[programmeLevel]
        || "basic";
    const requiredPassField = { basic: "basicPassed", intermediate: "intermediatePassed", high: "highPassed" }[requiredAssessmentLevel] || "basicPassed";
    const currentLevelAssessmentPassed = !!progress?.[requiredPassField];
    const canOpenScenario = !!progress?.learningCompleted;
    const canOpenAssessment = !!progress?.learningCompleted && !!progress?.scenarioCompleted;
    const nextProgrammeLevel = programmeLevel === "beginner" ? "intermediate" : programmeLevel === "intermediate" ? "advanced" : null;
    const nextProgrammeLevelUnlocked = nextProgrammeLevel ? !!levelAccess?.[nextProgrammeLevel]?.unlocked : false;

    const byLevel = LEVELS.map(level => ({ level, items: sortProgrammes(programmes.filter(p => canonicalProgrammeLevel(p.level) === level)), gate: levelAccess[level] || { unlocked: false, completed: false, available: false, assignedCount: 0 } }));
    const levelPositions = { beginner: { left: "19%", top: "52%" }, intermediate: { left: "50%", top: "38%" }, advanced: { left: "80%", top: "55%" } };
    const activityPositions = {
        learning: { left: "18%", top: "50%" }, scenario: { left: "42%", top: "35%" }, quiz: { left: "68%", top: "46%" }, progress: { left: "84%", top: "66%" }
    };

    const refreshProgress = async () => {
        if (!programmeId) return null;
        try { const r = await api.get(`/training-content/trainee/${programmeId}/progress`); setProgress(r.data?.progress || null); return r.data?.progress || null; }
        catch { return null; }
    };

    const refreshModuleAssignments = async () => {
        try {
            const response = await api.get("/my-training");
            const moduleKey = String(type || "").trim().toLowerCase();
            const allInModule = parseArrayResponse(response.data, "assignments")
                .map(a => a.programme || a.trainingProgramme || a.programmeId)
                .filter(item => item && typeof item === "object")
                .filter(item => String(item.programmeType || "").trim().toLowerCase() === moduleKey);
            const access = response.data?.levelAccess?.[moduleKey] || {};
            setProgrammes(sortProgrammes(allInModule));
            setLevelAccess(access);
            return { programmes: sortProgrammes(allInModule), access };
        } catch {
            return { programmes, access: levelAccess };
        }
    };

    const continueToNextLevel = async () => {
        if (!nextProgrammeLevel) {
            navigate(`/my-training/module/${encodeURIComponent(type)}/environment`);
            return;
        }

        setActivityLoading(true);
        const snapshot = await refreshModuleAssignments();
        setActivityLoading(false);
        const nextItems = snapshot.programmes.filter(
            item => canonicalProgrammeLevel(item.level) === nextProgrammeLevel
        );
        const unlocked = !!snapshot.access?.[nextProgrammeLevel]?.unlocked;

        if (unlocked && nextItems.length) {
            navigate(`/my-training/${nextItems[0]._id}/environment`);
            return;
        }

        navigate(`/my-training/module/${encodeURIComponent(type)}/environment`);
    };

    const openActivity = async (key) => {
        setActivityMessage("");
        if (key === "learning") return setOverlay("learning");
        if (key === "progress") { await refreshProgress(); return setOverlay("progress"); }
        if (key === "scenario") {
            setActivityLoading(true);
            try {
                const r = await api.get(`/training-content/trainee/${programmeId}/scenarios`);
                const rows = r.data?.scenarios || [];
                const attempted = r.data?.attemptedScenarioIds || [];
                const firstPending = rows.findIndex(item => !attempted.includes(String(item._id)));
                setScenarios(rows);
                setScenarioAttemptedIds(attempted);
                setScenarioAttemptId(r.data?.scenarioAttemptId || null);
                setScenarioAttemptNumber(r.data?.scenarioAttemptNumber || null);
                setScenarioResult(null);
                setScenarioIndex(firstPending >= 0 ? firstPending : 0);
                setScenarioResponse("");
                if (!rows.length) {
                    setActivityMessage("No active scenario has been added to this programme yet. Ask the Administrator or authorised Trainer to add and activate one from Training Programmes → Scenarios & Assessments.");
                } else if (r.data?.scenarioCompleted) {
                    setActivityMessage("");
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
        if (key === "quiz") { setOverlay("assessment"); await loadAssessment(requiredAssessmentLevel); }
    };

    const completeLearningSection = async () => {
        if (!current?._id) return;
        setActivityLoading(true); setActivityMessage("");
        try {
            const r = await api.post(`/training-content/trainee/${programmeId}/sections/${current._id}/complete`);
            const updatedProgress = r.data?.progress || progress;
            setProgress(updatedProgress);

            if (updatedProgress?.learningCompleted) {
                setActivityMessage("");
                await openActivity("scenario");
            } else {
                setActivityMessage("Section completed. Your progress has been saved.");
                if (selectedSection < sections.length - 1) setSelectedSection(v => v + 1);
            }
        } catch (e) { setActivityMessage(e.response?.data?.message || "Unable to save section completion."); }
        finally { setActivityLoading(false); }
    };

    const submitScenario = async () => {
        const item = scenarios[scenarioIndex];
        if (!item || !scenarioResponse || currentScenarioAttempted || !scenarioAttemptId) return;

        setActivityLoading(true);
        setActivityMessage("");
        try {
            const r = await api.post(
                `/training-content/trainee/${programmeId}/scenarios/${item._id}/submit`,
                { response: scenarioResponse, attemptId: scenarioAttemptId }
            );

            const nextAttempted = Array.from(new Set([...scenarioAttemptedIds, String(item._id)]));
            setScenarioAttemptedIds(nextAttempted);
            setProgress(r.data?.progress || progress);
            setScenarioAttemptId(r.data?.attemptId || scenarioAttemptId);
            setScenarioAttemptNumber(r.data?.attemptNumber || scenarioAttemptNumber);

            if (r.data?.exerciseCompleted) {
                setActivityMessage("");
            } else {
                setActivityMessage("Response recorded. Continue to the next scenario.");
            }
        } catch (e) {
            setActivityMessage(e.response?.data?.message || "Unable to submit scenario response.");
        } finally {
            setActivityLoading(false);
        }
    };

    const nextScenario = () => {
        const nextIndex = scenarios.findIndex(
            (item, index) => index > scenarioIndex && !scenarioAttemptedIds.includes(String(item._id))
        );
        if (nextIndex >= 0) {
            setScenarioIndex(nextIndex);
            setScenarioResponse("");
            setActivityMessage("");
        }
    };

    const viewScenarioResult = async () => {
        if (!scenarioAttemptId) return;
        setActivityLoading(true);
        setActivityMessage("");
        try {
            const r = await api.get(
                `/training-content/trainee/${programmeId}/scenario-attempts/${scenarioAttemptId}/result`
            );
            setScenarioResult(r.data || null);
        } catch (e) {
            setActivityMessage(e.response?.data?.message || "Unable to load scenario result.");
        } finally {
            setActivityLoading(false);
        }
    };

    const loadAssessment = async (level) => {
        setActivityLoading(true);
        setActivityMessage("");
        setAssessmentResult(null);
        setAssessmentResultDetails(null);
        setAnswers({});
        setAssessmentLevel(level);
        setAssessmentAttemptId(null);
        setAssessmentAttemptNumber(null);
        setAssessmentQuestionIndex(0);
        setAssessmentQuestionFeedback(null);
        setAssessmentAnsweredIds([]);
        try {
            const r = await api.get(`/training-content/trainee/${programmeId}/assessments/${level}`);
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
        if (!q || !answer || !assessmentAttemptId) return;

        setActivityLoading(true);
        setActivityMessage("");
        try {
            await api.post(
                `/training-content/trainee/${programmeId}/assessments/${assessmentLevel}/questions/${q._id}/check`,
                { answer, attemptId: assessmentAttemptId }
            );
            setAssessmentQuestionFeedback({ recorded: true });
            setAssessmentAnsweredIds(ids => Array.from(new Set([...ids, String(q._id)])));
            setActivityMessage("Response recorded. Your result will be shown after you finish the assessment.");
        } catch (e) {
            setActivityMessage(e.response?.data?.message || "Unable to save this response.");
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
        setActivityLoading(true);
        setActivityMessage("");
        try {
            const r = await api.post(
                `/training-content/trainee/${programmeId}/assessments/${assessmentLevel}/submit`,
                { attemptId: assessmentAttemptId }
            );
            setAssessmentResult(r.data?.attempt || null);
            setAssessmentResultDetails(null);
            setProgress(r.data?.progress || progress);
            if (r.data?.levelAccess) setLevelAccess(r.data.levelAccess);
            if (r.data?.attempt?.passed) await refreshModuleAssignments();
            setActivityMessage("");
        } catch (e) {
            setActivityMessage(e.response?.data?.message || "Unable to submit assessment.");
        } finally {
            setActivityLoading(false);
        }
    };

    const viewAssessmentResult = async () => {
        if (!assessmentResult?._id) return;
        setActivityLoading(true);
        setActivityMessage("");
        try {
            const r = await api.get(
                `/training-content/trainee/${programmeId}/assessments/${assessmentLevel}/attempts/${assessmentResult._id}/result`
            );
            setAssessmentResultDetails(r.data || null);
        } catch (e) {
            setActivityMessage(e.response?.data?.message || "Unable to load assessment result.");
        } finally {
            setActivityLoading(false);
        }
    };

    const relearnProgramme = async () => {
        await refreshProgress();
        setAssessmentResult(null);
        setAssessmentResultDetails(null);
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

    return <DashboardLayout role="trainee" title={programmeId ? `${meta.title} — ${pretty(programmeLevel)} Level Training` : `${meta.title} — Training Levels`} subtitle="Move around the environment and discover your training activities.">
        <section className="training360-flow immersive-module">
            <div className="training360-flow__viewer training360-flow__viewer--module immersive-module__viewer">
                <PanoramaCanvas src={panorama} yaw={yaw} pitch={pitch} fov={fov} onViewChange={(y, p, f) => { setYaw(y); setPitch(p); setFov(f); }} />
                <div className="training360-flow__shade" />
                <div className="immersive-module__badge"><b>{meta.title}</b><span>{programmeId ? `${pretty(canonicalProgrammeLevel(programme?.level))} Level · ${scene?.name}` : `Choose your training level · ${scene?.name}`}</span></div>
                {!overlay && <div className="immersive-scene-tools"><button onClick={() => setShowMap(v => !v)}>▣ Map</button><button onClick={prevScene}>← Previous area</button><button onClick={nextScene}>Next area →</button></div>}
                {!overlay && showMap && <aside className="immersive-map"><div className="immersive-map__head"><b>{meta.title} Map</b><button onClick={() => setShowMap(false)}>×</button></div><div className="immersive-map__floor">{scenes.map((s, i) => <button key={s.name} className={i === sceneIndex ? "active" : ""} style={{ left: `${s.x}%`, top: `${s.y}%` }} onClick={() => goScene(i)}><i></i><span>{s.name}</span></button>)}</div><small>Blue marker = current area · Click any area to move</small></aside>}
                {!overlay && <button className="immersive-area-hotspot immersive-area-hotspot--left" onClick={prevScene}>← <span>{scenes[(sceneIndex - 1 + scenes.length) % scenes.length]?.name}</span></button>}
                {!overlay && <button className="immersive-area-hotspot immersive-area-hotspot--right" onClick={nextScene}><span>{scenes[(sceneIndex + 1) % scenes.length]?.name}</span> →</button>}

                {!overlay && !programmeId && byLevel.map(({ level, items, gate }) => {
                    const primary = items[0] || null;
                    const canOpenLevel = !!gate.unlocked && !!primary;
                    const levelMessage = gate.completed
                        ? "Completed"
                        : canOpenLevel
                            ? "Ready to open"
                            : !primary
                                ? `No active ${pretty(level)} training available`
                                : "Pass the previous level to unlock";
                    return <div className="immersive-level" style={levelPositions[level]} key={level}>
                        <button
                            type="button"
                            className={`immersive-hotspot ${canOpenLevel ? "" : "locked"}`}
                            disabled={!canOpenLevel}
                            onClick={() => canOpenLevel && navigate(`/my-training/${primary._id}/environment`)}
                            aria-label={canOpenLevel ? `Open ${pretty(level)} level` : `${pretty(level)} level locked`}
                        >{gate.completed ? "✓" : canOpenLevel ? "→" : "🔒"}</button>
                        <div className="immersive-card">
                            <small>{pretty(level)} LEVEL</small><strong>{pretty(level)} Training</strong>
                            <span>{levelMessage}</span>
                            {primary && <button disabled={!canOpenLevel} onClick={() => canOpenLevel && navigate(`/my-training/${primary._id}/environment`)}>
                                {pretty(level)} Level Training
                                <em>{primary.passMark}% overall pass mark</em>
                            </button>}
                        </div>
                    </div>;
                })}

                {!overlay && programmeId && <>
                    <button className="immersive-activity" style={activityPositions.learning} onClick={() => openActivity("learning")}><i>▤</i><span><b>{pretty(programmeLevel)} Learning</b><small>{sections.length} sections</small></span></button>
                    <button
                        className={`immersive-activity ${canOpenScenario ? "" : "locked"}`}
                        style={activityPositions.scenario}
                        onClick={() => canOpenScenario && openActivity("scenario")}
                        disabled={!canOpenScenario}
                        title={!canOpenScenario ? `Complete all ${pretty(programmeLevel)} learning sections first` : ""}
                    ><i>{canOpenScenario ? "◎" : "🔒"}</i><span><b>{pretty(programmeLevel)} Scenario</b><small>{canOpenScenario ? "Interactive practice" : "Complete learning first"}</small></span></button>
                    <button
                        className={`immersive-activity ${canOpenAssessment ? "" : "locked"}`}
                        style={activityPositions.quiz}
                        onClick={() => canOpenAssessment && openActivity("quiz")}
                        disabled={!canOpenAssessment}
                        title={!canOpenAssessment ? `Complete the ${pretty(programmeLevel)} scenario first` : ""}
                    ><i>{canOpenAssessment ? "?" : "🔒"}</i><span><b>{pretty(programmeLevel)} Assessment</b><small>{currentLevelAssessmentPassed ? "Passed" : canOpenAssessment ? `Pass mark ${programme?.passMark}%` : "Complete scenario first"}</small></span></button>
                    <button className="immersive-activity" style={activityPositions.progress} onClick={() => openActivity("progress")}><i>↗</i><span><b>{pretty(programmeLevel)} Progress</b><small>Scores & completion</small></span></button>
                    <button className="immersive-back" onClick={() => navigate(`/my-training/module/${encodeURIComponent(type)}/environment`)}>← Levels</button>
                </>}

                {overlay === "learning" && <div className="immersive-overlay immersive-overlay--learning">
                    <div className="immersive-overlay__head"><div><small>{pretty(canonicalProgrammeLevel(programme?.level))} LEVEL LEARNING</small><h3>{meta.title}</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__body">
                        <nav>{sections.map((s, i) => { const done = completedSectionIds.has(String(s._id)); const unlocked = canOpenSection(i); return <button disabled={!unlocked} className={`${i === selectedSection ? "active" : ""} ${done ? "completed" : ""} ${!unlocked ? "locked" : ""}`} key={s._id || i} onClick={() => unlocked && setSelectedSection(i)}><b>{done ? "✓" : i + 1}</b><span>{s.title}</span></button>; })}</nav>
                        <article>{current ? <><small>SECTION {selectedSection + 1} OF {sections.length}</small><h2>{current.title}</h2>{String(current.content || "No content added yet.").split(/\n+/).map((x, i) => <p key={i}>{x}</p>)}<div className="immersive-overlay__nav"><button disabled={!selectedSection} onClick={() => setSelectedSection(v => v - 1)}>← Previous</button><button className={currentCompleted ? "section-complete" : ""} onClick={completeLearningSection} disabled={activityLoading || currentCompleted}>{activityLoading ? "Saving…" : currentCompleted ? "✓ Completed" : "Mark Complete"}</button>{selectedSection < sections.length - 1 ? <button disabled={!currentCompleted} title={!currentCompleted ? "Mark this section complete first" : ""} onClick={() => currentCompleted && setSelectedSection(v => v + 1)}>Next →</button> : progress?.learningCompleted ? <button className="immersive-primary" onClick={() => openActivity("scenario")}>Continue to Scenario →</button> : <button disabled>Complete this section first</button>}</div>{activityMessage && <p className="immersive-status">{activityMessage}</p>}</> : <p>No active learning sections are available.</p>}</article>
                    </div>
                </div>}

                {overlay === "scenario" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head">
                        <div>
                            <small>{pretty(programmeLevel)} LEVEL SCENARIO EXERCISE</small>
                            <h3>{meta.title} · {pretty(programmeLevel)} Level</h3>
                        </div>
                        <button onClick={() => setOverlay(null)}>×</button>
                    </div>
                    <div className="immersive-overlay__single">
                        {activityLoading && !scenarios.length && <p>Loading scenario…</p>}
                        {activityMessage && <div className="immersive-notice">{activityMessage}</div>}

                        {currentScenario && !allScenariosAttempted && <article>
                            <small>
                                SCENARIO {scenarioIndex + 1} OF {scenarios.length}
                                {scenarioAttemptNumber ? ` · ATTEMPT ${scenarioAttemptNumber}` : ""}
                            </small>
                            <h2>{currentScenario.title}</h2>
                            <p>{currentScenario.prompt}</p>

                            <div className="immersive-options">
                                {currentScenario.options?.length
                                    ? currentScenario.options.map(o => <label key={o}>
                                        <input
                                            type="radio"
                                            name="scenarioResponse"
                                            checked={scenarioResponse === o}
                                            disabled={currentScenarioAttempted}
                                            onChange={() => !currentScenarioAttempted && setScenarioResponse(o)}
                                        />
                                        <span>{o}</span>
                                    </label>)
                                    : <textarea
                                        value={scenarioResponse}
                                        disabled={currentScenarioAttempted}
                                        onChange={e => setScenarioResponse(e.target.value)}
                                        placeholder="Enter your response"
                                    />}
                            </div>

                            <div className="immersive-overlay__nav immersive-assessment-nav">
                                <span></span>

                                {!currentScenarioAttempted
                                    ? <button
                                        className="immersive-primary"
                                        disabled={!scenarioResponse || activityLoading || !scenarioAttemptId}
                                        onClick={submitScenario}
                                    >
                                        {activityLoading ? "Saving…" : "Submit Response"}
                                    </button>
                                    : <span></span>}

                                {currentScenarioAttempted && scenarioIndex < scenarios.length - 1
                                    ? <button className="immersive-primary" onClick={nextScenario}>
                                        Next Scenario →
                                    </button>
                                    : <span></span>}
                            </div>

                            {currentScenarioAttempted && (
                                <div className="immersive-response-recorded">
                                    Response recorded. Correct and incorrect answers are hidden until the exercise is finished.
                                </div>
                            )}
                        </article>}

                        {scenarios.length > 0 && allScenariosAttempted && !scenarioResult && (
                            <div className="immersive-result passed">
                                <h2>Scenario exercise submitted</h2>
                                <p>
                                    {scenarioAttemptId
                                        ? <>Attempt <b>{scenarioAttemptNumber || 1}</b> is complete. View the result to see your responses and the correct answers.</>
                                        : <>Scenario exercise is already complete. Detailed review will be available for your next recorded scenario attempt.</>}
                                </p>
                                <div className="immersive-result-actions">
                                    {scenarioAttemptId && <button className="immersive-primary" onClick={viewScenarioResult} disabled={activityLoading}>
                                        {activityLoading ? "Loading…" : "View Result"}
                                    </button>}
                                    <button className="immersive-secondary" onClick={() => {
                                        setOverlay("assessment");
                                        loadAssessment(requiredAssessmentLevel);
                                    }}>
                                        Continue to Assessment →
                                    </button>
                                </div>
                            </div>
                        )}

                        {scenarioResult && (
                            <div className="immersive-review">
                                <div className="immersive-review__summary">
                                    <div>
                                        <small>SCENARIO RESULT</small>
                                        <h2>Attempt {scenarioResult.attempt?.attemptNumber}</h2>
                                    </div>
                                    <strong>
                                        {scenarioResult.attempt?.score}/{scenarioResult.attempt?.totalScenarios}
                                    </strong>
                                </div>

                                <div className="immersive-review__list">
                                    {(scenarioResult.results || []).map((item, index) => (
                                        <article className={`immersive-review-card ${item.correct ? "correct" : "incorrect"}`} key={String(item.scenarioId || index)}>
                                            <small>SCENARIO {index + 1}</small>
                                            <h3>{item.title}</h3>
                                            <p>{item.prompt}</p>
                                            <div className="immersive-review-answer">
                                                <span>Your answer</span>
                                                <b>{(item.selectedResponses || []).join(", ") || "No response"}</b>
                                            </div>
                                            <div className="immersive-review-answer immersive-review-answer--correct">
                                                <span>Correct answer</span>
                                                <b>{(item.correctResponses || []).join(", ")}</b>
                                            </div>
                                            {item.feedback && <p className="immersive-review-feedback">{item.feedback}</p>}
                                        </article>
                                    ))}
                                </div>

                                <div className="immersive-result-actions">
                                    <button className="immersive-secondary" onClick={() => setScenarioResult(null)}>
                                        Back to Summary
                                    </button>
                                    <button className="immersive-primary" onClick={() => {
                                        setOverlay("assessment");
                                        loadAssessment(requiredAssessmentLevel);
                                    }}>
                                        Continue to Assessment →
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>}

                {overlay === "assessment" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head">
                        <div>
                            <small>{pretty(programmeLevel)} LEVEL ASSESSMENT</small>
                            <h3>{meta.title} · {pretty(programmeLevel)} Level</h3>
                        </div>
                        <button onClick={() => setOverlay(null)}>×</button>
                    </div>

                    <div className="immersive-overlay__single">
                        <div className="immersive-assessment-tabs immersive-assessment-tabs--single">
                            <button className="active" disabled>
                                {pretty(programmeLevel)} Level Assessment
                            </button>
                        </div>

                        <p>
                            This page contains only the <b>{pretty(programmeLevel)}</b> level assessment.
                            Overall level pass mark: <b>{programme?.passMark}%</b>.
                            Each attempt uses 10 randomly selected questions from a bank of at least 30 for this level.
                            Question order and option positions are shuffled between attempts. Correct answers are shown only after the assessment is submitted.
                        </p>

                        {assessmentAttemptNumber && !assessmentResult && (
                            <p className="immersive-attempt-note">
                                Attempt <b>{assessmentAttemptNumber}</b> · {questions.length || 0}
                                {" "}question{questions.length === 1 ? "" : "s"} in this attempt
                            </p>
                        )}

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
                                        <input
                                            type="radio"
                                            name={`assessment-${q._id}`}
                                            checked={selected === o}
                                            disabled={!!assessmentQuestionFeedback || alreadyAnswered}
                                            onChange={() => {
                                                if (!alreadyAnswered) {
                                                    setAnswers(a => ({ ...a, [q._id]: o }));
                                                    setAssessmentQuestionFeedback(null);
                                                }
                                            }}
                                        />
                                        <span>{o}</span>
                                    </label>)}
                                </div>

                                <div className="immersive-overlay__nav immersive-assessment-nav">
                                    <span></span>

                                    {!assessmentQuestionFeedback && !alreadyAnswered
                                        ? <button
                                            className="immersive-primary"
                                            onClick={submitAssessmentQuestion}
                                            disabled={!selected || activityLoading || !assessmentAttemptId}
                                        >
                                            {activityLoading ? "Saving…" : "Submit Response"}
                                        </button>
                                        : <span></span>}

                                    {(assessmentQuestionFeedback || alreadyAnswered) && !isLast
                                        ? <button className="immersive-primary" onClick={nextAssessmentQuestion}>
                                            Next Question →
                                        </button>
                                        : (assessmentQuestionFeedback || alreadyAnswered) && isLast
                                            ? <button
                                                className="immersive-primary"
                                                onClick={submitAssessment}
                                                disabled={activityLoading || assessmentAnsweredIds.length !== questions.length}
                                            >
                                                {activityLoading ? "Submitting…" : "Finish Assessment →"}
                                            </button>
                                            : <button disabled>Next Question →</button>}
                                </div>

                                {(assessmentQuestionFeedback || alreadyAnswered) && (
                                    <div className="immersive-response-recorded">
                                        Response recorded. Your result and correct answer will be available after you finish the assessment.
                                    </div>
                                )}
                            </div> : null;
                        })()}

                        {assessmentResult && !assessmentResultDetails && (
                            <div className="immersive-result submitted">
                                <h2>Assessment submitted</h2>
                                <p>
                                    Attempt <b>{assessmentResult.attemptNumber}</b> has been recorded.
                                    Select <b>View Result</b> to see your score and review each question with the correct answer.
                                </p>
                                <button className="immersive-primary" onClick={viewAssessmentResult} disabled={activityLoading}>
                                    {activityLoading ? "Loading…" : "View Result"}
                                </button>
                            </div>
                        )}

                        {assessmentResultDetails && (
                            <div className="immersive-review">
                                <div className={`immersive-review__summary ${assessmentResultDetails.attempt?.passed ? "passed" : "failed"}`}>
                                    <div>
                                        <small>{pretty(programmeLevel)} LEVEL RESULT</small>
                                        <h2>{assessmentResultDetails.attempt?.passed ? "Passed" : "Pass mark not reached"}</h2>
                                        <p>
                                            Attempt {assessmentResultDetails.attempt?.attemptNumber} ·
                                            Score {assessmentResultDetails.attempt?.score}/{assessmentResultDetails.attempt?.totalPoints} ·
                                            Required {programme?.passMark}%
                                        </p>
                                    </div>
                                    <strong>{assessmentResultDetails.attempt?.percentage}%</strong>
                                </div>

                                <div className="immersive-result-actions immersive-result-actions--top">
                                    {!assessmentResultDetails.attempt?.passed
                                        ? <button className="immersive-primary" onClick={relearnProgramme}>
                                            Relearn {pretty(programmeLevel)} Sections →
                                        </button>
                                        : <button
                                            className="immersive-primary"
                                            onClick={continueToNextLevel}
                                            disabled={activityLoading}
                                        >
                                            {activityLoading
                                                ? "Opening next level…"
                                                : nextProgrammeLevel && nextProgrammeLevelUnlocked
                                                    ? `Continue to ${pretty(nextProgrammeLevel)} Level →`
                                                    : "Return to Levels →"}
                                        </button>}
                                </div>

                                <div className="immersive-review__list">
                                    {(assessmentResultDetails.results || []).map((item, index) => (
                                        <article
                                            className={`immersive-review-card ${item.correct ? "correct" : "incorrect"}`}
                                            key={String(item.questionId || index)}
                                        >
                                            <small>QUESTION {index + 1}</small>
                                            <h3>{item.question}</h3>
                                            <div className="immersive-review-answer">
                                                <span>Your answer</span>
                                                <b>{item.selectedAnswer || "No response"}</b>
                                            </div>
                                            <div className="immersive-review-answer immersive-review-answer--correct">
                                                <span>Correct answer</span>
                                                <b>{item.correctAnswer}</b>
                                            </div>
                                            {item.feedback && <p className="immersive-review-feedback">{item.feedback}</p>}
                                        </article>
                                    ))}
                                </div>

                            </div>
                        )}
                    </div>
                </div>}

                {overlay === "progress" && <div className="immersive-overlay">
                    <div className="immersive-overlay__head"><div><small>MY PROGRESS</small><h3>{meta.title} · {pretty(programmeLevel)} Level</h3></div><button onClick={() => setOverlay(null)}>×</button></div>
                    <div className="immersive-overlay__single"><div className="immersive-progress-grid"><div><span>Overall</span><b>{progress?.progress || 0}%</b></div><div><span>{pretty(programmeLevel)} Learning</span><b>{progress?.learningCompleted ? "Complete" : "In progress"}</b></div><div><span>{pretty(programmeLevel)} Scenario</span><b>{progress?.scenarioCompleted ? "Complete" : progress?.learningCompleted ? "Ready / pending" : "Locked"}</b></div><div><span>{pretty(programmeLevel)} Assessment</span><b>{currentLevelAssessmentPassed ? "Passed" : progress?.scenarioCompleted ? "Ready / pending" : "Locked"}</b></div></div></div>
                </div>}

                {!overlay && <div className="training360-flow__controls"><button onClick={() => setFov(v => Math.max(45, v - 8))}>+</button><button onClick={() => setFov(v => Math.min(105, v + 8))}>−</button></div>}
                {!overlay && <div className="immersive-hint">Drag left/right to explore • Scroll to zoom • Click a hotspot to open training</div>}
                {error && <div className="training360-flow__message training360-flow__message--overlay training360-flow__message--error">{error}</div>}
            </div>
        </section>
    </DashboardLayout>;
}
