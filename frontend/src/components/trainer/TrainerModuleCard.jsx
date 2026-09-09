import {
    useNavigate,
} from "react-router-dom";

import boxLift from "../../images/box-lift.jpg";
import heightImage from "../../images/hight.jpg";


// ======================================================
// TRAINING AREAS
// ======================================================
//
// assignedTrainingSections defines which broad training
// areas the Trainer is allowed to work with.
//
// Actual Sprint 2 programme management happens through:
//
// /training-programmes
//
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
    },
};


// ======================================================
// EMPTY ASSIGNMENT
// ======================================================

function EmptyAssignment() {
    return (
        <section
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
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
                        bg-amber-50
                        text-amber-600
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
                            text-xs
                            leading-5
                            text-slate-500
                        "
                    >
                        You do not currently have permission to manage
                        a training area. Please contact the Administrator.
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


    // ==================================================
    // OPEN PROGRAMME MANAGEMENT
    // ==================================================
    //
    // Trainer and Admin intentionally use the same
    // Sprint 2 route.
    //
    // Backend authorization decides which programmes
    // the Trainer can see/manage.
    //
    // ==================================================

    const handleOpenProgrammes =
        () => {
            navigate(
                "/training-programmes"
            );
        };


    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
                transition
                hover:border-blue-300
                hover:shadow-md
            "
        >

            {/* ================================================= */}
            {/* IMAGE */}
            {/* ================================================= */}

            <img
                src={
                    area.image
                }
                alt={
                    area.title
                }
                className="
                    h-36
                    w-full
                    rounded-lg
                    object-cover
                "
            />


            {/* ================================================= */}
            {/* CONTENT */}
            {/* ================================================= */}

            <div className="mt-4">

                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-3
                    "
                >

                    <div>

                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-wide
                                text-blue-600
                            "
                        >
                            Assigned Training Area
                        </p>


                        <h2
                            className="
                                mt-1
                                text-sm
                                font-bold
                                text-slate-900
                            "
                        >
                            {area.title}
                        </h2>

                    </div>


                    <span
                        className="
                            rounded-full
                            bg-emerald-50
                            px-2.5
                            py-1
                            text-[9px]
                            font-semibold
                            text-emerald-700
                        "
                    >
                        Assigned
                    </span>

                </div>


                <p
                    className="
                        mt-3
                        text-xs
                        leading-5
                        text-slate-500
                    "
                >
                    {area.description}
                </p>


                {/* ================================================= */}
                {/* ACTION */}
                {/* ================================================= */}

                <button
                    type="button"
                    onClick={
                        handleOpenProgrammes
                    }
                    className="
                        mt-4
                        w-full
                        rounded-lg
                        bg-blue-600
                        px-4
                        py-2.5
                        text-xs
                        font-semibold
                        text-white
                        transition
                        hover:bg-blue-700
                    "
                >
                    Manage Training Programmes
                </button>

            </div>

        </article>
    );
}


// ======================================================
// TRAINER MODULE CARD
// ======================================================

function TrainerModuleCard({
    assignedTrainingSections = [],
}) {

    // ==================================================
    // GET ASSIGNED AREAS
    // ==================================================

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


    // ==================================================
    // EMPTY
    // ==================================================

    if (
        assignedAreas.length ===
        0
    ) {
        return (
            <EmptyAssignment />
        );
    }


    // ==================================================
    // UI
    // ==================================================

    return (
        <section
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-5
                shadow-sm
            "
        >

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div
                className="
                    mb-5
                    flex
                    flex-wrap
                    items-center
                    justify-between
                    gap-3
                "
            >

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
                            text-xs
                            text-slate-500
                        "
                    >
                        These training areas determine which programmes
                        you are allowed to create and manage.
                    </p>

                </div>


                <span
                    className="
                        rounded-full
                        bg-blue-50
                        px-3
                        py-1.5
                        text-[10px]
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

            <div
                className={`
                    grid
                    gap-4

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

        </section>
    );
}


export default TrainerModuleCard;