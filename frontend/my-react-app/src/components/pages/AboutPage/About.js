import React from 'react';
import './About.css'; // Import the CSS for styling

function About() {
  return (
    <div className="about-page-container">
      {/* About Section */}
      <div className="about-content">
        <h1 className="about-main-header orbitron-font">About ProxyAuthRequired</h1>
 {/* Main header now just says "About" */}
        
        <section className="about-intro">
          <p>
            ProxyAuthRequired is your personal launchpad into the realm of cybersecurity, combining a variety of tools—like analogy-driven explanations, daily emails, targeted test questions, and well-organized study materials—into one cohesive platform. Designed by Carter, an integration tech at Sealing Tech who thrives on making hard concepts understandable, ProxyAuthRequired encourages learners to explore content on their own terms. With its fusion of practical learning and interactive experiences, you'll move beyond rote memorization to truly grasp the why behind cybersecurity practices.
          </p>
          <p>
            The result is a fun, immersive environment where theory meets real-world practice, ensuring you grow from curious beginner to confident professional.
          </p>
        </section>

        {/* Tools Section */}
        <section className="about-tools">
          {/* First Column: ScenarioSphere and Log Analysis */}
          <div className="tool-column">
            <div className="tool-card">
              <h3>Xploitcraft</h3>
              <p>Xploitcraft allows you to specify a vulnerability and an evasion technique, then generates a realistic payload that attackers might use. By seeing this code in action, you gain insight into the logic and methods behind sophisticated exploits.</p>
            </div>
            <div className="tool-card">
              <h3>Log Analysis</h3>
              <p>Log Analysis equips you with the tools to interpret raw system logs and spot hidden patterns. You can dive into simulated logs, tweak complexity settings, and uncover suspicious activities that hint at breaches or policy violations. By practicing on varied datasets, you develop the skill to sift through noise, identify critical events, and piece together a coherent timeline of incidents. Over multiple sessions, you’ll refine your investigative techniques, learn which anomalies to flag, and how to draw meaningful conclusions.</p>
            </div>
          </div>

          {/* Second Column: AnalogyHub and GRC Wizard */}
          <div className="tool-column">
            <div className="tool-card">
              <h3>AnalogyHub</h3>
              <p>AnalogyHub takes the complex world of cybersecurity and translates it into vivid, relatable metaphors. Instead of wading through dense technical jargon, you’ll discover comparisons that turn complicated protocols into familiar concepts—like comparing cryptography keys to house keys, or firewalls to castle walls. Each analogy aims to clarify, entertain, and embed the lesson into your memory. As you explore more metaphors, you’ll find it easier to understand advanced topics like zero-trust architectures or network segmentation.</p>
            </div>
            <div className="tool-card">
              <h3>GRC Wizard</h3>
              <p>GRC Wizard demystifies Governance, Risk, and Compliance frameworks, guiding you step-by-step through complex policies and standards. You can specify difficulty levels and choose particular frameworks—or let it pick one at random—to generate a focused test question. By tackling these questions, you’ll learn how to navigate regulatory mandates, implement controls, and manage risks efficiently. </p>
            </div>
          </div>

          {/* Third Column: Red vs Blue and Daily Cyber Brief */}
          <div className="tool-column">
            <div className="tool-card">
              <h3>Scenario Sphere</h3>
              <p>Scenario Sphere transports you into a tailored cybersecurity incident, letting you pick the threat type, skill level, and even the style of attack you want to face. Once set, it generates a realistic scenario that immerses you in the crisis, compelling you to think critically. After presenting the context, it provides four thought-provoking test questions, ensuring you truly internalize the lesson. By solving these scenario-based challenges, you sharpen your decision-making and adaptability under pressure.</p>
            </div>
            <div className="tool-card">
              <h3>Daily Cyber Brief</h3>
              <p>Daily Cyber Brief delivers curated cybersecurity news, updates, CompTIA objectives, and best practices straight to your inbox each morning. Its concise format ensures you stay informed without feeling overwhelmed—just enough to keep you aware of evolving threats and defenses. By regularly receiving these summaries, you’ll maintain a steady awareness of industry shifts, from newly discovered vulnerabilities to emerging compliance requirements.</p>
            </div>
          </div>
        </section>

        {/* Certifications Section */}
        <section className="about-certifications">
          <div className="certifications-list">
            <div>
              <h3>Current Certifications</h3>
              <ul>
                <li>CompTIA A+</li>
                <li>CompTIA Network+</li>
                <li>CompTIA Security+</li>
                <li>CompTIA  Cloud+</li>
                <li>CompTIA CySa+</li>
                <li>CompTIA Pentest+</li>
                <li>CompTIA CASP+</li>
                <li>CompTIA Linux+</li>
                <li>Python PCEP</li>
              </ul>
            </div>
            <div>
              <h3>In Progress/Up Next</h3>
              <ul>
                <li>CISSP</li>
                <li>OSCP</li>
                <li>OSDA</li>
                <li>OSWA</li>
                <li>OSWE</li>
                <li>OSEP</li>
                <li>OSMR</li>
                <li>OSED</li>
                <li>KLCP</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="about-links">
  <h2 className="links-title">Links</h2>
  <div className="links-container">
    <p>
      <strong className="github-title">GitHub:</strong> 
      <a className="repository-link" href="https://github.com/Yoshi2003/ProxyAuthRequired" target="_blank" rel="noopener noreferrer">Repository</a>
    </p>
    <p>
      <strong className="linkedin-title">LinkedIn:</strong> 
      <a className="linkedin-link" href="https://www.linkedin.com/in/carter-perez-ProxyAuthRequired/" target="_blank" rel="noopener noreferrer">Carter's LinkedIn</a>
    </p>
  </div>
</section>


        {/* About Carter Section */}
        <section className="about-carter">
  <h2 className="carter-title">About Carter</h2>
  <p className="carter-description">
    I am a 21-year-old Integration Technician at Sealing Tech, driven by a passion for making cybersecurity learning accessible and enjoyable. Formerly a general manager in the fast-food industry just one year ago, I’ve since changed paths and am now pursuing a master’s degree in Cybersecurity at UMGC. I draw inspiration from my favorite show, Mr. Robot, channeling that creative energy into the theme of this webiste. Outside of work, I enjoy speedruning certifications for fun, coding programs to streamline my daily life, and continually pushing myself forward— As I move toward becoming a cybersecurity analyst, then a penetration tester, stepping into GRC management, and ultimately a CTO role, I thrive on self-learning, personal growth, and creative problem-solving. Thanks for checking out the site, and I hope you find it useful :)
  </p>
</section>
      </div>

      <footer className="about-footer">
        <p>© 2025 ProxyAuthRequired. Developed and Designed by Carter Perez.</p>
      </footer>
    </div>
  );
}

export default About;

