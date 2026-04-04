import BabySection from "@/components/BabySection";
import FloatingBackground from "@/components/FloatingBackground";
import Footer from "@/components/Footer";
import GallerySection from "@/components/GallerySection";
import GameSection from "@/components/GameSection";
import Hero from "@/components/Hero";
import LetterSection from "@/components/LetterSection";
import StorySection from "@/components/StorySection";
import TopNav from "@/components/TopNav";
import {
  babyItems,
  birthdayAlbums,
  gameMemories,
  letterParagraphs,
  letterSignature,
  pregnancyMonthSizes,
  pregnancyWeekTracker,
  storyChapters,
} from "@/data/content";

export default function Home() {
  return (
    <div className="relative">
      <div
        className="pointer-events-none fixed inset-0 z-0 opacity-60 mix-blend-soft-light bg-soft-noise"
        aria-hidden="true"
      />
      <FloatingBackground />
      <TopNav />
      <Hero />
      <main className="relative z-10 mx-auto max-w-7xl px-4 pb-24 sm:px-6 lg:px-8">
        <StorySection chapters={storyChapters} />
        <BabySection
          items={babyItems}
          tracker={pregnancyWeekTracker}
          monthSizes={pregnancyMonthSizes}
        />
        <GameSection memories={gameMemories} />
        <GallerySection albums={birthdayAlbums} />
        <LetterSection
          paragraphs={letterParagraphs}
          signature={letterSignature}
        />
      </main>
      <Footer />
    </div>
  );
}
