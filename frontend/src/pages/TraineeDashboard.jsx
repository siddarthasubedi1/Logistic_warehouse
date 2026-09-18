import DashboardLayout from "../components/dashboard/DashboardLayout";
import Trainee360Environment from "./trainee/Trainee360Environment";

export default function TraineeDashboard() {
    return <DashboardLayout role="trainee" showHeader={false}><Trainee360Environment embedded /></DashboardLayout>;
}
