import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingManagementShell from "../../components/training/TrainingManagementShell";
import LearningSectionManager from "../../components/training/LearningSectionManager";

import {
    getSessionUser,
} from "../../utils/session";


function TrainingProgrammeSectionsPage() {

    // ======================================================
    // CURRENT USER
    // ======================================================

    const user =
        getSessionUser();


    const role =
        user?.role || "";


    // ======================================================
    // ROLE CHECK
    // ======================================================

    const isAdmin =
        role === "admin";


    const isTrainer =
        role === "trainer";


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


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role={role}
            showHeader={false}
        >
            <TrainingManagementShell
                title="Programme Learning Sections"
                description={description}
            >
                <LearningSectionManager
                    role={role}
                />
            </TrainingManagementShell>
        </DashboardLayout>
    );
}


export default TrainingProgrammeSectionsPage;