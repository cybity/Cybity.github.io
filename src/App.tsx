import { AttackSection } from './components/AttackSection'
import { Contact } from './components/Contact'
import { Footer } from './components/Footer'
import { Hero } from './components/Hero'
import { Marquee } from './components/Marquee'
import { Method } from './components/Method'
import { Nav } from './components/Nav'
import { Notes } from './components/Notes'
import { ScrollProgress } from './components/ScrollProgress'
import { Services } from './components/Services'
import { Stats } from './components/Stats'
import { Team } from './components/Team'
import { useRevealOnScroll } from './lib/hooks'

function App() {
  useRevealOnScroll()

  return (
    <>
      <div className="noise" aria-hidden="true" />
      <ScrollProgress />
      <Nav />
      <main>
        <Hero />
        <Stats />
        <Marquee />
        <Services />
        <AttackSection />
        <Method />
        <Team />
        <Notes />
        <Contact />
      </main>
      <Footer />
    </>
  )
}

export default App
