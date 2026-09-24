import { useCallback, useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { getSessionUser, normalizeRole } from "../../utils/session";

const pretty = (value) => String(value || "").replace(/-/g, " ").replace(/\b\w/g, c => c.toUpperCase());
const traineeName = (trainee) => [trainee?.firstName, trainee?.lastName].filter(Boolean).join(" ") || trainee?.username || "Trainee";
const formatDate = (value) => value ? new Date(value).toLocaleString() : "—";
const formatPercent = (value) => {
    const n = Number(value || 0);
    return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/0+$/, "").replace(/\.$/, "");
};
const formatDuration = (seconds) => {
    const n = Number(seconds);
    if (!Number.isFinite(n) || n < 0) return "—";
    if (n < 60) return `${n}s`;
    const mins = Math.floor(n / 60);
    const secs = n % 60;
    return secs ? `${mins}m ${secs}s` : `${mins}m`;
};
const LEVEL_LABELS = {
    beginner: "Beginner", easy: "Beginner", basic: "Beginner",
    intermediate: "Intermediate", medium: "Intermediate",
    advanced: "Advanced", high: "Advanced",
};
const displayTrainingLevel = (item) => LEVEL_LABELS[String(item?.programme?.level || item?.level || "").toLowerCase()] || pretty(item?.programme?.level || item?.level);

const emptySummary = {
    totalAttempts: 0,
    uniqueTrainees: 0,
    passed: 0,
    failed: 0,
    passRate: 0,
    averageMark: 0,
    bestMark: 0,
};

export default function AttemptRecordsPage() {
    const role = normalizeRole(getSessionUser()?.role);
    const [attempts, setAttempts] = useState([]);
    const [summary, setSummary] = useState(emptySummary);
    const [traineeSummaries, setTraineeSummaries] = useState([]);
    const [traineeOptions, setTraineeOptions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, limit: 25, total: 0, totalPages: 1 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [search, setSearch] = useState("");
    const [traineeId, setTraineeId] = useState("all");
    const [level, setLevel] = useState("all");
    const [result, setResult] = useState("all");
    const [selected, setSelected] = useState(null);
    const [detailLoading, setDetailLoading] = useState(false);

    const load = useCallback(async (requestedPage = pagination.page) => {
        setLoading(true);
        setError("");
        try {
            const params = {
                page: requestedPage,
                limit: pagination.limit,
            };
            if (search.trim()) params.search = search.trim();
            if (traineeId !== "all") params.traineeId = traineeId;
            if (level !== "all") params.level = level;
            if (result !== "all") params.result = result;

            const r = await api.get("/attempt-records", { params });
            setAttempts(Array.isArray(r.data?.attempts) ? r.data.attempts : []);
            setSummary({ ...emptySummary, ...(r.data?.summary || {}) });
            setTraineeSummaries(Array.isArray(r.data?.traineeSummaries) ? r.data.traineeSummaries : []);
            setTraineeOptions(Array.isArray(r.data?.traineeOptions) ? r.data.traineeOptions : []);
            setPagination(r.data?.pagination || { page: 1, limit: 25, total: 0, totalPages: 1 });
        } catch (e) {
            setError(e.response?.data?.message || "Unable to load attempt records.");
        } finally {
            setLoading(false);
        }
    }, [level, pagination.limit, pagination.page, result, search, traineeId]);

    useEffect(() => {
        const timer = window.setTimeout(() => load(1), search.trim() ? 250 : 0);
        return () => window.clearTimeout(timer);
        // load is intentionally driven by filter values. Page navigation calls
        // load directly so changing page does not retrigger page 1.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [search, traineeId, level, result]);

    const openDetail = async (attempt) => {
        setDetailLoading(true);
        setError("");
        try {
            const r = await api.get(`/attempt-records/${attempt._id}`);
            setSelected(r.data || null);
        } catch (e) {
            setError(e.response?.data?.message || "Unable to load attempt details.");
        } finally {
            setDetailLoading(false);
        }
    };

    const subtitle = role === "trainer"
        ? "Review assessment performance for trainees in your assigned modules."
        : "Review assessment performance, pass rates and answer history across all trainees and modules.";

    return (
        <DashboardLayout role={role} title="Attempt Records" subtitle={subtitle}>
            <div className="app-page space-y-4">
                {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[12px] text-red-700">{error}</div>}

                <section className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
                    <Summary label="Total Attempts" value={summary.totalAttempts} />
                    <Summary label="Trainees" value={summary.uniqueTrainees} />
                    <Summary label="Passed" value={summary.passed} />
                    <Summary label="Not Passed" value={summary.failed} />
                    <Summary label="Pass Rate" value={`${formatPercent(summary.passRate)}%`} />
                    <Summary label="Average Mark" value={`${formatPercent(summary.averageMark)}%`} />
                </section>

                <section className="rounded-xl border border-[#dbe4ef] bg-white shadow-sm">
                    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e8eef5] px-5 py-4">
                        <div>
                            <h2 className="text-[14px] font-bold text-[#172033]">Find Assessment Records</h2>
                            <p className="mt-1 text-[11px] text-[#64748b]">Search by trainee, username, email, programme or module, then narrow the results by trainee, level or outcome.</p>
                        </div>
                        <button type="button" onClick={() => load(pagination.page)} className="rounded-lg border border-blue-200 px-4 py-2 text-[11px] font-semibold text-blue-700">Refresh</button>
                    </div>
                    <div className="grid gap-3 bg-[#f8fafc] p-4 lg:grid-cols-[1.4fr_1fr_180px_180px]">
                        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search trainee, username, programme or module..." className="rounded-lg border border-[#d7e0eb] bg-white px-3 py-2.5 text-[12px] outline-none focus:border-blue-400" />
                        <select value={traineeId} onChange={e => setTraineeId(e.target.value)} className="rounded-lg border border-[#d7e0eb] bg-white px-3 py-2.5 text-[12px]">
                            <option value="all">All Trainees</option>
                            {traineeOptions.map(trainee => <option key={trainee._id} value={trainee._id}>{traineeName(trainee)} ({trainee.username})</option>)}
                        </select>
                        <select value={level} onChange={e => setLevel(e.target.value)} className="rounded-lg border border-[#d7e0eb] bg-white px-3 py-2.5 text-[12px]">
                            <option value="all">All Levels</option>
                            <option value="beginner">Beginner</option>
                            <option value="intermediate">Intermediate</option>
                            <option value="advanced">Advanced</option>
                        </select>
                        <select value={result} onChange={e => setResult(e.target.value)} className="rounded-lg border border-[#d7e0eb] bg-white px-3 py-2.5 text-[12px]">
                            <option value="all">All Results</option>
                            <option value="passed">Passed</option>
                            <option value="failed">Not Passed</option>
                        </select>
                    </div>
                </section>

                <section className="rounded-xl border border-[#dbe4ef] bg-white shadow-sm">
                    <div className="border-b border-[#e8eef5] px-5 py-4">
                        <h2 className="text-[14px] font-bold text-[#172033]">Trainee Performance Overview</h2>
                        <p className="mt-1 text-[11px] text-[#64748b]">A trainee-wise summary of the records matching the current filters.</p>
                    </div>
                    {loading ? <Loading /> : traineeSummaries.length ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full border-collapse text-left">
                                <thead className="bg-[#fbfcfe] text-[10px] uppercase tracking-wide text-[#64748b]">
                                    <tr>
                                        <th className="px-4 py-3">Trainee</th>
                                        <th className="px-4 py-3">Attempts</th>
                                        <th className="px-4 py-3">Passed</th>
                                        <th className="px-4 py-3">Not Passed</th>
                                        <th className="px-4 py-3">Average Mark</th>
                                        <th className="px-4 py-3">Best Mark</th>
                                        <th className="px-4 py-3">Latest</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#edf2f7] text-[12px] text-[#334155]">
                                    {traineeSummaries.map(item => <tr key={item.trainee?._id || item.trainee?.username} className="hover:bg-[#f8fbff]">
                                        <td className="px-4 py-3"><b className="block text-[#172033]">{traineeName(item.trainee)}</b><span className="text-[#8492a6]">{item.trainee?.username}</span></td>
                                        <td className="px-4 py-3 font-bold">{item.totalAttempts}</td>
                                        <td className="px-4 py-3 text-emerald-700">{item.passed}</td>
                                        <td className="px-4 py-3 text-red-700">{item.failed}</td>
                                        <td className="px-4 py-3 font-semibold">{formatPercent(item.averageMark)}%</td>
                                        <td className="px-4 py-3 font-semibold">{formatPercent(item.bestMark)}%</td>
                                        <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 font-bold ${item.latestResult ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{formatPercent(item.latestMark)}% · {item.latestResult ? "Passed" : "Not Passed"}</span></td>
                                    </tr>)}
                                </tbody>
                            </table>
                        </div>
                    ) : <Empty text="No trainee performance records match the current filters." />}
                </section>

                <section className="rounded-xl border border-[#dbe4ef] bg-white shadow-sm">
                    <div className="border-b border-[#e8eef5] px-5 py-4">
                        <h2 className="text-[14px] font-bold text-[#172033]">Assessment Attempt History</h2>
                        <p className="mt-1 text-[11px] text-[#64748b]">Every submitted attempt is kept as a separate auditable record with score, mark, pass mark, result and submission time.</p>
                    </div>

                    {loading ? <Loading /> : attempts.length ? (
                        <>
                            <div className="overflow-x-auto">
                                <table className="min-w-full border-collapse text-left">
                                    <thead className="bg-[#fbfcfe] text-[10px] uppercase tracking-wide text-[#64748b]">
                                        <tr>
                                            <th className="px-4 py-3">Trainee</th>
                                            <th className="px-4 py-3">Module / Programme</th>
                                            <th className="px-4 py-3">Level</th>
                                            <th className="px-4 py-3">Attempt</th>
                                            <th className="px-4 py-3">Score</th>
                                            <th className="px-4 py-3">Mark</th>
                                            <th className="px-4 py-3">Pass Mark</th>
                                            <th className="px-4 py-3">Result</th>
                                            <th className="px-4 py-3">Submitted</th>
                                            <th className="px-4 py-3">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-[#edf2f7] text-[12px] text-[#334155]">
                                        {attempts.map(item => (
                                            <tr key={item._id} className="hover:bg-[#f8fbff]">
                                                <td className="px-4 py-3"><b className="block text-[#172033]">{traineeName(item.trainee)}</b><span className="text-[#8492a6]">{item.trainee?.username}</span></td>
                                                <td className="px-4 py-3"><b className="block text-[#172033]">{pretty(item.programme?.programmeType)}</b><span className="text-[#64748b]">{item.programme?.title || "Programme"}</span></td>
                                                <td className="px-4 py-3 font-semibold">{displayTrainingLevel(item)}</td>
                                                <td className="px-4 py-3"><span className="rounded-full bg-blue-50 px-2.5 py-1 font-bold text-blue-700">#{item.attemptNumber}</span></td>
                                                <td className="px-4 py-3 font-bold text-[#172033]">{Number(item.score || 0)}/{Number(item.totalPoints || 0)}</td>
                                                <td className="px-4 py-3 font-bold text-[#172033]">{formatPercent(item.percentage)}%</td>
                                                <td className="px-4 py-3">{formatPercent(item.effectivePassMark)}%</td>
                                                <td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 font-bold ${item.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{item.passed ? "Passed" : "Not Passed"}</span></td>
                                                <td className="px-4 py-3 whitespace-nowrap">{formatDate(item.submittedAt || item.createdAt)}</td>
                                                <td className="px-4 py-3"><button type="button" onClick={() => openDetail(item)} disabled={detailLoading} className="rounded-lg bg-[#1769e8] px-3 py-2 font-bold text-white disabled:opacity-60">View</button></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#e8eef5] px-5 py-4 text-[11px] text-[#64748b]">
                                <span>Showing page {pagination.page} of {pagination.totalPages} · {pagination.total} record{pagination.total === 1 ? "" : "s"}</span>
                                <div className="flex gap-2">
                                    <button type="button" disabled={pagination.page <= 1 || loading} onClick={() => load(pagination.page - 1)} className="rounded-lg border border-[#d7e0eb] px-3 py-2 font-semibold disabled:opacity-40">Previous</button>
                                    <button type="button" disabled={pagination.page >= pagination.totalPages || loading} onClick={() => load(pagination.page + 1)} className="rounded-lg border border-[#d7e0eb] px-3 py-2 font-semibold disabled:opacity-40">Next</button>
                                </div>
                            </div>
                        </>
                    ) : <Empty text="No attempt records match the current filters." />}
                </section>
            </div>

            {selected && <AttemptDetailModal data={selected} onClose={() => setSelected(null)} />}
        </DashboardLayout>
    );
}

function Summary({ label, value }) {
    return <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm"><p className="text-[11px] text-[#64748b]">{label}</p><strong className="mt-2 block text-[24px] text-[#172033]">{value}</strong></article>;
}

function Loading() {
    return <div className="p-8 text-center text-[12px] text-[#64748b]">Loading attempt records...</div>;
}

function Empty({ text }) {
    return <div className="p-10 text-center text-[12px] text-[#64748b]">{text}</div>;
}

function AttemptDetailModal({ data, onClose }) {
    const attempt = data?.attempt || {};
    const results = Array.isArray(data?.results) ? data.results : [];
    return <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-950/60 p-4" onMouseDown={e => e.target === e.currentTarget && onClose()}>
        <section className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            <header className="flex items-start justify-between gap-4 border-b border-[#e5ebf2] px-6 py-5">
                <div>
                    <small className="font-bold uppercase tracking-wide text-blue-600">Assessment Attempt Record</small>
                    <h2 className="mt-1 text-[18px] font-bold text-[#172033]">{traineeName(attempt.trainee)} · Attempt #{attempt.attemptNumber}</h2>
                    <p className="mt-1 text-[12px] text-[#64748b]">{attempt.programme?.title} · {displayTrainingLevel(attempt)}</p>
                    <div className="mt-3 flex flex-wrap gap-2 text-[11px]">
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-semibold">Score {Number(attempt.score || 0)}/{Number(attempt.totalPoints || 0)}</span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-semibold">Mark {formatPercent(attempt.percentage)}%</span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-semibold">Pass mark {formatPercent(attempt.effectivePassMark)}%</span>
                        <span className={`rounded-lg px-2.5 py-1.5 font-bold ${attempt.passed ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"}`}>{attempt.passed ? "Passed" : "Not Passed"}</span>
                        <span className="rounded-lg bg-slate-100 px-2.5 py-1.5 font-semibold">Duration {formatDuration(attempt.durationSeconds)}</span>
                    </div>
                </div>
                <button type="button" onClick={onClose} className="text-[25px] leading-none text-[#64748b]">×</button>
            </header>
            <div className="max-h-[68vh] space-y-4 overflow-y-auto p-6">
                {results.map((item, index) => <article key={String(item.questionId || index)} className={`rounded-xl border p-4 ${item.correct ? "border-emerald-200 bg-emerald-50/40" : "border-red-200 bg-red-50/40"}`}>
                    <small className="font-bold text-[#64748b]">QUESTION {index + 1}</small>
                    <h3 className="mt-2 text-[14px] font-bold text-[#172033]">{item.question}</h3>
                    <div className="mt-3 grid gap-3 md:grid-cols-2">
                        <div className="rounded-lg border border-[#dbe4ef] bg-white p-3"><span className="block text-[10px] font-bold uppercase text-[#8492a6]">Trainee answer</span><b className="mt-1 block text-[12px] text-[#172033]">{item.selectedAnswer || "No response"}</b></div>
                        <div className="rounded-lg border border-emerald-200 bg-white p-3"><span className="block text-[10px] font-bold uppercase text-emerald-700">Correct answer</span><b className="mt-1 block text-[12px] text-[#172033]">{item.correctAnswer}</b></div>
                    </div>
                    {item.feedback && <p className="mt-3 text-[11px] leading-5 text-[#64748b]">{item.feedback}</p>}
                </article>)}
            </div>
        </section>
    </div>;
}
