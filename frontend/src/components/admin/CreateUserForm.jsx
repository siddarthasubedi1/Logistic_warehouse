import { useEffect, useState } from "react";
import api from "../../services/api";

function CreateUserForm() {
    // ======================================================
    // STATES
    // ======================================================

    const [pendingUsers, setPendingUsers] = useState([]);

    const [selectedUserId, setSelectedUserId] = useState("");

    const [selectedUser, setSelectedUser] = useState(null);

    const [credentials, setCredentials] = useState(null);

    const [loading, setLoading] = useState(false);

    const [loadingUsers, setLoadingUsers] = useState(true);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


    // ======================================================
    // LOAD PENDING USERS
    // GET /api/admin/pending-users
    // ======================================================

    const loadPendingUsers = async () => {
        try {
            setLoadingUsers(true);
            setError("");

            const response = await api.get(
                "/admin/pending-users"
            );

            setPendingUsers(response.data);
        } catch (error) {
            console.error(
                "Pending users error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to load pending users."
            );
        } finally {
            setLoadingUsers(false);
        }
    };


    // ======================================================
    // LOAD USERS WHEN COMPONENT OPENS
    // ======================================================

    useEffect(() => {
        loadPendingUsers();
    }, []);


    // ======================================================
    // SELECT USER
    // ======================================================

    const handleUserSelect = (event) => {
        const id = event.target.value;

        setSelectedUserId(id);

        setCredentials(null);

        setSuccess("");

        setError("");

        const user = pendingUsers.find(
            (item) =>
                String(item.id) === String(id)
        );

        setSelectedUser(user || null);
    };


    // ======================================================
    // GENERATE USER ACCOUNT
    // POST /api/admin/generate-credentials
    // ======================================================

    const handleGenerate = async () => {
        if (!selectedUserId) {
            setError(
                "Please select a user first."
            );

            return;
        }

        /*
         * IMPORTANT:
         * Keep a copy of the selected user.
         *
         * After generation we refresh the pending-user
         * list and clear the selected dropdown.
         *
         * We still need this user's email/name for the
         * Send Email button.
         */
        const userForEmail = selectedUser;

        try {
            setLoading(true);

            setError("");

            setSuccess("");

            setCredentials(null);

            const response = await api.post(
                "/admin/generate-credentials",
                {
                    pendingUserId:
                        selectedUserId,
                }
            );

            // Save one-time credentials
            setCredentials(
                response.data.credentials
            );

            /*
             * Keep selected user information available
             * so Gmail can use the user's email.
             */
            setSelectedUser(userForEmail);

            setSuccess(
                "Account created successfully. Save or send the credentials now because they are shown only once."
            );

            /*
             * Refresh pending users.
             * The generated account should no longer
             * appear in the pending-user list if the
             * backend removes/filters generated users.
             */
            await loadPendingUsers();

            // Clear only the dropdown selection.
            // Do NOT clear selectedUser because the
            // email button still needs it.
            setSelectedUserId("");
        } catch (error) {
            console.error(
                "Generate credentials error:",
                error
            );

            setError(
                error.response?.data?.message ||
                "Unable to generate account."
            );
        } finally {
            setLoading(false);
        }
    };


    // ======================================================
    // SEND CREDENTIALS USING GMAIL
    // ======================================================

    const handleSendEmail = () => {
        if (!credentials) {
            setError(
                "Generate the account credentials first."
            );

            return;
        }

        if (!selectedUser) {
            setError(
                "User information is unavailable."
            );

            return;
        }

        if (!selectedUser.email) {
            setError(
                "This user does not have an email address."
            );

            return;
        }

        // Recipient email
        const to = encodeURIComponent(
            selectedUser.email
        );

        // Email subject
        const subject = encodeURIComponent(
            "Your Training Platform Account"
        );

        // Email body
        const body = encodeURIComponent(
            `Hello ${selectedUser.firstName},

Your UK LogiWare Safety Training account has been created.

Your login credentials are:

Username: ${credentials.username}
Temporary Password: ${credentials.password}

Login here:
http://localhost:5173/login

For security, please change your password after your first login.

Please keep your login credentials secure and do not share them with anyone.

Regards,
UK LogiWare Administrator`
        );

        // Gmail compose URL
        const gmailUrl =
            `https://mail.google.com/mail/?view=cm&fs=1&to=${to}&su=${subject}&body=${body}`;

        /*
         * Open Gmail in a new tab.
         * The Admin reviews the email and manually
         * clicks Send.
         */
        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };


    // ======================================================
    // COMPONENT UI
    // ======================================================

    return (
        <div className="space-y-6">

            {/* =================================================
                STEP 1 - SELECT PENDING USER
            ================================================= */}

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                <div>
                    <p className="text-sm font-semibold text-blue-600">
                        STEP 1
                    </p>

                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Select Pending User
                    </h2>

                    <p className="mt-2 text-sm text-slate-500">
                        Select a Trainer or Trainee
                        waiting for account creation.
                    </p>
                </div>


                <div className="mt-6">

                    {loadingUsers ? (
                        <p className="text-sm text-slate-500">
                            Loading pending users...
                        </p>
                    ) : (
                        <select
                            value={selectedUserId}
                            onChange={handleUserSelect}
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white px-4 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                        >
                            <option value="">
                                Select pending user
                            </option>

                            {pendingUsers.map(
                                (user) => (
                                    <option
                                        key={user.id}
                                        value={user.id}
                                    >
                                        {user.firstName}{" "}
                                        {user.lastName}{" "}
                                        — {user.role}
                                    </option>
                                )
                            )}
                        </select>
                    )}

                </div>


                {!loadingUsers &&
                    pendingUsers.length === 0 && (
                        <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                            No pending users.
                        </div>
                    )}

            </div>


            {/* =================================================
                STEP 2 - REVIEW USER
            ================================================= */}

            {selectedUser &&
                !credentials && (
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <p className="text-sm font-semibold text-blue-600">
                            STEP 2
                        </p>

                        <h2 className="mt-1 text-xl font-bold text-slate-900">
                            Review User Information
                        </h2>

                        <p className="mt-2 text-sm text-slate-500">
                            Check the user's information
                            before generating the account.
                        </p>


                        <div className="mt-6 grid gap-4 sm:grid-cols-2">

                            <Info
                                label="Full Name"
                                value={`${selectedUser.firstName} ${selectedUser.lastName}`}
                            />

                            <Info
                                label="Email"
                                value={
                                    selectedUser.email
                                }
                            />

                            <Info
                                label="Role"
                                value={
                                    selectedUser.role
                                }
                            />


                            {selectedUser.age && (
                                <Info
                                    label="Age"
                                    value={
                                        selectedUser.age
                                    }
                                />
                            )}


                            {selectedUser.phoneNumber && (
                                <Info
                                    label="Phone Number"
                                    value={
                                        selectedUser.phoneNumber
                                    }
                                />
                            )}


                            {selectedUser.address && (
                                <Info
                                    label="Address"
                                    value={
                                        selectedUser.address
                                    }
                                />
                            )}


                            {selectedUser.gender && (
                                <Info
                                    label="Gender"
                                    value={
                                        selectedUser.gender
                                    }
                                />
                            )}

                        </div>


                        <button
                            type="button"
                            onClick={handleGenerate}
                            disabled={loading}
                            className="mt-6 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            {loading
                                ? "Generating..."
                                : "Generate Account"}
                        </button>

                    </div>
                )}


            {/* =================================================
                ERROR MESSAGE
            ================================================= */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}


            {/* =================================================
                SUCCESS MESSAGE
            ================================================= */}

            {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                    {success}
                </div>
            )}


            {/* =================================================
                STEP 3 - GENERATED CREDENTIALS
            ================================================= */}

            {credentials && selectedUser && (
                <div className="rounded-2xl border border-blue-200 bg-blue-50 p-6 shadow-sm">

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                        <div>
                            <p className="text-sm font-semibold text-blue-600">
                                STEP 3
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                Account Credentials
                            </h2>

                            <p className="mt-2 text-sm text-slate-600">
                                These credentials are
                                displayed only once.
                            </p>
                        </div>


                        <span className="w-fit rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700">
                            One-Time Credentials
                        </span>

                    </div>


                    {/* USER DETAILS */}

                    <div className="mt-6 rounded-xl border border-blue-100 bg-white p-4">

                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Account Created For
                        </p>

                        <p className="mt-2 font-semibold text-slate-900">
                            {selectedUser.firstName}{" "}
                            {selectedUser.lastName}
                        </p>

                        <p className="mt-1 text-sm text-slate-500">
                            {selectedUser.email}
                        </p>

                        <p className="mt-1 text-xs font-semibold uppercase text-blue-600">
                            {selectedUser.role}
                        </p>

                    </div>


                    {/* CREDENTIALS */}

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">

                        <CredentialBox
                            label="Username"
                            value={
                                credentials.username
                            }
                        />

                        <CredentialBox
                            label="Temporary Password"
                            value={
                                credentials.password
                            }
                        />

                    </div>


                    {/* SECURITY WARNING */}

                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4">

                        <p className="text-sm font-semibold text-amber-800">
                            Important
                        </p>

                        <p className="mt-1 text-xs leading-5 text-amber-700">
                            The temporary password is not
                            stored in plaintext. Send these
                            credentials to the user before
                            leaving or refreshing this page.
                        </p>

                    </div>


                    {/* SEND EMAIL */}

                    <button
                        type="button"
                        onClick={handleSendEmail}
                        className="mt-6 flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
                    >
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            className="h-5 w-5"
                            stroke="currentColor"
                            strokeWidth="1.8"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 6.5 12 13l9-6.5"
                            />

                            <rect
                                x="3"
                                y="5"
                                width="18"
                                height="14"
                                rx="2"
                            />
                        </svg>

                        Send Email
                    </button>


                    <p className="mt-3 text-xs text-slate-500">
                        Gmail will open in a new tab
                        with the recipient, subject and
                        credentials automatically
                        filled. The Administrator must
                        review and send the email
                        manually.
                    </p>

                </div>
            )}

        </div>
    );
}


// ======================================================
// INFORMATION CARD
// ======================================================

function Info({
    label,
    value,
}) {
    return (
        <div className="rounded-xl bg-slate-50 p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-semibold capitalize text-slate-800">
                {value || "Not provided"}
            </p>

        </div>
    );
}


// ======================================================
// CREDENTIAL BOX
// ======================================================

function CredentialBox({
    label,
    value,
}) {
    return (
        <div className="rounded-xl border border-blue-200 bg-white p-4">

            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-2 break-all font-mono text-sm font-bold text-slate-900">
                {value}
            </p>

        </div>
    );
}


export default CreateUserForm;