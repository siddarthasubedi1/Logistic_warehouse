import DashboardLayout from "../components/dashboard/DashboardLayout";

import TrainerHeader from "../components/trainer/TrainerHeader";
import TrainerModuleCard from "../components/trainer/TrainerModuleCard";
import TrainerStats from "../components/trainer/TrainerStats";
import TrainerTaskOverview from "../components/trainer/TrainerTaskOverview";
import TrainerScores from "../components/trainer/TrainerScores";
import TrainerProgressOverview from "../components/trainer/TrainerProgressOverview";
import TrainerRecentActivity from "../components/trainer/TrainerRecentActivity";


function TrainerDashboard() {
    const storedUser = sessionStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        user = null;
    }


    return (
        <DashboardLayout
            role="trainer"
            showHeader={false}
        >
            <div className="min-h-screen bg-[#f6f8fb]">

                <TrainerHeader user={user} />


                <main className="space-y-4 px-5 py-4 lg:px-6">

                    {/* TOP */}

                    <div className="grid gap-4 xl:grid-cols-[1.15fr_2.2fr]">

                        <TrainerModuleCard />

                        <TrainerStats />

                    </div>


                    {/* MIDDLE */}

                    <div className="grid gap-4 xl:grid-cols-2">

                        <TrainerTaskOverview />

                        <TrainerScores />

                    </div>


                    {/* BOTTOM */}

                    <div className="grid gap-4 xl:grid-cols-2">

                        <TrainerProgressOverview />

                        <TrainerRecentActivity />

                    </div>


                    <footer className="flex items-center justify-between border-t border-slate-200 pt-4 text-[9px] text-slate-400">

                        <span>
                            © 2026 UK LogiWare. All rights reserved.
                        </span>

                        <span>
                            Version 1.0.0
                        </span>

                    </footer>

                </main>

            </div>
        </DashboardLayout>
    );
}


export default TrainerDashboard;