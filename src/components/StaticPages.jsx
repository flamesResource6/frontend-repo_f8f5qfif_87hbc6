import React, { useEffect, useState } from 'react'

export function StaticPages() {
  const tabs = [
    { key: 'home', label: 'Főoldal' },
    { key: 'about', label: 'Rólunk' },
    { key: 'contact', label: 'Kapcsolat' },
    { key: 'legal', label: 'ÁSZF + Adatvédelem' },
    { key: 'favs', label: 'Kedvencek' },
  ]
  const [active, setActive] = useState('home')
  const [favs, setFavs] = useState([])

  useEffect(()=>{
    if (active==='favs'){
      try{ setFavs(JSON.parse(localStorage.getItem('fh_favs')||'[]')) }catch{ setFavs([]) }
    }
  },[active])

  return (
    <section className="mt-12">
      <div className="flex flex-wrap gap-2">
        {tabs.map(t=> (
          <button key={t.key} onClick={()=>setActive(t.key)} className={`rounded-lg px-3 py-1.5 text-sm ${active===t.key? 'bg-blue-500 text-white':'bg-slate-700/70 text-blue-100'}`}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="mt-6 rounded-xl border border-blue-500/20 bg-slate-800/60 p-5 text-blue-100">
        {active==='home' && <p>Üdv a FoodieHungary MVP-ben! Kezdd a kereséssel, vagy nézd meg a kedvenceidet.</p>}
        {active==='about' && <p>FoodieHungary egy egyszerű étteremkereső prototípus, magyar fókuszszal.</p>}
        {active==='contact' && <p>Elérhetőség: hello@foodiehungary.example • +36 1 234 5678</p>}
        {active==='legal' && <div>
          <p className="font-semibold">Általános Szerződési Feltételek</p>
          <p className="mt-2 text-sm opacity-80">Ez egy MVP. A tartalom tájékoztató jellegű.</p>
          <p className="mt-4 font-semibold">Adatvédelem</p>
          <p className="mt-2 text-sm opacity-80">Nem gyűjtünk személyes adatokat tesztelésen túl. Kedvencek a böngészőben tárolódnak.</p>
        </div>}
        {active==='favs' && (
          favs.length ? (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {favs.map((f,i)=>(
                <li key={i} className="rounded-lg bg-slate-900/50 p-3">
                  <p className="font-medium text-white">{f.name}</p>
                  <p className="text-sm text-blue-200/80">{f.city} • {f.cuisine} • {Array(f.price_level||1).fill('₮').join('')}</p>
                </li>
              ))}
            </ul>
          ) : <p>Nincs kedvenc elmentve.</p>
        )}
      </div>
    </section>
  )
}
