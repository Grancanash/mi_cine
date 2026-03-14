import { Link } from "react-router-dom";
import ArrowDownIcon from "../icons/ArrowDownIcon";
import ArrowUpIcon from "../icons/ArrowUpIcon";
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

const getBtnClass = (currentOrder: string, targetOrder: string) => {
    const baseClass = "btn btn-xs border-gray-500 font-normal bg-transparent";
    const activeClass = "btn-active bg-gray-500! text-white";

    const inactiveClass = "badge-outline opacity-70 hover:opacity-100";
    
    return `${baseClass} ${currentOrder === targetOrder ? activeClass : inactiveClass}`;
};

function TitlesToolbar({order, setOrder, total, setDebouncedSearch, loaderMainRef, loading, setLoading}: TitlesToolbarProps) {
    const timeoutRef = useRef<number | null>(null);

    const showFilters = () => {
        const checkbox = document
        .getElementById("filters-collapse")
        ?.querySelector<HTMLInputElement>('input[type="checkbox"]');
        if (checkbox) checkbox.checked = !checkbox.checked;
    };

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
        <div className="md:px-0">
            <div className="flex flex-col md:flex-row justify-between md:gap-4 items-center">
                <h1 className="text-2xl font-bold md:py-0 pb-3 md:p-3">Mi Lista</h1>

                {/* ---------------------------------------------------- ORDEN */}
                <div className="text-end order-titles flex flex-wrap gap-1 bg-white p-4 md:p-0 md:bg-transparent">
                    <div className={getBtnClass(order, "-created_at")} onClick={() => setOrder("-created_at")}>
                        + Recientes
                    </div>
                    <div className={getBtnClass(order, "created_at")} onClick={() => setOrder("created_at")}>
                        + Antiguas
                    </div>
                    <div className={getBtnClass(order, "name")} onClick={() => setOrder("name")}>
                        A..Z
                    </div>
                    <div className={getBtnClass(order, "-name")} onClick={() => setOrder("-name")}>
                        Z..A
                    </div>
                    <div className={getBtnClass(order, "-year")} onClick={() => setOrder("-year")}>
                        Estreno <ArrowDownIcon />
                    </div>
                    <div className={getBtnClass(order, "year")} onClick={() => setOrder("year")}>
                        Estreno <ArrowUpIcon />
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
                        {total} título{total !== 1 ? "s" : ""}
                    </div>
                    <div ref={loaderMainRef} className="hidden md:flex py-4 flex-1 p-0 h-20">
                        {loading ? (
                        <span className="loading loading-spinner loading-xs" />
                        ) : null }
                    </div>
                </div>
                {/* ---------------------------------------------------- BOTONES FILTROS / AÑADIR TÍTULO */}
                <div className="flex justify-end items-center gap-1">
                    <button type="button" id="btn-filter" className="btn border-gray-400 font-normal" data-target="filters-collapse" onClick={showFilters}>
                        Filtros
                    </button>
                    <Link to="/titles/new" className="btn bg-primary text-white font-normal">Nuevo</Link>
                    <div className="total-titles whitespace-nowrap pl-4 md:px-4 flex-1 md:hidden">
                        {total} título{total !== 1 ? "s" : ""}
                    </div>
                    <div ref={loaderMainRef} className="md:hidden md:py-4 flex-1 p-0 md:h-20">
                        {loading ? (
                        <span className="loading loading-spinner loading-xs" />
                        ) : null }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default TitlesToolbar;