export default function RestaurantCard({ r, onToggleFavorite, isFavorite }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 flex gap-4">
      <div className="w-24 h-24 rounded-lg bg-gradient-to-br from-slate-600 to-slate-700 flex items-center justify-center text-white/70 text-xs">
        {r.cuisine}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-white font-semibold text-lg">{r.name}</h3>
            <p className="text-white/70 text-sm">{r.city} • {r.address}</p>
            <p className="text-white/70 text-sm">Ár: {'$'.repeat(r.price_level || 1)} • Értékelés: {r.rating?.toFixed ? r.rating.toFixed(1) : r.rating}</p>
          </div>
          <button
            onClick={() => onToggleFavorite(r.id)}
            className={`px-3 py-1.5 rounded text-sm border ${isFavorite ? 'bg-pink-600/20 text-pink-200 border-pink-500/30' : 'bg-white/10 text-white/90 border-white/10'}`}
          >
            {isFavorite ? 'Eltávolítás' : 'Kedvencekhez'}
          </button>
        </div>
        {r.lat && r.lng && (
          <div className="mt-3 text-xs text-white/60">Térkép: ({r.lat.toFixed(3)}, {r.lng.toFixed(3)}) — statikus demo</div>
        )}
        {r.website && (
          <a href={r.website} target="_blank" className="mt-2 inline-block text-blue-300 hover:text-blue-200 text-sm">Weboldal</a>
        )}
      </div>
    </div>
  )
}
