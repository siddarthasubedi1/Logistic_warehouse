function Logo({ light = false }) {
    return (
        <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    className="h-6 w-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10.5 12 4l9 6.5v8.25A1.25 1.25 0 0 1 19.75 20H4.25A1.25 1.25 0 0 1 3 18.75V10.5Z"
                    />

                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 20v-6h8v6M7 10h10"
                    />
                </svg>
            </div>

            <div>
                <h1
                    className={`text-xl font-bold ${light
                        ? "text-white"
                        : "text-slate-900"
                        }`}
                >
                    UK LogiWare
                </h1>

                <p
                    className={`text-xs font-medium uppercase tracking-wider ${light
                        ? "text-blue-300"
                        : "text-slate-500"
                        }`}
                >
                    Safety Training
                </p>
            </div>
        </div>
    );
}

export default Logo;