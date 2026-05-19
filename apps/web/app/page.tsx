import Hero from '../components/Hero';
import About from '../components/About';
import Stack from '../components/Stack';
import HowIWork from '../components/HowIWork';
import Cases from '../components/Cases';
import Contact from '../components/Contact';
import Footer from '../components/Footer';
import ChatWidget from '../components/ChatWidget';
import Nav from '../components/Nav';

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <About />
        <Stack />
        <HowIWork />
        <Cases />
        <Contact />
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
