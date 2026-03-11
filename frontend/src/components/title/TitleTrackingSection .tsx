import Select, { type StylesConfig } from "react-select";
import type { StatusOption } from "../../types/StatusOption";

interface Props {
    allTrackingStatus: StatusOption[];
    valueTrackingStatus: StatusOption | null | undefined;
    selectStyle: StylesConfig<{
        value: string;
        label: string;
    }, false>;
    setValueTrackingStatus: React.Dispatch<React.SetStateAction<StatusOption | null | undefined>>;
    showTrackingEpisode: boolean;
    trackingEpisode: number | null;
    setTrackingEpisode: React.Dispatch<React.SetStateAction<number | null>>;
    trackingRating: number | null;
    setTrackingRating: React.Dispatch<React.SetStateAction<number | null>>;
    trackingOpinion: string;
    setTrackingOpinion: React.Dispatch<React.SetStateAction<string>>;
}

function TrackingSection ({
    allTrackingStatus,
    valueTrackingStatus,
    selectStyle,
    setValueTrackingStatus,
    showTrackingEpisode,
    trackingEpisode,
    setTrackingEpisode,
    trackingRating,
    setTrackingRating,
    trackingOpinion,
    setTrackingOpinion
    }: Props) {
    return (
        <section className="flex flex-col">
            <h2 className="font-semibold text-lg bg-gray-100 px-5 py-2">Tracking</h2>

            <div className="flex flex-col p-4 gap-4">
                <div className="flex gap-x-4">

                    {/* ------------------------------------- ESTADO (PENDIENTE / VIENDO / VISTO) */}
                    <div className="flex flex-col gap-1 w-50">
                        <label className="font-semibold">Estado</label>
                        <Select options={allTrackingStatus} value={valueTrackingStatus} isSearchable={false} styles={selectStyle}
                        onChange={(item) => setValueTrackingStatus(item ?? null)} />
                    </div>
                    
                    {/* ------------------------------------- EPISODIO ACTUAL */}
                    { showTrackingEpisode &&
                    <div className="flex flex-col gap-1">
                        <label className="font-semibold">Episodio actual</label>
                        <input type="number" className="input w-20" value={trackingEpisode ? String(trackingEpisode) : ''}
                        onChange={(e) => setTrackingEpisode(e.target.value === '' ? null : Number(e.target.value)) } />
                    </div>
                    }
                </div>

                {/* ------------------------------------- VALORACIÓN (RATING) */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Valoración</label>
                    <div className="flex">
                        <div className="flex w-66 text-orange-300">
                            <div className="flex-1 text-center">0</div>
                            <div className="flex-1 text-center">1</div>
                            <div className="flex-1 text-center">2</div>
                            <div className="flex-1 text-center">3</div>
                            <div className="flex-1 text-center">4</div>
                            <div className="flex-1 text-center">5</div>
                            <div className="flex-1 text-center">6</div>
                            <div className="flex-1 text-center">7</div>
                            <div className="flex-1 text-center">8</div>
                            <div className="flex-1 text-center">9</div>
                            <div className="flex-1 text-center">10</div>
                        </div>
                    </div>
                    <div className="rating w-full">
                        <input type="radio" name="rating-2" className="rating-hidden w-6" value="" checked={trackingRating === null}
                            onChange={() => setTrackingRating(null)} />
                        
                        {[1,2,3,4,5,6,7,8,9,10].map((value) => (
                            <input key={value} type="radio" name="rating-2" className="mask mask-star-2 bg-orange-400" aria-label={`${value} star`} value={value} checked={trackingRating === value}
                                onChange={(e) => setTrackingRating(Number(e.target.value))} />
                        ))}
                    </div>
                </div>

                {/* ------------------------------------- OPINIÓN */}
                <div className="flex flex-col gap-1">
                    <label className="font-semibold">Opinión</label>
                    <textarea className="textarea textarea-bordered w-full min-h-20]" value={trackingOpinion}
                        onChange={(e) => setTrackingOpinion(e.target.value)} />
                </div>
            </div>
        </section>
    );
}

export default TrackingSection ;