function UserFilters({
    searchTerm = "",
    roleFilter = "all",
    statusFilter = "all",
    onSearchChange,
    onRoleChange,
    onStatusChange,
}) {
    const hasFilters =
        Boolean(
            searchTerm.trim()
        ) ||
        roleFilter !==
        "all" ||
        statusFilter !==
        "all";


    const clearFilters =
        () => {
            onSearchChange?.(
                ""
            );

            onRoleChange?.(
                "all"
            );

            onStatusChange?.(
                "all"
            );
        };


    return (
        <div
            className="
                rounded-xl
                border
                border-[#e1e8f0]
                bg-[#f8fafc]
                p-3
                sm:p-4
            "
        >
            <div
                className="
                    grid
                    gap-3
                    md:grid-cols-2
                    xl:grid-cols-[minmax(260px,2fr)_1fr_1fr_auto]
                "
            >
                {/* =================================================
                    SEARCH
                ================================================= */}

                <div
                    className="
                        relative
                        md:col-span-2
                        xl:col-span-1
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
                            strokeLinecap="round"
                            strokeLinejoin="round"
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
                            searchTerm
                        }
                        onChange={(
                            event
                        ) =>
                            onSearchChange?.(
                                event.target.value
                            )
                        }
                        placeholder="Search name, username or email..."
                        className="
                            min-h-[40px]
                            w-full
                            rounded-lg
                            border
                            border-[#cbd5e1]
                            bg-white
                            pl-9
                            pr-3
                            text-[10px]
                            text-[#172033]
                            outline-none
                            transition
                            placeholder:text-[#94a3b8]
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />
                </div>


                {/* =================================================
                    ROLE
                ================================================= */}

                <select
                    value={
                        roleFilter
                    }
                    onChange={(
                        event
                    ) =>
                        onRoleChange?.(
                            event.target.value
                        )
                    }
                    className="
                        min-h-[40px]
                        w-full
                        rounded-lg
                        border
                        border-[#cbd5e1]
                        bg-white
                        px-3
                        text-[10px]
                        text-[#172033]
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


                {/* =================================================
                    STATUS
                ================================================= */}

                <select
                    value={
                        statusFilter
                    }
                    onChange={(
                        event
                    ) =>
                        onStatusChange?.(
                            event.target.value
                        )
                    }
                    className="
                        min-h-[40px]
                        w-full
                        rounded-lg
                        border
                        border-[#cbd5e1]
                        bg-white
                        px-3
                        text-[10px]
                        text-[#172033]
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

                    <option value="inactive">
                        Inactive
                    </option>
                </select>


                {/* =================================================
                    CLEAR
                ================================================= */}

                <button
                    type="button"
                    onClick={
                        clearFilters
                    }
                    disabled={
                        !hasFilters
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
                        hover:bg-[#f1f5f9]
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        md:col-span-2
                        xl:col-span-1
                    "
                >
                    Clear Filters
                </button>
            </div>
        </div>
    );
}


export default UserFilters;