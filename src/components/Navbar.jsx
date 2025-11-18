import { useEffect, useState } from 'react'
import { Heart, User, LogOut, Menu } from 'lucide-react'

export default function Navbar({ onNavigate, auth, onLogout }) {
  const [open, setOpen] = useState(false)
  const [isAuthed, setIsAuthed] = useState(false)

  useEffect(() => {
    setIsAuthed(Boolean(auth?.token))
  }, [auth])

  const NavButton = ({ id, label }) => (
    <button
      onClick={() => { onNavigate(id); setOpen(false) }}
      className="px-3 py-2 rounded hover:bg-white/10 text-white/90"
    >
      {label}
    </button>
  )

  return (
    <header className="sticky top-0 z-40 backdrop-blur bg-slate-900/70 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button className="md:hidden text-white" onClick={() => setOpen(!open)}>
            <Menu size={22} />
          </button>
          <div className="text-white font-bold tracking-tight">FoodieHungary</div>
          <nav className="hidden md:flex items-center gap-1 ml-4">
            <NavButton id="home" label="Főoldal" />
            <NavButton id="about" label="Rólunk" />
            <NavButton id="contact" label="Kapcsolat" />
            <NavButton id="terms" label="ÁSZF + Adatvédelem" />
          </nav>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => onNavigate('favorites')} className="text-pink-300 hover:text-pink-200 inline-flex items-center gap-2 px-3 py-1.5 rounded bg-pink-500/10 border border-pink-400/20">
            <Heart size={18} />
            <span>Kedvencek</span>
          </button>
          {isAuthed ? (
            <>
              <div className="text-white/80 hidden sm:block">{auth?.user?.name}</div>
              <button onClick={onLogout} className="text-white/90 hover:text-white inline-flex items-center gap-2 px-3 py-1.5 rounded bg-white/10 border border-white/10">
                <LogOut size={18} />
                <span>Kijelentkezés</span>
              </button>
            </>
          ) : (
            <button onClick={() => onNavigate('auth')} className="text-white inline-flex items-center gap-2 px-3 py-1.5 rounded bg-blue-500/20 border border-blue-400/30">
              <User size={18} />
              <span>Bejelentkezés</span>
            </button>
          )}
        </div>
      </div>
      {open && (
        <div className="md:hidden px-4 pb-3 flex flex-col gap-1">
          <NavButton id="home" label="Főoldal" />
          <NavButton id="about" label="Rólunk" />
          <NavButton id="contact" label="Kapcsolat" />
          <NavButton id="terms" label="ÁSZF + Adatvédelem" />
        </div>
      )}
    </header>
  )
}
