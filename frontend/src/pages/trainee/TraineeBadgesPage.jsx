import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import api from "../../services/api";
import { getApiErrorMessage } from "../../utils/training";
import "../../styles/badgeAwardAnimation.css";

const BADGE_ICONS = {
    "programme-completion": "✓",
    "hazard-achievement": "!",
    "quiz-achievement": "★",
};

function TraineeBadgesPage() {
    const [definitions, setDefinitions] = useState([]);
    const [awards, setAwards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        let mounted = true;

        Promise.all([
            api.get("/badges"),
            api.get("/users/me/badges", { params: { limit: 100 } }),
        ])
            .then(([definitionResponse, awardResponse]) => {
                if (!mounted) return;
                setDefinitions(Array.isArray(definitionResponse.data?.badges) ? definitionResponse.data.badges : []);
                setAwards(Array.isArray(awardResponse.data?.badges) ? awardResponse.data.badges : []);
            })
            .catch((requestError) => {
                if (!mounted) return;
                setError(getApiErrorMessage(requestError, "Unable to load badges."));
            })
            .finally(() => {
                if (mounted) setLoading(false);
            });

        return () => { mounted = false; };
    }, []);

    const awardsByKey = useMemo(() => {
        const map = new Map();
        awards.forEach((award) => {
            const key = award.badge?.key;
            if (!key) return;
            if (!map.has(key)) map.set(key, []);
            map.get(key).push(award);
        });
        return map;
    }, [awards]);

    const earnedDefinitionCount = definitions.filter((definition) => awardsByKey.has(definition.key)).length;

    return (
        <DashboardLayout
            role="trainee"
            title="My Badges"
            subtitle="Badges are awarded only from verified learning, hazard and assessment records."
        >
            <div className="app-page trainee-page trainee-badges-page space-y-5">
                <FeedbackAlert type="error" message={error} onClose={() => setError("")} />

                {loading ? (
                    <LoadingCard message="Loading badges..." />
                ) : (
                    <>
                        <section className="grid gap-4 sm:grid-cols-3">
                            <Summary label="Badge Types Earned" value={`${earnedDefinitionCount}/${definitions.length || 3}`} />
                            <Summary label="Total Awards" value={awards.length} />
                            <Summary label="Verified by Server" value="Yes" />
                        </section>

                        <section className="grid gap-4 lg:grid-cols-3">
                            {definitions.map((definition) => {
                                const earned = awardsByKey.get(definition.key) || [];
                                return (
                                    <article key={definition._id || definition.key} className={`rounded-xl border p-5 shadow-sm ${earned.length ? "border-blue-200 bg-white" : "border-[#dbe4ef] bg-slate-50"}`}>
                                        <div className={`flex h-12 w-12 items-center justify-center rounded-full text-xl font-bold ${earned.length ? "bg-blue-600 text-white badge-earned-reveal" : "bg-slate-200 text-slate-500"}`} aria-hidden="true">
                                            {BADGE_ICONS[definition.key] || "★"}
                                        </div>
                                        <div className="mt-4 flex items-start justify-between gap-3">
                                            <div>
                                                <h2 className="text-[13px] font-bold text-[#172033]">{definition.name}</h2>
                                                <p className="mt-2 text-[10px] leading-5 text-[#64748b]">{definition.description}</p>
                                            </div>
                                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[9px] font-bold ${earned.length ? "bg-emerald-50 text-emerald-700" : "bg-slate-200 text-slate-600"}`}>
                                                {earned.length ? "Earned" : "Locked"}
                                            </span>
                                        </div>

                                        {earned.length ? (
                                            <div className="mt-4 space-y-2 border-t border-[#e8eef5] pt-4">
                                                {earned.map((award) => (
                                                    <div key={award._id} className="rounded-lg bg-blue-50 p-3">
                                                        <p className="text-[10px] font-semibold text-[#172033]">
                                                            {award.programme?.title || formatText(award.moduleKey) || "Training programme"}
                                                        </p>
                                                        <p className="mt-1 text-[9px] text-[#64748b]">
                                                            Awarded {formatDate(award.awardedAt)}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        ) : (
                                            <p className="mt-4 border-t border-[#e8eef5] pt-4 text-[9px] text-[#64748b]">
                                                Complete the required verified activity to unlock this badge.
                                            </p>
                                        )}
                                    </article>
                                );
                            })}
                        </section>

                        {!definitions.length && (
                            <section className="rounded-xl border border-[#dbe4ef] bg-white p-8 text-center text-[11px] text-[#64748b]">
                                Badge definitions are not available yet.
                            </section>
                        )}
                    </>
                )}
            </div>
        </DashboardLayout>
    );
}

function Summary({ label, value }) {
    return (
        <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
            <p className="text-[10px] text-[#64748b]">{label}</p>
            <strong className="mt-2 block text-[22px] text-[#172033]">{value}</strong>
        </article>
    );
}

function formatDate(value) {
    if (!value) return "—";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString();
}

function formatText(value) {
    return String(value || "").replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

export default TraineeBadgesPage;
