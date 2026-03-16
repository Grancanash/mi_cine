import type { Title as TitleType } from "../../types/Title";
import { Link } from "react-router-dom";
import EditIcon from "../icons/EditIcon";

function Title({title}:{title:TitleType}) {

    const rating = title.tracking?.rating ?? 0;
    
    return (
        <li className="list-row py-0 font-light flex">
            {/* ------------------------------------------- TÍTULO */}
            <div className="text-lg flex-11 flex items-center text-[15px]">{title.name} ({title.year})</div>

            <div className="flex">
                {/* ------------------------------------------- VALORACIÓN */}
                <div className="flex items-center pointer-events-none">
                    {rating}<span className="text-gray-400">/10</span>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="size-5 text-amber-400">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401Z" clipRule="evenodd" />
                    </svg>
                </div>

                {/* ------------------------------------------- EDICIÓN */}
                <div className="flex-1 flex items-center">
                    <div>
                        <Link to={`/titles/${title.id}`} className="btn-title-update btn btn-square btn-ghost hover:bg-transparent hover:border-transparent pointer-events-auto z-20" title="Editar">
                            <EditIcon />
                        </Link>
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Title;