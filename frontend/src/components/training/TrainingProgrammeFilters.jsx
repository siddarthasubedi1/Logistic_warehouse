function TrainingProgrammeFilters({
    searchTerm = "",
    typeFilter = "all",
    statusFilter = "all",
    programmeTypes = [],
    onSearchChange,
    onTypeChange,
    onStatusChange,
}) {
    return (
        <div className="grid gap-3 lg:grid-cols-[1fr_220px_180px]">

            {/* ================================================= */}
            {/* SEARCH */}
            {/* ================================================= */}

            <label className="block">

                <span className="sr-only">
                    Search training programmes
                </span>


                <div className="relative">

                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">

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
                        placeholder="Search programmes..."
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            py-2.5
                            pl-10
                            pr-3
                            text-sm
                            text-slate-800
                            outline-none
                            transition
                            focus:border-blue-500
                            focus:ring-2
                            focus:ring-blue-100
                        "
                    />

                </div>

            </label>


            {/* ================================================= */}
            {/* PROGRAMME TYPE */}
            {/* ================================================= */}

            <label className="block">

                <span className="sr-only">
                    Filter by programme type
                </span>


                <select
                    value={
                        typeFilter
                    }
                    onChange={(
                        event
                    ) =>
                        onTypeChange(
                            event.target.value
                        )
                    }
                    className={selectClass}
                >
                    <option value="all">
                        All Training Areas
                    </option>


                    {programmeTypes.map(
                        (
                            programmeType
                        ) => (
                            <option
                                key={
                                    programmeType.value
                                }
                                value={
                                    programmeType.value
                                }
                            >
                                {programmeType.label}
                            </option>
                        )
                    )}

                </select>

            </label>


            {/* ================================================= */}
            {/* STATUS */}
            {/* ================================================= */}

            <label className="block">

                <span className="sr-only">
                    Filter by status
                </span>


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
                    className={selectClass}
                >
                    <option value="all">
                        All Statuses
                    </option>

                    <option value="draft">
                        Draft
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="inactive">
                        Inactive
                    </option>
                </select>

            </label>

        </div>
    );
}


const selectClass = `
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    py-2.5
    text-sm
    text-slate-700
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default TrainingProgrammeFilters;