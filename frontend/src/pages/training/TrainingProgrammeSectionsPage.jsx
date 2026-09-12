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
        user?.role ||
        "";


    // ======================================================
    // DESCRIPTION
    // ======================================================

    const description =
        role ===
            "admin"
            ? "Create, edit, reorder, activate and deactivate learning sections."
            : "Manage learning content for programmes you are authorised to work with.";


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
        </DashboardLayout>
    );
}


export default TrainingProgrammeSectionsPage;