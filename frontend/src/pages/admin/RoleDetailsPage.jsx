import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import api from "../../services/api";
import { parseArrayResponse } from "../../utils/training";

const ROLE_DETAILS = {
    administrator: {
        name: "Administrator",
        backendRole: "admin",
        description: "Full system access and administrative control.",
        priority: 1,
        tone: "purple",
        systemRole: true,
        groups: [
            {
                title: "User Management",
                tone: "blue",
                permissions: [
                    ["View Users", "View list of all users", true, false, false, false],
                    ["Create User", "Add new trainer or trainee", false, true, false, false],
                    ["Edit User", "Edit user information", false, false, true, false],
                    ["Delete/Deactivate User", "Remove or deactivate users", false, false, false, true],
                    ["Reset Password", "Reset user passwords", false, false, true, false],
                ],
            },
            {
                title: "Training Management",
                tone: "green",
                permissions: [
                    ["Manage Training", "Create and manage training modules", true, true, true, true],
                ],
            },
            {
                title: "Profile",
                tone: "violet",
                permissions: [
                    ["Manage Own Profile", "View and update own profile", true, false, true, false],
                ],
            },
        ],
        history: [
            ["3 Sep 2026, 8:30 PM", "System Administrator", "Administrator role permissions reviewed."],
            ["1 Sep 2026, 10:15 AM", "System", "Administrator role created."],
        ],
    },
    trainer: {
        name: "Trainer",
        backendRole: "trainer",
        description: "Manage assigned training modules and view trainee progress and performance.",
        priority: 2,
        tone: "blue",
        systemRole: false,
        groups: [
            {
                title: "User Management",
                tone: "blue",
                permissions: [
                    ["View Users", "View assigned trainee information", true, false, false, false],
                    ["Create User", "Add new trainer or trainee", false, false, false, false],
                    ["Edit User", "Edit trainee task and score information", false, false, true, false],
                    ["Delete/Deactivate User", "Remove or deactivate users", false, false, false, false],
                    ["Reset Password", "Reset user passwords", false, false, false, false],
                ],
            },
            {
                title: "Training Management",
                tone: "green",
                permissions: [
                    ["View and Manage Module", "Manage assigned training module", true, true, true, false],
                    ["View Trainee Progress", "View trainee progress and scores", true, false, true, false],
                ],
            },
            {
                title: "Profile",
                tone: "violet",
                permissions: [
                    ["Manage Own Profile", "View and update own profile", true, false, true, false],
                ],
            },
        ],
        history: [
            ["3 Sep 2026, 9:00 PM", "System Administrator", "Trainer permissions reviewed."],
            ["1 Sep 2026, 10:15 AM", "System", "Trainer role created."],
        ],
    },
    trainee: {
        name: "Trainee",
        backendRole: "trainee",
        description: "Access assigned training modules, complete activities and view personal progress.",
        priority: 3,
        tone: "green",
        systemRole: true,
        groups: [
            {
                title: "Training Management",
                tone: "green",
                permissions: [
                    ["View Assigned Training", "Access assigned training modules", true, false, false, false],
                    ["Complete Training", "Complete quizzes and scenarios", true, false, true, false],
                    ["View Own Progress", "View personal progress and scores", true, false, false, false],
                ],
            },
            {
                title: "Profile",
                tone: "violet",
                permissions: [
                    ["Manage Own Profile", "View and update own profile", true, false, true, false],
                ],
            },
        ],
        history: [
            ["3 Sep 2026, 9:00 PM", "System Administrator", "Trainee permissions reviewed."],
            ["1 Sep 2026, 10:15 AM", "System", "Trainee role created."],
        ],
    },
};

function RoleDetailsPage() {
    const navigate = useNavigate();
    const { roleName } = useParams();
    const roleKey = String(roleName || "").toLowerCase();
    const role = ROLE_DETAILS[roleKey];
    const [users, setUsers] = useState([]);

    useEffect(() => {
        let mounted = true;
        api.get("/admin/users")
            .then((response) => {
                if (mounted) setUsers(parseArrayResponse(response.data, "users"));
            })
            .catch(() => {
                if (mounted) setUsers([]);
            });
        return () => { mounted = false; };
    }, []);

    const userCount = useMemo(() => {
        if (!role) return 0;
        return users.filter((user) => String(user.role || "").toLowerCase() === role.backendRole).length;
    }, [role, users]);

    if (!role) {
        return (
            <DashboardLayout role="admin" title="Role Not Found">
                <div className="admin-page"><section className="designer-card empty-admin-card">Role not found.</section></div>
            </DashboardLayout>
        );
    }

    const permissionCount = role.groups.reduce((total, group) => total + group.permissions.length, 0);

    return (
        <DashboardLayout
            role="admin"
            title={`View Role Details - ${role.name}`}
            subtitle="Review role information, permissions and history."
        >
            <div className="admin-page admin-role-details-page">
                <div className="admin-breadcrumbs">
                    <span>Dashboard</span><b>›</b><span>User Management</span><b>›</b><span>Roles & Permissions</span><b>›</b><strong>{role.name}</strong>
                </div>

                <section className="designer-card role-info-card">
                    <div className="role-info-card__header">
                        <div className="designer-section-title-wrap">
                            <span className="designer-section-icon">⚙</span>
                            <div><h2>Role Information</h2></div>
                        </div>
                        <div className="role-info-actions">
                            <button type="button" className="designer-outline-button" onClick={() => navigate("/admin/roles")}>← Back To Roles</button>
                            <button type="button" className="designer-primary-button" onClick={() => navigate(`/admin/roles/${roleKey}/edit`)}>✎ Edit Role</button>
                        </div>
                    </div>

                    <div className="role-identity-row">
                        <RoleAvatar tone={role.tone} />
                        <div>
                            <div className="role-identity-title">
                                <h3>{role.name}</h3>
                                <span>{role.systemRole ? "System Role" : "Custom Role"}</span>
                            </div>
                            <p>{role.description}</p>
                        </div>
                    </div>

                    <div className="role-stat-strip">
                        <RoleStat label="Status" value="Active" success />
                        <RoleStat label="Users" value={userCount} />
                        <RoleStat label="Permissions" value={permissionCount} />
                        <RoleStat label="Priority" value={role.priority} />
                        <RoleStat label="Created On" value="System Default" />
                    </div>
                </section>

                <div className="role-details-grid">
                    <section className="designer-card role-permissions-card">
                        <div className="designer-section-head designer-section-head--compact">
                            <div className="designer-section-title-wrap">
                                <span className="designer-section-icon designer-section-icon--key">⌕</span>
                                <div>
                                    <h2>Permissions ({permissionCount})</h2>
                                    <p>View what this role can access and modify.</p>
                                </div>
                            </div>
                            <label className="designer-search-box designer-search-box--small">
                                <span>⌕</span><input type="search" placeholder="Search permissions..." />
                            </label>
                        </div>
                        <div className="designer-table-scroll">
                            <table className="role-permission-table">
                                <thead>
                                    <tr><th>Permissions</th><th>Description</th><th>View</th><th>Create</th><th>Edit</th><th>Delete</th></tr>
                                </thead>
                                <tbody>
                                    {role.groups.flatMap((group) => [
                                        <tr key={`${group.title}-head`} className={`permission-group-row permission-group-row--${group.tone}`}>
                                            <td colSpan="6"><span>▣</span>{group.title}</td>
                                        </tr>,
                                        ...group.permissions.map(([name, description, view, create, edit, remove]) => (
                                            <tr key={`${group.title}-${name}`} className="permission-data-row">
                                                <td>{name}</td><td>{description}</td>
                                                <TinyPermission enabled={view} />
                                                <TinyPermission enabled={create} />
                                                <TinyPermission enabled={edit} />
                                                <TinyPermission enabled={remove} />
                                            </tr>
                                        )),
                                    ])}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    <aside className="designer-card role-history-card">
                        <div className="designer-section-title-wrap role-history-title">
                            <span className="designer-section-icon">◷</span><div><h2>Change History</h2></div>
                        </div>
                        <div className="role-history-timeline">
                            {role.history.map(([date, actor, note]) => (
                                <div className="role-history-item" key={date}>
                                    <span className="role-history-dot" />
                                    <strong>{date}</strong><b>{actor}</b><p>{note}</p>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </DashboardLayout>
    );
}

function RoleAvatar({ tone }) {
    return <div className={`role-detail-avatar role-detail-avatar--${tone}`}>♙</div>;
}

function RoleStat({ label, value, success = false }) {
    return (
        <div className="role-stat-item">
            <span>{label}</span>
            <strong className={success ? "role-stat-success" : ""}>{value}</strong>
        </div>
    );
}

function TinyPermission({ enabled }) {
    return <td className="permission-state-cell"><span className={enabled ? "permission-state permission-state--yes" : "permission-state permission-state--no"}>{enabled ? "✓" : "×"}</span></td>;
}

export default RoleDetailsPage;
