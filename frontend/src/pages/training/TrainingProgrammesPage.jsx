import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";

import {
    getSessionUser,
} from "../../utils/session";


function TrainingProgrammesPage() {
    const user =
        getSessionUser();

    const role =
        String(
            user?.role ||
            ""
        ).toLowerCase();


    const isAdmin =
        role ===
        "admin";


    const description =
        isAdmin
            ? "Create, manage and control workplace safety training programmes."
            : "Manage programmes available to your assigned safety training area.";


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
                    app-page
                    space-y-5
                "
            >
                {/* =============================================
                    HERO
                ============================================== */}

                <section
                    className="
                        training-hero
                        relative
                        overflow-hidden
                        rounded-xl
                        px-5
                        py-6
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
                            -top-20
                            h-52
                            w-52
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
                                    className="
                                        h-6
                                        w-6
                                    "
                                >
                                    <rect
                                        x="4"
                                        y="4"
                                        width="6"
                                        height="16"
                                        rx="1"
                                    />

                                    <rect
                                        x="14"
                                        y="4"
                                        width="6"
                                        height="16"
                                        rx="1"
                                    />
                                </svg>
                            </div>


                            <div>
                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-blue-100
                                    "
                                >
                                    Workplace Safety
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-[20px]
                                        font-bold
                                        text-white
                                    "
                                >
                                    Training Programmes
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-[600px]
                                        text-[9px]
                                        leading-5
                                        text-blue-100
                                    "
                                >
                                    {description}
                                </p>
                            </div>
                        </div>


                        <div
                            className="
                                rounded-lg
                                border
                                border-white/15
                                bg-white/10
                                px-4
                                py-3
                            "
                        >
                            <p
                                className="
                                    text-[7px]
                                    font-semibold
                                    uppercase
                                    tracking-wide
                                    text-blue-100
                                "
                            >
                                Current Role
                            </p>

                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-bold
                                    capitalize
                                    text-white
                                "
                            >
                                {role ||
                                    "User"}
                            </p>
                        </div>
                    </div>
                </section>


                {/* =============================================
                    INFORMATION
                ============================================== */}

                <section
                    className="
                        grid
                        gap-4
                        md:grid-cols-2
                    "
                >
                    <InfoCard
                        title="Manual Handling"
                        text="Create and manage safe lifting, carrying and handling training content."
                    />

                    <InfoCard
                        title="Working at Height"
                        text="Manage learning content covering elevated work and height-related hazards."
                    />
                </section>


                {/* =============================================
                    EXISTING MANAGER
                ============================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-sm
                    "
                >
                    <TrainingProgrammeManager />
                </section>
            </div>
        </DashboardLayout>
    );
}


function InfoCard({
    title,
    text,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-[#dbe4ef]
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
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="
                            h-4
                            w-4
                        "
                    >
                        <path d="M4 5h16v14H4z" />
                        <path d="M8 9h8" />
                        <path d="M8 13h5" />
                    </svg>
                </div>


                <div>
                    <h2
                        className="
                            text-[11px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        {title}
                    </h2>

                    <p
                        className="
                            mt-1
                            text-[8px]
                            leading-4
                            text-[#64748b]
                        "
                    >
                        {text}
                    </p>
                </div>
            </div>
        </article>
    );
}


export default TrainingProgrammesPage;