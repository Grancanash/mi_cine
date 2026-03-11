function Title() {
    return (
        <>
        <li className="list-row p-0 flex">
            <div className="flex-11">
                <div className="collapse collapse-arrow bg-base-100">
                <input type="checkbox" />
                <div className="collapse-title font-semibold flex align-middle pointer-events-none z-10">

                    <div className="text-lg flex-11 flex items-center">title.name (title.year)</div>

                    <div className="flex-2">
                    <div className="rating rating-xs rating-half h-12 flex items-center">
                        <div className="rating-hidden"></div>
                        <div className="mask mask-star-2 mask-half-1 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-2 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-1 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-2 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-1 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-2 bg-orange-400" aria-current="true"></div>
                        <div className="mask mask-star-2 mask-half-1 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-2 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-1 bg-orange-400"></div>
                        <div className="mask mask-star-2 mask-half-2 bg-orange-400"></div>
                    </div>
                    </div>

                    <div className="flex-1">
                    <div>
                        <a className="btn-title-update btn btn-square btn-ghost hover:bg-transparent hover:border-transparent pointer-events-auto z-20" href="{% url 'titles:title-update' title.id %}" title="Editar">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-primary/50 hover:text-primary">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                            </svg>
                        </a>
                    </div>
                    </div>

                </div>
                <div className="collapse-content text-sm">
                    include "titles/_title_detail.html"
                </div>  
                </div>
            </div>
        </li>
        </>
    );
}

export default Title;