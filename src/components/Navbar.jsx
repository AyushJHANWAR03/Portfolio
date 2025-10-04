import { useState } from 'react'
import './Navbar.css'

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      setIsOpen(false)
    }
  }

  return (
    <nav className="navbar">
      <div className="nav-container">
        <button onClick={() => scrollToSection('home')} className="nav-home-btn">
          Home
        </button>

        <div className="nav-right">
          <button onClick={() => scrollToSection('about')} className="nav-link-btn">
            About
          </button>
          <button onClick={() => scrollToSection('projects')} className="nav-link-btn">
            Projects
          </button>
          <button onClick={() => scrollToSection('contact')} className="nav-link-btn">
            Contact
          </button>
        </div>

        <button
          className={`mobile-menu-toggle ${isOpen ? 'active' : ''}`}
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

        <ul className={`nav-links-mobile ${isOpen ? 'active' : ''}`}>
          <li><button onClick={() => scrollToSection('about')}>About</button></li>
          <li><button onClick={() => scrollToSection('projects')}>Projects</button></li>
          <li><button onClick={() => scrollToSection('contact')}>Contact</button></li>
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
