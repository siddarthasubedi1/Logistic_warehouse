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

import api from "../services/api";


function AdminDashboard() {
    const navigate =
        useNavigate();


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


    // ======================================================
    // CURRENT ADMIN
    // ======================================================

    const storedUser =
        sessionStorage.getItem(
            "user"
        );


    let user =
        null;


    try {
        user =
            storedUser
                ? JSON.parse(
                    storedUser
                )
                : null;

    } catch {
        user =
            null;
    }


    // ======================================================
    // LOAD EXISTING DASHBOARD DATA
    // ======================================================

    useEffect(() => {
        let mounted =
            true;


        const loadDashboardData =
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
                            : usersResponse.data
                                ?.users ||
                            [];


                    const pendingData =
                        Array.isArray(
                            pendingResponse.data
                        )
                            ? pendingResponse.data
                            : pendingResponse.data
                                ?.users ||
                            pendingResponse.data
                                ?.pendingUsers ||
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
                            error.response
                                ?.data
                                ?.message ||
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


        loadDashboardData();


        return () => {
            mounted =
                false;
        };

    }, []);


    // ======================================================
    // COUNTS
    // ======================================================

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


    // ======================================================
    // PASSWORD RESET USER NAVIGATION
    // ======================================================

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


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={
                false
            }
        >

            {/* ================================================= */}
            {/* ADMIN PAGE HEADER */}
            {/* ================================================= */}

            <AdminHeader
                user={
                    user
                }
            />


            {/* ================================================= */}
            {/* DASHBOARD CONTENT */}
            {/* ================================================= */}

            <div
                className="
                    space-y-4
                    pt-5
                "
            >

                {/* ERROR */}

                {error && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-lg
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                        "
                    >
                        <div
                            className="
                                flex
                                h-7
                                w-7
                                shrink-0
                                items-center
                                justify-center
                                rounded-full
                                bg-white
                                text-red-500
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-4 w-4"
                            >
                                <circle
                                    cx="12"
                                    cy="12"
                                    r="9"
                                />

                                <path d="M12 7v6" />

                                <path d="M12 17h.01" />
                            </svg>
                        </div>


                        <div>
                            <p
                                className="
                                    text-[9px]
                                    font-semibold
                                    text-red-700
                                "
                            >
                                Unable to load dashboard
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    text-red-600
                                "
                            >
                                {error}
                            </p>
                        </div>
                    </div>
                )}


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

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


                {/* ================================================= */}
                {/* OVERVIEW + QUICK ACTIONS */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-4
                        xl:grid-cols-[minmax(0,1.8fr)_minmax(260px,.7fr)]
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
                </div>


                {/* ================================================= */}
                {/* PASSWORD RESET */}
                {/* ================================================= */}

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