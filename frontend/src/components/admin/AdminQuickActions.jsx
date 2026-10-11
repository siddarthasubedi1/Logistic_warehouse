import { useNavigate } from "react-router-dom";

function AdminQuickActions({ pendingUsers = 0, pendingCertificates = 0 }) {
    const navigate = useNavigate();
    const actions = [
        {
            title: "Create User Account",
            tone: "teal",
            description: `${pendingUsers} pending ${pendingUsers === 1 ? "user" : "users"}`,
            action: () => navigate("/admin/create-user"),
            icon: "♙",
        },
        {
            title: "Manage Users",
            tone: "violet",
            description: "Activate, deactivate or remove accounts",
            action: () => navigate("/admin/users"),
            icon: "♟",
        },
        {
            title: "Send Certificates",
            tone: "gold",
            description: `${pendingCertificates} ${pendingCertificates === 1 ? "certificate" : "certificates"} ready to email`,
            action: () => navigate("/admin/certificates"),
            icon: "✓",
        },
        {
            title: "Access Control",
            tone: "blue",
            description: "Admin roles are protected by role-based access control",
            action: () => navigate("/admin/roles"),
            icon: "♢",
            highlighted: true,
        },
    ];

    return (
        <section className="designer-card admin-quick-actions-card">
            <div className="admin-card-heading">
                <h2>Quick Actions</h2>
                <p>Common administrative tasks and completion actions.</p>
            </div>
            <div className="admin-quick-actions-list">
                {actions.map((action) => (
                    <button
                        key={action.title}
                        type="button"
                        onClick={action.action}
                        className={`admin-quick-action admin-quick-action--${action.tone} ${action.highlighted ? "admin-quick-action--highlighted" : ""}`}
                    >
                        <span className="admin-quick-action__icon">{action.icon}</span>
                        <span className="admin-quick-action__copy">
                            <strong>{action.title}</strong>
                            <small>{action.description}</small>
                        </span>
                        <span className="admin-quick-action__arrow">›</span>
                    </button>
                ))}
            </div>
        </section>
    );
}

export default AdminQuickActions;
