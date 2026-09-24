import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import api from "../../services/api";

import warehouseImage from "../../images/warehouse.jpg";
import insideWarehouseImage from "../../images/inside-warehouse.jpg";
import loadingImage from "../../images/loading.jpg";

import { getApiErrorMessage } from "../../utils/training";

const SCENARIOS = [
    { title: "Warehouse - Receiving Area", text: "Identify hazards in the receiving area.", image: warehouseImage },
    { title: "Storage Area - High Risk", text: "Spot the hazards in the storage area.", image: insideWarehouseImage },
    { title: "Loading Dock", text: "Find and report the safety hazards.", image: loadingImage },
];

const TITLES = {
    progress: ["My Progress", "Track completion, levels, attempts and assessment marks across your assigned modules."],
    scenarios: ["Panoramic Scenarios", "Practice recognising workplace hazards in realistic warehouse environments."],
    quizzes: ["Quizzes", "Review your submitted assessment attempts and marks across assigned training modules."],
    notifications: ["Notifications", "View training updates and account messages."],
    help: ["Help Support", "Find guidance for using the UK LogiWare safety training system."],
};

const LEVEL_LABELS = {
    beginner: "Beginner",
    easy: "Beginner",
    basic: "Beginner",
    intermediate: "Intermediate",
    medium: "Intermediate",
    advanced: "Advanced",
    high: "Advanced",
};

function TraineeUtilityPage({ type }) {
    const [progress, setProgress] = useState([]);
    const [progressSummary, setProgressSummary] = useState(null);
    const [attempts, setAttempts] = useState([]);
    const [loading, setLoading] = useState(type === "progress" || type === "quizzes");
    const [error, setError] = useState("");

    const [title, subtitle] = TITLES[type] || ["Trainee", "Safety training."];

    useEffect(() => {
        if (type !== "progress" && type !== "quizzes") {
            return undefined;
        }

        let mounted = true;

        const request = type === "progress"
            ? api.get("/users/me/training-progress")
            : api.get("/training-content/trainee/results");

        request
            .then((response) => {
                if (!mounted) return;
                if (type === "progress") {
                    setProgress(Array.isArray(response.data?.progress) ? response.data.progress : []);
                    setProgressSummary(response.data?.summary || null);
                } else {
                    setAttempts(Array.isArray(response.data?.attempts) ? response.data.attempts : []);
                }
            })
            .catch((requestError) => {
                if (!mounted) return;
                setError(getApiErrorMessage(
                    requestError,
                    type === "progress" ? "Unable to load training progress." : "Unable to load assessment attempts."
                ));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false; };
    }, [type]);

    const average = useMemo(() => {
        if (progressSummary?.overallProgress !== undefined) return Number(progressSummary.overallProgress || 0);
        if (!progress.length) return 0;
        return Math.round(progress.reduce((sum, item) => sum + Number(item.progress || 0), 0) / progress.length);
    }, [progress, progressSummary]);

    const attemptSummary = useMemo(() => {
        const passed = attempts.filter((attempt) => attempt.passed).length;
        const best = attempts.length ? Math.max(...attempts.map((attempt) => Number(attempt.percentage || 0))) : 0;
        return { total: attempts.length, passed, failed: attempts.length - passed, best };
    }, [attempts]);

    if (loading) {
        return (
            <DashboardLayout role="trainee" title={title} subtitle={subtitle}>
                <div className="app-page"><LoadingCard message="Loading..." /></div>
            </DashboardLayout>
        );
    }

    return (
        <DashboardLayout role="trainee" title={title} subtitle={subtitle}>
            <div className="app-page space-y-5">
                <FeedbackAlert type="error" message={error} onClose={() => setError("")} />

                {type === "progress" && (
                    <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <Summary label="Overall Progress" value={`${average}%`} />
                            <Summary label="Modules Assigned" value={progressSummary?.modulesAssigned ?? progress.length} />
                            <Summary
                                label="Completed Modules"
                                value={progressSummary?.completedModules ?? progress.filter((item) => Number(item.progress) >= 100).length}
                            />
                            <Summary
                                label="Assessment Attempts"
                                value={progressSummary?.totalAttempts ?? progress.reduce((sum, item) => sum + Number(item.attempts || 0), 0)}
                            />
                        </section>

                        <section className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
                            <div>
                                <h2 className="text-[14px] font-bold text-[#172033]">Training Progress</h2>
                                <p className="mt-1 text-[11px] text-[#64748b]">
                                    Each module has three levels. Completing Beginner gives about 33%, Beginner + Intermediate about 67%, and all three levels 100%.
                                </p>
                            </div>

                            <div className="mt-4 grid gap-4">
                                {progress.length ? progress.map((item) => (
                                    <ModuleProgressCard key={item.moduleType || item.trainingSection} item={item} />
                                )) : (
                                    <div className="rounded-lg border border-dashed border-[#cbd5e1] p-7 text-center text-[11px] text-[#64748b]">
                                        No active training programmes are assigned yet.
                                    </div>
                                )}
                            </div>
                        </section>
                    </>
                )}

                {type === "scenarios" && (
                    <section className="grid gap-4 md:grid-cols-3">
                        {SCENARIOS.map((scenario) => (
                            <article key={scenario.title} className="overflow-hidden rounded-xl border border-[#dbe4ef] bg-white shadow-sm">
                                <img src={scenario.image} alt={scenario.title} className="h-44 w-full object-cover" />
                                <div className="p-4">
                                    <h2 className="text-[11px] font-bold text-[#172033]">{scenario.title}</h2>
                                    <p className="mt-2 text-[9px] text-[#64748b]">{scenario.text}</p>
                                    <button type="button" className="mt-4 rounded-lg border border-blue-300 bg-white px-4 py-2 text-[9px] font-semibold text-blue-600">
                                        Start Scenario
                                    </button>
                                </div>
                            </article>
                        ))}
                    </section>
                )}

                {type === "quizzes" && (
                    <>
                        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                            <Summary label="Total Attempts" value={attemptSummary.total} />
                            <Summary label="Passed" value={attemptSummary.passed} />
                            <Summary label="Not Passed" value={attemptSummary.failed} />
                            <Summary label="Best Mark" value={attemptSummary.total ? `${formatPercent(attemptSummary.best)}%` : "—"} />
                        </section>

                        <section className="overflow-hidden rounded-xl border border-[#dbe4ef] bg-white shadow-sm">
                            <div className="border-b border-[#e2e8f0] px-5 py-4">
                                <h2 className="text-[14px] font-bold text-[#172033]">My Assessment Attempts</h2>
                                <p className="mt-1 text-[11px] text-[#64748b]">
                                    Every submitted attempt is kept separately so you can see your attempt number and mark.
                                </p>
                            </div>

                            {attempts.length ? (
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-left text-[11px]">
                                        <thead className="bg-[#f8fafc] text-[#64748b]">
                                            <tr>
                                                <th className="px-4 py-3 font-semibold">Programme</th>
                                                <th className="px-4 py-3 font-semibold">Module</th>
                                                <th className="px-4 py-3 font-semibold">Level</th>
                                                <th className="px-4 py-3 font-semibold">Attempt</th>
                                                <th className="px-4 py-3 font-semibold">Score</th>
                                                <th className="px-4 py-3 font-semibold">Mark</th>
                                                <th className="px-4 py-3 font-semibold">Result</th>
                                                <th className="px-4 py-3 font-semibold">Submitted</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-[#e2e8f0]">
                                            {attempts.map((attempt) => (
                                                <tr key={attempt._id} className="text-[#334155]">
                                                    <td className="px-4 py-3 font-semibold text-[#172033]">{attempt.programme?.title || "Training Programme"}</td>
                                                    <td className="px-4 py-3">{formatSection(attempt.programme?.programmeType)}</td>
                                                    <td className="px-4 py-3">{LEVEL_LABELS[attempt.programme?.level] || LEVEL_LABELS[attempt.level] || formatSection(attempt.level)}</td>
                                                    <td className="px-4 py-3">Attempt {attempt.attemptNumber}</td>
                                                    <td className="px-4 py-3">{Number(attempt.score || 0)}/{Number(attempt.totalPoints || 0)}</td>
                                                    <td className="px-4 py-3 font-semibold">{formatPercent(attempt.percentage)}%</td>
                                                    <td className="px-4 py-3">
                                                        <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold ${attempt.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>
                                                            {attempt.passed ? "Passed" : "Not Passed"}
                                                        </span>
                                                    </td>
                                                    <td className="whitespace-nowrap px-4 py-3">{formatDate(attempt.submittedAt || attempt.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            ) : (
                                <div className="p-8 text-center text-[11px] text-[#64748b]">
                                    No submitted assessment attempts yet. Complete Learning and Scenario first, then take the level assessment.
                                </div>
                            )}
                        </section>
                    </>
                )}

                {type === "notifications" && <EmptyCard title="Training available" text="Your assigned training modules are ready to continue." />}
                {type === "help" && <HelpCard />}
            </div>
        </DashboardLayout>
    );
}

function ModuleProgressCard({ item }) {
    const levels = Array.isArray(item.levels) ? item.levels : [];
    const currentLabel = item.currentLevel === "completed"
        ? "All levels complete"
        : item.currentLevel
            ? `${LEVEL_LABELS[item.currentLevel] || formatSection(item.currentLevel)} in progress`
            : "Waiting for the next assigned level";

    return (
        <article className="rounded-xl border border-[#e2e8f0] p-4">
            <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                    <strong className="text-[13px] text-[#172033]">{formatSection(item.moduleType || item.trainingSection)}</strong>
                    <p className="mt-1 text-[10px] text-[#64748b]">{currentLabel}</p>
                </div>
                <div className="text-right">
                    <strong className="text-[18px] text-blue-600">{Number(item.progress || 0)}%</strong>
                    <p className="text-[9px] text-[#64748b]">{Number(item.completedLevels || 0)} of 3 levels complete</p>
                </div>
            </div>

            <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-[#1769e8] transition-all" style={{ width: `${Number(item.progress || 0)}%` }} />
            </div>

            <div className="mt-4 grid gap-2 md:grid-cols-3">
                {levels.map((level) => {
                    const status = level.completed
                        ? "Complete"
                        : level.assignedCount === 0
                            ? "Not assigned"
                            : level.unlocked
                                ? level.progress > 0 ? "In progress" : "Ready"
                                : "Locked";
                    return (
                        <div key={level.level} className="rounded-lg border border-[#e2e8f0] bg-[#f8fafc] p-3">
                            <div className="flex items-center justify-between gap-2">
                                <b className="text-[10px] text-[#172033]">{LEVEL_LABELS[level.level] || formatSection(level.level)}</b>
                                <span className="text-[10px] font-bold text-blue-600">{Number(level.progress || 0)}%</span>
                            </div>
                            <p className="mt-1 text-[9px] text-[#64748b]">{status}</p>
                            <p className="mt-1 text-[9px] text-[#94a3b8]">
                                {level.assignedCount ? (level.completed ? "Level passed" : "Level assessment pending") : "Not assigned"}
                            </p>
                        </div>
                    );
                })}
            </div>

            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 rounded-lg bg-blue-50 px-3 py-2.5 text-[10px] text-[#334155]">
                <span><b>Attempts:</b> {Number(item.attempts || 0)}</span>
                <span><b>Latest mark:</b> {item.latestPercentage === null || item.latestPercentage === undefined ? "—" : `${formatPercent(item.latestPercentage)}%`}</span>
                <span><b>Best mark:</b> {item.bestPercentage === null || item.bestPercentage === undefined ? "—" : `${formatPercent(item.bestPercentage)}%`}</span>
                {item.latestPercentage !== null && item.latestPercentage !== undefined && (
                    <span><b>Latest result:</b> {item.latestPassed ? "Passed" : "Not Passed"}</span>
                )}
            </div>
        </article>
    );
}

function Summary({ label, value }) {
    return (
        <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
            <p className="text-[10px] text-[#64748b]">{label}</p>
            <strong className="mt-2 block text-[24px] text-[#172033]">{value}</strong>
        </article>
    );
}

function EmptyCard({ title, text }) {
    return (
        <section className="rounded-xl border border-[#dbe4ef] bg-white p-10 text-center shadow-sm">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">✓</div>
            <h2 className="mt-4 text-[12px] font-bold text-[#172033]">{title}</h2>
            <p className="mt-2 text-[9px] text-[#64748b]">{text}</p>
        </section>
    );
}

function HelpCard() {
    return (
        <section className="rounded-xl border border-[#dbe4ef] bg-white p-6 shadow-sm">
            <h2 className="text-[13px] font-bold text-[#172033]">How can we help?</h2>
            <p className="mt-2 text-[9px] leading-5 text-[#64748b]">
                If you cannot access training, your account credentials, or a required module, contact your UK LogiWare Administrator.
            </p>
            <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">
                <strong className="text-[10px] text-blue-700">Account and training support</strong>
                <p className="mt-1 text-[8px] text-blue-600">
                    Your Administrator can update account access, reset passwords and review training assignments.
                </p>
            </div>
        </section>
    );
}

function formatPercent(value) {
    const number = Number(value || 0);
    return Number.isInteger(number) ? String(number) : number.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return "—";
    return date.toLocaleString();
}

function formatSection(value) {
    return String(value || "").replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default TraineeUtilityPage;
