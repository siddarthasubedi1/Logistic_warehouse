import {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


// ======================================================
// HELPERS
// ======================================================

function getUserName(user) {
    if (!user) {
        return "Unknown User";
    }

    const fullName =
        `${user.firstName || ""} ${user.lastName || ""}`.trim();

    return (
        fullName ||
        user.username ||
        user.email ||
        "User"
    );
}


function programmeTypeLabel(type) {
    if (type === "manual-handling") {
        return "Manual Handling";
    }

    if (type === "working-at-height") {
        return "Working at Height";
    }

    return type || "Unknown";
}


// ======================================================
// COMPONENT
// ======================================================

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
        processingId,
        setProcessingId,
    ] = useState("");

    const [
        message,
        setMessage,
    ] = useState("");

    const [
        error,
        setError,
    ] = useState("");

    const [
        search,
        setSearch,
    ] = useState("");


    // ==================================================
    // LOAD DATA
    // ==================================================

    const loadData =
        useCallback(
            async () => {
                try {
                    setLoading(true);

                    setError("");

                    const [
                        programmeResponse,
                        userResponse,
                        assignmentResponse,
                    ] =
                        await Promise.all([
                            api.get(
                                "/training-programmes"
                            ),

                            api.get(
                                "/admin/users"
                            ),

                            api.get(
                                "/training-assignments"
                            ),
                        ]);


                    // ==================================================
                    // PROGRAMMES
                    //
                    // Supports:
                    //
                    // [
                    //   {...}
                    // ]
                    //
                    // OR
                    //
                    // {
                    //   programmes: [...]
                    // }
                    // ==================================================

                    const programmeList =
                        Array.isArray(
                            programmeResponse.data
                        )
                            ? programmeResponse.data
                            : programmeResponse.data
                                ?.programmes ||
                            [];


                    const activeProgrammes =
                        programmeList.filter(
                            (programme) =>
                                programme.status ===
                                "active"
                        );


                    setProgrammes(
                        activeProgrammes
                    );


                    // ==================================================
                    // USERS
                    //
                    // IMPORTANT:
                    //
                    // Your existing backend:
                    //
                    // GET /api/admin/users
                    //
                    // RETURNS A DIRECT ARRAY.
                    // ==================================================

                    const userList =
                        Array.isArray(
                            userResponse.data
                        )
                            ? userResponse.data
                            : userResponse.data
                                ?.users ||
                            [];


                    console.log(
                        "Admin users response:",
                        userList
                    );


                    // ==================================================
                    // ONLY ACTIVE CREATED TRAINEES
                    // ==================================================

                    const traineeList =
                        userList.filter(
                            (user) =>
                                user.role ===
                                "trainee" &&
                                user.status ===
                                "active" &&
                                user.accountStatus ===
                                "created"
                        );


                    console.log(
                        "Available trainees:",
                        traineeList
                    );


                    setTrainees(
                        traineeList
                    );


                    // ==================================================
                    // ASSIGNMENTS
                    // ==================================================

                    const assignmentList =
                        Array.isArray(
                            assignmentResponse.data
                        )
                            ? assignmentResponse.data
                            : assignmentResponse.data
                                ?.assignments ||
                            [];


                    setAssignments(
                        assignmentList
                    );

                } catch (error) {
                    console.error(
                        "Load training assignments error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load training assignments."
                    );

                } finally {
                    setLoading(false);
                }
            },
            []
        );


    useEffect(() => {
        loadData();
    }, [
        loadData,
    ]);


    // ==================================================
    // FILTER ASSIGNMENTS
    // ==================================================

    const filteredAssignments =
        useMemo(
            () => {
                const value =
                    search
                        .trim()
                        .toLowerCase();


                if (!value) {
                    return assignments;
                }


                return assignments.filter(
                    (assignment) => {
                        const text =
                            [
                                assignment
                                    .programme
                                    ?.title,

                                programmeTypeLabel(
                                    assignment
                                        .programme
                                        ?.programmeType
                                ),

                                getUserName(
                                    assignment
                                        .trainee
                                ),

                                assignment
                                    .trainee
                                    ?.username,

                                assignment
                                    .status,
                            ]
                                .join(" ")
                                .toLowerCase();


                        return text.includes(
                            value
                        );
                    }
                );
            },
            [
                assignments,
                search,
            ]
        );


    // ==================================================
    // CREATE ASSIGNMENT
    // ==================================================

    const handleAssign =
        async (event) => {
            event.preventDefault();


            setMessage("");

            setError("");


            if (!programmeId) {
                setError(
                    "Please select a training programme."
                );

                return;
            }


            if (!traineeId) {
                setError(
                    "Please select a Trainee."
                );

                return;
            }


            try {
                setSaving(true);


                await api.post(
                    "/training-assignments",

                    {
                        programmeId,
                        traineeId,
                    }
                );


                setMessage(
                    "Training programme assigned successfully."
                );


                setProgrammeId("");

                setTraineeId("");


                await loadData();

            } catch (error) {
                console.error(
                    "Assign programme error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to assign the programme."
                );

            } finally {
                setSaving(false);
            }
        };


    // ==================================================
    // DEACTIVATE ASSIGNMENT
    // ==================================================

    const deactivateAssignment =
        async (assignment) => {
            const programmeTitle =
                assignment
                    .programme
                    ?.title ||
                "this programme";


            const traineeName =
                getUserName(
                    assignment
                        .trainee
                );


            const confirmed =
                window.confirm(
                    `Remove "${programmeTitle}" from ${traineeName}?`
                );


            if (!confirmed) {
                return;
            }


            try {
                setProcessingId(
                    assignment._id
                );


                setMessage("");

                setError("");


                await api.patch(
                    `/training-assignments/${assignment._id}/deactivate`
                );


                setMessage(
                    "Training assignment removed successfully."
                );


                await loadData();

            } catch (error) {
                console.error(
                    "Deactivate assignment error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to remove the training assignment."
                );

            } finally {
                setProcessingId("");
            }
        };


    // ==================================================
    // REACTIVATE ASSIGNMENT
    // ==================================================

    const reactivateAssignment =
        async (assignment) => {
            const programmeTitle =
                assignment
                    .programme
                    ?.title ||
                "this programme";


            const traineeName =
                getUserName(
                    assignment
                        .trainee
                );


            const confirmed =
                window.confirm(
                    `Reactivate "${programmeTitle}" for ${traineeName}?`
                );


            if (!confirmed) {
                return;
            }


            try {
                setProcessingId(
                    assignment._id
                );


                setMessage("");

                setError("");


                await api.patch(
                    `/training-assignments/${assignment._id}/reactivate`
                );


                setMessage(
                    "Training assignment reactivated successfully."
                );


                await loadData();

            } catch (error) {
                console.error(
                    "Reactivate assignment error:",
                    error
                );


                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to reactivate the training assignment."
                );

            } finally {
                setProcessingId("");
            }
        };


    // ==================================================
    // LOADING
    // ==================================================

    if (loading) {
        return (
            <DashboardLayout
                role="admin"
                title="Training Assignments"
                subtitle="Assign active training programmes to Trainees."
            >

                <div className="flex min-h-[420px] items-center justify-center">

                    <div className="text-center">

                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-600">
                            Loading training assignments...
                        </p>

                    </div>

                </div>

            </DashboardLayout>
        );
    }


    // ==================================================
    // UI
    // ==================================================

    return (
        <DashboardLayout
            role="admin"

            title="Training Assignments"

            subtitle="Assign active training programmes to Trainees."
        >

            <div className="space-y-5 p-5 lg:p-6">

                {/* ==========================================
                    HEADER
                ========================================== */}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <p className="text-[10px] font-semibold uppercase tracking-[0.15em] text-blue-600">
                        Sprint 2
                    </p>


                    <h2 className="mt-1 text-xl font-bold text-slate-900">
                        Training Programme Assignment
                    </h2>


                    <p className="mt-1 text-xs text-slate-500">
                        Assign an active workplace safety training programme to an active Trainee.
                    </p>

                </section>


                {/* ==========================================
                    SUCCESS
                ========================================== */}

                {
                    message && (
                        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-xs font-semibold text-emerald-700">
                            {message}
                        </div>
                    )
                }


                {/* ==========================================
                    ERROR
                ========================================== */}

                {
                    error && (
                        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-xs font-semibold text-red-700">
                            {error}
                        </div>
                    )
                }


                {/* ==========================================
                    ASSIGN PROGRAMME
                ========================================== */}

                <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                    <div>

                        <h3 className="text-base font-bold text-slate-900">
                            Assign Programme
                        </h3>


                        <p className="mt-1 text-xs text-slate-500">
                            Select one programme and one Trainee.
                        </p>

                    </div>


                    <form
                        onSubmit={
                            handleAssign
                        }

                        className="mt-5 grid gap-4 lg:grid-cols-[1fr_1fr_auto]"
                    >

                        {/* ==================================
                            PROGRAMME
                        ================================== */}

                        <label className="block">

                            <span className="text-xs font-semibold text-slate-700">
                                Training Programme *
                            </span>


                            <select
                                value={
                                    programmeId
                                }

                                onChange={
                                    (event) =>
                                        setProgrammeId(
                                            event.target
                                                .value
                                        )
                                }

                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    Select Training Programme
                                </option>


                                {
                                    programmes.map(
                                        (programme) => (
                                            <option
                                                key={
                                                    programme._id
                                                }

                                                value={
                                                    programme._id
                                                }
                                            >
                                                {
                                                    programme.title
                                                }

                                                {" — "}

                                                {
                                                    programmeTypeLabel(
                                                        programme
                                                            .programmeType
                                                    )
                                                }
                                            </option>
                                        )
                                    )
                                }

                            </select>


                            {
                                programmes.length ===
                                0 && (
                                    <p className="mt-2 text-[10px] text-amber-600">
                                        No active training programmes are available.
                                    </p>
                                )
                            }

                        </label>


                        {/* ==================================
                            TRAINEE
                        ================================== */}

                        <label className="block">

                            <span className="text-xs font-semibold text-slate-700">
                                Trainee *
                            </span>


                            <select
                                value={
                                    traineeId
                                }

                                onChange={
                                    (event) =>
                                        setTraineeId(
                                            event.target
                                                .value
                                        )
                                }

                                className="mt-2 w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500"
                            >

                                <option value="">
                                    Select Trainee
                                </option>


                                {
                                    trainees.map(
                                        (trainee) => (
                                            <option
                                                key={
                                                    trainee._id
                                                }

                                                value={
                                                    trainee._id
                                                }
                                            >
                                                {
                                                    getUserName(
                                                        trainee
                                                    )
                                                }

                                                {
                                                    trainee
                                                        .username
                                                        ? ` — ${trainee.username}`
                                                        : ""
                                                }
                                            </option>
                                        )
                                    )
                                }

                            </select>


                            {
                                trainees.length ===
                                0 && (
                                    <p className="mt-2 text-[10px] text-red-600">
                                        No active created Trainees were found.
                                    </p>
                                )
                            }

                        </label>


                        {/* ==================================
                            ASSIGN BUTTON
                        ================================== */}

                        <div className="flex items-end">

                            <button
                                type="submit"

                                disabled={
                                    saving ||
                                    programmes.length ===
                                    0 ||
                                    trainees.length ===
                                    0
                                }

                                className="w-full rounded-lg bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                            >
                                {
                                    saving
                                        ? "Assigning..."
                                        : "Assign Programme"
                                }
                            </button>

                        </div>

                    </form>


                    {/* ======================================
                        SUMMARY
                    ====================================== */}

                    <div className="mt-5 flex flex-wrap gap-3">

                        <div className="rounded-lg bg-blue-50 px-3 py-2">

                            <p className="text-[10px] uppercase text-blue-500">
                                Active Programmes
                            </p>

                            <p className="mt-1 text-sm font-bold text-blue-700">
                                {
                                    programmes.length
                                }
                            </p>

                        </div>


                        <div className="rounded-lg bg-emerald-50 px-3 py-2">

                            <p className="text-[10px] uppercase text-emerald-500">
                                Available Trainees
                            </p>

                            <p className="mt-1 text-sm font-bold text-emerald-700">
                                {
                                    trainees.length
                                }
                            </p>

                        </div>

                    </div>

                </section>


                {/* ==========================================
                    ASSIGNMENTS
                ========================================== */}

                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:justify-between">

                        <div>

                            <h3 className="text-base font-bold text-slate-900">
                                Current Training Assignments
                            </h3>


                            <p className="mt-1 text-xs text-slate-500">
                                {
                                    assignments.length
                                } assignment(s)
                            </p>

                        </div>


                        <input
                            type="search"

                            value={
                                search
                            }

                            onChange={
                                (event) =>
                                    setSearch(
                                        event.target
                                            .value
                                    )
                            }

                            placeholder="Search Trainee or programme"

                            className="w-full rounded-lg border border-slate-200 px-3 py-2 text-xs outline-none focus:border-blue-500 sm:w-64"
                        />

                    </div>


                    {
                        filteredAssignments.length ===
                            0
                            ? (
                                <div className="p-12 text-center">

                                    <p className="text-sm font-semibold text-slate-700">
                                        No training assignments found.
                                    </p>


                                    <p className="mt-2 text-xs text-slate-500">
                                        Select a programme and Trainee above to create the first assignment.
                                    </p>

                                </div>
                            )
                            : (
                                <div className="overflow-x-auto">

                                    <table className="min-w-full">

                                        <thead className="bg-slate-50">

                                            <tr className="text-left text-[10px] uppercase tracking-wide text-slate-500">

                                                <th className="px-5 py-3">
                                                    Trainee
                                                </th>

                                                <th className="px-5 py-3">
                                                    Programme
                                                </th>

                                                <th className="px-5 py-3">
                                                    Training Type
                                                </th>

                                                <th className="px-5 py-3">
                                                    Assigned By
                                                </th>

                                                <th className="px-5 py-3">
                                                    Status
                                                </th>

                                                <th className="px-5 py-3 text-right">
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody className="divide-y divide-slate-100">

                                            {
                                                filteredAssignments.map(
                                                    (assignment) => (
                                                        <tr
                                                            key={
                                                                assignment._id
                                                            }

                                                            className="text-xs text-slate-700"
                                                        >

                                                            {/* TRAINEE */}

                                                            <td className="px-5 py-4">

                                                                <p className="font-semibold text-slate-900">
                                                                    {
                                                                        getUserName(
                                                                            assignment
                                                                                .trainee
                                                                        )
                                                                    }
                                                                </p>


                                                                <p className="mt-1 text-[10px] text-slate-500">
                                                                    {
                                                                        assignment
                                                                            .trainee
                                                                            ?.username ||
                                                                        ""
                                                                    }
                                                                </p>

                                                            </td>


                                                            {/* PROGRAMME */}

                                                            <td className="px-5 py-4">

                                                                <p className="font-semibold text-slate-900">
                                                                    {
                                                                        assignment
                                                                            .programme
                                                                            ?.title ||
                                                                        "Unavailable Programme"
                                                                    }
                                                                </p>

                                                            </td>


                                                            {/* TYPE */}

                                                            <td className="px-5 py-4">

                                                                {
                                                                    programmeTypeLabel(
                                                                        assignment
                                                                            .programme
                                                                            ?.programmeType
                                                                    )
                                                                }

                                                            </td>


                                                            {/* ASSIGNED BY */}

                                                            <td className="px-5 py-4">

                                                                {
                                                                    getUserName(
                                                                        assignment
                                                                            .assignedBy
                                                                    )
                                                                }

                                                            </td>


                                                            {/* STATUS */}

                                                            <td className="px-5 py-4">

                                                                <span
                                                                    className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-semibold capitalize ${assignment.status ===
                                                                        "active"
                                                                        ? "bg-emerald-50 text-emerald-700"
                                                                        : "bg-slate-100 text-slate-600"
                                                                        }`}
                                                                >
                                                                    {
                                                                        assignment.status
                                                                    }
                                                                </span>

                                                            </td>


                                                            {/* ACTION */}

                                                            <td className="px-5 py-4">

                                                                <div className="flex justify-end">

                                                                    {
                                                                        assignment.status ===
                                                                            "active"
                                                                            ? (
                                                                                <button
                                                                                    type="button"

                                                                                    disabled={
                                                                                        processingId ===
                                                                                        assignment._id
                                                                                    }

                                                                                    onClick={
                                                                                        () =>
                                                                                            deactivateAssignment(
                                                                                                assignment
                                                                                            )
                                                                                    }

                                                                                    className="rounded-md bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-700 transition hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    {
                                                                                        processingId ===
                                                                                            assignment._id
                                                                                            ? "Processing..."
                                                                                            : "Remove"
                                                                                    }
                                                                                </button>
                                                                            )
                                                                            : (
                                                                                <button
                                                                                    type="button"

                                                                                    disabled={
                                                                                        processingId ===
                                                                                        assignment._id
                                                                                    }

                                                                                    onClick={
                                                                                        () =>
                                                                                            reactivateAssignment(
                                                                                                assignment
                                                                                            )
                                                                                    }

                                                                                    className="rounded-md bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                                                >
                                                                                    {
                                                                                        processingId ===
                                                                                            assignment._id
                                                                                            ? "Processing..."
                                                                                            : "Reactivate"
                                                                                    }
                                                                                </button>
                                                                            )
                                                                    }

                                                                </div>

                                                            </td>

                                                        </tr>
                                                    )
                                                )
                                            }

                                        </tbody>

                                    </table>

                                </div>
                            )
                    }

                </section>

            </div>

        </DashboardLayout>
    );
}


export default TrainingAssignmentsPage;