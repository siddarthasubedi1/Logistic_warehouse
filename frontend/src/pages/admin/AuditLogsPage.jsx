import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";

import api from "../../services/api";

import {
    getApiErrorMessage,
    parseArrayResponse,
} from "../../utils/training";


function AuditLogsPage() {
    const [
        logs,
        setLogs,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        actionFilter,
        setActionFilter,
    ] = useState("all");


    const loadLogs =
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
                            "/admin/audit-logs"
                        );


                    setLogs(
                        parseArrayResponse(
                            response.data,
                            "logs"
                        )
                    );

                } catch (
                error
                ) {
                    console.error(
                        "Audit logs error:",
                        error
                    );


                    setError(
                        getApiErrorMessage(
                            error,
                            "Unable to load audit logs."
                        )
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
        loadLogs();
    }, [
        loadLogs,
    ]);


    const actions =
        useMemo(
            () => {
                const values =
                    logs
                        .map(
                            (
                                log
                            ) =>
                                log.action
                        )
                        .filter(
                            Boolean
                        );


                return [
                    ...new Set(
                        values
                    ),
                ];
            },
            [
                logs,
            ]
        );


    const filteredLogs =
        useMemo(
            () => {
                const query =
                    search
                        .trim()
                        .toLowerCase();


                return logs.filter(
                    (
                        log
                    ) => {
                        const matchesAction =
                            actionFilter ===
                            "all" ||
                            String(
                                log.action ||
                                ""
                            ) ===
                            actionFilter;


                        if (
                            !matchesAction
                        ) {
                            return false;
                        }


                        if (
                            !query
                        ) {
                            return true;
                        }


                        const searchable =
                            [
                                log.action,
                                log.description,
                                log.details,
                                log.targetUsername,
                                log.targetUser,
                                log.performedBy?.username,
                                log.performedBy?.firstName,
                                log.performedBy?.lastName,
                                log.admin?.username,
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(
                                    " "
                                )
                                .toLowerCase();


                        return searchable.includes(
                            query
                        );
                    }
                );
            },
            [
                logs,
                search,
                actionFilter,
            ]
        );


    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="admin"
                title="Audit Logs"
                subtitle="Review administrative activity recorded by the system."
            >
                <div
                    className="
                        admin-page
                    "
                >
                    <LoadingCard
                        message="Loading audit logs..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="admin"
            title="Audit Logs"
            subtitle="Review administrative activity recorded by the system."
        >
            <div
                className="
                    admin-page
                    space-y-5
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


                {/* ============================================
                    SUMMARY
                ============================================= */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-3
                    "
                >
                    <StatCard
                        label="Total Records"
                        value={
                            logs.length
                        }
                    />

                    <StatCard
                        label="Action Types"
                        value={
                            actions.length
                        }
                    />

                    <StatCard
                        label="Displayed"
                        value={
                            filteredLogs.length
                        }
                    />
                </section>


                {/* ============================================
                    FILTERS
                ============================================= */}

                <section
                    className="
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        p-4
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >
                        <div
                            className="
                                relative
                                w-full
                                md:max-w-[340px]
                            "
                        >
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-3
                                    text-[#94a3b8]
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
                                    "
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />

                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </span>


                            <input
                                type="search"
                                value={
                                    search
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearch(
                                        event.target.value
                                    )
                                }
                                placeholder="Search audit activity..."
                                className="
                                    min-h-[40px]
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    pl-9
                                    pr-3
                                    text-[9px]
                                    text-[#172033]
                                    outline-none
                                    placeholder:text-[#94a3b8]
                                    focus:border-[#3b82f6]
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>


                        <div
                            className="
                                flex
                                flex-col
                                gap-2
                                sm:flex-row
                            "
                        >
                            <select
                                value={
                                    actionFilter
                                }
                                onChange={(
                                    event
                                ) =>
                                    setActionFilter(
                                        event.target.value
                                    )
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-3
                                    text-[9px]
                                    font-medium
                                    text-[#52627a]
                                    outline-none
                                    focus:border-[#3b82f6]
                                "
                            >
                                <option
                                    value="all"
                                >
                                    All Actions
                                </option>


                                {actions.map(
                                    (
                                        action
                                    ) => (
                                        <option
                                            key={
                                                action
                                            }
                                            value={
                                                action
                                            }
                                        >
                                            {formatAction(
                                                action
                                            )}
                                        </option>
                                    )
                                )}
                            </select>


                            <button
                                type="button"
                                onClick={
                                    loadLogs
                                }
                                className="
                                    min-h-[40px]
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    px-4
                                    text-[9px]
                                    font-semibold
                                    text-[#52627a]
                                    transition
                                    hover:bg-[#f8fafc]
                                "
                            >
                                Refresh
                            </button>
                        </div>
                    </div>
                </section>


                {/* ============================================
                    TABLE
                ============================================= */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <h2
                            className="
                                text-[13px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            System Activity
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#64748b]
                            "
                        >
                            Administrative create, edit, delete and
                            other recorded operations.
                        </p>
                    </div>


                    {filteredLogs.length ===
                        0 ? (
                        <div
                            className="
                                px-5
                                py-14
                                text-center
                            "
                        >
                            <div
                                className="
                                    mx-auto
                                    flex
                                    h-11
                                    w-11
                                    items-center
                                    justify-center
                                    rounded-full
                                    bg-[#f1f5f9]
                                    text-[#64748b]
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
                                    <path d="M5 4h14v16H5z" />

                                    <path d="M8 8h8" />

                                    <path d="M8 12h8" />

                                    <path d="M8 16h5" />
                                </svg>
                            </div>


                            <p
                                className="
                                    mt-3
                                    text-[10px]
                                    font-semibold
                                    text-[#52627a]
                                "
                            >
                                No audit records found.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                overflow-x-auto
                            "
                        >
                            <table
                                className="
                                    min-w-[850px]
                                    w-full
                                "
                            >
                                <thead
                                    className="
                                        bg-[#f8fafc]
                                    "
                                >
                                    <tr>
                                        <TableHead>
                                            Date & Time
                                        </TableHead>

                                        <TableHead>
                                            Administrator
                                        </TableHead>

                                        <TableHead>
                                            Action
                                        </TableHead>

                                        <TableHead>
                                            Target
                                        </TableHead>

                                        <TableHead>
                                            Details
                                        </TableHead>
                                    </tr>
                                </thead>


                                <tbody>
                                    {filteredLogs.map(
                                        (
                                            log,
                                            index
                                        ) => (
                                            <AuditRow
                                                key={
                                                    log._id ||
                                                    `${log.action}-${index}`
                                                }
                                                log={
                                                    log
                                                }
                                            />
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}


function AuditRow({
    log,
}) {
    const admin =
        log.performedBy ||
        log.admin ||
        {};


    const adminName =
        `${admin.firstName || ""} ${admin.lastName || ""}`
            .trim() ||
        admin.username ||
        log.performedByUsername ||
        "Administrator";


    const target =
        log.targetUsername ||
        log.targetUser?.username ||
        log.targetUser ||
        log.entityName ||
        "—";


    const details =
        typeof log.details ===
            "object"
            ? JSON.stringify(
                log.details
            )
            : log.details ||
            log.description ||
            "—";


    return (
        <tr
            className="
                border-t
                border-[#edf1f6]
                transition
                hover:bg-[#fbfdff]
            "
        >
            <TableCell>
                <p
                    className="
                        whitespace-nowrap
                        text-[9px]
                        font-medium
                        text-[#334155]
                    "
                >
                    {formatDate(
                        log.createdAt ||
                        log.timestamp
                    )}
                </p>
            </TableCell>


            <TableCell>
                <div
                    className="
                        flex
                        items-center
                        gap-2
                    "
                >
                    <div
                        className="
                            flex
                            h-7
                            w-7
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-blue-50
                            text-[8px]
                            font-bold
                            text-blue-600
                        "
                    >
                        {adminName
                            .charAt(
                                0
                            )
                            .toUpperCase()}
                    </div>


                    <span
                        className="
                            text-[9px]
                            font-semibold
                            text-[#334155]
                        "
                    >
                        {adminName}
                    </span>
                </div>
            </TableCell>


            <TableCell>
                <ActionBadge
                    action={
                        log.action
                    }
                />
            </TableCell>


            <TableCell>
                <span
                    className="
                        text-[9px]
                        font-medium
                        text-[#52627a]
                    "
                >
                    {target}
                </span>
            </TableCell>


            <TableCell>
                <p
                    className="
                        max-w-[320px]
                        text-[8px]
                        leading-4
                        text-[#64748b]
                    "
                >
                    {details}
                </p>
            </TableCell>
        </tr>
    );
}


function ActionBadge({
    action,
}) {
    const value =
        String(
            action ||
            "activity"
        ).toLowerCase();


    let classes =
        "bg-blue-50 text-blue-600";


    if (
        value.includes(
            "delete"
        ) ||
        value.includes(
            "deactivate"
        )
    ) {
        classes =
            "bg-red-50 text-red-600";
    } else if (
        value.includes(
            "create"
        ) ||
        value.includes(
            "reactivate"
        )
    ) {
        classes =
            "bg-emerald-50 text-emerald-600";
    } else if (
        value.includes(
            "edit"
        ) ||
        value.includes(
            "update"
        )
    ) {
        classes =
            "bg-amber-50 text-amber-600";
    }


    return (
        <span
            className={`
                inline-flex
                rounded-full
                px-2.5
                py-1.5
                text-[7px]
                font-semibold
                ${classes}
            `}
        >
            {formatAction(
                action
            )}
        </span>
    );
}


function TableHead({
    children,
}) {
    return (
        <th
            className="
                px-5
                py-3
                text-left
                text-[8px]
                font-bold
                uppercase
                tracking-wide
                text-[#64748b]
            "
        >
            {children}
        </th>
    );
}


function TableCell({
    children,
}) {
    return (
        <td
            className="
                px-5
                py-4
                align-middle
            "
        >
            {children}
        </td>
    );
}


function StatCard({
    label,
    value,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-[#dbe4ef]
                bg-white
                p-5
                shadow-sm
            "
        >
            <p
                className="
                    text-[9px]
                    text-[#64748b]
                "
            >
                {label}
            </p>

            <p
                className="
                    mt-2
                    text-[23px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </article>
    );
}


function formatAction(
    action
) {
    const text =
        String(
            action ||
            "Activity"
        )
            .replace(
                /[_-]/g,
                " "
            )
            .trim();


    return text.replace(
        /\b\w/g,
        (
            character
        ) =>
            character.toUpperCase()
    );
}


function formatDate(
    value
) {
    if (
        !value
    ) {
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
        return String(
            value
        );
    }


    return date.toLocaleString(
        [],
        {
            year:
                "numeric",

            month:
                "short",

            day:
                "2-digit",

            hour:
                "2-digit",

            minute:
                "2-digit",
        }
    );
}


export default AuditLogsPage;