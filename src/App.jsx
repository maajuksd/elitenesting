import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Helmet } from "react-helmet-async";
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Services from './components/Services'
import About from './components/About'
import Process from './components/Process'
import Contact from './components/Contact'
import Footer from './components/Footer'
import Gallery from './pages/Gallery'
import Estimate from './pages/Estimate'
import Cvmaker from './pages/Cvmaker'
import SairaChat from "./components/SairaChat";


function Home() {
  return (
    <>
      <Helmet>
        <title>Elite Nesting | Interior Design Company in Kerala</title>

        <meta
          name="description"
          content="Elite Nesting provides premium interior design, turnkey home interiors, architectural design, contracting, building permits and site supervision across Kerala."
        />

        <meta
          name="keywords"
          content="Interior Designer Kerala, Home Interiors Kerala, Modular Kitchen Kerala, Building Permit Kerala, Contracting, Architecture, Elite Nesting"
        />

        <meta name="robots" content="index,follow" />

        <link rel="canonical" href="https://www.elitenesting.com/" />

        <meta property="og:type" content="website" />
        <meta
          property="og:title"
          content="Elite Nesting | Interior Design Company in Kerala"
        />
        <meta
          property="og:description"
          content="Premium Interior Design & Contracting Services in Kerala."
        />
        <meta
          property="og:url"
          content="https://www.elitenesting.com/"
        />
      </Helmet>

      <Navbar />
      <main>
        <Hero />
        <Services />
        <About />
        <Process />
        <Contact />
      </main>
      <Footer />
      <SairaChat />
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/estimate" element={<Estimate />} />
        <Route path="/cvmaker" element={<Cvmaker />} />
      </Routes>
    </BrowserRouter>
  )
}