import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";
import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";

import api from "../../services/api";

import warehouseImage from "../../images/warehouse.jpg";
import insideWarehouseImage from "../../images/inside-warehouse.jpg";
import loadingImage from "../../images/loading.jpg";

import {
    getApiErrorMessage,
} from "../../utils/training";


const SCENARIOS = [
    {
        title:
            "Warehouse - Receiving Area",

        text:
            "Identify hazards in the receiving area.",

        image:
            warehouseImage,
    },

    {
        title:
            "Storage Area - High Risk",

        text:
            "Spot the hazards in the storage area.",

        image:
            insideWarehouseImage,
    },

    {
        title:
            "Loading Dock",

        text:
            "Find and report the safety hazards.",

        image:
            loadingImage,
    },
];


const TITLES = {
    progress: [
        "My Progress",
        "Track completion across your assigned workplace safety modules.",
    ],

    scenarios: [
        "Panoramic Scenarios",
        "Practice recognising workplace hazards in realistic warehouse environments.",
    ],

    quizzes: [
        "Quizzes",
        "Complete knowledge checks for your assigned training modules.",
    ],

    notifications: [
        "Notifications",
        "View training updates and account messages.",
    ],

    help: [
        "Help Support",
        "Find guidance for using the UK LogiWare safety training system.",
    ],
};


function TraineeUtilityPage({
    type,
}) {
    const [
        progress,
        setProgress,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(
        type ===
        "progress"
    );


    const [
        error,
        setError,
    ] = useState("");


    const [
        title,
        subtitle,
    ] =
        TITLES[type] ||
        [
            "Trainee",
            "Safety training.",
        ];


    useEffect(() => {
        if (
            type !==
            "progress"
        ) {
            return undefined;
        }


        let mounted =
            true;


        api.get(
            "/users/me/training-progress"
        )
            .then(
                (
                    response
                ) => {
                    if (
                        !mounted
                    ) {
                        return;
                    }


                    setProgress(
                        Array.isArray(
                            response.data
                                ?.progress
                        )
                            ? response.data
                                .progress
                            : []
                    );
                }
            )
            .catch(
                (
                    error
                ) => {
                    if (
                        !mounted
                    ) {
                        return;
                    }


                    setError(
                        getApiErrorMessage(
                            error,
                            "Unable to load training progress."
                        )
                    );
                }
            )
            .finally(
                () => {
                    if (
                        mounted
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            );


        return () => {
            mounted =
                false;
        };
    }, [
        type,
    ]);


    const average =
        useMemo(
            () => {
                if (
                    !progress.length
                ) {
                    return 0;
                }


                return Math.round(
                    progress.reduce(
                        (
                            sum,
                            item
                        ) =>
                            sum +
                            Number(
                                item.progress ||
                                0
                            ),
                        0
                    ) /
                    progress.length
                );
            },
            [
                progress,
            ]
        );


    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainee"
                title={title}
                subtitle={subtitle}
            >
                <div className="app-page">

                    <LoadingCard
                        message="Loading..."
                    />

                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainee"
            title={title}
            subtitle={subtitle}
        >
            <div className="app-page space-y-5">

                <FeedbackAlert
                    type="error"
                    message={error}
                    onClose={() =>
                        setError("")
                    }
                />


                {/* PROGRESS */}

                {type ===
                    "progress" && (
                        <>

                            <section className="grid gap-4 md:grid-cols-3">

                                <Summary
                                    label="Overall Progress"
                                    value={`${average}%`}
                                />


                                <Summary
                                    label="Modules Assigned"
                                    value={
                                        progress.length
                                    }
                                />


                                <Summary
                                    label="Completed"
                                    value={
                                        progress.filter(
                                            (
                                                item
                                            ) =>
                                                Number(
                                                    item.progress
                                                ) >=
                                                100
                                        ).length
                                    }
                                />

                            </section>


                            <section className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">

                                <h2 className="text-[13px] font-bold text-[#172033]">
                                    Training Progress
                                </h2>


                                <div className="mt-4 grid gap-3">

                                    {progress.map(
                                        (
                                            item
                                        ) => (
                                            <div
                                                key={
                                                    item.trainingSection
                                                }
                                                className="rounded-lg border border-[#e2e8f0] p-4"
                                            >

                                                <div className="flex items-center justify-between gap-3">

                                                    <strong className="text-[10px] text-[#172033]">
                                                        {formatSection(
                                                            item.trainingSection
                                                        )}
                                                    </strong>


                                                    <span className="text-[9px] font-semibold text-blue-600">
                                                        {Number(
                                                            item.progress ||
                                                            0
                                                        )}
                                                        %
                                                    </span>

                                                </div>


                                                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">

                                                    <div
                                                        className="h-full rounded-full bg-[#1769e8]"
                                                        style={{
                                                            width: `${Number(
                                                                item.progress ||
                                                                0
                                                            )}%`,
                                                        }}
                                                    />

                                                </div>

                                            </div>
                                        )
                                    )}

                                </div>

                            </section>

                        </>
                    )}


                {/* SCENARIOS */}

                {type ===
                    "scenarios" && (

                        <section className="grid gap-4 md:grid-cols-3">

                            {SCENARIOS.map(
                                (
                                    scenario
                                ) => (

                                    <article
                                        key={
                                            scenario.title
                                        }
                                        className="overflow-hidden rounded-xl border border-[#dbe4ef] bg-white shadow-sm"
                                    >

                                        <img
                                            src={
                                                scenario.image
                                            }
                                            alt={
                                                scenario.title
                                            }
                                            className="h-44 w-full object-cover"
                                        />


                                        <div className="p-4">

                                            <h2 className="text-[11px] font-bold text-[#172033]">
                                                {scenario.title}
                                            </h2>


                                            <p className="mt-2 text-[8px] text-[#64748b]">
                                                {scenario.text}
                                            </p>


                                            <button
                                                type="button"
                                                className="mt-4 rounded-lg border border-blue-300 bg-white px-4 py-2 text-[9px] font-semibold text-blue-600"
                                            >
                                                Start Scenario
                                            </button>

                                        </div>

                                    </article>

                                )
                            )}

                        </section>

                    )}


                {/* QUIZZES */}

                {type ===
                    "quizzes" && (

                        <EmptyCard
                            title="No quizzes available yet"
                            text="Quizzes will appear here when they are added to your assigned training modules."
                        />

                    )}


                {/* NOTIFICATIONS */}

                {type ===
                    "notifications" && (

                        <EmptyCard
                            title="Training available"
                            text="Your assigned training modules are ready to continue."
                        />

                    )}


                {/* HELP */}

                {type ===
                    "help" && (

                        <HelpCard />

                    )}

            </div>

        </DashboardLayout>
    );
}


function Summary({
    label,
    value,
}) {
    return (
        <article className="rounded-xl border border-[#dbe4ef] bg-white p-5 shadow-sm">

            <p className="text-[9px] text-[#64748b]">
                {label}
            </p>


            <strong className="mt-2 block text-[24px] text-[#172033]">
                {value}
            </strong>

        </article>
    );
}


function EmptyCard({
    title,
    text,
}) {
    return (
        <section className="rounded-xl border border-[#dbe4ef] bg-white p-10 text-center shadow-sm">

            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                ✓
            </div>


            <h2 className="mt-4 text-[12px] font-bold text-[#172033]">
                {title}
            </h2>


            <p className="mt-2 text-[9px] text-[#64748b]">
                {text}
            </p>

        </section>
    );
}


function HelpCard() {
    return (
        <section className="rounded-xl border border-[#dbe4ef] bg-white p-6 shadow-sm">

            <h2 className="text-[13px] font-bold text-[#172033]">
                How can we help?
            </h2>


            <p className="mt-2 text-[9px] leading-5 text-[#64748b]">
                If you cannot access training, your account credentials,
                or a required module, contact your UK LogiWare Administrator.
            </p>


            <div className="mt-5 rounded-lg border border-blue-100 bg-blue-50 p-4">

                <strong className="text-[10px] text-blue-700">
                    Account and training support
                </strong>


                <p className="mt-1 text-[8px] text-blue-600">
                    Your Administrator can update account access,
                    reset passwords and review training assignments.
                </p>

            </div>

        </section>
    );
}


function formatSection(
    value
) {
    return String(
        value ||
        ""
    )
        .replace(
            /[-_]/g,
            " "
        )
        .replace(
            /\b\w/g,
            (
                letter
            ) =>
                letter.toUpperCase()
        );
}


export default TraineeUtilityPage;