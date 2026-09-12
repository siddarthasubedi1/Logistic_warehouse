import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingManagementShell from "../../components/training/TrainingManagementShell";
import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";

import {
    getSessionUser,
} from "../../utils/session";


function TrainingProgrammesPage() {
    const user =
        getSessionUser();

    const role =
        user?.role ||
        "";


    const description =
        role ===
            "admin"
            ? "Create, manage and control workplace safety training programmes."
            : "Create and manage programmes available to your assigned training area.";


    return (
        <DashboardLayout
            role={
                role
            }
            showHeader={
                false
            }
        >

            <div
                className="
                    space-y-5
                "
            >

                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section
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
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >

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
                            right-20
                            top-8
                            hidden
                            h-24
                            w-24
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
                                    <path d="M4 5h6v14H4z" />

                                    <path d="M14 5h6v14h-6z" />

                                    <path d="M10 8h4" />

                                    <path d="M10 16h4" />
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
                                    Workplace Safety
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    Training Programmes
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                        sm:text-xs
                                    "
                                >
                                    {description}
                                </p>

                            </div>

                        </div>


                        <div
                            className="
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
                                Manual Handling
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
                                Working at Height
                            </span>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* INFORMATION CARDS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-3
                    "
                >

                    <TrainingInfoCard
                        icon="programme"
                        title="Programme Management"
                        description="Create and maintain structured safety programmes."
                    />


                    <TrainingInfoCard
                        icon="trainer"
                        title="Trainer Ownership"
                        description="Control ownership and authorised Trainer access."
                    />


                    <TrainingInfoCard
                        icon="learning"
                        title="Learning Content"
                        description="Organise programmes into structured learning sections."
                    />

                </section>


                {/* ================================================= */}
                {/* EXISTING PROGRAMME MANAGEMENT */}
                {/* ================================================= */}

                <TrainingManagementShell
                    title="Programme Management"
                    description={
                        description
                    }
                >

                    <TrainingProgrammeManager
                        role={
                            role
                        }
                    />

                </TrainingManagementShell>


                {/* ================================================= */}
                {/* FOOTER NOTE */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-amber-50
                        p-5
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
                                bg-white
                                text-blue-600
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
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>

                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Programme Security
                            </p>


                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Administrator access applies across all
                                programmes, while Trainer access remains
                                restricted by ownership and authorisation.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// INFORMATION CARD
// ======================================================

function TrainingInfoCard({
    icon,
    title,
    description,
}) {
    return (
        <div
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
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
                        rounded-xl
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <TrainingInfoIcon
                        type={
                            icon
                        }
                    />
                </div>


                <div>

                    <p
                        className="
                            text-[11px]
                            font-bold
                            text-slate-800
                        "
                    >
                        {title}
                    </p>


                    <p
                        className="
                            mt-1
                            text-[9px]
                            leading-4
                            text-slate-500
                        "
                    >
                        {description}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// INFORMATION ICON
// ======================================================

function TrainingInfoIcon({
    type,
}) {

    if (
        type ===
        "trainer"
    ) {
        return (
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

                <path d="M16 8l2 2 3-4" />
            </svg>
        );
    }


    if (
        type ===
        "learning"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-5 w-5"
            >
                <path d="M4 5h7v14H4z" />

                <path d="M13 5h7v14h-7z" />

                <path d="M7 9h2" />

                <path d="M16 9h2" />
            </svg>
        );
    }


    return (
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
    );
}


export default TrainingProgrammesPage;