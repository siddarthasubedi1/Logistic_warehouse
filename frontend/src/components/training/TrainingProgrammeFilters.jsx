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
            typeFilter !==
            "all" ||
            statusFilter !==
            "all"
        );


    const handleClearFilters =
        () => {
            onSearchChange?.(
                ""
            );

            onTypeChange?.(
                "all"
            );

            onStatusChange?.(
                "all"
            );
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
                            font-bold
                            text-[#172033]
                        "
                    >
                        Filter Programmes
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            font-medium
                            text-slate-500
                        "
                    >
                        Search or narrow the programme list.
                    </p>
                </div>


                {filtersActive && (
                    <button
                        type="button"
                        onClick={
                            handleClearFilters
                        }
                        className="
                            min-h-[38px]
                            w-full
                            rounded-lg
                            border
                            border-slate-300
                            bg-white
                            px-4
                            text-[8px]
                            font-semibold
                            text-slate-700
                            hover:bg-slate-50
                            sm:w-auto
                        "
                    >
                        Clear Filters
                    </button>
                )}
            </div>


            <div
                className="
                    grid
                    gap-3
                    bg-slate-50/40
                    p-4
                    md:grid-cols-2
                    xl:grid-cols-[2fr_1fr_1fr]
                    sm:p-5
                "
            >
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
                            font-semibold
                            text-slate-700
                        "
                    >
                        Search
                    </span>

                    <div
                        className="
                            relative
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
                            placeholder="Search programme title, type or Trainer..."
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
                                text-slate-800
                                outline-none
                                placeholder:text-slate-400
                                focus:border-blue-500
                                focus:ring-1
                                focus:ring-blue-100
                            "
                        />
                    </div>
                </label>


                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[8px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Programme Type
                    </span>

                    <select
                        value={
                            typeFilter
                        }
                        onChange={(
                            event
                        ) =>
                            onTypeChange?.(
                                event.target.value
                            )
                        }
                        className={
                            selectClass
                        }
                    >
                        <option value="all">
                            All Types
                        </option>

                        {programmeTypes.map(
                            (
                                type
                            ) => (
                                <option
                                    key={
                                        type
                                    }
                                    value={
                                        type
                                    }
                                >
                                    {formatProgrammeType(
                                        type
                                    )}
                                </option>
                            )
                        )}
                    </select>
                </label>


                <label
                    className="
                        block
                    "
                >
                    <span
                        className="
                            mb-2
                            block
                            text-[8px]
                            font-semibold
                            text-slate-700
                        "
                    >
                        Status
                    </span>

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
                </label>
            </div>
        </section>
    );
}


const selectClass = `
    h-10
    w-full
    rounded-lg
    border
    border-slate-300
    bg-white
    px-3
    text-[9px]
    font-medium
    text-slate-800
    outline-none
    focus:border-blue-500
    focus:ring-1
    focus:ring-blue-100
`;


export default TrainingProgrammeFilters;