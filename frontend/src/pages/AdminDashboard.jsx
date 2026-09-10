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


    // ======================================================
    // DATA
    // ======================================================

    const [
        users,
        setUsers,
    ] = useState([]);


    const [
        pendingUsers,
        setPendingUsers,
    ] = useState([]);


    // ======================================================
    // PAGE STATE
    // ======================================================

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
    // LOAD DASHBOARD
    // ======================================================

    useEffect(() => {
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
                        await Promise.all(
                            [
                                api.get(
                                    "/admin/users"
                                ),

                                api.get(
                                    "/admin/pending-users"
                                ),
                            ]
                        );


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


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load dashboard information."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            };


        loadDashboardData();

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
                "deactivated"
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
    // PASSWORD RESET NAVIGATION
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
    // UI
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={
                false
            }
        >

            <div className="space-y-5">

                {/* ================================================= */}
                {/* ADMIN HEADER */}
                {/* ================================================= */}

                <AdminHeader
                    user={
                        user
                    }
                />


                {/* ================================================= */}
                {/* ERROR */}
                {/* ================================================= */}

                {error && (
                    <div
                        className="
                            flex
                            items-start
                            gap-3
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-xs
                            text-red-700
                            shadow-sm
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
                                text-red-600
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

                            <p className="font-semibold">
                                Dashboard Error
                            </p>


                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    leading-5
                                "
                            >
                                {error}
                            </p>

                        </div>

                    </div>
                )}


                {/* ================================================= */}
                {/* STATISTICS */}
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
                {/* MAIN DASHBOARD */}
                {/* ================================================= */}

                <div
                    className="
                        grid
                        gap-5
                        xl:grid-cols-[minmax(0,1.35fr)_minmax(280px,.65fr)]
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
                {/* PASSWORD RESET REQUESTS */}
                {/* ================================================= */}

                <PasswordResetRequests
                    onManageUser={
                        handleManageResetUser
                    }
                />


                {/* ================================================= */}
                {/* SAFETY INFORMATION */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-emerald-50
                        p-5
                        shadow-sm
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-10
                            -top-10
                            h-28
                            w-28
                            rounded-full
                            bg-blue-100/60
                        "
                    />


                    <div
                        className="
                            relative
                            flex
                            flex-col
                            gap-4
                            sm:flex-row
                            sm:items-center
                        "
                    >

                        <div
                            className="
                                flex
                                h-11
                                w-11
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-6 w-6"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-800
                                "
                            >
                                UK LogiWare Safety Administration
                            </p>


                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Manage Trainer and Trainee access,
                                workplace safety training and account
                                security from the Administrator
                                workspace.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


export default AdminDashboard;