import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";

import api from "../../services/api";


// ======================================================
// HELPERS
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

    return String(value)
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
        typeof target ===
        "string"
    ) {
        return target;
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

    if (
        target !==
        "—"
    ) {
        return `Affected user: ${target}`;
    }

    return "—";
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
    // LOAD
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
                            response.data?.logs
                        )
                            ? response.data.logs
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
        loadAuditLogs(
            1
        );
    }, [
        loadAuditLogs,
    ]);


    // ======================================================
    // SEARCH
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
                        const searchable =
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

                        return searchable.includes(
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


    const failedCount =
        logs.filter(
            (
                log
            ) =>
                String(
                    log.status ||
                    ""
                ).toLowerCase() !==
                "success"
        ).length;


    return (
        <DashboardLayout
            role="admin"
            title="Audit Logs"
            subtitle="Review account activity and important system actions."
        >
            <div
                className="
                    space-y-4
                "
            >
                <FeedbackAlert
                    type="error"
                    message={
                        error
                    }
                    onClose={() =>
                        setError("")
                    }
                />


                {/* STATS */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >
                    <AuditStat
                        label="Total Records"
                        value={
                            pagination.total ||
                            logs.length
                        }
                    />

                    <AuditStat
                        label="Current Page"
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
                        label="Other / Failed"
                        value={
                            failedCount
                        }
                    />
                </section>


                {/* LOGS */}

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
                            px-4
                            py-4
                            sm:px-5
                        "
                    >
                        <h2
                            className="
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            System Activity
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Search and filter recorded system activity.
                        </p>
                    </div>


                    {/* FILTERS */}

                    <div
                        className="
                            grid
                            gap-3
                            border-b
                            border-slate-100
                            bg-slate-50/60
                            p-4
                            md:grid-cols-2
                            xl:grid-cols-[2fr_1fr_1fr_auto]
                            sm:p-5
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
                                    event.target.value
                                )
                            }
                            placeholder="Search action, username, IP or target..."
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
                                    event.target.value
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
                                Admin
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
                                    event.target.value
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

                            <option value="failed">
                                Failed
                            </option>
                        </select>


                        <button
                            type="button"
                            onClick={() => {
                                setSearchTerm("");
                                setRoleFilter("");
                                setStatusFilter("");
                            }}
                            className="
                                min-h-[40px]
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-4
                                text-[8px]
                                font-semibold
                                text-slate-700
                                hover:bg-slate-100
                            "
                        >
                            Clear
                        </button>
                    </div>


                    {/* LOADING */}

                    {loading && (
                        <div
                            className="
                                py-12
                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-500
                                "
                            >
                                Loading audit logs...
                            </p>
                        </div>
                    )}


                    {/* MOBILE */}

                    {!loading &&
                        visibleLogs.length >
                        0 && (
                            <div
                                className="
                                divide-y
                                divide-slate-100
                                lg:hidden
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
                                                        font-bold
                                                        text-slate-800
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
                                                        font-medium
                                                        text-slate-500
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


                                            <div
                                                className="
                                                rounded-lg
                                                bg-slate-50
                                                p-3
                                            "
                                            >
                                                <p
                                                    className="
                                                    text-[8px]
                                                    font-medium
                                                    leading-5
                                                    text-slate-600
                                                "
                                                >
                                                    {getDetailsMessage(
                                                        log
                                                    )}
                                                </p>
                                            </div>
                                        </article>
                                    )
                                )}
                            </div>
                        )}


                    {/* DESKTOP */}

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
                                    min-w-[1000px]
                                    w-full
                                "
                                >
                                    <thead
                                        className="
                                        bg-slate-50
                                    "
                                    >
                                        <tr>
                                            <AuditHead>
                                                Date & Time
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
                                                Target
                                            </AuditHead>

                                            <AuditHead>
                                                Status
                                            </AuditHead>

                                            <AuditHead>
                                                IP Address
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
                                                    border-t
                                                    border-slate-100
                                                    hover:bg-slate-50/60
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

                                                    <AuditCell strong>
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
                                                        <AuditStatusBadge
                                                            status={
                                                                log.status
                                                            }
                                                        />
                                                    </AuditCell>

                                                    <AuditCell>
                                                        {log.ipAddress ||
                                                            "—"}
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
                        visibleLogs.length ===
                        0 && (
                            <div
                                className="
                                py-12
                                text-center
                            "
                            >
                                <p
                                    className="
                                    text-[10px]
                                    font-bold
                                    text-slate-700
                                "
                                >
                                    No audit logs found
                                </p>

                                <p
                                    className="
                                    mt-1
                                    text-[8px]
                                    text-slate-500
                                "
                                >
                                    Try changing the current filters.
                                </p>
                            </div>
                        )}


                    {/* PAGINATION */}

                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-t
                            border-slate-100
                            px-4
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-5
                        "
                    >
                        <p
                            className="
                                text-[8px]
                                font-medium
                                text-slate-500
                            "
                        >
                            Page{" "}
                            {
                                pagination.page
                            }{" "}
                            of{" "}
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
        <article
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
                    font-medium
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    text-[22px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </article>
    );
}


function AuditHead({
    children,
}) {
    return (
        <th
            className="
                whitespace-nowrap
                px-5
                py-3
                text-left
                text-[7px]
                font-bold
                uppercase
                tracking-wide
                text-slate-500
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
                px-5
                py-4
                text-[8px]

                ${strong
                    ? "font-semibold text-slate-700"
                    : "font-medium text-slate-600"
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
                font-semibold
                capitalize

                ${success
                    ? "bg-emerald-50 text-emerald-700"
                    : "bg-red-50 text-red-700"
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
                font-semibold
                capitalize
                text-blue-700
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
                    font-semibold
                    text-slate-500
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-1
                    break-words
                    text-[8px]
                    font-semibold
                    text-slate-700
                "
            >
                {value}
            </p>
        </div>
    );
}


const inputClass = `
    min-h-[40px]
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    font-medium
    text-slate-800
    outline-none
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
`;


const paginationButton = `
    min-h-[38px]
    rounded-lg
    border
    border-slate-300
    bg-white
    px-4
    text-[8px]
    font-semibold
    text-slate-700
    hover:bg-slate-50
    disabled:cursor-not-allowed
    disabled:opacity-40
`;


export default AuditLogsPage;