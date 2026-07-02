import { heroCards } from "../assets/data.js"

function Hero() {
  return (
    <section className="flex flex-col justify-around h-screen  items-center bg-background px-6 py-20 text-center text-text">
      <div className="flex flex-col items-center px-6 py-20 text-center text-text">
        <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">
          Fast way to learn new language
        </h1>
        <p className="mt-4 max-w-xl text-base text-gray sm:text-lg">
          Pop Up is a language-learning tool that employs modern methods and techniques—the very same ones the app's creator 
          used to learn two languages in seven months and continues to use actively today.
        </p>  
        <p className="mt-8 max-w-xl text-base text-second-gray sm:text-lg">
          The web application is still under development. You can help the project by donations which are actively accepted.
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
