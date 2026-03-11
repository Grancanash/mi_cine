import type { Title as TitleType } from "../../types/Title";
import { Link } from "react-router-dom";
import EditIcon from "../icons/EditIcon";

function Title({title}:{title:TitleType}) {

    const rating = title.tracking?.rating ?? 0;
    
    const halves = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <li className="list-row py-0 font-light flex">
            {/* ------------------------------------------- TÍTULO */}
            <div className="text-lg flex-11 flex items-center text-[15px]">{title.name} ({title.year})</div>

            <div className="flex">
                {/* ------------------------------------------- VALORACIÓN */}
                <div className="rating rating-xs rating-half h-12 flex items-center">
                    <input type="radio" name="rating" className="rating-hidden" />

                    {halves.map((value, index) => (
                        <div key={index} className={
                            "mask mask-star-2 " +
                            (value % 2 === 1 ? "mask-half-1" : "mask-half-2") +
                            " bg-orange-400"
                        } aria-current={rating === value ? "true" : undefined}></div>
                    ))}
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