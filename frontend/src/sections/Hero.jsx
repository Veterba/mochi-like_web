import { heroCards } from "../assets/data.js"

function Hero() {
  return (
    <section className="flex flex-col justify-around h-screen  items-center bg-background px-6 py-20 text-center text-text">
      <div className="flex flex-col items-center px-6 py-20 text-center text-text">
        <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">
          Fast way to learn lang
        </h1>
        <p className="mt-4 max-w-xl text-base text-gray sm:text-lg">
          Try something new, learn a new language.
        </p>  
      </div>

      <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {heroCards.map((text) => (
          <p key={text} className="border border-borders p-6 text-left text-sm text-gray">
            {text}
          </p>
        ))}
      </div>
    </section>
  )
}

export default Hero
