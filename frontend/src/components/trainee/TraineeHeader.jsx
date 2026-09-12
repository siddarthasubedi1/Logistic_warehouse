import ProfileHeaderButton from "../account/ProfileHeaderButton";


function TraineeHeader({
    user,
}) {
    // ======================================================
    // USER
    // ======================================================

    const firstName =
        user?.firstName ||
        "Trainee";


    const assignedSections =
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    // ======================================================
    // UI
    // ======================================================

    return (
        <header
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
                    gap-4
                    px-4
                    py-4
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                    sm:px-5
                "
            >
                {/* ================================================= */}
                {/* LEFT */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        min-w-0
                        items-start
                        gap-3
                    "
                >
                    <div
                        className="
                            flex
                            h-10
                            w-10
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
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
                            <circle
                                cx="9"
                                cy="8"
                                r="3"
                            />

                            <path d="M3 20c.5-4 2.5-6 6-6" />

                            <path d="M15 5h6v10h-6z" />

                            <path d="M17 9h2" />
                        </svg>
                    </div>


                    <div
                        className="
                            min-w-0
                        "
                    >
                        <p
                            className="
                                text-[7px]
                                font-medium
                                uppercase
                                tracking-wide
                                text-blue-600
                            "
                        >
                            Workplace Safety Training
                        </p>


                        <h1
                            className="
                                mt-1
                                text-[17px]
                                font-semibold
                                text-slate-800
                                sm:text-[19px]
                            "
                        >
                            Trainee Dashboard
                        </h1>


                        <p
                            className="
                                mt-1
                                text-[9px]
                                leading-5
                                text-slate-500
                            "
                        >
                            Welcome back,{" "}

                            <span
                                className="
                                    font-medium
                                    text-slate-700
                                "
                            >
                                {firstName}
                            </span>
                            .
                        </p>


                        {assignedSections.length >
                            0 && (
                                <div
                                    className="
                                    mt-2
                                    flex
                                    flex-wrap
                                    gap-2
                                "
                                >
                                    {assignedSections.map(
                                        (
                                            section
                                        ) => (
                                            <span
                                                key={
                                                    section
                                                }
                                                className="
                                                rounded-full
                                                bg-slate-100
                                                px-2.5
                                                py-1
                                                text-[7px]
                                                text-slate-500
                                            "
                                            >
                                                {formatTrainingSection(
                                                    section
                                                )}
                                            </span>
                                        )
                                    )}
                                </div>
                            )}
                    </div>
                </div>


                {/* ================================================= */}
                {/* RIGHT */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        shrink-0
                        items-center
                        justify-end
                        gap-2
                    "
                >
                    <ProfileHeaderButton
                        user={
                            user
                        }
                        role="trainee"
                    />
                </div>
            </div>
        </header>
    );
}


// ======================================================
// FORMAT TRAINING SECTION
// ======================================================

function formatTrainingSection(
    section
) {
    if (
        section ===
        "manual-handling"
    ) {
        return "Manual Handling";
    }


    if (
        section ===
        "working-at-height"
    ) {
        return "Working at Height";
    }


    return String(
        section ||
        ""
    )
        .replace(
            /-/g,
            " "
        )
        .replace(
            /\b\w/g,
            (
                character
            ) =>
                character.toUpperCase()
        );
}


export default TraineeHeader;