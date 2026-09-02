import {
    useEffect,
    useState,
} from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import TrainerHeader from "../components/trainer/TrainerHeader";
import TrainerModuleCard from "../components/trainer/TrainerModuleCard";
import TrainerStats from "../components/trainer/TrainerStats";
import TrainerTaskOverview from "../components/trainer/TrainerTaskOverview";
import TrainerScores from "../components/trainer/TrainerScores";
import TrainerProgressOverview from "../components/trainer/TrainerProgressOverview";
import TrainerRecentActivity from "../components/trainer/TrainerRecentActivity";

import api from "../services/api";


function TrainerDashboard() {
    // ======================================================
    // USER STATE
    // ======================================================

    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================================
    // LOAD TRAINER FROM DATABASE
    // ======================================================

    useEffect(() => {
        const loadTrainerProfile =
            async () => {
                try {
                    setLoading(true);
                    setError("");


                    /*
                        GET CURRENT AUTHENTICATED USER

                        Backend route:

                        GET /api/users/me

                        Authentication token is
                        automatically added by api.js.
                    */

                    const response =
                        await api.get(
                            "/users/me"
                        );


                    const currentUser =
                        response.data?.user;


                    if (!currentUser) {
                        setError(
                            "Unable to load trainer information."
                        );

                        return;
                    }


                    // ==================================================
                    // EXTRA ROLE CHECK
                    // ==================================================

                    /*
                        ProtectedRoute already protects
                        the page.

                        This is an additional frontend
                        safety check.
                    */

                    if (
                        currentUser.role !==
                        "trainer"
                    ) {
                        setError(
                            "This account is not authorised to access the Trainer Dashboard."
                        );

                        return;
                    }


                    // ==================================================
                    // SAVE REAL USER
                    // ==================================================

                    setUser(
                        currentUser
                    );


                    /*
                        Keep sessionStorage updated so
                        TrainerHeader/ProfileHeaderButton
                        and other components use the
                        newest database information.
                    */

                    sessionStorage.setItem(
                        "user",
                        JSON.stringify(
                            currentUser
                        )
                    );

                } catch (error) {
                    console.error(
                        "Trainer dashboard profile error:",
                        error
                    );


                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load Trainer Dashboard information."
                    );

                } finally {
                    setLoading(false);
                }
            };


        loadTrainerProfile();

    }, []);


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >
                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">

                    <div className="text-center">

                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm font-medium text-slate-600">
                            Loading Trainer Dashboard...
                        </p>

                    </div>

                </div>
            </DashboardLayout>
        );
    }


    // ======================================================
    // ERROR
    // ======================================================

    if (error) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >
                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5">

                    <div className="w-full max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">

                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 7v6" />

                                <path d="M12 17h.01" />
                            </svg>

                        </div>


                        <h2 className="mt-4 text-base font-bold text-slate-900">
                            Unable to Load Dashboard
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>

                    </div>

                </div>
            </DashboardLayout>
        );
    }


    // ======================================================
    // DASHBOARD
    // ======================================================

    return (
        <DashboardLayout
            role="trainer"
            showHeader={false}
        >
            <div className="min-h-screen bg-[#f6f8fb]">

                {/* ==================================================
                    HEADER
                ================================================== */}

                <TrainerHeader
                    user={user}
                />


                {/* ==================================================
                    CONTENT
                ================================================== */}

                <main className="space-y-4 px-5 py-4 lg:px-6">

                    {/* ==================================================
                        REAL DATABASE ACCOUNT INFORMATION
                    ================================================== */}

                    <section className="rounded-xl border border-slate-200 bg-white px-5 py-4 shadow-sm">

                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                            <div>

                                <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-blue-600">
                                    Trainer Account
                                </p>

                                <h2 className="mt-1 text-lg font-bold text-slate-900">

                                    {user?.firstName}{" "}
                                    {user?.lastName}

                                </h2>

                                <p className="mt-1 text-[10px] text-slate-500">

                                    Username:{" "}

                                    <span className="font-semibold text-slate-700">
                                        {user?.username}
                                    </span>

                                </p>

                            </div>


                            <div className="flex flex-wrap items-center gap-2">

                                <span className="rounded-full bg-blue-50 px-3 py-1.5 text-[9px] font-semibold capitalize text-blue-700">

                                    {user?.role}

                                </span>


                                <span
                                    className={`rounded-full px-3 py-1.5 text-[9px] font-semibold capitalize ${user?.status ===
                                        "active"
                                        ? "bg-emerald-50 text-emerald-700"
                                        : "bg-red-50 text-red-600"
                                        }`}
                                >

                                    {user?.status}

                                </span>

                            </div>

                        </div>

                    </section>


                    {/* ==================================================
                        TOP
                    ================================================== */}

                    <div className="grid gap-4 xl:grid-cols-[1.15fr_2.2fr]">

                        <TrainerModuleCard />

                        <TrainerStats />

                    </div>


                    {/* ==================================================
                        MIDDLE
                    ================================================== */}

                    <div className="grid gap-4 xl:grid-cols-2">

                        <TrainerTaskOverview />

                        <TrainerScores />

                    </div>


                    {/* ==================================================
                        BOTTOM
                    ================================================== */}

                    <div className="grid gap-4 xl:grid-cols-2">

                        <TrainerProgressOverview />

                        <TrainerRecentActivity />

                    </div>


                    {/* ==================================================
                        FOOTER
                    ================================================== */}

                    <footer className="flex items-center justify-between border-t border-slate-200 pt-4 text-[9px] text-slate-400">

                        <span>
                            © 2026 UK LogiWare. All rights reserved.
                        </span>

                        <span>
                            Version 1.0.0
                        </span>

                    </footer>

                </main>

            </div>

        </DashboardLayout>
    );
}


export default TrainerDashboard;