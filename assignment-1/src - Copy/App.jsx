import React from 'react';
import './App.css';

// Component 1: Navigation Bar
function Navbar() {
  return (
    <nav className="navbar">
      <div className="nav-brand">Portfolio</div>
      <ul className="nav-links">
        <li><a href="#about">About</a></li>
        <li><a href="#education">Education</a></li>
        <li><a href="#skills">Skills</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </nav>
  );
}

// Component 2: Header (Hero Section)
function Header() {
  return (
    <header className="header-hero">
      <h1>Hello, I'm <span className="highlight">Jayashree Jana</span></h1>
      <p>Passionate Web Developer & Computer Science Student</p>
    </header>
  );
}

// Component 3: About Me
function About() {
  return (
    <section id="about" className="section-block">
      <h2 className="section-title">About Me</h2>
      <p>
        I am a curious software enthusiast focused on modern front-end engineering. 
        I enjoy building user-friendly, responsive applications and solving challenging 
        algorithmic problems. Currently looking for opportunities to grow and apply 
        my technical skills in full-stack web development.
      </p>
    </section>
  );
}

// Component 4: Education
function Education() {
  return (
    <section id="education" className="section-block">
      <h2 className="section-title">Education</h2>
      <div className="edu-item">
        <h3>Bachelor of Technology in Computer Science</h3>
        <p className="edu-meta">University Institute of Technology | 2022 - 2026</p>
      </div>
      <div className="edu-item">
        <h3>Higher Secondary (12th Grade)</h3>
        <p className="edu-meta">Higher Secondary School | 2020 - 2022</p>
      </div>
    </section>
  );
}

// Component 5: Skills
function Skills() {
  const skillList = [
    'HTML5',
    'CSS3',
    'JavaScript (ES6+)',
    'React.js',
    'Node.js',
    'Git & GitHub',
    'Data Structures',
    'SQL'
  ];

  return (
    <section id="skills" className="section-block">
      <h2 className="section-title">Technical Skills</h2>
      <div className="skills-grid">
        {skillList.map((skill, index) => (
          <span key={index} className="skill-tag">
            {skill}
          </span>
        ))}
      </div>
    </section>
  );
}

// Component 6: Contact Information
function Contact() {
  return (
    <section id="contact" className="section-block">
      <h2 className="section-title">Contact Information</h2>
      <div className="contact-info">
        <p><strong>Email:</strong> jayashreejana.dev@example.com</p>
        <p><strong>Phone:</strong> +91 98765 43210</p>
        <p><strong>Location:</strong> West Bengal, India</p>
        <p><strong>LinkedIn:</strong> linkedin.com/in/jayashreejana-sample</p>
      </div>
    </section>
  );
}

// Component 7: Footer
function Footer() {
  return (
    <footer className="footer">
      <p>&copy; 2026 Jayashree Jana. All rights reserved.</p>
    </footer>
  );
}

// Component 8: Main App Component
function App() {
  return (
    <div className="portfolio-container">
      <Navbar />
      <Header />
      <main className="main-content">
        <About />
        <Education />
        <Skills />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default App;