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
        id: "manual-handling",
        title: "Manual Handling",
        description:
            "Manage Manual Handling training programmes and learning sections.",
        image: boxLift,
    },

    "working-at-height": {
        id: "working-at-height",
        title: "Working at Height",
        description:
            "Manage Working at Height training programmes and learning sections.",
        image: heightImage,
    },
};


// ======================================================
// TRAINER MODULE CARD
// ======================================================

function TrainerModuleCard({
    user = null,
    assignedTrainingSections = null,
}) {
    const navigate =
        useNavigate();


    // ======================================================
    // ASSIGNMENTS
    // ======================================================

    const sections =
        Array.isArray(
            assignedTrainingSections
        )
            ? assignedTrainingSections
            : Array.isArray(
                user?.assignedTrainingSections
            )
                ? user.assignedTrainingSections
                : [];


    const availableAreas =
        sections
            .map(
                (
                    sectionId
                ) =>
                    TRAINING_AREAS[
                    sectionId
                    ]
            )
            .filter(Boolean);


    // ======================================================
    // EMPTY
    // ======================================================

    if (
        availableAreas.length ===
        0
    ) {
        return (
            <section
                className="
                    rounded-xl
                    border
                    border-amber-200
                    bg-white
                    p-5
                    shadow-sm
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
                            rounded-lg
                            bg-amber-50
                            text-amber-600
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
                                text-[11px]
                                font-semibold
                                text-slate-800
                            "
                        >
                            No Training Area Assigned
                        </h2>


                        <p
                            className="
                                mt-1
                                text-[8px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Your Trainer account does not currently have a training area assigned.
                        </p>
                    </div>
                </div>
            </section>
        );
    }


    // ======================================================
    // OPEN PROGRAMMES
    // ======================================================

    const handleOpenProgrammes =
        () => {
            navigate(
                "/training-programmes"
            );
        };


    // ======================================================
    // UI
    // ======================================================

    return (
        <section
            className="
                grid
                gap-4
                md:grid-cols-2
            "
        >
            {availableAreas.map(
                (
                    area
                ) => (
                    <article
                        key={
                            area.id
                        }
                        className="
                            overflow-hidden
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            shadow-sm
                        "
                    >
                        {/* IMAGE */}

                        <div
                            className="
                                h-40
                                overflow-hidden
                                bg-slate-100
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
                                "
                            />
                        </div>


                        {/* CONTENT */}

                        <div
                            className="
                                p-4
                                sm:p-5
                            "
                        >
                            <span
                                className="
                                    inline-flex
                                    rounded-full
                                    bg-blue-50
                                    px-2.5
                                    py-1
                                    text-[7px]
                                    font-medium
                                    text-blue-600
                                "
                            >
                                TRAINING AREA
                            </span>


                            <h2
                                className="
                                    mt-3
                                    text-[13px]
                                    font-semibold
                                    text-slate-800
                                "
                            >
                                {area.title}
                            </h2>


                            <p
                                className="
                                    mt-2
                                    text-[8px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                {area.description}
                            </p>


                            <button
                                type="button"
                                onClick={
                                    handleOpenProgrammes
                                }
                                className="
                                    mt-4
                                    inline-flex
                                    min-h-[38px]
                                    w-full
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-blue-600
                                    px-4
                                    py-2
                                    text-[9px]
                                    font-medium
                                    text-white
                                    transition
                                    hover:bg-blue-700
                                    sm:w-auto
                                "
                            >
                                Manage Programmes
                            </button>
                        </div>
                    </article>
                )
            )}
        </section>
    );
}


export default TrainerModuleCard;