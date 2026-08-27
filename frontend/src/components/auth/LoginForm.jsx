import { useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../services/api";
import Logo from "../layout/Logo";
import PasswordInput from "./PasswordInput";

function LoginForm() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const [loading, setLoading] =
        useState(false);

    const [error, setError] = useState("");

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    // ==========================================
    // LOGIN
    // ==========================================

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        const username =
            formData.username.trim();

        const password =
            formData.password;

        if (!username || !password) {
            setError(
                "Please enter your username and password."
            );

            return;
        }

        try {
            setLoading(true);

            const response = await api.post(
                "/auth/login",
                {
                    username,
                    password,
                }
            );

            const {
                accessToken,
                user,
            } = response.data;

            if (!accessToken || !user) {
                throw new Error(
                    "Invalid login response"
                );
            }

            // Save authentication information

            sessionStorage.setItem(
                "accessToken",
                accessToken
            );

            sessionStorage.setItem(
                "user",
                JSON.stringify(user)
            );

            // ==================================
            // ROLE REDIRECTION
            // ==================================

            switch (user.role) {
                case "admin":
                    navigate(
                        "/admin",
                        {
                            replace: true,
                        }
                    );
                    break;

                case "trainer":
                    navigate(
                        "/trainer",
                        {
                            replace: true,
                        }
                    );
                    break;

                case "trainee":
                    navigate(
                        "/trainee",
                        {
                            replace: true,
                        }
                    );
                    break;

                default:
                    sessionStorage.clear();

                    setError(
                        "Invalid user role."
                    );
            }
        } catch (error) {
            console.error(
                "Login error:",
                error
            );

            if (!error.response) {
                setError(
                    "Cannot connect to the server. Make sure the backend is running."
                );

                return;
            }

            if (
                error.response.data?.code ===
                "ACCOUNT_DEACTIVATED"
            ) {
                setError(
                    "Your account has been deactivated. Please contact the administrator."
                );

                return;
            }

            setError(
                error.response.data
                    ?.message ||
                "Invalid username or password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="w-full max-w-md">
            {/* Mobile logo */}

            <div className="mb-10 lg:hidden">
                <Logo />
            </div>

            {/* Heading */}

            <div className="mb-8">
                <p className="mb-2 text-sm font-semibold tracking-wide text-blue-600">
                    SECURE ACCESS
                </p>

                <h2 className="text-4xl font-bold tracking-tight text-slate-900">
                    Welcome Back
                </h2>

                <p className="mt-3 text-sm leading-6 text-slate-500">
                    Enter your issued credentials
                    to access your dashboard.
                </p>
            </div>

            {/* Error message */}

            {error && (
                <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                    {error}
                </div>
            )}

            {/* Form */}

            <form
                onSubmit={handleSubmit}
                className="space-y-5"
            >
                {/* Username */}

                <div>
                    <label
                        htmlFor="username"
                        className="mb-2 block text-sm font-semibold text-slate-700"
                    >
                        Username
                    </label>

                    <div className="relative">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                className="h-5 w-5"
                                stroke="currentColor"
                                strokeWidth="1.8"
                            >
                                <circle
                                    cx="12"
                                    cy="7"
                                    r="4"
                                />

                                <path
                                    strokeLinecap="round"
                                    d="M4 21a8 8 0 0 1 16 0"
                                />
                            </svg>
                        </div>

                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={
                                formData.username
                            }
                            onChange={
                                handleChange
                            }
                            disabled={loading}
                            autoComplete="username"
                            placeholder="Enter your username"
                            className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                        />
                    </div>
                </div>

                {/* Password */}

                <PasswordInput
                    value={
                        formData.password
                    }
                    onChange={
                        handleChange
                    }
                    disabled={loading}
                />

                {/* Submit */}

                <button
                    type="submit"
                    disabled={loading}
                    className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-blue-600 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:ring-4 focus:ring-blue-500/20 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading
                        ? "Signing in..."
                        : "Sign In →"}
                </button>
            </form>

            {/* Security message */}

            <div className="mt-8 rounded-xl border border-slate-200 bg-white p-4">
                <p className="text-sm font-semibold text-slate-700">
                    Secure Login
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                    Access is restricted to
                    authorised Administrators,
                    Trainers and Trainees.
                </p>
            </div>

            <p className="mt-7 text-center text-xs text-slate-400">
                Having trouble signing in?
                Contact your system
                administrator.
            </p>
        </div>
    );
}

export default LoginForm;