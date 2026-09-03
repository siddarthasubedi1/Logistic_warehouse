import DashboardLayout from "../../components/dashboard/DashboardLayout";
import CreateUserForm from "../../components/admin/CreateUserForm";

function CreateUserPage() {
    return (
        <DashboardLayout
            role="admin"
            title="Create User"
            subtitle="Add Trainer or Trainee information and generate secure login credentials."
        >
            <CreateUserForm />
        </DashboardLayout>
    );
}

export default CreateUserPage;