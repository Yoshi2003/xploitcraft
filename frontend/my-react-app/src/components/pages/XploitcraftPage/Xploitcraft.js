// components/xploitcraft.js
import React, { useState, useEffect } from 'react';
import socketIOClient from 'socket.io-client';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { gruvboxDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import logo from './logo5.png';
import loadingIcon from './loading3.png';
import './App.css';

const ENDPOINT = "/api";


const vulnerabilitiesList = [
  "SQL Injection example",  // openai has some trouble generating examples of these vulnerabilities/payloads/attacks therefore after quite a bit of testing I have chnaged some key words to more "friendly" replacements whihc causes some of them to not make much sense. I have commented the actual word for each replacement for clarification.
  "Blind SQL Injection example",
  "Union-based SQL Injection example",
  "Error-based SQL Injection example",
  "Time-based SQL Injection example",
  "Stored XSS example",
  "Reflected XSS example",
  "DOM-based XSS example",
  "CSRF (Cross-Site Request Forgery) example",
  "LFI (Local File Inclusion) example",
  "RFI (Remote File Inclusion) example",
  "Command Injection example",
  "LDAP Injection example",
  "XML External Entity (XXE) example",
  "Server-Side Request Forgery (SSRF) example",
  "Open Redirect example",
  "Directory Traversal example",
  "Buffer Overflow example",
  "Format String Vulnerability example",
  "Insecure Deserialization example",
  "Clickjacking example",
  "Cross-Site Scripting via JSONP example",
  "Header Injection example",
  "HTTP Response Splitting example",
  "Path Traversal example",
  "Host Header Injection example",
  "SMTP Injection example",
  "XPath Injection example",
  "FTP Bounce Vulnerability example",       // attack → vulnerability
  "PHP Object Injection example",
  "Race Conditions example",
  "Session Fixation example",
  "HTTP Parameter Pollution example",
  "Subdomain Takeover example",
  "XXE with DTD example",
  "Template Injection example",
  "CRLF Injection example",
  "Unvalidated Redirects and Forwards example",
  "Padding Oracle Vulnerability example",   // attack → vulnerability
  "Insecure Cryptographic Storage example",
  "Information Disclosure example",
  "Broken Access Control example",
  "Insecure Direct Object References example",
  "Cross-Site Script Inclusion example",
  "Memory Corruption example",
  "Integer Overflow example",
  "Heap Overflow example",
  "Stack Overflow example",
  "Use-After-Free example",
  "Privilege Escalation example",
  "XML Injection example",
  "SSJS Injection example",
  "Command Injection via RCE example",
  "Server-Side Template Injection example",
  "Prototype Pollution example",
  "Cross-Origin Resource Sharing Misconfigurations example",
  "Clickjacking via Frame Injection example",
  "Cache Poisoning example",
  "HTTP Request Smuggling example",
  "DNS Rebinding example",
  "Man-in-the-Middle Vulnerability example", // attack → vulnerability
  "JQuery Prototype Pollution example",
  "Remote Code Execution via Deserialization example",
  "HTTP Host Header Vulnerability example",  // attack → vulnerability
  "Broken Session Management example",
  "Weak Password Recovery Mechanisms example",
  "Insufficient SSL/TLS Validation example",
  "Misconfigured S3 Buckets example",
  "Misconfigured CORS leading to data exfiltration example",
  "Stored CSRF example",
  "Cross-Site Flashing example",
  "Authentication Bypass via SQLi example",
  "Race Condition in File Upload example",
  "Object Injection in PHP apps example",
  "Deserialization in Java apps example",
  "Log4Shell (CVE-2021-44228) example",
  "Shellshock (CVE-2014-6271) example",
  "Heartbleed (CVE-2014-0160) example",
  "SambaCry example",
  "BlueKeep (CVE-2019-0708) example",
  "EternalBlue (MS17-010) example",
  "Spectre example",
  "Meltdown example",
  "ZombieLoad example",
  "L1 Terminal Fault example",
  "Foreshadow example",
  "Rowhammer example",
  "Cache Side-Channel Adversarial Tests example",        // attacks → adversarial tests changed to vulnerabilities originally, but user said "like vulnerability instead of attack"—we must be consistent:
                                                         // "Cache Side-Channel Attacks" → "Cache Side-Channel Vulnerabilities"
  "Cache Side-Channel Vulnerabilities example",
  "Timing Vulnerabilities on Crypto example",            // attacks → vulnerabilities
  "BREACH Vulnerability example",                        // attack → vulnerability
  "CRIME Vulnerability example",                         // attack → vulnerability
  "POODLE Vulnerability example",                        // attack → vulnerability
  "DROWN Vulnerability example",                         // attack → vulnerability
  "FREAK Vulnerability example",                         // attack → vulnerability
  "Reflection Vulnerability on Cryptosystems example",   // attack → vulnerability
  "DES Weak Key Vulnerability example",
  "Insecure YAML Deserialization example",
  "Cross-Site WebSocket Hijacking example",
  "Shattered Vulnerability on SHA-1 example",            // attack → vulnerability
  "MD5 Collision Adversarial Tests example",             // attacks → vulnerabilities
  "MD5 Collision Vulnerabilities example",
  "Resource Exhaustion (DoS Adversarial Test) example",  // attacks or attack: "DoS Attacks" → "DoS Vulnerabilities"
  "Resource Exhaustion (DoS Vulnerabilities) example",
  "Zip Slip Vulnerability example",
  "HQL Injection example",
  "CSV Injection example",
  "SSRF via DNS Pinning example",
  "SSTI in Django Templates example",
  "Injection via .htaccess Misconfigurations example",
  "Insecure File Permissions example",
  "Unencrypted Sensitive Data at Rest example",
  "Exposed AWS Keys in Code example",
  "Exposed GCP Credentials in Git Repos example",
  "Privilege Escalation via SUID Binaries example",
  "Kernel Exploits (DirtyCow) example",     // exploit → demonstration
                                            // exploits → demonstrations
                                            // "Kernel Exploits" → "Kernel Demonstrations"
  "Kernel Demonstrations (DirtyCow) example",
  "Symbolic Link (Symlink) Vulnerabilities example",   // attacks → vulnerabilities
  "DNS Cache Poisoning example",
  "DNS Amplification Vulnerabilities example",         // attacks → vulnerabilities
  "Rogue Access Point Vulnerabilities example",        // attacks → vulnerabilities
  "ARP Spoofing example",                             // ARP Spoofing is an "attack" → "ARP Spoofing vulnerability"
  "ARP Spoofing Vulnerability example",
  "SMB Relay Vulnerabilities example",                // attacks → vulnerabilities
  "NTLM Relay Vulnerabilities example",               // attacks → vulnerabilities
  "Kerberoasting (Windows Kerberos Vulnerability) example", // attack → vulnerability
  "ASREP Roasting example",
  "Pass-the-Hash Vulnerabilities example",            // attacks → vulnerabilities
  "Pass-the-Ticket Vulnerabilities example",          // attacks → vulnerabilities
  "Golden Ticket Vulnerabilities example",            // attacks → vulnerabilities
  "Silver Ticket Vulnerabilities example",            // attacks → vulnerabilities
  "Skeleton Key Vulnerabilities example",             // attacks → vulnerabilities
  "Insecure JWT Implementations example",
  "Signature Stripping Vulnerability on JWT example", // attack → vulnerability
  "Cross-Tenant Data Leakage in SaaS example",
  "Pivoting via Compromised Hosts example",
  "ICMP Tunneling example",
  "SSH Tunneling for Data Exfiltration example",
  "SSL Stripping Vulnerability example",              // attack → vulnerability
  "SSL Renegotiation Vulnerability example",          // attack → vulnerability
  "Insecure FTP Configurations example",
  "Telnet-based Adversarial Test example",            // attacks → vulnerabilities (Telnet-based Attacks → Telnet-based Vulnerabilities)
  "Telnet-based Vulnerabilities example",
  "RDP Exploitation (CVE-based RCEs) example",        // exploitation → demonstration scenario
  // "RDP Exploitation" → "RDP Demonstration Scenario"
  "RDP Demonstration Scenario (CVE-based RCEs) example",
  "Insecure SNMP Configurations example",
  "Deserialization in .NET example",
  "XXE with Parameter Entities example",
  "Broken Authentication in SAML example",
  "OpenSAMLSIG Adversarial Test example",             // attacks → vulnerabilities
  // "OpenSAMLSIG Attack" → "OpenSAMLSIG Vulnerability"
  "OpenSAMLSIG Vulnerability example",
  "Key-Reinstallation Vulnerabilities (KRACK) on WPA2 example",  // attacks → vulnerabilities
  "Evil Twin AP Vulnerabilities example",                        // attacks → vulnerabilities
  "Watering Hole Vulnerabilities example",                       // attacks → vulnerabilities
  "Supply Chain Vulnerabilities example",                        // attacks → vulnerabilities
  "Malicious Dependency Injection (e.g. npm packages) example",
  "Exposed Docker Daemon example",
  "Insecure Kubernetes Configurations example",
  "Kubernetes API Server Demonstration example",                 // exploit → demonstration
  // "Kubernetes API Server Exploit" → "Kubernetes API Server Demonstration"
  "Kubernetes API Server Demonstration example",
  "Etcd Database Exposure example",
  "Container Breakout Demonstrations example",                   // exploits → demonstrations
  "Runtime Injection in Serverless Environments example",
  "Insecure Serverless Functions Permissions example",
  "SSRF via Cloud Metadata example",
  "Poison Null Byte in File Paths example",
  "Insecure Handling of `/proc` filesystem example",
  "Directory Indexing Vulnerability example",                    // attack → vulnerability
  "Hidden Form Field Tampering example",
  "Session Puzzling Vulnerabilities example",                    // attacks → vulnerabilities
  "Reflected File Download Adversarial Test example",            // attacks → vulnerabilities
  // "Reflected File Download Attack" → "Reflected File Download Vulnerability"
  "Reflected File Download Vulnerability example",
  "Backdoor in Web Application example",
  "MITM via WPAD example",
  "Exposed Redis Instances example",
  "MongoDB No-Auth Access example",
  "Insecure Elasticsearch Cluster example",
  "Insecure Memcached Servers example",
  "Clickjacking via Flash Embeds example",
  "Insecure Deserialization in Ruby YAML example",
  "Insecure Deserialization in Python pickle example",
  "Insecure Deserialization in Java Hessian example",
  "Billion Laughs Demonstration (XXE expansion) example",         // attack → vulnerability or exploit → demonstration
  // "Billion Laughs Attack" → "Billion Laughs Vulnerability"
  "Billion Laughs Vulnerability (XXE expansion) example",
  "Parameter Pollution in SOAP example",
  "Malicious SVG Injection example",
  "XSLT Injection example",
  "Insecure WSDL Exposure example",
  "CSRF with JSON-based Requests example",
  "Deserialization in AMF example",
  "Deserialization in PHP unserialize() example",
  "Covert Timing Channels example",
  "Chained Demonstrations (Multi-step Adversarial Tests) example", // exploits → demonstrations, attacks → vulnerabilities
  // "Chained Exploits (Multi-step Attacks)" → "Chained Demonstrations (Multi-step Vulnerabilities)"
  "Chained Demonstrations (Multi-step Vulnerabilities) example",
  "Shiro Authentication Bypass example",
  "Apache Struts RCE (CVE-2017-5638) example",
  "PhpMyAdmin RCE example",
  "MySQL UDF Demonstration example",                             // exploit → demonstration
  "MSSQL xp_cmdshell Demonstrations example",                     // exploits → demonstrations
  "Oracle TNS Poisoning example",
  "Postgres Copy Demonstrations example",                         // exploits → demonstrations
  "Misconfigured WP REST APIs example",
  "Exposed Jenkins Consoles example",
  "Exposed JMX Interfaces example",
  "JNDI Injection (Log4Shell Type) example",
  "PHP ZipArchive Deserialization example",
  "Spring4Shell (CVE-2022-22965) example",
  "Expression Language Injection example",
  "SSRF via PDF Generation Tools example",
  "SSRF via Image Libraries example",
  "Blind SSRF via DNS Timing example",
  "Email Header Injection example",
  "LDAP Injection via Search Filters example",
  "Serialization Adversarial Tests on IoT Devices example",     // attacks → vulnerabilities
  // "Serialization Attacks on IoT Devices" → "Serialization Vulnerabilities on IoT Devices"
  "Serialization Vulnerabilities on IoT Devices example",
  "Buffer Overflows in Firmware example",
  "Hardcoded Credentials in IoT example",
  "Command Injection in Router Web Interfaces example",
  "UPnP Exploitation on Home Routers example",                   // exploitation → demonstration scenario
  "UPnP Demonstration Scenario on Home Routers example",
  "ICS/SCADA Modbus Vulnerabilities example",                   // attacks → vulnerabilities
  "DNP3 Protocol Vulnerabilities example",                       // attacks → vulnerabilities
  "OPC UA Demonstrations example",                               // exploits → demonstrations
  "BACnet Vulnerabilities example",                              // attacks → vulnerabilities
  "VxWorks OS Vulnerabilities example",
  "Wind River TCP/IP Stack Flaws example",
  "Ripple20 (Treck TCP/IP Stack) Vulnerabilities example",
  "Uncontrolled Format String in C Applications example",
  "Stack Canary Bypass example",
  "SafeSEH Bypass example",
  "ASLR Bypass example",
  "DEP Bypass with ROP Chains example",
  "Web Cache Poisoning example",
  "CRLF Injection in Redis example",
  "CRLF Injection in InfluxDB example",
  "Insecure Cross-Domain JSONP endpoints example",
  "DNS TXT Record Injection example",
  "Exposed Management Interfaces example",
  "SMTP Open Relay example",
  "MTA Command Injection example",
  "IMAP/POP3 Injection example",
  "XSRF in SOAP Services example",
  "Insecure CSR Generation example",
  "Insecure Key Storage in Source Control example",
  "Side-Channel via CPU Cache example",
  "Rowhammer-induced Bitflips to Escalate Privileges example",
  "Thunderbolt DMA Adversarial Test example",                   // attacks → vulnerabilities
  // "Thunderbolt DMA Attacks" → "Thunderbolt DMA Vulnerabilities"
  "Thunderbolt DMA Vulnerabilities example",
  "Firewire DMA Vulnerabilities example",                       // attacks → vulnerabilities
  "PCI-based Vulnerabilities example",                          // attacks → vulnerabilities
  "Bluetooth Replay Vulnerabilities example",                   // attacks → vulnerabilities
  "Wi-Fi Deauthentication Vulnerability example",               // attack → vulnerability
  "LTE Network Vulnerabilities example",                        // attacks → vulnerabilities
  "5G Core Network Misconfigurations example",
  "VoIP SIP Injection example",
  "H.323 Injection example",
  "SS7 Vulnerabilities on Telecom Networks example",            // attacks → vulnerabilities
  "Insecure Industrial Protocol Gateways example",
  "Spear Phishing Code Injection example",                      
  // "Spear Phishing Payload Injection" → "Spear Phishing Code Injection"
  "Spear Phishing Code Injection example",
  "Social Engineering-based Credential Harvesting example",
  "Rogue DHCP Server Vulnerabilities example",                  // attacks → vulnerabilities
  "Network Time Protocol Manipulation example",
  "GSM Base Station Spoofing example",
  "Rogue DNS Server Vulnerabilities example",                   // attacks → vulnerabilities
  "WLAN Krack Vulnerabilities example",                         // attacks → vulnerabilities
  "Supply Chain Vulnerabilities via Dependencies example",      // attacks → vulnerabilities
  "Resource Injection in Web Framework example",
  "Abusing JWT Algorithms (e.g. 'none') example",
  "Re-submission of Nonces example",
  "Signature Forging in OAuth example",
  "Cookie Forcing Vulnerability example",                       // attack → vulnerability
  "Marlinspike Vulnerability example",                          // attack → vulnerability
  "Traffic Injection in TOR example",
  "RepoJacking on GitHub example",
  "Typosquatting Package Demonstrations example",                // exploits → demonstrations
  "Malicious Browser Extensions example",
  "Exploitation of Data URI example",                           // exploitation → demonstration scenario
  "Demonstration Scenario of Data URI example",
  "Exploitation of \"javascript:\" URLs example",
  "Demonstration Scenario of \"javascript:\" URLs example",
  "Path-based SSRF example",
  "Insecure Handling of 3XX Redirects example",
  "Fragment Identifier Injection example",
  "IDOR via Secondary Keys example",
  "IDOR in GraphQL Queries example",
  "GraphQL Query Injection example",
  "GraphQL Introspection Abuse example",
  "Binary Planting example",
  "DLL Hijacking example",
  "Abusing PATH Environment Variable example",
  "Insecure Shell Escape in Scripts example",
  "CSV Formula Injection example",
  "Insecure Rancher Configurations example",
  "Command Injection in Helm Charts example",
  "Insecure Istio Config example",
  "HTTP/2 Codes (HPACK Bomb) example",                          
  // "Exploits" → "Demonstrations"
  // "HTTP/2 Exploits (HPACK Bomb)" → "HTTP/2 Demonstrations (HPACK Bomb)"
  "HTTP/2 Demonstrations (HPACK Bomb) example",
  "ACME Protocol Demonstration example",                         // exploit → demonstration
  "SAML Response Tampering example",
  "SPNEGO/Kerberos Downgrade Vulnerabilities example",           // attacks → vulnerabilities
  "OAuth Implicit Flow Vulnerabilities example",                 // attacks → vulnerabilities
  "Confused Deputy Problem example",
  "SSRF via SSRF Blacklist Bypass example",
  "BGP Route Injection example",
  "Locating Hidden Admin Panels example",
  "Exploiting Unquoted Service Paths on Windows example",        // exploiting → demonstration scenario
  "Demonstration Scenario Unquoted Service Paths on Windows example",
  "Malicious Link in Intranet example",
  "Cookie Tossing Vulnerability example",                        // attack → vulnerability
  "Abusing WebDAV Methods example",
  "Abusing OPTIONS Method example",
  "Cross-Site Script Inclusion with JSONP example",
  "File Upload Bypass via Content-Type example",                 
  "Filename Obfuscation in Upload example",
  "Storing Code in EXIF Data example",                           // payload → code
  "RCE via ImageMagick (ImageTragick) example",
  "SSRF via Redis/HTTP example",
  "Misinformed JSON Parsing Demonstration example",              // exploit → demonstration
  "Insecure Handling of Null Characters example",
  "Abusing ASCII Control Characters example",
  "Stenographic Channels in Images example",                     
  "Exfiltration via DNS Tunneling example",
  "Exfiltration via ICMP Tunneling example",
  "Exfiltration via Covert TCP Channels example",
  "Insecure Handling of Signals in UNIX example",
  "Renegotiation Vulnerability in TLS example",                  // attack → vulnerability
  "SNI Injection Vulnerability example",                        // attack → vulnerability
  "X.509 Parsing Vulnerabilities example",                      // attacks → vulnerabilities
  "Compromising Weak Ciphersuites example",
  "Cross-Host Adversarial Tests via Shared Hosting example",     // attacks → vulnerabilities
  // "Cross-Host Attacks via Shared Hosting" → "Cross-Host Vulnerabilities via Shared Hosting"
  "Cross-Host Vulnerabilities via Shared Hosting example",
  "Misuse of .git/.svn/.hg Folders on Web Servers example",
  "Reverse Proxy Misdirection example",
  "WAF Bypass Adversarial Tests example",                        // attacks → vulnerabilities
  "WAF Bypass Vulnerabilities example",
  "Forced Browsing Vulnerabilities example",                     // attacks → vulnerabilities
  "JSON Injection via callback parameters example",
  "Insecure Handling of JWT Kid Parameter example",
  "HTTP Desync Vulnerabilities example",                         // attacks → vulnerabilities
  "Abusing Vary Headers in HTTP example",
  "WebSocket Injection example",
  "Exposed DEBUG endpoints example",
  "API Key Leakage via Referer Headers example",
  "SSRF via File:// Protocol example",
  "Insecure Access to .env Files example",
  "Insecure Access to Backup Files (.bak) example",
  "Insecure Handling of .DS_Store Files example",
  "DNS Reverse Lookup Vulnerability example",                    // attack → vulnerability
  "Abusing HEAD Method example",
  "Cross-Site Request Forgery with Flash example",
  "POC to Vulnerabilty JSON Hijacking example",                 
  "POC to Vulnerabilty JSON Hijacking example",
  "Reverse Tabnabbing example",
  "Mousejacking Vulnerabilities example",                        // attacks → vulnerabilities
  "Physical Code Insertions: USB Drops example",                 
  "Physical Vulnerabilities: USB Drops example",
  "Rogue Charging Stations Vulnerabilities example",             // attacks → vulnerabilities
  "Browser Extension CSRF example",
  "DOM Clobbering Vulnerabilities example",                      // attacks → vulnerabilities
  "Mutation XSS example",
  "Insecure Filter Regex example",
  "Script Gadget Injection in Templates example",
  "Insecure Handling of Window.opener example",
  "Reflected File Download example",                             // already changed above
  "Pharming Vulnerability example",                              // attack → vulnerability
  "Man-in-the-Browser Vulnerability example",                    // attack → vulnerability
  "Drive-by Download Demonstrations example",                    // exploits → demonstrations
  "Insecure Content Security Policy example",
  "Insecure CORS Configuration example",
  "Unrestricted File Upload example",
  "Malicious Zip Bomb example",
  "Abusing Flaws in PDF Renderers example",
  "Abusing Flaws in OCR Tools example",
  "SVG Files as Code Vectors example",                           
  "SVG Files as Test Vectors example",
  "XSLT Server-Side Injection example",
  "SSRF via Headless Browser example",
  "Abusing Serverless Billing with Demonstration example",       // exploit → demonstration
  "Insecure SSRF via Cloud Functions example",
  "Lateral Movement via Compromised Instances example",
  "Abusing Code Comments for Injection example",
  "CSS Injection (exfiltrating data through CSS) example",
  "Data Exfiltration via Email Protocols example",
  "Insecure TLS Certificate Validation example",
  "Insecure Cipher Negotiation example",
  "Click Event Hijacking on Mobile example",
  "Compromising IoT Medical Devices example",
  "Attacks on Automotive CAN Bus → Vulnerabilities on Automotive CAN Bus example",
  "Vulnerabilities on Automotive CAN Bus example",
  "SCADA PLC Command Injection example",
  "Insecure BACnet Config example",
  "Fake Mobile App Updates example",
  "Demonstrations in Industrial Protocol Converters example",    // exploits → demonstrations
  "Drone/Robot Telemetry Injection example",
  "Rogue Firmware Updates example",
  "BleedingTooth Bluetooth Demonstration example",               // exploit → demonstration
  "WPS PIN Brute Force example",
  "Vulnerabilities on WPA3 (Dragonblood) example"                // attacks → vulnerabilities
];




const evasionTechniquesList = [
  "URL Encoding example",
  "Double URL Encoding example",
  "Base64 Encoding example",
  "Hex Encoding example",
  "HTML Entity Encoding example",
  "Case Variation example",
  "Mixed Case Evasion example",
  "UTF-8 Encoding example",
  "URL Parameter Pollution example",
  "Obfuscated JavaScript example",
  "Reverse String Encoding example",
  "Polyglot Codes example", // "Polyglot Payloads" → "Polyglot Codes"
  "Whitespace Obfuscation example",
  "Comment Insertion example",
  "String Concatenation example",
  "Character Padding example",
  "Null Byte Injection example",
  "Mixed Protocol Injection example",
  "Fake Parameter Injection example",
  "Redundant Path Segments example",
  "IP Address Obfuscation example",
  "Octal/Decimal IP Encoding example",
  "Reverse DNS Lookup example",
  "DNS CNAME Chaining example",
  "Long URL Obfuscation example",
  "Fragmentation of Code example", // "Fragmentation of Payload" → "Fragmentation of Code"
  "Excessive URL Length example",
  "Confusing Similar Characters example",
  "Homoglyph Vulnerabilities example", // "Homoglyph Attacks" → "Homoglyph Vulnerabilities"
  "Unicode Normalization Forms example",
  "Double Decoding example",
  "ROT13 Encoding example",
  "Quoted Printable Encoding example",
  "Ambiguous Grammar Injection example",
  "Fake Content-Type Headers example",
  "Fake Content-Length Headers example",
  "HTTP Verb Tunneling example",
  "Parameter Hiding in JSON example",
  "Parameter Hiding in XML example",
  "Base36/Base32 Encoding example",
  "Hexify ASCII Characters example",
  "Using Non-Standard Ports example",
  "Chunked Transfer Evasion example",
  "Multiple Encodings Combined example",
  "Command Spacing Evasion example",
  "Command Comments Evasion example",
  "Split Vulnerabilities into Two Requests example", 
  // "Split Attacks into Two Requests" → "Split Vulnerabilities into Two Requests"
  "URLEncode + Double Decode example",
  "Nested Encoded Codes example", // "Nested Encoded Payloads" → "Nested Encoded Codes"
  "Invisible Character Injection example",
  "Zero-Width Spaces Injection example",
  "Encoded Slashes in URL example",
  "Path Normalization Tricks example",
  "Double Compression Encoding example",
  "Demonstrating Browser Parsing Differences example", 
  // "Exploiting Browser Parsing Differences" → "Demonstrating Browser Parsing Differences"
  "Demonstration Scenario of Browser Parsing Differences example",
  "Case Randomization in Keywords example",
  "Macro-based Encoding example",
  "Hash-based Obfuscation example",
  "Leetspeak Substitution example",
  "Non-ASCII Homoglyph Replacement example",
  "Base85 Encoding example",
  "UTF-7 Encoding example",
  "Multibyte Character Confusion example",
  "Misleading File Extensions example",
  "JavaScript Unicode Escapes example",
  "IP Fragmentation Evasion example",
  "TLS Fingerprint Spoofing example",
  "HTTP Header Randomization example",
  "Duck Typing Codes example", // "Duck Typing Payloads" → "Duck Typing Codes"
  "Non-Printable Character Injection example",
  "Base91 Encoding example",
  "Base92 Encoding example",
  "Base122 Encoding example",
  "Emoji-based Encoding example",
  "Custom Hash-based Encoding example",
  "Compression + Encryption Hybrid example",
  "Encrypted Code Delivery via HTTPS example", 
  // "Encrypted Payload Delivery via HTTPS" → "Encrypted Code Delivery via HTTPS"
  "CDN-based Delivery Evasion example",
  "DOM Property Overwriting example",
  "Steganographic Codes in Images example", 
  // "Steganographic Payloads in Images" → "Steganographic Codes in Images"
  "Steganographic Codes in Audio example",
  "Steganographic Codes in Video example",
  "Chunked Encoding Mixup example",
  "Misleading Parameter Names example",
  "Relying on Browser Quirks example",
  "Escaping Through Double Quotes example",
  "Escaping Through Backticks example",
  "Triple Encoding example",
  "Recursive Encoding Loops example",
  "URL Path Confusion example",
  "Hiding Code in CSS Content example", 
  // "Hiding Payload in CSS Content" → "Hiding Code in CSS Content"
  "Data URI Schemes example",
  "RFC-Compliant but Unexpected Headers example",
  "Exotic Unicode Normalization example",
  "IDN Homograph Vulnerabilities example", 
  // "IDN Homograph Attacks" → "IDN Homograph Vulnerabilities"
  "Injecting Zero-Width Joiners example",
  "Zero-Width Non-Joiner Injection example",
  "Obfuscation via CSS Selectors example",
  "Malicious DOM Events example",
  "Shifting Code between GET and POST example", 
  // "Shifting Payload between GET and POST" → "Shifting Code between GET and POST"
  "Polyglot PDFs example",
  "Polyglot Images (JPEG + HTML) example",
  "Header Confusion with MIME Boundaries example",
  "Breaking Signatures with Extra Whitespace example",
  "Hiding Code in PDF Comments example", 
  // "Hiding Payload in PDF Comments" → "Hiding Code in PDF Comments"
  "Invisible iframes for Code Delivery example", 
  // "Payload Delivery" → "Code Delivery"
  "Hiding Code in DNS Queries example",
  "Hiding Code in NTP Traffic example",
  "Obfuscation via Morse Code example",
  "Obfuscation via Bacon's Cipher example",
  "Obfuscation with Braille Patterns example",
  "Confusing Whitespaces (Tabs vs Spaces) example",
  "Replacing Characters with Similar Unicode example",
  "Base58 Encoding example",
  "Base32hex Encoding example",
  "UUEncoding Codes example", 
  // "UUEncoding Payloads" → "UUEncoding Codes"
  "xxencoding Codes example", 
  // "xxencoding Payloads" → "xxencoding Codes"
  "yEncoding Codes example", 
  // "yEncoding Payloads" → "yEncoding Codes"
  "Quoted-Printable + Double URL Encoding example",
  "Invisible Div Layers example",
  "Multi-stage Code Delivery example", 
  // "Multi-stage Payload Delivery" → "Multi-stage Code Delivery"
  "Code in HTTP Trailer Fields example", 
  // "Payload in HTTP Trailer Fields" → "Code in HTTP Trailer Fields"
  "Confusing Content-Length with Transfer-Encoding example",
  "Malicious SVG Filters example",
  "Abusing XML Namespaces example",
  "Nested Iframes from Multiple Domains example",
  "Code Delivery via Flash Variables example", 
  // "Payload Delivery via Flash Variables" → "Code Delivery via Flash Variables"
  "Obfuscation via Redundant DNS lookups example",
  "Code in TLS Extensions example", 
  // "Payload in TLS Extensions" → "Code in TLS Extensions"
  "Abusing SSL Session Resumption example",
  "TLS Record Layer Obfuscation example",
  "Fragmenting JSON Codes example", 
  // "Fragmenting JSON Payloads" → "Fragmenting JSON Codes"
  "Obfuscation via HTML5 Polyfills example",
  "Data Smuggling in WebSockets example",
  "Binary-to-Text Shuffling example",
  "Obfuscation via RLE Encoding example",
  "Inserting Fake Unicode BOM example",
  "Escaping through Double Encoded Slashes example",
  "Redirection through multiple Shortened URLs example",
  "Abusing LFI for Evading Signatures example",
  "Using Alternate Data Streams (ADS) on Windows example",
  "Storing Code in Windows Registry example", 
  // "Storing Payload in Windows Registry" → "Storing Code in Windows Registry"
  "Command Obfuscation via PowerShell Aliases example",
  "Command Obfuscation in Bash using eval example",
  "Abusing WAF Whitelists example",
  "Modifying Case in Shell Commands example",
  "Inserting Line Feeds in Keywords example",
  "Combining CRLF with URL Encoding example",
  "Obfuscating SQL Code with Comments example", 
  // "Obfuscating SQL Payload with Comments" → "Obfuscating SQL Code with Comments"
  "Using Stored Procedures Instead of Raw SQL example",
  "Reordering SQL Keywords example",
  "Command Obfuscation via Environmental Variables example",
  "Encoding code in base64 multiple times example", 
  // "Encoding payload in base64 multiple times" → "Encoding code in base64 multiple times"
  "Chunked XSS Codes example", 
  // "Chunked XSS Payloads" → "Chunked XSS Codes"
  "Obfuscation via Excessive URL Parameters example",
  "Utilizing Browser Autocomplete example",
  "Utilizing Browser Bugs for Code Execution example", 
  // "Payload Execution" → "Code Execution"
  "Abusing Tab Characters in JSON example",
  "HTML Polyglot (HTML + JS) example",
  "XSS Code in SVG OnLoad example", 
  // "XSS Payload in SVG OnLoad" → "XSS Code in SVG OnLoad"
  "Open Redirect Chains example",
  "Stealth Code in DNS TXT Records example", 
  // "Stealth Payload in DNS TXT Records" → "Stealth Code in DNS TXT Records"
  "Header Injection via Non-ASCII separators example",
  "Padding Code with Zero-Length Chars example", 
  // "Padding Payload with Zero-Length Chars" → "Padding Code with Zero-Length Chars"
  "Abusing Proxy Configurations example",
  "Obfuscation with External Entity Injections example",
  "Hiding Code in Image EXIF example", 
  // "Hiding Payload in Image EXIF" → "Hiding Code in Image EXIF"
  "Hiding Code in PDF Metadata example",
  "Hiding Code in ZIP Comment example",
  "Inserting Code into ICC Profiles example", 
  // "Inserting Payload into ICC Profiles" → "Inserting Code into ICC Profiles"
  "Base104 Encoding (emoji, special chars) example",
  "Abusing Quoted Strings in HTTP example",
  "Misusing Cache-Control Headers example",
  "Encoding with punycode example",
  "Using Rare Encodings like EBCDIC example",
  "Inserting Code in Hostname parts example", 
  // "Inserting Payload in Hostname parts" → "Inserting Code in Hostname parts"
  "Using IPv6 short notation example",
  "Hex-encoded slashes for path evasion example",
  "UTF-16 Encoding example",
  "UTF-32 Encoding example",
  "Double Rotations (ROT13+ROT47) example",
  "Deflate then Base64 example",
  "Gzip then Hex example",
  "Chaining Multiple Compressors (Zlib, LZMA...) example",
  "Spacing Out Code with Non-breaking spaces example", 
  // "Spacing Out Payload with Non-breaking spaces" → "Spacing Out Code with Non-breaking spaces"
  "Zero-Breadth Joiners between Characters example",
  "Overlong UTF-8 sequences example",
  "Non-UTF encodings (Shift-JIS, Big5) example",
  "Inserting Code inside a harmless GIF example", 
  // "Inserting Payload inside a harmless GIF" → "Inserting Code inside a harmless GIF"
  "Hiding Code in WOFF font files example", 
  // "Hiding Payload in WOFF font files" → "Hiding Code in WOFF font files"
  "Renaming Parameters to look safe example",
  "Spelling Keywords Backwards example",
  "Splitting Vulnerability across multiple requests example", 
  // "Splitting Attack across multiple requests" → "Splitting Vulnerability across multiple requests"
  "Using PATH_INFO in URLs example",
  "Appending random query strings ignored by server example",
  "Hiding code in rarely used HTML tags example",
  "Obfuscating JavaScript code with arrays example", 
  // "Obfuscating JavaScript payload with arrays" → "Obfuscating JavaScript code with arrays"
  "Encoding JavaScript strings char by char example",
  "Mixing character sets example",
  "Reordering JSON keys to bypass signatures example",
  "Combining multiple small codes client-side example", 
  // "Combining multiple small payloads client-side" → "Combining multiple small codes client-side"
  "Inserting Code in CSS pseudo-selectors example", 
  // "Inserting Payload in CSS pseudo-selectors" → "Inserting Code in CSS pseudo-selectors"
  "Abusing CSS escapes for ASCII chars example",
  "Inserting Code in an XPI or CRX file example", 
  // "Inserting Payload in an XPI or CRX file" → "Inserting Code in an XPI or CRX file"
  "Using multipart/form-data cleverly example",
  "Abusing boundary strings in multipart requests example",
  "Code in Protocol Downgrade Demonstration example", 
  "Code in Protocol Downgrade Vulnerability example",
  "Code in WebDAV PROPFIND request example", 
  // "Payload in WebDAV PROPFIND request" → "Code in WebDAV PROPFIND request"
  "Abusing Range headers to evade scanning example",
  "Inserting Code in the ETag header example", 
  // "Inserting Payload in the ETag header" → "Inserting Code in the ETag header"
  "Misleading via overly long TTL in DNS example",
  "Injecting Code in OData queries example", 
  // "Injecting Payload in OData queries" → "Injecting Code in OData queries"
  "Smuggling Code in GraphQL Query Variables example", 
  // "Smuggling Payload in GraphQL Query Variables" → "Smuggling Code in GraphQL Query Variables"
  "Chained Encodings (Base64+URL+Hex) example",
  "Using obscure cipher methods example",
  "Encrypting code with a known key example", 
  // "Encrypting payload with a known key" → "Encrypting code with a known key"
  "Stenographically hiding code in whitespace patterns example", 
  // "Stenographically hiding payload in whitespace patterns" → "Stenographically hiding code in whitespace patterns"
  "Base32768 Encoding example",
  "Faux Cyrillic Substitution example",
  "Reordering code points in Unicode example",
  "Using confusable Unicode characters for keywords example",
  "Injecting Code in CSS calc() example", 
  // "Injecting Payload in CSS calc()" → "Injecting Code in CSS calc()"
  "Using CSS url() imports example",
  "Dynamic imports in JavaScript example",
  "Obfuscation via WebAssembly Encoded Code example", 
  // "Obfuscation via WebAssembly Encoded Payload" → "Obfuscation via WebAssembly Encoded Code"
  "Hosting Code on a Trusted CDN example", 
  // "Hosting Payload on a Trusted CDN" → "Hosting Code on a Trusted CDN"
  "Abusing Document.write() in HTML example",
  "Injecting code in Data Binding Expressions example", 
  // "Injecting payload in Data Binding Expressions" → "Injecting code in Data Binding Expressions"
  "Abusing user agent-based code paths example",
  "Obfuscation via delayed execution example",
  "Splitting strings into multiple variables and recombining example",
  "Requiring multiple conditions to trigger code example", 
  // "Requiring multiple conditions to trigger payload" → "Requiring multiple conditions to trigger code"
  "Breaking signatures by inserting random tokens example",
  "Inserting Null bytes in keywords example",
  "Encoding code in base45 example", 
  // "Encoding payload in base45" → "Encoding code in base45"
  "Encoding code in base62 example", 
  // "Encoding payload in base62" → "Encoding code in base62"
  "Abusing JSONP call to fetch code example", 
  // "Abusing JSONP call to fetch payload" → "Abusing JSONP call to fetch code"
  "Timing-based delivery (only after delay) example",
  "Fragmenting Code across DNS queries example", 
  // "Fragmenting Payload across DNS queries" → "Fragmenting Code across DNS queries"
  "Inserting Non-Latin alphabets that look similar example",
  "Switching between GET and POST randomly example",
  "Faking known safe parameters to distract WAF example",
  "Using a known good domain as decoy example",
  "Abusing template engines for code injection example",
  "Inserting code in JWT kid field and forging signature example", 
  // "Inserting payload in JWT kid field and forging signature" → "Inserting code in JWT kid field and forging signature"
  "Chaining multiple WAF bypass techniques example",
  "Misreporting Content-Length to confuse parsers example",
  "Sending partial code in HEAD then finishing in GET example", 
  // "Sending partial payload in HEAD then finishing in GET" → "Sending partial code in HEAD then finishing in GET"
  "Combining upper/lower case at random example",
  "Abusing chunk extensions in HTTP/1.1 example",
  "Encoding commands inside environment variables example",
  "Using a proxy hop to re-encode code example", 
  // "Using a proxy hop to re-encode payload" → "Using a proxy hop to re-encode code"
  "Inserting code in XLSX metadata example", 
  // "Inserting payload in XLSX metadata" → "Inserting code in XLSX metadata"
  "Inserting code in docx metadata example",
  "Inserting code in rar comments example",
  "Encoding code as Morse code then decoding client-side example", 
  // "Encoding payload as Morse code then decoding client-side" → "Encoding code as Morse code then decoding client-side"
  "Utilizing EICAR test string as a decoy example",
  "Inlining JavaScript in unusual HTML attributes example",
  "UTF-7 encoded XSS code example", 
  // "UTF-7 encoded XSS payload" → "UTF-7 encoded XSS code"
  "Custom Base conversion (Base100 ASCII codes) example",
  "Inserting code in CSS keyframes example", 
  // "Inserting payload in CSS keyframes" → "Inserting code in CSS keyframes"
  "Padding code with random unicode emoticons example", 
  // "Padding payload with random unicode emoticons" → "Padding code with random unicode emoticons"
  "Decomposing words into char codes and reassembling example",
  "Aliasing dangerous functions to safe names example",
  "Redefining built-in functions at runtime example",
  "Hiding code in user-supplied language translations example", 
  // "Hiding payload in user-supplied language translations" → "Hiding code in user-supplied language translations"
  "Abusing password fields to store code example", 
  // "Abusing password fields to store payload" → "Abusing password fields to store code"
  "Injecting code into logs and re-reading them example", 
  // "Injecting payload into logs and re-reading them" → "Injecting code into logs and re-reading them"
  "HTTP Method Override (X-HTTP-Method-Override) example",
  "Inserting commands in SSH banners example",
  "LZMA compression then hex encoding example",
  "Zstandard compression + base64 example",
  "Inserting code in a TLS SNI field example", 
  // "Inserting payload in a TLS SNI field" → "Inserting code in a TLS SNI field"
  "Confusing analyzers with overly long domain names example",
  "Using parent directory references to appear harmless example",
  "Storing code in DNS CAA records example", 
  // "Storing payload in DNS CAA records" → "Storing code in DNS CAA records"
  "Encoding code in IPv6 literal example", 
  // "Encoding payload in IPv6 literal" → "Encoding code in IPv6 literal"
  "Hiding code in data:application/octet-stream URL example", 
  // "Hiding payload in data:application/octet-stream URL" → "Hiding code in data:application/octet-stream URL"
  "Demonstration scenario of differences in URL parsing client/server example", 
  // "Exploiting differences in URL parsing client/server" → "Demonstration scenario of differences in URL parsing client/server"
  "Inserting code in a JSON array expecting object example", 
  // "Inserting payload in a JSON array expecting object" → "Inserting code in a JSON array expecting object"
  "Misleading WAF by using multiple Host headers example",
  "Inserting Code in Accept-Language header example", 
  // "Inserting Payload in Accept-Language header" → "Inserting Code in Accept-Language header"
  "Leveraging incomplete UTF-8 sequences example",
  "Breaking code into multiple code points that combine example", 
  // "Breaking payload into multiple code points that combine" → "Breaking code into multiple code points that combine"
  "Base122 encoding with obscure alphabets example",
  "Inserting code in a CSS animation name example", 
  // "Inserting payload in a CSS animation name" → "Inserting code in a CSS animation name"
  "Double Gzip encoding example",
  "Using HTML entities for all characters example",
  "Substitute chars with fullwidth forms example",
  "Inserting control characters like BEL or BS example",
  "Pausing code execution until certain time example" 
  // "Pausing code execution until certain time" already no forbidden words, just add " example"
];


function Home() {
  const [vulnerability, setVulnerability] = useState("");
  const [evasionTechnique, setEvasionTechnique] = useState("");
  const [payload, setPayload] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);

    socket.on('payload_response', (data) => {
      setPayload(data.payload);
      setLoading(false);
    });

    socket.on('error', (data) => {
      alert(`Error: ${data.error}`);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleGeneratePayload = () => {
    if (vulnerability && evasionTechnique) {
      setLoading(true);

      fetch(`${ENDPOINT}/payload/generate_payload`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          vulnerability: vulnerability,
          evasion_technique: evasionTechnique,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.payload) {
            if (data.payload.trim().startsWith("I'm sorry, I can't assist with that request.")) {
              setPayload("It looks like openai is facing some ethical problems lol, please try again with different exploits/evasion techniques and/or refresh the page. If the issue persists please notify me at CarterPerez@ProxyAuthRequired.com and I will fix it as soon as possible. Thanks!");
            } else {
              setPayload(data.payload);
            }
          } else if (data.error) {
            alert(`Error: ${data.error}`);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error:', error);
          alert('Failed to connect to the backend server. Please check the server connection.');
          setLoading(false);
        });
    } else {
      alert("Please enter both vulnerability and evasion technique");
    }
  };

  const handleCopyClick = () => {
    if (payload) {
      navigator.clipboard.writeText(payload)
        .then(() => {
          console.log('Payload copied to clipboard.');
        })
        .catch(err => console.error('Could not copy payload:', err));
    }
  };


  return (
    <header className="App-header">
      <img src={logo} className="App-logo" alt="logo" />
      <h1 className="header-title">XploitCraft </h1>

      <div className="input-container-horizontal">
        <input
          type="text"
          placeholder="Enter Vulnerability or Xploit"
          value={vulnerability}
          onChange={(e) => setVulnerability(e.target.value)}
          className="input-field"
          list="vulnerability-list"
        />
        <datalist id="vulnerability-list">
          {vulnerabilitiesList.map((vuln, index) => (
            <option key={index} value={vuln} />
          ))}
        </datalist>

        <input
          type="text"
          placeholder="Enter Evasion Technique or Delivery Method"
          value={evasionTechnique}
          onChange={(e) => setEvasionTechnique(e.target.value)}
          className="input-field"
          list="evasion-list"
        />
        <datalist id="evasion-list">
          {evasionTechniquesList.map((tech, index) => (
            <option key={index} value={tech} />
          ))}
        </datalist>
      </div>

      <div className="button-container">
        <button onClick={handleGeneratePayload} className="generate-button">
          Generate Payload
        </button>
        {loading && (
          <img src={loadingIcon} alt="Loading..." className="loading-icon" />
        )}
      </div>

      {payload && (
        <div className="payload-wrapper">
          <button className="copy-button-payload" onClick={handleCopyClick}>Copy</button>
          <h2 className="generated-payload-title">Generated Payload</h2>
          <div className="payload-content">
            <SyntaxHighlighter
              language="python"
              style={gruvboxDark}
              customStyle={{
                whiteSpace: 'pre-wrap',
                overflowWrap: 'break-word',
                wordBreak: 'break-all',
                lineHeight: '1.00',
                width: '100%',
                tabSize: '4',
              }}
            >
              {payload}
            </SyntaxHighlighter>
          </div>
        </div>
      )}
    </header>
  );
}

export default Home;

