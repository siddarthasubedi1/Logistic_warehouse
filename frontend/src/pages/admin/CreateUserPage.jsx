import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CreateUserForm from "../../components/admin/CreateUserForm";

function CreateUserPage() {
    return (
        <DashboardLayout
            role="admin"
            title="Create User"
            subtitle="Generate secure accounts for pending Trainers and Trainees."
        >
            <CreateUserForm />
        </DashboardLayout>
    );
}

export default CreateUserPage;