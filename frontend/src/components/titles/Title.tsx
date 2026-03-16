import type { Title as TitleType } from "../../types/Title";
import TitleDetail from "./TitleDetail";
import { Link } from "react-router-dom";
import EditIcon from "../icons/EditIcon";

function Title({title}:{title:TitleType}) {

    const rating = title.tracking?.rating ?? 0;
    const halves = Array.from({ length: 10 }, (_, i) => i + 1);

    return (
        <li className="list-row p-0 md:px-4 flex rounded-none md:rounded">
            <div className="flex-11">
                <div className="collapse collapse-arrow bg-base-100">
                    {/* <input type="checkbox" /> */}
                    <input 
                        type="checkbox" 
                        className="absolute inset-0 w-full h-25 md:h-full z-20 cursor-pointer opacity-0" 
                        style={{ height: 'var(--title-height, 100px)' }}
                    />
                    <div className="collapse-title font-semibold flex flex-col md:flex-row align-middle">

                        {/* ------------------------------------------- TÍTULO */}
                        <div className="text-lg font-normal flex-11 flex items-center">{title.name} ({title.year})</div>

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
                            <div className="relative z-30">
                                <Link to={`/titles/${title.id}`} className="btn btn-square btn-ghost" onClick={(e) => e.stopPropagation()}>
                                    <EditIcon />
                                </Link>
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