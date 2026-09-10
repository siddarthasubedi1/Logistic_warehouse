import {
    useLocation,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import ManageUsersTable from "../../components/admin/ManageUsersTable";

import TrainerAssignmentsPanel from "../../components/admin/TrainerAssignmentsPanel";


function ManageUsersPage() {
    const location =
        useLocation();


    // ======================================================
    // PASSWORD RESET NAVIGATION
    // ======================================================

    const selectedUserId =
        location.state
            ?.selectedUserId ||
        null;


    const passwordResetRequest =
        location.state
            ?.passwordResetRequest ||
        null;


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
                {/* PAGE HEADER */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >

                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-14
                            -top-14
                            h-44
                            w-44
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        {/* LEFT */}

                        <div
                            className="
                                flex
                                items-start
                                gap-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-12
                                    w-12
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-xl
                                    border
                                    border-white/15
                                    bg-white/10
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6"
                                >
                                    <circle
                                        cx="9"
                                        cy="8"
                                        r="3"
                                    />

                                    <circle
                                        cx="17"
                                        cy="9"
                                        r="2"
                                    />

                                    <path d="M3 20c.5-4 2.5-6 6-6s5.5 2 6 6" />

                                    <path d="M15 15c3 0 5 1.6 5.5 5" />
                                </svg>
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-blue-100
                                    "
                                >
                                    User Administration
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    Manage Users
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                    "
                                >
                                    View, edit, activate, deactivate
                                    and manage Trainer and Trainee
                                    workplace safety access.
                                </p>

                            </div>

                        </div>


                        {/* BADGES */}

                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                "
                            >
                                Trainer Accounts
                            </span>


                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/15
                                    bg-white/10
                                    px-3
                                    py-1.5
                                    text-[9px]
                                    font-semibold
                                    text-white
                                "
                            >
                                Trainee Accounts
                            </span>

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* PASSWORD RESET NAVIGATION NOTICE */}
                {/* ================================================= */}

                {passwordResetRequest &&
                    selectedUserId && (
                        <section
                            className="
                                flex
                                items-start
                                gap-3
                                rounded-xl
                                border
                                border-amber-200
                                bg-amber-50
                                p-4
                            "
                        >

                            <div
                                className="
                                    flex
                                    h-8
                                    w-8
                                    shrink-0
                                    items-center
                                    justify-center
                                    rounded-lg
                                    bg-white
                                    text-amber-600
                                    shadow-sm
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

                                    <path d="M12 7v5" />

                                    <path d="M12 16h.01" />
                                </svg>
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[11px]
                                        font-bold
                                        text-amber-800
                                    "
                                >
                                    Password Reset Request Selected
                                </p>


                                <p
                                    className="
                                        mt-1
                                        text-[10px]
                                        leading-5
                                        text-amber-700
                                    "
                                >
                                    The requested user has been selected
                                    below. Use Reset Password only for
                                    this pending request.
                                </p>

                            </div>

                        </section>
                    )}


                {/* ================================================= */}
                {/* TRAINING ACCESS */}
                {/* ================================================= */}

                <TrainerAssignmentsPanel />


                {/* ================================================= */}
                {/* USER MANAGEMENT */}
                {/* ================================================= */}

                <ManageUsersTable
                    selectedUserId={
                        selectedUserId
                    }
                    passwordResetRequest={
                        passwordResetRequest
                    }
                />


                {/* ================================================= */}
                {/* ADMIN NOTE */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-slate-200
                        bg-white
                        p-5
                        shadow-sm
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-blue-50
                                text-blue-600
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
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
                                Secure Account Management
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
                                Account creation, edits, training-access
                                changes, password resets and account
                                status operations remain protected by
                                Administrator role access.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


export default ManageUsersPage;