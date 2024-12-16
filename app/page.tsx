import Hero from "@/components/molecules/Hero";
import Navbar from "@/components/organisms/Navbar";
import Footer from "@/components/ui/landing-page/footer";
import Section2 from "@/components/ui/landing-page/section-2";
import Section3 from "@/components/ui/landing-page/section-3";

export default function Home() {
  return (
    <main className="space-y-20 md:space-y-52 md:pb-20">
      <header>
        <Hero />
      </header>
      <Section2 />
      <Section3 />
      <Footer />
    </main>
  );
}
