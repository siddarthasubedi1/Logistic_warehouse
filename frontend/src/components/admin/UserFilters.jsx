function UserFilters({
    searchTerm = "",
    roleFilter = "all",
    statusFilter = "all",
    onSearchChange,
    onRoleChange,
    onStatusChange,
}) {
    const handleClearFilters =
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


    const filtersActive =
        Boolean(
            searchTerm ||
            roleFilter !==
            "all" ||
            statusFilter !==
            "all"
        );


    return (
        <div
            className="
                rounded-lg
                border
                border-slate-200
                bg-slate-50
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
                {/* SEARCH */}

                <div
                    className="
                        relative
                        md:col-span-2
                        xl:col-span-1
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
                            pl-3
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
                            onSearchChange?.(
                                event.target.value
                            )
                        }
                        placeholder="Search name, username or email..."
                        className="
                            h-10
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            pl-9
                            pr-3
                            text-[9px]
                            font-medium
                            text-slate-700
                            outline-none
                            placeholder:text-slate-400
                            focus:border-blue-500
                            focus:ring-1
                            focus:ring-blue-100
                        "
                    />
                </div>


                {/* ROLE */}

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
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-3
                        text-[9px]
                        font-medium
                        text-slate-700
                        outline-none
                        focus:border-blue-500
                        focus:ring-1
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


                {/* STATUS */}

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
                        h-10
                        w-full
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-3
                        text-[9px]
                        font-medium
                        text-slate-700
                        outline-none
                        focus:border-blue-500
                        focus:ring-1
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


                {/* CLEAR */}

                <button
                    type="button"
                    onClick={
                        handleClearFilters
                    }
                    disabled={
                        !filtersActive
                    }
                    className="
                        h-10
                        rounded-lg
                        border
                        border-slate-300
                        bg-white
                        px-4
                        text-[8px]
                        font-semibold
                        text-slate-600
                        transition
                        hover:bg-slate-100
                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        md:col-span-2
                        xl:col-span-1
                    "
                >
                    Clear
                </button>
            </div>
        </div>
    );
}


export default UserFilters;