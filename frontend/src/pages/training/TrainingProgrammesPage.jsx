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