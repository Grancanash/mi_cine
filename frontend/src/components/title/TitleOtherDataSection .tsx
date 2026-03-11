import CreatableSelect, { type CreatableProps } from "react-select/creatable";
import type { CatalogOption } from "../../types/CatalogOption";
import type { GroupBase, MultiValue, OptionsOrGroups } from "react-select";
import type { UseAsyncPaginateParams, ComponentProps } from "react-select-async-paginate";
import { withAsyncPaginate } from "react-select-async-paginate";
import type { ReactElement } from "react";
import api from "../../api/client";
import type { CatalogResponse } from "../../types/CatalogResponse";


type CatalogsAdditional = {
  page: number;
};

// ---------- Wrapper para Creatable + async paginate ----------
type AsyncPaginateCreatableProps<
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean,
> = CreatableProps<OptionType, IsMulti, Group> &
  UseAsyncPaginateParams<OptionType, Group, CatalogsAdditional> &
  ComponentProps<OptionType, Group, IsMulti>;

type AsyncPaginateCreatableType = <
  OptionType,
  Group extends GroupBase<OptionType>,
  IsMulti extends boolean = false,
>(props: AsyncPaginateCreatableProps<OptionType, Group, IsMulti>) => ReactElement;

const AsyncPaginateCreatable = withAsyncPaginate(CreatableSelect) as AsyncPaginateCreatableType;

// ------------------------------------------------------------

interface Props {
    inputValueCategories: string;
    allCategories: CatalogOption[];
    setInputValueCategories: React.Dispatch<React.SetStateAction<string>>;
    setValueCategories: React.Dispatch<React.SetStateAction<readonly CatalogOption[]>>;
    valueCategories: readonly CatalogOption[];
    inputValueActors: string;
    allActors: CatalogOption[];
    setInputValueActors: React.Dispatch<React.SetStateAction<string>>;
    setValueActors: React.Dispatch<React.SetStateAction<readonly CatalogOption[]>>;
    valueActors: readonly CatalogOption[];
    setInputValuePlatforms: React.Dispatch<React.SetStateAction<string>>;
    inputValuePlatforms: string;
    allPlatforms: CatalogOption[];
    setValuePlatforms: React.Dispatch<React.SetStateAction<readonly CatalogOption[]>>;
    valuePlatforms: readonly CatalogOption[];
}

function TitleOtherDataSection({
  inputValueCategories,
  allCategories,
  setValueCategories,
  setInputValueCategories,
  valueCategories,
  inputValueActors,
  allActors,
  setInputValueActors,
  setValueActors,
  valueActors,
  setInputValuePlatforms,
  inputValuePlatforms,
  allPlatforms,
  setValuePlatforms,
  valuePlatforms,
}: Props) {
    const createOption = (allValues: CatalogOption[], inputValue: string) => {
        return (
            allValues.find(
                (item) => item.label.toLowerCase() === inputValue.toLowerCase()
            ) ?? { label: inputValue, value: null }
        );
    };

    const onChangeCategories = (newValue: MultiValue<CatalogOption>) => {
        const newOption = newValue[newValue.length - 1];
        if (newOption && "__isNew__" in newOption) {
            setValueCategories((prev) => [
                ...prev,
                createOption(allCategories, newOption.label),
            ]);
        } else {
            setValueCategories(newValue);
        }
    };

    const onKeyDownCategories = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (
            event.key === "Enter" ||
            event.key === "Tab" ||
            event.key === ","
        ) {
            const text = inputValueCategories.trim().toLowerCase();
            const existsInSelected = valueCategories.some(
                (opt) => opt.label.toLowerCase() === text
            );
            if (!existsInSelected) {
                setValueCategories((prev) => [
                    ...prev,
                    createOption(allCategories, inputValueCategories),
                ]);
            }
            setInputValueCategories("");
            event.preventDefault();
        }
    };

    const onChangeActors = (newValue: MultiValue<CatalogOption>) => {
        const newOption = newValue[newValue.length - 1];
        if (newOption && "__isNew__" in newOption ) {
            setValueActors((prev) => [
                ...prev,
                createOption(allActors, newOption.label),
            ]);
        } else setValueActors(newValue);
    };

    const onKeyDownActors = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (
            event.key === "Enter" ||
            event.key === "Tab" ||
            event.key === ","
        ) {
            const text = inputValueActors.trim().toLowerCase();
            const existsInSelected = valueActors.some(
                (opt) => opt.label.toLowerCase() === text
            );
            if (!existsInSelected) {
                setValueActors((prev) => [
                    ...prev,
                    createOption(allActors, inputValueActors),
                ]);
            }
            setInputValueActors("");
            event.preventDefault();
        }
    };

    const onChangePlatforms = (newValue: MultiValue<CatalogOption>) => {
        const newOption = newValue[newValue.length - 1];
        if (newOption &&  "__isNew__" in newOption) {
            setValuePlatforms((prev) => [
                ...prev,
                createOption(allPlatforms, newOption.label),
            ]);
        } else {
            setValuePlatforms(newValue);
        }
    };

    const onKeyDownPlatforms = (
        event: React.KeyboardEvent<HTMLDivElement>
    ) => {
        if (
            event.key === "Enter" ||
            event.key === "Tab" ||
            event.key === ","
        ) {
            const text = inputValuePlatforms.trim().toLowerCase();
            const existsInSelected = valuePlatforms.some(
                (opt) => opt.label.toLowerCase() === text
            );
            if (!existsInSelected) {
                setValuePlatforms((prev) => [
                ...prev,
                createOption(allPlatforms, inputValuePlatforms),
                ]);
            }
            setInputValuePlatforms("");
            event.preventDefault();
        }
    };

    // DRF paginado: /api/actors/?search=&page=N&page_size=24
    const loadCatalog = (catalog: string) => async (
        search: string,
        _loadedOptions: OptionsOrGroups<CatalogOption, GroupBase<CatalogOption>>,
        additional?: CatalogsAdditional
    ) => {
        const page = additional?.page ?? 1;
        
        const { data } = await api.get<CatalogResponse>(`/${catalog}/`, {
            params: {search, page, page_size: 24}
        });

        return {
            options: data.results.map((a) => ({
                value: a.id,
                label: a.name,
            }) satisfies CatalogOption),
            hasMore: data.next !== null,
            additional: { page: page + 1 },
        };
    };


    return (
        <section className="flex flex-col">
        <h2 className="font-semibold text-lg bg-gray-100 px-5 py-2">
            Otros datos
        </h2>

        <div className="flex flex-col p-4 gap-4">
            {/* ------------------------------------- CATEGORÍAS (GÉNEROS) */}
            <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="categories">
                Géneros
            </label>
            <AsyncPaginateCreatable
                inputId="categories"
                inputValue={inputValueCategories}
                isClearable
                isMulti
                loadOptions={loadCatalog('categories')}
                placeholder="Escribe algo y pulsa Enter..."
                value={valueCategories}
                onChange={onChangeCategories}
                onInputChange={(newValue) => setInputValueCategories(newValue)}
                onKeyDown={onKeyDownCategories}
                className="w-full"
                additional={{ page: 1 }}
                debounceTimeout={300}
                />
            </div>

            {/* ------------------------------------- ACTORES (scroll infinito) */}
            <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="actors">
                Actores
            </label>
            <AsyncPaginateCreatable
                inputId="actors"
                inputValue={inputValueActors}
                isClearable
                isMulti
                loadOptions={loadCatalog('actors')}
                placeholder="Escribe algo y pulsa Enter..."
                value={valueActors}
                onChange={onChangeActors}
                onInputChange={(newValue) => setInputValueActors(newValue)}
                onKeyDown={onKeyDownActors}
                className="w-full"
                additional={{ page: 1 }}
                debounceTimeout={300}
                />
            </div>

            {/* ------------------------------------- PLATAFORMAS */}
            <div className="flex flex-col gap-1">
            <label className="font-semibold" htmlFor="platforms">
                Plataformas
            </label>
            <AsyncPaginateCreatable
                inputId="platforms"
                inputValue={inputValuePlatforms}
                isClearable
                isMulti
                loadOptions={loadCatalog('platforms')}
                placeholder="Escribe algo y pulsa Enter..."
                value={valuePlatforms}
                onChange={onChangePlatforms}
                onInputChange={(newValue) => setInputValuePlatforms(newValue)}
                onKeyDown={onKeyDownPlatforms}
                className="w-full"
                additional={{ page: 1 }}
                debounceTimeout={300}
                />
            </div>
        </div>
        </section>
    );
}

export default TitleOtherDataSection;
