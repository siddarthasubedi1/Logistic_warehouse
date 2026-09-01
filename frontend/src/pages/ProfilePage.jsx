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
                        response.data
                            ?.user ||
                        null
                    );

                } catch (error) {
                    console.error(
                        "Profile loading error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load profile."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            };


        loadProfile();

    }, []);


    const dashboardPath =
        role === "trainer"
            ? "/trainer"
            : "/trainee";


    const handleProfileImageUpdated = (
        updatedUser
    ) => {
        setUser(
            (
                currentUser
            ) => ({
                ...currentUser,
                ...updatedUser,
            })
        );
    };


    return (
        <DashboardLayout
            role={role}
            showHeader={false}
        >

            <div className="min-h-screen bg-[#f5f7fb]">


                {/* TOP HEADER */}

                <header className="border-b border-slate-200 bg-white px-5 py-4 lg:px-7">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <div className="flex items-center gap-2">

                                <span className="h-2 w-2 rounded-full bg-blue-600" />

                                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-blue-600">
                                    Account Center
                                </p>

                            </div>


                            <h1 className="mt-1 text-[21px] font-bold text-[#172033]">
                                My Profile
                            </h1>


                            <p className="mt-1 text-[10px] text-slate-500">
                                Manage your personal details, profile image and account security.
                            </p>

                        </div>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    dashboardPath
                                )
                            }
                            className="flex h-10 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 text-[10px] font-semibold text-slate-600 shadow-sm transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
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


                <main className="px-5 py-5 lg:px-7 lg:py-6">

                    <div className="mx-auto max-w-[1450px]">


                        {error && (
                            <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">
                                {error}
                            </div>
                        )}


                        {/* PROFILE HERO */}

                        <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-[#073763] via-[#0b4d83] to-[#1769e0] px-6 py-5 text-white shadow-sm">

                            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                                <div>

                                    <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-blue-100">
                                        UK LogiWare Safety Training
                                    </p>

                                    <h2 className="mt-1 text-lg font-bold">
                                        Keep your account secure and up to date
                                    </h2>

                                    <p className="mt-1 max-w-2xl text-[10px] leading-5 text-blue-100">
                                        Update your profile photo and manage your password from one secure place.
                                    </p>

                                </div>


                                <div className="flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 ring-1 ring-white/15">

                                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className="h-4 w-4"
                                        >
                                            <path d="M12 3 5 6v5c0 4.7 2.9 8.2 7 10 4.1-1.8 7-5.3 7-10V6l-7-3Z" />

                                            <path d="m9 12 2 2 4-4" />
                                        </svg>

                                    </div>


                                    <div>

                                        <p className="text-[9px] text-blue-100">
                                            Account Role
                                        </p>

                                        <p className="text-[11px] font-bold capitalize">
                                            {role}
                                        </p>

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* PROFILE CONTENT */}

                        <div className="grid items-start gap-5 xl:grid-cols-[1.18fr_.82fr]">

                            <ProfileDetails
                                user={user}
                                loading={
                                    loading
                                }
                                onProfileImageUpdated={
                                    handleProfileImageUpdated
                                }
                            />


                            <ChangePasswordForm />

                        </div>

                    </div>

                </main>

            </div>

        </DashboardLayout>
    );
}


export default ProfilePage;