import React, { useState } from 'react';
import './Resources.css';

// Existing Resource Arrays
const redditSubreddits = [
  { name: 'r/CompTIA', url: 'https://www.reddit.com/r/CompTIA/' },
  { name: 'r/CyberSecurity', url: 'https://www.reddit.com/r/cybersecurity/' },
  { name: 'r/AskNetsec', url: 'https://www.reddit.com/r/AskNetsec/' },
  { name: 'r/Casp', url: 'https://www.reddit.com/r/casp/' },
  { name: 'r/ITCareerQuestions', url: 'https://www.reddit.com/r/ITCareerQuestions/' },
  { name: 'r/WGU', url: 'https://www.reddit.com/r/WGU/' },
  { name: 'r/CCNA', url: 'https://www.reddit.com/r/ccna/' },
  { name: 'r/sysadmin', url: 'https://www.reddit.com/r/sysadmin/' },
  { name: 'r/linuxquestions/', url: 'https://www.reddit.com/r/linuxquestions/' },
];

const redditPosts = [
  { title: 'View my Reddit post- How I passed 9 CompTIA certs with no experience and key tips on how I got my job.', url: '#' },
  { title: '##', url: '#' },
  { title: '##', url: '#' },
  { title: '##', url: '#' },
  { title: 'How I passed COMPTIA A+ N+ S+', url: 'https://www.reddit.com/r/CompTIA/comments/1cra3cg/how_i_passed_comptia_a_n_s/' },
];

const youtubeChannels = [
  { name: 'Professor Messer', url: 'https://www.youtube.com/@professormesser' },
  { name: 'NetworkChuck', url: 'https://www.youtube.com/@NetworkChuck' },
  { name: 'PowerCertAnimatedVideos', url: 'https://www.youtube.com/@PowerCertAnimatedVideos' },
  { name: 'HackerSploit', url: 'https://www.youtube.com/@HackerSploit' },
  { name: 'Cyberkraft', url: 'https://www.youtube.com/@cyberkraft' },
  { name: 'howtonetwork', url: 'https://www.youtube.com/@howtonetworkcom' },
  { name: 'MyCS1', url: 'https://www.youtube.com/@MyCS1/videos' }
  
];

const youtubeVideos = [
  { title: 'A+ Core 1 Overview', url: '#' },
  { title: 'Security+ Latest Objectives Walkthrough', url: '#' }
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
  { title: '#', url: '#' },
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
  { name: 'Official CompTIA Resources', url: 'https://www.comptia.org/resources' },
  { name: 'Cybrary', url: 'https://www.cybrary.it' },
  { name: 'OWASP Official Site', url: 'https://owasp.org' },
  { name: 'Pluralsight', url: 'https://www.pluralsight.com/' },
  
  
];

// CompTIA Objectives Array
const comptiaObjectives = [
  { cert: 'A+ Core 1', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-a-new-core-objectives-(3-0)' },
  { cert: 'A+ Core 2', url: 'https://partners.comptia.org/docs/default-source/resources/comptia-a-220-1102-exam-objectives-(3-0)' },
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

// Security Frameworks Array
const securityFrameworks = [
  { name: 'NIST Cybersecurity Framework', url: 'https://www.nist.gov/cyberframework' },
  { name: 'ISO/IEC 27001', url: 'https://www.iso.org/isoiec-27001-information-security.html' },
  { name: 'Lockheed Martin Cyber Kill Chain', url: 'https://www.lockheedmartin.com/en-us/capabilities/cyber/cyber-kill-chain.html' },
  { name: 'MITRE ATT&CK Framework', url: 'https://attack.mitre.org/' },
  { name: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
  { name: 'COBIT', url: 'https://www.isaca.org/resources/cobit' },
  { name: 'ITIL (Information Technology Infrastructure Library)', url: 'https://www.itlibrary.org/' },
  { name: 'PCI-DSS (Payment Card Industry Data Security Standard)', url: 'https://www.pcisecuritystandards.org/' },
  { name: 'HIPAA Security Rule', url: 'https://www.hhs.gov/hipaa/for-professionals/security/index.html' },
  { name: 'Sarbanes-Oxley (SOX) IT Controls', url: 'https://www.sarbanes-oxley-101.com/sarbanes-oxley-compliance.htm' },
  { name: 'FedRAMP', url: 'https://www.fedramp.gov/' },
  { name: 'CIS Controls', url: 'https://www.cisecurity.org/controls' },
  { name: 'ENISA (European Union Agency for Cybersecurity) Guidelines', url: 'https://www.enisa.europa.eu/' },
  { name: 'SANS Top 20 Critical Controls', url: 'https://www.cm-alliance.com/consultancy/compliance-gap-analysis/sans-top-20-controls/' },
  { name: 'Cybersecurity Maturity Model Certification (CMMC)', url: 'https://www.acq.osd.mil/cmmc/' },
  { name: 'FISMA (Federal Information Security Management Act)', url: 'https://www.cisa.gov/topics/cyber-threats-and-advisories/federal-information-security-modernization-act' },
  { name: 'NERC CIP', url: 'https://www.nerc.com/pa/CI/tpv5impmntnstdy/CIPV5_FAQs_Consolidated_Oct2015_Oct_13_2015.pdf' },
  { name: 'GDPR (General Data Protection Regulation)', url: 'https://gdpr.eu/' },
  { name: 'HITRUST CSF', url: 'https://hitrustalliance.net/' },
  { name: 'ISO/IEC 27002', url: 'https://www.iso.org/standard/73906.html' },
  { name: 'NIST 800-53 Security Controls', url: 'https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final' },
  { name: 'NIST 800-171', url: 'https://csrc.nist.gov/publications/detail/sp/800-171/rev-2/final' },
  { name: 'Unified Kill Chain', url: 'https://www.unifiedkillchain.com/assets/The-Unified-Kill-Chain.pdf' },
  { name: 'VERIS', url: 'http://veriscommunity.net/' },
  { name: '#', url: '#' },
  { name: 'Diamond Model of Intrusion Analysis', url: 'https://www.threatintel.academy/wp-content/uploads/2020/07/diamond-model.pdf' },
  { name: 'ATT&CK for ICS', url: 'https://collaborate.mitre.org/attackics/index.php/Main_Page' },
  { name: 'SOC2', url: 'https://www.vanta.com/products/soc-2' },
  { name: 'ISO 22301 (Business Continuity)', url: 'https://www.iso.org/iso-22301-business-continuity.html' }
];

// Helper Function to Capitalize First Letter
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

// Constructing Resources Data with Certification Categories
const resourcesData = {
  // Existing Categories
  reddit: [
    ...redditSubreddits,
    ...redditPosts.map((post) => ({ name: post.title, url: post.url }))
  ],
  youtube: [
    ...youtubeChannels,
    ...youtubeVideos.map((vid) => ({ name: vid.title, url: vid.url }))
  ],
  udemy: udemyCourses.map((course) => ({ name: course.title, url: course.url })),
  frameworks: [...securityFrameworks],
  other: [...otherResources],
  linkedin: [...linkedInPeople],

  // Master Category: CompTIA Certification Objectives
  'CompTIA Certification Objectives': comptiaObjectives.map((obj) => ({ name: obj.cert, url: obj.url })),

  // Individual Certification Categories

  // A+ Category
  'A+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().includes('a+ core'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'A+ Study Guide', url: '#' },
    { name: 'A+ Practice Exams', url: '#' },
    // Add more A+ specific resources here
  ],

  // Network+ Category
  'Network+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('network+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Network+ Study Guide', url: '#' },
    { name: 'Network+ Labs', url: '#' },
    // Add more Network+ specific resources here
  ],

  // Security+ Category
  'Security+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('security+') && !obj.cert.toLowerCase().includes('x'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Security+ Study Guide', url: '#' },
    { name: 'Security+ Practice Labs', url: '#' },
    // Add more Security+ specific resources here
  ],

  // CySA+ Category
  'CySA+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('cysa+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'CySA+ Study Guide', url: '#' },
    { name: 'CySA+ Practice Exams', url: '#' },
    // Add more CySA+ specific resources here
  ],

  // SecurityX/CASP Category
  'SecurityX/CASP': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().includes('casp') || obj.cert.toLowerCase().includes('securityx'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'CASP+ Study Guide', url: '#' },
    { name: 'SecurityX Practice Labs', url: '#' },
    // Add more SecurityX/CASP specific resources here
  ],

  // PenTest+ Category
  'PenTest+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('pentest+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'PenTest+ Study Guide', url: '#' },
    { name: 'PenTest+ Labs', url: '#' },
    // Add more PenTest+ specific resources here
  ],

  // Cloud+/Cloud Essentials Category
  'Cloud+/Cloud Essentials': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().includes('cloud'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Cloud+ Study Guide', url: '#' },
    { name: 'Cloud Essentials Training', url: '#' },
    // Add more Cloud+/Cloud Essentials specific resources here
  ],

  // Linux+ Category
  'Linux+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('linux+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Linux+ Study Guide', url: '#' },
    { name: 'Linux+ Practice Labs', url: '#' },
    // Add more Linux+ specific resources here
  ],

  // Data+ Category
  'Data+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('data'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Data+ Study Guide', url: '#' },
    { name: 'Data+ Practice Exams', url: '#' },
    // Add more Data+ specific resources here
  ],

  // Server+ Category
  'Server+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('server+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Server+ Study Guide', url: '#' },
    { name: 'Server+ Labs', url: '#' },
    // Add more Server+ specific resources here
  ],

  // Project+ Category
  'Project+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('project+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'Project+ Study Guide', url: '#' },
    { name: 'Project+ Practice Exams', url: '#' },
    // Add more Project+ specific resources here
  ],

  // ITF/TECH+ Category
  'ITF/TECH+': [
    // Objective Links
    ...comptiaObjectives
      .filter(obj => obj.cert.toLowerCase().startsWith('itf') || obj.cert.toLowerCase().includes('tech+'))
      .map(obj => ({ name: obj.cert, url: obj.url })),
    // Additional Resources
    { name: 'ITF Study Guide', url: '#' },
    { name: 'Tech+ Training Videos', url: '#' },
    // Add more ITF/TECH+ specific resources here
  ]
};

function Resources() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sorted, setSorted] = useState(false);
  const [randomResource, setRandomResource] = useState(null);

  const handleSearch = (event) => setSearchTerm(event.target.value.toLowerCase());
  const handleCategoryChange = (event) => setSelectedCategory(event.target.value);

  // Filtering Resources Based on Search and Category
  const filteredResources = Object.entries(resourcesData)
    .filter(([category]) => selectedCategory === "all" || category === selectedCategory)
    .flatMap(([, resources]) => resources)
    .filter((resource) => resource.name.toLowerCase().includes(searchTerm))
    .sort((a, b) => (sorted ? a.name.localeCompare(b.name) : 0));

  // Handling Random Resource Selection
  const handleRandomResource = () => {
    const currentCategoryResources = selectedCategory === "all"
      ? Object.values(resourcesData).flat()
      : (resourcesData[selectedCategory] || []);
    
    if (currentCategoryResources.length === 0) {
      setRandomResource(null);
      return;
    }
    
    const random = currentCategoryResources[Math.floor(Math.random() * currentCategoryResources.length)];
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

        <select onChange={handleCategoryChange} value={selectedCategory}>
          <option value="all">All Categories</option>
          {Object.keys(resourcesData).map((category) => (
            <option key={category} value={category}>
              {capitalizeFirstLetter(category)}
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


