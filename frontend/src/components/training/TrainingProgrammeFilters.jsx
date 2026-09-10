function TrainingProgrammeFilters({
    searchTerm = "",
    typeFilter = "all",
    statusFilter = "all",
    programmeTypes = [],
    onSearchChange,
    onTypeChange,
    onStatusChange,
}) {
    // ======================================================
    // ACTIVE FILTER COUNT
    // ======================================================

    const activeFilterCount =
        (searchTerm.trim() ? 1 : 0) +
        (typeFilter !== "all" ? 1 : 0) +
        (statusFilter !== "all" ? 1 : 0);


    // ======================================================
    // CLEAR FILTERS
    // ======================================================

    const handleClearFilters = () => {
        onSearchChange("");
        onTypeChange("all");
        onStatusChange("all");
    };


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
                    gap-3
                    border-b
                    border-slate-100
                    bg-gradient-to-r
                    from-white
                    to-blue-50/50
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >

                <div
                    className="
                        flex
                        items-start
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
                            rounded-xl
                            bg-blue-50
                            text-blue-600
                        "
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-5 w-5"
                        >
                            <path d="M4 6h16" />
                            <path d="M7 12h10" />
                            <path d="M10 18h4" />
                        </svg>
                    </div>


                    <div>

                        <h2
                            className="
                                text-xs
                                font-bold
                                text-slate-900
                            "
                        >
                            Filter Training Programmes
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                leading-4
                                text-slate-500
                            "
                        >
                            Search by programme name or narrow the list
                            by training area and status.
                        </p>

                    </div>

                </div>


                <div
                    className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                    "
                >

                    {activeFilterCount > 0 && (
                        <span
                            className="
                                rounded-full
                                bg-blue-50
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-blue-700
                            "
                        >
                            {activeFilterCount} Active Filter
                            {activeFilterCount === 1 ? "" : "s"}
                        </span>
                    )}


                    {activeFilterCount > 0 && (
                        <button
                            type="button"
                            onClick={
                                handleClearFilters
                            }
                            className="
                                inline-flex
                                min-h-[32px]
                                items-center
                                justify-center
                                rounded-lg
                                border
                                border-slate-200
                                bg-white
                                px-3
                                py-1.5
                                text-[9px]
                                font-semibold
                                text-slate-600
                                transition
                                hover:border-blue-300
                                hover:bg-blue-50
                                hover:text-blue-700
                            "
                        >
                            Clear Filters
                        </button>
                    )}

                </div>

            </div>


            {/* ================================================= */}
            {/* FILTERS */}
            {/* ================================================= */}

            <div
                className="
                    grid
                    gap-4
                    p-4
                    sm:p-5
                    md:grid-cols-2
                    lg:grid-cols-[minmax(0,1fr)_220px_190px]
                "
            >

                {/* ================================================= */}
                {/* SEARCH */}
                {/* ================================================= */}

                <label
                    className="
                        block
                        md:col-span-2
                        lg:col-span-1
                    "
                >

                    <span
                        className="
                            mb-2
                            block
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Search
                    </span>


                    <div className="relative">

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
                            placeholder="Search programme title or description..."
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
                                text-slate-800
                                outline-none
                                transition
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-2
                                focus:ring-blue-100
                            "
                        />

                    </div>

                </label>


                {/* ================================================= */}
                {/* TYPE */}
                {/* ================================================= */}

                <label className="block">

                    <span
                        className="
                            mb-2
                            block
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Training Area
                    </span>


                    <div className="relative">

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
                            className={
                                selectClass
                            }
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


                        <SelectArrow />

                    </div>

                </label>


                {/* ================================================= */}
                {/* STATUS */}
                {/* ================================================= */}

                <label className="block">

                    <span
                        className="
                            mb-2
                            block
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-wide
                            text-slate-500
                        "
                    >
                        Programme Status
                    </span>


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
                            className={
                                selectClass
                            }
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


                        <SelectArrow />

                    </div>

                </label>

            </div>

        </section>
    );
}


// ======================================================
// SELECT ARROW
// ======================================================

function SelectArrow() {
    return (
        <span
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
        </span>
    );
}


// ======================================================
// SELECT STYLE
// ======================================================

const selectClass = `
    h-11
    w-full
    appearance-none
    rounded-xl
    border
    border-slate-300
    bg-white
    px-3.5
    pr-10
    text-xs
    text-slate-700
    outline-none
    transition
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
`;


export default TrainingProgrammeFilters;