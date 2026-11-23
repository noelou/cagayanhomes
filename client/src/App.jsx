import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import Home from './pages/Home.jsx'
import About from './pages/About.jsx'
import Buy from './pages/Buy.jsx'
import Rent from './pages/Rent.jsx'
import PropertyDetails from './pages/PropertyDetails.jsx'
import Contact from './pages/Contact.jsx'
import AdminLogin from './pages/AdminLogin.jsx'
import AdminLayout from './pages/AdminLayout.jsx'
import AdminListings from './pages/AdminListings.jsx'
import AdminMessages from './pages/AdminMessages.jsx'
import AdminContent from './pages/AdminContent.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'

function App() {
  const { pathname } = useLocation()
  const isAdmin = pathname.startsWith('/admin')

  // Every time the user goes to a different page, start at the top.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {!isAdmin && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/buy" element={<Buy />} />
        <Route path="/rent" element={<Rent />} />
        <Route path="/property/:id" element={<PropertyDetails />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
          <Route index element={<Navigate to="listings" replace />} />
          <Route path="listings" element={<AdminListings />} />
          <Route path="messages" element={<AdminMessages />} />
          <Route path="content" element={<AdminContent />} />
        </Route>
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}

export default App
