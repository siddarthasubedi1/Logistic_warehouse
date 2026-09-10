import ProfileHeaderButton from "../account/ProfileHeaderButton";


function TrainerHeader({
    user,
}) {
    // ======================================================
    // USER
    // ======================================================

    const firstName =
        user?.firstName ||
        "Trainer";


    const assignedTrainingSections =
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    // ======================================================
    // HEADER
    // ======================================================

    return (
        <header
            className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-blue-200
                bg-gradient-to-r
                from-[#073763]
                via-[#0b4f87]
                to-[#1769aa]
                px-5
                py-5
                text-white
                shadow-sm
                sm:px-6
                lg:px-7
            "
        >

            {/* DECORATION */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-16
                    -top-16
                    h-48
                    w-48
                    rounded-full
                    bg-white/10
                "
            />


            <div
                className="
                    pointer-events-none
                    absolute
                    right-28
                    top-6
                    hidden
                    h-28
                    w-28
                    rotate-12
                    rounded-2xl
                    border
                    border-white/10
                    lg:block
                "
            />


            <div
                className="
                    relative
                    z-10
                    flex
                    flex-col
                    gap-5
                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >

                {/* ================================================= */}
                {/* LEFT */}
                {/* ================================================= */}

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
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/15
                            bg-white/10
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            className="h-6 w-6"
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


                    <div>

                        <p
                            className="
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.18em]
                                text-blue-100
                            "
                        >
                            Workplace Safety Training
                        </p>


                        <h1
                            className="
                                mt-1
                                text-xl
                                font-bold
                                sm:text-2xl
                            "
                        >
                            Trainer Dashboard
                        </h1>


                        <p
                            className="
                                mt-2
                                max-w-2xl
                                text-[11px]
                                leading-5
                                text-blue-100
                            "
                        >
                            Welcome back,{" "}

                            <span
                                className="
                                    font-bold
                                    text-white
                                "
                            >
                                Trainer {firstName}
                            </span>
                            . Manage your assigned safety training areas
                            and programmes.
                        </p>


                        <div
                            className="
                                mt-3
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                "
                            >
                                {assignedTrainingSections.length}{" "}
                                {assignedTrainingSections.length ===
                                    1
                                    ? "Assigned Area"
                                    : "Assigned Areas"}
                            </span>


                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                "
                            >
                                Trainer Workspace
                            </span>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* RIGHT */}
                {/* ================================================= */}

                <div
                    className="
                        flex
                        items-center
                        gap-3
                        self-end
                        sm:self-auto
                    "
                >

                    {/* NOTIFICATION */}

                    <button
                        type="button"
                        aria-label="Notifications"
                        className="
                            relative
                            flex
                            h-10
                            w-10
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-white/15
                            bg-white/10
                            text-white
                            transition
                            hover:bg-white/20
                        "
                    >

                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.7"
                            className="h-5 w-5"
                        >
                            <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

                            <path d="M10 21h4" />
                        </svg>


                        <span
                            className="
                                absolute
                                -right-1
                                -top-1
                                flex
                                h-4
                                min-w-4
                                items-center
                                justify-center
                                rounded-full
                                bg-red-500
                                px-1
                                text-[8px]
                                font-bold
                                text-white
                                ring-2
                                ring-[#0b4f87]
                            "
                        >
                            3
                        </span>

                    </button>


                    <div
                        className="
                            hidden
                            h-8
                            w-px
                            bg-white/20
                            sm:block
                        "
                    />


                    <div
                        className="
                            rounded-xl
                            border
                            border-white/15
                            bg-white
                            px-2
                            py-1
                            text-slate-700
                            shadow-sm
                        "
                    >

                        <ProfileHeaderButton
                            user={
                                user
                            }
                            role="trainer"
                        />

                    </div>

                </div>

            </div>

        </header>
    );
}


export default TrainerHeader;