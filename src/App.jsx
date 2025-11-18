import { useEffect, useMemo, useState } from 'react'
import Navbar from './components/Navbar'
import RestaurantCard from './components/RestaurantCard'
import AuthPanel from './components/AuthPanel'

function Section({ title, children }) {
  return (
    <section className="max-w-6xl mx-auto px-4 py-8">
      <h2 className="text-white text-xl font-semibold mb-4">{title}</h2>
      {children}
    </section>
  )
}

function Filters({ filters, setFilters, cities, cuisines }) {
  const update = (key, value) => setFilters(prev => ({ ...prev, [key]: value }))
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-4 grid grid-cols-1 md:grid-cols-5 gap-3">
      <input placeholder="Keresés név/cím" value={filters.q} onChange={e=>update('q', e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white" />
      <select value={filters.city} onChange={e=>update('city', e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white">
        <option value="">Város</option>
        {cities.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.cuisine} onChange={e=>update('cuisine', e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white">
        <option value="">Konyha</option>
        {cuisines.map(c=> <option key={c} value={c}>{c}</option>)}
      </select>
      <select value={filters.min_rating} onChange={e=>update('min_rating', e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white">
        <option value="">Min. értékelés</option>
        {[0,3,3.5,4,4.5].map(r => <option key={r} value={r}>{r}+</option>)}
      </select>
      <select value={filters.price} onChange={e=>update('price', e.target.value)} className="px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white">
        <option value="">Ár</option>
        <option value="1-2">Olcsó</option>
        <option value="2-3">Közepes</option>
        <option value="3-4">Drága</option>
      </select>
    </div>
  )
}

export default function App() {
  const baseUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'
  const [view, setView] = useState('home')
  const [auth, setAuth] = useState(() => {
    const saved = localStorage.getItem('fh_auth')
    return saved ? JSON.parse(saved) : null
  })
  const [filters, setFilters] = useState({ city: '', cuisine: '', min_rating: '', q: '', price: '' })
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(false)

  const favorites = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('fh_favorites') || '[]')
    } catch { return [] }
  }, [view])

  useEffect(() => {
    localStorage.setItem('fh_auth', JSON.stringify(auth))
  }, [auth])

  useEffect(() => { if (view === 'home') fetchRestaurants() }, [filters, view])

  const fetchRestaurants = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.city) params.set('city', filters.city)
      if (filters.cuisine) params.set('cuisine', filters.cuisine)
      if (filters.min_rating) params.set('min_rating', filters.min_rating)
      if (filters.q) params.set('q', filters.q)
      if (filters.price) {
        const [min,max] = filters.price.split('-')
        params.set('price_min', min)
        params.set('price_max', max)
      }
      const res = await fetch(`${baseUrl}/api/restaurants?${params.toString()}`)
      const list = await res.json()
      setData(list)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const cities = useMemo(() => Array.from(new Set(data.map(d=>d.city))).sort(), [data])
  const cuisines = useMemo(() => Array.from(new Set(data.map(d=>d.cuisine))).sort(), [data])

  const toggleFavorite = (id) => {
    const set = new Set(favorites)
    if (set.has(id)) set.delete(id); else set.add(id)
    localStorage.setItem('fh_favorites', JSON.stringify(Array.from(set)))
    setView(v => v) // trigger rerender
  }

  const onLogout = async () => {
    if (!auth) return
    try {
      await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST', headers: { Authorization: `Bearer ${auth.token}` } })
    } catch {}
    localStorage.removeItem('fh_auth')
    setAuth(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <Navbar onNavigate={setView} auth={auth} onLogout={onLogout} />

      {view === 'home' && (
        <>
          <Section title="Keresés & Szűrés">
            <Filters filters={filters} setFilters={setFilters} cities={[...new Set(['Budapest','Miskolc','Debrecen','Szeged', ...cities])]}
                     cuisines={[...new Set(['Hungarian','Italian','Asian', ...cuisines])]} />
          </Section>

          <Section title="Eredmények">
            {loading ? (
              <div className="text-white/80">Betöltés...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.map(r => (
                  <RestaurantCard key={r.id} r={r} onToggleFavorite={toggleFavorite} isFavorite={favorites.includes(r.id)} />
                ))}
              </div>
            )}
          </Section>
        </>
      )}

      {view === 'favorites' && (
        <Section title="Kedvencek">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {data.filter(r => favorites.includes(r.id)).map(r => (
              <RestaurantCard key={r.id} r={r} onToggleFavorite={toggleFavorite} isFavorite={true} />
            ))}
          </div>
          <p className="text-white/70 mt-4 text-sm">A kedvencek böngészése a helyben tárolt listára épül (localStorage).</p>
        </Section>
      )}

      {view === 'auth' && (
        <Section title="Fiók">
          {auth ? (
            <div className="text-white/90">Bejelentkezve, szia {auth?.user?.name}!</div>
          ) : (
            <AuthPanel baseUrl={baseUrl} onAuthed={(a) => { setAuth(a); setView('home') }} />
          )}
        </Section>
      )}

      {view === 'about' && (
        <Section title="Rólunk">
          <p className="text-white/80">A FoodieHungary célja, hogy egyszerűen felfedezhesd a hazai éttermeket. Ez egy bemutatható MVP, alap kereséssel, fiókkezeléssel és kedvenceléssel.</p>
        </Section>
      )}

      {view === 'contact' && (
        <Section title="Kapcsolat">
          <p className="text-white/80">Írj nekünk: hello@foodiehungary.example</p>
        </Section>
      )}

      {view === 'terms' && (
        <Section title="ÁSZF + Adatvédelem">
          <p className="text-white/80">Ez egy statikus, bemutató célú szöveg az ÁSZF és Adatvédelmi irányelvekhez.</p>
        </Section>
      )}
    </div>
  )
}
