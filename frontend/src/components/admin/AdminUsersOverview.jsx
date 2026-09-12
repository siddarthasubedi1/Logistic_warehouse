function getName(
    user
) {
    return (
        `${user?.firstName || ""} ${user?.lastName || ""}`
            .trim() ||
        user?.username ||
        "User"
    );
}


function RoleBadge({
    role,
}) {
    const normalized =
        String(
            role ||
            ""
        ).toLowerCase();


    const trainer =
        normalized ===
        "trainer";


    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-[9px]
                font-medium

                ${trainer
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {trainer
                ? "Trainer"
                : "Trainee"}
        </span>
    );
}


function StatusBadge({
    status,
}) {
    const active =
        String(
            status ||
            ""
        ).toLowerCase() ===
        "active";


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
                font-medium

                ${active
                    ? "bg-emerald-50 text-emerald-600"
                    : "bg-red-50 text-red-600"
                }
            `}
        >
            <span
                className={`
                    h-1.5
                    w-1.5
                    rounded-full

                    ${active
                        ? "bg-emerald-500"
                        : "bg-red-500"
                    }
                `}
            />

            {active
                ? "Active"
                : "Deactivated"}
        </span>
    );
}


function AdminUsersOverview({
    users = [],
    trainees = 0,
    trainers = 0,
    loading = false,
    onViewAll,
}) {
    const recentUsers =
        users.slice(
            0,
            5
        );


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
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-[#e8eef5]
                    px-5
                    py-4
                "
            >
                <div>
                    <h2
                        className="
                            text-[14px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        User Overview
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            text-[#7c8da6]
                        "
                    >
                        Recently generated Trainer and Trainee accounts.
                    </p>
                </div>


                <button
                    type="button"
                    onClick={
                        onViewAll
                    }
                    className="
                        shrink-0
                        text-[13px]
                        font-medium
                        text-[#1769e8]
                        transition
                        hover:text-[#0b5ed7]
                    "
                >
                    View All
                </button>
            </div>


            <div
                className="
                    p-5
                "
            >
                <div
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                    "
                >
                    <Summary
                        value={
                            trainees
                        }
                        label="Trainees"
                        color="blue"
                    />


                    <Summary
                        value={
                            trainers
                        }
                        label="Trainers"
                        color="purple"
                    />
                </div>


                <div
                    className="
                        mt-5
                        overflow-x-auto
                    "
                >
                    <table
                        className="
                            min-w-[660px]
                            text-left
                        "
                    >
                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-[#dbe4ef]
                                "
                            >
                                <th
                                    className="
                                        px-2
                                        py-3
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        text-[#8aa0bb]
                                    "
                                >
                                    User
                                </th>


                                <th
                                    className="
                                        px-2
                                        py-3
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        text-[#8aa0bb]
                                    "
                                >
                                    Role
                                </th>


                                <th
                                    className="
                                        px-2
                                        py-3
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        text-[#8aa0bb]
                                    "
                                >
                                    Username
                                </th>


                                <th
                                    className="
                                        px-2
                                        py-3
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        text-[#8aa0bb]
                                    "
                                >
                                    Status
                                </th>
                            </tr>
                        </thead>


                        <tbody>
                            {loading ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="
                                            py-12
                                            text-center
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        Loading users...
                                    </td>
                                </tr>
                            ) : recentUsers.length ===
                                0 ? (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="
                                            py-12
                                            text-center
                                            text-[11px]
                                            text-slate-500
                                        "
                                    >
                                        No Trainer or Trainee accounts yet.
                                    </td>
                                </tr>
                            ) : (
                                recentUsers.map(
                                    (
                                        user
                                    ) => {
                                        const name =
                                            getName(
                                                user
                                            );


                                        return (
                                            <tr
                                                key={
                                                    user._id ||
                                                    user.id ||
                                                    user.username
                                                }
                                                className="
                                                    border-b
                                                    border-[#edf1f6]
                                                    last:border-0
                                                "
                                            >
                                                <td
                                                    className="
                                                        px-2
                                                        py-3
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
                                                                h-8
                                                                w-8
                                                                shrink-0
                                                                items-center
                                                                justify-center
                                                                rounded-full
                                                                bg-blue-50
                                                                text-[10px]
                                                                font-bold
                                                                text-blue-600
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
                                                                    whitespace-nowrap
                                                                    text-[10px]
                                                                    font-medium
                                                                    text-[#172033]
                                                                "
                                                            >
                                                                {name}
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    whitespace-nowrap
                                                                    text-[8px]
                                                                    text-[#7c8da6]
                                                                "
                                                            >
                                                                {user.email ||
                                                                    "—"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>


                                                <td
                                                    className="
                                                        px-2
                                                        py-3
                                                    "
                                                >
                                                    <RoleBadge
                                                        role={
                                                            user.role
                                                        }
                                                    />
                                                </td>


                                                <td
                                                    className="
                                                        px-2
                                                        py-3
                                                        text-[9px]
                                                        text-[#52627a]
                                                    "
                                                >
                                                    {user.username ||
                                                        "—"}
                                                </td>


                                                <td
                                                    className="
                                                        px-2
                                                        py-3
                                                    "
                                                >
                                                    <StatusBadge
                                                        status={
                                                            user.status
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}


function Summary({
    value,
    label,
    color,
}) {
    const blue =
        color ===
        "blue";


    return (
        <div
            className="
                flex
                min-h-[64px]
                items-center
                gap-3
                rounded-lg
                bg-[#f8fafc]
                px-4
            "
        >
            <div
                className={`
                    flex
                    h-9
                    w-9
                    items-center
                    justify-center
                    rounded-full

                    ${blue
                        ? "bg-blue-50 text-blue-600"
                        : "bg-purple-50 text-purple-600"
                    }
                `}
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
                        cx="12"
                        cy="8"
                        r="3"
                    />

                    <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
                </svg>
            </div>


            <div>
                <p
                    className="
                        text-[17px]
                        font-bold
                        leading-none
                        text-[#172033]
                    "
                >
                    {value}
                </p>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-[#64748b]
                    "
                >
                    {label}
                </p>
            </div>
        </div>
    );
}


export default AdminUsersOverview;