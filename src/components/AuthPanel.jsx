import { useState } from 'react'

export default function AuthPanel({ baseUrl, onAuthed }) {
  const [mode, setMode] = useState('login')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const url = mode === 'login' ? `${baseUrl}/api/auth/login` : `${baseUrl}/api/auth/register`
      const body = mode === 'login' ? { email, password } : { name, email, password }
      const res = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      if (!res.ok) throw new Error((await res.json()).detail || 'Hiba')
      const data = await res.json()
      onAuthed(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div className="flex gap-2 mb-4">
        <button className={`px-3 py-1.5 rounded ${mode==='login'?'bg-white/20 text-white':'text-white/80'}`} onClick={() => setMode('login')}>Bejelentkezés</button>
        <button className={`px-3 py-1.5 rounded ${mode==='register'?'bg-white/20 text-white':'text-white/80'}`} onClick={() => setMode('register')}>Regisztráció</button>
      </div>

      <form onSubmit={submit} className="space-y-3">
        {mode==='register' && (
          <div>
            <label className="block text-white/80 text-sm mb-1">Név</label>
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white" required />
          </div>
        )}
        <div>
          <label className="block text-white/80 text-sm mb-1">Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white" required />
        </div>
        <div>
          <label className="block text-white/80 text-sm mb-1">Jelszó</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} className="w-full px-3 py-2 rounded bg-slate-900/60 border border-white/10 text-white" required />
        </div>
        {error && <div className="text-red-300 text-sm">{error}</div>}
        <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-500 text-white rounded px-4 py-2 disabled:opacity-50">
          {loading ? 'Folyamatban...' : (mode==='login' ? 'Bejelentkezés' : 'Regisztráció')}
        </button>
      </form>
    </div>
  )
}
