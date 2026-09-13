import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingAssignmentForm from "../../components/training/TrainingAssignmentForm";
import TrainingAssignmentTable from "../../components/training/TrainingAssignmentTable";

import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";

import api from "../../services/api";

import {
    getActiveProgrammes,
    getAssignableTrainees,
    getAssignmentProgramme,
    getAssignmentTrainee,
    getUserDisplayName,
    parseArrayResponse,
    getApiErrorMessage,
} from "../../utils/training";


function TrainingAssignmentsPage() {
    const [
        programmes,
        setProgrammes,
    ] = useState([]);

    const [
        trainees,
        setTrainees,
    ] = useState([]);

    const [
        assignments,
        setAssignments,
    ] = useState([]);

    const [
        programmeId,
        setProgrammeId,
    ] = useState("");

    const [
        traineeId,
        setTraineeId,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(true);

    const [
        saving,
        setSaving,
    ] = useState(false);

    const [
        actionLoadingId,
        setActionLoadingId,
    ] = useState("");

    const [
        searchTerm,
        setSearchTerm,
    ] = useState("");

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");

    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const clearFeedback =
        () => {
            setErrorMessage("");
            setSuccessMessage("");
        };


    /* =====================================================
       LOAD PROGRAMMES
    ===================================================== */

    const loadProgrammes =
        async () => {
            const response =
                await api.get(
                    "/training-programmes"
                );

            const programmeList =
                parseArrayResponse(
                    response.data,
                    "programmes"
                );

            setProgrammes(
                getActiveProgrammes(
                    programmeList
                )
            );
        };


    /* =====================================================
       LOAD TRAINEES
    ===================================================== */

    const loadTrainees =
        async () => {
            const response =
                await api.get(
                    "/admin/users"
                );

            const userList =
                parseArrayResponse(
                    response.data,
                    "users"
                );

            setTrainees(
                getAssignableTrainees(
                    userList
                )
            );
        };


    /* =====================================================
       LOAD ASSIGNMENTS
    ===================================================== */

    const loadAssignments =
        async () => {
            const response =
                await api.get(
                    "/training-assignments"
                );

            setAssignments(
                parseArrayResponse(
                    response.data,
                    "assignments"
                )
            );
        };


    /* =====================================================
       PAGE LOAD
    ===================================================== */

    const loadPageData =
        async () => {
            try {
                setLoading(true);

                clearFeedback();

                await Promise.all([
                    loadProgrammes(),
                    loadTrainees(),
                    loadAssignments(),
                ]);

            } catch (error) {
                console.error(
                    "Load training assignments error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to load training assignments."
                    )
                );

            } finally {
                setLoading(false);
            }
        };


    useEffect(() => {
        loadPageData();
    }, []);


    /* =====================================================
       ASSIGN
    ===================================================== */

    const handleAssign =
        async (
            event
        ) => {
            event.preventDefault();

            clearFeedback();


            if (
                !programmeId ||
                !traineeId
            ) {
                setErrorMessage(
                    "Please select both a programme and a Trainee."
                );

                return;
            }


            try {
                setSaving(true);


                const response =
                    await api.post(
                        "/training-assignments",
                        {
                            programmeId,
                            traineeId,
                        }
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "Training programme assigned successfully."
                );


                setProgrammeId("");
                setTraineeId("");


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Create assignment error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to assign the training programme."
                    )
                );

            } finally {
                setSaving(false);
            }
        };


    /* =====================================================
       DEACTIVATE
    ===================================================== */

    const handleDeactivate =
        async (
            assignment
        ) => {
            if (
                !assignment?._id
            ) {
                return;
            }


            const confirmed =
                window.confirm(
                    "Deactivate this training assignment?"
                );


            if (
                !confirmed
            ) {
                return;
            }


            try {
                setActionLoadingId(
                    assignment._id
                );

                clearFeedback();


                const response =
                    await api.patch(
                        `/training-assignments/${assignment._id}/deactivate`
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "Training assignment deactivated successfully."
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Deactivate assignment error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to deactivate the training assignment."
                    )
                );

            } finally {
                setActionLoadingId("");
            }
        };


    /* =====================================================
       REACTIVATE
    ===================================================== */

    const handleReactivate =
        async (
            assignment
        ) => {
            if (
                !assignment?._id
            ) {
                return;
            }


            try {
                setActionLoadingId(
                    assignment._id
                );

                clearFeedback();


                const response =
                    await api.patch(
                        `/training-assignments/${assignment._id}/reactivate`
                    );


                setSuccessMessage(
                    response.data?.message ||
                    "Training assignment reactivated successfully."
                );


                await loadAssignments();

            } catch (error) {
                console.error(
                    "Reactivate assignment error:",
                    error
                );

                setErrorMessage(
                    getApiErrorMessage(
                        error,
                        "Unable to reactivate the training assignment."
                    )
                );

            } finally {
                setActionLoadingId("");
            }
        };


    /* =====================================================
       FILTER
    ===================================================== */

    const filteredAssignments =
        useMemo(
            () => {
                const query =
                    searchTerm
                        .trim()
                        .toLowerCase();


                if (!query) {
                    return assignments;
                }


                return assignments.filter(
                    (
                        assignment
                    ) => {
                        const programme =
                            getAssignmentProgramme(
                                assignment
                            );


                        const trainee =
                            getAssignmentTrainee(
                                assignment
                            );


                        const text =
                            [
                                programme?.title,
                                programme?.programmeType,
                                trainee?.username,

                                getUserDisplayName(
                                    trainee,
                                    ""
                                ),

                                assignment.status,
                            ]
                                .filter(
                                    Boolean
                                )
                                .join(" ")
                                .toLowerCase();


                        return text.includes(
                            query
                        );
                    }
                );
            },
            [
                assignments,
                searchTerm,
            ]
        );


    const activeAssignments =
        assignments.filter(
            (
                assignment
            ) =>
                String(
                    assignment.status ||
                    ""
                ).toLowerCase() !==
                "inactive"
        ).length;


    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <DashboardLayout
                role="admin"
                showHeader={
                    false
                }
            >
                <div
                    className="
                        app-page
                    "
                >
                    <LoadingCard
                        message="Loading training assignments..."
                    />
                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="admin"
            showHeader={
                false
            }
        >
            <div
                className="
                    app-page
                    space-y-5
                "
            >
                {/* =============================================
                    HERO
                ============================================== */}

                <section
                    className="
                        training-hero
                        relative
                        overflow-hidden
                        rounded-xl
                        px-5
                        py-6
                        shadow-sm
                        sm:px-6
                        lg:px-7
                    "
                >
                    <div
                        className="
                            pointer-events-none
                            absolute
                            -right-16
                            -top-16
                            h-48
                            w-48
                            rounded-full
                            bg-white/10
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            items-start
                            gap-4
                        "
                    >
                        <div
                            className="
                                flex
                                h-12
                                w-12
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                border
                                border-white/15
                                bg-white/10
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="
                                    h-6
                                    w-6
                                "
                            >
                                <rect
                                    x="5"
                                    y="3"
                                    width="14"
                                    height="18"
                                    rx="2"
                                />

                                <path d="M9 8h6" />
                                <path d="M9 12h6" />
                                <path d="M9 16h4" />
                            </svg>
                        </div>


                        <div>
                            <p
                                className="
                                    text-[8px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-blue-100
                                "
                            >
                                Training Management
                            </p>


                            <h1
                                className="
                                    mt-1
                                    text-[20px]
                                    font-bold
                                    text-white
                                "
                            >
                                Training Assignments
                            </h1>


                            <p
                                className="
                                    mt-2
                                    max-w-[610px]
                                    text-[9px]
                                    leading-5
                                    text-blue-100
                                "
                            >
                                Assign active workplace safety programmes
                                to Trainee accounts and manage existing
                                assignments.
                            </p>
                        </div>
                    </div>
                </section>


                {/* =============================================
                    FEEDBACK
                ============================================== */}

                <FeedbackAlert
                    type="success"
                    message={
                        successMessage
                    }
                    onClose={() =>
                        setSuccessMessage("")
                    }
                />


                <FeedbackAlert
                    type="error"
                    message={
                        errorMessage
                    }
                    onClose={() =>
                        setErrorMessage("")
                    }
                />


                {/* =============================================
                    STATS
                ============================================== */}

                <section
                    className="
                        grid
                        gap-4
                        sm:grid-cols-3
                    "
                >
                    <StatCard
                        label="Total Assignments"
                        value={
                            assignments.length
                        }
                    />

                    <StatCard
                        label="Active"
                        value={
                            activeAssignments
                        }
                    />

                    <StatCard
                        label="Assignable Trainees"
                        value={
                            trainees.length
                        }
                    />
                </section>


                {/* =============================================
                    ASSIGNMENT FORM
                ============================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
                        bg-white
                        shadow-sm
                    "
                >
                    <div
                        className="
                            border-b
                            border-[#e8eef5]
                            px-5
                            py-4
                        "
                    >
                        <h2
                            className="
                                text-[13px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Create Assignment
                        </h2>

                        <p
                            className="
                                mt-1
                                text-[9px]
                                text-[#64748b]
                            "
                        >
                            Select an active programme and the Trainee who
                            should receive it.
                        </p>
                    </div>


                    <div
                        className="
                            p-5
                        "
                    >
                        <TrainingAssignmentForm
                            programmes={
                                programmes
                            }
                            trainees={
                                trainees
                            }
                            programmeId={
                                programmeId
                            }
                            traineeId={
                                traineeId
                            }
                            saving={
                                saving
                            }
                            onProgrammeChange={
                                setProgrammeId
                            }
                            onTraineeChange={
                                setTraineeId
                            }
                            onSubmit={
                                handleAssign
                            }
                        />
                    </div>
                </section>


                {/* =============================================
                    TABLE
                ============================================== */}

                <section
                    className="
                        overflow-hidden
                        rounded-xl
                        border
                        border-[#dbe4ef]
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
                            border-[#e8eef5]
                            px-5
                            py-4
                            sm:flex-row
                            sm:items-center
                            sm:justify-between
                        "
                    >
                        <div>
                            <h2
                                className="
                                    text-[13px]
                                    font-bold
                                    text-[#172033]
                                "
                            >
                                Existing Assignments
                            </h2>

                            <p
                                className="
                                    mt-1
                                    text-[9px]
                                    text-[#64748b]
                                "
                            >
                                Manage currently assigned training programmes.
                            </p>
                        </div>


                        <div
                            className="
                                relative
                                w-full
                                sm:w-[260px]
                            "
                        >
                            <span
                                className="
                                    pointer-events-none
                                    absolute
                                    inset-y-0
                                    left-0
                                    flex
                                    items-center
                                    pl-3
                                    text-[#94a3b8]
                                "
                            >
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    className="
                                        h-4
                                        w-4
                                    "
                                >
                                    <circle
                                        cx="11"
                                        cy="11"
                                        r="7"
                                    />

                                    <path d="m20 20-3.5-3.5" />
                                </svg>
                            </span>


                            <input
                                type="search"
                                value={
                                    searchTerm
                                }
                                onChange={(
                                    event
                                ) =>
                                    setSearchTerm(
                                        event.target.value
                                    )
                                }
                                placeholder="Search assignments..."
                                className="
                                    min-h-[40px]
                                    w-full
                                    rounded-lg
                                    border
                                    border-[#cbd5e1]
                                    bg-white
                                    pl-9
                                    pr-3
                                    text-[10px]
                                    text-[#172033]
                                    outline-none
                                    placeholder:text-[#94a3b8]
                                    focus:border-blue-500
                                    focus:ring-2
                                    focus:ring-blue-100
                                "
                            />
                        </div>
                    </div>


                    <TrainingAssignmentTable
                        assignments={
                            filteredAssignments
                        }
                        actionLoadingId={
                            actionLoadingId
                        }
                        onDeactivate={
                            handleDeactivate
                        }
                        onReactivate={
                            handleReactivate
                        }
                    />
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
                border-[#dbe4ef]
                bg-white
                p-5
                shadow-sm
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between
                "
            >
                <div>
                    <p
                        className="
                            text-[9px]
                            text-[#64748b]
                        "
                    >
                        {label}
                    </p>

                    <p
                        className="
                            mt-2
                            text-[23px]
                            font-bold
                            text-[#172033]
                        "
                    >
                        {value}
                    </p>
                </div>


                <div
                    className="
                        flex
                        h-10
                        w-10
                        items-center
                        justify-center
                        rounded-full
                        bg-blue-50
                        text-blue-600
                    "
                >
                    <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        className="
                            h-5
                            w-5
                        "
                    >
                        <path d="M5 12 10 17 19 8" />
                    </svg>
                </div>
            </div>
        </article>
    );
}


export default TrainingAssignmentsPage;