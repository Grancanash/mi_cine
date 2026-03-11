import Select from "react-select";
import type { StylesConfig } from "react-select";
import type { StatusOption } from "../../types/StatusOption";

interface Props {
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    allSexes: {
        value: string;
        label: string;
    }[];
    valueSex: StatusOption | null | undefined;
    setValueSex: React.Dispatch<React.SetStateAction<StatusOption | null | undefined>>;
    birthday: string;
    setBirthday: React.Dispatch<React.SetStateAction<string>>;
    nationality: string;
    setNationality: React.Dispatch<React.SetStateAction<string>>;
}
function BasicDataSection({name, setName, allSexes, valueSex, setValueSex, birthday, setBirthday, nationality, setNationality }: Props) {

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
                    {/* ------------------------------------- NOMBRE */}
                    <label className="font-semibold" htmlFor="name">Nombre</label>
                    <input id="name" type="text" className="input input-bordered w-full" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    {/* ------------------------------------- SEXO */}
                    
                    <div className="flex flex-col flex-2 gap-1">
                        <label className="font-semibold">Sexo</label>
                        <Select options={allSexes} value={valueSex} onChange={(item) => setValueSex(item)} isSearchable={false} styles={selectStyle}/>
                    </div>
                    {/* ------------------------------------- CUMPLEAÑOS */}
                    <div className="flex flex-col flex-2 gap-1">
                        <label className="font-semibold" htmlFor="birthday">Cumpleaños</label>
                        <input id="birthday" type="date" className="input input-bordered" value={birthday} onChange={(e) => setBirthday(e.target.value)}/>
                    </div>
                    {/* ------------------------------------- NACIONALIDAD */}
                    <div className="flex flex-col flex-2 gap-1">
                        <label className="font-semibold" htmlFor="nationality">Nacionalidad</label>
                        <input id="nationality" type="text" className="input input-bordered" value={nationality} onChange={(e) => setNationality(e.target.value)}/>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default BasicDataSection;