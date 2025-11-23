import dynamic from "next/dynamic";

const MapLeaflet = dynamic(() => import("./map-leaflet"), {
    ssr: false,
    loading: () => (
        <div className="h-64 w-full animate-pulse rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            Loading Map...
        </div>
    ),
});

export default MapLeaflet;
