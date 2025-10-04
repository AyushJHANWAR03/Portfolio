import './About.css'

const About = () => {
  const techStack = [
    'React', 'Node.js', 'TypeScript', 'Python',
    'AI/ML', 'MongoDB', 'PostgreSQL', 'Docker'
  ]

  return (
    <section id="about" className="about">
      <div className="about-container">
        <h2 className="section-title">About Me</h2>
        <div className="about-content">
          <p className="about-text">
            I'm a passionate Full Stack Developer with expertise in building scalable web applications
            and AI-powered solutions. I specialize in creating user-centric products that solve real-world
            problems using cutting-edge technologies.
          </p>
          <div className="tech-stack">
            <h3>Tech Stack</h3>
            <div className="tech-grid">
              {techStack.map((tech, index) => (
                <span key={index} className="tech-badge">{tech}</span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About
