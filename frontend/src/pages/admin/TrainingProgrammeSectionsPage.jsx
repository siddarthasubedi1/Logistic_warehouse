import DashboardLayout from "../../components/dashboard/DashboardLayout";

import LearningSectionManager from "../../components/training/LearningSectionManager";


function TrainingProgrammeSectionsPage() {
    return (
        <DashboardLayout
            role="admin"

            title="Learning Sections"

            subtitle="Manage the learning content inside a training programme."
        >

            <div className="p-5 lg:p-6">

                <LearningSectionManager
                    role="admin"
                />

            </div>

        </DashboardLayout>
    );
}


export default TrainingProgrammeSectionsPage;