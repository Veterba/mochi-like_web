import Navbar from "../sections/Navbar.jsx"
import ProfileHeader from "../components/profile/ProfileHeader.jsx"
import ActivityHeatmap from "../components/profile/ActivityHeatmap.jsx"
import LearningList from "../components/profile/LearningList.jsx"
import useActivity from "../hooks/useActivity.js"
import useLearning from "../hooks/useLearning.js"

function Profile() {
  const { days } = useActivity()
  const { statuses } = useLearning()

  return (
    <div className="min-h-screen bg-third-background">
      <Navbar sticky />
      <section className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-[260px_1fr]">
          <ProfileHeader />
          <div className="flex flex-col gap-8">
            <ActivityHeatmap days={days} />
            <LearningList statuses={statuses} />
          </div>
        </div>
      </section>
    </div>
  )
}

export default Profile
