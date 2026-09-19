import {
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import DashboardLayout from "../../components/dashboard/DashboardLayout";

import {
    getSessionUser,
} from "../../utils/session";

import {
    createModule,
    loadModuleById,
    updateModule,
} from "../../utils/moduleStorage";


const initialForm = {
    name: "",
    code: "",
    description: "",
    status: "active",
    image: "",
};


export default function CreateModulePage() {
    const navigate =
        useNavigate();

    const { moduleId } =
        useParams();

    const user =
        getSessionUser();

    const role = String(
        user?.role || ""
    ).toLowerCase();

    const editing =
        Boolean(moduleId);

    const [formData, setFormData] =
        useState(initialForm);

    const [error, setError] =
        useState("");


    // =====================================================
    // EDIT EXISTING MODULE
    // =====================================================

    useEffect(() => {
        if (!moduleId) return;
        let cancelled = false;
        loadModuleById(moduleId)
            .then((module) => {
                if (cancelled) return;
                if (!module) { navigate("/training-programmes", { replace: true }); return; }
                setFormData({ name: module.name || "", code: module.code || "", description: module.description || "", status: module.status || "active", image: module.image || "" });
            })
            .catch(() => { if (!cancelled) setError("Unable to load module from database."); });
        return () => { cancelled = true; };
    }, [moduleId, navigate]);

    // =====================================================
    // INPUT
    // =====================================================

    const handleChange = (
        event
    ) => {
        const {
            name,
            value,
        } = event.target;

        setFormData(
            (previous) => ({
                ...previous,
                [name]: value,
            })
        );


        if (
            name === "name" &&
            !editing
        ) {
            const generatedCode =
                value
                    .trim()
                    .toUpperCase()
                    .replace(
                        /[^A-Z0-9]+/g,
                        "-"
                    )
                    .replace(
                        /^-+|-+$/g,
                        ""
                    );

            setFormData(
                (previous) => ({
                    ...previous,
                    name: value,
                    code: generatedCode,
                })
            );
        }
    };


    // =====================================================
    // MODULE IMAGE
    // =====================================================

    const handleImageChange = (event) => {
        const file = event.target.files?.[0];

        if (!file) {
            return;
        }

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            event.target.value = "";
            return;
        }

        // Images are stored with the frontend module so every dynamic
        // module can use the same image on Trainer/Trainee screens.
        if (file.size > 1.5 * 1024 * 1024) {
            setError("Module image must be 1.5 MB or smaller.");
            event.target.value = "";
            return;
        }

        const reader = new FileReader();

        reader.onload = () => {
            setFormData((previous) => ({
                ...previous,
                image: String(reader.result || ""),
            }));
            setError("");
        };

        reader.onerror = () => {
            setError("Unable to read the selected image.");
        };

        reader.readAsDataURL(file);
    };


    const removeImage = () => {
        setFormData((previous) => ({
            ...previous,
            image: "",
        }));
    };


    // =====================================================
    // SAVE MODULE
    // =====================================================

    const handleSubmit = async (
        event
    ) => {
        event.preventDefault();

        setError("");


        if (
            !formData.name.trim()
        ) {
            setError(
                "Module name is required."
            );

            return;
        }


        if (
            formData.name.trim().length <
            3
        ) {
            setError(
                "Module name must contain at least 3 characters."
            );

            return;
        }


        if (
            !formData.description.trim()
        ) {
            setError(
                "Module description is required."
            );

            return;
        }


        if (
            formData.description
                .trim()
                .length < 10
        ) {
            setError(
                "Module description must contain at least 10 characters."
            );

            return;
        }


        if (editing) {
            await updateModule(
                moduleId,
                {
                    name:
                        formData.name.trim(),

                    code:
                        formData.code.trim(),

                    description:
                        formData.description.trim(),

                    status:
                        formData.status,

                    image:
                        formData.image,
                }
            );

            navigate(
                "/training-programmes"
            );

            return;
        }


        const createdModule =
            await createModule({
                name:
                    formData.name,

                code:
                    formData.code,

                description:
                    formData.description,

                status:
                    formData.status,

                image:
                    formData.image,
            });


        /*
          IMPORTANT:
    
          Module has now been created.
    
          NOW redirect to the Programme
          Information page for THAT module.
        */

        navigate(
            `/training-programmes/module/${createdModule.id}/programme`
        );
    };


    return (
        <DashboardLayout
            role={role}
            showHeader={false}
        >
            <div className="space-y-5">

                {/* HEADER */}

                <section
                    className="
              rounded-xl
              bg-gradient-to-r
              from-[#073763]
              to-[#1769aa]
              p-7
              text-white
              shadow-sm
            "
                >
                    <p
                        className="
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.15em]
                text-blue-100
              "
                    >
                        Module Management
                    </p>

                    <h1
                        className="
                mt-2
                text-2xl
                font-bold
              "
                    >
                        {editing
                            ? "Edit Module"
                            : "Create New Module"}
                    </h1>

                    <p
                        className="
                mt-2
                text-sm
                text-blue-100
              "
                    >
                        {editing
                            ? "Update the selected training module."
                            : "Create the module first. Programme information will be configured in the next step."}
                    </p>
                </section>


                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
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
                border-slate-200
                px-6
                py-5
              "
                    >
                        <h2
                            className="
                  text-lg
                  font-bold
                  text-[#172033]
                "
                        >
                            Module Information
                        </h2>

                        <p
                            className="
                  mt-1
                  text-sm
                  text-slate-500
                "
                        >
                            Enter the basic information for
                            this training module.
                        </p>
                    </div>


                    <div
                        className="
                space-y-6
                p-6
              "
                    >
                        {error && (
                            <div
                                className="
                    rounded-lg
                    border
                    border-red-200
                    bg-red-50
                    px-4
                    py-3
                    text-sm
                    text-red-700
                  "
                            >
                                {error}
                            </div>
                        )}


                        <div
                            className="
                  grid
                  gap-5
                  md:grid-cols-2
                "
                        >
                            <Field
                                label="Module Name"
                                required
                            >
                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={150}
                                    placeholder="Enter module name"
                                    className={inputClass}
                                />
                            </Field>


                            <Field
                                label="Module Code"
                            >
                                <input
                                    type="text"
                                    name="code"
                                    value={
                                        formData.code
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    maxLength={50}
                                    placeholder="Example: MODULE-001"
                                    className={inputClass}
                                />
                            </Field>
                        </div>


                        <Field
                            label="Description"
                            required
                        >
                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                rows={6}
                                maxLength={1000}
                                placeholder="Describe this training module and its purpose."
                                className={`${inputClass} resize-y`}
                            />

                            <div
                                className="
                    mt-1
                    text-right
                    text-xs
                    text-slate-400
                  "
                            >
                                {
                                    formData
                                        .description
                                        .length
                                }
                                /1000
                            </div>
                        </Field>


                        <Field
                            label="Module Image"
                        >
                            <input
                                type="file"
                                accept="image/png,image/jpeg,image/webp,image/gif"
                                onChange={handleImageChange}
                                className={`${inputClass} file:mr-4 file:rounded-lg file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-[#0b4f87] hover:file:bg-blue-100`}
                            />

                            <p className="mt-2 text-xs text-slate-500">
                                Upload JPG, PNG, WEBP or GIF (maximum 1.5 MB). This image is displayed for the module on Trainer and Trainee training screens.
                            </p>

                            {formData.image && (
                                <div className="mt-4 flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                                    <img
                                        src={formData.image}
                                        alt={`${formData.name || "Module"} preview`}
                                        className="h-28 w-40 rounded-lg object-cover shadow-sm"
                                    />

                                    <div>
                                        <p className="text-sm font-semibold text-[#172033]">Image preview</p>
                                        <button
                                            type="button"
                                            onClick={removeImage}
                                            className="mt-3 rounded-lg border border-red-200 bg-white px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                                        >
                                            Remove Image
                                        </button>
                                    </div>
                                </div>
                            )}
                        </Field>


                        <Field
                            label="Status"
                            required
                        >
                            <select
                                name="status"
                                value={
                                    formData.status
                                }
                                onChange={
                                    handleChange
                                }
                                className={inputClass}
                            >
                                <option value="active">
                                    Active
                                </option>

                                <option value="inactive">
                                    Inactive
                                </option>
                            </select>
                        </Field>
                    </div>


                    {/* BUTTONS */}

                    <div
                        className="
                flex
                justify-end
                gap-3
                border-t
                border-slate-200
                bg-slate-50
                px-6
                py-4
              "
                    >
                        <button
                            type="button"
                            onClick={() =>
                                navigate(
                                    "/training-programmes"
                                )
                            }
                            className="
                  rounded-lg
                  border
                  border-slate-300
                  bg-white
                  px-5
                  py-2.5
                  text-sm
                  font-semibold
                  text-slate-700
                  hover:bg-slate-100
                "
                        >
                            Cancel
                        </button>


                        <button
                            type="submit"
                            className="
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
                            {editing
                                ? "Update Module"
                                : "Create Module"}
                        </button>
                    </div>
                </form>

            </div>
        </DashboardLayout>
    );
}


function Field({
    label,
    required = false,
    children,
}) {
    return (
        <div>
            <label
                className="
            mb-2
            block
            text-sm
            font-semibold
            text-[#172033]
          "
            >
                {label}

                {required && (
                    <span className="text-red-500">
                        {" "}*
                    </span>
                )}
            </label>

            {children}
        </div>
    );
}


const inputClass = `
    w-full
    rounded-xl
    border
    border-slate-300
    bg-white
    px-4
    py-3
    text-sm
    text-[#172033]
    outline-none
    transition
    placeholder:text-slate-400
    focus:border-blue-500
    focus:ring-2
    focus:ring-blue-100
  `;