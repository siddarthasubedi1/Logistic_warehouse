import {
    useState,
} from "react";


function PasswordInput({
    id = "password",
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
        <div className="relative">

            {/* ================================================= */}
            {/* LOCK ICON */}
            {/* ================================================= */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-y-0
                    left-0
                    flex
                    items-center
                    pl-4
                    text-slate-400
                "
            >

                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    className="h-[18px] w-[18px]"
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

            </div>


            {/* ================================================= */}
            {/* INPUT */}
            {/* ================================================= */}

            <input
                id={
                    id
                }
                type={
                    showPassword
                        ? "text"
                        : "password"
                }
                value={
                    value
                }
                onChange={
                    onChange
                }
                disabled={
                    disabled
                }
                autoComplete={
                    autoComplete
                }
                placeholder={
                    placeholder
                }
                className={`
                    h-12
                    w-full
                    rounded-xl
                    border
                    bg-white
                    pl-11
                    pr-12
                    text-[11px]
                    text-slate-800
                    outline-none
                    transition
                    placeholder:text-slate-400
                    disabled:cursor-not-allowed
                    disabled:bg-slate-50
                    disabled:text-slate-500

                    ${error
                        ? "border-red-300 focus:border-red-400 focus:ring-2 focus:ring-red-100"
                        : "border-slate-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    }
                `}
            />


            {/* ================================================= */}
            {/* SHOW / HIDE */}
            {/* ================================================= */}

            <button
                type="button"
                disabled={
                    disabled
                }
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
                    w-11
                    items-center
                    justify-center
                    text-slate-400
                    transition
                    hover:text-blue-600
                    focus:outline-none
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                "
            >

                {showPassword ? (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-[18px] w-[18px]"
                    >
                        <path d="M3 3l18 18" />

                        <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

                        <path d="M9.8 4.2A10.5 10.5 0 0 1 12 4c5.5 0 9 5 9 8a10.8 10.8 0 0 1-2.2 3.8" />

                        <path d="M6.6 6.6C4.4 8 3 10.2 3 12c0 3 3.5 8 9 8a10 10 0 0 0 4.2-.9" />
                    </svg>
                ) : (
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="h-[18px] w-[18px]"
                    >
                        <path d="M3 12s3.5-6 9-6 9 6 9 6-3.5 6-9 6-9-6-9-6Z" />

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