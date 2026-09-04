import {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import api from "../../services/api";


const TRAINING_SECTIONS = {
    "manual-handling": {
        title: "Manual Handling",
        description:
            "Manage trainee Manual Handling tasks and scores.",
    },

    "working-at-height": {
        title: "Working at Height",
        description:
            "Manage trainee Working at Height tasks and scores.",
    },
};


const INITIAL_TASKS = {
    "manual-handling": [
        {
            id: 1,
            traineeName: "John Smith",
            username: "john.smith",
            task: "Safe Lifting Technique",
            status: "Completed",
            score: 82,
        },

        {
            id: 2,
            traineeName: "Emma Wilson",
            username: "emma.wilson",
            task: "Load Assessment",
            status: "In Progress",
            score: "",
        },

        {
            id: 3,
            traineeName: "Daniel Brown",
            username: "daniel.brown",
            task: "Correct Carrying Procedure",
            status: "Pending",
            score: "",
        },
    ],

    "working-at-height": [
        {
            id: 4,
            traineeName: "John Smith",
            username: "john.smith",
            task: "Ladder Safety",
            status: "Completed",
            score: 88,
        },

        {
            id: 5,
            traineeName: "Sophia Taylor",
            username: "sophia.taylor",
            task: "Fall Prevention",
            status: "In Progress",
            score: "",
        },

        {
            id: 6,
            traineeName: "Michael Lee",
            username: "michael.lee",
            task: "Platform Inspection",
            status: "Pending",
            score: "",
        },
    ],
};


function StatusBadge({
    status,
}) {
    const styles = {
        Completed:
            "bg-emerald-50 text-emerald-700 border-emerald-200",

        "In Progress":
            "bg-blue-50 text-blue-700 border-blue-200",

        Pending:
            "bg-amber-50 text-amber-700 border-amber-200",
    };


    return (
        <span
            className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold ${styles[status] ||
                "border-slate-200 bg-slate-50 text-slate-600"
                }`}
        >
            {status}
        </span>
    );
}


function TrainerTasksPage() {
    const navigate =
        useNavigate();


    const {
        sectionId,
    } = useParams();


    const section =
        TRAINING_SECTIONS[
        sectionId
        ];


    const [
        trainer,
        setTrainer,
    ] = useState(null);


    const [
        tasks,
        setTasks,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        error,
        setError,
    ] = useState("");


    const [
        search,
        setSearch,
    ] = useState("");


    const [
        statusFilter,
        setStatusFilter,
    ] = useState("all");


    const [
        editingTaskId,
        setEditingTaskId,
    ] = useState(null);


    const [
        editForm,
        setEditForm,
    ] = useState({
        status: "",
        score: "",
    });


    const [
        successMessage,
        setSuccessMessage,
    ] = useState("");


    // ======================================================
    // LOAD TRAINER + VERIFY SECTION
    // ======================================================

    useEffect(() => {
        const loadPage =
            async () => {
                try {
                    setLoading(true);
                    setError("");


                    const response =
                        await api.get(
                            "/users/me"
                        );


                    const currentUser =
                        response.data
                            ?.user;


                    if (!currentUser) {
                        setError(
                            "Unable to load Trainer information."
                        );

                        return;
                    }


                    if (
                        currentUser.role !==
                        "trainer"
                    ) {
                        setError(
                            "You are not authorised to access this page."
                        );

                        return;
                    }


                    const assignments =
                        Array.isArray(
                            currentUser
                                .assignedTrainingSections
                        )
                            ? currentUser
                                .assignedTrainingSections
                            : [];


                    if (
                        !assignments.includes(
                            sectionId
                        )
                    ) {
                        setError(
                            "This training section has not been assigned to you."
                        );

                        return;
                    }


                    setTrainer(
                        currentUser
                    );


                    setTasks(
                        INITIAL_TASKS[
                        sectionId
                        ] || []
                    );

                } catch (error) {
                    console.error(
                        "Trainer tasks page error:",
                        error
                    );


                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load trainee tasks."
                    );

                } finally {
                    setLoading(false);
                }
            };


        loadPage();

    }, [
        sectionId,
    ]);


    // ======================================================
    // FILTER TASKS
    // ======================================================

    const filteredTasks =
        useMemo(() => {
            return tasks.filter(
                (task) => {
                    const searchValue =
                        `${task.traineeName} ${task.username} ${task.task}`
                            .toLowerCase();


                    const searchMatches =
                        searchValue.includes(
                            search.toLowerCase()
                        );


                    const statusMatches =
                        statusFilter ===
                        "all" ||
                        task.status ===
                        statusFilter;


                    return (
                        searchMatches &&
                        statusMatches
                    );
                }
            );
        }, [
            tasks,
            search,
            statusFilter,
        ]);


    // ======================================================
    // STATISTICS
    // ======================================================

    const totalTasks =
        tasks.length;


    const completedTasks =
        tasks.filter(
            (task) =>
                task.status ===
                "Completed"
        ).length;


    const inProgressTasks =
        tasks.filter(
            (task) =>
                task.status ===
                "In Progress"
        ).length;


    const pendingTasks =
        tasks.filter(
            (task) =>
                task.status ===
                "Pending"
        ).length;


    // ======================================================
    // EDIT
    // ======================================================

    const handleEdit = (
        task
    ) => {
        setEditingTaskId(
            task.id
        );


        setEditForm({
            status:
                task.status,

            score:
                task.score,
        });


        setSuccessMessage(
            ""
        );
    };


    // ======================================================
    // CANCEL
    // ======================================================

    const handleCancel = () => {
        setEditingTaskId(
            null
        );


        setEditForm({
            status: "",
            score: "",
        });
    };


    // ======================================================
    // SAVE
    // ======================================================

    const handleSave = (
        taskId
    ) => {
        const numericScore =
            editForm.score === ""
                ? ""
                : Number(
                    editForm.score
                );


        if (
            numericScore !== "" &&
            (
                Number.isNaN(
                    numericScore
                ) ||
                numericScore < 0 ||
                numericScore > 100
            )
        ) {
            setError(
                "Score must be between 0 and 100."
            );

            return;
        }


        setTasks(
            (currentTasks) =>
                currentTasks.map(
                    (task) =>
                        task.id ===
                            taskId
                            ? {
                                ...task,

                                status:
                                    editForm.status,

                                score:
                                    numericScore,
                            }
                            : task
                )
        );


        setEditingTaskId(
            null
        );


        setEditForm({
            status: "",
            score: "",
        });


        setError("");


        setSuccessMessage(
            "Trainee task updated successfully."
        );
    };


    // ======================================================
    // INVALID SECTION
    // ======================================================

    if (!section) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >
                <main className="min-h-screen bg-[#f6f8fb] p-6">

                    <div className="rounded-xl border border-red-200 bg-white p-6">

                        <h1 className="text-xl font-bold text-slate-900">
                            Training Section Not Found
                        </h1>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/trainer"
                                )
                            }
                            className="mt-5 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </main>
            </DashboardLayout>
        );
    }


    // ======================================================
    // LOADING
    // ======================================================

    if (loading) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >
                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb]">

                    <div className="text-center">

                        <div className="mx-auto h-9 w-9 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                        <p className="mt-4 text-sm text-slate-500">
                            Loading trainee tasks...
                        </p>

                    </div>

                </div>
            </DashboardLayout>
        );
    }


    // ======================================================
    // ACCESS DENIED
    // ======================================================

    if (error && !trainer) {
        return (
            <DashboardLayout
                role="trainer"
                showHeader={false}
            >
                <div className="flex min-h-screen items-center justify-center bg-[#f6f8fb] px-5">

                    <div className="max-w-md rounded-xl border border-red-200 bg-white p-6 text-center shadow-sm">

                        <h1 className="text-lg font-bold text-slate-900">
                            Access Denied
                        </h1>


                        <p className="mt-2 text-sm text-slate-500">
                            {error}
                        </p>


                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/trainer"
                                )
                            }
                            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white"
                        >
                            Back to Dashboard
                        </button>

                    </div>

                </div>
            </DashboardLayout>
        );
    }


    return (
        <DashboardLayout
            role="trainer"
            showHeader={false}
        >
            <main className="min-h-screen bg-[#f6f8fb] px-5 py-5 lg:px-6">

                {/* BREADCRUMB */}

                <div className="mb-5 flex flex-wrap items-center gap-2 text-xs text-slate-500">

                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                "/trainer"
                            )
                        }
                        className="font-medium text-blue-600"
                    >
                        Trainer Dashboard
                    </button>


                    <span>›</span>


                    <button
                        type="button"
                        onClick={() =>
                            navigate(
                                `/trainer/training/${sectionId}`
                            )
                        }
                        className="font-medium text-blue-600"
                    >
                        {section.title}
                    </button>


                    <span>›</span>


                    <span>
                        Trainee Tasks
                    </span>

                </div>


                {/* HEADER */}

                <section className="rounded-xl bg-[#073763] p-6 text-white shadow-sm">

                    <div className="flex flex-col justify-between gap-5 md:flex-row md:items-center">

                        <div>

                            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-blue-200">
                                Trainer Task Management
                            </p>


                            <h1 className="mt-2 text-2xl font-bold">
                                {section.title} Tasks
                            </h1>


                            <p className="mt-2 text-sm text-blue-100">
                                {section.description}
                            </p>

                        </div>


                        <div className="rounded-xl bg-white/10 px-5 py-3">

                            <p className="text-xs text-blue-200">
                                Trainer
                            </p>

                            <p className="mt-1 text-sm font-semibold">
                                {trainer?.firstName}{" "}
                                {trainer?.lastName}
                            </p>

                        </div>

                    </div>

                </section>


                {/* STATISTICS */}

                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium text-slate-500">
                            Total Tasks
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                            {totalTasks}
                        </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium text-slate-500">
                            Completed
                        </p>

                        <p className="mt-2 text-2xl font-bold text-emerald-600">
                            {completedTasks}
                        </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium text-slate-500">
                            In Progress
                        </p>

                        <p className="mt-2 text-2xl font-bold text-blue-600">
                            {inProgressTasks}
                        </p>

                    </div>


                    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">

                        <p className="text-xs font-medium text-slate-500">
                            Pending
                        </p>

                        <p className="mt-2 text-2xl font-bold text-amber-600">
                            {pendingTasks}
                        </p>

                    </div>

                </div>


                {/* SUCCESS */}

                {successMessage && (
                    <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                        {successMessage}
                    </div>
                )}


                {/* NORMAL ERROR */}

                {error && trainer && (
                    <div className="mt-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        {error}
                    </div>
                )}


                {/* TABLE */}

                <section className="mt-5 rounded-xl border border-slate-200 bg-white shadow-sm">

                    <div className="border-b border-slate-200 p-5">

                        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">

                            <div>

                                <h2 className="font-bold text-slate-900">
                                    Trainee Tasks
                                </h2>


                                <p className="mt-1 text-xs text-slate-500">
                                    View and edit trainee task status and scores.
                                </p>

                            </div>


                            <div className="flex flex-col gap-3 sm:flex-row">

                                <input
                                    type="text"
                                    value={search}
                                    onChange={(
                                        event
                                    ) =>
                                        setSearch(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    placeholder="Search trainee or task..."
                                    className="rounded-lg border border-slate-300 px-4 py-2.5 text-xs outline-none focus:border-blue-500"
                                />


                                <select
                                    value={
                                        statusFilter
                                    }
                                    onChange={(
                                        event
                                    ) =>
                                        setStatusFilter(
                                            event
                                                .target
                                                .value
                                        )
                                    }
                                    className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-xs outline-none"
                                >
                                    <option value="all">
                                        All Status
                                    </option>

                                    <option value="Completed">
                                        Completed
                                    </option>

                                    <option value="In Progress">
                                        In Progress
                                    </option>

                                    <option value="Pending">
                                        Pending
                                    </option>
                                </select>

                            </div>

                        </div>

                    </div>


                    <div className="overflow-x-auto">

                        <table className="min-w-full text-left text-xs">

                            <thead className="bg-slate-50 text-slate-500">

                                <tr>

                                    <th className="px-5 py-3 font-semibold">
                                        Trainee
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Task
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Status
                                    </th>

                                    <th className="px-5 py-3 font-semibold">
                                        Score
                                    </th>

                                    <th className="px-5 py-3 text-right font-semibold">
                                        Actions
                                    </th>

                                </tr>

                            </thead>


                            <tbody>

                                {filteredTasks.map(
                                    (task) => {

                                        const editing =
                                            editingTaskId ===
                                            task.id;


                                        return (
                                            <tr
                                                key={
                                                    task.id
                                                }
                                                className="border-t border-slate-100"
                                            >

                                                <td className="px-5 py-4">

                                                    <p className="font-semibold text-slate-900">
                                                        {
                                                            task.traineeName
                                                        }
                                                    </p>

                                                    <p className="mt-1 text-[10px] text-slate-400">
                                                        {
                                                            task.username
                                                        }
                                                    </p>

                                                </td>


                                                <td className="px-5 py-4 font-medium text-slate-700">
                                                    {
                                                        task.task
                                                    }
                                                </td>


                                                <td className="px-5 py-4">

                                                    {editing ? (
                                                        <select
                                                            value={
                                                                editForm.status
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setEditForm(
                                                                    (
                                                                        current
                                                                    ) => ({
                                                                        ...current,

                                                                        status:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            className="rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs outline-none focus:border-blue-500"
                                                        >

                                                            <option value="Pending">
                                                                Pending
                                                            </option>

                                                            <option value="In Progress">
                                                                In Progress
                                                            </option>

                                                            <option value="Completed">
                                                                Completed
                                                            </option>

                                                        </select>
                                                    ) : (
                                                        <StatusBadge
                                                            status={
                                                                task.status
                                                            }
                                                        />
                                                    )}

                                                </td>


                                                <td className="px-5 py-4">

                                                    {editing ? (
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            max="100"
                                                            value={
                                                                editForm.score
                                                            }
                                                            onChange={(
                                                                event
                                                            ) =>
                                                                setEditForm(
                                                                    (
                                                                        current
                                                                    ) => ({
                                                                        ...current,

                                                                        score:
                                                                            event
                                                                                .target
                                                                                .value,
                                                                    })
                                                                )
                                                            }
                                                            placeholder="0-100"
                                                            className="w-20 rounded-lg border border-slate-300 px-3 py-2 text-xs outline-none focus:border-blue-500"
                                                        />
                                                    ) : task.score ===
                                                        "" ? (
                                                        <span className="text-slate-400">
                                                            —
                                                        </span>
                                                    ) : (
                                                        <span className="font-bold text-slate-900">
                                                            {
                                                                task.score
                                                            }
                                                            %
                                                        </span>
                                                    )}

                                                </td>


                                                <td className="px-5 py-4">

                                                    <div className="flex justify-end gap-2">

                                                        {editing ? (
                                                            <>
                                                                <button
                                                                    type="button"
                                                                    onClick={() =>
                                                                        handleSave(
                                                                            task.id
                                                                        )
                                                                    }
                                                                    className="rounded-lg bg-blue-600 px-3 py-2 text-[10px] font-semibold text-white hover:bg-blue-700"
                                                                >
                                                                    Save
                                                                </button>


                                                                <button
                                                                    type="button"
                                                                    onClick={
                                                                        handleCancel
                                                                    }
                                                                    className="rounded-lg border border-slate-200 px-3 py-2 text-[10px] font-semibold text-slate-600 hover:bg-slate-50"
                                                                >
                                                                    Cancel
                                                                </button>
                                                            </>
                                                        ) : (
                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleEdit(
                                                                        task
                                                                    )
                                                                }
                                                                className="rounded-lg border border-blue-200 px-3 py-2 text-[10px] font-semibold text-blue-600 hover:bg-blue-50"
                                                            >
                                                                Edit Task
                                                            </button>
                                                        )}

                                                    </div>

                                                </td>

                                            </tr>
                                        );
                                    }
                                )}


                                {filteredTasks.length ===
                                    0 && (
                                        <tr>

                                            <td
                                                colSpan="5"
                                                className="px-5 py-10 text-center text-sm text-slate-400"
                                            >
                                                No trainee tasks found.
                                            </td>

                                        </tr>
                                    )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>
        </DashboardLayout>
    );
}


export default TrainerTasksPage;