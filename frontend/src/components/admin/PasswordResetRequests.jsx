import { useCallback, useEffect, useState } from "react";

import api from "../../services/api";


function PasswordResetRequests({
    onManageUser,
}) {
    const [requests, setRequests] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // ======================================================
    // LOAD PENDING PASSWORD RESET REQUESTS
    // ======================================================

    const loadRequests =
        useCallback(async () => {
            try {
                setLoading(true);
                setError("");


                const response =
                    await api.get(
                        "/admin/password-reset-requests"
                    );


                const data =
                    Array.isArray(
                        response.data
                    )
                        ? response.data
                        : response.data
                            ?.requests || [];


                setRequests(data);

            } catch (error) {
                console.error(
                    "Password reset requests error:",
                    error
                );


                setError(
                    error.response?.data
                        ?.message ||
                    "Unable to load password reset requests."
                );

            } finally {
                setLoading(false);
            }
        }, []);


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadRequests();
    }, [loadRequests]);


    // ======================================================
    // DATE FORMAT
    // ======================================================

    const formatDate = (date) => {
        if (!date) {
            return "—";
        }


        return new Date(
            date
        ).toLocaleString();
    };


    // ======================================================
    // USER DISPLAY NAME
    // ======================================================

    const getUserName = (request) => {
        const user =
            request?.user;


        if (
            user?.firstName ||
            user?.lastName
        ) {
            return `${user?.firstName || ""} ${user?.lastName || ""}`.trim();
        }


        return (
            request?.username ||
            "Unknown User"
        );
    };


    // ======================================================
    // USER ID
    // ======================================================

    const getUserId = (request) => {
        if (
            typeof request?.user ===
            "string"
        ) {
            return request.user;
        }


        return (
            request?.user?._id ||
            request?.user?.id ||
            null
        );
    };


    // ======================================================
    // OPEN USER MANAGEMENT
    // ======================================================

    const handleManageUser = (
        request
    ) => {
        const userId =
            getUserId(request);


        if (!userId) {
            return;
        }


        if (onManageUser) {
            onManageUser(
                userId,
                request
            );
        }
    };


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

                <div className="flex items-center gap-3">

                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                    <p className="text-sm text-slate-500">
                        Loading password reset requests...
                    </p>

                </div>

            </div>
        );
    }


    // ======================================================
    // UI
    // ======================================================

    return (
        <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

            {/* HEADER */}

            <div className="flex flex-col gap-3 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                    <div className="flex items-center gap-2">

                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-50 text-blue-600">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M15 7a4 4 0 1 0-7.9 1H3v4h4v3h3v-3h2.1A4 4 0 0 0 15 7Z" />

                                <path d="M16 16h5" />

                                <path d="M18.5 13.5v5" />
                            </svg>

                        </div>


                        <div>

                            <h2 className="text-sm font-bold text-slate-800">
                                Password Reset Requests
                            </h2>

                            <p className="mt-0.5 text-[11px] text-slate-500">
                                Pending requests from Trainers and Trainees
                            </p>

                        </div>

                    </div>

                </div>


                <div className="flex items-center gap-3">

                    {/* REQUEST COUNT */}

                    <span className="rounded-full bg-amber-50 px-3 py-1 text-[10px] font-semibold text-amber-700">
                        {requests.length} Pending
                    </span>


                    {/* REFRESH */}

                    <button
                        type="button"
                        onClick={
                            loadRequests
                        }
                        className="flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-[10px] font-semibold text-slate-600 transition hover:bg-slate-50"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-3.5 w-3.5"
                        >
                            <path d="M20 12a8 8 0 1 1-2.3-5.7" />
                            <path d="M20 4v6h-6" />
                        </svg>

                        Refresh
                    </button>

                </div>

            </div>


            {/* ERROR */}

            {error && (
                <div className="m-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3">

                    <p className="text-[11px] font-semibold text-red-600">
                        {error}
                    </p>

                </div>
            )}


            {/* NO REQUESTS */}

            {!error &&
                requests.length ===
                0 && (
                    <div className="px-6 py-10 text-center">

                        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                className="h-5 w-5"
                            >
                                <path d="m7 12 3 3 7-7" />

                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />
                            </svg>

                        </div>


                        <p className="mt-3 text-xs font-semibold text-slate-700">
                            No pending password reset requests
                        </p>

                        <p className="mt-1 text-[10px] text-slate-400">
                            New requests will appear here.
                        </p>

                    </div>
                )}


            {/* REQUESTS */}

            {!error &&
                requests.length >
                0 && (
                    <div className="divide-y divide-slate-100">

                        {requests.map(
                            (
                                request
                            ) => {
                                const user =
                                    request.user ||
                                    {};

                                const userId =
                                    getUserId(
                                        request
                                    );


                                return (
                                    <div
                                        key={
                                            request._id
                                        }
                                        className="flex flex-col gap-4 px-5 py-4 transition hover:bg-slate-50/70 lg:flex-row lg:items-center lg:justify-between"
                                    >

                                        {/* USER */}

                                        <div className="flex min-w-0 items-center gap-3">

                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#073763] text-xs font-bold uppercase text-white">

                                                {getUserName(
                                                    request
                                                )
                                                    .charAt(
                                                        0
                                                    )}

                                            </div>


                                            <div className="min-w-0">

                                                <p className="truncate text-xs font-bold text-slate-800">
                                                    {getUserName(
                                                        request
                                                    )}
                                                </p>


                                                <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1">

                                                    <span className="text-[10px] text-slate-500">
                                                        Username:{" "}
                                                        <span className="font-semibold text-slate-600">
                                                            {request.username ||
                                                                user.username ||
                                                                "—"}
                                                        </span>
                                                    </span>


                                                    <span className="text-[10px] capitalize text-slate-500">
                                                        Role:{" "}
                                                        <span className="font-semibold text-slate-600">
                                                            {request.role ||
                                                                user.role ||
                                                                "—"}
                                                        </span>
                                                    </span>

                                                </div>

                                            </div>

                                        </div>


                                        {/* REQUEST INFO */}

                                        <div className="flex flex-wrap items-center gap-3 lg:justify-end">

                                            <div>

                                                <p className="text-[9px] uppercase tracking-wide text-slate-400">
                                                    Requested
                                                </p>

                                                <p className="mt-1 text-[10px] font-medium text-slate-600">
                                                    {formatDate(
                                                        request.requestedAt
                                                    )}
                                                </p>

                                            </div>


                                            {/* STATUS */}

                                            <span className="rounded-full border border-amber-200 bg-amber-50 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-amber-700">
                                                Pending
                                            </span>


                                            {/* MANAGE USER */}

                                            {onManageUser && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        !userId
                                                    }
                                                    onClick={() =>
                                                        handleManageUser(
                                                            request
                                                        )
                                                    }
                                                    className="h-9 rounded-lg bg-[#1769e0] px-4 text-[10px] font-semibold text-white transition hover:bg-[#0f5dc9] disabled:cursor-not-allowed disabled:opacity-50"
                                                >
                                                    Manage User
                                                </button>
                                            )}

                                        </div>

                                    </div>
                                );
                            }
                        )}

                    </div>
                )}

        </section>
    );
}


export default PasswordResetRequests;