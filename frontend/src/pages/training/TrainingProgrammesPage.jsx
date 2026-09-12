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
    // PAGE DESCRIPTION
    // ======================================================

    const description =
        role ===
            "admin"
            ? "Create and manage workplace safety training programmes."
            : "Create and manage training programmes available to your Trainer account.";


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