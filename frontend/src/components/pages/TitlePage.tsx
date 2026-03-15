import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import type { Title as TitleType } from "../../types/Title";
import type { CatalogResponse } from "../../types/CatalogResponse";
import type { Catalog } from "../../types/Catalog";
import type { CatalogOption } from "../../types/CatalogOption";
import type { StatusOption } from "../../types/StatusOption";
import type { StylesConfig } from "react-select";
import type { Status } from "../../types/Status";
import HeaderTitle from "../title/TitleHeaderSection";
import BasicDataSection from "../title/TitleBasicDataSection";
import OtherDataSection from "../title/TitleOtherDataSection ";
import TrackingSection from "../title/TitleTrackingSection ";
import FooterSection from "../title/TitleFooterSection";
import Swal from "sweetalert2";

function TitlePage() {

    const { id } = useParams<{ id: string }>();
    const isEditing = Boolean(id);

    const [title, setTitle] = useState<TitleType | null>(null);
    const [allCategories, setAllCategories] = useState<CatalogOption[]>([]);
    const [allActors, setAllActors] = useState<CatalogOption[]>([]);
    const [allPlatforms, setAllPlatforms] = useState<CatalogOption[]>([]);
    const [allTrackingStatus, setAllTrackingStatus] = useState<StatusOption[]>([]);
    const [allTypes, setAllTypes] = useState<{value: string, label: string}[]>([]);

    const [name, setName] = useState("");
    const [originalTitle, setOriginalTitle] = useState("");
    const [year, setYear] = useState<number | "">("");
    const [description, setDescription] = useState("");
    const [seasons, setSeasons] = useState<number | "">("");
    const [type, setType] = useState("");
    const [typeDisplay, setTypeDisplay] = useState("");

    const [categories, setCategories] = useState<Catalog[]>([]);
    const [actors, setActors] = useState<Catalog[]>([]);
    const [platforms, setPlatforms] = useState<Catalog[]>([]);

    const [trackingStatus, setTrackingStatus] = useState<string | "">("pending");
    const [trackingStatusDisplay, setTrackingStatusDisplay] = useState<string | "">("Pendiente");
    const [trackingRating, setTrackingRating] = useState<number | null>(0);
    const [trackingEpisode, setTrackingEpisode] = useState<number | null>(null);
    const [trackingOpinion, setTrackingOpinion] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const [inputValueCategories, setInputValueCategories] = useState("");
    const [inputValueActors, setInputValueActors] = useState("");
    const [inputValuePlatforms, setInputValuePlatforms] = useState("");

    const [valueType, setValueType] = useState<StatusOption | null>();
    const [valueCategories, setValueCategories] = useState<readonly CatalogOption[]>([]);
    const [valueActors, setValueActors] = useState<readonly CatalogOption[]>([]);
    const [valuePlatforms, setValuePlatforms] = useState<readonly CatalogOption[]>([]);
    const [valueTrackingStatus, setValueTrackingStatus] = useState<StatusOption | null>();

    const [showTrackingEpisode, setShowTrackingEpisode] = useState(true);
    const [showSeassons, setShowSeassons] = useState(true);

    const [searchResults, setSearchResults] = useState<Record<string, unknown>[]>([]);
    const [searchMsg, setSearchMsg] = useState("");
    const [searchLoading, setSearchLoading] = useState(false);

    const navigate = useNavigate();

    // Carga inicial
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                const dataCategories = (await api.get<CatalogResponse>(`/categories/`)).data;
                setAllCategories(dataCategories.results.map(item => ({value: item.id, label: item.name})));
                
                const dataActors = (await api.get<CatalogResponse>(`/actors/`)).data;
                setAllActors(dataActors.results.map(item => ({value: item.id, label: item.name})));
                
                const dataPlatforms = (await api.get<CatalogResponse>(`/platforms/`)).data;
                setAllPlatforms(dataPlatforms.results.map(item => ({value: item.id, label: item.name})));

                const dataStatus = (await api.get<Status[]>(`/tracking-status/`)).data;
                setAllTrackingStatus(dataStatus.map(item => ({value: item.status, label: item.status_display})));

                setAllTypes([
                    {value: 'series', label: 'Serie'},
                    {value: 'movie', label: 'Película'}
                ]);

                if (id) {
                    const dataTitle = (await api.get<TitleType>(`/titles/${id}/`)).data;
                    setTitle(dataTitle);
                    setName(dataTitle.name);
                    setOriginalTitle(dataTitle.original_title);
                    setYear(dataTitle.year ?? '');
                    setDescription(dataTitle.description || "");
                    setSeasons(dataTitle.seasons ?? '');
                    setType(dataTitle.type);
                    setTypeDisplay(dataTitle.type_display);
                    
                    setCategories(dataTitle.categories);
                    setActors(dataTitle.actors);
                    setPlatforms(dataTitle.platforms);
                    
                    if (dataTitle.tracking) {
                        setTrackingStatus(dataTitle.tracking.status ?? '');
                        setTrackingStatusDisplay(dataTitle.tracking.status_display ?? '');
                        setTrackingRating(dataTitle.tracking.rating ?? null);
                        setTrackingEpisode(dataTitle.tracking.current_episode ?? null);
                        setTrackingOpinion(dataTitle.tracking.opinion || "");
                    }
                }

            } catch (err: unknown) {
                const anyErr = err as { response?: { data?: { message?: string } } };
                setError(anyErr?.response?.data?.message || "Error cargando título");
            } finally {
                setLoading(false);
            }
        })();
    }, [id]);
    

    useEffect(() => {
        setValueType({value: type, label: typeDisplay});
    }, [type, typeDisplay]);

    useEffect(() => {
        setValueCategories(categories.map(item => ({value: item.id, label: item.name})));
    }, [categories]);

    useEffect(() => {
        setValueActors(actors.map(item => ({value: item.id, label: item.name})));
    }, [actors]);

    useEffect(() => {
        setValuePlatforms(platforms.map(item => ({value: item.id, label: item.name})));
    }, [platforms]);

    useEffect(() => {
        setValueTrackingStatus({value: trackingStatus, label: trackingStatusDisplay});
    }, [trackingStatus, trackingStatusDisplay]);

    useEffect(() => {
        setShowTrackingEpisode(valueTrackingStatus?.value != 'finished' && valueType?.value != 'movie');
    }, [valueTrackingStatus, valueType]);

    useEffect(() => {
        setShowSeassons(valueType?.value === 'series');
    }, [valueType]);

    
    // -------------------------------------------------------------------- SUBMIT
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                name,
                original_title: originalTitle,
                year: year === "" ? null : Number(year),
                description,
                seasons: seasons === "" ? 1 : Number(seasons),
                type: valueType?.value,
                categories: valueCategories.map(item => ({id:item.value, name:item.label})),
                actors: valueActors.map(item => ({id:item.value, name:item.label})),
                platforms: valuePlatforms.map(item => ({id:item.value, name:item.label})),
                tracking: {
                    status: valueTrackingStatus?.value,
                    rating: trackingRating,
                    current_episode: trackingEpisode || null,
                    opinion: trackingOpinion
                }
            };

            // console.log(payload)

            if (isEditing && id) {
                const { data: titleData } = await api.patch<TitleType>(`/titles/${id}/`, payload);
                setTitle(titleData);
                setSuccess("Título actualizado correctamente.");
                navigate("/titles");
            } else {
                const { data: createData } = await api.post<{ id: string; data?: TitleType }>('/titles/', payload);
                setSuccess("Título creado correctamente.");
                navigate(`/titles/${createData.id}`);
            }
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } };
            setError(anyErr?.response?.data?.message || "Error guardando título");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 max-w-250 mx-auto">Cargando...</div>;
    if (isEditing && !title) {
        return <div className="p-6 max-w-3xl mx-auto">No se encontró el título.</div>;
    }

    const createOption = (allValues: CatalogOption[], inputValue: string) => {
        return allValues.find(
            item => item.label.toLowerCase() === inputValue.toLowerCase())
            ?? {label: inputValue, value: null}
    };

    const selectStyle: StylesConfig<{value: string, label: string}, false> = {
        control: (baseStyles) => ({
            ...baseStyles,
            height: "40px",
            minHeight: "40px",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isSelected
                ? "var(--color-primary)"
                : baseStyles.backgroundColor,
        })
    };

    const handleCollectInfo = async () => {
        if (!name) return;
        if (searchLoading) return;

        try {
            setSearchLoading(true);
            setSearchMsg("");
            setSearchResults([]);

            const res = await api.get("/search/external/", {
                params: { text: name },
            });

            if (!res.data.status) {
                setSearchMsg(res.data.msg || "Sin resultados");
                return;
            }

            setSearchResults(res.data.titles);
        }  catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } };
            setError(anyErr?.response?.data?.message || "Error buscando en TMDB");
        } finally {
            setSearchLoading(false);
        }
    }

    const handleSelectExternalTitle = async (
        externalId: string | number,
        mediaType: string,
    ) => {
        try {
            setSearchLoading(true);

            const res = await api.get("/search/external/", {
                params: { id: externalId, media_type: mediaType },
            });

            const info = res.data.title_info as {
                name: string;
                original_title: string;
                year: string;
                type: string; // 'tv' | 'movie'
                description: string;
                categories: string[];
                actors: string[];
                platforms: string[];
            };

            // Título
            setName(info.name);

            // Título original (si lo tuvieras en el formulario de React)
            setOriginalTitle(info.original_title);

            // Año
            setYear(info.year ? Number(info.year) : "");

            // Tipo
            const typeValue = info.type === "tv" ? "series" : "movie";
                setType(typeValue);
                setTypeDisplay(typeValue === "series" ? "Serie" : "Película");
                setValueType({
                value: typeValue,
                label: typeValue === "series" ? "Serie" : "Película",
            });

            // Descripción
            setDescription(info.description || "");

            // Categorías → `valueCategories`
            setValueCategories([]);
            info.categories.map((item) => {
                setValueCategories((prev) => [...prev, createOption(allCategories, item)]);
            });

            // Actores
            setValueActors([]);
            info.actors.map((item) => {
                setValueActors((prev) => [...prev, createOption(allActors, item)]);
            });

            // Plataformas
            setValuePlatforms([]);
            info.platforms.map((item) => {
                setValuePlatforms((prev) => [...prev, createOption(allPlatforms, item)]);
            });

            // Limpia resultados después de seleccionar
            setSearchResults([]);
            setSearchMsg("");
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } };
            setError(anyErr?.response?.data?.message || "Error obteniendo detalles del título");
        } finally {
            setSearchLoading(false);
        }
    };

    

    const handleDelete = async () => {
        const result = await Swal.fire({
            title: "¿Eliminar título?",
            text: "Esta acción no se puede deshacer.",
            icon: "warning",
            iconColor: "#545454",
            showCancelButton: true,
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            buttonsStyling: false, // 👉 desactiva estilos propios de SweetAlert
            customClass: {
                actions: "flex flex-row-reverse gap-2 justify-end",
                confirmButton: "btn bg-red-600 text-white border-none",
                cancelButton: "btn btn-ghost"
            }
        }) as { isConfirmed: boolean };

        if (!result.isConfirmed) return;

        try {
            setSaving(true);  // Deshabilitar botones
            await api.delete(`/titles/${id}/`);
            navigate("/titles", { replace: true });  // replace = no back button
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } };
            setError(anyErr?.response?.data?.message || "Error eliminando título");
        } finally {
            setSaving(false);
        }
    };



    return (
        <div className="p-4 md:px-0 py-8 max-w-250 md:mx-auto flex flex-col gap-6">

            {/* ------------------------------------- CABECERA (TÍTULO / BUSCAR / FILTROS) */}
            <HeaderTitle
                title={isEditing ? name : "Nuevo título"}
                onCollectInfo={handleCollectInfo}
                searchLoading={searchLoading}
                searchMsg={searchMsg}
                searchResults={searchResults}
                handleSelectExternalTitle={handleSelectExternalTitle} />
            
            <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg flex flex-col gap-6 bg-white">
                    
                {/* ------------------------------------- DATOS BÁSICOS */}
                <BasicDataSection
                    name={name}
                    setName={setName}
                    originalTitle={originalTitle}
                    setOriginalTitle={setOriginalTitle}
                    year={year}
                    setYear={setYear}
                    allTypes={allTypes}
                    valueType={valueType}
                    setValueType={setValueType}
                    seasons={seasons}
                    setSeasons={setSeasons}
                    description={description}
                    setDescription={setDescription}
                    showSeassons={showSeassons} />

                {/* ------------------------------------- OTROS DATOS */}
                <OtherDataSection
                    inputValueCategories={inputValueCategories}
                    allCategories={allCategories}
                    setValueCategories={setValueCategories}
                    setInputValueCategories={setInputValueCategories}
                    valueCategories={valueCategories}
                    inputValueActors={inputValueActors}
                    allActors={allActors}
                    setInputValueActors={setInputValueActors}
                    setValueActors={setValueActors}
                    valueActors={valueActors}
                    setInputValuePlatforms={setInputValuePlatforms}
                    inputValuePlatforms={inputValuePlatforms}
                    allPlatforms={allPlatforms}
                    setValuePlatforms={setValuePlatforms}
                    valuePlatforms={valuePlatforms} />

                {/* ------------------------------------- TRACKING */}
                <TrackingSection
                    allTrackingStatus={allTrackingStatus}
                    valueTrackingStatus={valueTrackingStatus}
                    selectStyle={selectStyle}
                    setValueTrackingStatus={setValueTrackingStatus}
                    showTrackingEpisode={showTrackingEpisode}
                    trackingEpisode={trackingEpisode}
                    setTrackingEpisode={setTrackingEpisode}
                    trackingRating={trackingRating}
                    setTrackingRating={setTrackingRating}
                    trackingOpinion={trackingOpinion}
                    setTrackingOpinion={setTrackingOpinion} />
                

                {/* ------------------------------------- FOOTER */}
                <FooterSection saving={saving} error={error} success={success} isEditing={isEditing} handleDelete={handleDelete} />
            </form>
        </div>
    );
}

export default TitlePage;