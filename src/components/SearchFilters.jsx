import React, { useEffect, useMemo, useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL

export default function SearchFilters({ onResults }) {
  const [city, setCity] = useState('')
  const [cuisine, setCuisine] = useState('')
  const [minRating, setMinRating] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSearch = useMemo(() => {
    return city || cuisine || minRating || maxPrice || q
  }, [city, cuisine, minRating, maxPrice, q])

  useEffect(() => {
    // Initial search to show something
    handleSearch(new Event('submit'))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function handleSearch(e) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${BACKEND}/restaurants/search`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ city, cuisine, min_rating: minRating ? Number(minRating) : undefined, max_price: maxPrice ? Number(maxPrice) : undefined, q })
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Hiba történt')
      onResults(data.items || [])
    } catch (err) {
      setError(err.message)
      onResults([])
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSearch} className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-4 sm:p-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
        <input value={city} onChange={e=>setCity(e.target.value)} placeholder="Város" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-blue-200/50 outline-none focus:ring-2 focus:ring-blue-500/50" />
        <input value={cuisine} onChange={e=>setCuisine(e.target.value)} placeholder="Konyhatípus" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-blue-200/50 outline-none focus:ring-2 focus:ring-blue-500/50" />
        <input value={minRating} onChange={e=>setMinRating(e.target.value)} placeholder="Min. értékelés" type="number" min="0" max="5" step="0.1" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-blue-200/50 outline-none focus:ring-2 focus:ring-blue-500/50" />
        <input value={maxPrice} onChange={e=>setMaxPrice(e.target.value)} placeholder="Max árkategória (1-4)" type="number" min="1" max="4" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-blue-200/50 outline-none focus:ring-2 focus:ring-blue-500/50" />
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Kulcsszó" className="w-full rounded-lg bg-slate-900/60 px-3 py-2 text-white placeholder:text-blue-200/50 outline-none focus:ring-2 focus:ring-blue-500/50" />
      </div>
      <div className="mt-4 flex items-center gap-3">
        <button type="submit" disabled={loading || !canSearch} className="rounded-lg bg-blue-500 px-4 py-2 font-medium text-white disabled:cursor-not-allowed disabled:opacity-50">
          {loading ? 'Keresés...' : 'Keresés'}
        </button>
        {error && <span className="text-sm text-red-400">{error}</span>}
      </div>
    </form>
  )
}
