import Logo from "../layout/Logo";

function LoginBranding() {
    return (
        <section className="relative hidden min-h-screen overflow-hidden bg-slate-950 lg:flex lg:w-[58%] lg:flex-col lg:justify-between">
            {/* Background */}

            <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950" />

            <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-cyan-500/10 blur-3xl" />

            {/* Logo */}

            <div className="relative z-10 px-14 pt-12">
                <Logo light />
            </div>

            {/* Main content */}

            <div className="relative z-10 max-w-2xl px-14">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-2 text-sm font-medium text-blue-200">
                    <span className="h-2 w-2 rounded-full bg-blue-400" />

                    Workplace Safety Training
                </div>

                <h2 className="text-5xl font-bold leading-tight tracking-tight text-white">
                    Work Safe.
                    <br />

                    <span className="text-blue-400">
                        Learn Safe.
                    </span>

                    <br />
                    Every Step Matters.
                </h2>

                <p className="mt-6 max-w-xl text-base leading-7 text-slate-300">
                    Interactive workplace safety
                    training designed for logistics
                    and warehouse teams.
                </p>

                {/* Feature cards */}

                <div className="mt-9 grid grid-cols-3 gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                            ✓
                        </div>

                        <p className="text-sm font-semibold text-white">
                            Safe Training
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Structured safety learning
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                            ◉
                        </div>

                        <p className="text-sm font-semibold text-white">
                            Role Based
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Secure access for each role
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                        <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-500/20 text-blue-300">
                            ↗
                        </div>

                        <p className="text-sm font-semibold text-white">
                            Progress
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-400">
                            Follow your training journey
                        </p>
                    </div>
                </div>
            </div>

            {/* Footer */}

            <div className="relative z-10 flex justify-between px-14 pb-10 text-xs text-slate-500">
                <p>© 2026 UK LogiWare</p>

                <p>
                    Workplace Safety Training System
                </p>
            </div>
        </section>
    );
}

export default LoginBranding;