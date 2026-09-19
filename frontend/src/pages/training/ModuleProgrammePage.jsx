import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import TrainingProgrammeManager from "../../components/training/TrainingProgrammeManager";
import { getSessionUser } from "../../utils/session";
import { loadModuleById } from "../../utils/moduleStorage";
import { moduleKey } from "../../utils/trainingModules";
export default function ModuleProgrammePage() {
    const navigate = useNavigate(), { moduleId } = useParams(), user = getSessionUser();
    const role = String(user?.role || "").toLowerCase(); const [module, setModule] = useState(null); const [error, setError] = useState("");
    useEffect(() => { let active = true; loadModuleById(moduleId).then(m => { if (active) setModule(m) }).catch(e => { if (active) setError(e.response?.data?.message || "Unable to load module.") }); return () => { active = false }; }, [moduleId]);
    if (error) return <DashboardLayout role={role} showHeader={false}><div className="rounded-xl bg-white p-6 text-red-600">{error}<button onClick={() => navigate("/training-programmes")} className="ml-4 underline">Back</button></div></DashboardLayout>;
    if (!module) return null;
    const programmeType = module.key || moduleKey(module);
    return <DashboardLayout role={role} showHeader={false}><div className="space-y-5"><section className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#073763] to-[#1769aa] p-7 text-white shadow-sm"><div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"><div><p className="text-[9px] font-semibold uppercase tracking-[0.15em] text-blue-100">Programme Management</p><h1 className="mt-2 text-2xl font-bold">{module.name}</h1><p className="mt-2 max-w-2xl text-sm text-blue-100">Create and manage programmes, Trainer access, pass marks and learning content for this module.</p></div><button type="button" onClick={() => navigate("/training-programmes")} className="rounded-xl bg-white px-5 py-3 text-sm font-semibold text-[#073763] shadow-sm hover:bg-blue-50">Back to Modules</button></div></section><TrainingProgrammeManager role={role} lockedProgrammeType={programmeType} /></div></DashboardLayout>;
}
