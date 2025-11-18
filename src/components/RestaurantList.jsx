import React from 'react'

function Rating({ value }){
  const rounded = Math.round((value || 0) * 2) / 2
  return (
    <div className="text-yellow-400">
      {Array.from({length:5}).map((_,i)=>{
        const starVal = i+1
        return <span key={i}>{rounded >= starVal ? '★' : rounded >= starVal-0.5 ? '☆' : '☆'}</span>
      })}
      <span className="ml-2 text-xs text-blue-200/70">{(value||0).toFixed(1)}</span>
    </div>
  )
}

export default function RestaurantList({ items, onSelect }) {
  if (!items?.length) {
    return <p className="text-blue-200/80">Nincs találat. Próbálj más szűrőket.</p>
  }
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((r)=> (
        <li key={r.id || r._id} className="rounded-xl bg-slate-800/60 border border-blue-500/20 overflow-hidden">
          <div className="p-4">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-white">{r.name}</h3>
              <span className="rounded bg-slate-700/70 px-2 py-0.5 text-xs text-blue-200/80">{Array(r.price_level||1).fill('₮').join('')}</span>
            </div>
            <p className="mt-1 text-sm text-blue-200/80">{r.city} • {r.cuisine}</p>
            <p className="mt-1 text-sm text-blue-200/60">{r.address}</p>
            <div className="mt-2"><Rating value={r.rating}/></div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={()=>onSelect?.(r)} className="rounded-lg bg-blue-500 px-3 py-1.5 text-sm text-white">Részletek</button>
              <button onClick={()=>{
                const favs = JSON.parse(localStorage.getItem('fh_favs')||'[]')
                const exists = favs.find(x=>x.id===r.id)
                const updated = exists ? favs.filter(x=>x.id!==r.id) : [...favs, r]
                localStorage.setItem('fh_favs', JSON.stringify(updated))
                alert(exists ? 'Eltávolítva a kedvencekből' : 'Hozzáadva a kedvencekhez')
              }} className="rounded-lg bg-slate-700 px-3 py-1.5 text-sm text-blue-100">☆ Kedvenc</button>
            </div>
          </div>
        </li>
      ))}
    </ul>
  )
}
