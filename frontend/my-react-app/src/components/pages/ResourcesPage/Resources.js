import React, { useState } from 'react';
import './Resources.css';

const redditSubreddits = [
  { name: 'r/CompTIA', url: 'https://www.reddit.com/r/CompTIA/' },
  { name: 'r/CyberSecurity', url: 'https://www.reddit.com/r/cybersecurity/' },
  { name: 'r/AskNetsec', url: 'https://www.reddit.com/r/AskNetsec/' },
  { name: 'r/Casp', url: 'https://www.reddit.com/r/casp/' },
  { name: 'r/SecurityCareerAdvice', url: 'https://www.reddit.com/r/SecurityCareerAdvice/' },
  { name: 'r/SecurityCareerAdvice', url: 'https://www.reddit.com/r/SecurityCareerAdvice/' },
  { name: 'r/SecurityCareerAdvice', url: 'https://www.reddit.com/r/SecurityCareerAdvice/' }
];

const redditPosts = [
  { title: 'View my Reddit post- How I passed 9 CompTIA certs with no experience and key tips on how I got my job.', url: '#' },
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
  { name: '*VERY IMPORTANT FOR CASP* -wyzguyscybersecurity blog', url: 'https://wyzguyscybersecurity.com/new-insights-for-the-casp-cas-004-exam/' },
  { name: 'Official CompTIA Recources', url: 'https://www.comptia.org/resources' },
  { name: 'Cybrary', url: 'https://www.cybrary.it' },
  { name: 'OWASP Official Site', url: 'https://owasp.org' }
];

const comptiaObjectives = [
  { cert: 'A+ Core 1', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-a-new-core-objectives-(3-0)' },
  { cert: 'A+ core 2', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-a-220-1102-exam-objectives-(3-0)' },
  { cert: 'Network+ (009)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-network-n10-009-exam-objectives-(4-0)' },
  { cert: 'Security+ (701)', url: 'https://certblaster.com/wp-content/uploads/2023/11/CompTIA-Security-SY0-701-Exam-Objectives-1.pdf' },
  { cert: 'CySA+ (003)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-cysa-cs0-003-exam-objectives-2-0.pdf' },
  { cert: 'CASP+ (004)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-casp-cas-004-exam-objectives-(4-0)' },
  { cert: 'PenTest+ (002)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-pentest-pt0-002-exam-objectives-(4-0)' },
  { cert: 'Cloud+ (003)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-cloud-cv0-003-exam-objectives-(1-0)#:~:text=%EE%80%80CompTIA%EE%80%81%20exams%20result%20from%20subject%20matter' },
  { cert: 'Cloud Essentials', url: 'https://partners.comptia.org/docs/default-source/resources/cloud-essentials-certification-guide' },
  { cert: 'Linux+ (005)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-linux-xk0-005-exam-objectives-(1-0)' },
  { cert: 'Data+ (001)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-data-da0-001-exam-objectives-(2-0)' },
  { cert: 'DataSys+', url: 'https://partners.comptia.org/certifications/datasys' },
  { cert: 'DataX+', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-datax-dy0-001-exam-objectives-(5-0)' },
  { cert: 'Server+ (005)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-server-sk0-005-exam-objectives' },
  { cert: 'Project+ (005)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-project-pk0-005-exam-objectives-(2-0)' },
  { cert: 'ITF', url: 'https://www.comptia.jp/pdf/CompTIA%20IT%20Fundamentals%20FC0-U61%20Exam%20Objectives.pdf' },
  { cert: 'Tech+', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-tech-fc0-u71-exam-objectives-(1-2)' },
  { cert: 'SecurityX (CASP 005)', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-securityx-cas-005-exam-objectives-(3-0)' }
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
  { name: 'Sarbanes-Oxley (SOX) IT Controls', url: 'https://www.sarbanes-oxley-101.com/sarbanes-oxley-compliance.htm' },
  { name: 'FedRAMP', url: 'https://www.fedramp.gov/' },
  { name: 'CIS Controls', url: 'https://www.cisecurity.org/controls' },
  { name: 'ENISA (European Union Agency for Cybersecurity) Guidelines', url: 'https://www.enisa.europa.eu/' },
  { name: 'SANS Top 20 Critical Controls', url: '#' },
  { name: 'Cybersecurity Maturity Model Certification (CMMC)', url: 'https://www.acq.osd.mil/cmmc/' },
  { name: 'FISMA (Federal Information Security Management Act)', url: 'https://www.cisa.gov/topics/cyber-threats-and-advisories/federal-information-security-modernization-act' },
  { name: 'NERC CIP', url: 'https://www.nerc.com/pa/CI/tpv5impmntnstdy/CIPV5_FAQs_Consolidated_Oct2015_Oct_13_2015.pdf' },
  { name: 'GDPR (General Data Protection Regulation)', url: 'https://gdpr.eu/' },
  { name: 'HITRUST CSF', url: 'https://hitrustalliance.net/' },
  { name: 'ISO/IEC 27002', url: 'https://www.iso.org/standard/73906.html' },
  { name: 'NIST 800-53 Security Controls', url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final' },
  { name: 'NIST 800-171', url: 'https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final' },
  { name: 'Cyber Kill Chain variations (e.g., Unified Kill Chain)', url: '#' },
  { name: 'VERIS', url: 'http://veriscommunity.net/' },
  { name: 'MARION Framework', url: '#' },
  { name: 'Diamond Model of Intrusion Analysis', url: '#' },
  { name: 'ATT&CK for ICS', url: 'https://collaborate.mitre.org/attackics/index.php/Main_Page' },
  { name: 'SOC2', url: '#' },
  { name: 'ISO 22301 (Business Continuity)', url: 'https://www.iso.org/iso-22301-business-continuity.html' }
];

// Construct resourcesData from the arrays above:
const resourcesData = {
  // Combine redditSubreddits and redditPosts, mapping posts.title to name
  reddit: [
    ...redditSubreddits,
    ...redditPosts.map((post) => ({ name: post.title, url: post.url }))
  ],
  // Combine youtubeChannels and youtubeVideos, mapping videos.title to name
  youtube: [
    ...youtubeChannels,
    ...youtubeVideos.map((vid) => ({ name: vid.title, url: vid.url }))
  ],
  // udemyCourses using title to name
  udemy: udemyCourses.map((course) => ({ name: course.title, url: course.url })),
  // frameworks
  frameworks: [...securityFrameworks],
  // certifications from comptiaObjectives: map cert to name
  certifications: comptiaObjectives.map((obj) => ({ name: obj.cert, url: obj.url })),
  // otherResources already use name
  other: [...otherResources],
  // linkedIn as a separate category if desired
  linkedin: [...linkedInPeople]
};

function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sorted, setSorted] = useState(false);
  const [randomResource, setRandomResource] = useState(null);

  const handleSearch = (event) => setSearchTerm(event.target.value.toLowerCase());
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);

  const filteredResources = Object.entries(resourcesData)
    .filter(([category]) => selectedCategory === "all" || category === selectedCategory)
    .flatMap(([, resources]) => resources)
    .filter((resource) => resource.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => (sorted ? a.name.localeCompare(b.name) : 0));

  const handleRandomResource = () => {
    const allResources = Object.values(resourcesData).flat();
    const random = allResources[Math.floor(Math.random() * allResources.length)];
    setRandomResource(random);
  };

  return (
    <div className="resources-container">
      <h1>Cybersecurity Resources Hub</h1>

      <div className="resources-controls">
        <input
          type="text"
          placeholder="Search resources..."
          value={searchTerm}
          onChange={handleSearch}
        />

        <select onChange={handleCategoryChange}>
          <option value="all">All Categories</option>
          {Object.keys(resourcesData).map((category) => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>

        <button onClick={() => setSorted(!sorted)}>
          {sorted ? "Unsort" : "Sort A-Z"}
        </button>

        <button onClick={handleRandomResource}>Random Resource</button>
      </div>

      {randomResource && (
        <div className="random-resource">
          <h2>Explore This Resource:</h2>
          <a href={randomResource.url} target="_blank" rel="noopener noreferrer">
            {randomResource.name}
          </a>
        </div>
      )}

      <ul className="resources-list">
        {filteredResources.length ? (
          filteredResources.map((resource, index) => (
            <li key={index}>
              <a href={resource.url} target="_blank" rel="noopener noreferrer">
                {resource.name}
              </a>
            </li>
          ))
        ) : (
          <p>No resources found.</p>
        )}
      </ul>
    </div>
  );
}

export default Resources;



