import { useLocation } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ManageUsersTable from "../../components/admin/ManageUsersTable";


function ManageUsersPage() {
    const location =
        useLocation();


    // ======================================================
    // PASSWORD RESET NAVIGATION DATA
    // ======================================================

    const selectedUserId =
        location.state
            ?.selectedUserId ||
        null;


    const passwordResetRequest =
        location.state
            ?.passwordResetRequest ||
        null;


    // ======================================================
    // UI
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            title="Manage Users"
            subtitle="View and manage Trainer and Trainee access."
        >

            <ManageUsersTable
                selectedUserId={
                    selectedUserId
                }
                passwordResetRequest={
                    passwordResetRequest
                }
            />

        </DashboardLayout>
    );
}


export default ManageUsersPage;