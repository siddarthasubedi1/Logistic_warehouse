import {
    useCallback,
    useEffect,
    useState,
} from "react";

import api from "../../services/api";


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
    // LOAD
    // ======================================================

    const loadRequests =
        useCallback(
            async (
                refresh = false
            ) => {
                try {
                    if (
                        refresh
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


    useEffect(() => {
        loadRequests();
    }, [
        loadRequests,
    ]);


    const pendingRequests =
        requests.filter(
            (
                request
            ) =>
                request?.status ===
                "pending"
        );


    const getUserId = (
        request
    ) => {
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


    const getUserName = (
        request
    ) => {
        const user =
            request?.user;


        const fullName =
            [
                user?.firstName,
                user?.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .trim();


        return (
            fullName ||
            request?.username ||
            user?.username ||
            "Unknown User"
        );
    };


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


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* HEADER */}

            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-slate-100
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                <div>
                    <h2
                        className="
                            text-[12px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Password Reset Requests
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Requests submitted by Trainers and Trainees.
                    </p>
                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    <span
                        className="
                            rounded-full
                            bg-amber-50
                            px-3
                            py-1.5
                            text-[8px]
                            font-medium
                            text-amber-600
                        "
                    >
                        {pendingRequests.length} Pending
                    </span>


                    <button
                        type="button"
                        onClick={() =>
                            loadRequests(
                                true
                            )
                        }
                        disabled={
                            refreshing
                        }
                        className="
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2
                            text-[9px]
                            text-slate-600
                            hover:bg-slate-50
                            disabled:opacity-50
                        "
                    >
                        {refreshing
                            ? "Refreshing..."
                            : "Refresh"}
                    </button>
                </div>
            </div>


            {/* CONTENT */}

            <div
                className="
                    p-5
                "
            >
                {loading && (
                    <div
                        className="
                            py-10
                            text-center
                            text-[9px]
                            text-slate-400
                        "
                    >
                        Loading password reset requests...
                    </div>
                )}


                {!loading &&
                    error && (
                        <div
                            className="
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-[9px]
                            text-red-600
                        "
                        >
                            {error}
                        </div>
                    )}


                {!loading &&
                    !error &&
                    pendingRequests.length ===
                    0 && (
                        <div
                            className="
                            py-12
                            text-center
                        "
                        >
                            <div
                                className="
                                mx-auto
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-blue-500
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
                                </svg>
                            </div>


                            <p
                                className="
                                mt-3
                                text-[11px]
                                font-medium
                                text-slate-700
                            "
                            >
                                No pending password reset requests
                            </p>


                            <p
                                className="
                                mt-1
                                text-[8px]
                                text-slate-400
                            "
                            >
                                New reset requests will appear here.
                            </p>
                        </div>
                    )}


                {!loading &&
                    !error &&
                    pendingRequests.length >
                    0 && (
                        <div
                            className="
                            divide-y
                            divide-slate-100
                        "
                        >
                            {pendingRequests.map(
                                (
                                    request
                                ) => {
                                    const userId =
                                        getUserId(
                                            request
                                        );


                                    const userName =
                                        getUserName(
                                            request
                                        );


                                    const role =
                                        request.role ||
                                        request.user
                                            ?.role ||
                                        "User";


                                    return (
                                        <div
                                            key={
                                                request._id
                                            }
                                            className="
                                            flex
                                            flex-col
                                            gap-3
                                            py-4
                                            sm:flex-row
                                            sm:items-center
                                            sm:justify-between
                                        "
                                        >
                                            <div
                                                className="
                                                flex
                                                min-w-0
                                                items-center
                                                gap-3
                                            "
                                            >
                                                <div
                                                    className="
                                                    flex
                                                    h-9
                                                    w-9
                                                    shrink-0
                                                    items-center
                                                    justify-center
                                                    rounded-full
                                                    bg-blue-50
                                                    text-[10px]
                                                    font-semibold
                                                    text-blue-600
                                                "
                                                >
                                                    {userName
                                                        .charAt(
                                                            0
                                                        )
                                                        .toUpperCase()}
                                                </div>


                                                <div
                                                    className="
                                                    min-w-0
                                                "
                                                >
                                                    <p
                                                        className="
                                                        truncate
                                                        text-[10px]
                                                        font-medium
                                                        text-slate-700
                                                    "
                                                    >
                                                        {userName}
                                                    </p>


                                                    <p
                                                        className="
                                                        mt-1
                                                        text-[8px]
                                                        capitalize
                                                        text-slate-400
                                                    "
                                                    >
                                                        {role}
                                                        {" · "}
                                                        {formatDate(
                                                            request.requestedAt
                                                        )}
                                                    </p>
                                                </div>
                                            </div>


                                            {onManageUser && (
                                                <button
                                                    type="button"
                                                    disabled={
                                                        !userId
                                                    }
                                                    onClick={() =>
                                                        onManageUser(
                                                            userId,
                                                            request
                                                        )
                                                    }
                                                    className="
                                                    rounded-lg
                                                    bg-blue-600
                                                    px-4
                                                    py-2
                                                    text-[9px]
                                                    font-medium
                                                    text-white
                                                    hover:bg-blue-700
                                                    disabled:opacity-50
                                                "
                                                >
                                                    Manage User
                                                </button>
                                            )}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                    )}
            </div>

        </section>
    );
}


export default PasswordResetRequests;