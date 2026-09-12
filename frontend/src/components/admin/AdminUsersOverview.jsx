import {
    useNavigate,
} from "react-router-dom";

import StatusBadge from "../ui/StatusBadge";


function AdminUsersOverview({
    loading = false,
    users = [],
    trainers = 0,
    trainees = 0,
}) {
    const navigate =
        useNavigate();


    const recentUsers =
        Array.isArray(
            users
        )
            ? users.slice(
                0,
                5
            )
            : [];


    return (
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

            {/* HEADER */}

            <div
                className="
                    flex
                    items-center
                    justify-between
                    gap-4
                    border-b
                    border-slate-100
                    px-5
                    py-4
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
                        User Overview
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Recently generated Trainer and Trainee accounts.
                    </p>
                </div>


                <button
                    type="button"
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                    className="
                        text-[9px]
                        font-medium
                        text-blue-600
                        transition
                        hover:text-blue-700
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

                {/* COUNTS */}

                <div
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                    "
                >
                    <OverviewCount
                        value={
                            trainees
                        }
                        label="Trainees"
                        tone="blue"
                    />


                    <OverviewCount
                        value={
                            trainers
                        }
                        label="Trainers"
                        tone="purple"
                    />
                </div>


                {/* TABLE */}

                <div
                    className="
                        mt-5
                        overflow-x-auto
                    "
                >
                    <table
                        className="
                            min-w-[650px]
                            w-full
                            border-collapse
                        "
                    >
                        <thead>
                            <tr
                                className="
                                    border-b
                                    border-slate-200
                                "
                            >
                                <TableHeading>
                                    User
                                </TableHeading>

                                <TableHeading>
                                    Role
                                </TableHeading>

                                <TableHeading>
                                    Username
                                </TableHeading>

                                <TableHeading>
                                    Status
                                </TableHeading>
                            </tr>
                        </thead>


                        <tbody>
                            {loading && (
                                <tr>
                                    <td
                                        colSpan="4"
                                        className="
                                            py-8
                                            text-center
                                            text-[9px]
                                            text-slate-400
                                        "
                                    >
                                        Loading users...
                                    </td>
                                </tr>
                            )}


                            {!loading &&
                                recentUsers.length ===
                                0 && (
                                    <tr>
                                        <td
                                            colSpan="4"
                                            className="
                                            py-8
                                            text-center
                                            text-[9px]
                                            text-slate-400
                                        "
                                        >
                                            No users available.
                                        </td>
                                    </tr>
                                )}


                            {!loading &&
                                recentUsers.map(
                                    (
                                        currentUser
                                    ) => {
                                        const name =
                                            getDisplayName(
                                                currentUser
                                            );


                                        const initial =
                                            name
                                                .charAt(
                                                    0
                                                )
                                                .toUpperCase();


                                        return (
                                            <tr
                                                key={
                                                    currentUser._id ||
                                                    currentUser.username
                                                }
                                                className="
                                                    border-b
                                                    border-slate-100
                                                    last:border-b-0
                                                "
                                            >
                                                <td
                                                    className="
                                                        py-3
                                                        pr-4
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
                                                                text-[9px]
                                                                font-semibold
                                                                text-blue-600
                                                            "
                                                        >
                                                            {initial ||
                                                                "U"}
                                                        </div>


                                                        <div
                                                            className="
                                                                min-w-0
                                                            "
                                                        >
                                                            <p
                                                                className="
                                                                    max-w-[170px]
                                                                    truncate
                                                                    text-[9px]
                                                                    font-medium
                                                                    text-slate-700
                                                                "
                                                            >
                                                                {name}
                                                            </p>


                                                            <p
                                                                className="
                                                                    mt-0.5
                                                                    max-w-[180px]
                                                                    truncate
                                                                    text-[7px]
                                                                    text-slate-400
                                                                "
                                                            >
                                                                {currentUser.email ||
                                                                    "—"}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </td>


                                                <td
                                                    className="
                                                        py-3
                                                        pr-4
                                                    "
                                                >
                                                    <RoleBadge
                                                        role={
                                                            currentUser.role
                                                        }
                                                    />
                                                </td>


                                                <td
                                                    className="
                                                        py-3
                                                        pr-4
                                                        text-[8px]
                                                        text-slate-500
                                                    "
                                                >
                                                    {currentUser.username ||
                                                        "—"}
                                                </td>


                                                <td
                                                    className="
                                                        py-3
                                                    "
                                                >
                                                    <StatusBadge
                                                        status={
                                                            currentUser.status
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}


function OverviewCount({
    value,
    label,
    tone,
}) {
    const iconClass =
        tone ===
            "purple"
            ? "bg-purple-50 text-purple-600"
            : "bg-blue-50 text-blue-600";


    return (
        <div
            className="
                flex
                items-center
                gap-3
                rounded-lg
                bg-slate-50
                px-4
                py-3
            "
        >
            <div
                className={`
                    flex
                    h-8
                    w-8
                    items-center
                    justify-center
                    rounded-full
                    ${iconClass}
                `}
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
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
                        text-slate-800
                    "
                >
                    {value}
                </p>


                <p
                    className="
                        mt-1
                        text-[8px]
                        text-slate-500
                    "
                >
                    {label}
                </p>
            </div>
        </div>
    );
}


function TableHeading({
    children,
}) {
    return (
        <th
            className="
                py-2.5
                pr-4
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


function RoleBadge({
    role,
}) {
    const isTrainer =
        role ===
        "trainer";


    return (
        <span
            className={`
                inline-flex
                items-center
                rounded-full
                px-2.5
                py-1
                text-[7px]
                font-medium
                capitalize

                ${isTrainer
                    ? "bg-purple-50 text-purple-600"
                    : "bg-blue-50 text-blue-600"
                }
            `}
        >
            {role ||
                "User"}
        </span>
    );
}


function getDisplayName(
    user
) {
    const name =
        [
            user?.firstName,
            user?.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim();


    return (
        name ||
        user?.username ||
        "User"
    );
}


export default AdminUsersOverview;