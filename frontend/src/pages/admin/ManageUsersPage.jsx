import DashboardLayout from "../../components/dashboard/DashboardLayout";
import ManageUsersTable from "../../components/admin/ManageUsersTable";

function ManageUsersPage() {
    return (
        <DashboardLayout
            role="admin"
            title="Manage Users"
            subtitle="View and manage Trainer and Trainee access."
        >
            <ManageUsersTable />
        </DashboardLayout>
    );
}

export default ManageUsersPage;