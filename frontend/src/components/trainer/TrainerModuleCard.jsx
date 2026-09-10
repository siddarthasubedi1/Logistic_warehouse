import {
    useNavigate,
} from "react-router-dom";

import boxLift from "../../images/box-lift.jpg";
import heightImage from "../../images/hight.jpg";


// ======================================================
// TRAINING AREAS
// ======================================================

const TRAINING_AREAS = {
    "manual-handling": {
        id:
            "manual-handling",

        title:
            "Manual Handling",

        description:
            "Create and manage Manual Handling training programmes and learning sections.",

        image:
            boxLift,

        accent:
            "blue",
    },


    "working-at-height": {
        id:
            "working-at-height",

        title:
            "Working at Height",

        description:
            "Create and manage Working at Height training programmes and learning sections.",

        image:
            heightImage,

        accent:
            "amber",
    },
};


// ======================================================
// EMPTY ASSIGNMENT
// ======================================================

function EmptyAssignment() {
    return (
        <section
            className="
                overflow-hidden
                rounded-2xl
                border
                border-amber-200
                bg-gradient-to-r
                from-amber-50
                via-white
                to-orange-50
                p-5
                shadow-sm
                sm:p-6
            "
        >

            <div
                className="
                    flex
                    items-start
                    gap-4
                "
            >

                <div
                    className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-xl
                        bg-white
                        text-amber-600
                        shadow-sm
                    "
                >

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-5 w-5"
                    >
                        <circle
                            cx="12"
                            cy="12"
                            r="9"
                        />

                        <path d="M12 7v6" />

                        <path d="M12 17h.01" />
                    </svg>

                </div>


                <div>

                    <h2
                        className="
                            text-sm
                            font-bold
                            text-slate-900
                        "
                    >
                        No Training Area Assigned
                    </h2>


                    <p
                        className="
                            mt-2
                            max-w-2xl
                            text-[10px]
                            leading-5
                            text-slate-600
                        "
                    >
                        You do not currently have permission to manage
                        Manual Handling or Working at Height. Please
                        contact the Administrator.
                    </p>

                </div>

            </div>

        </section>
    );
}


// ======================================================
// TRAINING AREA CARD
// ======================================================

function TrainingAreaCard({
    area,
}) {
    const navigate =
        useNavigate();


    // ======================================================
    // OPEN PROGRAMME MANAGEMENT
    // ======================================================

    const handleOpenProgrammes =
        () => {
            navigate(
                "/training-programmes"
            );
        };


    const isWorkingAtHeight =
        area.id ===
        "working-at-height";


    return (
        <article
            className="
                group
                overflow-hidden
                rounded-2xl
                border
                border-slate-200
                bg-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-1
                hover:border-blue-200
                hover:shadow-lg
            "
        >

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <div
                className="
                    relative
                    h-44
                    overflow-hidden
                "
            >

                <img
                    src={
                        area.image
                    }
                    alt={
                        area.title
                    }
                    className="
                        h-full
                        w-full
                        object-cover
                        transition-transform
                        duration-500
                        group-hover:scale-105
                    "
                />


                <div
                    className="
                        absolute
                        inset-0
                        bg-gradient-to-t
                        from-slate-950/70
                        via-slate-900/10
                        to-transparent
                    "
                />


                <div
                    className="
                        absolute
                        left-4
                        top-4
                    "
                >

                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                            rounded-full
                            border
                            border-white/20
                            bg-slate-900/40
                            px-3
                            py-1.5
                            text-[9px]
                            font-semibold
                            text-white
                            backdrop-blur-sm
                        "
                    >

                        <span
                            className="
                                h-1.5
                                w-1.5
                                rounded-full
                                bg-emerald-400
                            "
                        />

                        Assigned Training Area
                    </span>

                </div>


                <div
                    className="
                        absolute
                        bottom-4
                        left-4
                        right-4
                    "
                >

                    <p
                        className="
                            text-[9px]
                            font-semibold
                            uppercase
                            tracking-[0.16em]
                            text-white/80
                        "
                    >
                        Trainer Access
                    </p>


                    <h2
                        className="
                            mt-1
                            text-lg
                            font-bold
                            text-white
                        "
                    >
                        {area.title}
                    </h2>

                </div>

            </div>


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="p-4 sm:p-5">

                <div
                    className="
                        flex
                        items-start
                        gap-3
                    "
                >

                    <div
                        className={`
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl

                            ${isWorkingAtHeight
                                ? "bg-amber-50 text-amber-700"
                                : "bg-blue-50 text-blue-700"
                            }
                        `}
                    >

                        {isWorkingAtHeight ? (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M5 21V5" />

                                <path d="M19 21V5" />

                                <path d="M5 9h14" />

                                <path d="M5 14h14" />

                                <path d="M5 19h14" />
                            </svg>
                        ) : (
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <rect
                                    x="3"
                                    y="8"
                                    width="18"
                                    height="10"
                                    rx="2"
                                />

                                <path d="M7 8V6a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v2" />

                                <path d="M8 13h8" />
                            </svg>
                        )}

                    </div>


                    <div>

                        <p
                            className="
                                text-[10px]
                                font-bold
                                text-slate-800
                            "
                        >
                            Safety Programme Management
                        </p>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                leading-4
                                text-slate-500
                            "
                        >
                            Create programmes and organise structured
                            learning content for this area.
                        </p>

                    </div>

                </div>


                <p
                    className="
                        mt-4
                        text-[10px]
                        leading-5
                        text-slate-500
                    "
                >
                    {area.description}
                </p>


                {/* ================================================= */}
                {/* FEATURES */}
                {/* ================================================= */}

                <div
                    className="
                        mt-4
                        grid
                        grid-cols-2
                        gap-2
                    "
                >

                    <AreaFeature
                        label="Programmes"
                    />


                    <AreaFeature
                        label="Learning Sections"
                    />

                </div>


                {/* ================================================= */}
                {/* ACTION */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={
                        handleOpenProgrammes
                    }
                    className="
                        mt-5
                        inline-flex
                        min-h-[42px]
                        w-full
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        bg-blue-600
                        px-4
                        py-2.5
                        text-[10px]
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        focus:outline-none
                        focus:ring-2
                        focus:ring-blue-300
                    "
                >
                    Manage Training Programmes

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        className="h-4 w-4"
                    >
                        <path d="m9 6 6 6-6 6" />
                    </svg>
                </button>

            </div>

        </article>
    );
}


// ======================================================
// FEATURE
// ======================================================

function AreaFeature({
    label,
}) {
    return (
        <div
            className="
                flex
                items-center
                gap-2
                rounded-xl
                bg-slate-50
                px-3
                py-2.5
            "
        >

            <span
                className="
                    flex
                    h-5
                    w-5
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-emerald-100
                    text-[8px]
                    font-bold
                    text-emerald-700
                "
            >
                ✓
            </span>


            <span
                className="
                    text-[9px]
                    font-semibold
                    text-slate-600
                "
            >
                {label}
            </span>

        </div>
    );
}


// ======================================================
// TRAINER MODULE CARD
// ======================================================

function TrainerModuleCard({
    assignedTrainingSections = [],
}) {
    // ======================================================
    // GET ASSIGNED AREAS
    // ======================================================

    const assignedAreas =
        assignedTrainingSections
            .map(
                (
                    sectionId
                ) =>
                    TRAINING_AREAS[
                    sectionId
                    ]
            )
            .filter(
                Boolean
            );


    // ======================================================
    // EMPTY
    // ======================================================

    if (
        assignedAreas.length ===
        0
    ) {
        return (
            <EmptyAssignment />
        );
    }


    // ======================================================
    // UI
    // ======================================================

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
                    px-5
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
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
                            <rect
                                x="4"
                                y="4"
                                width="16"
                                height="16"
                                rx="3"
                            />

                            <path d="M8 9h8" />

                            <path d="M8 13h8" />

                            <path d="M8 17h5" />
                        </svg>

                    </div>


                    <div>

                        <h2
                            className="
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            My Training Areas
                        </h2>


                        <p
                            className="
                                mt-1
                                max-w-2xl
                                text-[10px]
                                leading-5
                                text-slate-500
                            "
                        >
                            These training areas determine which
                            programmes you are allowed to create and
                            manage.
                        </p>

                    </div>

                </div>


                <span
                    className="
                        w-fit
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-[9px]
                        font-semibold
                        text-blue-700
                    "
                >
                    {assignedAreas.length}{" "}
                    {assignedAreas.length ===
                        1
                        ? "Area"
                        : "Areas"}
                </span>

            </div>


            {/* ================================================= */}
            {/* CARDS */}
            {/* ================================================= */}

            <div className="p-4 sm:p-5">

                <div
                    className={`
                        grid
                        gap-5

                        ${assignedAreas.length >
                            1
                            ? "md:grid-cols-2"
                            : "grid-cols-1"
                        }
                    `}
                >

                    {assignedAreas.map(
                        (
                            area
                        ) => (
                            <TrainingAreaCard
                                key={
                                    area.id
                                }
                                area={
                                    area
                                }
                            />
                        )
                    )}

                </div>

            </div>

        </section>
    );
}


export default TrainerModuleCard;