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
                character
                    .toUpperCase()
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
            .join(" ")
            .trim();


    if (fullName) {
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


    if (message) {
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
                rounded-full
                px-2.5
                py-1
                text-[10px]
                font-semibold
                capitalize

                ${success
                    ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200"
                    : "bg-red-50 text-red-700 ring-1 ring-red-200"
                }
            `}
        >
            {status ||
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

                    setError("");


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
                            ?.pagination || {
                            page,
                            limit:
                                50,
                            total:
                                responseLogs
                                    .length,
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

    useEffect(
        () => {
            loadAuditLogs(
                1
            );
        },
        [
            loadAuditLogs,
        ]
    );


    // ======================================================
    // FRONTEND SEARCH
    // ======================================================

    const visibleLogs =
        useMemo(
            () => {
                const query =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (!query) {
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
                                .join(" ")
                                .toLowerCase();


                        return searchableText
                            .includes(
                                query
                            );
                    }
                );
            },
            [
                logs,
                searchTerm,
            ]
        );


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
    // UI
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            title="Audit Logs"
            subtitle="Review important account and system activities."
        >

            <div className="space-y-6 p-5 lg:p-7">

                {/* ================================================= */}
                {/* HEADER CARD */}
                {/* ================================================= */}

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

                    <div
                        className="
                            flex
                            flex-col
                            gap-4
                            border-b
                            border-slate-200
                            p-5
                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        <div>

                            <h2
                                className="
                                    text-base
                                    font-bold
                                    text-slate-900
                                "
                            >
                                System Activity
                            </h2>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Audit records created by the approved Sprint 1 backend.
                            </p>

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
                                    bg-blue-50
                                    px-3
                                    py-1.5
                                    text-xs
                                    font-semibold
                                    text-blue-700
                                "
                            >
                                {pagination.total}{" "}
                                Record
                                {pagination.total ===
                                    1
                                    ? ""
                                    : "s"}
                            </span>


                            <button
                                type="button"
                                onClick={() =>
                                    loadAuditLogs(
                                        pagination.page
                                    )
                                }
                                disabled={
                                    loading
                                }
                                className="
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-4
                                    py-2
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                    transition
                                    hover:bg-slate-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                Refresh
                            </button>

                        </div>

                    </div>


                    {/* ================================================= */}
                    {/* FILTERS */}
                    {/* ================================================= */}

                    <div
                        className="
                            grid
                            gap-4
                            p-5
                            md:grid-cols-3
                        "
                    >

                        {/* SEARCH */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Search
                            </label>


                            <input
                                type="text"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                placeholder="Search user, action or details..."
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    px-3
                                    py-2.5
                                    text-xs
                                    outline-none
                                    transition
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />

                        </div>


                        {/* ROLE */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Role
                            </label>


                            <select
                                value={
                                    roleFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setRoleFilter(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-xs
                                    outline-none
                                    focus:border-blue-500
                                "
                            >
                                <option value="">
                                    All Roles
                                </option>

                                <option value="admin">
                                    Admin
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

                        </div>


                        {/* STATUS */}

                        <div>

                            <label
                                className="
                                    mb-2
                                    block
                                    text-xs
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                Status
                            </label>


                            <select
                                value={
                                    statusFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setStatusFilter(
                                        event
                                            .target
                                            .value
                                    )
                                }
                                className="
                                    w-full
                                    rounded-lg
                                    border
                                    border-slate-300
                                    bg-white
                                    px-3
                                    py-2.5
                                    text-xs
                                    outline-none
                                    focus:border-blue-500
                                "
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

                        </div>

                    </div>

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
                            text-sm
                            text-red-700
                        "
                    >
                        {error}
                    </div>
                )}


                {/* ================================================= */}
                {/* AUDIT TABLE */}
                {/* ================================================= */}

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

                    {loading ? (
                        <div
                            className="
                                p-8
                                text-center
                                text-sm
                                text-slate-500
                            "
                        >
                            Loading audit logs...
                        </div>
                    ) : visibleLogs.length ===
                        0 ? (
                        <div
                            className="
                                p-8
                                text-center
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-semibold
                                    text-slate-700
                                "
                            >
                                No audit logs found.
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-xs
                                    text-slate-500
                                "
                            >
                                Perform an account action and refresh this page.
                            </p>

                        </div>
                    ) : (
                        <div className="overflow-x-auto">

                            <table
                                className="
                                    min-w-[1150px]
                                    w-full
                                    divide-y
                                    divide-slate-200
                                "
                            >

                                <thead className="bg-slate-50">

                                    <tr
                                        className="
                                            text-left
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        "
                                    >

                                        <th className="px-5 py-3">
                                            Date / Time
                                        </th>

                                        <th className="px-5 py-3">
                                            Performed By
                                        </th>

                                        <th className="px-5 py-3">
                                            Role
                                        </th>

                                        <th className="px-5 py-3">
                                            Action
                                        </th>

                                        <th className="px-5 py-3">
                                            Target User
                                        </th>

                                        <th className="px-5 py-3">
                                            Status
                                        </th>

                                        <th className="px-5 py-3">
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
                                            log
                                        ) => (
                                            <tr
                                                key={
                                                    log._id
                                                }
                                                className="
                                                    text-xs
                                                    text-slate-700
                                                    transition
                                                    hover:bg-slate-50
                                                "
                                            >

                                                <td
                                                    className="
                                                        whitespace-nowrap
                                                        px-5
                                                        py-4
                                                    "
                                                >
                                                    {formatDateTime(
                                                        log.createdAt
                                                    )}
                                                </td>


                                                <td className="px-5 py-4">

                                                    <p
                                                        className="
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
                                                                text-[10px]
                                                                text-slate-400
                                                            "
                                                        >
                                                            IP:{" "}
                                                            {log.ipAddress}
                                                        </p>
                                                    )}

                                                </td>


                                                <td
                                                    className="
                                                        whitespace-nowrap
                                                        px-5
                                                        py-4
                                                        capitalize
                                                    "
                                                >
                                                    {log.role ||
                                                        "unknown"}
                                                </td>


                                                <td className="px-5 py-4">

                                                    <span
                                                        className="
                                                            font-semibold
                                                            text-slate-800
                                                        "
                                                    >
                                                        {formatAction(
                                                            log.action
                                                        )}
                                                    </span>

                                                </td>


                                                <td className="px-5 py-4">
                                                    {getTargetUser(
                                                        log
                                                    )}
                                                </td>


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


                                                <td
                                                    className="
                                                        max-w-[300px]
                                                        px-5
                                                        py-4
                                                        text-[11px]
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
                                    items-center
                                    justify-between
                                    gap-4
                                    border-t
                                    border-slate-200
                                    px-5
                                    py-4
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
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Previous
                                </button>


                                <p
                                    className="
                                        text-xs
                                        text-slate-500
                                    "
                                >
                                    Page{" "}
                                    {pagination.page}{" "}
                                    of{" "}
                                    {pagination.totalPages}
                                </p>


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
                                        rounded-lg
                                        border
                                        border-slate-300
                                        bg-white
                                        px-4
                                        py-2
                                        text-xs
                                        font-semibold
                                        text-slate-700
                                        disabled:cursor-not-allowed
                                        disabled:opacity-40
                                    "
                                >
                                    Next
                                </button>

                            </div>
                        )}

                </section>

            </div>

        </DashboardLayout>
    );
}


export default AuditLogsPage;