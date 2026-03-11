import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { StatusOption } from "../../types/StatusOption";

interface Props {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    originalTitle: string;
    setOriginalTitle: React.Dispatch<React.SetStateAction<string>>;
    year: number | '';
    setYear: React.Dispatch<React.SetStateAction<number | "">>;
    allTypes: {
        value: string;
        label: string;
    }[];
    valueType: StatusOption | null | undefined;
    setValueType: React.Dispatch<React.SetStateAction<StatusOption | null | undefined>>;
    seasons: number | '';
    setSeasons: React.Dispatch<React.SetStateAction<number | "">>;
    description: string;
    setDescription: React.Dispatch<React.SetStateAction<string>>;
    showSeassons: boolean;
}
function BasicDataSection({name, setName, originalTitle, setOriginalTitle, year, setYear, allTypes, valueType, setValueType, seasons, setSeasons, description, setDescription, showSeassons}: Props) {

    const selectStyle: StylesConfig<{value: string, label: string}, false> = {
        control: (baseStyles) => ({
            ...baseStyles,
            height: "40px",
            minHeight: "40px",
        }),
        option: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: state.isSelected
                ? "var(--color-primary)"
                : baseStyles.backgroundColor,
        })
    };

    return (
        <section className="flex flex-col">
            <h2 className="font-semibold text-lg bg-gray-100 px-5 py-2 ">Datos básicos</h2>
            <div className="flex flex-col p-4 gap-4">
                <div className="flex flex-col gap-1">
                    {/* ------------------------------------- TÍTULO */}
                    <label className="font-semibold" htmlFor="name">Título</label>
                    <input id="name" type="text" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-1">
                    {/* ------------------------------------- TÍTULO ORIGINAL */}
                    <label className="font-semibold" htmlFor="name">Título original</label>
                    <input id="original_title" type="text" className="input input-bordered w-full" value={originalTitle} onChange={(e) => setOriginalTitle(e.target.value)} />
                </div>
                <div className="flex flex-col md:flex-row gap-4 md:w-100">

                    {/* ------------------------------------- AÑO */}
                    <div className="flex flex-col flex-1 gap-1">
                        <label className="font-semibold" htmlFor="year">Año</label>
                        <input id="year" type="number" className="input input-bordered" value={year} onChange={(e) => setYear(e.target.value === "" ? "" : Number(e.target.value))}/>
                    </div>

                    {/* ------------------------------------- TIPO (PELÍCULA O SERIE) */}
                    <div className="flex flex-col flex-2 gap-1">
                        <label className="font-semibold">Tipo</label>
                        <Select options={allTypes} value={valueType} onChange={(item) => setValueType(item)} isSearchable={false} styles={selectStyle}/>
                    </div>

                    {/* ------------------------------------- TEMPORADAS */}
                    { showSeassons && 
                    <div className="flex flex-col flex-1 gap-1">
                        <label className="font-semibold" htmlFor="seasons">Temporadas</label>
                        <input id="seasons" type="number" className="input input-bordered" value={seasons} onChange={(e) => setSeasons(e.target.value === "" ? "" : Number(e.target.value))}/>
                    </div>
                    }
                </div>

                <div className="flex flex-col gap-1">
                    <label className="font-semibold" htmlFor="description">Descripción</label>
                    <textarea id="description" className="textarea textarea-bordered w-full min-h-30" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
            </div>
        </section>
    );
}

export default BasicDataSection;