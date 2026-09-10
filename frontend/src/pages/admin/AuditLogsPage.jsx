import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


// ======================================================
// FORMAT DATE
// ======================================================

const formatDateTime = (
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


    return date.toLocaleString();
};


// ======================================================
// FORMAT ACTION
// ======================================================

const formatAction = (
    value
) => {
    if (!value) {
        return "Unknown Action";
    }


    return String(
        value
    )
        .replace(
            /_/g,
            " "
        )
        .toLowerCase()
        .replace(
            /\b\w/g,
            (
                character
            ) =>
                character.toUpperCase()
        );
};


// ======================================================
// GET TARGET USER
// ======================================================

const getTargetUser = (
    log
) => {
    const target =
        log?.details
            ?.targetUser;


    if (!target) {
        return "—";
    }


    if (
        target.fullName
    ) {
        return target.fullName;
    }


    const fullName =
        [
            target.firstName,
            target.lastName,
        ]
            .filter(
                Boolean
            )
            .join(
                " "
            )
            .trim();


    if (
        fullName
    ) {
        return fullName;
    }


    return (
        target.username ||
        target.email ||
        "—"
    );
};


// ======================================================
// GET DETAILS MESSAGE
// ======================================================

const getDetailsMessage = (
    log
) => {
    const message =
        log?.details
            ?.message;


    if (
        message
    ) {
        return message;
    }


    const target =
        log?.details
            ?.targetUser;


    if (
        target?.fullName
    ) {
        return `Affected user: ${target.fullName}`;
    }


    return "—";
};


// ======================================================
// STATUS BADGE
// ======================================================

function AuditStatusBadge({
    status,
}) {
    const normalizedStatus =
        String(
            status ||
            ""
        ).toLowerCase();


    const success =
        normalizedStatus ===
        "success";


    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                capitalize
                ring-1
                ring-inset

                ${success
                    ? "bg-emerald-50 text-emerald-700 ring-emerald-200"
                    : "bg-red-50 text-red-700 ring-red-200"
                }
            `}
        >

            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full

                    ${success
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }
                `}
            />


            {status ||
                "unknown"}

        </span>
    );
}


// ======================================================
// ROLE BADGE
// ======================================================

function AuditRoleBadge({
    role,
}) {
    const normalizedRole =
        String(
            role ||
            "unknown"
        ).toLowerCase();


    let style =
        "bg-slate-100 text-slate-600 ring-slate-200";


    if (
        normalizedRole ===
        "admin" ||
        normalizedRole ===
        "administrator"
    ) {
        style =
            "bg-violet-50 text-violet-700 ring-violet-200";
    }


    if (
        normalizedRole ===
        "trainer"
    ) {
        style =
            "bg-indigo-50 text-indigo-700 ring-indigo-200";
    }


    if (
        normalizedRole ===
        "trainee"
    ) {
        style =
            "bg-blue-50 text-blue-700 ring-blue-200";
    }


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-semibold
                capitalize
                ring-1
                ring-inset

                ${style}
            `}
        >
            {role ||
                "unknown"}
        </span>
    );
}


// ======================================================
// AUDIT LOG PAGE
// ======================================================

function AuditLogsPage() {

    // ======================================================
    // DATA
    // ======================================================

    const [
        logs,
        setLogs,
    ] = useState([]);


    const [
        pagination,
        setPagination,
    ] = useState({
        page:
            1,

        limit:
            50,

        total:
            0,

        totalPages:
            1,
    });


    // ======================================================
    // FILTERS
    // ======================================================

    const [
        roleFilter,
        setRoleFilter,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("");


    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");


    // ======================================================
    // PAGE STATE
    // ======================================================

    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ======================================================
    // LOAD AUDIT LOGS
    // ======================================================

    const loadAuditLogs =
        useCallback(
            async (
                page =
                    1
            ) => {
                try {
                    setLoading(
                        true
                    );


                    setError(
                        ""
                    );


                    const params = {
                        page,

                        limit:
                            50,
                    };


                    if (
                        roleFilter
                    ) {
                        params.role =
                            roleFilter;
                    }


                    if (
                        statusFilter
                    ) {
                        params.status =
                            statusFilter;
                    }


                    const response =
                        await api.get(
                            "/admin/audit-logs",
                            {
                                params,
                            }
                        );


                    const responseLogs =
                        Array.isArray(
                            response.data
                                ?.logs
                        )
                            ? response.data
                                .logs
                            : [];


                    setLogs(
                        responseLogs
                    );


                    setPagination(
                        response.data
                            ?.pagination ||
                        {
                            page,

                            limit:
                                50,

                            total:
                                responseLogs.length,

                            totalPages:
                                1,
                        }
                    );

                } catch (error) {
                    console.error(
                        "Load audit logs error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load audit logs."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            [
                roleFilter,
                statusFilter,
            ]
        );


    // ======================================================
    // INITIAL LOAD / FILTER CHANGE
    // ======================================================

    useEffect(() => {
        loadAuditLogs(
            1
        );
    }, [
        loadAuditLogs,
    ]);


    // ======================================================
    // FRONTEND SEARCH
    // ======================================================

    const visibleLogs =
        useMemo(() => {
            const query =
                searchTerm
                    .trim()
                    .toLowerCase();


            if (
                !query
            ) {
                return logs;
            }


            return logs.filter(
                (
                    log
                ) => {
                    const searchableText =
                        [
                            log.username,
                            log.role,
                            log.action,
                            log.status,
                            log.ipAddress,
                            getTargetUser(
                                log
                            ),
                            getDetailsMessage(
                                log
                            ),
                        ]
                            .filter(
                                Boolean
                            )
                            .join(
                                " "
                            )
                            .toLowerCase();


                    return searchableText.includes(
                        query
                    );
                }
            );

        }, [
            logs,
            searchTerm,
        ]);


    // ======================================================
    // SUCCESS COUNT
    // ======================================================

    const successCount =
        logs.filter(
            (
                log
            ) =>
                String(
                    log.status ||
                    ""
                ).toLowerCase() ===
                "success"
        ).length;


    // ======================================================
    // FAILURE COUNT
    // ======================================================

    const failureCount =
        logs.filter(
            (
                log
            ) =>
                String(
                    log.status ||
                    ""
                ).toLowerCase() ===
                "failure"
        ).length;


    // ======================================================
    // PREVIOUS PAGE
    // ======================================================

    const handlePreviousPage =
        () => {
            if (
                pagination.page <=
                1
            ) {
                return;
            }


            loadAuditLogs(
                pagination.page -
                1
            );
        };


    // ======================================================
    // NEXT PAGE
    // ======================================================

    const handleNextPage =
        () => {
            if (
                pagination.page >=
                pagination.totalPages
            ) {
                return;
            }


            loadAuditLogs(
                pagination.page +
                1
            );
        };


    // ======================================================
    // REFRESH
    // ======================================================

    const handleRefresh =
        () => {
            loadAuditLogs(
                pagination.page
            );
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={
                false
            }
        >

            <div className="space-y-5">

                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-48
                            w-48
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            pointer-events-none
                            absolute
                            right-24
                            top-4
                            hidden
                            h-24
                            w-24
                            rotate-12
                            rounded-xl
                            border
                            border-white/10
                            lg:block
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/15
                                    bg-white/10
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >
                                    <path d="M7 3h10v4H7z" />

                                    <path d="M5 5h14v16H5z" />

                                    <path d="M8 11h8" />

                                    <path d="M8 15h8" />

                                    <path d="M8 19h5" />
                                </svg>
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-blue-100
                                    "
                                >
                                    Security Monitoring
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    Audit Logs
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                    "
                                >
                                    Review important login, account,
                                    password and administrative
                                    activities recorded by the system.
                                </p>

                            </div>

                        </div>


                        {/* REFRESH */}

                        <button
                            type="button"
                            onClick={
                                handleRefresh
                            }
                            disabled={
                                loading
                            }
                            className="
                                inline-flex
                                min-h-[40px]
                                w-full
                                items-center
                                justify-center
                                gap-2
                                rounded-xl
                                border
                                border-white/20
                                bg-white
                                px-4
                                py-2.5
                                text-[10px]
                                font-semibold
                                text-blue-700
                                shadow-sm
                                transition
                                hover:bg-blue-50
                                disabled:cursor-not-allowed
                                disabled:opacity-60
                                md:w-auto
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className={`
                                    h-4
                                    w-4

                                    ${loading
                                        ? "animate-spin"
                                        : ""
                                    }
                                `}
                            >
                                <path d="M20 12a8 8 0 1 1-2.3-5.7" />

                                <path d="M20 4v6h-6" />
                            </svg>

                            Refresh Logs
                        </button>

                    </div>

                </section>


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    <AuditStatCard
                        title="Total Records"
                        value={
                            pagination.total
                        }
                        description="Recorded audit activities"
                        type="total"
                    />


                    <AuditStatCard
                        title="Current Page"
                        value={
                            logs.length
                        }
                        description="Records loaded on this page"
                        type="page"
                    />


                    <AuditStatCard
                        title="Successful"
                        value={
                            successCount
                        }
                        description="Successful activities"
                        type="success"
                    />


                    <AuditStatCard
                        title="Failed"
                        value={
                            failureCount
                        }
                        description="Failed activities"
                        type="failure"
                    />

                </section>


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (
                    <div
                        className="
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-xs
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}


                {/* ================================================= */}
                {/* MAIN LOG CARD */}
                {/* ================================================= */}

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
                    {/* FILTER HEADER */}
                    {/* ================================================= */}

                    <div
                        className="
                            border-b
                            border-slate-200
                            bg-gradient-to-r
                            from-white
                            to-blue-50/40
                            p-4
                            sm:p-5
                        "
                    >

                        <div
                            className="
                                flex
                                flex-col
                                gap-4
                                lg:flex-row
                                lg:items-end
                                lg:justify-between
                            "
                        >

                            <div>

                                <h2
                                    className="
                                        text-sm
                                        font-bold
                                        text-slate-900
                                    "
                                >
                                    System Activity
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    Search and filter security and
                                    administrative activity.
                                </p>

                            </div>


                            <span
                                className="
                                    w-fit
                                    rounded-full
                                    bg-blue-50
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                    text-blue-700
                                "
                            >
                                {visibleLogs.length} Visible
                            </span>

                        </div>


                        {/* ================================================= */}
                        {/* FILTERS */}
                        {/* ================================================= */}

                        <div
                            className="
                                mt-4
                                grid
                                gap-3
                                md:grid-cols-2
                                xl:grid-cols-[2fr_1fr_1fr]
                            "
                        >

                            {/* SEARCH */}

                            <div
                                className="
                                    relative
                                    md:col-span-2
                                    xl:col-span-1
                                "
                            >

                                <div
                                    className="
                                        pointer-events-none
                                        absolute
                                        inset-y-0
                                        left-0
                                        flex
                                        items-center
                                        pl-3.5
                                        text-slate-400
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-4 w-4"
                                    >
                                        <circle
                                            cx="11"
                                            cy="11"
                                            r="7"
                                        />

                                        <path d="m20 20-3.5-3.5" />
                                    </svg>
                                </div>


                                <input
                                    type="search"
                                    value={
                                        searchTerm
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setSearchTerm(
                                            event.target.value
                                        )
                                    }
                                    placeholder="Search username, action, target, IP or details..."
                                    className="
                                        h-11
                                        w-full
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        pl-10
                                        pr-4
                                        text-xs
                                        text-slate-700
                                        outline-none
                                        transition
                                        placeholder:text-slate-400
                                        focus:border-blue-500
                                        focus:ring-2
                                        focus:ring-blue-100
                                    "
                                />

                            </div>


                            {/* ROLE FILTER */}

                            <div className="relative">

                                <select
                                    value={
                                        roleFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setRoleFilter(
                                            event.target.value
                                        )
                                    }
                                    className={
                                        selectClass
                                    }
                                >
                                    <option value="">
                                        All Roles
                                    </option>

                                    <option value="admin">
                                        Administrator
                                    </option>

                                    <option value="trainer">
                                        Trainer
                                    </option>

                                    <option value="trainee">
                                        Trainee
                                    </option>

                                    <option value="unknown">
                                        Unknown
                                    </option>
                                </select>


                                <SelectArrow />

                            </div>


                            {/* STATUS FILTER */}

                            <div className="relative">

                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setStatusFilter(
                                            event.target.value
                                        )
                                    }
                                    className={
                                        selectClass
                                    }
                                >
                                    <option value="">
                                        All Statuses
                                    </option>

                                    <option value="success">
                                        Success
                                    </option>

                                    <option value="failure">
                                        Failure
                                    </option>
                                </select>


                                <SelectArrow />

                            </div>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

                    {loading && (
                        <div
                            className="
                                flex
                                items-center
                                justify-center
                                gap-3
                                px-5
                                py-16
                            "
                        >

                            <div
                                className="
                                    h-5
                                    w-5
                                    animate-spin
                                    rounded-full
                                    border-2
                                    border-slate-200
                                    border-t-blue-600
                                "
                            />


                            <p
                                className="
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Loading audit logs...
                            </p>

                        </div>
                    )}


                    {/* ================================================= */}
                    {/* EMPTY */}
                    {/* ================================================= */}

                    {!loading &&
                        visibleLogs.length ===
                        0 && (
                            <div
                                className="
                                    flex
                                    flex-col
                                    items-center
                                    justify-center
                                    px-5
                                    py-16
                                    text-center
                                "
                            >

                                <div
                                    className="
                                        flex
                                        h-12
                                        w-12
                                        items-center
                                        justify-center
                                        rounded-full
                                        bg-slate-100
                                        text-slate-400
                                    "
                                >
                                    <svg
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="1.8"
                                        className="h-6 w-6"
                                    >
                                        <path d="M7 3h10v4H7z" />

                                        <path d="M5 5h14v16H5z" />

                                        <path d="M8 12h8" />

                                        <path d="M8 16h5" />
                                    </svg>
                                </div>


                                <p
                                    className="
                                        mt-4
                                        text-sm
                                        font-bold
                                        text-slate-700
                                    "
                                >
                                    No audit logs found
                                </p>


                                <p
                                    className="
                                        mt-1
                                        max-w-md
                                        text-[10px]
                                        leading-5
                                        text-slate-500
                                    "
                                >
                                    No system activities match the
                                    selected filters or search.
                                </p>

                            </div>
                        )}


                    {/* ================================================= */}
                    {/* MOBILE CARDS */}
                    {/* ================================================= */}

                    {!loading &&
                        visibleLogs.length >
                        0 && (
                            <div
                                className="
                                    space-y-3
                                    p-4
                                    lg:hidden
                                "
                            >

                                {visibleLogs.map(
                                    (
                                        log,
                                        index
                                    ) => (
                                        <AuditMobileCard
                                            key={
                                                log._id ||
                                                `${log.createdAt}-${index}`
                                            }
                                            log={
                                                log
                                            }
                                        />
                                    )
                                )}

                            </div>
                        )}


                    {/* ================================================= */}
                    {/* DESKTOP TABLE */}
                    {/* ================================================= */}

                    {!loading &&
                        visibleLogs.length >
                        0 && (
                            <div
                                className="
                                    hidden
                                    overflow-x-auto
                                    lg:block
                                "
                            >

                                <table
                                    className="
                                        min-w-[1150px]
                                        w-full
                                    "
                                >

                                    <thead
                                        className="
                                            bg-slate-50
                                        "
                                    >

                                        <tr
                                            className="
                                                text-left
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-500
                                            "
                                        >

                                            <th className="px-5 py-3.5">
                                                Date & Time
                                            </th>


                                            <th className="px-5 py-3.5">
                                                User
                                            </th>


                                            <th className="px-5 py-3.5">
                                                Role
                                            </th>


                                            <th className="px-5 py-3.5">
                                                Action
                                            </th>


                                            <th className="px-5 py-3.5">
                                                Target
                                            </th>


                                            <th className="px-5 py-3.5">
                                                Status
                                            </th>


                                            <th className="px-5 py-3.5">
                                                Details
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody
                                        className="
                                            divide-y
                                            divide-slate-100
                                            bg-white
                                        "
                                    >

                                        {visibleLogs.map(
                                            (
                                                log,
                                                index
                                            ) => (
                                                <tr
                                                    key={
                                                        log._id ||
                                                        `${log.createdAt}-${index}`
                                                    }
                                                    className="
                                                        text-xs
                                                        text-slate-700
                                                        transition
                                                        hover:bg-slate-50/70
                                                    "
                                                >

                                                    {/* DATE */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                text-[10px]
                                                                font-medium
                                                                text-slate-700
                                                            "
                                                        >
                                                            {formatDateTime(
                                                                log.createdAt
                                                            )}
                                                        </p>
                                                    </td>


                                                    {/* USER */}

                                                    <td className="px-5 py-4">

                                                        <p
                                                            className="
                                                                max-w-[180px]
                                                                truncate
                                                                font-semibold
                                                                text-slate-900
                                                            "
                                                        >
                                                            {log.username ||
                                                                "System"}
                                                        </p>


                                                        {log.ipAddress && (
                                                            <p
                                                                className="
                                                                    mt-1
                                                                    max-w-[180px]
                                                                    truncate
                                                                    text-[9px]
                                                                    text-slate-400
                                                                "
                                                            >
                                                                IP:{" "}
                                                                {log.ipAddress}
                                                            </p>
                                                        )}

                                                    </td>


                                                    {/* ROLE */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >
                                                        <AuditRoleBadge
                                                            role={
                                                                log.role
                                                            }
                                                        />
                                                    </td>


                                                    {/* ACTION */}

                                                    <td className="px-5 py-4">

                                                        <span
                                                            className="
                                                                inline-flex
                                                                max-w-[230px]
                                                                rounded-lg
                                                                bg-slate-100
                                                                px-2.5
                                                                py-1.5
                                                                text-[9px]
                                                                font-semibold
                                                                text-slate-700
                                                            "
                                                        >
                                                            {formatAction(
                                                                log.action
                                                            )}
                                                        </span>

                                                    </td>


                                                    {/* TARGET */}

                                                    <td
                                                        className="
                                                            max-w-[180px]
                                                            px-5
                                                            py-4
                                                            text-[10px]
                                                            text-slate-600
                                                        "
                                                    >
                                                        {getTargetUser(
                                                            log
                                                        )}
                                                    </td>


                                                    {/* STATUS */}

                                                    <td
                                                        className="
                                                            whitespace-nowrap
                                                            px-5
                                                            py-4
                                                        "
                                                    >
                                                        <AuditStatusBadge
                                                            status={
                                                                log.status
                                                            }
                                                        />
                                                    </td>


                                                    {/* DETAILS */}

                                                    <td
                                                        className="
                                                            max-w-[320px]
                                                            px-5
                                                            py-4
                                                            text-[10px]
                                                            leading-5
                                                            text-slate-500
                                                        "
                                                    >
                                                        {getDetailsMessage(
                                                            log
                                                        )}
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        )}


                    {/* ================================================= */}
                    {/* PAGINATION */}
                    {/* ================================================= */}

                    {!loading &&
                        pagination.totalPages >
                        1 && (
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-3
                                    border-t
                                    border-slate-200
                                    bg-slate-50/60
                                    px-4
                                    py-4
                                    sm:flex-row
                                    sm:items-center
                                    sm:justify-between
                                    sm:px-5
                                "
                            >

                                <button
                                    type="button"
                                    onClick={
                                        handlePreviousPage
                                    }
                                    disabled={
                                        pagination.page <=
                                        1
                                    }
                                    className="
                                        order-2
                                        inline-flex
                                        min-h-[38px]
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-[10px]
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                        sm:order-1
                                    "
                                >
                                    ← Previous
                                </button>


                                <div
                                    className="
                                        order-1
                                        text-center
                                        sm:order-2
                                    "
                                >

                                    <p
                                        className="
                                            text-[10px]
                                            font-semibold
                                            text-slate-600
                                        "
                                    >
                                        Page{" "}
                                        {pagination.page}{" "}
                                        of{" "}
                                        {pagination.totalPages}
                                    </p>


                                    <p
                                        className="
                                            mt-1
                                            text-[9px]
                                            text-slate-400
                                        "
                                    >
                                        {pagination.total} total records
                                    </p>

                                </div>


                                <button
                                    type="button"
                                    onClick={
                                        handleNextPage
                                    }
                                    disabled={
                                        pagination.page >=
                                        pagination.totalPages
                                    }
                                    className="
                                        order-3
                                        inline-flex
                                        min-h-[38px]
                                        items-center
                                        justify-center
                                        rounded-xl
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-[10px]
                                        font-semibold
                                        text-slate-700
                                        transition
                                        hover:bg-slate-50
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Next →
                                </button>

                            </div>
                        )}

                </section>


                {/* ================================================= */}
                {/* SECURITY NOTE */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        to-white
                        p-5
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
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Administrative Audit Trail
                            </p>


                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Important authentication and
                                Administrator operations are displayed
                                here from the existing audit-log
                                records stored by your backend.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// MOBILE AUDIT CARD
// ======================================================

function AuditMobileCard({
    log,
}) {
    return (
        <article
            className="
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                shadow-sm
            "
        >

            {/* TOP */}

            <div
                className="
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-slate-50
                    to-blue-50/40
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

                    <div className="min-w-0">

                        <p
                            className="
                                truncate
                                text-xs
                                font-bold
                                text-slate-900
                            "
                        >
                            {formatAction(
                                log.action
                            )}
                        </p>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-slate-400
                            "
                        >
                            {formatDateTime(
                                log.createdAt
                            )}
                        </p>

                    </div>


                    <AuditStatusBadge
                        status={
                            log.status
                        }
                    />

                </div>

            </div>


            {/* BODY */}

            <div className="p-4">

                <div
                    className="
                        grid
                        grid-cols-2
                        gap-4
                    "
                >

                    <AuditDetail
                        label="Performed By"
                        value={
                            log.username ||
                            "System"
                        }
                    />


                    <div>

                        <p
                            className="
                                text-[8px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-slate-400
                            "
                        >
                            Role
                        </p>


                        <div className="mt-2">
                            <AuditRoleBadge
                                role={
                                    log.role
                                }
                            />
                        </div>

                    </div>


                    <AuditDetail
                        label="Target"
                        value={
                            getTargetUser(
                                log
                            )
                        }
                    />


                    <AuditDetail
                        label="IP Address"
                        value={
                            log.ipAddress ||
                            "—"
                        }
                    />

                </div>


                <div
                    className="
                        mt-4
                        border-t
                        border-slate-100
                        pt-4
                    "
                >

                    <p
                        className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-400
                        "
                    >
                        Details
                    </p>


                    <p
                        className="
                            mt-2
                            break-words
                            text-[10px]
                            leading-5
                            text-slate-600
                        "
                    >
                        {getDetailsMessage(
                            log
                        )}
                    </p>

                </div>

            </div>

        </article>
    );
}


// ======================================================
// MOBILE DETAIL
// ======================================================

function AuditDetail({
    label,
    value,
}) {
    return (
        <div className="min-w-0">

            <p
                className="
                    text-[8px]
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
                    mt-2
                    truncate
                    text-[10px]
                    font-medium
                    text-slate-700
                "
            >
                {value ||
                    "—"}
            </p>

        </div>
    );
}


// ======================================================
// STAT CARD
// ======================================================

function AuditStatCard({
    title,
    value,
    description,
    type,
}) {
    const styleMap = {
        total: {
            icon:
                "bg-blue-100 text-blue-700",

            value:
                "text-blue-700",
        },

        page: {
            icon:
                "bg-indigo-100 text-indigo-700",

            value:
                "text-indigo-700",
        },

        success: {
            icon:
                "bg-emerald-100 text-emerald-700",

            value:
                "text-emerald-700",
        },

        failure: {
            icon:
                "bg-red-100 text-red-700",

            value:
                "text-red-700",
        },
    };


    const style =
        styleMap[
        type
        ] ||
        styleMap.total;


    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
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
                    className={`
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl

                        ${style.icon}
                    `}
                >
                    <AuditStatIcon
                        type={
                            type
                        }
                    />
                </div>


                <div className="min-w-0">

                    <p
                        className={`
                            text-xl
                            font-bold

                            ${style.value}
                        `}
                    >
                        {value}
                    </p>


                    <p
                        className="
                            mt-0.5
                            text-[9px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        {title}
                    </p>

                </div>

            </div>


            <p
                className="
                    mt-3
                    text-[9px]
                    leading-4
                    text-slate-500
                "
            >
                {description}
            </p>

        </div>
    );
}


// ======================================================
// AUDIT STAT ICON
// ======================================================

function AuditStatIcon({
    type,
}) {
    if (
        type ===
        "success"
    ) {
        return (
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

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    if (
        type ===
        "failure"
    ) {
        return (
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

                <path d="m9 9 6 6" />

                <path d="m15 9-6 6" />
            </svg>
        );
    }


    if (
        type ===
        "page"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
            >
                <path d="M6 3h9l4 4v14H6z" />

                <path d="M14 3v5h5" />

                <path d="M9 13h6" />

                <path d="M9 17h6" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <path d="M7 3h10v4H7z" />

            <path d="M5 5h14v16H5z" />

            <path d="M8 11h8" />

            <path d="M8 15h8" />
        </svg>
    );
}


// ======================================================
// SELECT ARROW
// ======================================================

function SelectArrow() {
    return (
        <div
            className="
                pointer-events-none
                absolute
                inset-y-0
                right-0
                flex
                items-center
                pr-3
                text-slate-400
            "
        >
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-4 w-4"
            >
                <path d="m7 10 5 5 5-5" />
            </svg>
        </div>
    );
}


// ======================================================
// SELECT STYLE
// ======================================================

const selectClass = `
    h-11
    w-full
    appearance-none
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    pr-10
    text-xs
    font-medium
    text-slate-700
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default AuditLogsPage;