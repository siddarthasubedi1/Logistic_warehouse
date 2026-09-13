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
        String(
            user?.role ||
            ""
        )
            .trim()
            .toLowerCase();


    const description =
        role ===
            "admin"
            ? "Create, edit, reorder, activate and deactivate programme learning content."
            : "Manage learning content for training programmes available to your Trainer account.";


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
                {/* HERO */}

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
                    "
                >
                    <div
                        className="
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
                                <path d="M4 5h16v14H4z" />
                                <path d="M8 9h8" />
                                <path d="M8 13h6" />
                                <path d="M8 17h4" />
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
                                Training Content
                            </p>


                            <h1
                                className="
                                    mt-1
                                    text-[20px]
                                    font-bold
                                    text-white
                                "
                            >
                                Learning Sections
                            </h1>


                            <p
                                className="
                                    mt-2
                                    max-w-[620px]
                                    text-[9px]
                                    leading-5
                                    text-blue-100
                                "
                            >
                                {description}
                            </p>
                        </div>
                    </div>
                </section>


                {/* MANAGER */}

                <TrainingManagementShell
                    title="Programme Learning Content"
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
            </div>
        </DashboardLayout>
    );
}


export default TrainingProgrammeSectionsPage;