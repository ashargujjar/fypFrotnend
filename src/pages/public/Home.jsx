import Navbar from "../../components/layout/Navbar";
import Hero from "../../components/home/Hero";
import TrackWidget from "../../components/home/TrackWidget";
import Features from "../../components/home/Features";
import Testimonials from "../../components/home/Testimonials";
import FAQ from "../../components/home/FAQ";
import Contact from "../../components/home/Contact";
import Footer from "../../components/layout/Footer";
import ChatBotButton from "../../components/home/ChatBotButton";

export default function Home() {
  return (
    <>
      <Navbar />
      <div id="home"></div>
      <Hero />
      <div id="track">
        <TrackWidget />
      </div>
      <div id="features" className="pt-12"></div>

      <Features />
      <Testimonials />
      <FAQ />
      <div id="contact" className="pt-12"></div>

      <Contact />
      <Footer />
      <ChatBotButton />
    </>
  );
}
