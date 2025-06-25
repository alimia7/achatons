
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import AvantagesSection from "@/components/AvantagesSection";
import CommentCaMarcheSection from "@/components/CommentCaMarcheSection";
import ImpactSection from "@/components/ImpactSection";
import StorySection from "@/components/StorySection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <HeroSection />
      <AvantagesSection />
      <CommentCaMarcheSection />
      <ImpactSection />
      <StorySection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
