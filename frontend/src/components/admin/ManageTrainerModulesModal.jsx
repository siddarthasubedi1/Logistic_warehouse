import {
    useEffect,
    useMemo,
    useState,
} from "react";

import { loadModulesFromDatabase } from "../../utils/moduleStorage";
import { getActiveTrainingModules } from "../../utils/trainingModules";


function ManageTrainerModulesModal({
    open = false,
    user = null,
    loading = false,
    onSave,
    onClose,
}) {
    const [
        modules,
        setModules,
    ] = useState([]);

    const [
        selectedModules,
        setSelectedModules,
    ] = useState(() =>
        Array.isArray(
            user?.assignedTrainingSections
        )
            ? [
                ...user.assignedTrainingSections,
            ]
            : []
    );

    const [
        loadingModules,
        setLoadingModules,
    ] = useState(
        Boolean(
            open &&
            user
        )
    );

    const [
        error,
        setError,
    ] = useState("");


    const activeModules =
        useMemo(
            () =>
                getActiveTrainingModules(
                    modules
                ),
            [
                modules,
            ]
        );


    useEffect(() => {
        if (
            !open ||
            !user
        ) {
            return;
        }


        let cancelled = false;


        const loadModules =
            async () => {
                try {
                    const data =
                        await loadModulesFromDatabase();


                    if (
                        !cancelled
                    ) {
                        setModules(
                            Array.isArray(
                                data
                            )
                                ? data
                                : []
                        );
                    }

                } catch (
                moduleError
                ) {
                    console.error(
                        "Load training modules error:",
                        moduleError
                    );


                    if (
                        !cancelled
                    ) {
                        setModules(
                            []
                        );

                        setError(
                            moduleError.response?.data?.message ||
                            "Unable to load active training modules."
                        );
                    }

                } finally {
                    if (
                        !cancelled
                    ) {
                        setLoadingModules(
                            false
                        );
                    }
                }
            };


        loadModules();


        return () => {
            cancelled = true;
        };
    }, [
        open,
        user,
    ]);


    if (
        !open ||
        !user
    ) {
        return null;
    }


    const trainerName =
        `${user.firstName || ""} ${user.lastName || ""}`
            .trim() ||
        user.username ||
        "Trainer";


    const toggleModule = (
        moduleId
    ) => {
        if (
            loading
        ) {
            return;
        }


        setSelectedModules(
            (
                current
            ) =>
                current.includes(
                    moduleId
                )
                    ? current.filter(
                        (
                            value
                        ) =>
                            value !==
                            moduleId
                    )
                    : [
                        ...current,
                        moduleId,
                    ]
        );

        setError("");
    };


    const selectAll = () => {
        setSelectedModules(
            activeModules.map(
                (
                    module
                ) =>
                    module.id
            )
        );

        setError("");
    };


    const submit =
        async (
            event
        ) => {
            event.preventDefault();


            const allowedKeys =
                new Set(
                    activeModules.map(
                        (
                            module
                        ) =>
                            module.id
                    )
                );


            const cleanSelection =
                [
                    ...new Set(
                        selectedModules.filter(
                            (
                                moduleId
                            ) =>
                                allowedKeys.has(
                                    moduleId
                                )
                        )
                    ),
                ];


            if (
                cleanSelection.length <
                1
            ) {
                setError(
                    "Select at least one active module for this Trainer."
                );

                return;
            }


            try {
                setError("");

                await onSave?.(
                    cleanSelection
                );

            } catch (
            saveError
            ) {
                setError(
                    saveError.response?.data?.message ||
                    saveError.message ||
                    "Unable to update Trainer modules."
                );
            }
        };


    return (
        <div
            className="
                fixed
                inset-0
                z-[520]
                flex
                items-center
                justify-center
                overflow-y-auto
                bg-slate-950/55
                p-3
                backdrop-blur-[2px]
                sm:p-5
            "
        >
            <section
                role="dialog"
                aria-modal="true"
                aria-labelledby="manage-trainer-modules-title"
                className="
                    my-auto
                    w-full
                    max-w-[760px]
                    overflow-hidden
                    rounded-2xl
                    border
                    border-[#dbe4ef]
                    bg-white
                    shadow-[0_24px_70px_rgba(15,23,42,0.28)]
                "
            >
                <div
                    className="
                        flex
                        items-start
                        justify-between
                        gap-4
                        border-b
                        border-[#e8eef5]
                        bg-[#f8fafc]
                        px-5
                        py-4
                        sm:px-6
                    "
                >
                    <div>
                        <p
                            className="
                                text-[8px]
                                font-bold
                                uppercase
                                tracking-[0.08em]
                                text-blue-600
                            "
                        >
                            Trainer Multi-Module Access
                        </p>

                        <h2
                            id="manage-trainer-modules-title"
                            className="
                                mt-1
                                text-[16px]
                                font-bold
                                text-[#172033]
                            "
                        >
                            Manage {trainerName}
                        </h2>

                        <p
                            className="
                                mt-1
                                max-w-[560px]
                                text-[9px]
                                leading-4
                                text-[#64748b]
                            "
                        >
                            Select one or more active modules for this Trainer. Any combination is allowed, for example Manual Handling + Cyber Awareness + Working at Height. The Trainer dashboard updates from this saved access.
                        </p>
                    </div>


                    <button
                        type="button"
                        aria-label="Close"
                        disabled={
                            loading
                        }
                        onClick={
                            onClose
                        }
                        className="
                            flex
                            h-9
                            w-9
                            shrink-0
                            items-center
                            justify-center
                            rounded-lg
                            border
                            border-[#dbe4ef]
                            bg-white
                            text-[18px]
                            font-semibold
                            text-[#64748b]
                            transition
                            hover:bg-slate-50
                            disabled:opacity-50
                        "
                    >
                        ×
                    </button>
                </div>


                <form
                    onSubmit={
                        submit
                    }
                >
                    <div
                        className="
                            px-5
                            py-5
                            sm:px-6
                        "
                    >
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                justify-between
                                gap-3
                                rounded-xl
                                border
                                border-blue-100
                                bg-blue-50/60
                                px-4
                                py-3
                            "
                        >
                            <div>
                                <p
                                    className="
                                        text-[10px]
                                        font-semibold
                                        text-[#172033]
                                    "
                                >
                                    {selectedModules.length} module{selectedModules.length === 1 ? "" : "s"} selected
                                </p>

                                <p
                                    className="
                                        mt-1
                                        text-[8px]
                                        text-[#64748b]
                                    "
                                >
                                    Select any combination of active modules. A Trainer must keep at least one module.
                                </p>
                            </div>


                            <button
                                type="button"
                                onClick={
                                    selectAll
                                }
                                disabled={
                                    loading ||
                                    loadingModules ||
                                    activeModules.length === 0
                                }
                                className="
                                    min-h-[34px]
                                    rounded-lg
                                    border
                                    border-blue-200
                                    bg-white
                                    px-3
                                    text-[8px]
                                    font-semibold
                                    text-blue-700
                                    transition
                                    hover:bg-blue-50
                                    disabled:cursor-not-allowed
                                    disabled:opacity-50
                                "
                            >
                                Select All Modules
                            </button>
                        </div>


                        {error && (
                            <div
                                className="
                                    mt-4
                                    rounded-lg
                                    border
                                    border-red-200
                                    bg-red-50
                                    px-4
                                    py-3
                                    text-[9px]
                                    text-red-700
                                "
                            >
                                {error}
                            </div>
                        )}


                        {loadingModules ? (
                            <div
                                className="
                                    flex
                                    min-h-[190px]
                                    items-center
                                    justify-center
                                "
                            >
                                <div
                                    className="
                                        text-center
                                    "
                                >
                                    <div
                                        className="
                                            mx-auto
                                            h-7
                                            w-7
                                            animate-spin
                                            rounded-full
                                            border-2
                                            border-blue-100
                                            border-t-blue-600
                                        "
                                    />

                                    <p
                                        className="
                                            mt-3
                                            text-[9px]
                                            text-[#64748b]
                                        "
                                    >
                                        Loading active modules...
                                    </p>
                                </div>
                            </div>
                        ) : activeModules.length === 0 ? (
                            <div
                                className="
                                    mt-4
                                    rounded-xl
                                    border
                                    border-amber-200
                                    bg-amber-50
                                    px-4
                                    py-5
                                    text-[9px]
                                    text-amber-800
                                "
                            >
                                No active training modules are available. Create or reactivate a module before changing Trainer access.
                            </div>
                        ) : (
                            <div
                                className="
                                    mt-4
                                    grid
                                    gap-3
                                    sm:grid-cols-2
                                    lg:grid-cols-3
                                "
                            >
                                {activeModules.map(
                                    (
                                        module
                                    ) => {
                                        const selected =
                                            selectedModules.includes(
                                                module.id
                                            );


                                        return (
                                            <button
                                                key={
                                                    module.id
                                                }
                                                type="button"
                                                disabled={
                                                    loading
                                                }
                                                onClick={() =>
                                                    toggleModule(
                                                        module.id
                                                    )
                                                }
                                                className={`
                                                    min-h-[112px]
                                                    rounded-xl
                                                    border
                                                    p-4
                                                    text-left
                                                    transition
                                                    disabled:cursor-not-allowed
                                                    disabled:opacity-60

                                                    ${selected
                                                        ? "border-blue-500 bg-blue-50/70 ring-1 ring-blue-100"
                                                        : "border-[#dbe4ef] bg-white hover:border-blue-200 hover:bg-[#fbfdff]"
                                                    }
                                                `}
                                            >
                                                <div
                                                    className="
                                                        flex
                                                        items-start
                                                        justify-between
                                                        gap-3
                                                    "
                                                >
                                                    <div
                                                        className="
                                                            min-w-0
                                                        "
                                                    >
                                                        <p
                                                            className="
                                                                text-[10px]
                                                                font-bold
                                                                text-[#172033]
                                                            "
                                                        >
                                                            {module.name}
                                                        </p>

                                                        <p
                                                            className="
                                                                mt-1
                                                                text-[8px]
                                                                leading-4
                                                                text-[#64748b]
                                                            "
                                                        >
                                                            {module.description ||
                                                                "Active training module"}
                                                        </p>
                                                    </div>


                                                    <span
                                                        className={`
                                                            flex
                                                            h-6
                                                            w-6
                                                            shrink-0
                                                            items-center
                                                            justify-center
                                                            rounded-full
                                                            border
                                                            text-[10px]
                                                            font-bold

                                                            ${selected
                                                                ? "border-blue-600 bg-blue-600 text-white"
                                                                : "border-[#cbd5e1] bg-white text-transparent"
                                                            }
                                                        `}
                                                    >
                                                        ✓
                                                    </span>
                                                </div>
                                            </button>
                                        );
                                    }
                                )}
                            </div>
                        )}
                    </div>


                    <div
                        className="
                            flex
                            items-center
                            justify-end
                            gap-2
                            border-t
                            border-[#e8eef5]
                            bg-[#f8fafc]
                            px-5
                            py-4
                            sm:px-6
                        "
                    >
                        <button
                            type="button"
                            onClick={
                                onClose
                            }
                            disabled={
                                loading
                            }
                            className="
                                min-h-[38px]
                                rounded-lg
                                border
                                border-[#cbd5e1]
                                bg-white
                                px-4
                                text-[9px]
                                font-semibold
                                text-[#52627a]
                                transition
                                hover:bg-white/70
                                disabled:opacity-50
                            "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            disabled={
                                loading ||
                                loadingModules ||
                                activeModules.length === 0
                            }
                            className="
                                min-h-[38px]
                                rounded-lg
                                bg-[#1769e8]
                                px-5
                                text-[9px]
                                font-semibold
                                text-white
                                transition
                                hover:bg-[#0b5ed7]
                                disabled:cursor-not-allowed
                                disabled:opacity-50
                            "
                        >
                            {loading
                                ? "Saving..."
                                : "Save Module Access"}
                        </button>
                    </div>
                </form>
            </section>
        </div>
    );
}


export default ManageTrainerModulesModal;
