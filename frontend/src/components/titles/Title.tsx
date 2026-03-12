import { useEffect, useState } from "react";
import type { Title as TitleType } from "../../types/Title";
import TitleDetail from "./TitleDetail";
import { Link } from "react-router-dom";
import EditIcon from "../icons/EditIcon";

function Title({title}:{title:TitleType}) {

    const [rating, setRating] = useState(0);

    const halves = Array.from({ length: 10 }, (_, i) => i + 1);

    useEffect(() => {
        const tracking = title.tracking;

        if (tracking && tracking.rating != null) {
            setRating(tracking.rating);
        }
    }, [title.tracking]);

    return (
        <li className="list-row p-0 md:px-4 flex rounded-none md:rounded">
            <div className="flex-11">
                <div className="collapse collapse-arrow bg-base-100">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold flex flex-col md:flex-row align-middle pointer-events-none z-10">

                        {/* ------------------------------------------- TÍTULO */}
                        <div className="text-lg flex-11 flex items-center">{title.name} ({title.year})</div>

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

                    </div>
                    <div className="collapse-content text-sm">
                        <TitleDetail title={title} />
                    </div>
                </div>
            </div>
        </li>
    );
}

export default Title;