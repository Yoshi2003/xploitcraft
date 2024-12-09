import React from 'react';
import './Resources.css';

const redditSubreddits = [
  { name: 'r/CompTIA', url: '#' },
  { name: 'r/CyberSecurity', url: '#' },
  { name: 'r/AskNetsec', url: '#' },
  { name: 'r/SecurityCareerAdvice', url: '#' }
];

const redditPosts = [
  { title: 'Key Tips for Passing A+', url: '#' },
  { title: 'Network+ Study Notes Mega-Thread', url: '#' },
  { title: 'Security+ Cram Sheet Discussion', url: '#' }
];

const youtubeChannels = [
  { name: 'Professor Messer', url: '#' },
  { name: 'NetworkChuck', url: '#' },
  { name: 'ITProTV', url: '#' },
  { name: 'HackerSploit', url: '#' }
];

const youtubeVideos = [
  { title: 'A+ Core 1 Overview', url: '#' },
  { title: 'Security+ Latest Objectives Walkthrough', url: '#' }
];

const udemyCourses = [
  { title: 'CompTIA A+ Complete Course', url: '#' },
  { title: 'CompTIA Security+ (SY0-601) Bootcamp', url: '#' }
];

const linkedInPeople = [
  { name: 'John Doe (Cybersecurity Analyst)', url: '#' },
  { name: 'Jane Smith (SOC Lead)', url: '#' }
];

const otherResources = [
  { name: 'Official CompTIA Website', url: 'https://www.comptia.org' },
  { name: 'Cybrary', url: 'https://www.cybrary.it' },
  { name: 'OWASP Official Site', url: 'https://owasp.org' }
];

const comptiaObjectives = [
  { cert: 'A+', url: '#' },
  { cert: 'Network+', url: '#' },
  { cert: 'Security+', url: '#' },
  { cert: 'CySA+', url: '#' },
  { cert: 'CASP+', url: '#' },
  { cert: 'PenTest+', url: '#' },
  { cert: 'Cloud+', url: '#' }
];

// Extensive list of frameworks, standards, methodologies, and references:
const securityFrameworks = [
  { name: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
  { name: 'ISO/IEC 27001', url: 'https://www.iso.org/isoiec-27001-information-security.html' },
  { name: 'Lockheed Martin Cyber Kill Chain', url: '#' },
  { name: 'MITRE ATT&CK Framework', url: 'https://attack.mitre.org/' },
  { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
  { name: 'COBIT', url: 'https://www.isaca.org/resources/cobit' },
  { name: 'ITIL (Information Technology Infrastructure Library)', url: '#' },
  { name: 'PCI-DSS (Payment Card Industry Data Security Standard)', url: 'https://www.pcisecuritystandards.org/' },
  { name: 'HIPAA Security Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html' },
  { name: 'Sarbanes-Oxley (SOX) IT Controls', url: '#' },
  { name: 'FedRAMP', url: 'https://www.fedramp.gov/' },
  { name: 'CIS Controls', url: 'https://www.cisecurity.org/controls' },
  { name: 'ENISA (European Union Agency for Cybersecurity) Guidelines', url: 'https://www.enisa.europa.eu/' },
  { name: 'SANS Top 20 Critical Controls', url: '#' },
  { name: 'Cybersecurity Maturity Model Certification (CMMC)', url: 'https://www.acq.osd.mil/cmmc/' },
  { name: 'FISMA (Federal Information Security Management Act)', url: '#' },
  { name: 'NERC CIP (North American Electric Reliability Corporation Critical Infrastructure Protection)', url: '#' },
  { name: 'GDPR (General Data Protection Regulation)', url: 'https://gdpr.eu/' },
  { name: 'HITRUST CSF', url: 'https://hitrustalliance.net/' },
  { name: 'ISO/IEC 27002', url: 'https://www.iso.org/standard/73906.html' },
  { name: 'NIST 800-53 Security Controls', url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final' },
  { name: 'NIST 800-171', url: 'https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final' },
  { name: 'Cyber Kill Chain variations (e.g., Unified Kill Chain)', url: '#' },
  { name: 'VERIS (Vocabulary for Event Recording and Incident Sharing)', url: 'http://veriscommunity.net/' },
  { name: 'MARION Framework', url: '#' },
  { name: 'Diamond Model of Intrusion Analysis', url: '#' },
  { name: 'ATT&CK for ICS (Industrial Control Systems)', url: 'https://collaborate.mitre.org/attackics/index.php/Main_Page' },
  { name: 'SOC2 (Service Organization Control 2)', url: '#' },
  { name: 'ISO 22301 (Business Continuity)', url: 'https://www.iso.org/iso-22301-business-continuity.html' }
];

function Resources() {
  return (
    <div className="resources-container">
      <h1 className="resources-title">Resources Hub</h1>
      
      <section className="resources-section">
        <h2>Reddit Resources</h2>
        <div className="resources-subsection">
          <h3>Subreddits</h3>
          <ul>
            {redditSubreddits.map((sub, i) => (
              <li key={i}><a href={sub.url} target="_blank" rel="noreferrer">{sub.name}</a></li>
            ))}
          </ul>
        </div>
        <div className="resources-subsection">
          <h3>Key Reddit Posts</h3>
          <ul>
            {redditPosts.map((post, i) => (
              <li key={i}><a href={post.url} target="_blank" rel="noreferrer">{post.title}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="resources-section">
        <h2>YouTube Resources</h2>
        <div className="resources-subsection">
          <h3>Channels</h3>
          <ul>
            {youtubeChannels.map((ch, i) => (
              <li key={i}><a href={ch.url} target="_blank" rel="noreferrer">{ch.name}</a></li>
            ))}
          </ul>
        </div>
        <div className="resources-subsection">
          <h3>Videos</h3>
          <ul>
            {youtubeVideos.map((vid, i) => (
              <li key={i}><a href={vid.url} target="_blank" rel="noreferrer">{vid.title}</a></li>
            ))}
          </ul>
        </div>
      </section>

      <section className="resources-section">
        <h2>Udemy Courses</h2>
        <ul>
          {udemyCourses.map((course, i) => (
            <li key={i}><a href={course.url} target="_blank" rel="noreferrer">{course.title}</a></li>
          ))}
        </ul>
      </section>

      <section className="resources-section">
        <h2>LinkedIn Professionals</h2>
        <ul>
          {linkedInPeople.map((person, i) => (
            <li key={i}><a href={person.url} target="_blank" rel="noreferrer">{person.name}</a></li>
          ))}
        </ul>
      </section>

      <section className="resources-section">
        <h2>Other Resources</h2>
        <ul>
          {otherResources.map((res, i) => (
            <li key={i}><a href={res.url} target="_blank" rel="noreferrer">{res.name}</a></li>
          ))}
        </ul>
      </section>

      <section className="resources-section">
        <h2>CompTIA Certification Objectives</h2>
        <ul>
          {comptiaObjectives.map((obj, i) => (
            <li key={i}><a href={obj.url} target="_blank" rel="noreferrer">{obj.cert}</a></li>
          ))}
        </ul>
      </section>

      <section className="resources-section">
        <h2>Security Frameworks & Standards</h2>
        <ul className="framework-list">
          {securityFrameworks.map((fw, i) => (
            <li key={i}><a href={fw.url} target="_blank" rel="noreferrer">{fw.name}</a></li>
          ))}
        </ul>
      </section>
    </div>
  );
}

export default Resources;


