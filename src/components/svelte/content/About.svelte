<script>
  import { onMount } from 'svelte';
  
  let focusElement;
  let techElement;
  let focusIndex = 0;
  let techIndex = 0;
  let focusText = '';
  let techText = '';
  let isTyping = false;
  let isFocusHovered = false;
  let isTechHovered = false;
  
  const focusItems = [
    // Prim
    "Penetration Testing",
    "Red Team Operations", 
    "Network Security",
    // spec
    "Mobile Security Testing",
    "API Security Assessment",
    "Social Engineering",
    "OSINT & Threat Intelligence",
    // Niche 
    "A2P SMS Fraud Prevention",
    "SIM Box Fraud Detection",
    "SIM Swap Prevention",
    "Grey Routes",
    "Telecom Security Testing",
    "IoT Security Assessment"
  ];
  
  const techItems = [
    // Recon & OSINT
    "Shodan",
    "Maltego", 
    "Recon-ng",
    "Amass",
    "Nmap",
    // Exploitation
    "Metasploit",
    "Burp",
    "OWASP ZAP",
    "SQLMap",
    "Nuclei",
    "BeEF",
    "Cobalt Strike",
    // Network
    "Wireshark",
    "Netcat",
    "RustScan",
    "FFuf",
    // Forensics
    "Volatility",
    "BloodHound",
    "Hashcat",
    "Mimikatz",
    "Splunk",
    "QRadar",
    "Elastic",
    // InfrasDevOps
    "Docker",
    "Jenkins",
    "Git / GitHub",
    // Programmin
    "Python",
    "Bash",
    "PowerShell",
    // Security
    "Nessus",
    "OpenVAS",
    "Snyk",
    // Linux
    "Kali",
    "Black Arch",
    "Parrot"
  ];
  
  // groups
  const focusBlocks = [
    focusItems.slice(0, 3),    // Prim
    focusItems.slice(3, 7),    // Spec
    focusItems.slice(7, 13)    // Niche
  ];
  
  const techBlocks = [
    techItems.slice(0, 5),     // Recon & OSINT
    techItems.slice(5, 12),    // Exploit
    techItems.slice(12, 16),   // Network
    techItems.slice(16, 23),   // Forensics
    techItems.slice(23, 26),   // Infrastructure DevOps
    techItems.slice(26, 29),   // Programming 
    techItems.slice(29, 32),   // Security 
    techItems.slice(32, 35)    // Linux 
  ];
  
  async function typeText(text, element, speed = 50) {
    isTyping = true;
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
      // Check if hovered and pause if so
      if ((element === focusElement && isFocusHovered) || 
          (element === techElement && isTechHovered)) {
        await new Promise(resolve => {
          const checkHover = () => {
            if ((element === focusElement && !isFocusHovered) || 
                (element === techElement && !isTechHovered)) {
              resolve();
            } else {
              setTimeout(checkHover, 100);
            }
          };
          checkHover();
        });
      }
      
      element.textContent += text[i];
      await new Promise(resolve => setTimeout(resolve, speed));
    }
    
    isTyping = false;
  }
  
  async function animateFocus() {
    while (true) {
      for (let block of focusBlocks) {
        const blockText = block.join(', ');
        await typeText(blockText, focusElement, 30);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  async function animateTech() {
    while (true) {
      for (let block of techBlocks) {
        const blockText = block.join(', ');
        await typeText(blockText, techElement, 30);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }
  }
  
  // Email corruption effect
  let emailElement;
  let corruptionInterval;
  
  // Corruption characters
  const corruptionChars = ['X', 'Y', 'Z', '[', ']', '{', '}', '@', '#', '$', '%', '&', '*', '!', '?', '~', '^', '|', '\\', '/', '+', '=', '<', '>', ';', ':', '"', "'", '`'];
  
  function startEmailCorruption() {
    if (!emailElement) return;
    
    const originalText = emailElement.getAttribute('data-original');
    
    corruptionInterval = setInterval(() => {
      // Corrupt 3-6 characters for more visible effect
      const numToCorrupt = Math.floor(Math.random() * 4) + 3;
      const positions = [];
      
      // Get random positions
      for (let i = 0; i < numToCorrupt; i++) {
        const pos = Math.floor(Math.random() * originalText.length);
        if (!positions.includes(pos)) {
          positions.push(pos);
        }
      }
      
      // Create corrupted version
      const corruptedText = originalText.split('');
      positions.forEach(pos => {
        const randomChar = corruptionChars[Math.floor(Math.random() * corruptionChars.length)];
        corruptedText[pos] = randomChar;
      });
      
      emailElement.textContent = corruptedText.join('');
      
      // Reset after a longer delay for more visibility
      setTimeout(() => {
        emailElement.textContent = originalText;
      }, 500);
      
    }, 2000); // Corrupt every 2 seconds
  }
  
  function stopEmailCorruption() {
    if (corruptionInterval) {
      clearInterval(corruptionInterval);
      if (emailElement) {
        emailElement.textContent = emailElement.getAttribute('data-original');
      }
    }
  }
  
  onMount(() => {
    if (focusElement) animateFocus();
    if (techElement) animateTech();
    
    // Start email corruption after a delay
    setTimeout(() => {
      emailElement = document.querySelector('.corrupted-email');
      if (emailElement) {
        startEmailCorruption();
      } else {
        // Try again after a bit more delay
        setTimeout(() => {
          emailElement = document.querySelector('.corrupted-email');
          if (emailElement) {
            startEmailCorruption();
          }
        }, 1000);
      }
    }, 2000);
    
    return () => {
      stopEmailCorruption();
    };
  });
</script>

<div class="about-content">
  <header class="page-header">
    <h1 class="visually-hidden">Perseus Portfolio</h1>
  </header>

  <div class="intro-text">
    <p>Welcome to my page!</p>
    <p>I made this as a fun little side project to serve as a home for all my personal projects, writeups, and other things I find interesting... if I ever get the time to actually run it properly</p>
    <p>I'm a self-taught cybersecurity enthusiast who enjoys tackling CTFs, exploring real-world attack techniques, and building tools to understand system vulnerabilities. I love hands-on practice through labs, documenting my discoveries, and working on personal projects.</p>
  </div>

  <div id="json">
    <div class="my ms">
      "<span class="key">Name</span>":
      "<span class="value">Perseus</span>",
    </div>
    
    <div class="my ms">
      "<span class="key">Focus</span>":
      "<span class="value typing-section" 
            bind:this={focusElement}
            on:mouseenter={() => isFocusHovered = true}
            on:mouseleave={() => isFocusHovered = false}
            on:keydown={(e) => e.key === 'Enter' && (isFocusHovered = !isFocusHovered)}
            class:typing={isTyping && !isFocusHovered}
            class:paused={isFocusHovered}
            role="button"
            tabindex="0"
            aria-label="Focus area - press Enter or hover to pause typing animation"></span>",
    </div>
    
    <div class="my ms">
      "<span class="key">Location</span>":
      "<span class="value">Remote | Global</span>",
    </div>
    
    <div class="my ms">
      "<span class="key">Tech</span>":
      "<span class="value typing-section" 
            bind:this={techElement}
            on:mouseenter={() => isTechHovered = true}
            on:mouseleave={() => isTechHovered = false}
            on:keydown={(e) => e.key === 'Enter' && (isTechHovered = !isTechHovered)}
            class:typing={isTyping && !isTechHovered}
            class:paused={isTechHovered}
            role="button"
            tabindex="0"
            aria-label="Tech stack area - press Enter or hover to pause typing animation"></span>",
    </div>
    
    <div class="my ms">
      "<span class="key">Contact</span>": [
      <p class="ms">
        "<span class="key">Email</span>":
        "<a class="value obfuscated-email corrupted-email" href="mailto:p3rseus@mailbox.org" target="_self" data-original="p3rseus[at]mailbox[dot]org">p3rseus[at]mailbox[dot]org</a>",
      </p>
      <p class="ms">
        "<span class="key">GitHub</span>":
        "<a class="value" href="https://github.com/perseusmx" target="_self">github.com/perseusmx</a>",
      </p>
      <p class="ms">
        "<span class="key">TryHackMe</span>":
        "<a class="value" href="https://tryhackme.com/p/perseus5" target="_self">tryhackme.com/p/perseus5</a>"
      </p>
      ]
    </div>
  </div>
</div>

<style>
  .about-content {
    padding: 20px;
    font-family: 'VT323', monospace;
    line-height: 1.6;
  }
  
  .intro-text {
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--border-color);
  }
  
  .intro-text p {
    margin: 10px 0;
    color: var(--font-color);
  }
  
  .intro-text p:first-child {
    font-size: 1.2em;
    font-weight: bold;
    margin-bottom: 15px;
  }
  
  .visually-hidden {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
  
  #json {
    font-family: 'VT323', monospace;
    color: var(--font-color);
  }
  
  .my {
    margin: 8px 0;
  }
  
  .ms {
    margin-left: 20px;
  }
  
  .key {
    color: #d63384;
    font-weight: bold;
    transition: color 0.3s ease;
  }
  
  .value {
    color: #0d6efd;
    transition: color 0.3s ease;
  }
  
  :global(.dark-theme) .key {
    color: #ff6b6b;
  }
  
  :global(.dark-theme) .value {
    color: #4ecdc4;
  }
  
  .typing-section {
    position: relative;
    cursor: pointer;
  }
  
  .typing-section.typing {
    color: #fd7e14;
    text-shadow: 0 0 5px rgba(253, 126, 20, 0.5);
  }
  
  .typing-section.paused {
    color: #d63384;
    text-shadow: 0 0 5px rgba(214, 51, 132, 0.5);
  }
  
  :global(.dark-theme) .typing-section.typing {
    color: #ffd700;
    text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
  }
  
  :global(.dark-theme) .typing-section.paused {
    color: #ff6b6b;
    text-shadow: 0 0 5px rgba(255, 107, 107, 0.5);
  }
  
  .typing-section:hover {
    transform: scale(1.02);
  }
  
  .typing-section.typing::after {
    content: '|';
    animation: blink 1s infinite;
    color: #fd7e14;
  }
  
  .typing-section.paused::after {
    content: '⏸';
    color: #d63384;
    margin-left: 2px;
  }
  
  :global(.dark-theme) .typing-section.typing::after {
    color: #ffd700;
  }
  
  :global(.dark-theme) .typing-section.paused::after {
    color: #ff6b6b;
  }
  
  @keyframes blink {
    0%, 50% { opacity: 1; }
    51%, 100% { opacity: 0; }
  }
  
  .obfuscated-email {
    text-decoration: none;
    color: #0d6efd;
    transition: color 0.3s ease;
  }
  
  .obfuscated-email:hover {
    text-decoration: underline;
  }
  
  a.value {
    text-decoration: none;
    color: #0d6efd;
    transition: color 0.3s ease;
  }
  
  a.value:hover {
    text-decoration: underline;
  }
  
  :global(.dark-theme) .obfuscated-email,
  :global(.dark-theme) a.value {
    color: #4ecdc4;
  }
  
  p.ms {
    margin: 5px 0;
  }
  
  .corrupted-email {
    transition: color 0.1s ease;
  }
</style> 