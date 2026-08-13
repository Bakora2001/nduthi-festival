import Hero from '../components/Hero';
import StatsBar from '../components/StatsBar';
import LiveResults from '../components/LiveResults';
import BrowseCategories from '../components/BrowseCategories';
import OverallLeaderboard from '../components/OverallLeaderboard';
import HowToVote from '../components/HowToVote';
import Sponsors from '../components/Sponsors';
import News from '../components/News';
import Newsletter from '../components/Newsletter';

export default function Home() {
  return (
    <>
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
