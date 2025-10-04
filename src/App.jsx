import { useState, useEffect } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Projects from './components/Projects'
import Contact from './components/Contact'
import Footer from './components/Footer'
import AyushAI from './components/AyushAI'
import ConversationLogs from './components/ConversationLogs'

function App() {
  const [showAdmin, setShowAdmin] = useState(false)

  // Check URL for admin access
  useEffect(() => {
    if (window.location.pathname === '/admin' || window.location.hash === '#admin') {
      setShowAdmin(true)
    }
  }, [])

  if (showAdmin) {
    return <ConversationLogs />
  }

  return (
    <div className="App">
      <Navbar />
      <Hero />
      <About />
      <Projects />
      <Contact />
      <Footer />
      <AyushAI />
    </div>
  )
}

export default App
