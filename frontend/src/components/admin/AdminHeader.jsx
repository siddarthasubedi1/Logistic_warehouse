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
        open,
        setOpen,
    ] = useState(false);

    const [
        requests,
        setRequests,
    ] = useState([]);

    const [
        loading,
        setLoading,
    ] = useState(false);


    const firstName =
        user?.firstName ||
        "System";

    const lastName =
        user?.lastName ||
        "Administrator";

    const name =
        `${firstName} ${lastName}`
            .trim();

    const initial =
        name
            .charAt(0)
            .toUpperCase();


    const getUserId =
        (
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
                request?.userId ||
                ""
            );
        };


    const getName =
        (
            request
        ) => {
            const requestUser =
                request?.user;

            const fullName =
                `${requestUser?.firstName || ""} ${requestUser?.lastName || ""}`
                    .trim();

            return (
                fullName ||
                requestUser?.username ||
                request?.username ||
                "User"
            );
        };


    const loadRequests =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    const response =
                        await api.get(
                            "/admin/password-reset-requests"
                        );

                    const data =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : response.data?.requests ||
                            [];

                    setRequests(
                        data.filter(
                            (
                                request
                            ) =>
                                !request.status ||
                                request.status ===
                                "pending"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Unable to load reset notifications:",
                        error
                    );

                    setRequests([]);

                } finally {
                    setLoading(false);
                }
            },
            []
        );


    useEffect(() => {
        loadRequests();

        const interval =
            window.setInterval(
                loadRequests,
                60000
            );

        return () =>
            window.clearInterval(
                interval
            );
    }, [
        loadRequests,
    ]);


    useEffect(() => {
        const closeDropdown =
            (
                event
            ) => {
                if (
                    notificationRef.current &&
                    !notificationRef.current.contains(
                        event.target
                    )
                ) {
                    setOpen(false);
                }
            };

        document.addEventListener(
            "mousedown",
            closeDropdown
        );

        return () =>
            document.removeEventListener(
                "mousedown",
                closeDropdown
            );
    }, []);


    const openUser =
        (
            request
        ) => {
            const userId =
                getUserId(
                    request
                );

            setOpen(false);

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
                admin-dashboard-header
                relative
                flex
                min-h-[80px]
                items-center
                justify-between
                gap-4
                border-b
                border-[#dbe4ef]
                bg-white
                px-5
                py-4
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
                        text-[20px]
                        font-bold
                        tracking-[-0.02em]
                        text-[#172033]
                        sm:text-[22px]
                    "
                >
                    Admin Dashboard
                </h1>

                <p
                    className="
                        mt-1
                        text-[10px]
                        text-[#64748b]
                    "
                >
                    Welcome back,{" "}
                    <span
                        className="
                            font-semibold
                            text-[#1769e8]
                        "
                    >
                        {name}
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
                {/* NOTIFICATION */}

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
                        aria-label="Password reset notifications"
                        onClick={() => {
                            setOpen(
                                (
                                    current
                                ) =>
                                    !current
                            );

                            if (!open) {
                                loadRequests();
                            }
                        }}
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            border
                            border-[#dbe4ef]
                            bg-white
                            text-[#52627a]
                            transition
                            hover:border-blue-200
                            hover:bg-blue-50
                            hover:text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="
                                h-5
                                w-5
                            "
                        >
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                            <path d="M10 21h4" />
                        </svg>


                        {requests.length >
                            0 && (
                                <span
                                    className="
                                        absolute
                                        -right-1
                                        -top-1
                                        flex
                                        h-[18px]
                                        min-w-[18px]
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-red-500
                                        px-1
                                        text-[9px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    {requests.length >
                                        9
                                        ? "9+"
                                        : requests.length}
                                </span>
                            )}
                    </button>


                    {open && (
                        <div
                            className="
                                absolute
                                right-0
                                top-[48px]
                                z-[150]
                                w-[330px]
                                max-w-[calc(100vw-30px)]
                                overflow-hidden
                                rounded-xl
                                border
                                border-[#dbe4ef]
                                bg-white
                                shadow-[0_18px_45px_rgba(15,23,42,0.16)]
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    justify-between
                                    border-b
                                    border-[#e8eef5]
                                    px-4
                                    py-3
                                "
                            >
                                <div>
                                    <p
                                        className="
                                            text-[12px]
                                            font-bold
                                            text-[#172033]
                                        "
                                    >
                                        Notifications
                                    </p>

                                    <p
                                        className="
                                            mt-0.5
                                            text-[9px]
                                            text-[#64748b]
                                        "
                                    >
                                        Password reset requests
                                    </p>
                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        loadRequests
                                    }
                                    disabled={
                                        loading
                                    }
                                    className="
                                        text-[9px]
                                        font-semibold
                                        text-blue-600
                                        disabled:opacity-50
                                    "
                                >
                                    Refresh
                                </button>
                            </div>


                            <div
                                className="
                                    max-h-[320px]
                                    overflow-y-auto
                                "
                            >
                                {loading ? (
                                    <div
                                        className="
                                            px-4
                                            py-10
                                            text-center
                                            text-[10px]
                                            text-[#64748b]
                                        "
                                    >
                                        Loading notifications...
                                    </div>
                                ) : requests.length ===
                                    0 ? (
                                    <div
                                        className="
                                            px-4
                                            py-9
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
                                            ✓
                                        </div>

                                        <p
                                            className="
                                                mt-3
                                                text-[11px]
                                                font-semibold
                                                text-[#172033]
                                            "
                                        >
                                            No pending requests
                                        </p>

                                        <p
                                            className="
                                                mt-1
                                                text-[9px]
                                                text-[#64748b]
                                            "
                                        >
                                            You are all caught up.
                                        </p>
                                    </div>
                                ) : (
                                    requests.map(
                                        (
                                            request,
                                            index
                                        ) => {
                                            const requestName =
                                                getName(
                                                    request
                                                );

                                            const requestUser =
                                                request?.user ||
                                                {};

                                            return (
                                                <button
                                                    type="button"
                                                    key={
                                                        request._id ||
                                                        `${getUserId(
                                                            request
                                                        )}-${index}`
                                                    }
                                                    onClick={() =>
                                                        openUser(
                                                            request
                                                        )
                                                    }
                                                    className="
                                                        flex
                                                        w-full
                                                        items-start
                                                        gap-3
                                                        border-b
                                                        border-[#edf1f6]
                                                        px-4
                                                        py-3
                                                        text-left
                                                        transition
                                                        last:border-0
                                                        hover:bg-[#f8fafc]
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
                                                            bg-[#eef6ff]
                                                            text-[10px]
                                                            font-bold
                                                            text-blue-600
                                                        "
                                                    >
                                                        {requestName
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
                                                        <div
                                                            className="
                                                                flex
                                                                items-center
                                                                justify-between
                                                                gap-2
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    truncate
                                                                    text-[10px]
                                                                    font-semibold
                                                                    text-[#172033]
                                                                "
                                                            >
                                                                {requestName}
                                                            </p>

                                                            <span
                                                                className="
                                                                    shrink-0
                                                                    rounded-full
                                                                    bg-amber-50
                                                                    px-2
                                                                    py-1
                                                                    text-[7px]
                                                                    font-semibold
                                                                    text-amber-600
                                                                "
                                                            >
                                                                PENDING
                                                            </span>
                                                        </div>


                                                        <p
                                                            className="
                                                                mt-1
                                                                truncate
                                                                text-[8px]
                                                                text-[#64748b]
                                                            "
                                                        >
                                                            {requestUser.username ||
                                                                request.username ||
                                                                "No username"}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[8px]
                                                                text-[#94a3b8]
                                                            "
                                                        >
                                                            Requested a password reset
                                                        </p>
                                                    </div>
                                                </button>
                                            );
                                        }
                                    )
                                )}
                            </div>


                            {requests.length >
                                0 && (
                                    <div
                                        className="
                                        border-t
                                        border-[#e8eef5]
                                        bg-[#f8fafc]
                                        p-3
                                    "
                                    >
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setOpen(false);

                                                navigate(
                                                    "/admin/users"
                                                );
                                            }}
                                            className="
                                            w-full
                                            rounded-lg
                                            bg-[#1769e8]
                                            px-3
                                            py-2
                                            text-[10px]
                                            font-semibold
                                            text-white
                                            transition
                                            hover:bg-[#0b5ed7]
                                        "
                                        >
                                            Manage Users
                                        </button>
                                    </div>
                                )}
                        </div>
                    )}
                </div>


                {/* ADMIN PROFILE */}

                <div
                    className="
                        hidden
                        items-center
                        gap-3
                        sm:flex
                    "
                >
                    <div
                        className="
                            min-w-0
                            text-right
                        "
                    >
                        <p
                            className="
                                max-w-[180px]
                                truncate
                                text-[10px]
                                font-semibold
                                text-[#172033]
                            "
                        >
                            {name}
                        </p>

                        <p
                            className="
                                mt-0.5
                                text-[8px]
                                text-[#64748b]
                            "
                        >
                            Administrator
                        </p>
                    </div>


                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#1769e8]
                            text-[12px]
                            font-bold
                            text-white
                            shadow-sm
                        "
                    >
                        {initial}
                    </div>
                </div>
            </div>
        </header>
    );
}


export default AdminHeader;