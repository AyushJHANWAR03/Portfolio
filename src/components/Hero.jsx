import './Hero.css'

const Hero = () => {
  const scrollToProjects = () => {
    document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
  }

  const scrollToContact = () => {
    document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section id="home" className="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-profile">
            <img src="/profile.jpeg" alt="Ayush Jhanwar" className="profile-image" />
          </div>
          <h1 className="hero-title">
            Hi, I'm <span className="gradient-text">Ayush</span>
          </h1>
          <p className="hero-subtitle">Full Stack Developer & AI Enthusiast</p>
          <p className="hero-description">
            Building innovative web applications with modern technologies and AI integration
          </p>
          <div className="hero-cta">
            <button onClick={scrollToProjects} className="btn btn-primary">
              View My Work
            </button>
            <button onClick={scrollToContact} className="btn btn-secondary">
              Get In Touch
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
