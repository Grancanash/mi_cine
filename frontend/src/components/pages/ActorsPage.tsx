import { useCallback, useEffect, useRef, useState } from "react";
import { fetchActorsApi, handleAxiosError } from "../../api/client";
import type { Actor as ActorType } from "../../types/Actor";
import ActorsToolbar from "../actors/ActorsToolbar";
import ActorsList from "../actors/ActorsList";

function ActorsPage() {
    const [actors, setActors] = useState<ActorType[]>([]);
    const [page, setPage] = useState(1);
    const [order, setOrder] = useState("name");
    const [total, setTotal] = useState(0);
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loaderMainRef = useRef<HTMLDivElement | null>(null);
    const loaderInfiniteScrollRef = useRef<HTMLLIElement | null>(null);

    const [ready, setReady] = useState(false);
    const [queryVersion, setQueryVersion] = useState(0);

    const hasRunInitial = useRef(false);

    // -------------------------------------------------------------------
    // 1) CARGA INICIAL: catálogos + primer fetch de títulos (con querystring)
    // -------------------------------------------------------------------
    useEffect(() => {
        if (hasRunInitial.current) return;

        (async () => {
            try {
                setLoading(true);
                setError("");

                // primer fetch de títulos
                const data = await fetchActorsApi({
                    page: 1,
                    order,
                    search: debouncedSearch,
                });

                setActors(data.results as ActorType[]);
                setTotal(data.count);
                setHasMore(Boolean(data.next));
                setPage(1);

                setReady(true); // a partir de aquí permitimos refetch
            } catch (err: unknown) {
                handleAxiosError(err, setError, "Error en la carga inicial")
            } finally {
                setLoading(false);
                hasRunInitial.current = true;
            }
        })();
    }, [order, debouncedSearch]);

    // -------------------------------------------------------------------
    // 2) REFETCH de página 1 cuando el usuario cambia orden/búsqueda/filtros
    // -------------------------------------------------------------------
    const refetchTitles  = useCallback(async () => {
        if (!ready) return;

        try {
            setHasMore(true);
            setError("");
            const data = await fetchActorsApi({
                page: 1,
                order,
                search: debouncedSearch,
            });

            setActors(data.results as ActorType[]);
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
            const data = await fetchActorsApi({
                page: page + 1,
                order,
                search: debouncedSearch,
            });

            setActors((prev) => [...prev, ...data.results as ActorType[]]);
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
        <div className="max-w-250 mx-auto md:py-5">
            <ActorsToolbar
                order={order}
                setOrder={handleChangeOrder}
                total={total}
                setDebouncedSearch={handleChangeSearch}
                loaderMainRef={loaderMainRef}
                setLoading={setLoading}
                loading={loading} />
            <ActorsList actors={actors}
                total={total}
                hasMore={hasMore}
                error={error}
                loaderInfiniteScrollRef={loaderInfiniteScrollRef}
                loading={loading} />
        </div>
    );
}

export default ActorsPage;