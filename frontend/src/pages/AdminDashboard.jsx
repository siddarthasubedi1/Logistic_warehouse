import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import AdminHeader from "../components/admin/AdminHeader";
import AdminStats from "../components/admin/AdminStats";
import AdminUsersOverview from "../components/admin/AdminUsersOverview";
import AdminQuickActions from "../components/admin/AdminQuickActions";
import PasswordResetRequests from "../components/admin/PasswordResetRequests";

import api from "../services/api";

import {
    getSessionUser,
} from "../utils/session";


function AdminDashboard() {
    const navigate =
        useNavigate();


    const sessionUser =
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


    const loadDashboard =
        useCallback(
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


                    const userList =
                        Array.isArray(
                            usersResponse.data
                        )
                            ? usersResponse.data
                            : usersResponse.data?.users ||
                            [];


                    const pendingList =
                        Array.isArray(
                            pendingResponse.data
                        )
                            ? pendingResponse.data
                            : pendingResponse.data?.users ||
                            pendingResponse.data?.pendingUsers ||
                            [];


                    setUsers(
                        userList
                    );


                    setPendingUsers(
                        pendingList
                    );

                } catch (error) {
                    console.error(
                        "Admin dashboard loading error:",
                        error
                    );


                    setError(
                        error.response?.data?.message ||
                        "Unable to load administrator dashboard."
                    );

                } finally {
                    setLoading(
                        false
                    );
                }
            },
            []
        );


    useEffect(() => {
        loadDashboard();
    }, [
        loadDashboard,
    ]);


    const statistics =
        useMemo(
            () => {
                const active =
                    users.filter(
                        (
                            user
                        ) =>
                            String(
                                user.status ||
                                ""
                            ).toLowerCase() ===
                            "active"
                    ).length;


                const deactivated =
                    users.filter(
                        (
                            user
                        ) =>
                            [
                                "deactivated",
                                "inactive",
                            ].includes(
                                String(
                                    user.status ||
                                    ""
                                ).toLowerCase()
                            )
                    ).length;


                const trainers =
                    users.filter(
                        (
                            user
                        ) =>
                            String(
                                user.role ||
                                ""
                            ).toLowerCase() ===
                            "trainer"
                    ).length;


                const trainees =
                    users.filter(
                        (
                            user
                        ) =>
                            String(
                                user.role ||
                                ""
                            ).toLowerCase() ===
                            "trainee"
                    ).length;


                return {
                    total:
                        users.length,

                    active,

                    deactivated,

                    pending:
                        pendingUsers.length,

                    trainers,

                    trainees,
                };
            },
            [
                users,
                pendingUsers,
            ]
        );


    const handleManageResetUser =
        (
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
                    sessionUser
                }
            />


            <div
                className="
                    space-y-4
                    pt-4
                    sm:pt-5
                "
            >
                {error && (
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-4
                            rounded-xl
                            border
                            border-red-200
                            bg-red-50
                            px-4
                            py-3
                            text-[12px]
                            text-red-700
                        "
                    >
                        <span>
                            {error}
                        </span>


                        <button
                            type="button"
                            onClick={() =>
                                setError(
                                    ""
                                )
                            }
                            className="
                                shrink-0
                                font-bold
                            "
                        >
                            ×
                        </button>
                    </div>
                )}


                <AdminStats
                    loading={
                        loading
                    }
                    totalUsers={
                        statistics.total
                    }
                    activeUsers={
                        statistics.active
                    }
                    pendingUsers={
                        statistics.pending
                    }
                    deactivatedUsers={
                        statistics.deactivated
                    }
                />


                <div
                    className="
                        grid
                        gap-4
                        xl:grid-cols-[minmax(0,1fr)_370px]
                    "
                >
                    <AdminUsersOverview
                        users={
                            users
                        }
                        trainees={
                            statistics.trainees
                        }
                        trainers={
                            statistics.trainers
                        }
                        loading={
                            loading
                        }
                        onViewAll={() =>
                            navigate(
                                "/admin/users"
                            )
                        }
                    />


                    <AdminQuickActions
                        pendingUsers={
                            statistics.pending
                        }
                    />
                </div>


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