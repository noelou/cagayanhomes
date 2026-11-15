import { Routes, Route } from 'react-router'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Buy from './pages/Buy.jsx'
import Rent from './pages/Rent.jsx'
import PropertyDetails from './pages/PropertyDetails.jsx'
import Contact from './pages/Contact.jsx'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </>
  )
}

export default App
