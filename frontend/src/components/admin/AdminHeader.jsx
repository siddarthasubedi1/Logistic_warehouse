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


    const firstName =
        user?.firstName ||
        "System";


    const lastName =
        user?.lastName ||
        "Administrator";


    const fullName =
        `${firstName} ${lastName}`
            .trim();


    const initial =
        firstName
            .charAt(0)
            .toUpperCase();


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
        const requestUser =
            request?.user;


        const fullUserName =
            [
                requestUser?.firstName,
                requestUser?.lastName,
            ]
                .filter(Boolean)
                .join(" ")
                .trim();


        return (
            fullUserName ||
            request?.username ||
            requestUser?.username ||
            "Unknown User"
        );
    };


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


    const formatRequestTime = (
        date
    ) => {
        if (!date) {
            return "";
        }


        const parsed =
            new Date(date);


        if (
            Number.isNaN(
                parsed.getTime()
            )
        ) {
            return "";
        }


        return parsed.toLocaleString(
            [],
            {
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    };


    const loadResetNotifications =
        useCallback(async () => {
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
        }, []);


    useEffect(() => {
        loadResetNotifications();
    }, [
        loadResetNotifications,
    ]);


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


    return (
        <header
            className="
                relative
                z-30
                min-h-[78px]
                border-b
                border-slate-200
                bg-white
            "
        >
            <div
                className="
                    flex
                    min-h-[78px]
                    items-center
                    justify-between
                    gap-4
                    px-5
                    sm:px-6
                    lg:px-7
                "
            >

                {/* LEFT */}

                <div
                    className="
                        min-w-0
                    "
                >
                    <h1
                        className="
                            truncate
                            text-[20px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        Admin Dashboard
                    </h1>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            text-slate-500
                        "
                    >
                        Welcome back,{" "}

                        <span
                            className="
                                font-medium
                                text-blue-600
                            "
                        >
                            {fullName}
                        </span>
                    </p>
                </div>


                {/* RIGHT */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        gap-3
                    "
                >

                    {/* NOTIFICATIONS */}

                    <div
                        ref={
                            notificationRef
                        }
                        className="
                            relative
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                handleNotificationClick
                            }
                            aria-label="Notifications"
                            className="
                                relative
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                border
                                border-slate-200
                                bg-white
                                text-slate-500
                                transition
                                hover:bg-slate-50
                                hover:text-blue-600
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.7"
                                className="h-[17px] w-[17px]"
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
                                        h-[16px]
                                        min-w-[16px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-500
                                        px-1
                                        text-[7px]
                                        font-bold
                                        text-white
                                    "
                                    >
                                        {resetRequests.length >
                                            9
                                            ? "9+"
                                            : resetRequests.length}
                                    </span>
                                )}
                        </button>


                        {showNotifications && (
                            <div
                                className="
                                    fixed
                                    left-3
                                    right-3
                                    top-[70px]
                                    z-50
                                    overflow-hidden
                                    rounded-lg
                                    border
                                    border-slate-200
                                    bg-white
                                    shadow-xl
                                    sm:absolute
                                    sm:left-auto
                                    sm:right-0
                                    sm:top-11
                                    sm:w-[330px]
                                "
                            >
                                <div
                                    className="
                                        flex
                                        items-center
                                        justify-between
                                        border-b
                                        border-slate-100
                                        px-4
                                        py-3
                                    "
                                >
                                    <div>
                                        <p
                                            className="
                                                text-[11px]
                                                font-semibold
                                                text-slate-800
                                            "
                                        >
                                            Password Reset Requests
                                        </p>


                                        <p
                                            className="
                                                mt-0.5
                                                text-[8px]
                                                text-slate-400
                                            "
                                        >
                                            {resetRequests.length} pending
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
                                            h-7
                                            w-7
                                            items-center
                                            justify-center
                                            rounded-md
                                            text-slate-400
                                            hover:bg-slate-100
                                        "
                                    >
                                        ×
                                    </button>
                                </div>


                                <div
                                    className="
                                        max-h-[320px]
                                        overflow-y-auto
                                    "
                                >
                                    {loadingNotifications && (
                                        <div
                                            className="
                                                px-4
                                                py-7
                                                text-center
                                                text-[9px]
                                                text-slate-500
                                            "
                                        >
                                            Loading...
                                        </div>
                                    )}


                                    {!loadingNotifications &&
                                        notificationError && (
                                            <div
                                                className="
                                                p-4
                                            "
                                            >
                                                <p
                                                    className="
                                                    text-[9px]
                                                    text-red-600
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
                                                    font-medium
                                                    text-blue-600
                                                "
                                                >
                                                    Try again
                                                </button>
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
                                                <p
                                                    className="
                                                    text-[10px]
                                                    font-medium
                                                    text-slate-700
                                                "
                                                >
                                                    No pending requests
                                                </p>
                                            </div>
                                        )}


                                    {!loadingNotifications &&
                                        !notificationError &&
                                        resetRequests.map(
                                            (
                                                request
                                            ) => (
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
                                                        py-3
                                                        text-left
                                                        last:border-0
                                                        hover:bg-slate-50
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            flex
                                                            h-8
                                                            w-8
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            bg-blue-50
                                                            text-[9px]
                                                            font-bold
                                                            text-blue-600
                                                        "
                                                    >
                                                        {getUserName(
                                                            request
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>


                                                    <div
                                                        className="
                                                            min-w-0
                                                            flex-1
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                truncate
                                                                text-[9px]
                                                                font-semibold
                                                                text-slate-700
                                                            "
                                                        >
                                                            {getUserName(
                                                                request
                                                            )}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[8px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            {formatRole(
                                                                request.role ||
                                                                request.user
                                                                    ?.role
                                                            )}
                                                            {" · "}
                                                            {formatRequestTime(
                                                                request.requestedAt
                                                            )}
                                                        </p>
                                                    </div>
                                                </button>
                                            )
                                        )}
                                </div>


                                {resetRequests.length >
                                    0 && (
                                        <div
                                            className="
                                            border-t
                                            border-slate-100
                                            p-3
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
                                                rounded-md
                                                py-2
                                                text-[9px]
                                                font-medium
                                                text-blue-600
                                                hover:bg-blue-50
                                            "
                                            >
                                                View User Management
                                            </button>
                                        </div>
                                    )}
                            </div>
                        )}
                    </div>


                    {/* DIVIDER */}

                    <div
                        className="
                            hidden
                            h-8
                            w-px
                            bg-slate-200
                            sm:block
                        "
                    />


                    {/* USER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-9
                                w-9
                                items-center
                                justify-center
                                rounded-full
                                bg-blue-50
                                text-[10px]
                                font-semibold
                                text-blue-600
                            "
                        >
                            {initial}
                        </div>


                        <div
                            className="
                                hidden
                                sm:block
                            "
                        >
                            <p
                                className="
                                    max-w-[160px]
                                    truncate
                                    text-[9px]
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                {fullName}
                            </p>


                            <p
                                className="
                                    mt-0.5
                                    text-[8px]
                                    text-slate-400
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