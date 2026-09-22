import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

const ROLE_CONFIG = {
    administrator: {
        name: "Administrator",
        type: "System Role",
        description: "Full system access and administrative control.",
        priority: 1,
        groups: [
            {
                title: "User Management", tone: "blue", rows: [
                    ["View Users", "View list of all users", true, false, false, false],
                    ["Create User", "Add new trainer or trainee", false, true, false, false],
                    ["Edit User", "Edit user information", false, false, true, false],
                    ["Delete/Deactivate User", "Remove or deactivate users", false, false, false, true],
                    ["Reset Password", "Reset user passwords", false, false, true, false],
                ]
            },
            {
                title: "Training Management", tone: "green", rows: [
                    ["Manage Training", "Create and manage training modules", true, true, true, true],
                ]
            },
            {
                title: "Scenario Management", tone: "violet", rows: [
                    ["Manage Scenarios", "Create and manage hazard scenarios", true, true, true, true],
                ]
            },
            {
                title: "Quiz Management", tone: "orange", rows: [
                    ["Manage Quizzes", "Create and manage quizzes", true, true, true, true],
                ]
            },
            {
                title: "Report & Analytics", tone: "cyan", rows: [
                    ["View Reports", "View reports and analytics", true, false, false, false],
                ]
            },
        ],
    },
    trainer: {
        name: "Trainer",
        type: "Custom Role",
        description: "Manage assigned training modules and view trainee progress and performance.",
        priority: 2,
        groups: [
            {
                title: "User Management", tone: "blue", rows: [
                    ["View Users", "View assigned trainee information", true, false, false, false],
                    ["Create User", "Add new trainer or trainee", false, false, false, false],
                    ["Edit User", "Edit trainee task and score information", false, false, true, false],
                    ["Delete/Deactivate User", "Remove or deactivate users", false, false, false, false],
                    ["Reset Password", "Reset user passwords", false, false, false, false],
                ]
            },
            {
                title: "Training Management", tone: "green", rows: [
                    ["View and Manage Module", "Manage assigned training module", true, true, true, false],
                    ["View Trainee Progress", "View trainee progress and scores", true, false, true, false],
                ]
            },
            {
                title: "Profile", tone: "violet", rows: [
                    ["Manage Own Profile", "View and update own profile", true, false, true, false],
                ]
            },
        ],
    },
    trainee: {
        name: "Trainee",
        type: "System Role",
        description: "Access assigned training modules, complete activities and view personal progress.",
        priority: 3,
        groups: [
            {
                title: "Training Management", tone: "green", rows: [
                    ["View Assigned Training", "Access assigned training modules", true, false, false, false],
                    ["Complete Training", "Complete quizzes and scenarios", true, false, true, false],
                    ["View Own Progress", "View personal progress and scores", true, false, false, false],
                ]
            },
            {
                title: "Profile", tone: "violet", rows: [
                    ["Manage Own Profile", "View and update own profile", true, false, true, false],
                ]
            },
        ],
    },
};

function EditRolePage() {
    const navigate = useNavigate();
    const { roleName } = useParams();
    const roleKey = String(roleName || "").toLowerCase();
    const role = ROLE_CONFIG[roleKey];

    const initialRows = useMemo(() => role ? role.groups.map((group) => ({
        ...group,
        rows: group.rows.map((row) => [...row]),
    })) : [], [role]);

    const [description, setDescription] = useState(role?.description || "");
    const [groups, setGroups] = useState(initialRows);
    const [search, setSearch] = useState("");
    const [success, setSuccess] = useState("");

    useEffect(() => {
        setDescription(role?.description || "");
        setGroups(role ? role.groups.map((group) => ({ ...group, rows: group.rows.map((row) => [...row]) })) : []);
        setSuccess("");
    }, [role]);

    if (!role) {
        return <DashboardLayout role="admin" title="Role Not Found"><div className="admin-page"><section className="designer-card empty-admin-card">Role not found.</section></div></DashboardLayout>;
    }

    const toggle = (groupIndex, rowIndex, permissionIndex) => {
        setGroups((current) => current.map((group, gi) => gi !== groupIndex ? group : {
            ...group,
            rows: group.rows.map((row, ri) => ri !== rowIndex ? row : row.map((value, index) => index === permissionIndex ? !value : value)),
        }));
        setSuccess("");
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        setSuccess("Role settings updated in the current view. Backend permission logic was not changed.");
    };

    return (
        <DashboardLayout role="admin" title="Edit Role" subtitle="Review role information and permissions.">
            <form className="admin-page admin-edit-role-page" onSubmit={handleSubmit}>
                <div className="admin-breadcrumbs">
                    <span>Dashboard</span><b>›</b><span>User Management</span><b>›</b><span>Roles & Permissions</span><b>›</b><strong>Edit Role</strong>
                </div>

                {success && <div className="designer-success-alert">{success}</div>}

                <section className="designer-card edit-role-info-card">
                    <div className="designer-section-title-wrap">
                        <span className="designer-section-icon">⚙</span><div><h2>Role Information</h2></div>
                    </div>
                    <div className="edit-role-form-grid">
                        <label><span>Role Name *</span><input value={role.name} readOnly /></label>
                        <label><span>Role Type</span><select value={role.type} disabled><option>{role.type}</option></select></label>
                        <label className="edit-role-description"><span>Description</span><textarea value={description} onChange={(event) => setDescription(event.target.value)} rows="3" /></label>
                        <div className="edit-role-side-fields">
                            <label><span>Status</span><div className="designer-toggle"><i /> Active</div></label>
                            <label><span>Priority</span><select value={role.priority} disabled><option>{role.priority}</option></select></label>
                        </div>
                    </div>
                </section>

                <section className="designer-card edit-role-permissions-card">
                    <div className="designer-section-head">
                        <div className="designer-section-title-wrap">
                            <span className="designer-section-icon designer-section-icon--key">⌕</span>
                            <div><h2>Permissions</h2><p>Select the permissions this role should have.</p></div>
                        </div>
                        <div className="edit-permission-toolbar">
                            <label className="designer-search-box designer-search-box--small"><span>⌕</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search permissions..." /></label>
                            <button type="button" className="designer-outline-button">⛶ Expand All</button>
                            <button type="button" className="designer-outline-button">▣ Collapse All</button>
                        </div>
                    </div>

                    <div className="designer-table-scroll">
                        <table className="edit-role-permission-table">
                            <thead><tr><th>Permission</th><th>Description</th><th>◉ View</th><th>⊕ Create</th><th>✎ Edit</th><th>▣ Delete</th></tr></thead>
                            <tbody>
                                {groups.flatMap((group, groupIndex) => [
                                    <tr key={`${group.title}-head`} className={`permission-group-row permission-group-row--${group.tone}`}><td colSpan="6"><span>▣</span>{group.title}</td></tr>,
                                    ...group.rows.map((row, rowIndex) => {
                                        const [name, descriptionText, view, create, edit, remove] = row;
                                        if (search && !`${name} ${descriptionText}`.toLowerCase().includes(search.toLowerCase())) return null;
                                        return (
                                            <tr key={`${group.title}-${name}`} className="permission-data-row">
                                                <td>{name}</td><td>{descriptionText}</td>
                                                {[view, create, edit, remove].map((enabled, index) => (
                                                    <td key={index} className="edit-permission-checkbox-cell">
                                                        <input type="checkbox" checked={Boolean(enabled)} onChange={() => toggle(groupIndex, rowIndex, index + 2)} />
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    }),
                                ])}
                            </tbody>
                        </table>
                    </div>
                </section>

                <div className="edit-role-actions">
                    <button type="button" className="designer-outline-button" onClick={() => navigate(-1)}>Cancel</button>
                    <button type="button" className="designer-outline-button" onClick={() => { setGroups(initialRows); setDescription(role.description); setSuccess(""); }}>↶ Reset Changes</button>
                    <button type="submit" className="designer-primary-button">✓ Save Changes</button>
                </div>
            </form>
        </DashboardLayout>
    );
}

export default EditRolePage;
