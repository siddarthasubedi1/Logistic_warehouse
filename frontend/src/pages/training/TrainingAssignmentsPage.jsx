import {
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import TrainingManagementShell from "../../components/training/TrainingManagementShell";
import TrainingAssignmentForm from "../../components/training/TrainingAssignmentForm";
import TrainingAssignmentTable from "../../components/training/TrainingAssignmentTable";

import FeedbackAlert from "../../components/ui/FeedbackAlert";
import LoadingCard from "../../components/ui/LoadingCard";
import EmptyState from "../../components/ui/EmptyState";

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

    // ======================================================
    // DATA
    // ======================================================

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


    // ======================================================
    // FORM
    // ======================================================

    const [
        programmeId,
        setProgrammeId,
    ] = useState("");


    const [
        traineeId,
        setTraineeId,
    ] = useState("");


    // ======================================================
    // STATE
    // ======================================================

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


    // ======================================================
    // FEEDBACK
    // ======================================================

    const [
        errorMessage,
        setErrorMessage,
    ] = useState("");


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    const clearFeedback = () => {
        setErrorMessage("");
        setSuccessMessage("");
    };


    // ======================================================
    // LOAD PROGRAMMES
    // ======================================================

    const loadProgrammes = async () => {
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


    // ======================================================
    // LOAD TRAINEES
    // ======================================================

    const loadTrainees = async () => {
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


    // ======================================================
    // LOAD ASSIGNMENTS
    // ======================================================

    const loadAssignments = async () => {
        const response =
            await api.get(
                "/training-assignments"
            );


        const assignmentList =
            parseArrayResponse(
                response.data,
                "assignments"
            );


        setAssignments(
            assignmentList
        );
    };


    // ======================================================
    // LOAD PAGE
    // ======================================================

    const loadPageData = async () => {
        setLoading(
            true
        );


        clearFeedback();


        try {
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
                    "Unable to load training assignment data."
                )
            );

        } finally {
            setLoading(
                false
            );
        }
    };


    useEffect(() => {
        loadPageData();
    }, []);


    // ======================================================
    // CREATE ASSIGNMENT
    // ======================================================

    const handleAssign = async (
        event
    ) => {
        if (event) {
            event.preventDefault();
        }


        clearFeedback();


        if (!programmeId) {
            setErrorMessage(
                "Please select a training programme."
            );

            return;
        }


        if (!traineeId) {
            setErrorMessage(
                "Please select a Trainee."
            );

            return;
        }


        try {
            setSaving(
                true
            );


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


            setProgrammeId(
                ""
            );


            setTraineeId(
                ""
            );


            await loadAssignments();

        } catch (error) {
            console.error(
                "Create training assignment error:",
                error
            );


            setErrorMessage(
                getApiErrorMessage(
                    error,
                    "Unable to assign the training programme."
                )
            );

        } finally {
            setSaving(
                false
            );
        }
    };


    // ======================================================
    // DEACTIVATE
    // ======================================================

    const handleDeactivate = async (
        assignment
    ) => {
        if (!assignment?._id) {
            return;
        }


        const confirmed =
            window.confirm(
                "Are you sure you want to deactivate this training assignment?"
            );


        if (!confirmed) {
            return;
        }


        clearFeedback();


        try {
            setActionLoadingId(
                assignment._id
            );


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
            setActionLoadingId(
                ""
            );
        }
    };


    // ======================================================
    // REACTIVATE
    // ======================================================

    const handleReactivate = async (
        assignment
    ) => {
        if (!assignment?._id) {
            return;
        }


        clearFeedback();


        try {
            setActionLoadingId(
                assignment._id
            );


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
            setActionLoadingId(
                ""
            );
        }
    };


    // ======================================================
    // SEARCH
    // ======================================================

    const filteredAssignments =
        useMemo(() => {
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
                    const trainee =
                        getAssignmentTrainee(
                            assignment
                        );


                    const programme =
                        getAssignmentProgramme(
                            assignment
                        );


                    const traineeName =
                        getUserDisplayName(
                            trainee,
                            ""
                        );


                    const traineeUsername =
                        trainee?.username ||
                        "";


                    const programmeTitle =
                        programme?.title ||
                        "";


                    const programmeType =
                        programme?.programmeType ||
                        "";


                    const status =
                        assignment?.status ||
                        "";


                    const searchableText =
                        `
                            ${traineeName}
                            ${traineeUsername}
                            ${programmeTitle}
                            ${programmeType}
                            ${status}
                        `.toLowerCase();


                    return searchableText.includes(
                        query
                    );
                }
            );

        }, [
            assignments,
            searchTerm,
        ]);


    // ======================================================
    // COUNTS
    // ======================================================

    const activeAssignments =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status ===
                "active"
        ).length;


    const inactiveAssignments =
        assignments.filter(
            (
                assignment
            ) =>
                assignment.status ===
                "inactive"
        ).length;


    // ======================================================
    // PAGE
    // ======================================================

    return (
        <DashboardLayout
            role="admin"
            showHeader={false}
        >

            <div className="space-y-5">

                {/* ================================================= */}
                {/* HERO */}
                {/* ================================================= */}

                <section
                    className="
                        relative
                        overflow-hidden
                        rounded-2xl
                        border
                        border-blue-200
                        bg-gradient-to-r
                        from-[#073763]
                        via-[#0b4f87]
                        to-[#1769aa]
                        px-5
                        py-6
                        text-white
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
                            pointer-events-none
                            absolute
                            right-24
                            top-8
                            hidden
                            h-24
                            w-24
                            rotate-12
                            rounded-2xl
                            border
                            border-white/10
                            lg:block
                        "
                    />


                    <div
                        className="
                            relative
                            z-10
                            flex
                            flex-col
                            gap-5
                            md:flex-row
                            md:items-center
                            md:justify-between
                        "
                    >

                        <div
                            className="
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
                                    className="h-6 w-6"
                                >
                                    <circle
                                        cx="8"
                                        cy="8"
                                        r="3"
                                    />

                                    <path d="M3 20c.5-4 2-6 5-6" />

                                    <rect
                                        x="13"
                                        y="6"
                                        width="8"
                                        height="12"
                                        rx="2"
                                    />

                                    <path d="m15.5 12 1.5 1.5 2.5-3" />
                                </svg>
                            </div>


                            <div>

                                <p
                                    className="
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.18em]
                                        text-blue-100
                                    "
                                >
                                    Administrator Training Control
                                </p>


                                <h1
                                    className="
                                        mt-1
                                        text-xl
                                        font-bold
                                        sm:text-2xl
                                    "
                                >
                                    Training Assignments
                                </h1>


                                <p
                                    className="
                                        mt-2
                                        max-w-2xl
                                        text-[11px]
                                        leading-5
                                        text-blue-100
                                        sm:text-xs
                                    "
                                >
                                    Assign active workplace safety
                                    programmes to Trainees and manage
                                    existing programme access.
                                </p>

                            </div>

                        </div>


                        <div
                            className="
                                flex
                                flex-wrap
                                gap-2
                            "
                        >

                            <HeroBadge
                                value={
                                    programmes.length
                                }
                                label="Programmes"
                            />


                            <HeroBadge
                                value={
                                    trainees.length
                                }
                                label="Trainees"
                            />


                            <HeroBadge
                                value={
                                    assignments.length
                                }
                                label="Assignments"
                            />

                        </div>

                    </div>

                </section>


                {/* ================================================= */}
                {/* STATS */}
                {/* ================================================= */}

                <section
                    className="
                        grid
                        gap-3
                        sm:grid-cols-2
                        lg:grid-cols-4
                    "
                >

                    <AssignmentStat
                        title="Active Programmes"
                        value={
                            programmes.length
                        }
                        type="programme"
                    />


                    <AssignmentStat
                        title="Available Trainees"
                        value={
                            trainees.length
                        }
                        type="trainee"
                    />


                    <AssignmentStat
                        title="Active Assignments"
                        value={
                            activeAssignments
                        }
                        type="active"
                    />


                    <AssignmentStat
                        title="Inactive Assignments"
                        value={
                            inactiveAssignments
                        }
                        type="inactive"
                    />

                </section>


                {/* ================================================= */}
                {/* MAIN */}
                {/* ================================================= */}

                <TrainingManagementShell
                    title="Training Assignment Management"
                    description="Select an active programme and Trainee, then manage the assignment from the list below."
                >

                    <FeedbackAlert
                        type="success"
                        message={
                            successMessage
                        }
                        onClose={() =>
                            setSuccessMessage(
                                ""
                            )
                        }
                    />


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


                    {loading ? (
                        <LoadingCard
                            message="Loading training assignments..."
                        />
                    ) : (
                        <>

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


                            {/* SEARCH */}

                            <section
                                className="
                                    overflow-hidden
                                    rounded-2xl
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
                                        bg-gradient-to-r
                                        from-white
                                        to-blue-50/40
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
                                                text-sm
                                                font-bold
                                                text-slate-900
                                            "
                                        >
                                            Assignment Records
                                        </h2>


                                        <p
                                            className="
                                                mt-1
                                                text-[10px]
                                                text-slate-500
                                            "
                                        >
                                            Search existing Trainee
                                            programme assignments.
                                        </p>

                                    </div>


                                    <span
                                        className="
                                            w-fit
                                            rounded-full
                                            bg-blue-50
                                            px-3
                                            py-1.5
                                            text-[9px]
                                            font-semibold
                                            text-blue-700
                                        "
                                    >
                                        {filteredAssignments.length} Visible
                                    </span>

                                </div>


                                <div className="p-4 sm:p-5">

                                    <label
                                        htmlFor="assignment-search"
                                        className="
                                            mb-2
                                            block
                                            text-[10px]
                                            font-semibold
                                            uppercase
                                            tracking-wide
                                            text-slate-500
                                        "
                                    >
                                        Search Assignments
                                    </label>


                                    <div className="relative">

                                        <div
                                            className="
                                                pointer-events-none
                                                absolute
                                                inset-y-0
                                                left-0
                                                flex
                                                items-center
                                                pl-3.5
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
                                                <circle
                                                    cx="11"
                                                    cy="11"
                                                    r="7"
                                                />

                                                <path d="m20 20-3.5-3.5" />
                                            </svg>
                                        </div>


                                        <input
                                            id="assignment-search"
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
                                            placeholder="Search by Trainee, programme, type or status..."
                                            className="
                                                h-11
                                                w-full
                                                rounded-xl
                                                border
                                                border-slate-300
                                                bg-white
                                                pl-10
                                                pr-4
                                                text-xs
                                                text-slate-800
                                                outline-none
                                                transition
                                                placeholder:text-slate-400
                                                focus:border-blue-500
                                                focus:ring-2
                                                focus:ring-blue-100
                                            "
                                        />

                                    </div>

                                </div>

                            </section>


                            {assignments.length ===
                                0 ? (
                                <EmptyState
                                    title="No training assignments found."
                                    description="Use the form above to assign an active training programme to a Trainee."
                                />
                            ) : filteredAssignments.length ===
                                0 ? (
                                <EmptyState
                                    title="No matching assignments found."
                                    description="Try a different search term."
                                />
                            ) : (
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
                            )}

                        </>
                    )}

                </TrainingManagementShell>


                {/* ================================================= */}
                {/* INFO */}
                {/* ================================================= */}

                <section
                    className="
                        rounded-2xl
                        border
                        border-blue-100
                        bg-gradient-to-r
                        from-blue-50
                        via-white
                        to-emerald-50
                        p-5
                    "
                >

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-9
                                w-9
                                shrink-0
                                items-center
                                justify-center
                                rounded-xl
                                bg-white
                                text-blue-600
                                shadow-sm
                            "
                        >
                            <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="1.8"
                                className="h-5 w-5"
                            >
                                <path d="M12 3 5 6v5c0 5 2.7 8.2 7 10 4.3-1.8 7-5 7-10V6l-7-3Z" />

                                <path d="m9 12 2 2 4-4" />
                            </svg>
                        </div>


                        <div>

                            <p
                                className="
                                    text-xs
                                    font-bold
                                    text-slate-800
                                "
                            >
                                Training Access Control
                            </p>


                            <p
                                className="
                                    mt-1
                                    max-w-4xl
                                    text-[10px]
                                    leading-5
                                    text-slate-500
                                "
                            >
                                Programme assignments determine which
                                specific Sprint 2 programmes appear in
                                each Trainee's My Training area.
                            </p>

                        </div>

                    </div>

                </section>

            </div>

        </DashboardLayout>
    );
}


// ======================================================
// HERO BADGE
// ======================================================

function HeroBadge({
    value,
    label,
}) {
    return (
        <span
            className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-white/15
                bg-white/10
                px-3
                py-1.5
                text-[9px]
                font-semibold
            "
        >
            <strong className="text-white">
                {value}
            </strong>

            <span className="text-blue-100">
                {label}
            </span>
        </span>
    );
}


// ======================================================
// STAT CARD
// ======================================================

function AssignmentStat({
    title,
    value,
    type,
}) {
    const themes = {
        programme:
            "bg-blue-50 text-blue-700",

        trainee:
            "bg-indigo-50 text-indigo-700",

        active:
            "bg-emerald-50 text-emerald-700",

        inactive:
            "bg-red-50 text-red-700",
    };


    return (
        <div
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
                    items-center
                    gap-3
                "
            >

                <div
                    className={`
                        flex
                        h-9
                        w-9
                        items-center
                        justify-center
                        rounded-xl
                        ${themes[type]}
                    `}
                >
                    <StatIcon
                        type={
                            type
                        }
                    />
                </div>


                <div>

                    <p
                        className="
                            text-lg
                            font-bold
                            text-slate-900
                        "
                    >
                        {value}
                    </p>


                    <p
                        className="
                            text-[9px]
                            font-semibold
                            text-slate-500
                        "
                    >
                        {title}
                    </p>

                </div>

            </div>

        </div>
    );
}


// ======================================================
// STAT ICON
// ======================================================

function StatIcon({
    type,
}) {

    if (
        type ===
        "trainee"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
            >
                <circle
                    cx="12"
                    cy="8"
                    r="3"
                />

                <path d="M5 20c.5-4 3-6 7-6s6.5 2 7 6" />
            </svg>
        );
    }


    if (
        type ===
        "active"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="m8 12 2.5 2.5L16 9" />
            </svg>
        );
    }


    if (
        type ===
        "inactive"
    ) {
        return (
            <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                className="h-4 w-4"
            >
                <circle
                    cx="12"
                    cy="12"
                    r="9"
                />

                <path d="M8 12h8" />
            </svg>
        );
    }


    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-4 w-4"
        >
            <rect
                x="4"
                y="4"
                width="16"
                height="16"
                rx="3"
            />

            <path d="M8 9h8" />

            <path d="M8 13h8" />
        </svg>
    );
}


export default TrainingAssignmentsPage;