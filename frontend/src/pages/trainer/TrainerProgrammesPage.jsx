import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";


function TrainerProgrammesPage() {
    return (
        <DashboardLayout
            role="trainer"

            title="Training Programmes"

            subtitle="Create and manage the training programmes available to your Trainer account."
        >

            <div className="p-5 lg:p-6">

                <TrainingProgrammeManager
                    role="trainer"
                />

            </div>

        </DashboardLayout>
    );
}


export default TrainerProgrammesPage;