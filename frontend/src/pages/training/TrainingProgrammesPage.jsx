import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingManagementShell from "../../components/training/TrainingManagementShell";
import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";

import {
    getSessionUser,
} from "../../utils/session";


function TrainingProgrammesPage() {

    // ======================================================
    // CURRENT USER
    // ======================================================

    const user =
        getSessionUser();


    const role =
        user?.role ||
        "";


    // ======================================================
    // ROLE CHECK
    // ======================================================

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
        "Manage workplace safety training programmes.";


    if (isAdmin) {
        description =
            "Create and manage training programmes, assign programme owners, and authorize Trainers.";
    }


    if (isTrainer) {
        description =
            "Create and manage the training programmes that you are authorized to work with.";
    }


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role={
                role
            }
            showHeader={false}
        >
            <TrainingManagementShell
                title="Training Programmes"
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
        </DashboardLayout>
    );
}


export default TrainingProgrammesPage;