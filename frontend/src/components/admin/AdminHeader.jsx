import {
    useCallback,
    useEffect,
    useRef,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import api from "../../services/api";


// ======================================================
// ADMIN HEADER
// ======================================================

function AdminHeader({
    user,
}) {
    const navigate =
        useNavigate();


    const notificationRef =
        useRef(null);


    const [
        showNotifications,
        setShowNotifications,
    ] = useState(false);


    const [
        resetRequests,
        setResetRequests,
    ] = useState([]);


    const [
        loadingNotifications,
        setLoadingNotifications,
    ] = useState(false);


    const [
        notificationError,
        setNotificationError,
    ] = useState("");


    // ======================================================
    // ADMIN INFORMATION
    // ======================================================

    const firstName =
        user?.firstName ||
        "Administrator";


    const lastName =
        user?.lastName ||
        "";


    const fullName =
        `${firstName} ${lastName}`.trim();


    const initial =
        firstName
            .charAt(0)
            .toUpperCase();


    // ======================================================
    // USER ID FROM RESET REQUEST
    // ======================================================

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


    // ======================================================
    // USER NAME
    // ======================================================

    const getUserName = (
        request
    ) => {
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
            requestUser?.username ||
            "Unknown User"
        );
    };


    // ======================================================
    // ROLE
    // ======================================================

    const formatRole = (
        role
    ) => {
        if (!role) {
            return "User";
        }


        return (
            role
                .charAt(0)
                .toUpperCase() +
            role.slice(1)
        );
    };


    // ======================================================
    // TIME
    // ======================================================

    const formatRequestTime = (
        date
    ) => {
        if (!date) {
            return "";
        }


        const requestDate =
            new Date(date);


        if (
            Number.isNaN(
                requestDate.getTime()
            )
        ) {
            return "";
        }


        return requestDate.toLocaleString(
            [],
            {
                month:
                    "short",

                day:
                    "numeric",

                hour:
                    "2-digit",

                minute:
                    "2-digit",
            }
        );
    };


    // ======================================================
    // LOAD PASSWORD RESET NOTIFICATIONS
    // ======================================================

    const loadResetNotifications =
        useCallback(
            async () => {
                try {
                    setLoadingNotifications(
                        true
                    );

                    setNotificationError(
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


                    setResetRequests(
                        data.filter(
                            (
                                request
                            ) =>
                                request?.status ===
                                "pending"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Notification loading error:",
                        error
                    );


                    setNotificationError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load notifications."
                    );

                } finally {
                    setLoadingNotifications(
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
        loadResetNotifications();
    }, [
        loadResetNotifications,
    ]);


    // ======================================================
    // OUTSIDE CLICK
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
                setShowNotifications(
                    false
                );
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
    // TOGGLE NOTIFICATIONS
    // ======================================================

    const handleNotificationClick =
        async () => {
            const nextState =
                !showNotifications;


            setShowNotifications(
                nextState
            );


            if (nextState) {
                await loadResetNotifications();
            }
        };


    // ======================================================
    // OPEN REQUEST
    // ======================================================

    const handleOpenRequest = (
        request
    ) => {
        const userId =
            getUserId(
                request
            );


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
        <header
            className="
                relative
                z-30
                border-b
                border-slate-200
                bg-white/95
                px-4
                py-3
                backdrop-blur
                sm:px-5
                lg:px-7
            "
        >

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-3
                "
            >

                {/* ================================================= */}
                {/* LEFT */}
                {/* ================================================= */}

                <div className="min-w-0">

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                hidden
                                h-2
                                w-2
                                rounded-full
                                bg-emerald-500
                                sm:block
                            "
                        />


                        <p
                            className="
                                hidden
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.16em]
                                text-blue-600
                                sm:block
                            "
                        >
                            Administration Workspace
                        </p>
                    </div>


                    <h1
                        className="
                            truncate
                            text-base
                            font-bold
                            text-[#172033]
                            sm:mt-1
                            sm:text-lg
                            lg:text-xl
                        "
                    >
                        Admin Dashboard
                    </h1>


                    <p
                        className="
                            mt-0.5
                            hidden
                            truncate
                            text-[10px]
                            text-slate-500
                            sm:block
                        "
                    >
                        Welcome back,{" "}
                        <span
                            className="
                                font-semibold
                                text-blue-600
                            "
                        >
                            {fullName}
                        </span>
                    </p>

                </div>


                {/* ================================================= */}
                {/* RIGHT */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-2
                        sm:gap-3
                    "
                >

                    {/* ============================================= */}
                    {/* SECURITY LABEL */}
                    {/* ============================================= */}

                    <div
                        className="
                            hidden
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-emerald-100
                            bg-emerald-50
                            px-3
                            py-2
                            lg:flex
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="
                                h-4
                                w-4
                                text-emerald-600
                            "
                        >
                            <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />

                            <path d="m9 12 2 2 4-4" />
                        </svg>


                        <div>
                            <p
                                className="
                                    text-[8px]
                                    font-bold
                                    text-emerald-700
                                "
                            >
                                Secure Admin
                            </p>

                            <p
                                className="
                                    text-[7px]
                                    text-emerald-600
                                "
                            >
                                Authorized access
                            </p>
                        </div>
                    </div>


                    {/* ============================================= */}
                    {/* NOTIFICATION */}
                    {/* ============================================= */}

                    <div
                        ref={notificationRef}
                        className="relative"
                    >

                        <button
                            type="button"
                            onClick={
                                handleNotificationClick
                            }
                            aria-label="Password reset notifications"
                            className={`
                                relative
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-xl
                                border
                                transition

                                ${showNotifications
                                    ? "border-blue-300 bg-blue-50 text-blue-600"
                                    : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-600"
                                }
                            `}
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


                            {resetRequests.length >
                                0 && (
                                    <span
                                        className="
                                        absolute
                                        -right-1
                                        -top-1
                                        flex
                                        min-h-[18px]
                                        min-w-[18px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-500
                                        px-1
                                        text-[8px]
                                        font-bold
                                        leading-none
                                        text-white
                                        ring-2
                                        ring-white
                                    "
                                    >
                                        {resetRequests.length >
                                            9
                                            ? "9+"
                                            : resetRequests.length}
                                    </span>
                                )}

                        </button>


                        {/* ========================================= */}
                        {/* NOTIFICATION PANEL */}
                        {/* ========================================= */}

                        {showNotifications && (
                            <div
                                className="
                                    fixed
                                    left-3
                                    right-3
                                    top-[72px]
                                    z-50
                                    overflow-hidden
                                    rounded-2xl
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-2xl
                                    sm:absolute
                                    sm:left-auto
                                    sm:right-0
                                    sm:top-12
                                    sm:w-[360px]
                                "
                            >

                                {/* HEADER */}

                                <div
                                    className="
                                        border-b
                                        border-slate-100
                                        bg-gradient-to-r
                                        from-white
                                        to-blue-50
                                        p-4
                                    "
                                >
                                    <div
                                        className="
                                            flex
                                            items-start
                                            justify-between
                                            gap-3
                                        "
                                    >

                                        <div>
                                            <p
                                                className="
                                                    text-[8px]
                                                    font-bold
                                                    uppercase
                                                    tracking-[0.14em]
                                                    text-blue-600
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
                                                "
                                            >
                                                Password Reset Requests
                                            </h2>


                                            <p
                                                className="
                                                    mt-1
                                                    text-[9px]
                                                    text-slate-500
                                                "
                                            >
                                                {resetRequests.length} pending request
                                                {resetRequests.length ===
                                                    1
                                                    ? ""
                                                    : "s"}
                                            </p>
                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                setShowNotifications(
                                                    false
                                                )
                                            }
                                            className="
                                                flex
                                                h-8
                                                w-8
                                                items-center
                                                justify-center
                                                rounded-lg
                                                text-lg
                                                text-slate-400
                                                transition
                                                hover:bg-white
                                                hover:text-slate-700
                                            "
                                        >
                                            ×
                                        </button>

                                    </div>
                                </div>


                                {/* ================================= */}
                                {/* BODY */}
                                {/* ================================= */}

                                <div
                                    className="
                                        max-h-[360px]
                                        overflow-y-auto
                                    "
                                >

                                    {loadingNotifications && (
                                        <div
                                            className="
                                                flex
                                                items-center
                                                justify-center
                                                gap-2
                                                px-4
                                                py-8
                                            "
                                        >
                                            <span
                                                className="
                                                    h-4
                                                    w-4
                                                    animate-spin
                                                    rounded-full
                                                    border-2
                                                    border-blue-200
                                                    border-t-blue-600
                                                "
                                            />

                                            <p
                                                className="
                                                    text-[10px]
                                                    text-slate-500
                                                "
                                            >
                                                Loading notifications...
                                            </p>
                                        </div>
                                    )}


                                    {!loadingNotifications &&
                                        notificationError && (
                                            <div
                                                className="
                                                p-4
                                            "
                                            >
                                                <div
                                                    className="
                                                    rounded-xl
                                                    border
                                                    border-red-100
                                                    bg-red-50
                                                    p-3
                                                "
                                                >
                                                    <p
                                                        className="
                                                        text-[10px]
                                                        font-semibold
                                                        text-red-700
                                                    "
                                                    >
                                                        {notificationError}
                                                    </p>


                                                    <button
                                                        type="button"
                                                        onClick={
                                                            loadResetNotifications
                                                        }
                                                        className="
                                                        mt-2
                                                        text-[9px]
                                                        font-bold
                                                        text-red-700
                                                        underline
                                                    "
                                                    >
                                                        Try again
                                                    </button>
                                                </div>
                                            </div>
                                        )}


                                    {!loadingNotifications &&
                                        !notificationError &&
                                        resetRequests.length ===
                                        0 && (
                                            <div
                                                className="
                                                px-5
                                                py-8
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
                                                    bg-emerald-50
                                                    text-emerald-600
                                                "
                                                >
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="1.8"
                                                        className="h-5 w-5"
                                                    >
                                                        <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />

                                                        <path d="m9 12 2 2 4-4" />
                                                    </svg>
                                                </div>


                                                <p
                                                    className="
                                                    mt-3
                                                    text-[10px]
                                                    font-bold
                                                    text-slate-700
                                                "
                                                >
                                                    No pending requests
                                                </p>


                                                <p
                                                    className="
                                                    mt-1
                                                    text-[9px]
                                                    text-slate-500
                                                "
                                                >
                                                    Trainer and Trainee reset
                                                    requests will appear here.
                                                </p>
                                            </div>
                                        )}


                                    {!loadingNotifications &&
                                        !notificationError &&
                                        resetRequests.map(
                                            (
                                                request
                                            ) => {
                                                const userName =
                                                    getUserName(
                                                        request
                                                    );


                                                const requestRole =
                                                    request.role ||
                                                    request.user
                                                        ?.role;


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
                                                        className="
                                                            flex
                                                            w-full
                                                            items-start
                                                            gap-3
                                                            border-b
                                                            border-slate-100
                                                            px-4
                                                            py-4
                                                            text-left
                                                            transition
                                                            last:border-b-0
                                                            hover:bg-blue-50/50
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
                                                                bg-blue-100
                                                                text-xs
                                                                font-bold
                                                                uppercase
                                                                text-blue-700
                                                            "
                                                        >
                                                            {firstLetter ||
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
                                                                    items-start
                                                                    justify-between
                                                                    gap-2
                                                                "
                                                            >
                                                                <p
                                                                    className="
                                                                        truncate
                                                                        text-[10px]
                                                                        font-bold
                                                                        text-slate-800
                                                                    "
                                                                >
                                                                    {userName}
                                                                </p>


                                                                <span
                                                                    className="
                                                                        mt-1
                                                                        h-2
                                                                        w-2
                                                                        shrink-0
                                                                        rounded-full
                                                                        bg-red-500
                                                                    "
                                                                />
                                                            </div>


                                                            <p
                                                                className="
                                                                    mt-1
                                                                    text-[9px]
                                                                    leading-4
                                                                    text-slate-500
                                                                "
                                                            >
                                                                Requested a password reset.
                                                            </p>


                                                            <div
                                                                className="
                                                                    mt-2
                                                                    flex
                                                                    flex-wrap
                                                                    items-center
                                                                    gap-2
                                                                "
                                                            >
                                                                <span
                                                                    className="
                                                                        rounded-full
                                                                        bg-blue-50
                                                                        px-2
                                                                        py-1
                                                                        text-[8px]
                                                                        font-semibold
                                                                        text-blue-700
                                                                    "
                                                                >
                                                                    {formatRole(
                                                                        requestRole
                                                                    )}
                                                                </span>


                                                                <span
                                                                    className="
                                                                        text-[8px]
                                                                        text-slate-400
                                                                    "
                                                                >
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


                                {/* ================================= */}
                                {/* FOOTER */}
                                {/* ================================= */}

                                {resetRequests.length >
                                    0 &&
                                    !notificationError && (
                                        <div
                                            className="
                                            border-t
                                            border-slate-100
                                            bg-slate-50
                                            px-4
                                            py-3
                                        "
                                        >
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowNotifications(
                                                        false
                                                    );

                                                    navigate(
                                                        "/admin/users"
                                                    );
                                                }}
                                                className="
                                                w-full
                                                rounded-lg
                                                py-1
                                                text-center
                                                text-[9px]
                                                font-semibold
                                                text-blue-600
                                                transition
                                                hover:text-blue-700
                                            "
                                            >
                                                Open User Management
                                            </button>
                                        </div>
                                    )}

                            </div>
                        )}

                    </div>


                    {/* ============================================= */}
                    {/* DIVIDER */}
                    {/* ============================================= */}

                    <div
                        className="
                            hidden
                            h-8
                            w-px
                            bg-slate-200
                            sm:block
                        "
                    />


                    {/* ============================================= */}
                    {/* ADMIN PROFILE */}
                    {/* ============================================= */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            sm:gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                items-center
                                justify-center
                                rounded-full
                                bg-[#073763]
                                text-sm
                                font-bold
                                text-white
                                ring-2
                                ring-blue-100
                            "
                        >
                            {initial}
                        </div>


                        <div
                            className="
                                hidden
                                max-w-[130px]
                                sm:block
                            "
                        >
                            <p
                                className="
                                    truncate
                                    text-[10px]
                                    font-bold
                                    text-slate-800
                                "
                            >
                                {fullName}
                            </p>


                            <p
                                className="
                                    mt-[2px]
                                    text-[8px]
                                    font-medium
                                    text-slate-500
                                "
                            >
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