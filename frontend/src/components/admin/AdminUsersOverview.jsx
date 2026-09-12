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
                min-w-0
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
                    px-4
                    py-4
                    sm:px-5
                "
            >
                <div
                    className="
                        min-w-0
                    "
                >
                    <h2
                        className="
                            text-[12px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        User Overview
                    </h2>


                    <p
                        className="
                            mt-1
                            text-[8px]
                            font-medium
                            text-slate-500
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
                        shrink-0
                        text-[9px]
                        font-semibold
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
                    p-4
                    sm:p-5
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
                        tone="violet"
                    />
                </div>


                {/* LOADING */}

                {loading ? (
                    <div
                        className="
                            py-10
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
                            Loading users...
                        </p>
                    </div>
                ) : recentUsers.length ===
                    0 ? (
                    <div
                        className="
                            py-10
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
                            No generated users found.
                        </p>
                    </div>
                ) : (
                    <>
                        {/* MOBILE */}

                        <div
                            className="
                                mt-5
                                space-y-3
                                md:hidden
                            "
                        >
                            {recentUsers.map(
                                (
                                    user
                                ) => (
                                    <UserCard
                                        key={
                                            user._id
                                        }
                                        user={
                                            user
                                        }
                                    />
                                )
                            )}
                        </div>


                        {/* DESKTOP */}

                        <div
                            className="
                                mt-5
                                hidden
                                overflow-x-auto
                                md:block
                            "
                        >
                            <table
                                className="
                                    w-full
                                    min-w-[650px]
                                "
                            >
                                <thead>
                                    <tr
                                        className="
                                            border-b
                                            border-slate-200
                                        "
                                    >
                                        <Head>
                                            User
                                        </Head>

                                        <Head>
                                            Role
                                        </Head>

                                        <Head>
                                            Username
                                        </Head>

                                        <Head>
                                            Status
                                        </Head>
                                    </tr>
                                </thead>


                                <tbody>
                                    {recentUsers.map(
                                        (
                                            user
                                        ) => (
                                            <UserRow
                                                key={
                                                    user._id
                                                }
                                                user={
                                                    user
                                                }
                                            />
                                        )
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </>
                )}
            </div>
        </section>
    );
}


function OverviewCount({
    value,
    label,
    tone,
}) {
    const toneClasses =
        tone ===
            "violet"
            ? "bg-violet-50 text-violet-600"
            : "bg-blue-50 text-blue-600";


    return (
        <div
            className="
                flex
                items-center
                gap-3
                rounded-lg
                bg-slate-50
                p-3
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
                    rounded-full

                    ${toneClasses}
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
                        text-[18px]
                        font-bold
                        text-slate-800
                    "
                >
                    {value}
                </p>


                <p
                    className="
                        text-[7px]
                        font-medium
                        text-slate-500
                    "
                >
                    {label}
                </p>
            </div>
        </div>
    );
}


function UserRow({
    user,
}) {
    const fullName =
        [
            user.firstName,
            user.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim() ||
        user.username ||
        "User";


    const initial =
        fullName
            .charAt(0)
            .toUpperCase();


    return (
        <tr
            className="
                border-b
                border-slate-100
                last:border-0
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
                            text-[8px]
                            font-bold
                            text-blue-600
                        "
                    >
                        {initial}
                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >
                        <p
                            className="
                                truncate
                                text-[8px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            {fullName}
                        </p>


                        <p
                            className="
                                mt-0.5
                                max-w-[220px]
                                truncate
                                text-[7px]
                                text-slate-500
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
                    px-4
                    py-3
                "
            >
                <StatusBadge
                    status={
                        user.role
                    }
                />
            </td>


            <td
                className="
                    px-4
                    py-3
                    text-[8px]
                    font-medium
                    text-slate-600
                "
            >
                {user.username ||
                    "—"}
            </td>


            <td
                className="
                    pl-4
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


function UserCard({
    user,
}) {
    const fullName =
        [
            user.firstName,
            user.lastName,
        ]
            .filter(Boolean)
            .join(" ")
            .trim() ||
        user.username ||
        "User";


    return (
        <article
            className="
                rounded-lg
                border
                border-slate-200
                bg-white
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
                <div
                    className="
                        min-w-0
                    "
                >
                    <p
                        className="
                            truncate
                            text-[10px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {fullName}
                    </p>


                    <p
                        className="
                            mt-1
                            truncate
                            text-[8px]
                            text-slate-500
                        "
                    >
                        {user.email ||
                            "—"}
                    </p>
                </div>


                <StatusBadge
                    status={
                        user.status
                    }
                />
            </div>


            <div
                className="
                    mt-3
                    flex
                    flex-wrap
                    items-center
                    gap-2
                "
            >
                <StatusBadge
                    status={
                        user.role
                    }
                />


                <span
                    className="
                        text-[8px]
                        font-medium
                        text-slate-500
                    "
                >
                    @{user.username ||
                        "—"}
                </span>
            </div>
        </article>
    );
}


function Head({
    children,
}) {
    return (
        <th
            className="
                py-2
                pr-4
                text-left
                text-[7px]
                font-semibold
                uppercase
                tracking-wide
                text-slate-500
            "
        >
            {children}
        </th>
    );
}


export default AdminUsersOverview;