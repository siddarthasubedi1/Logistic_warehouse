import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";


function getStoredUser() {
    try {
        const storedUser =
            sessionStorage.getItem(
                "user"
            );


        return storedUser
            ? JSON.parse(
                storedUser
            )
            : null;

    } catch {
        return null;
    }
}


function TrainingProgrammesPage() {
    const user =
        getStoredUser();


    const role =
        user?.role ||
        "";


    return (
        <DashboardLayout
            role={
                role
            }

            title="Training Programmes"

            subtitle={
                role ===
                    "admin"
                    ? "Create and manage workplace safety training programmes."
                    : "Create and manage the training programmes available to you."
            }

            user={
                user
            }
        >

            <div className="p-5 lg:p-6">

                <TrainingProgrammeManager
                    role={
                        role
                    }
                />

            </div>

        </DashboardLayout>
    );
}


export default TrainingProgrammesPage;