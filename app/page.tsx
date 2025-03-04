import Hero from "@/components/molecules/Hero";
import Footer from "@/components/ui/landing-page/footer";
import Section2 from "@/components/ui/landing-page/section-2";
import Section3 from "@/components/ui/landing-page/section-3";

export default async function Home() {
  // const res = await fetch(`http://localhost:3000/api/wallets`);
  // const data = await res.json();

  return (
    <main className="space-y-20 md:space-y-52 md:pb-20 container">
      <Hero />
      <Section2 />
      <Section3 />
      <Footer />
    </main>
  );
}
