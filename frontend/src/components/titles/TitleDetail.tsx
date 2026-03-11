import { Link } from "react-router-dom";
import type { Title } from "../../types/Title";

function TitleDetail({title}:{title:Title}) {

    return (
        <div className="flex flex-col gap-2">
            <p><strong>Tipo:</strong> <span className="font-light">{ title.type_display }</span></p>
            {title.categories && title.categories.length > 0 ?
            <p><strong>Géneros:</strong> <span className="font-normal inline-flex gap-1">{title.categories.map((item, index) => 
                (<span key={index} className="badge badge-soft badge-primary">{item.name}</span>)
            )}</span></p> : null }
            {title.actors && title.actors.length > 0 ? <p><strong>Actores:</strong> <span className="font-light">{title.actors.map((item) => item.name).join(', ')}</span></p> : null }
            <p><strong>Descripción:</strong> <span className="font-light">{ title.description }</span></p>
            {title.platforms && title.platforms.length > 0 ? <p><strong>Plataformas:</strong> <span className="font-light">{title.platforms.map((item) => item.name).join(', ')}</span></p> : null }
            {title.tracking && (
                <>
                {title.tracking.status_display && (<p><strong>Estado:</strong> <span className="font-light">{title.tracking.status_display}</span></p>)}
                {title.tracking.rating && (<p><strong>Valoración:</strong> ⭐ <span className="font-light">{title.tracking.rating}</span></p>)}
                </>
            )}
            <hr className="my-4 text-gray-200" />
            <p className="flex">
                <Link to={`/titles/${title.id}`} className="btn btn-primary" title="Editar">Editar</Link>
            </p>
            
        </div>
    );
}

export default TitleDetail;