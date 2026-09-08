import DashboardLayout from "../../components/dashboard/DashboardLayout";

import LearningSectionManager from "../../components/training/LearningSectionManager";


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


function TrainingProgrammeSectionsPage() {
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

            title="Learning Sections"

            subtitle="Manage the learning content inside the training programme."

            user={
                user
            }
        >

            <div className="p-5 lg:p-6">

                <LearningSectionManager
                    role={
                        role
                    }
                />

            </div>

        </DashboardLayout>
    );
}


export default TrainingProgrammeSectionsPage;