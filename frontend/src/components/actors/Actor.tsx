import type { Actor as ActorType } from "../../types/Actor";
import ActorDetail from "./ActorDetail";
import { Link } from "react-router-dom";
import EditIcon from "../icons/EditIcon";

function Title({actor}:{actor:ActorType}) {

    return (
        <li className="list-row p-0 md:px-4 flex">
            <div className="flex-11">
                <div className="collapse collapse-arrow bg-base-100">
                    <input type="checkbox" className="absolute inset-0 w-full h-25 md:h-full z-20 cursor-pointer opacity-0" style={{ height: 'var(--title-height, 100px)' }}/>
                    <div className="collapse-title font-semibold flex flex-col md:flex-row align-middle">

                        {/* ------------------------------------------- TÍTULO */}
                        <div className="text-lg font-normal flex-11 flex items-center">{actor.name}</div>

                        <div className="flex">
                            {/* ------------------------------------------- EDICIÓN */}
                            <div className="relative z-30">
                                <Link to={`/actors/${actor.id}`} className="btn-title-update btn btn-square btn-ghost hover:bg-transparent hover:border-transparent pointer-events-auto z-20" title="Editar">
                                    <EditIcon />
                                </Link>
                            </div>
                        </div>

                    </div>
                    <div className="collapse-content text-sm">
                        <ActorDetail actor={actor} />
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Title;