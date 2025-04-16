import Hero from "@/components/molecules/Hero";
import Footer from "@/components/ui/landing-page/footer";
import Section2 from "@/components/ui/landing-page/section-2";
import Section3 from "@/components/ui/landing-page/section-3";

export default async function Home() {
  return (
    <main className="space-y-12 sm:space-y-16 md:space-y-24 lg:space-y-32 xl:space-y-52 px-4 sm:px-6 md:px-8 lg:container pb-12 md:pb-20">
      <Hero />
      <Section2 />
      <Section3 />
      <Footer />
    </main>
  );
}
