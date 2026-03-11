import type { Catalog } from "./Catalog";

export type CatalogResponse = {
    count: number;
    next: string | null;
    previous: string | null;
    results: Catalog[];
};
