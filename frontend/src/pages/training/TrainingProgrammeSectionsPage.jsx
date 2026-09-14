import DashboardLayout from "../../components/dashboard/DashboardLayout";
import LearningSectionManager from "../../components/training/LearningSectionManager";

import {
    getSessionUser,
} from "../../utils/session";


function TrainingProgrammeSectionsPage() {
    const user =
        getSessionUser();


    const role =
        String(
            user?.role ||
            ""
        )
            .trim()
            .toLowerCase();


    return (
        <DashboardLayout
            role={
                role
            }
            showHeader={
                false
            }
        >
            <div
                className="
                    app-page
                    space-y-5
                "
            >
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