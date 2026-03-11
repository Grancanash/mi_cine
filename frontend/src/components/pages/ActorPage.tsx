import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/client";
import HeaderActor from "../actor/ActorHeaderSection";
import BasicDataSection from "../actor/ActorBasicDataSection";
import FooterSection from "../actor/ActorFooterSection";
import type { Actor } from "../../types/Actor";
import type { StatusOption } from "../../types/StatusOption";

function ActorPage() {

    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const isEditing = Boolean(id);

    const [actor, setActor] = useState<Actor | null>(null);
    const [name, setName] = useState("");
    const [birthday, setBirthday] = useState('');
    const [nationality, setNationality] = useState("");
    const [valueSex, setValueSex] = useState<StatusOption | null>();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const allSexes = useMemo(() => [
        {value: 'M', label: 'Masculino'},
        {value: 'F', label: 'Femenino'}
    ], []);

    // Carga inicial
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                if (id) {
                    const dataActor = (await api.get<Actor>(`/actors/${id}/`)).data;
                    setActor(dataActor);
                    setName(dataActor.name);
                    if (dataActor.sex) setValueSex({value: dataActor.sex, label: allSexes.find(sex => sex.value === dataActor.sex)!.label});
                    setBirthday(dataActor.birth_date ? new Date(dataActor.birth_date).toISOString().split('T')[0] : '');
                    setNationality(dataActor.nationality);
                }

            } catch (err: unknown) {
                const anyErr = err as { response?: { data?: { message?: string } } };
                setError(anyErr?.response?.data?.message || "Error cargando título");
            } finally {
                setLoading(false);
            }
        })();
    }, [id, allSexes]);
    
    // -------------------------------------------------------------------- SUBMIT
    const handleSubmit = async (e: React.SubmitEvent) => {
        e.preventDefault();

        try {
            setSaving(true);
            setError("");
            setSuccess("");

            const payload = {
                name,
                sex: valueSex?.value,
                birth_date: birthday || null,
                nationality,
            };

            // console.log(payload)

            if (isEditing && id) {
                // Editar registro
                const { data: actorData } = await api.patch<Actor>(`/actors/${id}/`, payload);
                setActor(actorData);
                setSuccess("Actor actualizado correctamente.");
            } else {
                // Crear registro
                // WARNIG: De momento no se pueden crear, sólo editar
                const { data: createData } = await api.post<{ id: string; data?: Actor }>('/actors/', payload);
                setSuccess("Actor creado correctamente.");
                navigate(`/actors/${createData.id}`);
            }
        } catch (err: unknown) {
            const anyErr = err as { response?: { data?: { message?: string } } };
            setError(anyErr?.response?.data?.message || "Error guardando actor");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="p-6 max-w-250 mx-auto">Cargando...</div>;
    if (isEditing && !actor) {
        return <div className="p-6 max-w-3xl mx-auto">No se encontró el actor.</div>;
    }

    return (
        <div className="p-6 max-w-250 mx-4 md:mx-auto flex flex-col gap-6" data-theme="light">

            {/* ------------------------------------- CABECERA (TÍTULO / BUSCAR / FILTROS) */}
            <HeaderActor title={name} />
            
            <form onSubmit={handleSubmit} className="border border-gray-300 rounded-lg flex flex-col gap-6 bg-white">
                    
                {/* ------------------------------------- DATOS BÁSICOS */}
                <BasicDataSection
                    name={name}
                    setName={setName}
                    allSexes={allSexes}
                    valueSex={valueSex}
                    setValueSex={setValueSex}
                    birthday={birthday}
                    setBirthday={setBirthday}
                    nationality={nationality}
                    setNationality={setNationality} />

                {/* ------------------------------------- FOOTER */}
                <FooterSection saving={saving} error={error} success={success} />
            </form>
        </div>
    );
}

export default ActorPage;