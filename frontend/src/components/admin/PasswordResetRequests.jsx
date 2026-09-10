import {
    useCallback,
    useEffect,
    useState,
} from "react";

import api from "../../services/api";

import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import FeedbackAlert from "../ui/FeedbackAlert";
import LoadingCard from "../ui/LoadingCard";


// ======================================================
// PASSWORD RESET REQUESTS
// ======================================================

function PasswordResetRequests({
    onManageUser,
}) {
    const [
        requests,
        setRequests,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        refreshing,
        setRefreshing,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");


    // ======================================================
    // LOAD REQUESTS
    // ======================================================

    const loadRequests =
        useCallback(
            async (
                isRefresh = false
            ) => {
                try {
                    if (
                        isRefresh
                    ) {
                        setRefreshing(
                            true
                        );
                    } else {
                        setLoading(
                            true
                        );
                    }

                    setError(
                        ""
                    );


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
                                ?.requests ||
                            [];


                    setRequests(
                        data
                    );

                } catch (error) {
                    console.error(
                        "Password reset requests error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load password reset requests."
                    );

                } finally {
                    setLoading(
                        false
                    );

                    setRefreshing(
                        false
                    );
                }
            },
            []
        );


    // ======================================================
    // INITIAL LOAD
    // ======================================================

    useEffect(() => {
        loadRequests();
    }, [
        loadRequests,
    ]);


    // ======================================================
    // DATE
    // ======================================================

    const formatDate = (
        date
    ) => {
        if (!date) {
            return "—";
        }


        const parsed =
            new Date(
                date
            );


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "—";
        }


        return parsed.toLocaleString();
    };


    // ======================================================
    // USER NAME
    // ======================================================

    const getUserName = (
        request
    ) => {
        const user =
            request?.user;


        if (
            user?.firstName ||
            user?.lastName
        ) {
            return [
                user?.firstName,
                user?.lastName,
            ]
                .filter(
                    Boolean
                )
                .join(" ");
        }


        return (
            request?.username ||
            user?.username ||
            "Unknown User"
        );
    };


    // ======================================================
    // USER ID
    // ======================================================

    const getUserId = (
        request
    ) => {
        if (
            typeof request
                ?.user ===
            "string"
        ) {
            return request.user;
        }


        return (
            request
                ?.user
                ?._id ||
            request
                ?.user
                ?.id ||
            null
        );
    };


    // ======================================================
    // MANAGE USER
    // ======================================================

    const handleManageUser = (
        request
    ) => {
        const userId =
            getUserId(
                request
            );


        if (
            !userId ||
            !onManageUser
        ) {
            return;
        }


        onManageUser(
            userId,
            request
        );
    };


    // ======================================================
    // PENDING ONLY
    // ======================================================

    const pendingRequests =
        requests.filter(
            (
                request
            ) =>
                request?.status ===
                "pending"
        );


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <LoadingCard
                message="Loading password reset requests..."
            />
        );
    }


    // ======================================================
    // UI
    // ======================================================

    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    overflow-hidden
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-white
                    via-white
                    to-amber-50/60
                    p-5
                    sm:p-6
                "
            >

                <div
                    className="
                        pointer-events-none
                        absolute
                        -right-16
                        -top-16
                        h-40
                        w-40
                        rounded-full
                        bg-amber-50
                    "
                />


                <div
                    className="
                        relative
                        z-10
                        flex
                        flex-col
                        gap-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-amber-50
                                text-amber-600
                            "
                        >

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

                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.16em]
                                    text-amber-600
                                "
                            >
                                Account Security
                            </p>


                            <h2
                                className="
                                    mt-1
                                    text-sm
                                    font-bold
                                    text-slate-900
                                    sm:text-base
                                "
                            >
                                Password Reset Requests
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Requests submitted by Trainers and
                                Trainees who need a new temporary
                                password.
                            </p>

                        </div>

                    </div>


                    <div
                        className="
                            flex
                            flex-col
                            gap-2
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        <span
                            className="
                                inline-flex
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-amber-200
                                bg-amber-50
                                px-3
                                py-2
                                text-[9px]
                                font-bold
                                text-amber-700
                            "
                        >
                            {pendingRequests.length} Pending
                        </span>


                        <ActionButton
                            variant="secondary"
                            disabled={
                                refreshing
                            }
                            onClick={() =>
                                loadRequests(
                                    true
                                )
                            }
                            className="
                                w-full
                                justify-center
                                sm:w-auto
                            "
                        >
                            {refreshing
                                ? "Refreshing..."
                                : "Refresh"}
                        </ActionButton>

                    </div>

                </div>

            </div>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="p-4 sm:p-5">

                <FeedbackAlert
                    type="error"
                    message={
                        error
                    }
                    onClose={() =>
                        setError(
                            ""
                        )
                    }
                />


                {!error &&
                    pendingRequests.length ===
                    0 && (
                        <EmptyState
                            title="No pending password reset requests"
                            description="New Trainer or Trainee password-reset requests will appear here."
                        />
                    )}


                {!error &&
                    pendingRequests.length >
                    0 && (
                        <div
                            className="
                                grid
                                gap-3
                                lg:grid-cols-2
                            "
                        >

                            {pendingRequests.map(
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


                                    const userName =
                                        getUserName(
                                            request
                                        );


                                    const initial =
                                        userName
                                            .charAt(
                                                0
                                            )
                                            .toUpperCase();


                                    return (
                                        <article
                                            key={
                                                request._id
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-white
                                                p-4
                                                transition
                                                hover:border-blue-200
                                                hover:shadow-sm
                                            "
                                        >

                                            <div
                                                className="
                                                    flex
                                                    items-start
                                                    gap-3
                                                "
                                            >

                                                <div
                                                    className="
                                                        flex
                                                        h-10
                                                        w-10
                                                        shrink-0
                                                        items-center
                                                        justify-center
                                                        rounded-full
                                                        bg-[#073763]
                                                        text-xs
                                                        font-bold
                                                        text-white
                                                    "
                                                >
                                                    {initial ||
                                                        "U"}
                                                </div>


                                                <div
                                                    className="
                                                        min-w-0
                                                        flex-1
                                                    "
                                                >

                                                    <div
                                                        className="
                                                            flex
                                                            flex-wrap
                                                            items-start
                                                            justify-between
                                                            gap-2
                                                        "
                                                    >

                                                        <div className="min-w-0">

                                                            <h3
                                                                className="
                                                                    truncate
                                                                    text-[11px]
                                                                    font-bold
                                                                    text-slate-900
                                                                "
                                                            >
                                                                {userName}
                                                            </h3>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    truncate
                                                                    text-[9px]
                                                                    text-slate-500
                                                                "
                                                            >
                                                                {request.username ||
                                                                    user.username ||
                                                                    "No username"}
                                                            </p>

                                                        </div>


                                                        <span
                                                            className="
                                                                rounded-full
                                                                border
                                                                border-amber-200
                                                                bg-amber-50
                                                                px-2.5
                                                                py-1
                                                                text-[8px]
                                                                font-bold
                                                                uppercase
                                                                tracking-wide
                                                                text-amber-700
                                                            "
                                                        >
                                                            Pending
                                                        </span>

                                                    </div>


                                                    <div
                                                        className="
                                                            mt-3
                                                            grid
                                                            gap-2
                                                            sm:grid-cols-2
                                                        "
                                                    >

                                                        <RequestInfo
                                                            label="Role"
                                                            value={
                                                                request.role ||
                                                                user.role ||
                                                                "—"
                                                            }
                                                        />


                                                        <RequestInfo
                                                            label="Requested"
                                                            value={
                                                                formatDate(
                                                                    request.requestedAt
                                                                )
                                                            }
                                                        />

                                                    </div>

                                                </div>

                                            </div>


                                            {onManageUser && (
                                                <ActionButton
                                                    variant="primary"
                                                    disabled={
                                                        !userId
                                                    }
                                                    onClick={() =>
                                                        handleManageUser(
                                                            request
                                                        )
                                                    }
                                                    className="
                                                        mt-4
                                                        w-full
                                                        justify-center
                                                    "
                                                >
                                                    Manage User
                                                </ActionButton>
                                            )}

                                        </article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </div>

        </section>
    );
}


// ======================================================
// REQUEST INFO
// ======================================================

function RequestInfo({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                px-3
                py-2.5
            "
        >

            <p
                className="
                    text-[7px]
                    font-semibold
                    uppercase
                    tracking-wide
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-words
                    text-[9px]
                    font-semibold
                    capitalize
                    text-slate-700
                "
            >
                {value}
            </p>

        </div>
    );
}


export default PasswordResetRequests;