import {
    useNavigate,
} from "react-router-dom";

import ActionButton from "../ui/ActionButton";
import EmptyState from "../ui/EmptyState";
import StatusBadge from "../ui/StatusBadge";

import {
    getUserDisplayName,
} from "../../utils/training";


function AdminUsersOverview({
    loading = false,
    users = [],
    trainers = 0,
    trainees = 0,
}) {
    const navigate =
        useNavigate();


    // ======================================================
    // MOST RECENT USERS
    // ======================================================

    const recentUsers =
        [...users]
            .sort(
                (
                    first,
                    second
                ) =>
                    new Date(
                        second.createdAt ||
                        0
                    ) -
                    new Date(
                        first.createdAt ||
                        0
                    )
            )
            .slice(
                0,
                5
            );


    return (
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
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    flex
                    flex-col
                    gap-4
                    border-b
                    border-slate-200
                    bg-gradient-to-r
                    from-white
                    to-slate-50
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                <div>

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >

                        <div
                            className="
                                h-2
                                w-2
                                rounded-full
                                bg-blue-500
                            "
                        />


                        <h2
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            User Overview
                        </h2>

                    </div>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            text-slate-500
                        "
                    >
                        Recently generated Trainer and Trainee accounts.
                    </p>

                </div>


                <ActionButton
                    variant="secondary"
                    className="
                        w-full
                        justify-center
                        px-3
                        py-2
                        sm:w-auto
                    "
                    onClick={() =>
                        navigate(
                            "/admin/users"
                        )
                    }
                >
                    View All Users
                </ActionButton>

            </div>


            <div className="p-5">

                {/* ================================================= */}
                {/* COUNTS */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                    "
                >

                    <RoleSummary
                        title="Trainees"
                        value={
                            trainees
                        }
                        type="trainee"
                    />


                    <RoleSummary
                        title="Trainers"
                        value={
                            trainers
                        }
                        type="trainer"
                    />

                </div>


                {/* ================================================= */}
                {/* USERS */}
                {/* ================================================= */}

                <div className="mt-5">

                    {loading ? (
                        <div
                            className="
                                rounded-xl
                                bg-slate-50
                                py-10
                                text-center
                                text-xs
                                text-slate-400
                            "
                        >
                            Loading users...
                        </div>
                    ) : recentUsers.length ===
                        0 ? (
                        <EmptyState
                            title="No users found."
                            description="Generated Trainer and Trainee accounts will appear here."
                        />
                    ) : (
                        <>
                            {/* ================================================= */}
                            {/* MOBILE CARDS */}
                            {/* ================================================= */}

                            <div
                                className="
                                    space-y-3
                                    md:hidden
                                "
                            >

                                {recentUsers.map(
                                    (
                                        user
                                    ) => (
                                        <div
                                            key={
                                                user._id ||
                                                user.email
                                            }
                                            className="
                                                rounded-xl
                                                border
                                                border-slate-200
                                                bg-slate-50/60
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
                                                        flex
                                                        min-w-0
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
                                                            bg-blue-100
                                                            text-xs
                                                            font-bold
                                                            text-blue-700
                                                        "
                                                    >
                                                        {getUserDisplayName(
                                                            user,
                                                            "U"
                                                        )
                                                            .charAt(
                                                                0
                                                            )
                                                            .toUpperCase()}
                                                    </div>


                                                    <div className="min-w-0">

                                                        <p
                                                            className="
                                                                truncate
                                                                text-xs
                                                                font-semibold
                                                                text-slate-800
                                                            "
                                                        >
                                                            {getUserDisplayName(
                                                                user,
                                                                "User"
                                                            )}
                                                        </p>


                                                        <p
                                                            className="
                                                                mt-1
                                                                truncate
                                                                text-[9px]
                                                                text-slate-500
                                                            "
                                                        >
                                                            {user.email ||
                                                                "—"}
                                                        </p>

                                                    </div>

                                                </div>


                                                <StatusBadge
                                                    status={
                                                        user.status
                                                    }
                                                />

                                            </div>


                                            <div
                                                className="
                                                    mt-4
                                                    grid
                                                    grid-cols-2
                                                    gap-3
                                                    border-t
                                                    border-slate-200
                                                    pt-3
                                                "
                                            >

                                                <div>

                                                    <p
                                                        className="
                                                            text-[8px]
                                                            uppercase
                                                            tracking-wide
                                                            text-slate-400
                                                        "
                                                    >
                                                        Role
                                                    </p>


                                                    <div className="mt-1">
                                                        <StatusBadge
                                                            status={
                                                                user.role
                                                            }
                                                        />
                                                    </div>

                                                </div>


                                                <div>

                                                    <p
                                                        className="
                                                            text-[8px]
                                                            uppercase
                                                            tracking-wide
                                                            text-slate-400
                                                        "
                                                    >
                                                        Username
                                                    </p>


                                                    <p
                                                        className="
                                                            mt-1
                                                            truncate
                                                            text-[10px]
                                                            font-medium
                                                            text-slate-600
                                                        "
                                                    >
                                                        {user.username ||
                                                            "—"}
                                                    </p>

                                                </div>

                                            </div>

                                        </div>
                                    )
                                )}

                            </div>


                            {/* ================================================= */}
                            {/* DESKTOP TABLE */}
                            {/* ================================================= */}

                            <div
                                className="
                                    hidden
                                    overflow-x-auto
                                    md:block
                                "
                            >

                                <table
                                    className="
                                        min-w-[650px]
                                        w-full
                                    "
                                >

                                    <thead>

                                        <tr
                                            className="
                                                border-b
                                                border-slate-200
                                                text-left
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-wide
                                                text-slate-400
                                            "
                                        >

                                            <th className="px-2 py-3">
                                                User
                                            </th>

                                            <th className="px-2 py-3">
                                                Role
                                            </th>

                                            <th className="px-2 py-3">
                                                Username
                                            </th>

                                            <th className="px-2 py-3">
                                                Status
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody
                                        className="
                                            divide-y
                                            divide-slate-100
                                        "
                                    >

                                        {recentUsers.map(
                                            (
                                                user
                                            ) => (
                                                <tr
                                                    key={
                                                        user._id ||
                                                        user.email
                                                    }
                                                    className="
                                                        transition
                                                        hover:bg-slate-50
                                                    "
                                                >

                                                    <td className="px-2 py-4">

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
                                                                    h-9
                                                                    w-9
                                                                    shrink-0
                                                                    items-center
                                                                    justify-center
                                                                    rounded-full
                                                                    bg-blue-50
                                                                    text-[10px]
                                                                    font-bold
                                                                    text-blue-700
                                                                "
                                                            >
                                                                {getUserDisplayName(
                                                                    user,
                                                                    "U"
                                                                )
                                                                    .charAt(
                                                                        0
                                                                    )
                                                                    .toUpperCase()}
                                                            </div>


                                                            <div className="min-w-0">

                                                                <p
                                                                    className="
                                                                        text-[10px]
                                                                        font-semibold
                                                                        text-slate-700
                                                                    "
                                                                >
                                                                    {getUserDisplayName(
                                                                        user,
                                                                        "User"
                                                                    )}
                                                                </p>


                                                                <p
                                                                    className="
                                                                        mt-[2px]
                                                                        max-w-[220px]
                                                                        truncate
                                                                        text-[8px]
                                                                        text-slate-400
                                                                    "
                                                                >
                                                                    {user.email ||
                                                                        "—"}
                                                                </p>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    <td className="px-2 py-4">
                                                        <StatusBadge
                                                            status={
                                                                user.role
                                                            }
                                                        />
                                                    </td>


                                                    <td
                                                        className="
                                                            px-2
                                                            py-4
                                                            text-[9px]
                                                            text-slate-500
                                                        "
                                                    >
                                                        {user.username ||
                                                            "—"}
                                                    </td>


                                                    <td className="px-2 py-4">
                                                        <StatusBadge
                                                            status={
                                                                user.status
                                                            }
                                                        />
                                                    </td>

                                                </tr>
                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>
                        </>
                    )}

                </div>

            </div>

        </section>
    );
}


function RoleSummary({
    title,
    value,
    type,
}) {
    const isTrainer =
        type ===
        "trainer";


    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-slate-50
                p-4
            "
        >

            <div
                className={`
                    absolute
                    right-0
                    top-0
                    h-16
                    w-16
                    translate-x-5
                    -translate-y-5
                    rounded-full

                    ${isTrainer
                        ? "bg-indigo-100"
                        : "bg-blue-100"
                    }
                `}
            />


            <p
                className="
                    relative
                    text-2xl
                    font-bold
                    text-slate-800
                "
            >
                {value}
            </p>


            <p
                className="
                    relative
                    mt-1
                    text-[10px]
                    font-medium
                    text-slate-500
                "
            >
                {title}
            </p>

        </div>
    );
}


export default AdminUsersOverview;