import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import type { TitlesResponse } from "../../types/TitlesResponse";
import api from "../../api/client";
import type { Title as TitleType } from "../../types/Title";
import TitlesList from "../titles/TitlesList";

function Dashboard() {
    const firstLoadRef = useRef(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [titlesRecent, setTitlesRecent] = useState<TitleType[]>([]);
    const [titlesWatching, setTitlesWatching] = useState<TitleType[]>([]);
    const [titlesPending, setTitlesPending] = useState<TitleType[]>([]);
    const [hasMore, _setHasMore] = useState(false);
    const loaderInfiniteScrollRef = useRef<HTMLLIElement | null>(null);

    async function fetchTitlesApi(params: {
            page: number;
            order: string;
            search: string;
            filterCategories: string;
            filterStatus: string;
        }) {
        const { page, order, search, filterCategories, filterStatus } = params;
        const { data } = await api.get<TitlesResponse>(`/titles?page=${page}&ordering=${order}&search=${search}&${filterCategories}&${filterStatus}`);
        return data;
    }

    // Carga inicial (títulos + categorías) solo primer render
    useEffect(() => {
        if (!firstLoadRef.current) return;
        firstLoadRef.current = false;

        (async () => {
            try {
                setLoading(true);
                setError("");

                const [titlesDataRecents, titlesDataWatching, titlesDataPending] = await Promise.all([
                    fetchTitlesApi({
                        page: 1,
                        order: '-created_at',
                        search: "",
                        filterCategories: "",
                        filterStatus: '',
                    }),
                    fetchTitlesApi({
                        page: 1,
                        order: '-created_at',
                        search: "",
                        filterCategories: "",
                        filterStatus: 'status=watching',
                    }),
                    fetchTitlesApi({
                        page: 1,
                        order: '-created_at',
                        search: "",
                        filterCategories: "",
                        filterStatus: 'status=pending',
                    }),
                ]);

                setTitlesRecent(titlesDataRecents.results.slice(0, 10));
                setTitlesWatching(titlesDataWatching.results.slice(0, 10));
                setTitlesPending(titlesDataPending.results.slice(0, 10));
            } catch (err: any) {
                setError(
                    err?.response?.data?.message || "Error en la carga inicial"
                );
            } finally {
                setLoading(false);
            }
        })();
    }, []);
    
    return (
        <div className="max-w-250 mx-auto">
            <div className="container mx-auto py-5">
                <h1 className="text-3xl font-bold mb-6 text-center md:text-left">
                    Bienvenido a Mi Cine !!!!!
                </h1>
                <div className="grid gap-6 md:grid-cols-2">

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Últimos añadidos</h2>
                            <TitlesList titles={titlesRecent} total={10} hasMore={hasMore} error={error} loaderInfiniteScrollRef={loaderInfiniteScrollRef} loading={loading} typeList="sm" />
                            <Link to='/titles' className="btn btn-sm btn-primary mt-2">Ver todos</Link>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">En progreso</h2>
                            <TitlesList titles={titlesWatching} total={10} hasMore={hasMore} error={error} loaderInfiniteScrollRef={loaderInfiniteScrollRef} loading={loading} typeList="sm" />
                            <Link to='/titles?status=watching' className="btn btn-sm btn-primary mt-2">Ver todos</Link>
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl">
                        <div className="card-body">
                            <h2 className="card-title">Por ver</h2>
                            <TitlesList titles={titlesPending} total={10} hasMore={hasMore} error={error} loaderInfiniteScrollRef={loaderInfiniteScrollRef} loading={loading} typeList="sm" />
                            <Link to='/titles?status=pending' className="btn btn-sm btn-primary mt-2">Ver todos</Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;