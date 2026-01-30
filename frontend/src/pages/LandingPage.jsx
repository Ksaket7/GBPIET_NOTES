import Hero from "../components/landing/Hero";
import Stats from "../components/landing/Stats";
import Features from "../components/landing/Features";
import HowItWorks from "../components/landing/HowItWorks";
import NotesPreview from "../components/landing/NotesPreview";
import QnaPreview from "../components/landing/QnaPreview";
import WhyGBPIETNotes from "../components/landing/WhyGBPIETNotes";
import CTA from "../components/landing/CTA";

export default function LandingPage() {
  return (
    <div className="overflow-x-hidden">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <NotesPreview />
      <QnaPreview />
      <WhyGBPIETNotes />
      <CTA />
    </div>
  );
}
