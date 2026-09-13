import heroImage from "../../images/blueimage.png";


function LoginBranding() {
    return (
        <section className="figma-login-brand">

            <img
                src={
                    heroImage
                }
                alt="UK LogiWare warehouse worker"
                className="figma-login-brand-image"
            />


            <div className="figma-login-logo">

                <div className="figma-login-logo-icon">

                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M12 3 20 7.5v9L12 21l-8-4.5v-9L12 3Z" />

                        <path d="m4 7.5 8 4.5 8-4.5" />

                        <path d="M12 12v9" />
                    </svg>

                </div>


                <div>

                    <div className="figma-login-logo-name">
                        UK Logi<span>Ware</span>
                    </div>

                    <div className="figma-login-logo-subtitle">
                        WAREHOUSING &amp; LOGISTICS
                    </div>

                </div>

            </div>


            <div className="figma-login-brand-content">

                <h1>
                    Work Safe. Learn Safe
                </h1>

                <h2>
                    Every Step Matters
                </h2>

                <p>
                    Interactive health &amp; safety training for a safer
                    workplace and a stronger team.
                </p>

            </div>


            <div className="figma-login-features">

                <Feature
                    icon="shield"
                    title="Expert Content"
                    description="Industry approved safety training"
                />


                <Feature
                    icon="award"
                    title="Track Progress"
                    description="Monitor your learning and performance"
                />


                <Feature
                    icon="chart"
                    title="Stay Compliant"
                    description="Meet workplace safety standards"
                    last
                />

            </div>

        </section>
    );
}


function Feature({
    icon,
    title,
    description,
    last = false,
}) {
    return (
        <div
            className={
                last
                    ? "figma-login-feature figma-login-feature-last"
                    : "figma-login-feature"
            }
        >

            <div className="figma-login-feature-icon">

                {icon ===
                    "shield" && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M12 3 5 6v5c0 5 3 8 7 10 4-2 7-5 7-10V6l-7-3Z" />

                            <path d="m9 12 2 2 4-4" />
                        </svg>
                    )}


                {icon ===
                    "award" && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <circle
                                cx="12"
                                cy="8"
                                r="4"
                            />

                            <path d="m9 12-1 9 4-2 4 2-1-9" />

                            <path d="m10.5 8 1 1 2-2" />
                        </svg>
                    )}


                {icon ===
                    "chart" && (
                        <svg
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="1.8"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <path d="M4 20V10" />

                            <path d="M10 20V5" />

                            <path d="M16 20V8" />

                            <path d="M22 20V3" />

                            <path d="m4 10 6-5 6 3 6-5" />
                        </svg>
                    )}

            </div>


            <h3>
                {title}
            </h3>


            <p>
                {description}
            </p>

        </div>
    );
}


export default LoginBranding;