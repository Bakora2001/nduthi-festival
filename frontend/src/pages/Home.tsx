import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import LiveResults from '../components/LiveResults';
import BrowseCategories from '../components/BrowseCategories';
import OverallLeaderboard from '../components/OverallLeaderboard';
import HowToVote from '../components/HowToVote';
import Sponsors from '../components/Sponsors';
import News from '../components/News';
import Newsletter from '../components/Newsletter';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <>
      <SEO
        title="Nduthi Festival & Awards Kenya | Vote for the Best Riders"
        description="Nduthi Festival & Awards Kenya — Kenya's #1 motorcycle festival. Vote for the best riders, clubs and motorcycles. Celebrating excellence, promoting safety and inspiring riders across Kenya."
        url="https://nduthifestival.co.ke/"
        keywords="Nduthi Festival, Nduthi Festival Kenya, Nduthi Fest, Nduthi Fest Kenya, nduthi awards, motorcycle festival Kenya, boda boda awards Kenya, nduthi vote, best rider Kenya 2025"
      />
      <Hero />
      <StatsBar />
      <LiveResults />

      <section className="py-14 bg-brand-green-light/40">
        <div className="container-nd grid lg:grid-cols-[1.7fr_1fr] gap-8">
          <BrowseCategories />
          <OverallLeaderboard />
        </div>
      </section>

      <HowToVote />
      <Sponsors />
      <News />
      <Newsletter />
    </>
  );
}
