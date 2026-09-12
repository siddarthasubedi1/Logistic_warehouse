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
        location.state
            ?.selectedUserId ||
        null;


    const passwordResetRequest =
        location.state
            ?.passwordResetRequest ||
        null;


    return (
        <DashboardLayout
            role="admin"
            title="Manage Users"
            subtitle="View and manage Trainer and Trainee accounts."
        >
            <div
                className="
                    space-y-4
                "
            >
                <TrainerAssignmentsPanel />


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