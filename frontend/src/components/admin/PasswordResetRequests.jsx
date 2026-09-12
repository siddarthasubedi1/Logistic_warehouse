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
        error,
        setError,
    ] = useState("");


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


    const getUserName =
        (
            request
        ) => {
            const user =
                request?.user;


            const name =
                `${user?.firstName || ""} ${user?.lastName || ""}`
                    .trim();


            return (
                name ||
                user?.username ||
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
                        "Password reset requests error:",
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load password reset requests."
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
    }, [
        loadRequests,
    ]);


    const formatDate =
        (
            value
        ) => {
            if (!value) {
                return "—";
            }


            const date =
                new Date(
                    value
                );


            if (
                Number.isNaN(
                    date.getTime()
                )
            ) {
                return "—";
            }


            return date.toLocaleString(
                [],
                {
                    month:
                        "numeric",

                    day:
                        "numeric",

                    year:
                        "numeric",

                    hour:
                        "numeric",

                    minute:
                        "2-digit",
                }
            );
        };


    return (
        <section
            className="
                overflow-hidden
                rounded-xl
                border
                border-[#dbe4ef]
                bg-white
                shadow-[0_1px_3px_rgba(15,23,42,0.08)]
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3
                    border-b
                    border-[#e8eef5]
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
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
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-50
                            text-blue-600
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
                            <circle
                                cx="9"
                                cy="8"
                                r="3"
                            />

                            <path d="M3 20c.6-4 2.6-6 6-6" />

                            <path d="M18 13v8" />

                            <path d="M14 17h8" />
                        </svg>
                    </div>


                    <div>
                        <h2
                            className="
                                text-[14px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Password Reset Requests
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#7c8da6]
                            "
                        >
                            Pending requests from Trainers and Trainees
                        </p>
                    </div>
                </div>


                <div
                    className="
                        flex
                        items-center
                        gap-3
                    "
                >
                    <span
                        className="
                            rounded-full
                            bg-amber-50
                            px-3
                            py-1.5
                            text-[9px]
                            font-medium
                            text-amber-600
                        "
                    >
                        {requests.length} Pending
                    </span>


                    <button
                        type="button"
                        onClick={
                            loadRequests
                        }
                        disabled={
                            loading
                        }
                        className="
                            inline-flex
                            min-h-[38px]
                            items-center
                            gap-2
                            rounded-lg
                            border
                            border-[#dbe4ef]
                            bg-white
                            px-4
                            text-[11px]
                            font-medium
                            text-[#52627a]
                            transition
                            hover:bg-slate-50
                            disabled:opacity-50
                        "
                    >
                        ↻ Refresh
                    </button>
                </div>
            </div>


            {error && (
                <div
                    className="
                        border-b
                        border-red-100
                        bg-red-50
                        px-5
                        py-3
                        text-[11px]
                        text-red-700
                    "
                >
                    {error}
                </div>
            )}


            <div
                className="
                    min-h-[150px]
                "
            >
                {loading ? (
                    <div
                        className="
                            flex
                            min-h-[180px]
                            items-center
                            justify-center
                            text-[11px]
                            text-slate-500
                        "
                    >
                        Loading password reset requests...
                    </div>
                ) : requests.length ===
                    0 ? (
                    <div
                        className="
                            flex
                            min-h-[180px]
                            flex-col
                            items-center
                            justify-center
                            px-5
                            text-center
                        "
                    >
                        <div
                            className="
                                flex
                                h-11
                                w-11
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
                                mt-4
                                text-[12px]
                                font-semibold
                                text-[#172033]
                            "
                        >
                            No pending password reset requests
                        </p>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#94a3b8]
                            "
                        >
                            New requests will appear here.
                        </p>
                    </div>
                ) : (
                    <div>
                        {requests.map(
                            (
                                request
                            ) => {
                                const user =
                                    request.user ||
                                    {};


                                const name =
                                    getUserName(
                                        request
                                    );


                                return (
                                    <div
                                        key={
                                            request._id ||
                                            getUserId(
                                                request
                                            )
                                        }
                                        className="
                                            flex
                                            flex-col
                                            gap-4
                                            border-b
                                            border-[#edf1f6]
                                            px-5
                                            py-4
                                            last:border-0
                                            md:flex-row
                                            md:items-center
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                min-w-0
                                                flex-1
                                                items-center
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
                                                    text-[11px]
                                                    font-bold
                                                    text-white
                                                "
                                            >
                                                {name
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
                                                        text-[11px]
                                                        font-semibold
                                                        text-[#172033]
                                                    "
                                                >
                                                    {name}
                                                </p>


                                                <div
                                                    className="
                                                        mt-1
                                                        flex
                                                        flex-wrap
                                                        gap-x-3
                                                        gap-y-1
                                                        text-[9px]
                                                        text-[#64748b]
                                                    "
                                                >
                                                    <span>
                                                        Username:{" "}
                                                        {user.username ||
                                                            "—"}
                                                    </span>


                                                    <span
                                                        className="
                                                            capitalize
                                                        "
                                                    >
                                                        Role:{" "}
                                                        {user.role ||
                                                            "—"}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>


                                        <div
                                            className="
                                                flex
                                                flex-wrap
                                                items-center
                                                gap-3
                                                md:justify-end
                                            "
                                        >
                                            <div>
                                                <p
                                                    className="
                                                        text-[7px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-wide
                                                        text-[#94a3b8]
                                                    "
                                                >
                                                    Requested
                                                </p>


                                                <p
                                                    className="
                                                        mt-1
                                                        text-[9px]
                                                        text-[#52627a]
                                                    "
                                                >
                                                    {formatDate(
                                                        request.requestedAt ||
                                                        request.createdAt
                                                    )}
                                                </p>
                                            </div>


                                            <span
                                                className="
                                                    rounded-full
                                                    border
                                                    border-amber-200
                                                    bg-amber-50
                                                    px-3
                                                    py-1.5
                                                    text-[8px]
                                                    font-semibold
                                                    text-amber-600
                                                "
                                            >
                                                PENDING
                                            </span>


                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onManageUser?.(
                                                        getUserId(
                                                            request
                                                        ),
                                                        request
                                                    )
                                                }
                                                className="
                                                    min-h-[38px]
                                                    rounded-lg
                                                    bg-[#1769e8]
                                                    px-4
                                                    text-[11px]
                                                    font-semibold
                                                    text-white
                                                    transition
                                                    hover:bg-[#0b5ed7]
                                                "
                                            >
                                                Manage User
                                            </button>
                                        </div>
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