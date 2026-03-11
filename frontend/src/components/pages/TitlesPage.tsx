import { useCallback, useEffect, useRef, useState } from "react";
import { fetchCategoriesApi, fetchStatusApi, fetchTitlesApi, handleAxiosError } from "../../api/client";
import type { Title as TitleType } from "../../types/Title";
import type { CatalogOption } from "../../types/CatalogOption";
import TitlesToolbar from "../titles/TitlesToolbar";
import TitlesFilters from "../titles/TitlesFilters";
import TitlesList from "../titles/TitlesList";
import type { StatusOption } from "../../types/StatusOption";
import { useSearchParams } from "react-router-dom";

function TitlesPage() {
    const [titles, setTitles] = useState<TitleType[]>([]);
    const [categories, setCategories] = useState<CatalogOption[]>([]);
    const [status, setStatus] = useState<StatusOption[]>([]);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState("-created_at");
    const [total, setTotal] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openFilter, setOpenFilter] = useState(false);
    const [filterCategories, setFilterCategories] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterType, setFilterType] = useState("");

    const loaderMainRef = useRef<HTMLDivElement | null>(null);
    const loaderInfiniteScrollRef = useRef<HTMLLIElement | null>(null);

    const [searchParams, _setSearchParams ] = useSearchParams();

    const [ready, setReady] = useState(false);
    const [queryVersion, setQueryVersion] = useState(0);

    // -------------------------------------------------------------------
    // 1) CARGA INICIAL: catálogos + primer fetch de títulos (con querystring)
    // -------------------------------------------------------------------
    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setError("");

                const [categoriesData, statusData] = await Promise.all([
                    fetchCategoriesApi(),
                    fetchStatusApi(),
                ]);

                const categoriesOptions = categoriesData.results.map((item) => ({
                    value: item.id,
                    label: item.name,
                }));
                setCategories(categoriesOptions);

                const statusOptions = statusData.map((item) => ({
                    value: item.status,
                    label: item.status_display,
                }));
                setStatus(statusOptions);

                // status desde querystring (solo una vez)
                const qsStatus = searchParams.get("status");
                
                const initialFilterStatus = qsStatus ? `&status=${qsStatus}` : "";
                setFilterStatus(initialFilterStatus);

                // primer fetch de títulos
                const data = await fetchTitlesApi({
                    page: 1,
                    filterType,
                    order,
                    search: debouncedSearch,
                    filterCategories,
                    filterStatus: initialFilterStatus,
                });

                setTitles(data.results);
                setTotal(data.count);
                setHasMore(Boolean(data.next));
                setPage(1);

                setReady(true); // a partir de aquí permitimos refetch
            } catch (err: unknown) {
                handleAxiosError(err, setError, "Error en la carga inicial")
            } finally {
                setLoading(false);
            }
        })();
    }, []);

    // -------------------------------------------------------------------
    // 2) REFETCH de página 1 cuando el usuario cambia orden/búsqueda/filtros
    // -------------------------------------------------------------------
    const refetchTitles  = useCallback(async () => {
        if (!ready) return;

        try {
            setHasMore(true);
            setError("");
            const data = await fetchTitlesApi({
                page: 1,
                order,
                search: debouncedSearch,
                filterCategories,
                filterStatus,
                filterType,
            });

            setTitles(data.results);
            setTotal(data.count);
            setHasMore(Boolean(data.next));
            setPage(1);
        } catch (err: unknown) {
            handleAxiosError(err, setError, "Error cargando más títulos");
        } finally {
            setLoading(false);
        }
    }, [
        ready,
        order,
        debouncedSearch,
        filterCategories,
        filterStatus,
        filterType
    ]);

    useEffect(() => {
        if (!ready) return;
        if (queryVersion === 0) return; // aún no hubo interacción del usuario
        refetchTitles();
    }, [ready, queryVersion, refetchTitles]);

    // Helpers para cambios del usuario (actualizan estado + bump de queryVersion)
    const handleChangeOrder = (newOrder: string) => {
        setOrder(newOrder);
        setPage(1);
        setQueryVersion((v) => v + 1);
    };
    const handleChangeSearch = (value: string) => {
        setDebouncedSearch(value);
        setQueryVersion((v) => v + 1);
    };

    const handleChangeCategories = (value: string) => {
        setFilterCategories(value);
        setPage(1);
        setQueryVersion((v) => v + 1);
    };

    const handleChangeStatus = (value: string) => {
        setFilterStatus(value);
        setPage(1);
        setQueryVersion((v) => v + 1);
    };

    const handleChangeType = (value: string) => {
        setFilterType(value);
        setPage(1);
        setQueryVersion((v) => v + 1);
    };

    


    // -------------------------------------------------------------------
    // 3) INFINITE SCROLL (page + 1)
    // -------------------------------------------------------------------

    const loadMoreTitles = useCallback(async() => {
        if (!ready) return;
        if (!hasMore) return;
        if (loading) return;
        if (total < 24) return;

        try {
            setLoading(true);
            setError("");
            const data = await fetchTitlesApi({
                page: page + 1,
                order,
                search: debouncedSearch,
                filterCategories,
                filterStatus,
                filterType,
            });

            setTitles((prev) => [...prev, ...data.results]);
            setTotal(data.count);
            setHasMore(Boolean(data.next));
            setPage((prev) => prev + 1);
        } catch (err: unknown) {
            handleAxiosError(err, setError, "Error cargando más títulos");
        } finally {
            setLoading(false);
        }
    }, [
        ready,
        hasMore,
        loading,
        page,
        order,
        debouncedSearch,
        filterCategories,
        filterStatus,
        filterType,
        total,
    ]);

    const loadMoreTitlesRef = useRef(loadMoreTitles);
    useEffect(() => {
        loadMoreTitlesRef.current = loadMoreTitles;
    }, [loadMoreTitles]);

    // ------------------------------- IntersectionObserver
    useEffect(() => {
        const node = loaderInfiniteScrollRef.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]: IntersectionObserverEntry[]) => {
                if (entry.isIntersecting) {
                    loadMoreTitlesRef.current();
                }
            },
            {threshold: 1}
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    return (
        <div className="max-w-250 mx-auto py-5">
            <TitlesToolbar
                order={order}
                setOrder={handleChangeOrder}
                total={total}
                setDebouncedSearch={handleChangeSearch}
                loaderMainRef={loaderMainRef}
                setLoading={setLoading}
                loading={loading} />
            <TitlesFilters
                openFilter={openFilter}
                setOpenFilter={setOpenFilter}
                categories={categories}
                status={status}
                setFilterCategories={handleChangeCategories}
                filterStatus={filterStatus}
                setFilterStatus={handleChangeStatus}
                setFilterType={handleChangeType} />
            <TitlesList titles={titles}
                total={total}
                hasMore={hasMore}
                error={error}
                loaderInfiniteScrollRef={loaderInfiniteScrollRef}
                loading={loading}
                typeList={'base'} />
        </div>
    );
}

export default TitlesPage;
