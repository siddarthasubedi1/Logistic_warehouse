import {
    useLocation,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import ManageUsersTable from "../../components/admin/ManageUsersTable";

import TrainerAssignmentsPanel from "../../components/admin/TrainerAssignmentsPanel";


function ManageUsersPage() {
    const location =
        useLocation();


    // ======================================================
    // PASSWORD RESET NAVIGATION
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

            <div className="space-y-6">

                {/* TRAINER ASSIGNMENTS */}

                <TrainerAssignmentsPanel />


                {/* USER MANAGEMENT */}

                <ManageUsersTable
                    selectedUserId={
                        selectedUserId
                    }
                    passwordResetRequest={
                        passwordResetRequest
                    }
                />

            </div>

        </DashboardLayout>
    );
}


export default ManageUsersPage;