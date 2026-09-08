import DashboardLayout from "../../components/dashboard/DashboardLayout";

import LearningSectionManager from "../../components/training/LearningSectionManager";


function TrainerProgrammeSectionsPage() {
    return (
        <DashboardLayout
            role="trainer"

            title="Learning Sections"

            subtitle="Manage the learning content for your training programme."
        >

            <div className="p-5 lg:p-6">

                <LearningSectionManager
                    role="trainer"
                />

            </div>

        </DashboardLayout>
    );
}


export default TrainerProgrammeSectionsPage;