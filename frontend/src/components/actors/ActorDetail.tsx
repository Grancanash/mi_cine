import { Link } from "react-router-dom";
import type { Actor } from "../../types/Actor";
import { useMemo } from "react";

function ActorDetail({actor}:{actor: Actor}) {

    const allSexes = useMemo(() => [
        {value: 'M', label: 'Masculino'},
        {value: 'F', label: 'Femenino'}
    ], []);

    return (
        <div className="flex flex-col gap-2">
            <p><strong>Sexo:</strong> <span className="font-light">{ allSexes.find(sex => sex.value === actor.sex)?.label }</span></p>
            <p><strong>Cumpleaños:</strong> <span className="font-light">{ actor.birth_date ? new Date(actor.birth_date).toLocaleDateString() : '' }</span></p>
            <p><strong>Nacionalidad:</strong> <span className="font-light">{ actor.nationality }</span></p>
            <hr className="my-4 text-gray-200" />
            <p className="flex">
                <Link to={`/actors/${actor.id}`} className="btn btn-primary" title="Editar">Editar</Link>
            </p>
            
        </div>
    );
}

export default ActorDetail;