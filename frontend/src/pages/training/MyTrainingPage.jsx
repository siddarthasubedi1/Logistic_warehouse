import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


// ======================================================
// HELPERS
// ======================================================

function programmeTypeLabel(type) {
    if (type === "manual-handling") {
        return "Manual Handling";
    }


    if (type === "working-at-height") {
        return "Working at Height";
    }


    return type || "Training";
}


function getTrainerName(owner) {
    if (!owner) {
        return "Trainer";
    }


    const name =
        `${owner.firstName || ""} ${owner.lastName || ""}`.trim();


    return (
        name ||
        owner.username ||
        "Trainer"
    );
}


// ======================================================
// COMPONENT
// ======================================================

function MyTrainingPage() {
    const navigate =
        useNavigate();


    const [
        assignments,
        setAssignments,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    // ==================================================
    // LOAD TRAINING
    // ==================================================

    const loadTraining =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    setError("");


                    const response =
                        await api.get(
                            "/my-training"
                        );


                    const assignmentList =
                        Array.isArray(
                            response.data
                        )
                            ? response.data
                            : response.data
                                ?.assignments ||
                            [];


                    setAssignments(
                        assignmentList
                    );

                } catch (error) {
                    console.error(
                        "Load my training error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load your training programmes."
                    );

                } finally {
                    setLoading(false);
                }
            },
            []
        );


    useEffect(() => {
        loadTraining();
    }, [
        loadTraining,
    ]);


    // ==================================================
    // START LEARNING
    // ==================================================

    const startLearning =
        (programmeId) => {

            navigate(
                `/my-training/${programmeId}`
            );
        };


    // ==================================================
    // UI
    // ==================================================

    return (
        <DashboardLayout
            role="trainee"

            title="My Training"

            subtitle="View and access the workplace safety programmes assigned to you."
        >

            <div className="space-y-5 p-5 lg:p-6">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                        Workplace Safety
                    </p>


                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        My Training Programmes
                    </h2>


                    <p className="mt-1 text-xs text-slate-500">
                        Select an assigned programme to begin learning.
                    </p>

                </section>


                {/* ==========================================
                    ERROR
                ========================================== */}

                {
                    error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-xs font-semibold text-red-700">
                            {error}
                        </div>
                    )
                }


                {/* ==========================================
                    LOADING
                ========================================== */}

                {
                    loading && (

                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                            <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />


                            <p className="mt-4 text-sm text-slate-500">
                                Loading your training programmes...
                            </p>

                        </div>
                    )
                }


                {/* ==========================================
                    EMPTY
                ========================================== */}

                {
                    !loading &&
                    assignments.length === 0 && (

                        <div className="rounded-xl border border-slate-200 bg-white p-12 text-center shadow-sm">

                            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-xl">
                                📚
                            </div>


                            <h3 className="mt-4 text-sm font-bold text-slate-800">
                                No Training Assigned
                            </h3>


                            <p className="mt-2 text-xs text-slate-500">
                                You do not currently have an active training programme assigned to you.
                            </p>

                        </div>
                    )
                }


                {/* ==========================================
                    PROGRAMMES
                ========================================== */}

                {
                    !loading &&
                    assignments.length > 0 && (

                        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">

                            {
                                assignments.map(
                                    (assignment) => {

                                        const programme =
                                            assignment.programme;


                                        if (!programme) {
                                            return null;
                                        }


                                        return (
                                            <article
                                                key={
                                                    assignment._id
                                                }

                                                className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
                                            >

                                                {/* HEADER */}

                                                <div className="border-b border-slate-100 p-5">

                                                    <div className="flex items-start justify-between gap-3">

                                                        <div>

                                                            <p className="text-[10px] font-semibold uppercase tracking-wide text-blue-600">
                                                                {
                                                                    programmeTypeLabel(
                                                                        programme
                                                                            .programmeType
                                                                    )
                                                                }
                                                            </p>


                                                            <h3 className="mt-2 text-base font-bold text-slate-900">
                                                                {
                                                                    programme.title
                                                                }
                                                            </h3>

                                                        </div>


                                                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-[10px] font-semibold text-emerald-700">
                                                            Active
                                                        </span>

                                                    </div>


                                                    <p className="mt-3 line-clamp-3 text-xs leading-5 text-slate-500">
                                                        {
                                                            programme.description
                                                        }
                                                    </p>

                                                </div>


                                                {/* INFORMATION */}

                                                <div className="p-5">

                                                    <div className="grid grid-cols-2 gap-4">

                                                        <div>

                                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                Pass Mark
                                                            </p>


                                                            <p className="mt-1 text-lg font-bold text-slate-900">
                                                                {
                                                                    programme.passMark
                                                                }
                                                                %
                                                            </p>

                                                        </div>


                                                        <div className="text-right">

                                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">
                                                                Trainer
                                                            </p>


                                                            <p className="mt-1 text-xs font-semibold text-slate-700">
                                                                {
                                                                    getTrainerName(
                                                                        programme.owner
                                                                    )
                                                                }
                                                            </p>

                                                        </div>

                                                    </div>


                                                    {/* START */}

                                                    <button
                                                        type="button"

                                                        onClick={
                                                            () =>
                                                                startLearning(
                                                                    programme._id
                                                                )
                                                        }

                                                        className="mt-5 w-full rounded-lg bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700"
                                                    >
                                                        Start Learning
                                                    </button>

                                                </div>

                                            </article>
                                        );
                                    }
                                )
                            }

                        </div>
                    )
                }

            </div>

        </DashboardLayout>
    );
}


export default MyTrainingPage;