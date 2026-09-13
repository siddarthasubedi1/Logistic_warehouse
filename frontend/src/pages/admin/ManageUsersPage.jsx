import {
    useLocation,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ManageUsersTable from "../../components/admin/ManageUsersTable";
import TrainerAssignmentsPanel from "../../components/admin/TrainerAssignmentsPanel";


function ManageUsersPage() {
    const location =
        useLocation();


    const selectedUserId =
        location.state?.selectedUserId ||
        null;


    const passwordResetRequest =
        location.state?.passwordResetRequest ||
        null;


    return (
        <DashboardLayout
            role="admin"
            title="Manage Users"
            subtitle="View and manage Trainer and Trainee access."
        >
            <div className="admin-manage-users">

                <div className="space-y-5">

                    {/* ======================================
                        TRAINING ASSIGNMENT
                    ======================================= */}

                    <TrainerAssignmentsPanel />


                    {/* ======================================
                        USER TABLE
                    ======================================= */}

                    <ManageUsersTable
                        selectedUserId={
                            selectedUserId
                        }
                        passwordResetRequest={
                            passwordResetRequest
                        }
                    />

                </div>

            </div>
        </DashboardLayout>
    );
}


export default ManageUsersPage;