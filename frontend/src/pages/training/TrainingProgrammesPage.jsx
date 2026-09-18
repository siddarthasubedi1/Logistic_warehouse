import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
    getSessionUser,
} from "../../utils/session";

import {
    deleteModule,
    getModules,
} from "../../utils/moduleStorage";


export default function TrainingProgrammesPage() {
    const navigate = useNavigate();

    const user = getSessionUser();

    const role = String(
        user?.role || ""
    ).toLowerCase();

    const isAdmin =
        role === "admin";

    const [modules, setModules] =
        useState([]);


    // =====================================================
    // LOAD ADMIN-CREATED MODULES
    // =====================================================

    const loadModules = () => {
        setModules(
            getModules()
        );
    };


    useEffect(() => {
        loadModules();
    }, []);


    // =====================================================
    // CREATE
    // =====================================================

    const handleCreate = () => {
        navigate(
            "/training-programmes/create-module"
        );
    };


    // =====================================================
    // MANAGE PROGRAMME
    // =====================================================

    const handleManage = (module) => {
        navigate(
            `/training-programmes/module/${module.id}/programme`
        );
    };


    // =====================================================
    // EDIT MODULE
    // =====================================================

    const handleEdit = (module) => {
        navigate(
            `/training-programmes/module/${module.id}/edit`
        );
    };


    // =====================================================
    // DELETE MODULE
    // =====================================================

    const handleDelete = (module) => {
        const confirmed =
            window.confirm(
                `Delete "${module.name}"?`
            );

        if (!confirmed) {
            return;
        }

        deleteModule(
            module.id
        );

        loadModules();
    };


    return (
        <DashboardLayout
            role={role}
            showHeader={false}
        >
            <div className="space-y-5">

                {/* ==========================================
              HEADER
          =========================================== */}

                <section
                    className="
              relative
              overflow-hidden
              rounded-xl
              bg-gradient-to-r
              from-[#073763]
              to-[#1769aa]
              p-7
              text-white
              shadow-sm
            "
                >
                    <div
                        className="
                pointer-events-none
                absolute
                -right-16
                -top-20
                h-52
                w-52
                rounded-full
                bg-white/10
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
                        <div>
                            <p
                                className="
                    text-[9px]
                    font-semibold
                    uppercase
                    tracking-[0.15em]
                    text-blue-100
                  "
                            >
                                Workplace Safety
                            </p>

                            <h1
                                className="
                    mt-2
                    text-2xl
                    font-bold
                  "
                            >
                                Training Programmes
                            </h1>

                            <p
                                className="
                    mt-2
                    text-sm
                    text-blue-100
                  "
                            >
                                Create and manage workplace safety
                                training modules.
                            </p>
                        </div>


                        {isAdmin && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="
                    rounded-xl
                    bg-white
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-[#073763]
                    shadow-sm
                    transition
                    hover:bg-blue-50
                  "
                            >
                                + Create Module
                            </button>
                        )}
                    </div>
                </section>


                {/* ==========================================
              MANAGEMENT HEADING
          =========================================== */}

                <section
                    className="
              rounded-xl
              border
              border-slate-200
              bg-white
              p-6
              shadow-sm
            "
                >
                    <h2
                        className="
                text-lg
                font-bold
                text-[#172033]
              "
                    >
                        Manage Modules
                    </h2>

                    <p
                        className="
                mt-1
                text-sm
                text-slate-500
              "
                    >
                        Select a module to manage its programme
                        information and learning content.
                    </p>
                </section>


                {/* ==========================================
              EMPTY STATE
          =========================================== */}

                {modules.length === 0 && (
                    <section
                        className="
                rounded-xl
                border
                border-dashed
                border-slate-300
                bg-white
                px-6
                py-16
                text-center
              "
                    >
                        <div
                            className="
                  mx-auto
                  flex
                  h-14
                  w-14
                  items-center
                  justify-center
                  rounded-xl
                  bg-blue-50
                  text-[#0b4f87]
                "
                        >
                            <ModuleIcon />
                        </div>

                        <h3
                            className="
                  mt-4
                  text-base
                  font-bold
                  text-[#172033]
                "
                        >
                            No modules created
                        </h3>

                        <p
                            className="
                  mx-auto
                  mt-2
                  max-w-md
                  text-sm
                  text-slate-500
                "
                        >
                            Create your first workplace safety
                            training module.
                        </p>

                        {isAdmin && (
                            <button
                                type="button"
                                onClick={handleCreate}
                                className="
                    mt-5
                    rounded-lg
                    bg-[#0b4f87]
                    px-5
                    py-2.5
                    text-sm
                    font-semibold
                    text-white
                    hover:bg-[#073763]
                  "
                            >
                                + Create Module
                            </button>
                        )}
                    </section>
                )}


                {/* ==========================================
              CREATED MODULES
          =========================================== */}

                {modules.length > 0 && (
                    <section
                        className="
                grid
                gap-5
                lg:grid-cols-3
              "
                    >
                        {modules.map(
                            (module) => (
                                <article
                                    key={module.id}
                                    className="
                      overflow-hidden
                      rounded-xl
                      border
                      border-slate-200
                      bg-white
                      shadow-sm
                    "
                                >
                                    <div className="p-6">

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
                            flex
                            h-11
                            w-11
                            items-center
                            justify-center
                            rounded-xl
                            bg-blue-50
                            text-[#0b4f87]
                          "
                                            >
                                                <ModuleIcon />
                                            </div>

                                            <span
                                                className={`
                            rounded-full
                            px-3
                            py-1
                            text-xs
                            font-semibold
  
                            ${module.status ===
                                                        "active"
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-slate-100 text-slate-600"
                                                    }
                          `}
                                            >
                                                {module.status ===
                                                    "active"
                                                    ? "Active"
                                                    : "Inactive"}
                                            </span>
                                        </div>


                                        <h3
                                            className="
                          mt-5
                          text-base
                          font-bold
                          text-[#172033]
                        "
                                        >
                                            {module.name}
                                        </h3>


                                        {module.code && (
                                            <p
                                                className="
                            mt-1
                            text-xs
                            font-semibold
                            uppercase
                            tracking-wide
                            text-[#0b4f87]
                          "
                                            >
                                                {module.code}
                                            </p>
                                        )}


                                        <p
                                            className="
                          mt-2
                          min-h-[48px]
                          text-sm
                          leading-6
                          text-slate-500
                        "
                                        >
                                            {module.description}
                                        </p>
                                    </div>


                                    <div
                                        className="
                        border-t
                        border-slate-200
                        bg-slate-50
                        p-4
                      "
                                    >
                                        <div
                                            className={`
                          grid
                          gap-2
  
                          ${isAdmin
                                                    ? "grid-cols-3"
                                                    : "grid-cols-1"
                                                }
                        `}
                                        >
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    handleManage(
                                                        module
                                                    )
                                                }
                                                className="
                            rounded-lg
                            bg-[#0b4f87]
                            px-3
                            py-2
                            text-xs
                            font-semibold
                            text-white
                            hover:bg-[#073763]
                          "
                                            >
                                                Manage
                                            </button>


                                            {isAdmin && (
                                                <>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleEdit(
                                                                module
                                                            )
                                                        }
                                                        className="
                                rounded-lg
                                border
                                border-slate-300
                                bg-white
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-slate-700
                                hover:bg-slate-100
                              "
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleDelete(
                                                                module
                                                            )
                                                        }
                                                        className="
                                rounded-lg
                                border
                                border-red-200
                                bg-white
                                px-3
                                py-2
                                text-xs
                                font-semibold
                                text-red-600
                                hover:bg-red-50
                              "
                                                    >
                                                        Delete
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </article>
                            )
                        )}
                    </section>
                )}

            </div>
        </DashboardLayout>
    );
}


function ModuleIcon() {
    return (
        <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            className="h-5 w-5"
        >
            <rect
                x="5"
                y="3"
                width="14"
                height="18"
                rx="2"
            />

            <path d="M8 8h8" />
            <path d="M8 12h8" />
            <path d="M8 16h5" />
        </svg>
    );
}