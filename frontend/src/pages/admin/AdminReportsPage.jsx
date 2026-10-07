import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import api from "../../services/api";
import { getApiErrorMessage, parseArrayResponse } from "../../utils/training";

const EMPTY_FILTERS = {
    programmeId: "",
    status: "",
    role: "",
    from: "",
    to: "",
};

function AdminReportsPage() {
    const [programmes, setProgrammes] = useState([]);
    const [filters, setFilters] = useState(EMPTY_FILTERS);
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadReport = async (selectedFilters) => {
        try {
            setLoading(true);
            setError("");
            const params = Object.fromEntries(
                Object.entries(selectedFilters).filter(([, value]) => value !== "")
            );
            const response = await api.get("/admin/reports", { params });
            setReport(response.data?.report || null);
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to generate the Admin report."));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        let mounted = true;

        Promise.allSettled([
            api.get("/training-programmes"),
            api.get("/admin/reports"),
        ]).then(([programmeResult, reportResult]) => {
            if (!mounted) return;

            if (programmeResult.status === "fulfilled") {
                setProgrammes(parseArrayResponse(programmeResult.value.data, "programmes"));
            }

            if (reportResult.status === "fulfilled") {
                setReport(reportResult.value.data?.report || null);
            } else {
                setError(getApiErrorMessage(reportResult.reason, "Unable to generate the Admin report."));
            }

            setLoading(false);
        });

        return () => { mounted = false; };
    }, []);

    const apply = (event) => {
        event.preventDefault();
        loadReport(filters);
    };

    const reset = () => {
        setFilters(EMPTY_FILTERS);
        loadReport(EMPTY_FILTERS);
    };

    const cards = useMemo(() => {
        if (!report) return [];
        return [
            ["Users", report.users?.total ?? 0],
            ["Trainees", report.users?.trainees ?? 0],
            ["Programme Participation", report.programmes?.participation ?? 0],
            ["Completion Rate", `${Number(report.completionOutcomes?.completionRate || 0)}%`],
            ["Assessment Attempts", report.assessments?.totalAttempts ?? 0],
            ["Hazard Responses", report.hazards?.completedResponses ?? 0],
        ];
    }, [report]);

    return (
        <DashboardLayout
            role="admin"
            title="Reports & Analytics"
            subtitle="System-wide training participation, progress, hazards and assessment outcomes from stored records."
        >
            <div className="app-page space-y-5">
                <FeedbackAlert type="error" message={error} onClose={() => setError("")} />

                <form onSubmit={apply} className="rounded-xl border border-[#dbe4ef] bg-white p-4 shadow-sm">
                    <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
                        <Filter label="Programme">
                            <select value={filters.programmeId} onChange={(event) => setFilters((current) => ({ ...current, programmeId: event.target.value }))}>
                                <option value="">All programmes</option>
                                {programmes.map((programme) => (
                                    <option key={programme._id || programme.id} value={programme._id || programme.id}>{programme.title || programme.name}</option>
                                ))}
                            </select>
                        </Filter>
                        <Filter label="Progress status">
                            <select value={filters.status} onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}>
                                <option value="">All statuses</option>
                                <option value="not-started">Not Started</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </Filter>
                        <Filter label="User role">
                            <select value={filters.role} onChange={(event) => setFilters((current) => ({ ...current, role: event.target.value }))}>
                                <option value="">All roles</option>
                                <option value="trainee">Trainee</option>
                                <option value="trainer">Trainer</option>
                                <option value="admin">Admin</option>
                            </select>
                        </Filter>
                        <Filter label="From">
                            <input type="date" value={filters.from} onChange={(event) => setFilters((current) => ({ ...current, from: event.target.value }))} />
                        </Filter>
                        <Filter label="To">
                            <input type="date" value={filters.to} onChange={(event) => setFilters((current) => ({ ...current, to: event.target.value }))} />
                        </Filter>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                        <button type="submit" className="rounded-lg bg-[#0b4f87] px-4 py-2.5 text-[11px] font-semibold text-white">Apply filters</button>
                        <button type="button" onClick={reset} className="rounded-lg border border-[#cbd5e1] bg-white px-4 py-2.5 text-[11px] font-semibold text-[#52627a]">Reset</button>
                    </div>
                </form>

                {loading ? (
                    <LoadingCard message="Generating report from stored records..." />
                ) : report ? (
                    <>
                        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                            {cards.map(([label, value]) => <Summary key={label} label={label} value={value} />)}
                        </section>

                        <section className="grid gap-4 xl:grid-cols-2">
                            <ReportBlock title="Progress">
                                <Metric label="Not Started" value={report.progress?.notStarted ?? 0} />
                                <Metric label="In Progress" value={report.progress?.inProgress ?? 0} />
                                <Metric label="Completed" value={report.progress?.completed ?? 0} />
                                <Metric label="Unique Trainees" value={report.programmes?.uniqueTrainees ?? 0} />
                            </ReportBlock>

                            <ReportBlock title="Assessments">
                                <Metric label="Passed" value={report.assessments?.passed ?? 0} />
                                <Metric label="Failed" value={report.assessments?.failed ?? 0} />
                                <Metric label="Average Score" value={formatPercent(report.assessments?.averageScore)} />
                                <Metric label="Best Score" value={formatPercent(report.assessments?.bestScore)} />
                            </ReportBlock>

                            <ReportBlock title="Hazard Activity">
                                <Metric label="Attempts" value={report.hazards?.totalAttempts ?? 0} />
                                <Metric label="Responses" value={report.hazards?.completedResponses ?? 0} />
                                <Metric label="Successful" value={report.hazards?.successfulResponses ?? 0} />
                                <Metric label="Unsuccessful" value={report.hazards?.failedResponses ?? 0} />
                            </ReportBlock>

                            <ReportBlock title="Users">
                                <Metric label="Active" value={report.users?.active ?? 0} />
                                <Metric label="Inactive" value={report.users?.inactive ?? 0} />
                                <Metric label="Trainers" value={report.users?.trainers ?? 0} />
                                <Metric label="Admins" value={report.users?.admins ?? 0} />
                            </ReportBlock>
                        </section>

                        <section className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
                            <div className="flex flex-wrap items-center justify-between gap-3">
                                <div>
                                    <h2 className="text-[13px] font-bold text-[#172033]">Optional Game Outcomes</h2>
                                    <p className="mt-1 text-[10px] text-[#64748b]">Valid completed challenge and simulation records in the selected scope.</p>
                                </div>
                                <span className="text-[9px] text-[#64748b]">Generated {formatDate(report.generatedAt)}</span>
                            </div>
                            {Array.isArray(report.optionalGames) && report.optionalGames.length ? (
                                <div className="mt-4 overflow-x-auto">
                                    <table className="min-w-[560px] w-full text-left text-[10px]">
                                        <thead><tr className="border-b border-[#dbe4ef] text-[#52627a]"><th className="px-2 py-2">Type</th><th className="px-2 py-2">Attempts</th><th className="px-2 py-2">Completed</th><th className="px-2 py-2">Unsuccessful</th></tr></thead>
                                        <tbody>{report.optionalGames.map((game) => <tr key={game.type} className="border-b border-[#e8eef5] last:border-0"><td className="px-2 py-3 font-semibold text-[#172033]">{formatText(game.type)}</td><td className="px-2 py-3">{game.totalAttempts}</td><td className="px-2 py-3">{game.completed}</td><td className="px-2 py-3">{game.unsuccessful}</td></tr>)}</tbody>
                                    </table>
                                </div>
                            ) : (
                                <p className="mt-4 rounded-lg bg-[#f8fafc] p-4 text-[10px] text-[#64748b]">No optional game outcomes in this report scope.</p>
                            )}
                        </section>
                    </>
                ) : null}
            </div>
        </DashboardLayout>
    );
}

function Filter({ label, children }) {
    return (
        <label className="text-[10px] font-semibold text-[#52627a]">
            {label}
            <span className="mt-1 block [&>input]:min-h-[42px] [&>input]:w-full [&>input]:rounded-lg [&>input]:border [&>input]:border-[#cbd5e1] [&>input]:bg-white [&>input]:px-3 [&>input]:text-[11px] [&>select]:min-h-[42px] [&>select]:w-full [&>select]:rounded-lg [&>select]:border [&>select]:border-[#cbd5e1] [&>select]:bg-white [&>select]:px-3 [&>select]:text-[11px]">
                {children}
            </span>
        </label>
    );
}

function Summary({ label, value }) {
    return <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm"><p className="text-[10px] text-[#64748b]">{label}</p><strong className="mt-2 block text-[22px] text-[#172033]">{value}</strong></article>;
}

function ReportBlock({ title, children }) {
    return <section className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm"><h2 className="text-[13px] font-bold text-[#172033]">{title}</h2><div className="mt-4 grid grid-cols-2 gap-3">{children}</div></section>;
}

function Metric({ label, value }) {
    return <div className="rounded-lg bg-[#f8fafc] p-3"><p className="text-[9px] text-[#64748b]">{label}</p><strong className="mt-1 block text-[14px] text-[#172033]">{value}</strong></div>;
}

function formatPercent(value) {
    return value === null || value === undefined ? "—" : `${Number(value).toFixed(Number.isInteger(Number(value)) ? 0 : 2)}%`;
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleString();
}

function formatText(value) {
    return String(value || "—").replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default AdminReportsPage;
