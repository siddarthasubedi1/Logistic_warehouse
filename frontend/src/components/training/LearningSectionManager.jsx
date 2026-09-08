import {
    useCallback,
    useEffect,
    useState,
} from "react";

import {
    useNavigate,
    useParams,
} from "react-router-dom";

import api from "../../services/api";


const EMPTY_FORM = {
    title: "",
    content: "",
    imageUrl: "",
    imageAltText: "",
    status: "active",
};


function StatusBadge({
    status,
}) {
    return (
        <span
            className={`rounded-full px-2.5 py-1 text-[10px] font-semibold ${status ===
                "active"
                ? "bg-emerald-50 text-emerald-700"
                : "bg-slate-100 text-slate-600"
                }`}
        >
            {status}
        </span>
    );
}


function LearningSectionManager() {
    const {
        programmeId,
    } =
        useParams();


    const navigate =
        useNavigate();


    const [
        programme,
        setProgramme,
    ] = useState(null);


    const [
        sections,
        setSections,
    ] = useState([]);


    const [
        loading,
        setLoading,
    ] = useState(true);


    const [
        showForm,
        setShowForm,
    ] = useState(false);


    const [
        editingSection,
        setEditingSection,
    ] = useState(null);


    const [
        saving,
        setSaving,
    ] = useState(false);


    const [
        processingId,
        setProcessingId,
    ] = useState("");


    const [
        reordering,
        setReordering,
    ] = useState(false);


    const [
        formData,
        setFormData,
    ] = useState({
        ...EMPTY_FORM,
    });


    const [
        message,
        setMessage,
    ] = useState("");


    const [
        error,
        setError,
    ] = useState("");


    // ==================================================
    // LOAD
    // ==================================================

    const loadProgramme =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        `/training-programmes/${programmeId}`
                    );


                setProgramme(
                    response.data
                        ?.programme ||
                    response.data
                );
            },
            [
                programmeId,
            ]
        );


    const loadSections =
        useCallback(
            async () => {
                const response =
                    await api.get(
                        `/training-programmes/${programmeId}/sections`
                    );


                const list =
                    response.data
                        ?.sections ||
                    [];


                setSections(
                    [...list].sort(
                        (a, b) =>
                            a.order -
                            b.order
                    )
                );
            },
            [
                programmeId,
            ]
        );


    useEffect(() => {
        const load =
            async () => {
                try {
                    setLoading(true);

                    await Promise.all([
                        loadProgramme(),
                        loadSections(),
                    ]);

                } catch (error) {
                    setError(
                        error.response
                            ?.data
                            ?.message ||
                        "Unable to load learning sections."
                    );

                } finally {
                    setLoading(false);
                }
            };


        load();

    }, [
        loadProgramme,
        loadSections,
    ]);


    // ==================================================
    // FORM
    // ==================================================

    const resetForm =
        () => {
            setEditingSection(
                null
            );


            setFormData({
                ...EMPTY_FORM,
            });
        };


    const openCreate =
        () => {
            resetForm();

            setShowForm(true);

            setMessage("");

            setError("");
        };


    const openEdit =
        (section) => {
            setEditingSection(
                section
            );


            setFormData({
                title:
                    section.title ||
                    "",

                content:
                    section.content ||
                    "",

                imageUrl:
                    section.imageUrl ||
                    "",

                imageAltText:
                    section.imageAltText ||
                    "",

                status:
                    section.status ||
                    "active",
            });


            setShowForm(true);
        };


    const closeForm =
        () => {
            setShowForm(false);

            resetForm();
        };


    // ==================================================
    // SAVE
    // ==================================================

    const handleSubmit =
        async (event) => {
            event.preventDefault();


            if (
                !formData.title.trim()
            ) {
                setError(
                    "Section title is required."
                );

                return;
            }


            if (
                !formData.content.trim()
            ) {
                setError(
                    "Section content is required."
                );

                return;
            }


            if (
                formData.imageUrl.trim() &&
                !formData.imageAltText.trim()
            ) {
                setError(
                    "Image alt text is required when an image URL is used."
                );

                return;
            }


            try {
                setSaving(true);

                setError("");

                setMessage("");


                const payload = {
                    title:
                        formData
                            .title
                            .trim(),

                    content:
                        formData
                            .content
                            .trim(),

                    imageUrl:
                        formData
                            .imageUrl
                            .trim(),

                    imageAltText:
                        formData
                            .imageAltText
                            .trim(),

                    status:
                        formData.status,
                };


                if (
                    editingSection
                ) {
                    await api.patch(
                        `/training-programmes/${programmeId}/sections/${editingSection._id}`,
                        payload
                    );


                    setMessage(
                        "Learning section updated successfully."
                    );

                } else {
                    await api.post(
                        `/training-programmes/${programmeId}/sections`,
                        payload
                    );


                    setMessage(
                        "Learning section created successfully."
                    );
                }


                await loadSections();


                closeForm();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to save learning section."
                );

            } finally {
                setSaving(false);
            }
        };


    // ==================================================
    // DEACTIVATE
    // ==================================================

    const deactivate =
        async (section) => {
            if (
                !window.confirm(
                    `Deactivate "${section.title}"?`
                )
            ) {
                return;
            }


            try {
                setProcessingId(
                    section._id
                );


                setMessage("");

                setError("");


                await api.delete(
                    `/training-programmes/${programmeId}/sections/${section._id}`
                );


                setMessage(
                    "Learning section deactivated successfully."
                );


                await loadSections();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to deactivate section."
                );

            } finally {
                setProcessingId("");
            }
        };


    // ==================================================
    // REACTIVATE
    // ==================================================

    const reactivate =
        async (section) => {
            if (
                !window.confirm(
                    `Reactivate "${section.title}"?`
                )
            ) {
                return;
            }


            try {
                setProcessingId(
                    section._id
                );


                setMessage("");

                setError("");


                await api.patch(
                    `/training-programmes/${programmeId}/sections/${section._id}/reactivate`
                );


                setMessage(
                    "Learning section reactivated successfully."
                );


                await loadSections();

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to reactivate section."
                );

            } finally {
                setProcessingId("");
            }
        };


    // ==================================================
    // REORDER
    // ==================================================

    const reorder =
        async (newSections) => {
            try {
                setReordering(true);


                await api.put(
                    `/training-programmes/${programmeId}/sections/reorder`,
                    {
                        sectionIds:
                            newSections.map(
                                (section) =>
                                    section._id
                            ),
                    }
                );


                await loadSections();


                setMessage(
                    "Section order updated successfully."
                );

            } catch (error) {
                setError(
                    error.response
                        ?.data
                        ?.message ||
                    "Unable to reorder sections."
                );


                await loadSections();

            } finally {
                setReordering(false);
            }
        };


    const moveUp =
        async (index) => {
            if (
                index ===
                0
            ) {
                return;
            }


            const newSections =
                [...sections];


            [
                newSections[
                index - 1
                ],

                newSections[
                index
                ],
            ] = [
                    newSections[
                    index
                    ],

                    newSections[
                    index - 1
                    ],
                ];


            setSections(
                newSections
            );


            await reorder(
                newSections
            );
        };


    const moveDown =
        async (index) => {
            if (
                index ===
                sections.length -
                1
            ) {
                return;
            }


            const newSections =
                [...sections];


            [
                newSections[
                index
                ],

                newSections[
                index + 1
                ],
            ] = [
                    newSections[
                    index + 1
                    ],

                    newSections[
                    index
                    ],
                ];


            setSections(
                newSections
            );


            await reorder(
                newSections
            );
        };


    if (loading) {
        return (
            <div className="p-10 text-center text-sm">
                Loading sections...
            </div>
        );
    }


    return (
        <div className="space-y-5">

            <button
                type="button"
                onClick={
                    () =>
                        navigate(
                            "/training-programmes"
                        )
                }
                className="text-xs font-semibold text-blue-600"
            >
                ← Back to Training Programmes
            </button>


            <section className="rounded-xl border bg-white p-5 shadow-sm">

                <div className="flex justify-between gap-4">

                    <div>

                        <h2 className="text-xl font-bold">
                            {
                                programme
                                    ?.title ||
                                "Learning Sections"
                            }
                        </h2>

                        <p className="mt-2 text-xs text-slate-500">
                            {
                                programme
                                    ?.description
                            }
                        </p>

                    </div>


                    <button
                        type="button"
                        onClick={
                            openCreate
                        }
                        disabled={
                            programme
                                ?.status ===
                            "inactive"
                        }
                        className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white disabled:bg-slate-300"
                    >
                        + Add Section
                    </button>

                </div>

            </section>


            {
                message && (
                    <div className="rounded-lg bg-emerald-50 p-3 text-xs text-emerald-700">
                        {message}
                    </div>
                )
            }


            {
                error && (
                    <div className="rounded-lg bg-red-50 p-3 text-xs text-red-700">
                        {error}
                    </div>
                )
            }


            {
                showForm && (
                    <section className="rounded-xl border bg-white p-5">

                        <form
                            onSubmit={
                                handleSubmit
                            }
                            className="space-y-4"
                        >

                            <input
                                type="text"
                                placeholder="Section title"
                                value={
                                    formData.title
                                }
                                onChange={
                                    (event) =>
                                        setFormData({
                                            ...formData,

                                            title:
                                                event.target
                                                    .value,
                                        })
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />


                            <textarea
                                rows="8"
                                placeholder="Learning content"
                                value={
                                    formData.content
                                }
                                onChange={
                                    (event) =>
                                        setFormData({
                                            ...formData,

                                            content:
                                                event.target
                                                    .value,
                                        })
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />


                            <input
                                type="text"
                                placeholder="Image URL"
                                value={
                                    formData.imageUrl
                                }
                                onChange={
                                    (event) =>
                                        setFormData({
                                            ...formData,

                                            imageUrl:
                                                event.target
                                                    .value,
                                        })
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />


                            <input
                                type="text"
                                placeholder="Image alt text"
                                value={
                                    formData
                                        .imageAltText
                                }
                                onChange={
                                    (event) =>
                                        setFormData({
                                            ...formData,

                                            imageAltText:
                                                event.target
                                                    .value,
                                        })
                                }
                                className="w-full rounded-lg border px-3 py-2"
                            />


                            <div className="flex justify-end gap-2">

                                <button
                                    type="button"
                                    onClick={
                                        closeForm
                                    }
                                    className="rounded-lg border px-4 py-2 text-xs"
                                >
                                    Cancel
                                </button>


                                <button
                                    type="submit"
                                    disabled={
                                        saving
                                    }
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-xs font-semibold text-white"
                                >
                                    {
                                        saving
                                            ? "Saving..."
                                            : editingSection
                                                ? "Save Changes"
                                                : "Add Section"
                                    }
                                </button>

                            </div>

                        </form>

                    </section>
                )
            }


            <section className="divide-y rounded-xl border bg-white">

                {
                    sections.map(
                        (
                            section,
                            index
                        ) => (
                            <div
                                key={
                                    section._id
                                }
                                className="p-5"
                            >

                                <div className="flex justify-between gap-4">

                                    <div className="flex-1">

                                        <div className="flex items-center gap-3">

                                            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                                {
                                                    section.order
                                                }
                                            </span>


                                            <h3 className="font-bold">
                                                {
                                                    section.title
                                                }
                                            </h3>


                                            <StatusBadge
                                                status={
                                                    section.status
                                                }
                                            />

                                        </div>


                                        <p className="mt-3 whitespace-pre-line text-xs leading-6 text-slate-600">
                                            {
                                                section.content
                                            }
                                        </p>

                                    </div>


                                    <div className="flex items-start gap-2">

                                        <button
                                            type="button"
                                            disabled={
                                                index ===
                                                0 ||
                                                reordering
                                            }
                                            onClick={
                                                () =>
                                                    moveUp(
                                                        index
                                                    )
                                            }
                                            className="rounded border px-2 py-1"
                                        >
                                            ↑
                                        </button>


                                        <button
                                            type="button"
                                            disabled={
                                                index ===
                                                sections.length -
                                                1 ||
                                                reordering
                                            }
                                            onClick={
                                                () =>
                                                    moveDown(
                                                        index
                                                    )
                                            }
                                            className="rounded border px-2 py-1"
                                        >
                                            ↓
                                        </button>


                                        <button
                                            type="button"
                                            disabled={
                                                programme
                                                    ?.status ===
                                                "inactive"
                                            }
                                            onClick={
                                                () =>
                                                    openEdit(
                                                        section
                                                    )
                                            }
                                            className="rounded bg-blue-50 px-3 py-1.5 text-[10px] font-semibold text-blue-700"
                                        >
                                            Edit
                                        </button>


                                        {
                                            section.status ===
                                                "inactive"
                                                ? (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            processingId ===
                                                            section._id ||
                                                            programme
                                                                ?.status ===
                                                            "inactive"
                                                        }
                                                        onClick={
                                                            () =>
                                                                reactivate(
                                                                    section
                                                                )
                                                        }
                                                        className="rounded bg-emerald-600 px-3 py-1.5 text-[10px] font-semibold text-white disabled:bg-slate-300"
                                                    >
                                                        Reactivate
                                                    </button>
                                                )
                                                : (
                                                    <button
                                                        type="button"
                                                        disabled={
                                                            processingId ===
                                                            section._id
                                                        }
                                                        onClick={
                                                            () =>
                                                                deactivate(
                                                                    section
                                                                )
                                                        }
                                                        className="rounded bg-red-50 px-3 py-1.5 text-[10px] font-semibold text-red-700"
                                                    >
                                                        Deactivate
                                                    </button>
                                                )
                                        }

                                    </div>

                                </div>

                            </div>
                        )
                    )
                }

            </section>

        </div>
    );
}


export default LearningSectionManager;