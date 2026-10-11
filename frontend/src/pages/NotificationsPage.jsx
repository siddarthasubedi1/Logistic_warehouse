import { useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";
import api from "../services/api";
import { getSessionUser, normalizeRole } from "../utils/session";
import { getApiErrorMessage } from "../utils/training";

const TYPE_LABELS = {
    assignment: "Assignment",
    module: "Module",
    progress: "Progress",
    result: "Result",
    "admin-action": "Account",
    badge: "Badge",
    certificate: "Certificate",
};

function NotificationsPage({ role: requestedRole = "" }) {
    const sessionUser = getSessionUser();
    const role = normalizeRole(requestedRole || sessionUser?.role || "trainee");
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [filter, setFilter] = useState("all");
    const [loading, setLoading] = useState(true);
    const [busyId, setBusyId] = useState("");
    const [error, setError] = useState("");
    const loadedOnceRef = useRef(false);
    const restoreScrollRef = useRef(null);
    const preserveScroll = () => { restoreScrollRef.current = window.scrollY; };

    useLayoutEffect(() => {
        if (restoreScrollRef.current === null) return;
        const scrollY = restoreScrollRef.current;
        restoreScrollRef.current = null;
        window.scrollTo({ top: scrollY, behavior: "auto" });
    }, [notifications]);

    useEffect(() => {
        let mounted = true;

        const load = async () => {
            try {
                // Keep existing items mounted on filter changes to avoid a jump.
                if (!loadedOnceRef.current) setLoading(true);
                setError("");
                const params = { limit: 100 };
                if (filter === "unread") params.read = "false";
                if (filter === "read") params.read = "true";

                const response = await api.get("/notifications", { params });
                if (!mounted) return;
                setNotifications(Array.isArray(response.data?.notifications) ? response.data.notifications : []);
                setUnreadCount(Number(response.data?.unreadCount || 0));
            } catch (requestError) {
                if (!mounted) return;
                setError(getApiErrorMessage(requestError, "Unable to load notifications."));
            } finally {
                if (mounted) {
                    loadedOnceRef.current = true;
                    setLoading(false);
                }
            }
        };

        load();
        return () => { mounted = false; };
    }, [filter]);

    const summary = useMemo(() => ({
        total: notifications.length,
        unread: unreadCount,
    }), [notifications.length, unreadCount]);

    const markRead = async (id) => {
        const item = notifications.find((notification) => notification._id === id);
        if (!item || item.read || busyId) return;

        try {
            preserveScroll();
            setBusyId(id);
            const response = await api.patch(`/notifications/${id}/read`);
            const updated = response.data?.notification;
            setNotifications((current) => current.map((notification) =>
                notification._id === id ? { ...notification, ...(updated || {}), read: true } : notification
            ));
            setUnreadCount((current) => Math.max(0, current - 1));
            if (filter === "unread") {
                setNotifications((current) => current.filter((notification) => notification._id !== id));
            }
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to mark notification as read."));
        } finally {
            setBusyId("");
        }
    };

    const markAllRead = async () => {
        if (!unreadCount || busyId) return;

        try {
            preserveScroll();
            setBusyId("all");
            await api.patch("/notifications/read-all");
            setUnreadCount(0);
            setNotifications((current) => filter === "unread" ? [] : current.map((notification) => ({ ...notification, read: true })));
        } catch (requestError) {
            setError(getApiErrorMessage(requestError, "Unable to mark notifications as read."));
        } finally {
            setBusyId("");
        }
    };

    return (
        <DashboardLayout
            role={role}
            title="Notifications"
            subtitle="Training, progress, result, badge and account updates sent to your account."
        >
            <div className="app-page trainee-page trainee-notifications-page space-y-5">
                <FeedbackAlert type="error" message={error} onClose={() => setError("")} />

                <section className="grid gap-4 sm:grid-cols-2">
                    <SummaryCard label="Unread" value={summary.unread} />
                    <SummaryCard label="Shown" value={summary.total} />
                </section>

                <section className="rounded-xl border border-[#dbe4ef] bg-white shadow-sm">
                    <div className="flex flex-col gap-3 border-b border-[#e8eef5] p-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="flex flex-wrap gap-2" aria-label="Notification filters">
                            {[
                                ["all", "All"],
                                ["unread", "Unread"],
                                ["read", "Read"],
                            ].map(([value, label]) => (
                                <button
                                    key={value}
                                    type="button"
                                    onClick={() => { preserveScroll(); setFilter(value); }}
                                    className={`notification-filter rounded-lg px-3 py-2 text-[11px] font-semibold ${filter === value ? "bg-[#0b4f87] text-white" : "border border-[#dbe4ef] bg-white text-[#52627a]"}`}
                                    aria-pressed={filter === value}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={markAllRead}
                            disabled={!unreadCount || busyId === "all"}
                            className="notification-mark-all rounded-lg border border-blue-200 bg-blue-50 px-3 py-2 text-[11px] font-semibold text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {busyId === "all" ? "Saving..." : "Mark all as read"}
                        </button>
                    </div>

                    {loading ? (
                        <div className="p-4"><LoadingCard message="Loading notifications..." /></div>
                    ) : notifications.length ? (
                        <div className="divide-y divide-[#e8eef5]">
                            {notifications.map((notification) => (
                                <article
                                    key={notification._id}
                                    className={`notification-entry flex flex-col gap-3 p-4 sm:flex-row sm:items-start sm:justify-between ${notification.read ? "bg-white" : "bg-blue-50/50"}`}
                                >
                                    <div className="min-w-0">
                                        <div className="flex flex-wrap items-center gap-2">
                                            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-slate-600">
                                                {TYPE_LABELS[notification.type] || "Update"}
                                            </span>
                                            {!notification.read && (
                                                <span className="rounded-full bg-blue-600 px-2 py-1 text-[9px] font-bold text-white">New</span>
                                            )}
                                        </div>
                                        <p className="mt-2 text-[12px] leading-5 text-[#172033]">{notification.message}</p>
                                        <p className="mt-1 text-[10px] text-[#64748b]">{formatDate(notification.createdAt)}</p>
                                    </div>

                                    <div className="flex shrink-0 flex-wrap gap-2">
                                        {role === "admin" && notification.type === "certificate" && (
                                            <button
                                                type="button"
                                                onClick={() => navigate("/admin/certificates")}
                                                className="rounded-lg bg-[#0b4f87] px-3 py-2 text-[10px] font-semibold text-white"
                                            >
                                                Review & send
                                            </button>
                                        )}
                                        {!notification.read && (
                                            <button
                                                type="button"
                                                onClick={() => markRead(notification._id)}
                                                disabled={busyId === notification._id}
                                                className="notification-mark-read rounded-lg border border-[#dbe4ef] bg-white px-3 py-2 text-[10px] font-semibold text-[#0b4f87] disabled:opacity-50"
                                            >
                                                {busyId === notification._id ? "Saving..." : "Mark read"}
                                            </button>
                                        )}
                                    </div>
                                </article>
                            ))}
                        </div>
                    ) : (
                        <div className="p-10 text-center">
                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-xl text-blue-600" aria-hidden="true">✓</div>
                            <h2 className="mt-4 text-[13px] font-bold text-[#172033]">No notifications in this view</h2>
                            <p className="mt-2 text-[10px] text-[#64748b]">New training and result updates will appear here automatically.</p>
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}

function SummaryCard({ label, value }) {
    return (
        <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">
            <p className="text-[10px] text-[#64748b]">{label}</p>
            <strong className="mt-2 block text-[24px] text-[#172033]">{value}</strong>
        </article>
    );
}

function formatDate(value) {
    if (!value) return "Date unavailable";
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? "Date unavailable" : date.toLocaleString();
}

export default NotificationsPage;
