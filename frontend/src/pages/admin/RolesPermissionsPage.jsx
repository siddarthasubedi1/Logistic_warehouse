import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import api from "../../services/api";
import { getApiErrorMessage, parseArrayResponse } from "../../utils/training";

const ROLES = [
    {
        id: "administrator",
        name: "Administrator",
        backendRole: "admin",
        description: "Full system access and administrative control.",
        priority: 1,
        tone: "purple",
    },
    {
        id: "trainer",
        name: "Trainer",
        backendRole: "trainer",
        description: "Manage assigned training modules and view trainee progress.",
        priority: 2,
        tone: "blue",
    },
    {
        id: "trainee",
        name: "Trainee",
        backendRole: "trainee",
        description: "Access assigned training and complete tasks.",
        priority: 3,
        tone: "green",
    },
];

const PERMISSION_GROUPS = [
    {
        title: "User Management",
        tone: "blue",
        rows: [
            ["View Users", "View list of all users", true, false, false],
            ["Create User", "Add new trainer or trainee", true, false, false],
            ["Edit User", "Edit user information", true, false, false],
            ["Delete/Deactivate User", "Remove or deactivate users", true, false, false],
            ["Reset Password", "Reset user passwords", true, false, false],
        ],
    },
    {
        title: "Training Management",
        tone: "green",
        rows: [
            ["Manage Training", "Create and manage training modules", true, true, false],
            ["View Training", "View assigned training modules", true, true, true],
        ],
    },
    {
        title: "Scenario Management",
        tone: "violet",
        rows: [
            ["Manage Scenarios", "Create and manage hazard scenarios", true, true, false],
            ["View Scenarios", "View and complete hazard scenarios", true, true, true],
        ],
    },
    {
        title: "Quiz Management",
        tone: "orange",
        rows: [
            ["Manage Quizzes", "Create and manage quizzes", true, true, false],
            ["Attempt Quizzes", "Attempt assigned quizzes", true, true, true],
            ["View Quiz Results", "View quiz results and scores", true, true, true],
        ],
    },
    {
        title: "Report & Analytics",
        tone: "cyan",
        rows: [
            ["View Reports", "View training progress and analytics", true, true, false],
            ["Export Reports", "Export reports and data", true, true, false],
        ],
    },
    {
        title: "System Settings",
        tone: "slate",
        rows: [
            ["Manage System Settings", "Update system configuration", true, false, false],
            ["View Audit Logs", "View system activity logs", true, false, false],
        ],
    },
];

function RolesPermissionsPage() {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const loadUsers = useCallback(async () => {
        try {
            setLoading(true);
            setErrorMessage("");
            const response = await api.get("/admin/users");
            setUsers(parseArrayResponse(response.data, "users"));
        } catch (error) {
            console.error("Roles users error:", error);
            setErrorMessage(getApiErrorMessage(error, "Unable to load role information."));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        loadUsers();
    }, [loadUsers]);

    const counts = useMemo(() => {
        const result = { admin: 0, trainer: 0, trainee: 0 };
        users.forEach((user) => {
            const role = String(user.role || "").toLowerCase();
            if (Object.prototype.hasOwnProperty.call(result, role)) result[role] += 1;
        });
        return result;
    }, [users]);

    return (
        <DashboardLayout
            role="admin"
            title="Roles & Permissions"
            subtitle="Manage system roles and their permissions."
        >
            <div className="admin-page admin-roles-page">
                <div className="admin-breadcrumbs" aria-label="Breadcrumb">
                    <span>Dashboard</span><b>›</b><span>User Management</span><b>›</b><strong>Roles & Permissions</strong>
                </div>

                <FeedbackAlert
                    type="error"
                    message={errorMessage}
                    onClose={() => setErrorMessage("")}
                />

                <section className="designer-card roles-system-card">
                    <div className="designer-section-head">
                        <div className="designer-section-title-wrap">
                            <span className="designer-section-icon">⚙</span>
                            <div>
                                <h2>System Roles</h2>
                                <p>Manage user roles and their permissions.</p>
                            </div>
                        </div>
                        <button type="button" className="designer-primary-button" aria-disabled="true" title="System roles are fixed in the current project">
                            + Add New Role
                        </button>
                    </div>

                    <div className="role-card-grid">
                        {ROLES.map((role) => (
                            <article key={role.id} className={`designer-role-card designer-role-card--${role.tone}`}>
                                <div className="designer-role-card__top">
                                    <RoleIcon tone={role.tone} />
                                    <div className="designer-role-card__copy">
                                        <div className="designer-role-card__name-line">
                                            <h3>{role.name}</h3>
                                            <span>System Role</span>
                                        </div>
                                        <p>{role.description}</p>
                                    </div>
                                </div>

                                <div className="designer-role-meta">
                                    <div><span>Users</span><strong>{loading ? "…" : counts[role.backendRole]}</strong></div>
                                    <div><span>Priority</span><strong>{role.priority}</strong></div>
                                    <div><span>Status</span><strong className="role-active-dot">● Active</strong></div>
                                </div>

                                <button
                                    type="button"
                                    className="designer-outline-button designer-role-card__button"
                                    onClick={() => navigate(`/admin/roles/${role.id}`)}
                                >
                                    View Details
                                </button>
                            </article>
                        ))}
                    </div>
                </section>

                <section className="designer-card permissions-overview-card">
                    <div className="designer-section-head designer-section-head--compact">
                        <div className="designer-section-title-wrap">
                            <span className="designer-section-icon designer-section-icon--key">⌕</span>
                            <div>
                                <h2>Permissions Overview</h2>
                                <p>View which roles can access each functionality.</p>
                            </div>
                        </div>
                    </div>

                    <div className="designer-table-scroll">
                        <table className="permissions-overview-table">
                            <thead>
                                <tr>
                                    <th>Permission</th>
                                    <th>Description</th>
                                    <th>Administrator</th>
                                    <th>Trainer</th>
                                    <th>Trainee</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PERMISSION_GROUPS.flatMap((group) => [
                                    <tr key={`${group.title}-head`} className={`permission-group-row permission-group-row--${group.tone}`}>
                                        <td colSpan="5"><span>▣</span>{group.title}</td>
                                    </tr>,
                                    ...group.rows.map(([name, description, administrator, trainer, trainee]) => (
                                        <tr key={`${group.title}-${name}`} className="permission-data-row">
                                            <td><span className="permission-row-icon">♟</span>{name}</td>
                                            <td>{description}</td>
                                            <PermissionCell enabled={administrator} />
                                            <PermissionCell enabled={trainer} />
                                            <PermissionCell enabled={trainee} />
                                        </tr>
                                    )),
                                ])}
                            </tbody>
                        </table>
                    </div>
                </section>
            </div>
        </DashboardLayout>
    );
}

function PermissionCell({ enabled }) {
    return (
        <td className="permission-state-cell">
            <span className={enabled ? "permission-state permission-state--yes" : "permission-state permission-state--no"}>
                {enabled ? "✓" : "×"}
            </span>
        </td>
    );
}

function RoleIcon({ tone }) {
    return (
        <div className={`designer-role-icon designer-role-icon--${tone}`}>
            {tone === "blue" ? "⌂" : tone === "green" ? "♙" : "♜"}
        </div>
    );
}

export default RolesPermissionsPage;
