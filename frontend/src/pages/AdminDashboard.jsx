import {
    useEffect,
    useState,
} from "react";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import AdminUsersOverview from "../components/admin/AdminUsersOverview";

import api from "../services/api";


function AdminDashboard() {
    const [users, setUsers] =
        useState([]);

    const [pendingUsers, setPendingUsers] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    const storedUser =
        sessionStorage.getItem("user");

    let user = null;

    try {
        user = storedUser
            ? JSON.parse(storedUser)
            : null;
    } catch {
        user = null;
    }


    useEffect(() => {
        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError("");


                const [
                    usersResponse,
                    pendingResponse,
                ] = await Promise.all([
                    api.get("/admin/users"),
                    api.get("/admin/pending-users"),
                ]);


                const usersData =
                    Array.isArray(usersResponse.data)
                        ? usersResponse.data
                        : usersResponse.data?.users || [];


                const pendingData =
                    Array.isArray(pendingResponse.data)
                        ? pendingResponse.data
                        : pendingResponse.data?.users ||
                        pendingResponse.data?.pendingUsers ||
                        [];


                setUsers(usersData);
                setPendingUsers(pendingData);

            } catch (error) {
                console.error(
                    "Admin dashboard error:",
                    error
                );


                setError(
                    error.response?.data?.message ||
                    "Unable to load dashboard information."
                );

            } finally {
                setLoading(false);
            }
        };


        loadDashboardData();

    }, []);


    const activeUsers =
        users.filter(
            (currentUser) =>
                currentUser.status === "active"
        ).length;


    const deactivatedUsers =
        users.filter(
            (currentUser) =>
                currentUser.status === "deactivated"
        ).length;


    const trainers =
        users.filter(
            (currentUser) =>
                currentUser.role === "trainer"
        ).length;


    const trainees =
        users.filter(
            (currentUser) =>
                currentUser.role === "trainee"
        ).length;


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <div className="min-h-screen bg-[#f6f8fb]">

                <AdminHeader user={user} />


                <main className="px-5 py-5 lg:px-7">

                    {error && (
                        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs text-red-600">
                            {error}
                        </div>
                    )}


                    <AdminStats
                        loading={loading}
                        totalUsers={users.length}
                        activeUsers={activeUsers}
                        pendingUsers={pendingUsers.length}
                        deactivatedUsers={deactivatedUsers}
                    />


                    <div className="mt-4 grid gap-4 xl:grid-cols-[1.35fr_.65fr]">

                        <AdminUsersOverview
                            loading={loading}
                            users={users}
                            trainers={trainers}
                            trainees={trainees}
                        />


                        <AdminQuickActions
                            pendingCount={pendingUsers.length}
                        />

                    </div>

                </main>

            </div>
        </DashboardLayout>
    );
}


export default AdminDashboard;