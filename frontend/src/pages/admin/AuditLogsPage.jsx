import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


// ======================================================
// FORMAT HELPERS
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
            .filter(Boolean)
            .join(" ")
            .trim();


    return (
        fullName ||
        target.username ||
        target.email ||
        "—"
    );
};


const getDetailsMessage = (
    log
) => {
    if (
        log?.details?.message
    ) {
        return log.details.message;
    }


    const target =
        getTargetUser(
            log
        );


    return target !==
        "—"
        ? `Affected user: ${target}`
        : "—";
};


// ======================================================
// PAGE
// ======================================================

function AuditLogsPage() {
    const [
        logs,
        setLogs,
    ] = useState([]);


    const [
        pagination,
        setPagination,
    ] = useState({
        page: 1,
        limit: 50,
        total: 0,
        totalPages: 1,
    });


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
                page = 1
            ) => {
                try {
                    setLoading(true);
                    setError("");


                    const params = {
                        page,
                        limit: 50,
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
                            limit: 50,
                            total:
                                responseLogs.length,
                            totalPages: 1,
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
                    setLoading(false);
                }
            },
            [
                roleFilter,
                statusFilter,
            ]
        );


    useEffect(() => {
        loadAuditLogs(1);
    }, [
        loadAuditLogs,
    ]);


    // ======================================================
    // SEARCH
    // ======================================================

    const visibleLogs =
        useMemo(() => {
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
                    const text =
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
                            .filter(Boolean)
                            .join(" ")
                            .toLowerCase();


                    return text.includes(
                        query
                    );
                }
            );
        }, [
            logs,
            searchTerm,
        ]);


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


    return (
        <DashboardLayout
            role="admin"
            title="Audit Logs"
            subtitle="Review account and system activity."
        >
            <div className="space-y-4">

                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                >
                    <AuditStat
                        label="Loaded Records"
                        value={
                            logs.length
                        }
                    />


                    <AuditStat
                        label="Successful"
                        value={
                            successCount
                        }
                    />


                    <AuditStat
                        label="Failed"
                        value={
                            failureCount
                        }
                    />
                </section>


                {/* ================================================= */}
                {/* MAIN CARD */}
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
                            border-b
                            border-slate-100
                            px-5
                            py-4
                        "
                    >
                        <div
                            className="
                                flex
                                flex-col
                                gap-3
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
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
                                    Activity Records
                                </h2>


                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-slate-400
                                    "
                                >
                                    {pagination.total} total records
                                </p>
                            </div>


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
                                    py-2.5
                                    text-[9px]
                                    text-slate-600
                                    hover:bg-slate-50
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
                            gap-3
                            border-b
                            border-slate-100
                            p-5
                            md:grid-cols-3
                        "
                    >
                        <input
                            type="search"
                            value={
                                searchTerm
                            }
                            onChange={(
                                event
                            ) =>
                                setSearchTerm(
                                    event.target
                                        .value
                                )
                            }
                            placeholder="Search logs..."
                            className={
                                inputClass
                            }
                        />


                        <select
                            value={
                                roleFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setRoleFilter(
                                    event.target
                                        .value
                                )
                            }
                            className={
                                inputClass
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
                        </select>


                        <select
                            value={
                                statusFilter
                            }
                            onChange={(
                                event
                            ) =>
                                setStatusFilter(
                                    event.target
                                        .value
                                )
                            }
                            className={
                                inputClass
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
                    </div>


                    {/* ================================================= */}
                    {/* ERROR */}
                    {/* ================================================= */}

                    {error && (
                        <div
                            className="
                                m-5
                                rounded-lg
                                border
                                border-red-200
                                bg-red-50
                                p-4
                                text-[9px]
                                text-red-600
                            "
                        >
                            {error}
                        </div>
                    )}


                    {/* ================================================= */}
                    {/* LOADING */}
                    {/* ================================================= */}

                    {loading && (
                        <div
                            className="
                                py-12
                                text-center
                                text-[9px]
                                text-slate-400
                            "
                        >
                            Loading audit logs...
                        </div>
                    )}


                    {/* ================================================= */}
                    {/* MOBILE CARDS */}
                    {/* ================================================= */}

                    {!loading &&
                        !error && (
                            <div
                                className="
                                divide-y
                                divide-slate-100
                                md:hidden
                            "
                            >
                                {visibleLogs.map(
                                    (
                                        log
                                    ) => (
                                        <article
                                            key={
                                                log._id
                                            }
                                            className="
                                            space-y-3
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
                                                        text-[10px]
                                                        font-semibold
                                                        text-slate-700
                                                    "
                                                    >
                                                        {formatAction(
                                                            log.action
                                                        )}
                                                    </p>


                                                    <p
                                                        className="
                                                        mt-1
                                                        text-[8px]
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


                                            <div
                                                className="
                                                grid
                                                grid-cols-2
                                                gap-2
                                            "
                                            >
                                                <MobileInfo
                                                    label="Username"
                                                    value={
                                                        log.username ||
                                                        "—"
                                                    }
                                                />


                                                <MobileInfo
                                                    label="Role"
                                                    value={
                                                        log.role ||
                                                        "—"
                                                    }
                                                />


                                                <MobileInfo
                                                    label="Target"
                                                    value={
                                                        getTargetUser(
                                                            log
                                                        )
                                                    }
                                                />


                                                <MobileInfo
                                                    label="IP Address"
                                                    value={
                                                        log.ipAddress ||
                                                        "—"
                                                    }
                                                />
                                            </div>


                                            <p
                                                className="
                                                text-[8px]
                                                leading-4
                                                text-slate-500
                                            "
                                            >
                                                {getDetailsMessage(
                                                    log
                                                )}
                                            </p>
                                        </article>
                                    )
                                )}
                            </div>
                        )}


                    {/* ================================================= */}
                    {/* DESKTOP TABLE */}
                    {/* ================================================= */}

                    {!loading &&
                        !error && (
                            <div
                                className="
                                hidden
                                overflow-x-auto
                                md:block
                            "
                            >
                                <table
                                    className="
                                    min-w-[950px]
                                    w-full
                                    border-collapse
                                "
                                >
                                    <thead>
                                        <tr
                                            className="
                                            border-b
                                            border-slate-200
                                            bg-slate-50
                                        "
                                        >
                                            <AuditHead>
                                                Date
                                            </AuditHead>

                                            <AuditHead>
                                                User
                                            </AuditHead>

                                            <AuditHead>
                                                Role
                                            </AuditHead>

                                            <AuditHead>
                                                Action
                                            </AuditHead>

                                            <AuditHead>
                                                Target User
                                            </AuditHead>

                                            <AuditHead>
                                                IP Address
                                            </AuditHead>

                                            <AuditHead>
                                                Status
                                            </AuditHead>
                                        </tr>
                                    </thead>


                                    <tbody>
                                        {visibleLogs.map(
                                            (
                                                log
                                            ) => (
                                                <tr
                                                    key={
                                                        log._id
                                                    }
                                                    className="
                                                    border-b
                                                    border-slate-100
                                                    last:border-0
                                                "
                                                >
                                                    <AuditCell>
                                                        {formatDateTime(
                                                            log.createdAt
                                                        )}
                                                    </AuditCell>


                                                    <AuditCell strong>
                                                        {log.username ||
                                                            "—"}
                                                    </AuditCell>


                                                    <AuditCell>
                                                        <AuditRoleBadge
                                                            role={
                                                                log.role
                                                            }
                                                        />
                                                    </AuditCell>


                                                    <AuditCell>
                                                        {formatAction(
                                                            log.action
                                                        )}
                                                    </AuditCell>


                                                    <AuditCell>
                                                        {getTargetUser(
                                                            log
                                                        )}
                                                    </AuditCell>


                                                    <AuditCell>
                                                        {log.ipAddress ||
                                                            "—"}
                                                    </AuditCell>


                                                    <AuditCell>
                                                        <AuditStatusBadge
                                                            status={
                                                                log.status
                                                            }
                                                        />
                                                    </AuditCell>
                                                </tr>
                                            )
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        )}


                    {/* EMPTY */}

                    {!loading &&
                        !error &&
                        visibleLogs.length ===
                        0 && (
                            <div
                                className="
                                py-12
                                text-center
                                text-[9px]
                                text-slate-400
                            "
                            >
                                No audit logs found.
                            </div>
                        )}


                    {/* ================================================= */}
                    {/* PAGINATION */}
                    {/* ================================================= */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-slate-100
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <p
                            className="
                                text-[8px]
                                text-slate-400
                            "
                        >
                            Page {pagination.page} of{" "}
                            {pagination.totalPages ||
                                1}
                        </p>


                        <div
                            className="
                                flex
                                gap-2
                            "
                        >
                            <button
                                type="button"
                                disabled={
                                    loading ||
                                    pagination.page <=
                                    1
                                }
                                onClick={() =>
                                    loadAuditLogs(
                                        pagination.page -
                                        1
                                    )
                                }
                                className={
                                    paginationButton
                                }
                            >
                                Previous
                            </button>


                            <button
                                type="button"
                                disabled={
                                    loading ||
                                    pagination.page >=
                                    pagination.totalPages
                                }
                                onClick={() =>
                                    loadAuditLogs(
                                        pagination.page +
                                        1
                                    )
                                }
                                className={
                                    paginationButton
                                }
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </section>

            </div>
        </DashboardLayout>
    );
}


function AuditStat({
    label,
    value,
}) {
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
            <p
                className="
                    text-[8px]
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    text-xl
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>
        </div>
    );
}


function AuditHead({
    children,
}) {
    return (
        <th
            className="
                whitespace-nowrap
                px-4
                py-3
                text-left
                text-[7px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-400
            "
        >
            {children}
        </th>
    );
}


function AuditCell({
    children,
    strong = false,
}) {
    return (
        <td
            className={`
                whitespace-nowrap
                px-4
                py-3
                text-[8px]

                ${strong
                    ? "font-medium text-slate-700"
                    : "text-slate-500"
                }
            `}
        >
            {children}
        </td>
    );
}


function AuditStatusBadge({
    status,
}) {
    const success =
        String(
            status ||
            ""
        ).toLowerCase() ===
        "success";


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-medium
                capitalize

                ${success
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }
            `}
        >
            {status ||
                "unknown"}
        </span>
    );
}


function AuditRoleBadge({
    role,
}) {
    return (
        <span
            className="
                inline-flex
                rounded-full
                bg-blue-50
                px-2.5
                py-1
                text-[7px]
                font-medium
                capitalize
                text-blue-600
            "
        >
            {role ||
                "unknown"}
        </span>
    );
}


function MobileInfo({
    label,
    value,
}) {
    return (
        <div
            className="
                rounded-lg
                bg-slate-50
                p-2.5
            "
        >
            <p
                className="
                    text-[7px]
                    text-slate-400
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-1
                    break-words
                    text-[8px]
                    font-medium
                    text-slate-600
                "
            >
                {value}
            </p>
        </div>
    );
}


const inputClass = `
    h-10
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    text-slate-700
    outline-none
    focus:border-blue-500
`;


const paginationButton = `
    rounded-lg
    border
    border-slate-300
    bg-white
    px-4
    py-2
    text-[8px]
    text-slate-600
    hover:bg-slate-50
    disabled:cursor-not-allowed
    disabled:opacity-40
`;


export default AuditLogsPage;