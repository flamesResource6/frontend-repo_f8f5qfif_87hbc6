import React from 'react'

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
        <div className="grid items-center gap-10 md:grid-cols-2">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">
              FoodieHungary
            </h1>
            <p className="mt-4 text-blue-200/90">
              Böngéssz magyar éttermek között, szűrj város, ár, konyhatípus vagy értékelés alapján, és mentsd el kedvenceidet.
            </p>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1544025162-d76694265947?q=80&w=1600&auto=format&fit=crop" alt="Food" className="rounded-2xl shadow-2xl ring-1 ring-white/10"/>
          </div>
        </div>
      </div>
    </section>
  )
}
