import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";

import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import AdminUsersOverview from "../components/admin/AdminUsersOverview";
import PasswordResetRequests from "../components/admin/PasswordResetRequests";

import FeedbackAlert from "../components/ui/FeedbackAlert";

import api from "../services/api";

import {
    getSessionUser,
} from "../utils/session";


function AdminDashboard() {
    const navigate =
        useNavigate();


    const user =
        getSessionUser();


    const [
        users,
        setUsers,
    ] = useState([]);


    const [
        pendingUsers,
        setPendingUsers,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    useEffect(() => {
        let mounted =
            true;


        const loadDashboard =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setError(
                        ""
                    );


                    const [
                        usersResponse,
                        pendingResponse,
                    ] =
                        await Promise.all([
                            api.get(
                                "/admin/users"
                            ),

                            api.get(
                                "/admin/pending-users"
                            ),
                        ]);


                    if (!mounted) {
                        return;
                    }


                    const usersData =
                        Array.isArray(
                            usersResponse.data
                        )
                            ? usersResponse.data
                            : usersResponse.data?.users ||
                            [];


                    const pendingData =
                        Array.isArray(
                            pendingResponse.data
                        )
                            ? pendingResponse.data
                            : pendingResponse.data?.users ||
                            pendingResponse.data?.pendingUsers ||
                            [];


                    setUsers(
                        usersData
                    );


                    setPendingUsers(
                        pendingData
                    );

                } catch (error) {
                    console.error(
                        "Admin dashboard error:",
                        error
                    );


                    if (
                        mounted
                    ) {
                        setError(
                            error.response?.data?.message ||
                            "Unable to load dashboard information."
                        );
                    }

                } finally {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadDashboard();


        return () => {
            mounted =
                false;
        };
    }, []);


    const activeUsers =
        users.filter(
            (
                currentUser
            ) =>
                currentUser.status ===
                "active"
        ).length;


    const deactivatedUsers =
        users.filter(
            (
                currentUser
            ) =>
                currentUser.status ===
                "deactivated" ||
                currentUser.status ===
                "inactive"
        ).length;


    const trainers =
        users.filter(
            (
                currentUser
            ) =>
                currentUser.role ===
                "trainer"
        ).length;


    const trainees =
        users.filter(
            (
                currentUser
            ) =>
                currentUser.role ===
                "trainee"
        ).length;


    const handleManageResetUser = (
        userId,
        request
    ) => {
        navigate(
            "/admin/users",
            {
                state: {
                    selectedUserId:
                        userId,

                    passwordResetRequest:
                        request,
                },
            }
        );
    };


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <AdminHeader
                user={
                    user
                }
            />


            <div
                className="
                    space-y-4
                    pt-4
                    sm:pt-5
                "
            >
                <FeedbackAlert
                    type="error"
                    message={
                        error
                    }
                    onClose={() =>
                        setError(
                            ""
                        )
                    }
                />


                <AdminStats
                    loading={
                        loading
                    }
                    totalUsers={
                        users.length
                    }
                    activeUsers={
                        activeUsers
                    }
                    pendingUsers={
                        pendingUsers.length
                    }
                    deactivatedUsers={
                        deactivatedUsers
                    }
                />


                <section
                    className="
                        grid
                        gap-4
                        xl:grid-cols-[minmax(0,2fr)_minmax(280px,0.8fr)]
                    "
                >
                    <AdminUsersOverview
                        loading={
                            loading
                        }
                        users={
                            users
                        }
                        trainers={
                            trainers
                        }
                        trainees={
                            trainees
                        }
                    />


                    <AdminQuickActions
                        pendingCount={
                            pendingUsers.length
                        }
                    />
                </section>


                <PasswordResetRequests
                    onManageUser={
                        handleManageResetUser
                    }
                />
            </div>
        </DashboardLayout>
    );
}


export default AdminDashboard;