import { useState } from "react";

import api from "../../services/api";


function ForgotPasswordForm({
    onBackToLogin,
}) {
    const [username, setUsername] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");


    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");
        setSuccess("");


        const cleanUsername =
            username.trim();


        if (!cleanUsername) {
            setError(
                "Please enter your username."
            );

            return;
        }


        try {
            setLoading(true);


            const response =
                await api.post(
                    "/auth/forgot-password",
                    {
                        username:
                            cleanUsername,
                    }
                );


            setSuccess(
                response.data
                    ?.message ||
                "Your password reset request has been submitted."
            );


            setUsername("");

        } catch (error) {
            console.error(
                "Forgot password error:",
                error
            );


            setError(
                error.response?.data
                    ?.message ||
                "Unable to submit password reset request."
            );

        } finally {
            setLoading(false);
        }
    };


    return (
        <section className="flex min-h-[680px] items-center justify-center bg-white px-6 py-10 sm:px-10 lg:px-14">

            <div className="w-full max-w-[430px]">


                {/* MOBILE BRAND */}

                <div className="mb-9 lg:hidden">

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


                {/* ICON */}

                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-[#1769e0] ring-1 ring-blue-100">

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-6 w-6"
                    >
                        <path d="M7 10V8a5 5 0 0 1 10 0v2" />

                        <rect
                            x="5"
                            y="10"
                            width="14"
                            height="10"
                            rx="2"
                        />

                        <path d="M12 14v2.5" />
                    </svg>

                </div>


                {/* TITLE */}

                <div>

                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-blue-600">
                        Account Recovery
                    </p>

                    <h2 className="mt-2 text-[27px] font-bold text-[#172033]">
                        Forgot Password?
                    </h2>

                    <p className="mt-2 max-w-[390px] text-[12px] leading-5 text-slate-500">
                        Enter your username and we will send a password reset request to the administrator.
                    </p>

                </div>


                {/* INFO */}

                <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50/70 p-4">

                    <div className="flex gap-3">

                        <div className="mt-[1px] text-blue-600">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 11v5" />

                                <circle
                                    cx="12"
                                    cy="8"
                                    r=".7"
                                    fill="currentColor"
                                />
                            </svg>

                        </div>


                        <p className="text-[10px] leading-4 text-slate-600">
                            The administrator will generate a new temporary password. Your username will remain the same.
                        </p>

                    </div>

                </div>


                {/* SUCCESS */}

                {success && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3">

                        <div className="flex gap-3">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="mt-[1px] h-4 w-4 shrink-0 text-emerald-600"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="m8 12 2.5 2.5L16 9" />
                            </svg>


                            <div>

                                <p className="text-[10px] font-bold text-emerald-700">
                                    Request Submitted
                                </p>

                                <p className="mt-1 text-[10px] leading-4 text-emerald-700">
                                    {success}
                                </p>

                            </div>

                        </div>

                    </div>
                )}


                {/* ERROR */}

                {error && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[10px] text-red-600">
                        {error}
                    </div>
                )}


                {/* FORM */}

                <form
                    onSubmit={
                        handleSubmit
                    }
                    className="mt-6"
                >

                    <label
                        htmlFor="resetUsername"
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
                            id="resetUsername"
                            type="text"
                            value={
                                username
                            }
                            onChange={(
                                event
                            ) => {
                                setUsername(
                                    event.target
                                        .value
                                );

                                setError("");
                                setSuccess("");
                            }}
                            placeholder="Enter your username"
                            autoComplete="username"
                            disabled={
                                loading
                            }
                            className="h-[48px] w-full rounded-lg border border-slate-200 bg-white pl-11 pr-4 text-[12px] text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />

                    </div>


                    <button
                        type="submit"
                        disabled={
                            loading
                        }
                        className="mt-5 flex h-[48px] w-full items-center justify-center gap-2 rounded-lg bg-[#1769e0] text-[12px] font-semibold text-white transition hover:bg-[#0f5dc9] disabled:cursor-not-allowed disabled:opacity-60"
                    >

                        {loading ? (
                            <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />

                                Submitting...
                            </>
                        ) : (
                            <>
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-4 w-4"
                                >
                                    <path d="M3 12h15" />

                                    <path d="m13 7 5 5-5 5" />
                                </svg>

                                Request Password Reset
                            </>
                        )}

                    </button>

                </form>


                {/* BACK */}

                <div className="mt-6 border-t border-slate-100 pt-5 text-center">

                    <button
                        type="button"
                        onClick={
                            onBackToLogin
                        }
                        disabled={
                            loading
                        }
                        className="inline-flex items-center gap-2 text-[11px] font-semibold text-blue-600 transition hover:text-blue-700 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
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

                        Back to Login

                    </button>

                </div>

            </div>

        </section>
    );
}


export default ForgotPasswordForm;