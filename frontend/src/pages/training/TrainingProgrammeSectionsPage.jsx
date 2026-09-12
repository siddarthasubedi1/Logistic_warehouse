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