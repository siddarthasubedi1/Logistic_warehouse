import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import api from "../../services/api";
import { getApiErrorMessage } from "../../utils/training";

function TrainerMonitoringPage() {
    const [trainees, setTrainees] = useState([]);
    const [status, setStatus] = useState("");
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                setLoading(true);
                setError("");
                const params = { limit: 100 };
                if (status) params.status = status;
                const response = await api.get("/trainer/monitoring", { params });
                if (!mounted) return;
                setTrainees(Array.isArray(response.data?.trainees) ? response.data.trainees : []);
            } catch (requestError) {
                if (!mounted) return;
                setError(getApiErrorMessage(requestError, "Unable to load authorised trainee monitoring."));
            } finally {
                if (mounted) setLoading(false);
            }
        };

        load();
        return () => { mounted = false; };
    }, [status]);

    const filtered = useMemo(() => {
        const query = search.trim().toLowerCase();
        if (!query) return trainees;
        return trainees.filter((row) => {
            const trainee = row.trainee || {};
            return [trainee.firstName, trainee.lastName, trainee.username]
                .filter(Boolean)
                .join(" ")
                .toLowerCase()
                .includes(query);
        });
    }, [trainees, search]);

    const stats = useMemo(() => {
        const programmes = trainees.flatMap((row) => Array.isArray(row.programmes) ? row.programmes : []);
        return {
            trainees: trainees.length,
            completed: programmes.filter((row) => row.status === "completed").length,
            inProgress: programmes.filter((row) => row.status === "in-progress").length,
            notStarted: programmes.filter((row) => row.status === "not-started").length,
        };
    }, [trainees]);

    return (
        <DashboardLayout
            role="trainer"
            title="Trainee Monitoring"
            subtitle="Only trainees and programme results authorised for your assigned modules are shown."
        >
            <div className="app-page space-y-5">
                <FeedbackAlert type="error" message={error} onClose={() => setError("")} />

                <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Summary label="Authorised Trainees" value={stats.trainees} />
                    <Summary label="Completed Programmes" value={stats.completed} />
                    <Summary label="In Progress" value={stats.inProgress} />
                    <Summary label="Not Started" value={stats.notStarted} />
                </section>

                <section className="rounded-xl border border-[#dbe4ef] bg-white p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_220px]">
                        <label className="text-[10px] font-semibold text-[#52627a]">
                            Search trainee
                            <input
                                type="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                                placeholder="Name or username"
                                className="mt-1 min-h-[42px] w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-[11px] outline-none focus:border-blue-500"
                            />
                        </label>

                        <label className="text-[10px] font-semibold text-[#52627a]">
                            Overall status
                            <select
                                value={status}
                                onChange={(event) => setStatus(event.target.value)}
                                className="mt-1 min-h-[42px] w-full rounded-lg border border-[#cbd5e1] bg-white px-3 text-[11px] outline-none focus:border-blue-500"
                            >
                                <option value="">All statuses</option>
                                <option value="not-started">Not Started</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </label>
                    </div>
                </section>

                {loading ? (
                    <LoadingCard message="Loading authorised trainee progress..." />
                ) : filtered.length ? (
                    <section className="space-y-4">
                        {filtered.map((row) => (
                            <TraineeCard key={row.trainee?._id || row.trainee?.id} row={row} />
                        ))}
                    </section>
                ) : (
                    <section className="rounded-xl border border-[#dbe4ef] bg-white p-10 text-center shadow-sm">
                        <h2 className="text-[13px] font-bold text-[#172033]">No authorised trainee records found</h2>
                        <p className="mt-2 text-[10px] text-[#64748b]">Change the filter, or ask an Administrator to check your module/programme assignment.</p>
                    </section>
                )}
            </div>
        </DashboardLayout>
    );
}

function TraineeCard({ row }) {
    const trainee = row.trainee || {};
    const programmes = Array.isArray(row.programmes) ? row.programmes : [];
    const summary = row.summary || {};
    const name = `${trainee.firstName || ""} ${trainee.lastName || ""}`.trim() || trainee.username || "Trainee";

    return (
        <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-[14px] font-bold text-[#172033]">{name}</h2>
                        <StatusPill status={summary.status} label={summary.statusLabel} />
                    </div>
                    <p className="mt-1 text-[10px] text-[#64748b]">@{trainee.username || "—"}</p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <MiniStat label="Progress" value={`${Number(summary.overallProgress ?? summary.progress ?? 0)}%`} />
                    <MiniStat label="Programmes" value={summary.programmesAssigned ?? programmes.length} />
                    <MiniStat label="Completed" value={summary.completedProgrammes ?? programmes.filter((item) => item.status === "completed").length} />
                    <MiniStat label="Attempts" value={summary.totalAttempts ?? summary.attempts ?? 0} />
                </div>
            </div>

            <details className="mt-4 rounded-lg border border-[#e8eef5] bg-[#f8fafc] p-3">
                <summary className="cursor-pointer text-[10px] font-bold text-[#0b4f87]">View programme progress and scores</summary>
                <div className="mt-3 overflow-x-auto">
                    <table className="min-w-[820px] w-full text-left text-[10px]">
                        <thead>
                            <tr className="border-b border-[#dbe4ef] text-[#52627a]">
                                <th className="px-2 py-2">Programme</th>
                                <th className="px-2 py-2">Module</th>
                                <th className="px-2 py-2">Level</th>
                                <th className="px-2 py-2">Status</th>
                                <th className="px-2 py-2">Progress</th>
                                <th className="px-2 py-2">Attempts</th>
                                <th className="px-2 py-2">Latest</th>
                                <th className="px-2 py-2">Best</th>
                            </tr>
                        </thead>
                        <tbody>
                            {programmes.map((programme) => (
                                <tr key={programme.programmeId} className="border-b border-[#e8eef5] last:border-0">
                                    <td className="px-2 py-3 font-semibold text-[#172033]">{programme.title}</td>
                                    <td className="px-2 py-3 text-[#64748b]">{formatText(programme.moduleKey)}</td>
                                    <td className="px-2 py-3 text-[#64748b]">{formatText(programme.programmeLevel)}</td>
                                    <td className="px-2 py-3"><StatusPill status={programme.status} label={programme.statusLabel} /></td>
                                    <td className="px-2 py-3 font-semibold">{Number(programme.progress || 0)}%</td>
                                    <td className="px-2 py-3">{Number(programme.assessment?.attempts || 0)}</td>
                                    <td className="px-2 py-3">{formatScore(programme.assessment?.latestScore)}</td>
                                    <td className="px-2 py-3">{formatScore(programme.assessment?.bestScore)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </details>
        </article>
    );
}

function StatusPill({ status, label }) {
    const normalized = String(status || "not-started");
    const classes = normalized === "completed"
        ? "bg-emerald-50 text-emerald-700"
        : normalized === "in-progress"
            ? "bg-blue-50 text-blue-700"
            : "bg-slate-100 text-slate-600";
    return <span className={`inline-flex rounded-full px-2.5 py-1 text-[9px] font-bold ${classes}`}>{label || formatText(normalized)}</span>;
}

function Summary({ label, value }) {
    return (
        <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
            <p className="text-[10px] text-[#64748b]">{label}</p>
            <strong className="mt-2 block text-[22px] text-[#172033]">{value}</strong>
        </article>
    );
}

function MiniStat({ label, value }) {
    return (
        <div className="rounded-lg bg-blue-50 px-3 py-2">
            <p className="text-[9px] text-[#64748b]">{label}</p>
            <strong className="text-[12px] text-[#172033]">{value}</strong>
        </div>
    );
}

function formatText(value) {
    return String(value || "—").replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function formatScore(value) {
    return value === null || value === undefined ? "—" : `${Number(value).toFixed(Number.isInteger(Number(value)) ? 0 : 1)}%`;
}

export default TrainerMonitoringPage;
