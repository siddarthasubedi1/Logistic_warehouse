import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";


function TrainingProgrammesPage() {
    return (
        <DashboardLayout
            role="admin"

            title="Training Programmes"

            subtitle="Create and manage workplace safety training programmes."
        >

            <div className="p-5 lg:p-6">

                <TrainingProgrammeManager
                    role="admin"
                />

            </div>

        </DashboardLayout>
    );
}


export default TrainingProgrammesPage;