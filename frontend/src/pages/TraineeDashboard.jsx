import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../components/dashboard/DashboardLayout";
import TraineeHeader from "../components/trainee/TraineeHeader";

import ActionButton from "../components/ui/ActionButton";
import FeedbackAlert from "../components/ui/FeedbackAlert";
import LoadingCard from "../components/ui/LoadingCard";
import StatusBadge from "../components/ui/StatusBadge";

import api from "../services/api";

import {
    formatProgrammeType,
    getApiErrorMessage,
    getAssignmentProgramme,
    parseArrayResponse,
} from "../utils/training";

import {
    getSessionUser,
} from "../utils/session";


function TraineeDashboard() {
    const navigate =
        useNavigate();


    const user =
        getSessionUser();


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


                    const response =
                        await api.get(
                            "/my-training"
                        );


                    if (!active) {
                        return;
                    }


                    setAssignments(
                        parseArrayResponse(
                            response.data,
                            "assignments"
                        )
                    );

                } catch (error) {
                    console.error(
                        "Trainee dashboard error:",
                        error
                    );


                    if (
                        active
                    ) {
                        setErrorMessage(
                            getApiErrorMessage(
                                error,
                                "Unable to load your training dashboard."
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


    const validAssignments =
        useMemo(
            () =>
                assignments.filter(
                    (
                        assignment
                    ) =>
                        Boolean(
                            getAssignmentProgramme(
                                assignment
                            )
                        )
                ),
            [
                assignments,
            ]
        );


    const activeAssignments =
        useMemo(
            () =>
                validAssignments.filter(
                    (
                        assignment
                    ) => {
                        const programme =
                            getAssignmentProgramme(
                                assignment
                            );


                        return (
                            assignment.status !==
                            "inactive" &&
                            programme?.status !==
                            "inactive"
                        );
                    }
                ),
            [
                validAssignments,
            ]
        );


    if (
        loading
    ) {
        return (
            <DashboardLayout
                role="trainee"
                showHeader={false}
            >
                <LoadingCard
                    message="Loading your training..."
                />
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainee"
            showHeader={false}
        >
            <TraineeHeader
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


                {/* TRAINING SUMMARY */}

                <section
                    className="
                        flex
                        flex-col
                        gap-3
                        rounded-xl
                        border
                        border-slate-200
                        bg-white
                        p-4
                        shadow-sm
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                        sm:p-5
                    "
                >
                    <div>
                        <h2
                            className="
                                text-[12px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            My Training Modules
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[8px]
                                font-medium
                                text-slate-600
                            "
                        >
                            Training programmes assigned to your account.
                        </p>
                    </div>


                    <div
                        className="
                            flex
                            items-center
                            gap-2
                        "
                    >
                        <span
                            className="
                                text-[8px]
                                font-medium
                                text-slate-600
                            "
                        >
                            {
                                activeAssignments.length
                            } available
                        </span>


                        <ActionButton
                            variant="secondary"
                            onClick={() =>
                                navigate(
                                    "/my-training"
                                )
                            }
                        >
                            View All
                        </ActionButton>
                    </div>
                </section>


                {/* MODULES */}

                {activeAssignments.length ===
                    0 ? (
                    <section
                        className="
                            rounded-xl
                            border
                            border-slate-200
                            bg-white
                            p-8
                            text-center
                            shadow-sm
                        "
                    >
                        <p
                            className="
                                text-[10px]
                                font-semibold
                                text-slate-700
                            "
                        >
                            No training has been assigned yet.
                        </p>
                    </section>
                ) : (
                    <section
                        className="
                            grid
                            gap-4
                            md:grid-cols-2
                        "
                    >
                        {activeAssignments.map(
                            (
                                assignment
                            ) => {
                                const programme =
                                    getAssignmentProgramme(
                                        assignment
                                    );


                                return (
                                    <article
                                        key={
                                            assignment._id
                                        }
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
                                                border-b
                                                border-slate-100
                                                p-4
                                                sm:p-5
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
                                                        programme?.programmeType
                                                    )}
                                                </span>


                                                <StatusBadge
                                                    status={
                                                        programme?.status ||
                                                        "active"
                                                    }
                                                />
                                            </div>


                                            <h3
                                                className="
                                                    mt-4
                                                    text-[15px]
                                                    font-bold
                                                    text-[#172033]
                                                "
                                            >
                                                {
                                                    programme?.title
                                                }
                                            </h3>


                                            {programme?.description && (
                                                <p
                                                    className="
                                                        mt-2
                                                        line-clamp-3
                                                        text-[9px]
                                                        font-medium
                                                        leading-5
                                                        text-slate-600
                                                    "
                                                >
                                                    {
                                                        programme.description
                                                    }
                                                </p>
                                            )}
                                        </div>


                                        <div
                                            className="
                                                p-4
                                                sm:p-5
                                            "
                                        >
                                            <ActionButton
                                                variant="primary"
                                                onClick={() =>
                                                    navigate(
                                                        `/my-training/${programme._id}`
                                                    )
                                                }
                                                className="
                                                    w-full
                                                "
                                            >
                                                Start Learning
                                            </ActionButton>
                                        </div>
                                    </article>
                                );
                            }
                        )}
                    </section>
                )}


                {/* SMALL STATS */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-3
                    "
                >
                    <SmallStat
                        label="Assigned"
                        value={
                            validAssignments.length
                        }
                    />

                    <SmallStat
                        label="Available"
                        value={
                            activeAssignments.length
                        }
                    />

                    <SmallStat
                        label="Account"
                        value="Active"
                    />
                </section>
            </div>
        </DashboardLayout>
    );
}


function SmallStat({
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
                    text-[18px]
                    font-bold
                    text-[#172033]
                "
            >
                {value}
            </p>
        </article>
    );
}


export default TraineeDashboard;