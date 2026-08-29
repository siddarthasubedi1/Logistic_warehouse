import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import ProfileDetails from "../components/account/ProfileDetails";
import ChangePasswordForm from "../components/account/ChangePasswordForm";

import api from "../services/api";


function ProfilePage({
    role,
}) {
    const navigate =
        useNavigate();


    const [user, setUser] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {
        const loadProfile =
            async () => {
                try {
                    setLoading(true);
                    setError("");


                    const response =
                        await api.get(
                            "/users/me"
                        );


                    setUser(
                        response.data?.user ||
                        null
                    );

                } catch (error) {
                    console.error(
                        "Profile loading error:",
                        error
                    );


                    setError(
                        error.response?.data
                            ?.message ||
                        "Unable to load profile."
                    );

                } finally {
                    setLoading(false);
                }
            };


        loadProfile();

    }, []);


    const dashboardPath =
        role === "trainer"
            ? "/trainer"
            : "/trainee";


    return (
        <DashboardLayout
            role={role}
            showHeader={false}
        >

            <div className="min-h-screen bg-[#f6f8fb]">

                {/* HEADER */}

                <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-7">

                    <div className="flex items-center justify-between">

                        <div>

                            <h1 className="text-[20px] font-bold text-[#172033]">
                                My Profile
                            </h1>

                            <p className="mt-1 text-[10px] text-slate-500">
                                View your personal details and manage account security.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    dashboardPath
                                )
                            }
                            className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <path d="m15 18-6-6 6-6" />
                            </svg>

                            Back to Dashboard

                        </button>

                    </div>

                </header>


                <main className="px-5 py-5 lg:px-7">

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">
                            {error}
                        </div>
                    )}


                    <div className="grid gap-5 xl:grid-cols-[1.2fr_.8fr]">

                        {/* PERSONAL DETAILS */}

                        <ProfileDetails
                            user={user}
                            loading={
                                loading
                            }
                        />


                        {/* PASSWORD */}

                        <ChangePasswordForm />

                    </div>

                </main>

            </div>

        </DashboardLayout>
    );
}


export default ProfilePage;