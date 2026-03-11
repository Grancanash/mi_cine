import { Link } from "react-router-dom";

interface Props {
    saving: boolean;
    error: string;
    success: string;
    isEditing: boolean;
    handleDelete: () => Promise<void>;
}

function FooterSection({saving, error, success, isEditing, handleDelete}: Props) {
    return (
        <section className="flex flex-col">
            <div className="flex px-4 justify-between">
                <div className="flex items-end">
                    {/* ------------------------------------- BOTÓN VOLVER */}
                    <Link to="/titles" className={`btn btn-ghost border border-gray-300 ${saving ? "opacity-50 pointer-events-none" : ""}`}>Volver</Link>
                </div>
                <div className="flex flex-col md:flex-row gap-2 justify-end md:items-center">
                    {/* ------------------------------------- BOTÓN ELIMINAR */}
                    { isEditing &&
                    <button type="button" className="btn btn-xs md:btn-sm text-white btn-error" disabled={saving}
                        onClick={handleDelete}>Eliminar
                    </button>
                    }

                    {/* ------------------------------------- BOTÓN GUARDAR */}
                    <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? "Guardando..." : "Guardar cambios"}
                    </button>
                </div>        
            </div>
            <div className="flex px-4 py-1 justify-end h-8 items-center">
                {saving ? <span className="loading loading-spinner loading-xs text-primary"></span> : ''}
                {error && <span className="text-sm text-red-500">{error}</span>}
                {success && (
                <span className="text-sm text-green-600">{success}</span>
                )}
            </div>
        </section>
    );
}

export default FooterSection;