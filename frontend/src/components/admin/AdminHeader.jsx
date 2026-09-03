import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import api from "../../services/api";


function AdminHeader({
    user,
}) {
    const navigate = useNavigate();

    const notificationRef = useRef(null);

    const [showNotifications, setShowNotifications] =
        useState(false);

    const [resetRequests, setResetRequests] =
        useState([]);

    const [loadingNotifications, setLoadingNotifications] =
        useState(false);

    const [notificationError, setNotificationError] =
        useState("");


    // ======================================================
    // ADMIN INFORMATION
    // ======================================================

    const firstName =
        user?.firstName ||
        "Administrator";

    const lastName =
        user?.lastName || "";

    const fullName =
        `${firstName} ${lastName}`.trim();

    const initial =
        firstName
            .charAt(0)
            .toUpperCase();


    // ======================================================
    // GET USER ID FROM PASSWORD RESET REQUEST
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
    // GET USER NAME
    // ======================================================

    const getUserName = (request) => {
        const requestUser =
            request?.user;

        if (
            requestUser?.firstName ||
            requestUser?.lastName
        ) {
            return `${requestUser?.firstName || ""} ${requestUser?.lastName || ""}`.trim();
        }

        return (
            request?.username ||
            "Unknown User"
        );
    };


    // ======================================================
    // FORMAT ROLE
    // ======================================================

    const formatRole = (role) => {
        if (!role) {
            return "User";
        }

        return (
            role.charAt(0).toUpperCase() +
            role.slice(1)
        );
    };


    // ======================================================
    // FORMAT REQUEST TIME
    // ======================================================

    const formatRequestTime = (date) => {
        if (!date) {
            return "";
        }

        const requestDate =
            new Date(date);

        return requestDate.toLocaleString(
            [],
            {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    // ======================================================
    // LOAD PASSWORD RESET NOTIFICATIONS
    // ======================================================

    const loadResetNotifications =
        useCallback(async () => {
            try {
                setLoadingNotifications(true);
                setNotificationError("");

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

                setResetRequests(
                    data
                );

            } catch (error) {
                console.error(
                    "Notification loading error:",
                    error
                );

                setNotificationError(
                    error.response?.data
                        ?.message ||
                    "Unable to load notifications."
                );

            } finally {
                setLoadingNotifications(false);
            }
        }, []);


    // ======================================================
    // INITIAL NOTIFICATION LOAD
    // ======================================================

    useEffect(() => {
        loadResetNotifications();
    }, [loadResetNotifications]);


    // ======================================================
    // CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ======================================================

    useEffect(() => {
        const handleOutsideClick = (
            event
        ) => {
            if (
                notificationRef.current &&
                !notificationRef.current.contains(
                    event.target
                )
            ) {
                setShowNotifications(false);
            }
        };

        document.addEventListener(
            "mousedown",
            handleOutsideClick
        );

        return () => {
            document.removeEventListener(
                "mousedown",
                handleOutsideClick
            );
        };
    }, []);


    // ======================================================
    // TOGGLE NOTIFICATION DROPDOWN
    // ======================================================

    const handleNotificationClick =
        async () => {
            const nextState =
                !showNotifications;

            setShowNotifications(
                nextState
            );

            /*
                Refresh notifications whenever
                Admin opens the notification panel.
            */

            if (nextState) {
                await loadResetNotifications();
            }
        };


    // ======================================================
    // OPEN USER FROM NOTIFICATION
    // ======================================================

    const handleOpenRequest = (
        request
    ) => {
        const userId =
            getUserId(request);

        if (!userId) {
            return;
        }

        setShowNotifications(
            false
        );

        navigate(
            "/admin/users",
            {
                state: {
                    selectedUserId:
                        userId,

                    passwordResetRequest:
                        request,
                },
            }
        );
    };


    // ======================================================
    // UI
    // ======================================================

    return (
        <header className="relative z-30 border-b border-slate-200 bg-white px-5 py-4 lg:px-7">

            <div className="flex flex-wrap items-center justify-between gap-4">

                {/* ==================================================
                    LEFT
                ================================================== */}

                <div>

                    <h1 className="text-xl font-bold text-[#172033]">
                        Admin Dashboard
                    </h1>

                    <p className="mt-1 text-xs text-slate-500">
                        Welcome back,{" "}
                        <span className="font-semibold text-blue-600">
                            {fullName}
                        </span>
                        !
                    </p>

                </div>


                {/* ==================================================
                    RIGHT
                ================================================== */}

                <div className="flex items-center gap-4">

                    {/* ==================================================
                        NOTIFICATION
                    ================================================== */}

                    <div
                        ref={notificationRef}
                        className="relative"
                    >

                        {/* BELL BUTTON */}

                        <button
                            type="button"
                            onClick={
                                handleNotificationClick
                            }
                            aria-label="Notifications"
                            className={`relative flex h-10 w-10 items-center justify-center rounded-full border transition ${showNotifications
                                ? "border-blue-200 bg-blue-50 text-blue-600"
                                : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                        >

                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-5 w-5"
                            >
                                <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                                <path d="M10 21h4" />
                            </svg>


                            {/* NOTIFICATION COUNT */}

                            {resetRequests.length > 0 && (
                                <span className="absolute -right-1 -top-1 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-bold leading-none text-white ring-2 ring-white">

                                    {resetRequests.length >
                                        99
                                        ? "99+"
                                        : resetRequests.length}

                                </span>
                            )}

                        </button>


                        {/* ==================================================
                            NOTIFICATION DROPDOWN
                        ================================================== */}

                        {showNotifications && (
                            <div className="absolute right-0 top-12 w-[340px] overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl sm:w-[380px]">

                                {/* HEADER */}

                                <div className="flex items-center justify-between border-b border-slate-100 px-4 py-4">

                                    <div>

                                        <div className="flex items-center gap-2">

                                            <h3 className="text-sm font-bold text-slate-800">
                                                Notifications
                                            </h3>


                                            {resetRequests.length >
                                                0 && (
                                                    <span className="rounded-full bg-red-50 px-2 py-0.5 text-[9px] font-bold text-red-600">
                                                        {
                                                            resetRequests.length
                                                        }{" "}
                                                        New
                                                    </span>
                                                )}

                                        </div>


                                        <p className="mt-1 text-[10px] text-slate-500">
                                            Password reset requests
                                        </p>

                                    </div>


                                    {/* REFRESH */}

                                    <button
                                        type="button"
                                        onClick={
                                            loadResetNotifications
                                        }
                                        disabled={
                                            loadingNotifications
                                        }
                                        className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:bg-slate-50 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-60"
                                        aria-label="Refresh notifications"
                                    >

                                        <svg
                                            viewBox="0 0 24 24"
                                            fill="none"
                                            stroke="currentColor"
                                            strokeWidth="1.8"
                                            className={`h-4 w-4 ${loadingNotifications
                                                ? "animate-spin"
                                                : ""
                                                }`}
                                        >
                                            <path d="M20 12a8 8 0 1 1-2.3-5.7" />

                                            <path d="M20 4v6h-6" />
                                        </svg>

                                    </button>

                                </div>


                                {/* ==================================================
                                    LOADING
                                ================================================== */}

                                {loadingNotifications && (
                                    <div className="flex items-center justify-center gap-2 px-5 py-8">

                                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />

                                        <p className="text-xs text-slate-500">
                                            Loading notifications...
                                        </p>

                                    </div>
                                )}


                                {/* ==================================================
                                    ERROR
                                ================================================== */}

                                {!loadingNotifications &&
                                    notificationError && (
                                        <div className="p-4">

                                            <div className="rounded-xl border border-red-200 bg-red-50 px-3 py-3">

                                                <p className="text-xs font-medium text-red-600">
                                                    {
                                                        notificationError
                                                    }
                                                </p>

                                            </div>

                                        </div>
                                    )}


                                {/* ==================================================
                                    NO NOTIFICATIONS
                                ================================================== */}

                                {!loadingNotifications &&
                                    !notificationError &&
                                    resetRequests.length ===
                                    0 && (
                                        <div className="px-5 py-9 text-center">

                                            <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-600">

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
                                                No new notifications
                                            </p>


                                            <p className="mt-1 text-[10px] text-slate-400">
                                                No pending password reset requests.
                                            </p>

                                        </div>
                                    )}


                                {/* ==================================================
                                    NOTIFICATION LIST
                                ================================================== */}

                                {!loadingNotifications &&
                                    !notificationError &&
                                    resetRequests.length >
                                    0 && (
                                        <div className="max-h-[360px] overflow-y-auto">

                                            {resetRequests.map(
                                                (
                                                    request
                                                ) => {
                                                    const requestUser =
                                                        request.user ||
                                                        {};

                                                    const requestRole =
                                                        requestUser.role ||
                                                        request.role;

                                                    const userName =
                                                        getUserName(
                                                            request
                                                        );

                                                    const firstLetter =
                                                        userName
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase();

                                                    return (
                                                        <button
                                                            key={
                                                                request._id
                                                            }
                                                            type="button"
                                                            onClick={() =>
                                                                handleOpenRequest(
                                                                    request
                                                                )
                                                            }
                                                            className="flex w-full items-start gap-3 border-b border-slate-100 px-4 py-4 text-left transition last:border-b-0 hover:bg-slate-50"
                                                        >

                                                            {/* AVATAR */}

                                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold uppercase text-blue-700">
                                                                {
                                                                    firstLetter
                                                                }
                                                            </div>


                                                            {/* INFORMATION */}

                                                            <div className="min-w-0 flex-1">

                                                                <div className="flex items-start justify-between gap-2">

                                                                    <p className="truncate text-xs font-semibold text-slate-800">
                                                                        {
                                                                            userName
                                                                        }
                                                                    </p>


                                                                    <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-red-500" />

                                                                </div>


                                                                <p className="mt-1 text-[10px] leading-4 text-slate-500">
                                                                    Requested a password reset.
                                                                </p>


                                                                <div className="mt-2 flex flex-wrap items-center gap-2">

                                                                    <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[9px] font-semibold text-blue-700">
                                                                        {formatRole(
                                                                            requestRole
                                                                        )}
                                                                    </span>


                                                                    <span className="text-[9px] text-slate-400">
                                                                        {formatRequestTime(
                                                                            request.requestedAt
                                                                        )}
                                                                    </span>

                                                                </div>

                                                            </div>

                                                        </button>
                                                    );
                                                }
                                            )}

                                        </div>
                                    )}


                                {/* ==================================================
                                    FOOTER
                                ================================================== */}

                                {resetRequests.length >
                                    0 &&
                                    !notificationError && (
                                        <div className="border-t border-slate-100 bg-slate-50 px-4 py-3">

                                            <p className="text-center text-[10px] text-slate-500">
                                                Click a notification to manage the user.
                                            </p>

                                        </div>
                                    )}

                            </div>
                        )}

                    </div>


                    {/* DIVIDER */}

                    <div className="h-9 w-px bg-slate-200" />


                    {/* ==================================================
                        ADMIN PROFILE
                    ================================================== */}

                    <div className="flex items-center gap-3">

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                            {initial}
                        </div>


                        <div className="hidden sm:block">

                            <p className="text-xs font-semibold text-slate-800">
                                {fullName}
                            </p>

                            <p className="mt-[2px] text-[10px] text-slate-500">
                                Administrator
                            </p>

                        </div>

                    </div>

                </div>

            </div>

        </header>
    );
}


export default AdminHeader;