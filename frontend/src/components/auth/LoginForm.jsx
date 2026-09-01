import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import PasswordInput from "./PasswordInput";


function LoginForm() {
    const navigate = useNavigate();

    const [username, setUsername] =
        useState("");

    const [password, setPassword] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    const clearError = () => {
        if (error) {
            setError("");
        }
    };


    const getDashboardPath = (role) => {
        if (role === "admin") {
            return "/admin";
        }

        if (role === "trainer") {
            return "/trainer";
        }

        if (role === "trainee") {
            return "/trainee";
        }

        return null;
    };


    const getProfilePath = (role) => {
        if (role === "trainer") {
            return "/trainer/profile";
        }

        if (role === "trainee") {
            return "/trainee/profile";
        }

        return null;
    };


    const handleSubmit = async (event) => {
        event.preventDefault();

        const cleanUsername =
            username.trim();

        if (
            !cleanUsername ||
            !password
        ) {
            setError(
                "Please enter your username and password."
            );

            return;
        }


        try {
            setLoading(true);
            setError("");


            const response =
                await api.post(
                    "/auth/login",
                    {
                        username:
                            cleanUsername,

                        password,
                    }
                );


            const {
                accessToken,
                user,
            } = response.data;


            if (
                !accessToken ||
                !user
            ) {
                setError(
                    "Login response is incomplete. Please try again."
                );

                return;
            }


            /*
                Save authentication state.
            */

            sessionStorage.setItem(
                "accessToken",
                accessToken
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(user)
            );


            /*
                ===========================================
                FIRST LOGIN PASSWORD CHANGE
                ===========================================

                Newly-created Trainer/Trainee accounts
                have mustChangePassword = true.

                They must update their temporary password
                before continuing to the dashboard.
            */

            if (
                user.mustChangePassword ===
                true
            ) {
                const profilePath =
                    getProfilePath(
                        user.role
                    );


                if (profilePath) {
                    navigate(
                        profilePath,
                        {
                            replace: true,
                        }
                    );

                    return;
                }
            }


            /*
                ===========================================
                NORMAL ROLE REDIRECTION
                ===========================================
            */

            const dashboardPath =
                getDashboardPath(
                    user.role
                );


            if (!dashboardPath) {
                sessionStorage.removeItem(
                    "accessToken"
                );

                sessionStorage.removeItem(
                    "user"
                );


                setError(
                    "Your account role is not authorised."
                );

                return;
            }


            navigate(
                dashboardPath,
                {
                    replace: true,
                }
            );

        } catch (error) {
            console.error(
                "Login error:",
                error
            );


            /*
                DEACTIVATED ACCOUNT
            */

            if (
                error.response?.status ===
                403 &&
                error.response?.data
                    ?.code ===
                "ACCOUNT_DEACTIVATED"
            ) {
                setError(
                    "Your account has been deactivated. Please contact the administrator."
                );

                return;
            }


            /*
                INVALID USERNAME / PASSWORD
            */

            if (
                error.response?.status ===
                401
            ) {
                setError(
                    error.response?.data
                        ?.message ||
                    "Invalid username or password."
                );

                return;
            }


            /*
                LOGIN RATE LIMIT
            */

            if (
                error.response?.status ===
                429
            ) {
                setError(
                    "Too many login attempts. Please wait and try again."
                );

                return;
            }


            setError(
                error.response?.data
                    ?.message ||
                "Unable to login. Please try again."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="flex min-h-[680px] items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14">

            <div className="w-full max-w-[410px]">

                {/* MOBILE BRAND */}

                <div className="mb-10 lg:hidden">

                    <p className="text-xl font-bold text-[#073763]">
                        UK Logi
                        <span className="text-blue-600">
                            Ware
                        </span>
                    </p>

                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-400">
                        Warehousing & Logistics
                    </p>

                </div>


                {/* TITLE */}

                <div>

                    <h2 className="text-[27px] font-bold text-[#172033]">
                        Welcome Back
                    </h2>

                    <p className="mt-2 text-[12px] leading-5 text-slate-500">
                        Sign in to continue to UK LogiWare Safety Training.
                    </p>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="mt-6 flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                        <div className="mt-[1px] shrink-0 text-red-500">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 7v6" />

                                <circle
                                    cx="12"
                                    cy="17"
                                    r=".7"
                                    fill="currentColor"
                                />

                            </svg>

                        </div>


                        <div>

                            <p className="text-[11px] font-semibold text-red-600">
                                Login Failed
                            </p>

                            <p className="mt-1 text-[10px] leading-4 text-red-500">
                                {error}
                            </p>

                        </div>

                    </div>
                )}


                <form
                    onSubmit={handleSubmit}
                    className="mt-7"
                >

                    {/* USERNAME */}

                    <div>

                        <label
                            htmlFor="username"
                            className="text-[11px] font-semibold text-slate-700"
                        >
                            Username
                        </label>


                        <div className="relative mt-2">

                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">

                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-[18px] w-[18px]"
                                >
                                    <circle
                                        cx="12"
                                        cy="8"
                                        r="4"
                                    />

                                    <path d="M4 21c.8-4 3.5-6 8-6s7.2 2 8 6" />

                                </svg>

                            </div>


                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(
                                    event
                                ) => {
                                    setUsername(
                                        event.target
                                            .value
                                    );

                                    clearError();
                                }}
                                disabled={loading}
                                autoComplete="username"
                                placeholder="Enter your username"
                                className={`h-[48px] w-full rounded-lg border bg-white pl-11 pr-11 text-[12px] text-slate-800 outline-none transition placeholder:text-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 ${error
                                    ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                                    : username
                                        ? "border-emerald-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                        : "border-slate-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                    }`}
                            />


                            {username &&
                                !error && (
                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-emerald-500">

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            className="h-4 w-4"
                                        >
                                            <path d="m7 12 3 3 7-7" />
                                        </svg>

                                    </div>
                                )}

                        </div>

                    </div>


                    {/* PASSWORD */}

                    <div className="mt-5">

                        <PasswordInput
                            value={password}
                            onChange={(
                                event
                            ) => {
                                setPassword(
                                    event.target
                                        .value
                                );

                                clearError();
                            }}
                            error={Boolean(
                                error
                            )}
                            disabled={loading}
                        />

                    </div>


                    {/* LOGIN */}

                    <button
                        type="submit"
                        disabled={loading}
                        className="mt-6 flex h-[48px] w-full items-center justify-center rounded-lg bg-[#1769e0] text-[12px] font-semibold text-white transition hover:bg-[#0f5dc9] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading
                            ? "Signing in..."
                            : "Login"}
                    </button>

                </form>


                {/* HELP */}

                <div className="mt-8 border-t border-slate-100 pt-6 text-center">

                    <p className="text-[10px] text-slate-400">
                        Having trouble signing in?
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-blue-600">
                        Contact your Administrator
                    </p>

                </div>

            </div>

        </section>
    );
}


export default LoginForm;