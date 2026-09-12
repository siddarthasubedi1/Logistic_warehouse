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
                    setLoading(
                        true
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


                    setRequests(
                        []
                    );

                } finally {
                    setLoading(
                        false
                    );
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
                    setOpen(
                        false
                    );
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


            setOpen(
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
                flex
                min-h-[78px]
                items-center
                justify-between
                gap-4
                rounded-none
                border
                border-[#e2e8f0]
                bg-white
                px-4
                py-4
                sm:px-5
                lg:px-7
            "
        >
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
                        text-[#111827]
                        sm:text-[22px]
                    "
                >
                    Admin Dashboard
                </h1>


                <p
                    className="
                        mt-1
                        text-[11px]
                        text-[#64748b]
                    "
                >
                    Welcome back,{" "}
                    <span
                        className="
                            font-medium
                            text-[#1769e8]
                        "
                    >
                        {name}!
                    </span>
                </p>
            </div>


            <div
                className="
                    flex
                    shrink-0
                    items-center
                    gap-3
                    sm:gap-4
                "
            >
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


                            if (
                                !open
                            ) {
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
                            hover:bg-slate-50
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
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
                                z-[90]
                                w-[310px]
                                max-w-[calc(100vw-30px)]
                                overflow-hidden
                                rounded-xl
                                border
                                border-[#dbe4ef]
                                bg-white
                                shadow-xl
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
                                            text-slate-500
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
                                    className="
                                        text-[10px]
                                        font-medium
                                        text-blue-600
                                    "
                                >
                                    Refresh
                                </button>
                            </div>


                            <div
                                className="
                                    max-h-[300px]
                                    overflow-y-auto
                                "
                            >
                                {loading ? (
                                    <div
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        Loading...
                                    </div>
                                ) : requests.length ===
                                    0 ? (
                                    <div
                                        className="
                                            px-4
                                            py-8
                                            text-center
                                        "
                                    >
                                        <div
                                            className="
                                                mx-auto
                                                flex
                                                h-9
                                                w-9
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
                                    </div>
                                ) : (
                                    requests.map(
                                        (
                                            request
                                        ) => (
                                            <button
                                                key={
                                                    request._id ||
                                                    getUserId(
                                                        request
                                                    )
                                                }
                                                type="button"
                                                onClick={() =>
                                                    openUser(
                                                        request
                                                    )
                                                }
                                                className="
                                                    flex
                                                    w-full
                                                    items-center
                                                    gap-3
                                                    border-b
                                                    border-[#edf1f6]
                                                    px-4
                                                    py-3
                                                    text-left
                                                    transition
                                                    last:border-0
                                                    hover:bg-blue-50/50
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
                                                        bg-[#073763]
                                                        text-[11px]
                                                        font-bold
                                                        text-white
                                                    "
                                                >
                                                    {getName(
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
                                                            text-[11px]
                                                            font-semibold
                                                            text-[#172033]
                                                        "
                                                    >
                                                        {getName(
                                                            request
                                                        )}
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-0.5
                                                            text-[9px]
                                                            capitalize
                                                            text-slate-500
                                                        "
                                                    >
                                                        {request
                                                            ?.user
                                                            ?.role ||
                                                            "User"}{" "}
                                                        requested password reset
                                                    </p>
                                                </div>


                                                <span
                                                    className="
                                                        text-blue-600
                                                    "
                                                >
                                                    ›
                                                </span>
                                            </button>
                                        )
                                    )
                                )}
                            </div>
                        </div>
                    )}
                </div>


                <div
                    className="
                        hidden
                        h-8
                        w-px
                        bg-slate-200
                        sm:block
                    "
                />


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
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-full
                            bg-[#eaf3ff]
                            text-[12px]
                            font-bold
                            text-[#1769e8]
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
                                text-[11px]
                                font-semibold
                                text-[#172033]
                            "
                        >
                            {name}
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-[9px]
                                text-slate-500
                            "
                        >
                            Administrator
                        </p>
                    </div>
                </div>
            </div>
        </header>
    );
}


export default AdminHeader;