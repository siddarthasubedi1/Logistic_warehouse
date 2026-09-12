import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TrainerHeader from "../components/trainer/TrainerHeader";

import ActionButton from "../components/ui/ActionButton";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";
import StatusBadge from "../components/ui/StatusBadge";

import api from "../services/api";

import {
    formatProgrammeType,
    getApiErrorMessage,
    parseArrayResponse,
} from "../utils/training";

import {
    getSessionUser,
} from "../utils/session";


function TrainerDashboard() {
    const navigate =
        useNavigate();


    const user =
        getSessionUser();


    const [
        programmes,
        setProgrammes,
    ] = useState([]);


    const [
        assignments,
        setAssignments,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    useEffect(() => {
        let active =
            true;


        const loadDashboard =
            async () => {
                try {
                    setLoading(
                        true
                    );

                    setErrorMessage(
                        ""
                    );


                    const results =
                        await Promise.allSettled([
                            api.get(
                                "/training-programmes"
                            ),

                            api.get(
                                "/training-assignments"
                            ),
                        ]);


                    if (!active) {
                        return;
                    }


                    if (
                        results[0].status ===
                        "fulfilled"
                    ) {
                        setProgrammes(
                            parseArrayResponse(
                                results[0].value.data,
                                "programmes"
                            )
                        );
                    }


                    if (
                        results[1].status ===
                        "fulfilled"
                    ) {
                        setAssignments(
                            parseArrayResponse(
                                results[1].value.data,
                                "assignments"
                            )
                        );
                    }


                    if (
                        results[0].status ===
                        "rejected" &&
                        results[1].status ===
                        "rejected"
                    ) {
                        throw results[0].reason;
                    }

                } catch (error) {
                    console.error(
                        "Trainer dashboard error:",
                        error
                    );


                    if (
                        active
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load Trainer dashboard data."
                            )
                        );
                    }

                } finally {
                    if (
                        active
                    ) {
                        setLoading(
                            false
                        );
                    }
                }
            };


        loadDashboard();


        return () => {
            active =
                false;
        };
    }, []);


    const assignedSections =
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? user.assignedTrainingSections
            : [];


    const activeProgrammes =
        programmes.filter(
            (
                programme
            ) =>
                programme.status ===
                "active"
        );


    const activeAssignments =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status !==
                "inactive"
        );


    const displayedProgrammes =
        useMemo(
            () =>
                programmes.slice(
                    0,
                    4
                ),
            [
                programmes,
            ]
        );


    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >
                <LoadingCard
                    message="Loading Trainer dashboard..."
                />
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainer"
            showHeader={false}
        >
            <TrainerHeader
                user={
                    user
                }
            />


            <div
                className="
                    space-y-4
                    pt-4
                    sm:pt-5
                "
            >
                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage(
                            ""
                        )
                    }
                />


                {/* MODULE + STATS */}

                <section
                    className="
                        grid
                        gap-3
                        lg:grid-cols-[1.5fr_repeat(3,minmax(0,1fr))]
                    "
                >
                    <article
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-4
                            shadow-sm
                        "
                    >
                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-3
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[8px]
                                        font-semibold
                                        text-slate-500
                                    "
                                >
                                    My Training Area
                                </p>


                                <h2
                                    className="
                                        mt-2
                                        text-[14px]
                                        font-bold
                                        text-[#172033]
                                    "
                                >
                                    {assignedSections.length >
                                        0
                                        ? assignedSections
                                            .map(
                                                formatProgrammeType
                                            )
                                            .join(", ")
                                        : "No training area assigned"}
                                </h2>
                            </div>


                            <StatusBadge
                                status={
                                    assignedSections.length >
                                        0
                                        ? "active"
                                        : "pending"
                                }
                            />
                        </div>


                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
                                )
                            }
                            className="
                                mt-4
                                w-full
                                sm:w-auto
                            "
                        >
                            View Programmes
                        </ActionButton>
                    </article>


                    <StatCard
                        label="Programmes"
                        value={
                            programmes.length
                        }
                    />


                    <StatCard
                        label="Active Programmes"
                        value={
                            activeProgrammes.length
                        }
                    />


                    <StatCard
                        label="Active Assignments"
                        value={
                            activeAssignments.length
                        }
                    />
                </section>


                {/* PROGRAMMES */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            flex
                            flex-col
                            gap-3
                            border-b
                            border-slate-100
                            px-4
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                            sm:px-5
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[11px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Training Programmes
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[8px]
                                    font-medium
                                    text-slate-600
                                "
                            >
                                Programmes available to your Trainer account.
                            </p>
                        </div>


                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
                                )
                            }
                        >
                            View All
                        </ActionButton>
                    </div>


                    {displayedProgrammes.length ===
                        0 ? (
                        <div
                            className="
                                p-8
                                text-center
                            "
                        >
                            <p
                                className="
                                    text-[9px]
                                    font-medium
                                    text-slate-600
                                "
                            >
                                No training programmes available.
                            </p>
                        </div>
                    ) : (
                        <div
                            className="
                                grid
                                gap-3
                                p-4
                                sm:grid-cols-2
                                xl:grid-cols-4
                                sm:p-5
                            "
                        >
                            {displayedProgrammes.map(
                                (
                                    programme
                                ) => (
                                    <article
                                        key={
                                            programme._id
                                        }
                                        className="
                                            rounded-lg
                                            border
                                            border-slate-200
                                            bg-[#fafbfd]
                                            p-4
                                        "
                                    >
                                        <span
                                            className="
                                                rounded-full
                                                bg-blue-50
                                                px-2.5
                                                py-1
                                                text-[7px]
                                                font-semibold
                                                text-blue-600
                                            "
                                        >
                                            {formatProgrammeType(
                                                programme.programmeType
                                            )}
                                        </span>


                                        <h3
                                            className="
                                                mt-3
                                                text-[10px]
                                                font-bold
                                                text-slate-800
                                            "
                                        >
                                            {
                                                programme.title
                                            }
                                        </h3>


                                        <div
                                            className="
                                                mt-3
                                            "
                                        >
                                            <StatusBadge
                                                status={
                                                    programme.status
                                                }
                                            />
                                        </div>


                                        <button
                                            type="button"
                                            onClick={() =>
                                                navigate(
                                                    `/training-programmes/${programme._id}/sections`
                                                )
                                            }
                                            className="
                                                mt-4
                                                text-[8px]
                                                font-semibold
                                                text-blue-600
                                            "
                                        >
                                            Manage Content →
                                        </button>
                                    </article>
                                )
                            )}
                        </div>
                    )}
                </section>
            </div>
        </DashboardLayout>
    );
}


function StatCard({
    label,
    value,
}) {
    return (
        <article
            className="
                rounded-xl
                border
                border-slate-200
                bg-white
                p-4
                shadow-sm
            "
        >
            <p
                className="
                    text-[8px]
                    font-medium
                    text-slate-600
                "
            >
                {label}
            </p>


            <p
                className="
                    mt-2
                    text-[24px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </article>
    );
}


export default TrainerDashboard;