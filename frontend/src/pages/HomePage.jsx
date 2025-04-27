import Navbar from "../components/Navbar";
import AboutSection from "../components/AboutSection";
import ServicesSection from "../components/ServicesSection";
import ContactSection from "../components/ContactSection";

const HomePage = () => {
  return (
    <>
      <Navbar />
      <main>
        <section id="about">
          <AboutSection />
        </section>
        <section id="services">
          <ServicesSection />
        </section>
        <section id="contact">
          <ContactSection />
        </section>
      </main>
    </>
  );
};

export default HomePage;
