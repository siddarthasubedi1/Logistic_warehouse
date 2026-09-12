import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingManagementShell from "../../components/training/TrainingManagementShell";
import LearningSectionManager from "../../components/training/LearningSectionManager";

import {
    getSessionUser,
} from "../../utils/session";


function TrainingProgrammeSectionsPage() {
    const user =
        getSessionUser();

    const role =
        user?.role ||
        "";


<<<<<<< HEAD
    const isAdmin =
        role ===
        "admin";


    const isTrainer =
        role ===
        "trainer";


    // ======================================================
    // PAGE DESCRIPTION
    // ======================================================

    let description =
        "Manage the learning sections for this training programme.";


    if (isAdmin) {
        description =
            "Create, edit, reorder, activate, and deactivate learning sections for this training programme.";
    }


    if (isTrainer) {
        description =
            "Manage learning content for training programmes that you own or are authorized to manage.";
    }
=======
    const description =
        role ===
            "admin"
            ? "Create, edit, reorder, activate and deactivate learning sections."
            : "Manage learning content for programmes you are authorised to work with.";


    return (
        <DashboardLayout
            role={
                role
            }
<<<<<<< HEAD
            showHeader={
                false
            }
        >

            <div className="space-y-5">

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
                                    <path d="M4 5h7v14H4z" />

                                    <path d="M13 5h7v14h-7z" />

                                    <path d="M7 9h2" />

                                    <path d="M7 13h2" />

                                    <path d="M16 9h2" />

                                    <path d="M16 13h2" />
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
                                    Learning Content
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    Programme Learning Sections
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
                                    {description}
                                </p>

                            </div>

                        </div>


                        <span
                            className="
                                w-fit
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
                            Structured Learning
                        </span>

                    </div>

                </section>


                {/* ================================================= */}
                {/* WORKFLOW */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        xl:grid-cols-4
                    "
                >

                    <SectionStep
                        number="01"
                        title="Add Section"
                        description="Create a learning topic."
                    />


                    <SectionStep
                        number="02"
                        title="Add Content"
                        description="Provide instructions and examples."
                    />


                    <SectionStep
                        number="03"
                        title="Arrange Order"
                        description="Move sections into learning order."
                    />


                    <SectionStep
                        number="04"
                        title="Publish"
                        description="Keep sections active when ready."
                    />

                </section>


                {/* ================================================= */}
                {/* EXISTING MANAGER */}
                {/* ================================================= */}

                <TrainingManagementShell
                    title="Learning Section Management"
                    description={
                        description
                    }
                >

                    <LearningSectionManager
                        role={
                            role
                        }
                    />

                </TrainingManagementShell>


                {/* ================================================= */}
                {/* LEARNING NOTE */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-emerald-100
                        bg-gradient-to-r
                        from-emerald-50
                        via-white
                        to-blue-50
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
                                text-emerald-600
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
                                Structured Safety Learning
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
                                Learning sections should remain short,
                                clear and ordered so Trainees can move
                                through safety content using a simple
                                Previous and Next learning flow.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

=======
            showHeader={false}
        >
            <TrainingManagementShell
                title="Learning Sections"
                description={
                    description
                }
            >
                <LearningSectionManager
                    role={
                        role
                    }
                />
            </TrainingManagementShell>
>>>>>>> sprint2
        </DashboardLayout >
    );
}


// ======================================================
// SECTION STEP
// ======================================================

function SectionStep({
    number,
    title,
    description,
}) {
    return (
        <div
            className="
                relative
                overflow-hidden
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >

            <span
                className="
                    absolute
                    right-3
                    top-1
                    text-3xl
                    font-black
                    text-slate-100
                "
            >
                {number}
            </span>


            <div className="relative">

                <div
                    className="
                        flex
                        h-7
                        w-7
                        items-center
                        justify-center
                        rounded-lg
                        bg-blue-50
                        text-[9px]
                        font-bold
                        text-blue-700
                    "
                >
                    {number}
                </div>


                <p
                    className="
                        mt-3
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
    );
}


export default TrainingProgrammeSectionsPage;