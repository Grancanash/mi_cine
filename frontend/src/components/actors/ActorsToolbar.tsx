import SearchIcon from "../icons/SearchIcon";
import { useEffect, useRef } from "react";

type TitlesToolbarProps = {
    order: string;
    setOrder: (newOrder: string) => void;
    total: number;
    setDebouncedSearch: (value: string) => void;
    loaderMainRef: React.RefObject<HTMLDivElement | null>;
    loading: boolean;
    setLoading: React.Dispatch<React.SetStateAction<boolean>>;
};

function TitlesToolbar({order, setOrder, total, setDebouncedSearch, loaderMainRef, loading, setLoading}: TitlesToolbarProps) {
    const timeoutRef = useRef<number | null>(null);

    // ------------------------ Búsqueda por texto escrito

    const handleChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;

        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
        }

        timeoutRef.current = setTimeout(() => {
            setLoading(true);
            setDebouncedSearch(value.trim());
        }, 500);
    };

    useEffect(() => {
        return () => {
        if (timeoutRef.current !== null) {
            window.clearTimeout(timeoutRef.current);
        }
        };
    }, []);

    return(
        <>
        <div className="flex flex-col md:flex-row justify-between md:mb-4 md:gap-4 items-center">
            <h1 className="text-2xl font-bold md:my-0 md:py-0 p-3">Actores</h1>

            {/* ---------------------------------------------------- ORDEN */}
            <div className="text-end order-titles flex flex-wrap gap-1 bg-white p-4 md:p-0 md:bg-transparent w-full md:w-auto">
                <div className={`btn font-light badge badge-primary ${order === "name" ? "" : "badge-outline"} hover:bg-primary hover:text-primary-content`}
                    onClick={() => setOrder("name")}>
                    A..Z
                </div>
                <div className={`btn font-light badge badge-primary ${order === "-name" ? "" : "badge-outline"} hover:bg-primary hover:text-primary-content`}
                    onClick={() => setOrder("-name")}>
                    Z..A
                </div>
            </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center p-4 md:p-0 bg-white md:bg-transparent">
            {/* ---------------------------------------------------- BUSCAR TÍTULO */}
            <div className="flex flex-col md:flex-row items-center md:w-200">
                <label className="input w-full md:flex-10">
                    <SearchIcon />
                    {/* <input type="search" placeholder="Buscar" id="titleSearchInput" onChange={(e) => setSearch(e.target.value)} /> */}
                    <input type="search" placeholder="Buscar" id="titleSearchInput" onChange={handleChangeInput} />
                </label>
                <div className="total-titles whitespace-nowrap px-4 flex-1 hidden md:block">
                    {total} actor{total !== 1 ? "es" : ""}
                </div>
                <div ref={loaderMainRef} className="hidden md:flex py-4 flex-1 p-0 h-20">
                    {loading ? (
                    <span className="loading loading-spinner loading-xs" />
                    ) : null }
                </div>
            </div>
        </div>
        </>
    );
}

export default TitlesToolbar;