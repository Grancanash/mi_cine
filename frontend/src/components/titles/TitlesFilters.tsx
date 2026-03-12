import Select from "react-select";
import type { MultiValue } from "react-select";
import type { CatalogOption } from "../../types/CatalogOption";
import type { StatusOption } from "../../types/StatusOption";
import { useMemo, useState} from "react";

type TitlesFiltersProp = {
    openFilter: boolean;
    setOpenFilter: React.Dispatch<React.SetStateAction<boolean>>;
    categories: CatalogOption[];
    status: StatusOption[];
    setFilterCategories: (value: string) => void;
    filterStatus: string;
    setFilterStatus: (value: string) => void;
    setFilterType: (value: string) => void;
}

function TitlesFilters({openFilter, setOpenFilter, categories, status, filterStatus, setFilterStatus, setFilterCategories, setFilterType}: TitlesFiltersProp) {

    const [type, setType] = useState('');

    
    const changeSelectCategories = (newValues: MultiValue<CatalogOption>) => {
        const arr = Array.isArray(newValues) ? newValues.map((value) => value.value) : [];
        const params = new URLSearchParams();
        arr.forEach((id) => params.append("category", String(id)));
        setFilterCategories('&' + params.toString());
    };

    const changeSelectStatus = (newValues: MultiValue<StatusOption | undefined>) => {
        const arr = Array.isArray(newValues) ? newValues.map((value) => value.value) : [];
        const params = new URLSearchParams();
        arr.forEach((id) => params.append("status", String(id)));
        setFilterStatus('&' + params.toString());
    };

    const changeInputType = (_e: React.MouseEvent<HTMLButtonElement>, type: string) => {
        setType(type);
        setFilterType(type);
    };

    const statusValue = useMemo(() => {
        if (!filterStatus) return [];
        const items = filterStatus.split('&').map(fs => status.find((s) => s.value === fs.split('=')[1])).filter(Boolean);
        return items;
    }, [filterStatus, status]);

    return (
        <div id="filters-collapse" className={`collapse bg-base-100 border-base-300 mb-1 ${ openFilter ? "overflow-visible z-10" : "" }`}>
            <input type="checkbox" className="hidden" />
            <div className="collapse-content text-sm p-0 ">
                <div className="border border-gray-200 p-4 m-0">
                    <div className="mb-4">
                        <p className="m-0! font-bold">Filtrar por:</p>
                    </div>
                    <div className="flex flex-col-reverse md:flex-row gap-2">
                        <div className="flex-1 flex flex-col gap-2">
                            {/* ------------------------------------- Filtro Categorías */}
                            <div className="flex-1 flex md:justify-end items-center gap-2">
                                <div className="flex-1 text-end">
                                    <label className="label">Géneros:</label>
                                </div>
                                <div className="flex-5">
                                    <Select isMulti name="categories" options={categories} className="basic-multi-select md:w-100" classNamePrefix="select"
                                        onMenuOpen={() => setOpenFilter(true)}
                                        onMenuClose={() => setOpenFilter(false)}
                                        onChange={changeSelectCategories}
                                    />
                                </div>
                            </div>
                            <div className="flex-1 flex md:justify-end items-center gap-2">
                                {/* ------------------------------------- Filtro Status */}
                                <div className="flex-1 text-end">
                                    <label className="label">Estado:</label>
                                </div>
                                <div className="flex-5">
                                    <Select isMulti name="status" options={status} value={statusValue} className="basic-multi-select md:w-100" classNamePrefix="select"
                                        onMenuOpen={() => setOpenFilter(true)}
                                        onMenuClose={() => setOpenFilter(false)}
                                        onChange={changeSelectStatus}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex-1 flex">
                            {/* ------------------------------------- Filtro Tipo */}
                            <div className="flex-1 flex md:justify-center items-center gap-1">
                                <button
                                    className={`btn bg-transparent join-item ${type === "" ? "btn-active" : ""}`}
                                    onClick={(e) => changeInputType(e, '')}>
                                    Todo
                                </button>
                                <button
                                    className={`btn bg-transparent join-item ${type === "series" ? "btn-active" : ""}`}
                                    onClick={(e) => changeInputType(e, "series")}>
                                    Series
                                </button>
                                <button
                                    className={`btn bg-transparent join-item ${type === "movie" ? "btn-active" : ""}`}
                                    onClick={(e) => changeInputType(e, "movie")}>
                                    Películas
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TitlesFilters;