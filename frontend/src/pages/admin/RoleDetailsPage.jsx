import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import ActionButton from "../../components/ui/ActionButton";
import EmptyState from "../../components/ui/EmptyState";
import StatusBadge from "../../components/ui/StatusBadge";


const ROLES = {
    administrator: {
        name:
            "Administrator",

        type:
            "System Role",

        description:
            "Full system access and administrative control.",

        permissions: [
            {
                module:
                    "User Management",

                items: [
                    "View users",
                    "Create Trainer and Trainee accounts",
                    "Deactivate and reactivate users",
                    "Delete users",
                    "Reset temporary passwords",
                ],
            },

            {
                module:
                    "Training Management",

                items: [
                    "Create training programmes",
                    "Manage all training programmes",
                    "Manage learning sections",
                    "Assign programmes to Trainees",
                ],
            },

            {
                module:
                    "Administration",

                items: [
                    "Access Admin Dashboard",
                    "View Roles & Permissions",
                    "View Audit Logs",
                ],
            },
        ],
    },


    trainer: {
        name:
            "Trainer",

        type:
            "Custom Role",

        description:
            "Manage training programmes owned by or authorised for the Trainer.",

        permissions: [
            {
                module:
                    "Training Management",

                items: [
                    "Create training programmes for assigned training areas",
                    "Manage owned programmes",
                    "Manage authorised programmes",
                    "Create and edit learning sections",
                    "Deactivate or reactivate learning sections",
                ],
            },

            {
                module:
                    "Account",

                items: [
                    "Access Trainer Dashboard",
                    "Change own password",
                    "View own account information",
                ],
            },
        ],
    },


    trainee: {
        name:
            "Trainee",

        type:
            "System Role",

        description:
            "Access training programmes assigned by an Administrator.",

        permissions: [
            {
                module:
                    "Training",

                items: [
                    "Access Trainee Dashboard",
                    "View assigned programmes",
                    "Open learning sections",
                    "Navigate through available training content",
                ],
            },

            {
                module:
                    "Account",

                items: [
                    "Change own password",
                    "View own account information",
                ],
            },
        ],
    },
};


function RoleDetailsPage() {
    const navigate =
        useNavigate();


    const {
        roleName,
    } = useParams();


    const roleKey =
        String(
            roleName || ""
        ).toLowerCase();


    const role =
        ROLES[roleKey];


    if (!role) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={false}
            >
                <EmptyState
                    title="Role not found."
                    description="The requested role does not exist."
                    action={
                        <ActionButton
                            variant="primary"
                            onClick={() =>
                                navigate(
                                    "/admin/roles"
                                )
                            }
                        >
                            Back to Roles
                        </ActionButton>
                    }
                />
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >
            <div className="space-y-6">

                {/* ================================================= */}
                {/* HEADER */}
                {/* ================================================= */}

                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-blue-600">
                            Role Details
                        </p>


                        <h1 className="mt-1 text-2xl font-bold text-slate-900">
                            {role.name}
                        </h1>


                        <p className="mt-2 max-w-3xl text-xs leading-5 text-slate-500">
                            {role.description}
                        </p>
                    </div>


                    <div className="flex flex-wrap gap-2">

                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/admin/roles"
                                )
                            }
                        >
                            ← Back
                        </ActionButton>


                        <ActionButton
                            variant="primary"
                            onClick={() =>
                                navigate(
                                    `/admin/roles/${roleKey}/edit`
                                )
                            }
                        >
                            Edit Role
                        </ActionButton>

                    </div>

                </div>


                {/* ================================================= */}
                {/* SUMMARY */}
                {/* ================================================= */}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

                        <RoleInfo
                            label="Role Name"
                            value={
                                role.name
                            }
                        />


                        <RoleInfo
                            label="Role Type"
                            value={
                                role.type
                            }
                        />


                        <div>
                            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                                Status
                            </p>

                            <div className="mt-2">
                                <StatusBadge
                                    status="active"
                                />
                            </div>
                        </div>


                        <RoleInfo
                            label="Priority"
                            value={
                                roleKey ===
                                    "administrator"
                                    ? "1"
                                    : roleKey ===
                                        "trainer"
                                        ? "2"
                                        : "3"
                            }
                        />

                    </div>

                </section>


                {/* ================================================= */}
                {/* PERMISSIONS */}
                {/* ================================================= */}

                <section className="rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-5">

                        <h2 className="text-base font-bold text-slate-900">
                            Permissions
                        </h2>


                        <p className="mt-1 text-xs text-slate-500">
                            Access currently associated with the {role.name} role.
                        </p>

                    </div>


                    <div className="divide-y divide-slate-100">

                        {role.permissions.map(
                            (group) => (
                                <div
                                    key={
                                        group.module
                                    }
                                    className="p-5"
                                >
                                    <h3 className="text-sm font-bold text-slate-800">
                                        {group.module}
                                    </h3>


                                    <div className="mt-4 grid gap-3 md:grid-cols-2">

                                        {group.items.map(
                                            (item) => (
                                                <div
                                                    key={
                                                        item
                                                    }
                                                    className="flex items-start gap-3 rounded-lg bg-slate-50 p-3"
                                                >
                                                    <span className="mt-[1px] flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-700">
                                                        ✓
                                                    </span>


                                                    <p className="text-xs leading-5 text-slate-700">
                                                        {item}
                                                    </p>

                                                </div>
                                            )
                                        )}

                                    </div>

                                </div>
                            )
                        )}

                    </div>

                </section>

            </div>
        </DashboardLayout>
    );
}


function RoleInfo({
    label,
    value,
}) {
    return (
        <div>
            <p className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-2 text-sm font-semibold text-slate-800">
                {value}
            </p>
        </div>
    );
}


export default RoleDetailsPage;