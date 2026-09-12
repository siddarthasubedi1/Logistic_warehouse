import {
    useState,
} from "react";


function PasswordInput({
    id = "password",
    name,
    value,
    onChange,
    error = false,
    disabled = false,
    autoComplete = "current-password",
    placeholder = "Enter your password",
}) {
    const [
        showPassword,
        setShowPassword,
    ] = useState(false);


    return (
        <div
            className="
                relative
            "
        >
            {/* LOCK */}

            <span
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    flex
                    items-center
                    pl-3
                    text-slate-400
                "
            >
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-4 w-4"
                >
                    <rect
                        x="5"
                        y="10"
                        width="14"
                        height="10"
                        rx="2"
                    />

                    <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                </svg>
            </span>


            {/* INPUT */}

            <input
                id={id}
                name={name}
                type={
                    showPassword
                        ? "text"
                        : "password"
                }
                value={value}
                onChange={onChange}
                disabled={disabled}
                autoComplete={
                    autoComplete
                }
                placeholder={
                    placeholder
                }
                className={`
                    h-11
                    w-full
                    rounded-lg
                    border
                    bg-white
                    pl-9
                    pr-10
                    text-[10px]
                    text-slate-700
                    outline-none
                    transition
                    placeholder:text-slate-400
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50

                    ${error
                        ? "border-red-300 focus:border-red-500"
                        : "border-slate-300 focus:border-blue-500"
                    }
                `}
            />


            {/* SHOW/HIDE */}

            <button
                type="button"
                disabled={disabled}
                onClick={() =>
                    setShowPassword(
                        (
                            current
                        ) =>
                            !current
                    )
                }
                aria-label={
                    showPassword
                        ? "Hide password"
                        : "Show password"
                }
                className="
                    absolute
                    inset-y-0
                    right-0
                    flex
                    w-10
                    items-center
                    justify-center
                    text-slate-400
                    transition
                    hover:text-blue-600
                    disabled:opacity-40
                "
            >
                {showPassword ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path d="M3 3l18 18" />
                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                        <path d="M9.9 4.2A10.5 10.5 0 0 1 12 4c5 0 8.5 4 9.5 6-0.4.9-1.2 2.1-2.3 3.2" />
                        <path d="M6.2 6.2C4.4 7.4 3.2 9 2.5 10c1 2 4.5 6 9.5 6 1 0 1.9-.2 2.8-.5" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-4 w-4"
                    >
                        <path d="M2.5 12S6 6 12 6s9.5 6 9.5 6-3.5 6-9.5 6S2.5 12 2.5 12Z" />

                        <circle
                            cx="12"
                            cy="12"
                            r="2.5"
                        />
                    </svg>
                )}
            </button>
        </div>
    );
}


export default PasswordInput;