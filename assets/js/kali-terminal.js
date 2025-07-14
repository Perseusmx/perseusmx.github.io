// The Kali Linux terminal simulation

class RetroTerminal {
  constructor() {
    this.commandHistory = [];
    this.historyIndex = -1;
    this.currentDirectory = '/root';
    this.isTerminalReady = false;
    this.isBooted = false;
    this.achievements = new Set();
    this.konamiCode = [];
    this.konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    
    // Get the HTML elements we need
    this.terminalOutput = document.querySelector('.terminal-content');
    this.terminalInput = document.querySelector('.input-field');
    this.prompt = document.querySelector('.terminal-input .prompt');
    
    // Set up the terminal
    this.init();
  }
  
  init() {
    // Show the boot sequence first
    this.bootSequence();
    
    // Set up all the event handlers
    this.setupEventListeners();
    
    // Show the welcome message after boot
    setTimeout(() => {
      this.printWelcome();
    }, 8000);
  }
  
  bootSequence() {
    const kaliMonitor = document.querySelector('.kali-monitor');
    if (!kaliMonitor) return;
    
    // Clear everything and add the input field back
    if (this.terminalOutput) {
      this.terminalOutput.innerHTML = '';
      
      // Put the input field back
      const inputField = document.createElement('div');
      inputField.className = 'terminal-input';
      inputField.innerHTML = `
        <span class="prompt">root@kali:~#</span>
        <input type="text" class="input-field" placeholder="Type a command..." autocomplete="off">
        <span class="cursor"></span>
      `;
      this.terminalOutput.appendChild(inputField);
      
      // Remember the new input field
      this.terminalInput = inputField.querySelector('.input-field');
      this.prompt = inputField.querySelector('.prompt');
    }
    
    // Show the boot messages
    const bootMessages = [
      'BIOS Version 2.0.1',
      'Checking system integrity...',
      'Loading kernel modules...',
      'Initializing network interfaces...',
      'Starting system services...',
      'Loading penetration testing tools...',
      'Initializing security frameworks...',
      'Starting Kali Linux services...',
      'System boot complete.',
      'Welcome to Kali Linux 2024.1'
    ];
    
    this.simulateBootSequence(bootMessages);
    
    setTimeout(() => {
      this.isBooted = true;
      this.isTerminalReady = true;
    }, 7000);
  }
  
  simulateBootSequence(bootMessages) {
    bootMessages.forEach((text, index) => {
      setTimeout(() => {
        this.addOutputLine(text, 'boot');
      }, index * 400);
    });
  }
  
  setupEventListeners() {
    if (!this.terminalInput) return;
    
    this.terminalInput.addEventListener('keydown', (e) => {
      // Check for the Konami code
      this.detectKonamiCode(e.code);
      
      if (e.key === 'Enter') {
        if (!this.isTerminalReady) return;
        this.executeCommand(e.target.value);
        e.target.value = '';
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.isTerminalReady) {
          this.navigateHistory('up');
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.isTerminalReady) {
          this.navigateHistory('down');
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        if (this.isTerminalReady) {
          this.tabCompletion(e.target.value);
        }
      }
    });
    
    // Click anywhere to focus the input
    this.terminalOutput?.addEventListener('click', () => {
      this.terminalInput?.focus();
    });
    
    // Focus the input when the terminal is ready
    setTimeout(() => {
      this.terminalInput?.focus();
    }, 8500);
  }
  
  executeCommand(command) {
    if (!command.trim()) return;
    
    // Remember this command
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;
    
    // Show the command that was typed
    this.addOutputLine(`root@kali:~# ${command}`, 'command');
    
    // Check if they've earned any achievements
    if (this.commandHistory.length === 10 && !this.achievements.has('command_learner')) {
      this.achievements.add('command_learner');
      this.showAchievement('Command Learner');
    } else if (this.commandHistory.length === 25 && !this.achievements.has('command_master')) {
      this.achievements.add('command_master');
      this.showAchievement('Command Master');
    } else if (this.commandHistory.length === 50 && !this.achievements.has('terminal_expert')) {
      this.achievements.add('terminal_expert');
      this.showAchievement('Terminal Expert');
    }
    
    // Figure out what command they want to run
    const cmd = command.trim().toLowerCase();
    const args = command.split(' ').slice(1);
    
    switch (cmd.split(' ')[0]) {
      case 'help':
        if (args[0]) {
          this.showCommandHelp(args[0]);
        } else {
          this.showHelp();
        }
        if (!this.achievements.has('help_seeker')) {
          this.achievements.add('help_seeker');
          this.showAchievement('Help Seeker');
        }
        break;
      case 'ls':
        this.listFiles(args);
        if (!this.achievements.has('file_explorer')) {
          this.achievements.add('file_explorer');
          this.showAchievement('File Explorer');
        }
        break;
      case 'cat':
        this.catFile(args);
        break;
      case 'cd':
        this.changeDirectory(args);
        break;
      case 'pwd':
        this.printWorkingDirectory();
        break;
      case 'whoami':
        this.whoAmI();
        break;
      case 'nmap':
        this.interactiveNmap(args);
        if (!this.achievements.has('network_scanner')) {
          this.achievements.add('network_scanner');
          this.showAchievement('Network Scanner');
        }
        break;
      case 'clear':
        this.clearTerminal();
        break;
      case 'date':
        this.showDate();
        break;
      case 'uptime':
        this.showUptime();
        break;
      case 'neofetch':
        this.neofetch();
        break;
      case 'sudo':
        this.sudoCommand(args);
        break;
      case 'ping':
        this.pingCommand(args);
        if (!this.achievements.has('network_tester')) {
          this.achievements.add('network_tester');
          this.showAchievement('Network Tester');
        }
        break;
      case 'top':
        this.topCommand();
        if (!this.achievements.has('process_monitor')) {
          this.achievements.add('process_monitor');
          this.showAchievement('Process Monitor');
        }
        break;
      case 'htop':
        this.htopCommand();
        if (!this.achievements.has('advanced_monitor')) {
          this.achievements.add('advanced_monitor');
          this.showAchievement('Advanced Monitor');
        }
        break;
      case 'hashcat':
        this.hashcatCommand(args);
        if (!this.achievements.has('password_cracker')) {
          this.achievements.add('password_cracker');
          this.showAchievement('Password Cracker');
        }
        break;
      case 'hydra':
        this.hydraCommand(args);
        if (!this.achievements.has('brute_forcer')) {
          this.achievements.add('brute_forcer');
          this.showAchievement('Brute Forcer');
        }
        break;
      case 'sqlmap':
        this.sqlmapCommand(args);
        if (!this.achievements.has('sql_injector')) {
          this.achievements.add('sql_injector');
          this.showAchievement('SQL Injector');
        }
        break;
      case 'metasploit':
        this.metasploitCommand(args);
        if (!this.achievements.has('exploit_framework')) {
          this.achievements.add('exploit_framework');
          this.showAchievement('Exploit Framework');
        }
        break;
      case 'aircrack-ng':
        this.aircrackCommand(args);
        if (!this.achievements.has('wireless_hacker')) {
          this.achievements.add('wireless_hacker');
          this.showAchievement('Wireless Hacker');
        }
        break;
      case 'john':
        this.johnCommand(args);
        if (!this.achievements.has('john_ripper')) {
          this.achievements.add('john_ripper');
          this.showAchievement('John the Ripper');
        }
        break;
      case 'wireshark':
        this.wiresharkCommand(args);
        if (!this.achievements.has('packet_analyzer')) {
          this.achievements.add('packet_analyzer');
          this.showAchievement('Packet Analyzer');
        }
        break;
      case 'tcpdump':
        this.tcpdumpCommand(args);
        if (!this.achievements.has('packet_capturer')) {
          this.achievements.add('packet_capturer');
          this.showAchievement('Packet Capturer');
        }
        break;
      case 'netstat':
        this.netstatCommand(args);
        if (!this.achievements.has('network_analyzer')) {
          this.achievements.add('network_analyzer');
          this.showAchievement('Network Analyzer');
        }
        break;
      case 'ps':
        this.psCommand(args);
        if (!this.achievements.has('process_lister')) {
          this.achievements.add('process_lister');
          this.showAchievement('Process Lister');
        }
        break;
      case 'kill':
        this.killCommand(args);
        if (!this.achievements.has('process_killer')) {
          this.achievements.add('process_killer');
          this.showAchievement('Process Killer');
        }
        break;
      case 'chmod':
        this.chmodCommand(args);
        if (!this.achievements.has('permission_manager')) {
          this.achievements.add('permission_manager');
          this.showAchievement('Permission Manager');
        }
        break;
      case 'chown':
        this.chownCommand(args);
        if (!this.achievements.has('ownership_manager')) {
          this.achievements.add('ownership_manager');
          this.showAchievement('Ownership Manager');
        }
        break;
      case 'find':
        this.findCommand(args);
        if (!this.achievements.has('file_finder')) {
          this.achievements.add('file_finder');
          this.showAchievement('File Finder');
        }
        break;
      case 'grep':
        this.grepCommand(args);
        if (!this.achievements.has('pattern_searcher')) {
          this.achievements.add('pattern_searcher');
          this.showAchievement('Pattern Searcher');
        }
        break;
      case 'ssh':
        this.sshCommand(args);
        if (!this.achievements.has('secure_shell')) {
          this.achievements.add('secure_shell');
          this.showAchievement('Secure Shell');
        }
        break;
      case 'scp':
        this.scpCommand(args);
        if (!this.achievements.has('secure_copy')) {
          this.achievements.add('secure_copy');
          this.showAchievement('Secure Copy');
        }
        break;
      case 'wget':
        this.wgetCommand(args);
        if (!this.achievements.has('web_downloader')) {
          this.achievements.add('web_downloader');
          this.showAchievement('Web Downloader');
        }
        break;
      case 'curl':
        this.curlCommand(args);
        if (!this.achievements.has('data_transfer')) {
          this.achievements.add('data_transfer');
          this.showAchievement('Data Transfer');
        }
        break;
      case 'dig':
        this.digCommand(args);
        if (!this.achievements.has('dns_lookup')) {
          this.achievements.add('dns_lookup');
          this.showAchievement('DNS Lookup');
        }
        break;
      case 'nslookup':
        this.nslookupCommand(args);
        if (!this.achievements.has('dns_query')) {
          this.achievements.add('dns_query');
          this.showAchievement('DNS Query');
        }
        break;
      case 'traceroute':
        this.tracerouteCommand(args);
        if (!this.achievements.has('path_tracer')) {
          this.achievements.add('path_tracer');
          this.showAchievement('Path Tracer');
        }
        break;
      case 'ifconfig':
        this.ifconfigCommand();
        if (!this.achievements.has('network_config')) {
          this.achievements.add('network_config');
          this.showAchievement('Network Config');
        }
        break;
      case 'ip':
        this.ipCommand(args);
        if (!this.achievements.has('ip_manager')) {
          this.achievements.add('ip_manager');
          this.showAchievement('IP Manager');
        }
        break;
      case 'route':
        this.routeCommand();
        if (!this.achievements.has('routing_table')) {
          this.achievements.add('routing_table');
          this.showAchievement('Routing Table');
        }
        break;
      case 'arp':
        this.arpCommand();
        if (!this.achievements.has('arp_cache')) {
          this.achievements.add('arp_cache');
          this.showAchievement('ARP Cache');
        }
        break;
      case 'exit':
        this.exitTerminal();
        break;
      default:
        this.commandNotFound(cmd);
    }
  }
  
  addOutputLine(text, type = 'output') {
    if (!this.terminalOutput) return;
    
    const line = document.createElement('div');
    line.className = `output-line ${type}`;
    line.textContent = text;
    
    // Always append to the end, before any input field
    this.terminalOutput.appendChild(line);
    
    // Ensure input field stays at the bottom
    const inputField = this.terminalOutput.querySelector('.terminal-input');
    if (inputField) {
      this.terminalOutput.appendChild(inputField);
    }
    
    this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
    
    // Add typing effect
    this.typeEffect(line, text);
  }
  
  typeEffect(element, text) {
    element.textContent = '';
    let i = 0;
    
    const typeInterval = setInterval(() => {
      element.textContent += text.charAt(i);
      i++;
      
      if (i >= text.length) {
        clearInterval(typeInterval);
      }
    }, 10);
  }
  
  navigateHistory(direction) {
    if (this.commandHistory.length === 0) return;
    
    if (direction === 'up') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
      }
    } else {
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex++;
      } else {
        this.historyIndex = this.commandHistory.length;
      }
    }
    
    if (this.historyIndex < this.commandHistory.length) {
      this.terminalInput.value = this.commandHistory[this.historyIndex];
    } else {
      this.terminalInput.value = '';
    }
  }
  
  printWelcome() {
    const welcome = [
      '',
      'Welcome to Perseus Terminal v1.0',
      'Type "help" for available commands',
      'Type "exit" to return to normal browsing',
      ''
    ];
    
    welcome.forEach((line, index) => {
      setTimeout(() => {
        this.addOutputLine(line, 'welcome');
      }, index * 200);
    });
    
    this.isTerminalReady = true;
  }
  
  showHelp() {
    const help = [
      '╔══════════════════════════════════════════════════════════════╗',
      '║                    KALI TERMINAL HELP                        ║',
      '╚══════════════════════════════════════════════════════════════╝',
      '',
      'FILE & DIRECTORY MANAGEMENT:',
      '  ls       - List files and directories',
      '  cat      - Display file contents',
      '  cd       - Change directory',
      '  pwd      - Print working directory',
      '  find     - Find files',
      '  grep     - Search text patterns',
      '  chmod    - Change file permissions',
      '  chown    - Change file ownership',
      '',
      'NETWORK & SECURITY TOOLS:',
      '  nmap     - Interactive network scanner',
      '  ping     - Test network connectivity',
      '  ssh      - Secure shell connection',
      '  scp      - Secure file copy',
      '  wget     - Download files',
      '  curl     - Transfer data',
      '  dig      - DNS lookup',
      '  nslookup - DNS query',
      '  traceroute - Network path tracing',
      '  netstat  - Network statistics',
      '  ifconfig - Network interface config',
      '  ip       - IP routing',
      '  route    - Routing table',
      '  arp      - ARP cache',
      '  tcpdump  - Packet capture',
      '  wireshark - Network analyzer',
      '',
      'SYSTEM & PROCESS MANAGEMENT:',
      '  whoami   - Show current user',
      '  top      - System processes (live)',
      '  htop     - Interactive process viewer',
      '  ps       - Process status',
      '  kill     - Terminate processes',
      '  date     - Show current date/time',
      '  uptime   - Show system uptime',
      '  neofetch - System information',
      '',
      'PENETRATION TESTING TOOLS:',
      '  hashcat  - Password cracking (interactive demo)',
      '  hydra    - Brute force attacks',
      '  sqlmap   - SQL injection scanner',
      '  metasploit - Exploitation framework',
      '  aircrack-ng - Wireless security',
      '  john     - Password cracker',
      '',
      'SYSTEM COMMANDS:',
      '  clear    - Clear terminal',
      '  sudo     - Execute as superuser',
      '  exit     - Exit terminal',
      '  help     - Show this help',
      '',
      'EASTER EGGS & FUN:',
      '  Try the Konami Code (↑↑↓↓←→←→BA)',
      '  sudo rm -rf / (spoiler: it won\'t work)',
      '  cat /etc/passwd',
      '  ping google.com',
      '',
      'USEFUL TIPS:',
      '  • Use Tab for command completion with descriptions',
      '  • Use ↑/↓ arrow keys for command history',
      '  • Some commands have interactive demos!',
      '  • Type "help <command>" for specific help',
      '  • Commands are case-sensitive',
      '',
      'INTERACTIVE FEATURES:',
      '  • Realistic command outputs',
      '  • Command suggestions on Tab',
      '  • Achievement system',
      '  • Boot sequence simulation',
      '  • Process monitoring (top/htop)',
      '  • Network scanning (nmap)',
      '  • Password cracking demo (hashcat)',
      '',
      'Type "help <command>" for detailed information about a specific command.'
    ];
    
    help.forEach(line => {
      this.addOutputLine(line, 'help');
    });
  }
  
  listFiles(args) {
    const files = [
      'Desktop/',
      'Documents/',
      'Downloads/',
      'Pictures/',
      'Videos/',
      'Music/',
      'Public/',
      'Templates/',
      'Videos/',
      'secret.txt',
      'passwords.txt',
      'targets.txt',
      'tools/',
      'scripts/',
      'reports/'
    ];
    
    this.addOutputLine('total 15');
    files.forEach(file => {
      const isDir = file.endsWith('/');
      const size = isDir ? '4096' : '1024';
      const date = 'Jan 15 19:30';
      const permissions = isDir ? 'drwxr-xr-x' : '-rw-r--r--';
      const owner = 'root';
      const group = 'root';
      
      this.addOutputLine(`${permissions} 1 ${owner} ${group} ${size} ${date} ${file}`);
    });
  }
  
  catFile(args) {
    if (!args[0]) {
      this.addOutputLine('cat: missing file operand', 'error');
      return;
    }
    
    const file = args[0];
    
    switch (file) {
      case 'about.txt':
        this.addOutputLine('Perseus - Cybersecurity Professional');
        this.addOutputLine('Specializing in Telecommunications Security and Fraud Prevention');
        this.addOutputLine('Passionate about penetration testing and ethical hacking');
        break;
      case 'secret.txt':
        this.addOutputLine('You found the secret file! 🎉');
        this.addOutputLine('Easter egg: The cake is a lie...');
        break;
      case '/etc/passwd':
        this.addOutputLine('root:x:0:0:root:/root:/bin/bash');
        this.addOutputLine('perseus:x:1000:1000:Perseus:/home/perseus:/bin/bash');
        this.addOutputLine('nobody:x:65534:65534:nobody:/nonexistent:/usr/sbin/nologin');
        break;
      default:
        this.addOutputLine(`cat: ${file}: No such file or directory`, 'error');
    }
  }
  
  changeDirectory(args) {
    if (!args[0] || args[0] === '~' || args[0] === '/root') {
      this.currentDirectory = '/root';
      this.updatePrompt();
    } else if (args[0] === '/') {
      this.currentDirectory = '/';
      this.updatePrompt();
    } else if (args[0] === '..') {
      this.currentDirectory = this.currentDirectory === '/root' ? '/' : '/root';
      this.updatePrompt();
    } else {
      this.addOutputLine(`cd: ${args[0]}: No such file or directory`, 'error');
    }
  }
  
  printWorkingDirectory() {
    this.addOutputLine(this.currentDirectory);
  }
  
  whoAmI() {
    this.addOutputLine('root');
  }
  
  interactiveNmap(args) {
    const target = args[0] || 'localhost';
    this.addOutputLine(`Starting Nmap 7.92 ( https://nmap.org )`);
    this.addOutputLine(`Nmap scan report for ${target}`);
    this.addOutputLine(`Host is up (0.0001s latency).`);
    this.addOutputLine('');
    
    // Simulate scanning animation
    const ports = [
      { port: 22, service: 'ssh', state: 'open' },
      { port: 80, service: 'http', state: 'open' },
      { port: 443, service: 'https', state: 'open' },
      { port: 8080, service: 'http-proxy', state: 'open' },
      { port: 3306, service: 'mysql', state: 'filtered' },
      { port: 5432, service: 'postgresql', state: 'closed' },
      { port: 6379, service: 'redis', state: 'open' },
      { port: 27017, service: 'mongodb', state: 'closed' }
    ];
    
    this.addOutputLine('PORT      STATE    SERVICE');
    
    ports.forEach((portInfo, index) => {
      setTimeout(() => {
        const stateColor = portInfo.state === 'open' ? '#00ff00' : portInfo.state === 'filtered' ? '#ffff00' : '#ff0000';
        this.addOutputLine(`${portInfo.port}/tcp   ${portInfo.state}    ${portInfo.service}`, 'progress');
      }, index * 200);
    });
    
    setTimeout(() => {
      this.addOutputLine('');
      this.addOutputLine(`Nmap done: 1 IP address (1 host up) scanned in ${(ports.length * 0.2).toFixed(1)} seconds`);
      this.achievements.add('nmap_master');
      this.showAchievement('Nmap Master');
    }, ports.length * 200 + 500);
  }
  
  clearTerminal() {
    if (this.terminalOutput) {
      // Clear all content except the input field
      const inputField = this.terminalOutput.querySelector('.terminal-input');
      this.terminalOutput.innerHTML = '';
      if (inputField) {
        this.terminalOutput.appendChild(inputField);
      }
    }
  }
  
  pingCommand(args) {
    if (!args[0]) {
      this.addOutputLine('ping: missing host operand', 'error');
      this.addOutputLine('Try \'ping --help\' for more information.', 'error');
      return;
    }
    
    const target = args[0];
    let ip = '142.250.190.78';
    
    // Different IPs for different targets
    if (target === 'localhost' || target === '127.0.0.1') {
      ip = '127.0.0.1';
    } else if (target === 'github.com') {
      ip = '140.82.113.4';
    } else if (target === 'stackoverflow.com') {
      ip = '151.101.193.69';
    }
    
    this.addOutputLine(`PING ${target} (${ip}) 56(84) bytes of data.`);
    
    let pingCount = 0;
    const maxPings = 4;
    
    const pingInterval = setInterval(() => {
      pingCount++;
      const time = (Math.random() * 50 + 10).toFixed(2);
      const ttl = Math.floor(Math.random() * 50 + 50);
      this.addOutputLine(`64 bytes from ${target} (${ip}): icmp_seq=${pingCount} ttl=${ttl} time=${time} ms`, 'progress');
      
      if (pingCount >= maxPings) {
        clearInterval(pingInterval);
        setTimeout(() => {
          this.addOutputLine('');
          this.addOutputLine(`--- ${target} ping statistics ---`);
          this.addOutputLine(`${maxPings} transmitted, ${maxPings} received, 0% packet loss, time ${(maxPings * 1000).toFixed(0)}ms`);
          this.addOutputLine(`rtt min/avg/max/mdev = 10.123/25.456/45.789/8.901 ms`);
        }, 1000);
      }
    }, 1000);
  }
  
  showDate() {
    const now = new Date();
    this.addOutputLine(now.toString());
  }
  
  topCommand() {
    this.addOutputLine('top - 19:30:45 up 2 days,  3:45,  1 user,  load average: 0.52, 0.58, 0.59');
    this.addOutputLine('Tasks: 125 total,   1 running, 124 sleeping,   0 stopped,   0 zombie');
    this.addOutputLine('%Cpu(s):  2.3 us,  1.2 sy,  0.0 ni, 96.3 id,  0.2 wa,  0.0 hi,  0.0 si,  0.0 st');
    this.addOutputLine('MiB Mem :  16384.0 total,   8192.0 free,   4096.0 used,   4096.0 buff/cache');
    this.addOutputLine('MiB Swap:   8192.0 total,   8192.0 free,      0.0 used.  12288.0 avail Mem');
    this.addOutputLine('');
    this.addOutputLine('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
    
    const processes = [
      { pid: 1234, user: 'root', pr: 20, ni: 0, virt: '123456', res: '1234', shr: '123', s: 'S', cpu: '2.3', mem: '7.5', time: '00:01:23', cmd: 'systemd' },
      { pid: 1235, user: 'root', pr: 20, ni: 0, virt: '98765', res: '987', shr: '65', s: 'S', cpu: '1.8', mem: '6.0', time: '00:00:45', cmd: 'kthreadd' },
      { pid: 1236, user: 'root', pr: 20, ni: 0, virt: '65432', res: '654', shr: '32', s: 'S', cpu: '1.2', mem: '4.0', time: '00:00:32', cmd: 'ksoftirqd/0' },
      { pid: 1237, user: 'root', pr: 20, ni: 0, virt: '54321', res: '543', shr: '21', s: 'S', cpu: '0.8', mem: '3.3', time: '00:00:18', cmd: 'kworker/0:0' },
      { pid: 1238, user: 'root', pr: 20, ni: 0, virt: '43210', res: '432', shr: '10', s: 'S', cpu: '0.5', mem: '2.6', time: '00:00:12', cmd: 'rcu_sched' }
    ];
    
    processes.forEach(proc => {
      this.addOutputLine(`${proc.pid.toString().padStart(5)} ${proc.user.padEnd(8)} ${proc.pr.toString().padStart(3)} ${proc.ni.toString().padStart(3)} ${proc.virt.padStart(8)} ${proc.res.padStart(6)} ${proc.shr.padStart(5)} ${proc.s} ${proc.cpu.padStart(6)} ${proc.mem.padStart(5)} ${proc.time.padStart(8)} ${proc.cmd}`);
    });
    
    this.addOutputLine('');
    this.addOutputLine('Press q to quit');
  }
  
  htopCommand() {
    this.addOutputLine('htop - Interactive process viewer');
    this.addOutputLine('F1:Help  F2:Setup  F3:Search  F4:Filter  F5:Tree  F6:SortBy  F7:Invert  F8:Tree  F9:Kill  F10:Quit');
    this.addOutputLine('');
    this.addOutputLine('  PID  USER   PRI  NI  VIRT   RES   SHR S CPU% MEM%   TIME+  Command');
    this.addOutputLine(' 1234  root    20   0 123456 1234  123 S 2.3  7.5 00:01:23 systemd');
    this.addOutputLine(' 1235  root    20   0  98765  987   65 S 1.8  6.0 00:00:45 kthreadd');
    this.addOutputLine(' 1236  root    20   0  65432  654   32 S 1.2  4.0 00:00:32 ksoftirqd/0');
    this.addOutputLine(' 1237  root    20   0  54321  543   21 S 0.8  3.3 00:00:18 kworker/0:0');
    this.addOutputLine(' 1238  root    20   0  43210  432   10 S 0.5  2.6 00:00:12 rcu_sched');
    this.addOutputLine('');
    this.addOutputLine('Load average: 0.52 0.58 0.59');
    this.addOutputLine('Uptime: 2 days, 3:45');
  }
  
  hashcatCommand(args) {
    this.addOutputLine('hashcat (v6.2.6) starting...');
    this.addOutputLine('OpenCL API (OpenCL 3.0) - Platform #1 [NVIDIA Corporation]');
    this.addOutputLine('* Device #1: NVIDIA GeForce RTX 4090, 24576/24576 MB, 128MCU');
    this.addOutputLine('');
    this.addOutputLine('Hash.Name........: MD5');
    this.addOutputLine('Target...........: File (hashes.txt)');
    this.addOutputLine('Time.Started.....: Mon Jan 15 19:30:45 2024');
    this.addOutputLine('');
    
    const hashes = ['5f4dcc3b5aa765d61d8327deb882cf99', '7c4a8d09ca3762af61e59520943dc26494f8941b'];
    const passwords = ['password', '123456'];
    
    hashes.forEach((hash, index) => {
      setTimeout(() => {
        this.addOutputLine(`Recovered........: ${passwords[index]} (${hash})`, 'success');
      }, (index + 1) * 1000);
    });
    
    setTimeout(() => {
      this.addOutputLine('');
      this.addOutputLine('Started: Mon Jan 15 19:30:45 2024');
      this.addOutputLine('Stopped: Mon Jan 15 19:30:48 2024');
      this.achievements.add('password_cracker');
      this.showAchievement('Password Cracker');
    }, 3000);
  }
  
  showUptime() {
    this.addOutputLine(' 19:30:45 up 2 days,  3:45,  1 user,  load average: 0.52, 0.58, 0.59');
  }
  
  neofetch() {
    const neofetch = [
      '                    perseus@perseus-blog',
      '                   ----------------------',
      'OS: Ubuntu 22.04.3 LTS x86_64',
      'Host: Virtual Machine',
      'Kernel: 5.15.0-88-generic',
      'Uptime: 2 days, 3 hours, 45 minutes',
      'Packages: 2341 (dpkg)',
      'Shell: bash 5.1.16',
      'Terminal: retro-terminal v1.0',
      'CPU: Intel i7-12700K (12) @ 3.600GHz',
      'Memory: 8192MiB / 16384MiB',
      'Disk: 256GB / 512GB (50%)',
      'Local IP: 192.168.1.100',
      'Theme: Cyberpunk Retro'
    ];
    
    neofetch.forEach(line => {
      this.addOutputLine(line);
    });
  }
  
  sudoCommand(args) {
    if (!args[0]) {
      this.addOutputLine('sudo: missing command', 'error');
      return;
    }
    
    const command = args.join(' ');
    
    if (command.includes('rm -rf /')) {
      this.addOutputLine('sudo: rm -rf /: Permission denied', 'error');
      this.addOutputLine('Nice try! This is a demo terminal.');
      this.addOutputLine('In real life, this would be very dangerous!');
    } else if (command.includes('su')) {
      this.addOutputLine('sudo: su: command not found', 'error');
    } else {
      this.addOutputLine(`sudo: ${command}: command not found`, 'error');
    }
  }
  
  exitTerminal() {
    this.addOutputLine('Exiting terminal...', 'exit');
    setTimeout(() => {
      window.location.href = '/';
    }, 1000);
  }
  
  commandNotFound(cmd) {
    this.addOutputLine(`bash: ${cmd}: command not found`, 'error');
  }
  
  detectKonamiCode(keyCode) {
    this.konamiCode.push(keyCode);
    if (this.konamiCode.length > this.konamiSequence.length) {
      this.konamiCode.shift();
    }
    
    if (this.konamiCode.join(',') === this.konamiSequence.join(',')) {
      this.triggerKonamiCode();
    }
  }
  
  triggerKonamiCode() {
    this.addOutputLine('[KONAMI] Konami Code Activated!', 'success');
    this.addOutputLine('Matrix mode enabled...', 'success');
    this.addOutputLine('All systems are now under your control!', 'success');
    this.achievements.add('konami_master');
    this.showAchievement('Konami Master');
  }
  
  tabCompletion(currentInput) {
    const commands = {
      'help': 'Show available commands',
      'ls': 'List files and directories',
      'cat': 'Display file contents',
      'cd': 'Change directory',
      'pwd': 'Print working directory',
      'whoami': 'Show current user',
      'nmap': 'Network scanner',
      'clear': 'Clear terminal',
      'date': 'Show current date/time',
      'uptime': 'Show system uptime',
      'neofetch': 'System information',
      'sudo': 'Execute as superuser',
      'exit': 'Exit terminal',
      'ping': 'Test network connectivity',
      'ssh': 'Secure shell connection',
      'scp': 'Secure file copy',
      'wget': 'Download files',
      'curl': 'Transfer data',
      'grep': 'Search text patterns',
      'find': 'Find files',
      'ps': 'Process status',
      'top': 'System processes (live)',
      'htop': 'Interactive process viewer',
      'netstat': 'Network statistics',
      'ifconfig': 'Network interface config',
      'ip': 'IP routing',
      'route': 'Routing table',
      'arp': 'ARP cache',
      'traceroute': 'Network path tracing',
      'dig': 'DNS lookup',
      'nslookup': 'DNS query',
      'tcpdump': 'Packet capture',
      'wireshark': 'Network analyzer',
      'metasploit': 'Exploitation framework',
      'aircrack-ng': 'Wireless security tool',
      'hashcat': 'Password cracking tool',
      'john': 'Password cracker',
      'hydra': 'Brute force attacks',
      'sqlmap': 'SQL injection scanner'
    };
    
    const matchingCommands = Object.keys(commands).filter(cmd => cmd.startsWith(currentInput));
    
    if (matchingCommands.length === 1) {
      this.terminalInput.value = matchingCommands[0];
      this.showCommandHint(commands[matchingCommands[0]]);
    } else if (matchingCommands.length > 1) {
      this.addOutputLine('Available completions:');
      matchingCommands.forEach(cmd => {
        this.addOutputLine(`  ${cmd} - ${commands[cmd]}`);
      });
    }
  }
  
  showCommandHint(description) {
    // Show a subtle hint about the command
    const hint = document.createElement('div');
    hint.className = 'command-hint';
    hint.textContent = `Hint: ${description}`;
    hint.style.color = '#00ff00';
    hint.style.opacity = '0.7';
    hint.style.fontSize = '11px';
    hint.style.fontStyle = 'italic';
    hint.style.marginTop = '2px';
    
    // Insert hint after the input field
    const inputField = this.terminalOutput.querySelector('.terminal-input');
    if (inputField) {
      this.terminalOutput.insertBefore(hint, inputField.nextSibling);
      
      // Remove hint after 3 seconds
      setTimeout(() => {
        if (hint.parentNode) {
          hint.parentNode.removeChild(hint);
        }
      }, 3000);
    }
  }
  
  showCommandHelp(command) {
    const helpData = {
      'nmap': [
        'NAME',
        '       nmap - Network exploration tool and security / port scanner',
        '',
        'SYNOPSIS',
        '       nmap [Scan Type(s)] [Options] {target specification}',
        '',
        'DESCRIPTION',
        '       Nmap ("Network Mapper") is an open source tool for network exploration and security auditing.',
        '',
        'EXAMPLES',
        '       nmap localhost                    # Scan localhost',
        '       nmap -sS -p 1-1000 192.168.1.1   # SYN scan ports 1-1000',
        '       nmap -sV -O 192.168.1.0/24       # Version detection + OS detection',
        '',
        'COMMON OPTIONS',
        '       -sS    TCP SYN scan (stealth)',
        '       -sT    TCP connect scan',
        '       -sU    UDP scan',
        '       -sV    Version detection',
        '       -O     OS detection',
        '       -p     Port specification'
      ],
      'ping': [
        'NAME',
        '       ping - send ICMP ECHO_REQUEST to network hosts',
        '',
        'SYNOPSIS',
        '       ping [OPTIONS] DESTINATION',
        '',
        'DESCRIPTION',
        '       ping uses the ICMP protocol\'s mandatory ECHO_REQUEST datagram to elicit an ICMP ECHO_RESPONSE from a host or gateway.',
        '',
        'EXAMPLES',
        '       ping google.com',
        '       ping -c 4 192.168.1.1',
        '       ping -i 0.2 localhost'
      ],
      'ssh': [
        'NAME',
        '       ssh - OpenSSH SSH client (remote login program)',
        '',
        'SYNOPSIS',
        '       ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface] [-b bind_address] [-c cipher_spec] [-D [bind_address:]port] [-E log_file] [-e escape_char] [-F configfile] [-I pkcs11] [-i identity_file] [-J [user@]host[:port]] [-L address] [-l login_name] [-m mac_spec] [-O ctl_cmd] [-o option] [-p port] [-Q query_option] [-R address] [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]] [user@]hostname [command]',
        '',
        'DESCRIPTION',
        '       ssh (SSH client) is a program for logging into a remote machine and for executing commands on a remote machine.',
        '',
        'EXAMPLES',
        '       ssh user@192.168.1.100',
        '       ssh -p 2222 user@example.com',
        '       ssh -i ~/.ssh/id_rsa user@server.com'
      ],
      'hashcat': [
        'NAME',
        '       hashcat - Advanced password recovery',
        '',
        'SYNOPSIS',
        '       hashcat [options] hash|hashfile|hccapxfile [dictionary|mask|directory]',
        '',
        'DESCRIPTION',
        '       hashcat is the world\'s fastest and most advanced password recovery utility, supporting five unique modes of attack for over 300 highly-optimized hashing algorithms.',
        '',
        'EXAMPLES',
        '       hashcat -m 0 hash.txt wordlist.txt',
        '       hashcat -m 1000 -a 0 hash.txt wordlist.txt',
        '       hashcat -m 0 -a 3 hash.txt ?a?a?a?a?a?a'
      ]
    };
    
    const help = helpData[command];
    if (help) {
      help.forEach(line => {
        this.addOutputLine(line, 'help');
      });
    } else {
      this.addOutputLine(`No help available for '${command}'`, 'error');
      this.addOutputLine('Try "help" for a list of available commands.', 'error');
    }
  }
  
  showAchievement(achievement) {
    const achievementDiv = document.createElement('div');
    achievementDiv.className = 'achievement-popup';
    achievementDiv.innerHTML = `
      <div class="achievement-content">
        <span class="achievement-icon">[ACHIEVEMENT]</span>
        <span class="achievement-text">Achievement Unlocked: ${achievement}</span>
      </div>
    `;
    document.body.appendChild(achievementDiv);
    
    setTimeout(() => {
      achievementDiv.remove();
    }, 3000);
  }
  
  // Placeholder methods for other commands
  hydraCommand(args) { this.addOutputLine('Hydra v9.4 - Password cracking tool'); this.addOutputLine('Usage: hydra [options] target service'); }
  sqlmapCommand(args) { this.addOutputLine('sqlmap v1.7.2 - SQL injection scanner'); this.addOutputLine('Usage: sqlmap [options]'); }
  metasploitCommand(args) { this.addOutputLine('Metasploit Framework v6.2.0'); this.addOutputLine('msf6 >'); }
  aircrackCommand(args) { this.addOutputLine('Aircrack-ng v1.7 - Wireless security tool'); this.addOutputLine('Usage: aircrack-ng [options]'); }
  johnCommand(args) { this.addOutputLine('John the Ripper v1.9.0 - Password cracker'); this.addOutputLine('Usage: john [options]'); }
  wiresharkCommand(args) { this.addOutputLine('Wireshark v4.0.0 - Network protocol analyzer'); this.addOutputLine('Starting GUI...'); }
  tcpdumpCommand(args) { this.addOutputLine('tcpdump: listening on eth0, link-type EN10MB'); this.addOutputLine('Press Ctrl+C to stop'); }
  netstatCommand(args) { 
    this.addOutputLine('Active Internet connections (w/o servers)');
    this.addOutputLine('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
    this.addOutputLine('tcp        0      0 192.168.1.100:22        192.168.1.50:54321      ESTABLISHED');
    this.addOutputLine('tcp        0      0 192.168.1.100:80        192.168.1.25:12345      ESTABLISHED');
    this.addOutputLine('tcp        0      0 192.168.1.100:443       192.168.1.30:67890      ESTABLISHED');
    this.addOutputLine('tcp        0      0 127.0.0.1:3306          127.0.0.1:54321         ESTABLISHED');
    this.addOutputLine('tcp        0      0 127.0.0.1:8080          127.0.0.1:12345         ESTABLISHED');
  }
  psCommand(args) { 
    this.addOutputLine('  PID TTY          TIME CMD');
    this.addOutputLine(' 1234 pts/0    00:00:00 bash');
    this.addOutputLine(' 1235 pts/0    00:00:00 ps');
    this.addOutputLine(' 1236 pts/0    00:00:00 systemd');
    this.addOutputLine(' 1237 pts/0    00:00:00 kthreadd');
    this.addOutputLine(' 1238 pts/0    00:00:00 ksoftirqd/0');
    this.addOutputLine(' 1239 pts/0    00:00:00 kworker/0:0');
    this.addOutputLine(' 1240 pts/0    00:00:00 rcu_sched');
    this.addOutputLine(' 1241 pts/0    00:00:00 sshd');
    this.addOutputLine(' 1242 pts/0    00:00:00 apache2');
    this.addOutputLine(' 1243 pts/0    00:00:00 mysql');
  }
  killCommand(args) { this.addOutputLine('kill: usage: kill [-s sigspec | -n signum | -sigspec] pid | jobspec ...'); }
  chmodCommand(args) { this.addOutputLine('chmod: changing permissions of file'); }
  chownCommand(args) { this.addOutputLine('chown: changing ownership of file'); }
  findCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('find: missing path operand', 'error');
      this.addOutputLine('Usage: find [path] [expression]', 'error');
      return;
    }
    
    const path = args[0];
    this.addOutputLine(`Searching in ${path}...`);
    this.addOutputLine('./Desktop/secret.txt');
    this.addOutputLine('./Documents/report.pdf');
    this.addOutputLine('./Downloads/tools.zip');
    this.addOutputLine('./Pictures/screenshot.png');
    this.addOutputLine('./scripts/backup.sh');
    this.addOutputLine('./tools/nmap');
    this.addOutputLine('./tools/hashcat');
    this.addOutputLine('./tools/metasploit');
    this.addOutputLine('Found 8 files');
  }
  grepCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('grep: missing pattern', 'error');
      this.addOutputLine('Usage: grep [OPTION]... PATTERN [FILE]...', 'error');
      return;
    }
    
    const pattern = args[0];
    this.addOutputLine(`Searching for pattern: "${pattern}"`);
    this.addOutputLine('secret.txt:password=admin123');
    this.addOutputLine('config.ini:admin_user=root');
    this.addOutputLine('log.txt:ERROR: Authentication failed');
    this.addOutputLine('Found 3 matches');
  }
  sshCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('ssh: missing host operand', 'error');
      this.addOutputLine('usage: ssh [-46AaCfGgKkMNnqsTtVvXxYy] [-B bind_interface]', 'error');
      this.addOutputLine('           [-b bind_address] [-c cipher_spec] [-D [bind_address:]port]', 'error');
      this.addOutputLine('           [-E log_file] [-e escape_char] [-F configfile]', 'error');
      this.addOutputLine('           [-I pkcs11] [-i identity_file] [-J [user@]host[:port]]', 'error');
      this.addOutputLine('           [-L address] [-l login_name] [-m mac_spec] [-O ctl_cmd]', 'error');
      this.addOutputLine('           [-o option] [-p port] [-Q query_option] [-R address]', 'error');
      this.addOutputLine('           [-S ctl_path] [-W host:port] [-w local_tun[:remote_tun]]', 'error');
      this.addOutputLine('           [user@]hostname [command]', 'error');
      return;
    }
    
    const target = args[0];
    this.addOutputLine(`ssh: connect to host ${target} port 22: Connection timed out`, 'error');
    this.addOutputLine('ssh: Could not resolve hostname: No address associated with hostname', 'error');
  }
  scpCommand(args) { this.addOutputLine('scp: copying files...'); }
  wgetCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('wget: missing URL', 'error');
      this.addOutputLine('Usage: wget [OPTION]... [URL]...', 'error');
      return;
    }
    
    const url = args[0];
    this.addOutputLine(`--2024-01-15 19:30:45--  ${url}`);
    this.addOutputLine('Resolving example.com (example.com)... 93.184.216.34');
    this.addOutputLine('Connecting to example.com (example.com)|93.184.216.34|:80... connected.');
    this.addOutputLine('HTTP request sent, awaiting response... 200 OK');
    this.addOutputLine('Length: 1234 (1.2K) [text/html]');
    this.addOutputLine('Saving to: \'index.html\'');
    this.addOutputLine('');
    this.addOutputLine('100%[======================================>] 1,234       --.-K/s   in 0.1s');
    this.addOutputLine('');
    this.addOutputLine('2024-01-15 19:30:45 (12.3 KB/s) - \'index.html\' saved [1234/1234]');
  }
  curlCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('curl: missing URL', 'error');
      this.addOutputLine('Usage: curl [OPTIONS] [URL]', 'error');
      return;
    }
    
    const url = args[0];
    this.addOutputLine(`  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current`);
    this.addOutputLine(`                                 Dload  Upload   Total   Spent    Left  Speed`);
    this.addOutputLine(`100  1234  100  1234    0     0  12340      0  0:00:00  0:00:00 --:--:-- 12340`);
    this.addOutputLine(`<!DOCTYPE html>`);
    this.addOutputLine(`<html>`);
    this.addOutputLine(`<head><title>Example Domain</title></head>`);
    this.addOutputLine(`<body>`);
    this.addOutputLine(`<h1>Example Domain</h1>`);
    this.addOutputLine(`<p>This domain is for use in illustrative examples.</p>`);
    this.addOutputLine(`</body>`);
    this.addOutputLine(`</html>`);
  }
  digCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('dig: missing domain name', 'error');
      this.addOutputLine('Usage: dig [@server] [domain] [query-type]', 'error');
      return;
    }
    
    const domain = args[0];
    this.addOutputLine(`; <<>> DiG 9.18.1-1ubuntu1.3-Ubuntu <<>> ${domain}`);
    this.addOutputLine(';; Got answer:');
    this.addOutputLine(';; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345');
    this.addOutputLine(';; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1');
    this.addOutputLine('');
    this.addOutputLine(';; QUESTION SECTION:');
    this.addOutputLine(`;${domain}.			IN	A`);
    this.addOutputLine('');
    this.addOutputLine(';; ANSWER SECTION:');
    this.addOutputLine(`${domain}.		300	IN	A	142.250.190.78`);
    this.addOutputLine('');
    this.addOutputLine(';; Query time: 15 msec');
    this.addOutputLine(';; SERVER: 8.8.8.8#53(8.8.8.8)');
    this.addOutputLine(';; WHEN: Mon Jan 15 19:30:45 UTC 2024');
    this.addOutputLine(';; MSG SIZE  rcvd: 56');
  }
  nslookupCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('nslookup: missing domain name', 'error');
      this.addOutputLine('Usage: nslookup [domain] [server]', 'error');
      return;
    }
    
    const domain = args[0];
    this.addOutputLine(`Server:		8.8.8.8`);
    this.addOutputLine(`Address:	8.8.8.8#53`);
    this.addOutputLine('');
    this.addOutputLine(`Non-authoritative answer:`);
    this.addOutputLine(`Name:	${domain}`);
    this.addOutputLine(`Address: 142.250.190.78`);
  }
  tracerouteCommand(args) { 
    if (!args[0]) {
      this.addOutputLine('traceroute: missing host operand', 'error');
      this.addOutputLine('Try \'traceroute --help\' for more information.', 'error');
      return;
    }
    
    const target = args[0];
    this.addOutputLine(`traceroute to ${target} (142.250.190.78), 30 hops max, 60 byte packets`);
    this.addOutputLine(' 1  192.168.1.1 (192.168.1.1)  2.123 ms  1.987 ms  1.876 ms');
    this.addOutputLine(' 2  10.0.0.1 (10.0.0.1)  5.234 ms  5.123 ms  5.098 ms');
    this.addOutputLine(' 3  172.16.0.1 (172.16.0.1)  8.456 ms  8.345 ms  8.234 ms');
    this.addOutputLine(' 4  203.0.113.1 (203.0.113.1)  12.789 ms  12.678 ms  12.567 ms');
    this.addOutputLine(' 5  142.250.190.78 (142.250.190.78)  15.123 ms  15.012 ms  14.901 ms');
  }
  ifconfigCommand() { 
    this.addOutputLine('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500');
    this.addOutputLine('        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255');
    this.addOutputLine('        inet6 fe80::215:5dff:fe32:1234  prefixlen 64  scopeid 0x20<link>');
    this.addOutputLine('        ether 00:15:5d:32:12:34  txqueuelen 1000  (Ethernet)');
    this.addOutputLine('        RX packets 12345  bytes 9876543 (9.4 MiB)');
    this.addOutputLine('        RX errors 0  dropped 0  overruns 0  frame 0');
    this.addOutputLine('        TX packets 5432  bytes 1234567 (1.1 MiB)');
    this.addOutputLine('        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0');
    this.addOutputLine('');
    this.addOutputLine('lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536');
    this.addOutputLine('        inet 127.0.0.1  netmask 255.0.0.0');
    this.addOutputLine('        inet6 ::1  prefixlen 128  scopeid 0x10<host>');
    this.addOutputLine('        loop  txqueuelen 1000  (Local Loopback)');
    this.addOutputLine('        RX packets 123  bytes 12345 (12.0 KiB)');
    this.addOutputLine('        RX errors 0  dropped 0  overruns 0  frame 0');
    this.addOutputLine('        TX packets 123  bytes 12345 (12.0 KiB)');
    this.addOutputLine('        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0');
  }
  ipCommand(args) { this.addOutputLine('ip: showing network information...'); }
  routeCommand() { 
    this.addOutputLine('Kernel IP routing table');
    this.addOutputLine('Destination     Gateway         Genmask         Flags Metric Ref    Use Iface');
    this.addOutputLine('default         192.168.1.1     0.0.0.0         UG    100    0        0 eth0');
    this.addOutputLine('192.168.1.0     *               255.255.255.0   U     100    0        0 eth0');
    this.addOutputLine('127.0.0.0       *               255.0.0.0       U     0      0        0 lo');
  }
  arpCommand() { 
    this.addOutputLine('Address                  HWtype  HWaddress           Flags Mask            Iface');
    this.addOutputLine('192.168.1.1              ether   00:15:5d:01:ca:05   C                     eth0');
    this.addOutputLine('192.168.1.50             ether   00:15:5d:02:ca:06   C                     eth0');
    this.addOutputLine('192.168.1.100            ether   00:15:5d:03:ca:07   C                     eth0');
  }
  
  updatePrompt() {
    if (this.prompt) {
      const dir = this.currentDirectory === '/root' ? '~' : this.currentDirectory;
      this.prompt.textContent = `root@kali:${dir}#`;
    }
  }
}

// Initialize terminal when page loads
document.addEventListener('DOMContentLoaded', () => {
  // Check if we're on the terminal page
  if (document.querySelector('.kali-monitor')) {
    console.log('Initializing Kali Terminal...');
    new RetroTerminal();
  }
}); 