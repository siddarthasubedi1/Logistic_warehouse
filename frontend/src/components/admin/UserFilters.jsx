function UserFilters({
    searchTerm = "",
    roleFilter = "all",
    statusFilter = "all",
    onSearchChange,
    onRoleChange,
    onStatusChange,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-gradient-to-r
                from-slate-50
                via-white
                to-blue-50/40
                p-4
            "
        >

            {/* ================================================= */}
            {/* FILTER HEADER */}
            {/* ================================================= */}

            <div
                className="
                    mb-4
                    flex
                    flex-col
                    gap-2
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
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            bg-blue-100
                            text-blue-700
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-4 w-4"
                        >
                            <path d="M4 6h16" />

                            <path d="M7 12h10" />

                            <path d="M10 18h4" />
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
                            Filter Accounts
                        </p>


                        <p
                            className="
                                mt-0.5
                                text-[10px]
                                text-slate-500
                            "
                        >
                            Find Trainer and Trainee accounts quickly.
                        </p>

                    </div>

                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1
                        text-[9px]
                        font-semibold
                        uppercase
                        tracking-wide
                        text-blue-700
                    "
                >
                    User Management
                </span>

            </div>


            {/* ================================================= */}
            {/* FILTER CONTROLS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    gap-3
                    sm:grid-cols-2
                    lg:grid-cols-[minmax(260px,2fr)_1fr_1fr]
                "
            >

                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                <div
                    className="
                        relative
                        sm:col-span-2
                        lg:col-span-1
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
                            onSearchChange(
                                event.target.value
                            )
                        }
                        placeholder="Search name, username or email..."
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


                {/* ================================================= */}
                {/* ROLE */}
                {/* ================================================= */}

                <div className="relative">

                    <select
                        value={
                            roleFilter
                        }
                        onChange={(
                            event
                        ) =>
                            onRoleChange(
                                event.target.value
                            )
                        }
                        className="
                            h-11
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-4
                            pr-10
                            text-xs
                            font-medium
                            text-slate-700
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value="all">
                            All Roles
                        </option>

                        <option value="trainer">
                            Trainer
                        </option>

                        <option value="trainee">
                            Trainee
                        </option>
                    </select>


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

                </div>


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

                <div className="relative">

                    <select
                        value={
                            statusFilter
                        }
                        onChange={(
                            event
                        ) =>
                            onStatusChange(
                                event.target.value
                            )
                        }
                        className="
                            h-11
                            w-full
                            appearance-none
                            rounded-xl
                            border
                            border-slate-300
                            bg-white
                            px-4
                            pr-10
                            text-xs
                            font-medium
                            text-slate-700
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    >
                        <option value="all">
                            All Statuses
                        </option>

                        <option value="active">
                            Active
                        </option>

                        <option value="deactivated">
                            Deactivated
                        </option>
                    </select>


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

                </div>

            </div>

        </div>
    );
}


export default UserFilters;