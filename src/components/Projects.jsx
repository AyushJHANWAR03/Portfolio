import { useState } from 'react'
import './Projects.css'

const Projects = () => {
  const [hoveredIndex, setHoveredIndex] = useState(null)

  const projects = [
    {
      title: 'Personal Chatbot',
      description: 'An AI-powered chat application where users can interact with intelligent AI agents. Features multiple conversation modes, natural language processing, and an engaging user experience.',
      tags: ['AI/ML', 'React', 'Node.js', 'NLP'],
      liveLink: 'https://www.personalchatbot.online/',
      color: '#FF6B6B',
      image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&q=80'
    },
    {
      title: 'Hiver Email Manager',
      description: 'An intelligent email management system inspired by Hiver. Automatically processes incoming emails, assigns them to team members, and generates AI-powered draft responses for efficient team collaboration.',
      tags: ['AI', 'Email API', 'React', 'Team Collaboration'],
      liveLink: 'https://hiver-email.netlify.app/',
      color: '#4ECDC4',
      image: 'https://media.licdn.com/dms/image/v2/D560BAQGHqQMT0dV_Jw/company-logo_200_200/B56ZYfuzuWGsAI-/0/1744289086924/hiverhq_logo?e=2147483647&v=beta&t=JupPQnVmIrv_9yHka0QIreyZMUkeADQmY5_Kze3xkOo'
    },
    {
      title: 'RightIntake',
      description: 'An AI-powered calorie tracker and health monitoring application. Helps users track their nutrition, monitor calories, and achieve their fitness goals with intelligent recommendations.',
      tags: ['AI', 'Health Tech', 'React', 'Nutrition'],
      liveLink: 'https://rightintake.com/',
      color: '#FFE66D',
      image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'
    }
  ]

  return (
    <section id="projects" className="projects">
      <div className="projects-container">
        <h2 className="section-title">
          <span className="title-emoji">🚀</span> Featured Projects
        </h2>
        <p className="section-subtitle">Check out my latest work</p>
        <div className="projects-grid">
          {projects.map((project, index) => (
            <div
              key={index}
              className={`project-card ${hoveredIndex === index ? 'hovered' : ''}`}
              onMouseEnter={() => setHoveredIndex(index)}
              onMouseLeave={() => setHoveredIndex(null)}
              style={{ '--card-color': project.color }}
            >
              <div className="project-image">
                <img src={project.image} alt={project.title} />
                <div className="project-overlay">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-link"
                  >
                    <span className="link-text">View Live</span>
                    <span className="link-icon">→</span>
                  </a>
                </div>
              </div>
              <div className="project-content">
                <h3 className="project-title">{project.title}</h3>
                <p className="project-description">{project.description}</p>
                <div className="project-tags">
                  {project.tags.map((tag, idx) => (
                    <span key={idx} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="project-links">
                  <a
                    href={project.liveLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="project-btn"
                  >
                    {project.liveLink.includes('rightintake') ? '🌐 Visit Site' : '✨ Live Demo'}
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="floating-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
        <div className="shape shape-3"></div>
      </div>
    </section>
  )
}

export default Projects
