import { useEffect, useRef, useState } from "react";
// import { Link } from "react-router-dom";
import type { TitlesResponse } from "../../types/TitlesResponse";
import api, { handleAxiosError } from "../../api/client";
// import type { Title as TitleType } from "../../types/Title";
// import TitlesList from "../titles/TitlesList";
import BtnAdd from "../ui/BtnAdd";

function Dashboard() {
    const firstLoadRef = useRef(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // const [titlesRecent, setTitlessetLoadingRecent] = useState<TitleType[]>([]);
    // const [titlesWatching, setTitlesWatching] = useState<TitleType[]>([]);
    // const [titlesPending, setTitlesPending] = useState<TitleType[]>([]);
    // const [hasMore, _setHasMore] = useState(false);
    // const loaderInfiniteScrollRef = useRef<HTMLLIElement | null>(null);

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

                // const [titlesDataRecents, titlesDataWatching, titlesDataPending] = await Promise.all([
                //     fetchTitlesApi({
                //         page: 1,
                //         order: '-created_at',
                //         search: "",
                //         filterCategories: "",
                //         filterStatus: '',
                //     }),
                //     fetchTitlesApi({
                //         page: 1,
                //         order: '-created_at',
                //         search: "",
                //         filterCategories: "",
                //         filterStatus: 'status=watching',
                //     }),
                //     fetchTitlesApi({
                //         page: 1,
                //         order: '-created_at',
                //         search: "",
                //         filterCategories: "",
                //         filterStatus: 'status=pending',
                //     }),
                // ]);

                // setTitlesRecent(titlesDataRecents.results.slice(0, 10));
                // setTitlesWatching(titlesDataWatching.results.slice(0, 10));
                // setTitlesPending(titlesDataPending.results.slice(0, 10));
            } catch (err: unknown) {
                handleAxiosError(err, setError, "Error en la carga inicial");
            } finally {
                // setLoading(false);
            }
        })();
    }, []);
    
    return (
        <div className="max-w-250 mx-auto">
            <div className="container mx-auto md:py-5">
                <h1 className="text-2xl font-bold md:mb-6 text-center md:text-left p-3">
                    Bienvenido a Mi Cine
                </h1>
                <BtnAdd />
                <div className="grid md:gap-6 md:grid-cols-2 ">

                    <div className="card bg-base-100 shadow-xl rounded-none md:rounded md:border-0 border-b border-gray-300">
                        <div className="card-body">
                            <h2 className="card-title">Últimos añadidos</h2>
                            {/* <TitlesList 
                                titles={titlesRecent}
                                total={15}
                                hasMore={hasMore}
                                error={error}
                                loaderInfiniteScrollRef={loaderInfiniteScrollRef}
                                loading={loading}
                                typeList="sm"
                                enableInfiniteScroll={false} />
                            <Link to='/titles' className="btn btn-sm btn-primary mt-2">Ver todos</Link> */}
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl rounded-none md:rounded">
                        <div className="card-body">
                            <h2 className="card-title">En progreso</h2>
                            {/* <TitlesList 
                                titles={titlesWatching}
                                total={10}
                                hasMore={hasMore}
                                error={error}
                                loaderInfiniteScrollRef={loaderInfiniteScrollRef}
                                loading={loading}
                                typeList="sm"
                                enableInfiniteScroll={false} />
                            <Link to='/titles?status=watching' className="btn btn-sm btn-primary mt-2">Ver todos</Link> */}
                        </div>
                    </div>

                    <div className="card bg-base-100 shadow-xl rounded-none md:rounded">
                        <div className="card-body">
                            <h2 className="card-title">Por ver</h2>
                            {/* <TitlesList 
                                titles={titlesPending}
                                total={10}
                                hasMore={hasMore}
                                error={error}
                                loaderInfiniteScrollRef={loaderInfiniteScrollRef}
                                loading={loading}
                                typeList="sm"
                                enableInfiniteScroll={false} />
                            <Link to='/titles?status=pending' className="btn btn-sm btn-primary mt-2">Ver todos</Link> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;