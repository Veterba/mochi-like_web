import { useTranslation } from "react-i18next"

function Hero() {
  const { t } = useTranslation()
  const cards = t("home.hero.cards", { returnObjects: true })

  return (
    <section className="flex flex-col justify-around min-h-screen items-center bg-background px-4 py-10 md:px-6 md:py-20 text-center text-text">
      <div className="flex flex-col items-center px-4 py-10 md:px-6 md:py-20 text-center text-text">
        <h1 className="text-5xl font-black uppercase leading-none tracking-tight sm:text-6xl">
          {t("home.hero.title")}
        </h1>
        <p className="mt-4 max-w-xl text-base text-gray sm:text-lg">
          {t("home.hero.p1")}
        </p>
        <p className="mt-8 max-w-xl text-base text-second-gray sm:text-lg">
          {t("home.hero.p2")}
        </p>
      </div>


      <div className="mt-10 grid w-full max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
        {cards.map((text) => (
          <p key={text} className="border border-borders p-6 text-left text-sm text-gray">
            {text}
          </p>
        ))}
      </div>
    </section>
  )
}

export default Hero
