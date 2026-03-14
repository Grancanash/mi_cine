interface Props {
    title: string;
    onCollectInfo: () => void;
    searchLoading: boolean;
    searchMsg: string;
    searchResults: Record<string, unknown>[];
    handleSelectExternalTitle: (externalId: string | number, mediaType: string) => Promise<void>;
}
function HeaderTitle({title, onCollectInfo, searchLoading, searchMsg, searchResults, handleSelectExternalTitle}: Props) {
    return (
        <div>
            <div className="flex flex-col md:flex-row justify-between gap-4">
                <h1 className="text-2xl font-bold md:px-3">{title}</h1>
                <button type="button" className="btn border-gray-400 flex justify-center font-normal items-center" onClick={onCollectInfo}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                        <path fillRule="evenodd" d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z" clipRule="evenodd" />
                    </svg>
                    <div className="w-40 flex justify-center gap-4">{searchLoading ? <><span className="loading loading-spinner loading-xs"></span><span>Buscando...</span></> : <span>Recopilar información</span>}</div>
                </button>
                {searchMsg && !searchLoading && (<p className="px-5 text-sm text-red-500">{searchMsg}</p>)}
            </div>
            {searchResults.length > 0 && (
            <section className="mt-4 p-4 border border-gray-300 rounded-lg flex flex-col gap-1 bg-gray-300">
                <p className="text-secondary mb-2">Selecciona el título que buscas:</p>
                {/* --------------------------------------------- LISTA DE TÍTULOS PROPUESTOS */}
                {searchResults.map((t) => (
                <button
                    key={t.id as number}
                    type="button"
                    className="w-full px-3 py-1 rounded-sm bg-gray-200 hover:bg-gray-400 hover:text-white flex items-center justify-between cursor-pointer text-left"
                    onClick={(e) => {
                        (e.target as HTMLButtonElement).querySelector('.loading')?.classList.remove('hidden');
                        (handleSelectExternalTitle(t.id as number, t.media_type as string))
                    }}>
                    <span className="text-sm">
                        {t.name as string}{" "}
                        <span className="font-light">
                            ({t.year as number}) - {t.media_type === "tv" ? "Serie" : "Película"}
                        </span>
                        <span className="loading loading-spinner loading-xs ml-3 hidden"></span>
                    </span>
                    <span>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="size-4">
                            <path fillRule="evenodd" d="M12.78 7.595a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06l2.72-2.72-2.72-2.72a.75.75 0 0 1 1.06-1.06l3.25 3.25Zm-8.25-3.25 3.25 3.25a.75.75 0 0 1 0 1.06l-3.25 3.25a.75.75 0 0 1-1.06-1.06l2.72-2.72-2.72-2.72a.75.75 0 0 1 1.06-1.06Z" clipRule="evenodd" />
                        </svg>
                    </span>
                </button>
                ))}
            </section>
            )}
        </div>
    );
}

export default HeaderTitle;