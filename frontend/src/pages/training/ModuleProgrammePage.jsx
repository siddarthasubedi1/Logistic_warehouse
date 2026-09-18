import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";

import { getSessionUser } from "../../utils/session";
import { getModuleById } from "../../utils/moduleStorage";
import { moduleKey } from "../../utils/trainingModules";

export default function ModuleProgrammePage() {
    const navigate = useNavigate();
    const { moduleId } = useParams();
    const user = getSessionUser();
    const role = String(user?.role || "").toLowerCase();
    const [module, setModule] = useState(null);

    useEffect(() => {
        const selectedModule = getModuleById(moduleId);
        if (!selectedModule) {
            navigate("/training-programmes", { replace: true });
            return;
        }
        setModule(selectedModule);
    }, [moduleId, navigate]);

    if (!module) return null;

    const programmeType = moduleKey(module);

    return (
        <DashboardLayout role={role} showHeader={false}>
            <div className="space-y-5">
                <section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#073763] to-[#1769aa] p-7 text-white shadow-sm">
                    <div className="pointer-events-none absolute -right-16 -top-20 h-52 w-52 rounded-full bg-white/10" />
                    <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                        <div>
                            <p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-100">Programme Management</p>
                            <h1 className="mt-2 text-2xl font-bold">{module.name}</h1>
                            <p className="mt-2 max-w-2xl text-sm text-blue-100">
                                Create and manage programmes, Trainer access, pass marks and learning content for this module.
                            </p>
                        </div>
                        <button type="button" onClick={() => navigate("/training-programmes")} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#073763] shadow-sm hover:bg-blue-50">
                            Back to Modules
                        </button>
                    </div>
                </section>

                <TrainingProgrammeManager role={role} lockedProgrammeType={programmeType} />
            </div>
        </DashboardLayout>
    );
}
