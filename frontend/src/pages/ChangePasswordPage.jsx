import DashboardLayout from "../components/dashboard/DashboardLayout";
import ChangePasswordForm from "../components/account/ChangePasswordForm";

function ChangePasswordPage({
    role,
}) {
    return (
        <DashboardLayout
            role={role}
            title="Change Password"
            subtitle="Update your account password securely."
        >
            <ChangePasswordForm />
        </DashboardLayout>
    );
}

export default ChangePasswordPage;