import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";

// The old standalone Sprint 2 exercise page duplicated scenario/assessment
// behaviour. Keep the route for backwards compatibility, but send trainees to
// the single interactive 360° flow so all modules use the same rules.
export default function TraineeExercisePage() {
    const { programmeId } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (programmeId) navigate(`/my-training/${programmeId}/environment`, { replace: true });
    }, [programmeId, navigate]);

    return <DashboardLayout role="trainee" title="Opening Training" subtitle="Loading your interactive training environment…">
        <div style={{ padding: 24 }}>Opening the 360° training environment…</div>
    </DashboardLayout>;
}
