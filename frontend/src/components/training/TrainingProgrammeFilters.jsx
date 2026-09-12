import {
    formatProgrammeType,
} from "../../utils/training";


function TrainingProgrammeFilters({
    searchTerm = "",
    typeFilter = "all",
    statusFilter = "all",
    programmeTypes = [],
    onSearchChange,
    onTypeChange,
    onStatusChange,
}) {
    const filtersActive =
        Boolean(
            searchTerm.trim() ||
            typeFilter !== "all" ||
            statusFilter !== "all"
        );


    const handleClearFilters = () => {
        onSearchChange?.("");
        onTypeChange?.("all");
        onStatusChange?.("all");
    };


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
                    flex-col
                    gap-3
                    border-b
                    border-slate-100
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >
                <div>
                    <h2
                        className="
                            text-[11px]
                            font-semibold
                            text-slate-800
                        "
                    >
                        Filter Programmes
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            text-slate-400
                        "
                    >
                        Search or filter the training programme list.
                    </p>
                </div>

                {filtersActive && (
                    <button
                        type="button"
                        onClick={handleClearFilters}
                        className="
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            py-2
                            text-[8px]
                            font-medium
                            text-slate-600
                            transition
                            hover:bg-slate-50
                            sm:w-auto
                        "
                    >
                        Clear Filters
                    </button>
                )}
            </div>


            {/* FILTERS */}

            <div
                className="
                    grid
                    gap-3
                    p-4
                    sm:p-5
                    md:grid-cols-2
                    xl:grid-cols-[minmax(250px,2fr)_1fr_1fr]
                "
            >
                {/* SEARCH */}

                <label
                    className="
                        block
                        md:col-span-2
                        xl:col-span-1
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[8px]
                            font-medium
                            text-slate-500
                        "
                    >
                        Search
                    </span>

                    <div className="relative">
                        <span
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
                        </span>

                        <input
                            type="search"
                            value={searchTerm}
                            onChange={(event) =>
                                onSearchChange?.(
                                    event.target.value
                                )
                            }
                            placeholder="Search programme..."
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
                                text-slate-700
                                outline-none
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-1
                                focus:ring-blue-100
                            "
                        />
                    </div>
                </label>


                {/* TYPE */}

                <label className="block">
                    <span
                        className="
                            mb-2
                            block
                            text-[8px]
                            font-medium
                            text-slate-500
                        "
                    >
                        Training Area
                    </span>

                    <select
                        value={typeFilter}
                        onChange={(event) =>
                            onTypeChange?.(
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
                            text-slate-700
                            outline-none
                            focus:border-blue-500
                        "
                    >
                        <option value="all">
                            All Training Areas
                        </option>

                        {programmeTypes.map(
                            (type) => (
                                <option
                                    key={type}
                                    value={type}
                                >
                                    {formatProgrammeType(
                                        type
                                    )}
                                </option>
                            )
                        )}
                    </select>
                </label>


                {/* STATUS */}

                <label className="block">
                    <span
                        className="
                            mb-2
                            block
                            text-[8px]
                            font-medium
                            text-slate-500
                        "
                    >
                        Status
                    </span>

                    <select
                        value={statusFilter}
                        onChange={(event) =>
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
                            text-slate-700
                            outline-none
                            focus:border-blue-500
                        "
                    >
                        <option value="all">
                            All Statuses
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
        </section>
    );
}


export default TrainingProgrammeFilters;