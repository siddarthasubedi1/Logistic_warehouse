import { useEffect, useState } from "react";
import api from "../../services/api";

function CreateUserForm() {
    const initialFormData = {
        firstName: "",
        lastName: "",
        age: "",
        email: "",
        phoneNumber: "",
        address: "",
        gender: "",
        role: "",
    };

    const [showCreateForm, setShowCreateForm] = useState(false);

    const [formData, setFormData] = useState(initialFormData);

    const [pendingUsers, setPendingUsers] = useState([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);

    const [credentials, setCredentials] = useState(null);

    const [loadingUsers, setLoadingUsers] = useState(false);
    const [savingUser, setSavingUser] = useState(false);
    const [generating, setGenerating] = useState(false);

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOAD PENDING USERS
    // =====================================================

    const loadPendingUsers = async () => {
        try {
            setLoadingUsers(true);

            const response = await api.get(
                "/admin/pending-users"
            );

            setPendingUsers(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load pending users."
            );
        } finally {
            setLoadingUsers(false);
        }
    };

    useEffect(() => {
        loadPendingUsers();
    }, []);

    // =====================================================
    // OPEN / CLOSE CREATE USER FORM
    // =====================================================

    const toggleCreateForm = () => {
        setShowCreateForm((previous) => !previous);
        setError("");
        setSuccess("");
    };

    const handleCancelForm = () => {
        setShowCreateForm(false);
        setFormData(initialFormData);
        setError("");
    };

    // =====================================================
    // FORM CHANGE
    // =====================================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        setError("");
        setSuccess("");
    };

    // =====================================================
    // SAVE USER
    // =====================================================

    const handleSaveUser = async (event) => {
        event.preventDefault();

        setError("");
        setSuccess("");
        setCredentials(null);

        const {
            firstName,
            lastName,
            age,
            email,
            phoneNumber,
            address,
            gender,
            role,
        } = formData;

        if (
            !firstName.trim() ||
            !lastName.trim() ||
            !age ||
            !email.trim() ||
            !phoneNumber.trim() ||
            !address.trim() ||
            !gender ||
            !role
        ) {
            setError("Please complete all user information.");
            return;
        }

        if (Number(age) < 16) {
            setError("Age must be 16 or above.");
            return;
        }

        try {
            setSavingUser(true);

            const response = await api.post(
                "/admin/pending-users",
                {
                    firstName: firstName.trim(),
                    lastName: lastName.trim(),
                    age: Number(age),
                    email: email.trim(),
                    phoneNumber: phoneNumber.trim(),
                    address: address.trim(),
                    gender,
                    role,
                }
            );

            setSuccess(
                response.data?.message ||
                "User information saved successfully."
            );

            // Clear form
            setFormData(initialFormData);

            // Close form after save
            setShowCreateForm(false);

            // Refresh pending users
            await loadPendingUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to save user information."
            );
        } finally {
            setSavingUser(false);
        }
    };

    // =====================================================
    // SELECT PENDING USER
    // =====================================================

    const handleUserSelect = (event) => {
        const userId = event.target.value;

        setSelectedUserId(userId);
        setCredentials(null);
        setError("");
        setSuccess("");

        if (!userId) {
            setSelectedUser(null);
            return;
        }

        const user = pendingUsers.find(
            (item) => String(item.id) === String(userId)
        );

        setSelectedUser(user || null);
    };

    // =====================================================
    // GENERATE ACCOUNT
    // =====================================================

    const handleGenerate = async () => {
        if (!selectedUserId) {
            setError("Please select a pending user first.");
            return;
        }

        try {
            setGenerating(true);
            setError("");
            setSuccess("");
            setCredentials(null);

            const response = await api.post(
                "/admin/generate-credentials",
                {
                    pendingUserId: selectedUserId,
                }
            );

            setCredentials(response.data.credentials);

            if (response.data.user) {
                setSelectedUser(response.data.user);
            }

            setSelectedUserId("");

            setSuccess(
                response.data?.message ||
                "Account generated successfully."
            );

            await loadPendingUsers();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to generate account."
            );
        } finally {
            setGenerating(false);
        }
    };

    // =====================================================
    // SEND EMAIL
    // =====================================================

    const handleSendEmail = () => {
        if (!selectedUser?.email || !credentials) {
            return;
        }

        const fullName =
            `${selectedUser.firstName || ""} ${selectedUser.lastName || ""
                }`.trim();

        const subject =
            "UK LogiWare - Your Account Credentials";

        const body = `Hello ${fullName},

Your UK LogiWare account has been created successfully.

Username: ${credentials.username}
Temporary Password: ${credentials.password}

Login here:
http://localhost:5173/login

For security, please change your temporary password after your first login.

Regards,
UK LogiWare Administrator`;

        const gmailUrl =
            "https://mail.google.com/mail/?view=cm&fs=1" +
            `&to=${encodeURIComponent(selectedUser.email)}` +
            `&su=${encodeURIComponent(subject)}` +
            `&body=${encodeURIComponent(body)}`;

        window.open(
            gmailUrl,
            "_blank",
            "noopener,noreferrer"
        );
    };

    return (
        <div className="space-y-6">

            {/* ================================================= */}
            {/* CREATE USER HEADER */}
            {/* ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                {/* TOP DESIGN AREA */}
                <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 px-6 py-7">

                    {/* Decorative background circles */}
                    <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-white/10" />
                    <div className="pointer-events-none absolute right-20 top-14 h-20 w-20 rounded-full bg-white/5" />

                    <div className="relative flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">

                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-4">

                            {/* USER ICON */}
                            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-white/15 shadow-sm ring-1 ring-white/20 backdrop-blur-sm">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-7 w-7 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0ZM4.5 20.1a7.5 7.5 0 0115 0"
                                    />
                                </svg>
                            </div>

                            {/* TITLE */}
                            <div>
                                <div className="mb-1.5 flex flex-wrap items-center gap-2">

                                    <h2 className="text-xl font-bold text-white">
                                        User Accounts
                                    </h2>

                                    <span className="rounded-full bg-white/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-white ring-1 ring-white/20">
                                        Admin Control
                                    </span>
                                </div>

                                <p className="max-w-xl text-sm text-blue-100">
                                    Create and prepare Trainer or Trainee
                                    accounts for secure system access.
                                </p>
                            </div>
                        </div>

                        {/* CREATE USER BUTTON */}
                        <button
                            type="button"
                            onClick={toggleCreateForm}
                            className={`inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-semibold shadow-sm transition-all duration-200 ${showCreateForm
                                ? "bg-white/15 text-white ring-1 ring-white/30 hover:bg-white/20"
                                : "bg-white text-blue-700 hover:-translate-y-0.5 hover:bg-blue-50 hover:shadow-md"
                                }`}
                        >
                            <span
                                className={`flex h-6 w-6 items-center justify-center rounded-lg text-lg leading-none ${showCreateForm
                                    ? "bg-white/15"
                                    : "bg-blue-100 text-blue-700"
                                    }`}
                            >
                                {showCreateForm ? "×" : "+"}
                            </span>

                            {showCreateForm
                                ? "Close Form"
                                : "Create User"}
                        </button>
                    </div>
                </div>


                {/* ================================================= */}
                {/* EXPANDABLE CREATE USER FORM */}
                {/* ================================================= */}

                {showCreateForm && (
                    <div className="border-t border-slate-200 bg-slate-50/70 p-6 dark:border-slate-700 dark:bg-slate-900">

                        {/* FORM TITLE */}
                        <div className="mb-6 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M15 19a6 6 0 00-12 0"
                                        />
                                        <circle cx="9" cy="7" r="4" />
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M19 8v6M22 11h-6"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        Create New User
                                    </h3>

                                    <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                        Enter the personal and account information below.
                                    </p>
                                </div>
                            </div>

                            <span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 sm:block dark:bg-blue-950/50 dark:text-blue-300">
                                Trainer / Trainee
                            </span>
                        </div>


                        {/* INFO BANNER */}
                        <div className="mb-6 flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-900 dark:bg-blue-950/30">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                >
                                    <circle cx="12" cy="12" r="9" />
                                    <path
                                        strokeLinecap="round"
                                        d="M12 11v5M12 8h.01"
                                    />
                                </svg>
                            </div>

                            <div>
                                <p className="text-sm font-semibold text-blue-800 dark:text-blue-300">
                                    User information only
                                </p>

                                <p className="mt-1 text-xs leading-5 text-blue-700 dark:text-blue-400">
                                    Saving this form adds the user to the pending
                                    account list. Username and password will be
                                    generated separately.
                                </p>
                            </div>
                        </div>


                        <form onSubmit={handleSaveUser} className="space-y-6">

                            {/* ============================================= */}
                            {/* PERSONAL INFORMATION */}
                            {/* ============================================= */}

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/40">

                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="h-4 w-4"
                                            >
                                                <circle cx="12" cy="8" r="4" />
                                                <path
                                                    strokeLinecap="round"
                                                    d="M4 21a8 8 0 0116 0"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                Personal Information
                                            </h4>

                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                Basic details of the new user.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

                                    <FormField
                                        label="First Name"
                                        name="firstName"
                                        value={formData.firstName}
                                        onChange={handleChange}
                                        placeholder="e.g. Sagar"
                                    />

                                    <FormField
                                        label="Last Name"
                                        name="lastName"
                                        value={formData.lastName}
                                        onChange={handleChange}
                                        placeholder="e.g. Gurung"
                                    />

                                    <FormField
                                        label="Age"
                                        name="age"
                                        type="number"
                                        min="16"
                                        value={formData.age}
                                        onChange={handleChange}
                                        placeholder="e.g. 22"
                                    />

                                    {/* GENDER */}
                                    <div>
                                        <FormLabel>Gender</FormLabel>

                                        <div className="relative">
                                            <select
                                                name="gender"
                                                value={formData.gender}
                                                onChange={handleChange}
                                                required
                                                className={`${inputClass} appearance-none pr-10`}
                                            >
                                                <option value="">
                                                    Select gender
                                                </option>
                                                <option value="male">
                                                    Male
                                                </option>
                                                <option value="female">
                                                    Female
                                                </option>
                                                <option value="other">
                                                    Other
                                                </option>
                                            </select>

                                            <div className="pointer-events-none absolute inset-y-0 right-4 flex items-center text-slate-400">
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="m6 9 6 6 6-6"
                                                    />
                                                </svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>


                            {/* ============================================= */}
                            {/* CONTACT INFORMATION */}
                            {/* ============================================= */}

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/40">

                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">
                                    <div className="flex items-center gap-3">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M4 4h16v16H4z"
                                                />
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="m4 6 8 6 8-6"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                Contact Information
                                            </h4>

                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                Contact details used for communication.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 gap-5 p-5 md:grid-cols-2">

                                    <FormField
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="e.g. user@example.com"
                                    />

                                    <FormField
                                        label="Phone Number"
                                        name="phoneNumber"
                                        type="tel"
                                        value={formData.phoneNumber}
                                        onChange={handleChange}
                                        placeholder="e.g. 98XXXXXXXX"
                                    />

                                    <div className="md:col-span-2">
                                        <FormLabel>Address</FormLabel>

                                        <textarea
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            required
                                            rows="3"
                                            placeholder="Enter complete address"
                                            className={`${inputClass} resize-none`}
                                        />
                                    </div>
                                </div>
                            </div>


                            {/* ============================================= */}
                            {/* SYSTEM ACCESS */}
                            {/* ============================================= */}

                            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800/40">

                                <div className="border-b border-slate-200 bg-slate-50 px-5 py-4 dark:border-slate-700 dark:bg-slate-800">

                                    <div className="flex items-center gap-3">

                                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-300">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 15v2"
                                                />

                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M8 11V7a4 4 0 018 0v4"
                                                />

                                                <rect
                                                    x="5"
                                                    y="11"
                                                    width="14"
                                                    height="10"
                                                    rx="2"
                                                />
                                            </svg>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                                                System Access
                                            </h4>

                                            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                                Choose the correct system role.
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-5">

                                    <FormLabel>User Role</FormLabel>

                                    {/* ROLE CARDS */}
                                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                                        {/* TRAINER */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((previous) => ({
                                                    ...previous,
                                                    role: "trainer",
                                                }))
                                            }
                                            className={`relative rounded-xl border-2 p-4 text-left transition-all ${formData.role === "trainer"
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
                                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">

                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${formData.role === "trainer"
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                        }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="h-5 w-5"
                                                    >
                                                        <circle
                                                            cx="12"
                                                            cy="7"
                                                            r="4"
                                                        />
                                                        <path
                                                            strokeLinecap="round"
                                                            d="M5 21a7 7 0 0114 0"
                                                        />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        Trainer
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                        Training management and
                                                        trainee monitoring access.
                                                    </p>
                                                </div>
                                            </div>

                                            {formData.role === "trainer" && (
                                                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    ✓
                                                </div>
                                            )}
                                        </button>


                                        {/* TRAINEE */}
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setFormData((previous) => ({
                                                    ...previous,
                                                    role: "trainee",
                                                }))
                                            }
                                            className={`relative rounded-xl border-2 p-4 text-left transition-all ${formData.role === "trainee"
                                                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100 dark:bg-blue-950/30 dark:ring-blue-900"
                                                : "border-slate-200 bg-white hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:hover:border-blue-700"
                                                }`}
                                        >
                                            <div className="flex items-start gap-3">

                                                <div
                                                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${formData.role === "trainee"
                                                        ? "bg-blue-600 text-white"
                                                        : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                                                        }`}
                                                >
                                                    <svg
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="2"
                                                        className="h-5 w-5"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            d="M4 5h16v12H4z"
                                                        />

                                                        <path
                                                            strokeLinecap="round"
                                                            d="M9 21h6M12 17v4"
                                                        />
                                                    </svg>
                                                </div>

                                                <div>
                                                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                                        Trainee
                                                    </p>

                                                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">
                                                        Training, quiz and personal
                                                        progress access.
                                                    </p>
                                                </div>
                                            </div>

                                            {formData.role === "trainee" && (
                                                <div className="absolute right-3 top-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
                                                    ✓
                                                </div>
                                            )}
                                        </button>
                                    </div>

                                    {/* hidden required role field */}
                                    <input
                                        type="hidden"
                                        name="role"
                                        value={formData.role}
                                    />

                                    {!formData.role && (
                                        <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                                            Select either Trainer or Trainee.
                                        </p>
                                    )}
                                </div>
                            </div>


                            {/* ============================================= */}
                            {/* FORM FOOTER */}
                            {/* ============================================= */}

                            <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 sm:flex-row sm:items-center sm:justify-between dark:border-slate-700 dark:bg-slate-800/40">

                                <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 15v2M8 11V7a4 4 0 018 0v4"
                                        />
                                        <rect
                                            x="5"
                                            y="11"
                                            width="14"
                                            height="10"
                                            rx="2"
                                        />
                                    </svg>

                                    Account credentials will be generated later.
                                </div>

                                <div className="flex flex-col-reverse gap-3 sm:flex-row">

                                    <button
                                        type="button"
                                        onClick={handleCancelForm}
                                        disabled={savingUser}
                                        className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={savingUser}
                                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
                                    >
                                        {savingUser ? (
                                            <>
                                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <svg
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 24 24"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    className="h-4 w-4"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        d="M12 5v14M5 12h14"
                                                    />
                                                </svg>

                                                Save User
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                )}
            </section>




            {/* ================================================= */}
            {/* MESSAGES */}
            {/* ================================================= */}

            {error && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
                    {error}
                </div>
            )}

            {success && (
                <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700 dark:border-green-900 dark:bg-green-950/40 dark:text-green-300">
                    {success}
                </div>
            )}


            {/* ================================================= */}
            {/* PENDING ACCOUNT CREATION */}
            {/* ================================================= */}

            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">

                {/* HEADER */}
                <div className="relative overflow-hidden bg-gradient-to-r from-slate-800 via-slate-800 to-slate-700 px-6 py-6">

                    {/* Decorative circles */}
                    <div className="pointer-events-none absolute -right-10 -top-16 h-36 w-36 rounded-full bg-white/5" />
                    <div className="pointer-events-none absolute right-24 top-12 h-20 w-20 rounded-full bg-white/5" />

                    <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                        {/* LEFT SIDE */}
                        <div className="flex items-center gap-4">

                            {/* ICON */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/15">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="h-6 w-6 text-white"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M12 6v6l4 2"
                                    />

                                    <circle
                                        cx="12"
                                        cy="12"
                                        r="9"
                                    />
                                </svg>
                            </div>

                            <div>
                                <div className="flex flex-wrap items-center gap-2">

                                    <h2 className="text-lg font-bold text-white">
                                        Pending Account Creation
                                    </h2>

                                    {pendingUsers.length > 0 && (
                                        <span className="rounded-full bg-amber-400/20 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-amber-200 ring-1 ring-amber-300/20">
                                            {pendingUsers.length} Pending
                                        </span>
                                    )}
                                </div>

                                <p className="mt-1 text-sm text-slate-300">
                                    Review saved users and generate their
                                    secure login credentials.
                                </p>
                            </div>
                        </div>

                        {/* STATUS */}
                        <div className="hidden items-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-medium text-slate-200 ring-1 ring-white/10 sm:flex">

                            <span
                                className={`h-2 w-2 rounded-full ${pendingUsers.length > 0
                                    ? "bg-amber-400"
                                    : "bg-green-400"
                                    }`}
                            />

                            {pendingUsers.length > 0
                                ? "Action Required"
                                : "All Clear"}
                        </div>
                    </div>
                </div>


                {/* ================================================= */}
                {/* CONTENT */}
                {/* ================================================= */}

                <div className="p-6">

                    {/* SELECT USER AREA */}
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-700 dark:bg-slate-800/40">

                        <div className="flex items-start gap-3">

                            {/* SMALL ICON */}
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-300">

                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-4 w-4"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2"
                                    />

                                    <circle
                                        cx="9"
                                        cy="7"
                                        r="4"
                                    />

                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="M19 8v6M22 11h-6"
                                    />
                                </svg>
                            </div>

                            <div className="w-full">

                                <div className="mb-4">
                                    <h3 className="text-sm font-semibold text-slate-900 dark:text-white">
                                        Select Pending User
                                    </h3>

                                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                        Choose a Trainer or Trainee who is
                                        waiting for account creation.
                                    </p>
                                </div>

                                <select
                                    value={selectedUserId}
                                    onChange={handleUserSelect}
                                    disabled={
                                        loadingUsers ||
                                        pendingUsers.length === 0
                                    }
                                    className={inputClass}
                                >
                                    <option value="">
                                        {loadingUsers
                                            ? "Loading pending users..."
                                            : pendingUsers.length === 0
                                                ? "No pending users available"
                                                : "Select Trainer or Trainee"}
                                    </option>

                                    {pendingUsers.map((user) => (
                                        <option
                                            key={user.id}
                                            value={user.id}
                                        >
                                            {user.firstName}{" "}
                                            {user.lastName} —{" "}
                                            {formatText(user.role)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>


                        {/* EMPTY STATE */}
                        {!loadingUsers &&
                            pendingUsers.length === 0 && (
                                <div className="mt-5 flex items-center gap-3 rounded-xl border border-green-200 bg-green-50 p-4 dark:border-green-900 dark:bg-green-950/30">

                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300">
                                        ✓
                                    </div>

                                    <div>
                                        <p className="text-sm font-semibold text-green-800 dark:text-green-300">
                                            No pending accounts
                                        </p>

                                        <p className="mt-0.5 text-xs text-green-700 dark:text-green-400">
                                            All saved users currently have
                                            their accounts processed.
                                        </p>
                                    </div>
                                </div>
                            )}
                    </div>


                    {/* ================================================= */}
                    {/* SELECTED USER REVIEW */}
                    {/* ================================================= */}

                    {selectedUser && !credentials && (
                        <div className="mt-6">

                            {/* DIVIDER / TITLE */}
                            <div className="mb-5 flex items-center gap-3">

                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-300">

                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-4 w-4"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M9 11l3 3L22 4"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <h3 className="text-base font-semibold text-slate-900 dark:text-white">
                                        Review User Information
                                    </h3>

                                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                                        Confirm the information before
                                        generating login credentials.
                                    </p>
                                </div>
                            </div>


                            {/* USER SUMMARY */}
                            <div className="mb-4 flex flex-col gap-4 rounded-2xl border border-blue-100 bg-blue-50/60 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-blue-900 dark:bg-blue-950/20">

                                <div className="flex items-center gap-3">

                                    {/* INITIALS */}
                                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold uppercase text-white shadow-sm">
                                        {selectedUser.firstName?.charAt(0)}
                                        {selectedUser.lastName?.charAt(0)}
                                    </div>

                                    <div>
                                        <p className="font-semibold text-slate-900 dark:text-white">
                                            {selectedUser.firstName}{" "}
                                            {selectedUser.lastName}
                                        </p>

                                        <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">
                                            {selectedUser.email}
                                        </p>
                                    </div>
                                </div>

                                <span className="w-fit rounded-full border border-blue-200 bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 dark:border-blue-800 dark:bg-slate-900 dark:text-blue-300">
                                    {formatText(
                                        selectedUser.role
                                    )}
                                </span>
                            </div>


                            {/* INFORMATION GRID */}
                            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                                <InformationBox
                                    label="Full Name"
                                    value={`${selectedUser.firstName} ${selectedUser.lastName}`}
                                />

                                <InformationBox
                                    label="Role"
                                    value={formatText(
                                        selectedUser.role
                                    )}
                                />

                                <InformationBox
                                    label="Email"
                                    value={selectedUser.email}
                                />

                                <InformationBox
                                    label="Age"
                                    value={selectedUser.age}
                                />

                                <InformationBox
                                    label="Phone Number"
                                    value={
                                        selectedUser.phoneNumber
                                    }
                                />

                                <InformationBox
                                    label="Gender"
                                    value={formatText(
                                        selectedUser.gender
                                    )}
                                />

                                <div className="sm:col-span-2 lg:col-span-3">
                                    <InformationBox
                                        label="Address"
                                        value={selectedUser.address}
                                    />
                                </div>
                            </div>


                            {/* SECURITY INFO */}
                            <div className="mt-5 flex gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">

                                <div className="mt-0.5 text-amber-600 dark:text-amber-400">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        className="h-5 w-5"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M12 9v4M12 17h.01"
                                        />

                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M10.3 3.7L2.8 17a2 2 0 001.7 3h15a2 2 0 001.7-3L13.7 3.7a2 2 0 00-3.4 0z"
                                        />
                                    </svg>
                                </div>

                                <div>
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                                        Ready to create account
                                    </p>

                                    <p className="mt-1 text-xs leading-5 text-amber-700 dark:text-amber-400">
                                        A unique username and temporary
                                        password will be generated for this
                                        user. Review the information before
                                        continuing.
                                    </p>
                                </div>
                            </div>


                            {/* GENERATE BUTTON */}
                            <div className="mt-6 flex justify-end">

                                <button
                                    type="button"
                                    onClick={handleGenerate}
                                    disabled={generating}
                                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-blue-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
                                >
                                    {generating ? (
                                        <>
                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                className="h-4 w-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M12 15v2M8 11V7a4 4 0 018 0v4"
                                                />

                                                <rect
                                                    x="5"
                                                    y="11"
                                                    width="14"
                                                    height="10"
                                                    rx="2"
                                                />
                                            </svg>

                                            Generate Account
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </section>




            {/* ================================================= */}
            {/* GENERATED CREDENTIALS */}
            {/* ================================================= */}

            {credentials && selectedUser && (
                <section className="rounded-2xl border border-green-200 bg-white p-6 shadow-sm dark:border-green-900 dark:bg-slate-900">

                    <div>
                        <span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 dark:bg-green-950/50 dark:text-green-300">
                            Account Created
                        </span>

                        <h2 className="mt-3 text-lg font-semibold text-slate-900 dark:text-white">
                            Login Credentials
                        </h2>

                        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                            These credentials are displayed
                            only once.
                        </p>
                    </div>

                    <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">

                        <InformationBox
                            label="User"
                            value={`${selectedUser.firstName} ${selectedUser.lastName}`}
                        />

                        <InformationBox
                            label="Role"
                            value={formatText(
                                selectedUser.role
                            )}
                        />

                        <CredentialBox
                            label="Username"
                            value={credentials.username}
                        />

                        <CredentialBox
                            label="Temporary Password"
                            value={credentials.password}
                        />
                    </div>

                    <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/30">
                        <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                            Save or send these credentials now.
                            The temporary password will not be
                            displayed again.
                        </p>
                    </div>

                    <div className="mt-6 flex justify-end">
                        <button
                            type="button"
                            onClick={handleSendEmail}
                            className="rounded-xl bg-blue-600 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                            Send Credentials by Email
                        </button>
                    </div>
                </section>
            )}
        </div>
    );
}


// =====================================================
// SHARED INPUT STYLE
// =====================================================

const inputClass =
    "w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-100 disabled:cursor-not-allowed disabled:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:placeholder:text-slate-500 dark:focus:ring-blue-900 dark:disabled:bg-slate-800";


// =====================================================
// FORM LABEL
// =====================================================

function FormLabel({ children }) {
    return (
        <label className="mb-2 block text-sm font-medium text-slate-700 dark:text-slate-200">
            {children}
        </label>
    );
}


// =====================================================
// FORM FIELD
// =====================================================

function FormField({
    label,
    name,
    type = "text",
    value,
    onChange,
    placeholder,
    min,
}) {
    return (
        <div>
            <FormLabel>{label}</FormLabel>

            <input
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                min={min}
                required
                className={inputClass}
            />
        </div>
    );
}


// =====================================================
// INFORMATION BOX
// =====================================================

function InformationBox({ label, value }) {
    return (
        <div className="h-full rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
                {value || "—"}
            </p>
        </div>
    );
}


// =====================================================
// CREDENTIAL BOX
// =====================================================

function CredentialBox({ label, value }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(value);

            setCopied(true);

            setTimeout(() => {
                setCopied(false);
            }, 1500);
        } catch (error) {
            console.error(
                "Unable to copy credentials:",
                error
            );
        }
    };

    return (
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800/60">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">
                {label}
            </p>

            <div className="mt-2 flex items-center justify-between gap-4">
                <p className="break-all font-mono text-sm font-semibold text-slate-900 dark:text-white">
                    {value}
                </p>

                <button
                    type="button"
                    onClick={handleCopy}
                    className="shrink-0 rounded-lg border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200"
                >
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
        </div>
    );
}


// =====================================================
// FORMAT TEXT
// =====================================================

function formatText(value) {
    if (!value) {
        return "—";
    }

    return (
        value.charAt(0).toUpperCase() +
        value.slice(1)
    );
}

export default CreateUserForm;