import Title from "./Title";
import type { Title as TitleType } from "../../types/Title";
import type React from "react";
import TitleSM from "./TitleSM";

type TitlesListType = {
    titles: TitleType[];
    total: number;
    hasMore: boolean;
    error: string;
    loaderInfiniteScrollRef: React.RefObject<HTMLLIElement | null>;
    loading: boolean;
    typeList: string;
    enableInfiniteScroll?: boolean;
}

function TitlesList({titles, total, hasMore, error, loaderInfiniteScrollRef, loading, typeList, enableInfiniteScroll = true}: TitlesListType) {
    return (
        <div>
            <ul
                id="titles-container"
                className="list bg-base-100 rounded-box shadow-lg p-0! m-0! border border-gray-200">
                {total ? (
                <>
                    {titles.map((title) => {
                        switch(typeList) {
                            case 'sm':
                            return <TitleSM title={title} key={title.id} />

                            default:
                            return <Title title={title} key={title.id} />
                        }
                    })}
                </>
                ) : !loading ? (
                <li className="p-20 text-center text-lg">No hay registros</li>
                ) : null }
                {enableInfiniteScroll && (
                <li id="Loader-decoy" ref={loaderInfiniteScrollRef} className={`justify-center py-4 ${hasMore && !error ? 'flex' : 'hidden'}`}>
                    {loading ?
                    <span className="loading loading-spinner loading-sm" /> :
                    <span className="text-sm text-gray-500">Desplázate para cargar más... {hasMore}</span>
                    }
                </li>
                )}
            </ul>
            {error && (
            <div className="mt-4 flex justify-center">
                <div className="alert alert-error shadow-lg">
                    <span>{error}</span>
                </div>
            </div>
            )}
        </div>
    );
}

export default TitlesList;