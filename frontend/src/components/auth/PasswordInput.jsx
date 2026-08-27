import { useState } from "react";

function PasswordInput({
    value,
    onChange,
    disabled = false,
}) {
    const [showPassword, setShowPassword] =
        useState(false);

    return (
        <div>
            <label
                htmlFor="password"
                className="mb-2 block text-sm font-semibold text-slate-700"
            >
                Password
            </label>

            <div className="relative">
                {/* Lock icon */}

                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        className="h-5 w-5"
                        stroke="currentColor"
                        strokeWidth="1.8"
                    >
                        <rect
                            x="4"
                            y="10"
                            width="16"
                            height="10"
                            rx="2"
                        />

                        <path
                            strokeLinecap="round"
                            d="M8 10V7a4 4 0 0 1 8 0v3"
                        />
                    </svg>
                </div>

                <input
                    id="password"
                    name="password"
                    type={
                        showPassword
                            ? "text"
                            : "password"
                    }
                    value={value}
                    onChange={onChange}
                    disabled={disabled}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="h-12 w-full rounded-xl border border-slate-300 bg-white pl-12 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-100"
                />

                {/* Show/hide */}

                <button
                    type="button"
                    onClick={() =>
                        setShowPassword(
                            (previous) => !previous
                        )
                    }
                    disabled={disabled}
                    className="absolute inset-y-0 right-0 flex items-center px-4 text-slate-400 transition hover:text-blue-600"
                    aria-label={
                        showPassword
                            ? "Hide password"
                            : "Show password"
                    }
                >
                    {showPassword ? "Hide" : "Show"}
                </button>
            </div>
        </div>
    );
}

export default PasswordInput;