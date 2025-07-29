<script>
    import { onMount } from 'svelte';
    
    let terminalBody;
    let commandInput = '';
    let commandHistory = [];
    let historyIndex = -1;
    let isTyping = false;
    let currentCommand = '';
    let commandOutput = [];
    let currentDirectory = '/root';
    let isScanning = false;
    let scanProgress = 0;
    let isBooting = true;
    let bootStep = 0;
    let bootProgress = 0;
    let bootDetails = '';
    let showBootDetails = false;
    
    // Boot messages not the boot sequence (should refactor this sometime)
    let bootMessages = [
        '[ OK ] Loading Kali Linux kernel...',
        '[ OK ] Mounting filesystems...',
        '[ OK ] Starting system services...',
        '[ OK ] Configuring network interfaces...',
        '[ OK ] Starting networking services...',
        '[ OK ] Loading security tools...',
        '[ OK ] Initializing penetration testing environment...',
        '[ OK ] Starting SSH service...',
        '[ OK ] Loading Metasploit framework...',
        '[ OK ] Starting terminal session...',
        '[ OK ] Kali Linux 2023.4 ready!'
    ];
    
    // Theme management
    let currentTheme = 0;
    const themes = ['dracula', 'solarized', 'onedark', 'material', 'gruvbox'];
    const themeNames = ['Dracula', 'Solarized Dark', 'One Dark', 'Material Ocean', 'Gruvbox Dark'];
    
    // Virtual file system completely useless and stupid but i'm too lazy to remove it
    const fileSystem = {
        '/root': {
            type: 'directory',
            contents: {
                'Documents': { type: 'directory' },
                'Downloads': { type: 'directory' },
                'Desktop': { type: 'directory' },
                'kali-tools': { type: 'directory' },
                'scans': { type: 'directory' },
                'notes.txt': { type: 'file', content: '=== Security Notes ===\n- Always use VPN for testing\n- Document all findings\n- Follow responsible disclosure\n- Keep tools updated\n- Use virtual machines for testing' },
                '.bashrc': { type: 'file', content: '# ~/.bashrc: executed by bash(1) for non-login shells.\n# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc)\n\n# If not running interactively, don\'t do anything\ncase $- in\n    *i*) ;;\n      *) return;;\nesac\n\n# don\'t put duplicate lines or lines starting with space in the history.\nHISTCONTROL=ignoreboth\n\n# append to the history file, don\'t overwrite it\nshopt -s histappend\n\n# for setting history length see HISTSIZE and HISTFILESIZE in bash(1)\nHISTSIZE=1000\nHISTFILESIZE=2000' },
                '.profile': { type: 'file', content: '# ~/.profile: executed by the command interpreter for login shells.\n# This file is not read by bash(1), if ~/.bash_profile or ~/.bash_login\n# exists.\n# see /usr/share/doc/bash/examples/startup-files (in the package bash-doc).\n\n# the default umask is set in /etc/profile; for setting the umask\n# for ssh logins, install and configure the libpam-umask package.\n#umask 022\n\n# if running bash\nif [ -n "$BASH_VERSION" ]; then\n    # include .bashrc if it exists\n    if [ -f "$HOME/.bashrc" ]; then\n        . "$HOME/.bashrc"\n    fi\nfi' }
            }
        },
        '/root/Documents': {
            type: 'directory',
            contents: {
                'reports': { type: 'directory' },
                'scripts': { type: 'directory' },
                'research.txt': { type: 'file', content: '=== Security Research ===\n\nTarget: example.com\nStatus: Reconnaissance phase\nFindings:\n- Open ports: 22, 80, 443\n- Web server: Apache/2.4.41\n- SSL certificate: Valid\n\nNext steps:\n- Vulnerability assessment\n- Directory enumeration\n- SQL injection testing' }
            }
        },
        '/root/kali-tools': {
            type: 'directory',
            contents: {
                'nmap-scripts': { type: 'directory' },
                'metasploit': { type: 'directory' },
                'custom-scripts': { type: 'directory' },
                'wordlists': { type: 'directory' }
            }
        },
        '/root/scans': {
            type: 'directory',
            contents: {
                'nmap-results.txt': { type: 'file', content: 'Nmap scan report for 192.168.1.1\nHost is up (0.00023s latency).\nNot shown: 998 closed tcp ports (reset)\nPORT      STATE SERVICE\n22/tcp    open  ssh\n80/tcp    open  http\n443/tcp   open  https\n8080/tcp  open  http-proxy\n3306/tcp  open  mysql\n\nNmap done: 1 IP address (1 host up) scanned in 2.34 seconds' },
                'vulnerability-report.txt': { type: 'file', content: '=== Vulnerability Assessment Report ===\n\nTarget: 192.168.1.1\nScan Date: 2024-01-15\n\nFindings:\n1. Open SSH port (22) - Default configuration\n2. HTTP server (80) - Apache 2.4.41\n3. HTTPS (443) - Valid SSL certificate\n4. MySQL (3306) - Default port open\n\nRecommendations:\n- Disable unused services\n- Update Apache to latest version\n- Configure firewall rules\n- Enable SSH key authentication' }
            }
        }
    };
    
    const commands = {
        'help': {
            description: 'Show available commands',
            execute: () => showHelp()
        },
        'clear': {
            description: 'Clear terminal',
            execute: () => clearTerminal()
        },
        'whoami': {
            description: 'Show current user',
            execute: () => addOutput('root')
        },
        'pwd': {
            description: 'Print working directory',
            execute: () => addOutput(currentDirectory)
        },
        'ls': {
            description: 'List directory contents',
            execute: (args) => listDirectory(args)
        },
        'cd': {
            description: 'Change directory',
            execute: (args) => changeDirectory(args[0])
        },
        'nmap': {
            description: 'Network security scanner',
            execute: (args) => runNmap(args)
        },
        'whois': {
            description: 'Domain information lookup',
            execute: (args) => runWhois(args[0])
        },
        'dig': {
            description: 'DNS lookup utility',
            execute: (args) => runDig(args[0])
        },
        'ping': {
            description: 'Test network connectivity',
            execute: (args) => runPing(args[0])
        },
        'netstat': {
            description: 'Network statistics',
            execute: () => runNetstat()
        },
        'ps': {
            description: 'Process status',
            execute: () => runPs()
        },
        'cat': {
            description: 'Display file contents',
            execute: (args) => catFile(args[0])
        },
        'uname': {
            description: 'System information',
            execute: (args) => runUname(args)
        },
        'date': {
            description: 'Show current date and time',
            execute: () => addOutput(new Date().toLocaleString())
        },
        'uptime': {
            description: 'System uptime',
            execute: () => runUptime()
        },
        'top': {
            description: 'Display system processes',
            execute: () => runTop()
        },
        'ifconfig': {
            description: 'Network interface configuration',
            execute: () => runIfconfig()
        },
        'history': {
            description: 'Show command history',
            execute: () => showHistory()
        },
        'echo': {
            description: 'Display a line of text',
            execute: (args) => addOutput(args.join(' '))
        },
        'neofetch': {
            description: 'Display system information',
            execute: () => runNeofetch()
        },
        'fortune': {
            description: 'Display a random quote',
            execute: () => runFortune()
        },
        'cowsay': {
            description: 'Display a message with ASCII art',
            execute: (args) => runCowsay(args)
        },
        'theme': {
            description: 'Change terminal theme',
            execute: () => changeTheme()
        }
    };
    
    onMount(() => {
        startBootAnimation();
    });
    
    function startBootAnimation() {
        bootStep = 0;
        isBooting = true;
        bootProgress = 0;
        commandOutput = [];
        
        // Bootup sequence thing
        addOutput('Kali Linux 2023.4 (kali-rolling)');
        addOutput('Loading system...');
        addOutput('');
        
        bootMessages.forEach((message, index) => {
            setTimeout(() => {
                addOutput(message);
                bootStep = index + 1;
                bootProgress = ((index + 1) / bootMessages.length) * 100;
                
                // Fun stuff
                if (index === 2) {
                    setTimeout(() => {
                        addOutput('  Starting systemd...');
                        addOutput('  Loading kernel modules...');
                    }, 200);
                } else if (index === 4) {
                    setTimeout(() => {
                        addOutput('  Configuring eth0...');
                        addOutput('  Starting NetworkManager...');
                    }, 200);
                } else if (index === 6) {
                    setTimeout(() => {
                        addOutput('  Loading nmap...');
                        addOutput('  Loading metasploit...');
                        addOutput('  Loading wireshark...');
                    }, 200);
                }
                
                if (index === bootMessages.length - 1) {
                    // Boot complete
                    setTimeout(() => {
                        isBooting = false;
                        addOutput('');
                        addOutput('Welcome to Kali Linux 2023.4 (kali-rolling)');
                        addOutput('Last login: ' + new Date().toLocaleString());
                        addOutput('Type "help" for available commands');
                        addOutput('');
                        addPrompt();
                    }, 800);
                }
            }, index * 600);
        });
    }
    
    function addOutput(text) {
        commandOutput = [...commandOutput, { type: 'output', content: text }];
        scrollToBottom();
    }
    
    function addPrompt() {
        commandOutput = [...commandOutput, { type: 'prompt', content: `${currentDirectory}$ ` }];
        scrollToBottom();
    }
    
    function scrollToBottom() {
        setTimeout(() => {
            if (terminalBody) {
                terminalBody.scrollTop = terminalBody.scrollHeight;
            }
        }, 10);
    }
    
    function handleKeydown(event) {
        if (event.key === 'Enter') {
            executeCommand();
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            navigateHistory('up');
        } else if (event.key === 'ArrowDown') {
            event.preventDefault();
            navigateHistory('down');
        } else if (event.key === 'Tab') {
            event.preventDefault();
            // Not sure if i added tab completition somewhere else lol
        }
    }
    
    function navigateHistory(direction) {
        if (direction === 'up' && historyIndex < commandHistory.length - 1) {
            historyIndex++;
            commandInput = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (direction === 'down' && historyIndex > 0) {
            historyIndex--;
            commandInput = commandHistory[commandHistory.length - 1 - historyIndex];
        } else if (direction === 'down' && historyIndex === 0) {
            historyIndex = -1;
            commandInput = '';
        }
    }
    
    function executeCommand() {
        if (!commandInput.trim()) {
            return;
        }
        
        const parts = commandInput.trim().split(' ');
        const command = parts[0];
        const args = parts.slice(1);
        
        // history
        commandHistory.push(commandInput);
        historyIndex = -1;
        
        // tab output
        commandOutput = [...commandOutput, { type: 'command', content: commandInput }];
        
        // execute
        if (commands[command]) {
            commands[command].execute(args);
        } else {
            addOutput(`bash: ${command}: command not found`);
        }
        
        commandInput = '';
        addPrompt();
    }
    
    function showHelp() {
        addOutput('Available commands:');
        Object.entries(commands).forEach(([cmd, info]) => {
            addOutput(`  ${cmd.padEnd(12)} - ${info.description}`);
        });
        addOutput('');
        addOutput('For more information on a command, type: man [command]');
    }
    
    function clearTerminal() {
        commandOutput = [];
    }
    
    function listDirectory(args) {
        const path = currentDirectory;
        const dir = fileSystem[path];
        
        if (!dir || dir.type !== 'directory') {
            addOutput(`ls: cannot access '${path}': No such file or directory`);
            return;
        }
        
        const contents = dir.contents;
        const items = Object.keys(contents);
        
        if (args.includes('-la') || args.includes('-l')) {
            // detailed listing
            addOutput(`total ${items.length}`);
            items.forEach(item => {
                const itemInfo = contents[item];
                const type = itemInfo.type === 'directory' ? 'd' : '-';
                const permissions = 'rw-r--r--';
                const owner = 'root';
                const group = 'root';
                const size = itemInfo.type === 'file' ? itemInfo.content?.length || 0 : 4096;
                const date = 'Jan 15 10:30';
                addOutput(`${type}${permissions} 1 ${owner} ${group} ${size.toString().padStart(8)} ${date} ${item}`);
            });
        } else {
            // dumb listing
            const output = items.join('  ');
            addOutput(output);
        }
    }
    
    function changeDirectory(dir) {
        if (!dir || dir === '~') {
            currentDirectory = '/root';
        } else if (dir === '..') {
            const parts = currentDirectory.split('/');
            if (parts.length > 1) {
                currentDirectory = parts.slice(0, -1).join('/') || '/';
            }
        } else if (dir.startsWith('/')) {
            if (fileSystem[dir] && fileSystem[dir].type === 'directory') {
                currentDirectory = dir;
            } else {
                addOutput(`bash: cd: ${dir}: No such file or directory`);
                return;
            }
        } else {
            const newPath = `${currentDirectory}/${dir}`;
            if (fileSystem[newPath] && fileSystem[newPath].type === 'directory') {
                currentDirectory = newPath;
            } else {
                addOutput(`bash: cd: ${dir}: No such file or directory`);
                return;
            }
        }
    }
    
    function runNmap(args) {
        if (!args[0]) {
            addOutput('Usage: nmap [options] [target]');
            addOutput('Example: nmap 192.168.1.1');
            addOutput('Options:');
            addOutput('  -sS    TCP SYN scan');
            addOutput('  -sU    UDP scan');
            addOutput('  -p     Port specification');
            addOutput('  -A     Aggressive scan');
            return;
        }
        
        isScanning = true;
        scanProgress = 0;
        
        addOutput(`Starting Nmap 7.94 ( https://nmap.org )`);
        addOutput(`Nmap scan report for ${args[0]}`);
        addOutput(`Host is up (0.00023s latency).`);
        addOutput(`Not shown: 998 closed tcp ports (reset)`);
        addOutput(`PORT      STATE SERVICE`);
        
        const ports = [22, 80, 443, 8080, 3306];
        const services = ['ssh', 'http', 'https', 'http-proxy', 'mysql'];
        const versions = ['OpenSSH 8.2p1', 'Apache httpd 2.4.41', 'Apache httpd 2.4.41', 'Apache httpd 2.4.41', 'MySQL 8.0.26'];
        
        ports.forEach((port, index) => {
            setTimeout(() => {
                addOutput(`${port.toString().padStart(8)}/tcp  open  ${services[index]}`);
                if (args.includes('-A')) {
                    addOutput(`${' '.repeat(8)}| ${versions[index]}`);
                }
                scanProgress += 20;
                if (scanProgress >= 100) {
                    isScanning = false;
                    addOutput(`Nmap done: 1 IP address (1 host up) scanned in 2.34 seconds`);
                }
            }, (index + 1) * 500);
        });
    }
    
    function runWhois(domain) {
        if (!domain) {
            addOutput('Usage: whois [domain]');
            return;
        }
        
        addOutput(`Domain Name: ${domain}`);
        addOutput(`Registrar: Example Registrar, Inc.`);
        addOutput(`Registrar IANA ID: 1234`);
        addOutput(`Registrar Abuse Contact Email: abuse@example.com`);
        addOutput(`Registrar Abuse Contact Phone: +1.5555555555`);
        addOutput(`Domain Status: clientTransferProhibited`);
        addOutput(`Name Server: ns1.example.com`);
        addOutput(`Name Server: ns2.example.com`);
        addOutput(`DNSSEC: unsigned`);
        addOutput(`URL of the ICANN Whois Inaccuracy Complaint Form: https://www.icann.org/wicf/`);
        addOutput(`>>> Last update of whois database: 2024-01-15T10:30:00Z <<<`);
    }
    
    function runDig(domain) {
        if (!domain) {
            addOutput('Usage: dig [domain]');
            return;
        }
        
        addOutput(`; <<>> DiG 9.18.12-1-Debian <<>> ${domain}`);
        addOutput(`;; Got answer:`);
        addOutput(`;; ->>HEADER<<- opcode: QUERY, status: NOERROR, id: 12345`);
        addOutput(`;; flags: qr rd ra; QUERY: 1, ANSWER: 1, AUTHORITY: 0, ADDITIONAL: 1`);
        addOutput(``);
        addOutput(`;; QUESTION SECTION:`);
        addOutput(`;${domain}.			IN	A`);
        addOutput(``);
        addOutput(`;; ANSWER SECTION:`);
        addOutput(`${domain}.		300	IN	A	192.168.1.100`);
        addOutput(``);
        addOutput(`;; Query time: 2 msec`);
        addOutput(`;; SERVER: 8.8.8.8#53(8.8.8.8) (UDP)`);
        addOutput(`;; WHEN: ${new Date().toLocaleString()}`);
        addOutput(`;; MSG SIZE  rcvd: 56`);
    }
    
    function runPing(host) {
        if (!host) {
            addOutput('Usage: ping [host]');
            return;
        }
        
        addOutput(`PING ${host} (192.168.1.100) 56(84) bytes of data.`);
        let received = 0;
        for (let i = 1; i <= 4; i++) {
            setTimeout(() => {
                const time = (Math.random() * 10 + 1).toFixed(3);
                addOutput(`64 bytes from ${host} (192.168.1.100): icmp_seq=${i} ttl=64 time=${time} ms`);
                received++;
                if (received === 4) {
                    setTimeout(() => {
                        addOutput(``);
                        addOutput(`--- ${host} ping statistics ---`);
                        addOutput(`4 packets transmitted, 4 received, 0% packet loss, time 3003ms`);
                        addOutput(`rtt min/avg/max/mdev = 1.045/2.123/5.234/1.234 ms`);
                    }, 500);
                }
            }, i * 300);
        }
    }
    
    function runNetstat() {
        addOutput('Active Internet connections (w/o servers)');
        addOutput('Proto Recv-Q Send-Q Local Address           Foreign Address         State');
        addOutput('tcp        0      0 192.168.1.100:ssh       192.168.1.50:12345      ESTABLISHED');
        addOutput('tcp        0      0 192.168.1.100:http      192.168.1.50:54321      ESTABLISHED');
        addOutput('tcp        0      0 127.0.0.1:mysql         127.0.0.1:45678          ESTABLISHED');
        addOutput('tcp        0      0 192.168.1.100:https     192.168.1.50:65432      ESTABLISHED');
        addOutput('tcp        0      0 192.168.1.100:8080      192.168.1.50:76543      ESTABLISHED');
    }
    
    function runPs() {
        addOutput('  PID TTY          TIME CMD');
        addOutput(' 1234 pts/0    00:00:00 bash');
        addOutput(' 1235 pts/0    00:00:00 nmap');
        addOutput(' 1236 pts/0    00:00:00 python3');
        addOutput(' 1237 pts/0    00:00:00 metasploit');
        addOutput(' 1238 pts/0    00:00:00 apache2');
        addOutput(' 1239 pts/0    00:00:00 mysql');
        addOutput(' 1240 pts/0    00:00:00 sshd');
        addOutput(' 1241 pts/0    00:00:00 systemd');
    }
    
    function catFile(filename) {
        if (!filename) {
            addOutput('Usage: cat [filename]');
            return;
        }
        
        const fullPath = filename.startsWith('/') ? filename : `${currentDirectory}/${filename}`;
        const file = fileSystem[fullPath];
        
        if (file && file.type === 'file') {
            addOutput(file.content);
        } else {
            addOutput(`cat: ${filename}: No such file or directory`);
        }
    }
    
    function runUname(args) {
        if (args.includes('-a')) {
            addOutput('Linux kali 6.1.0-kali9-amd64 #1 SMP PREEMPT_DYNAMIC Debian 6.1.27-1kali1 (2023-12-07) x86_64 GNU/Linux');
        } else if (args.includes('-r')) {
            addOutput('6.1.0-kali9-amd64');
        } else if (args.includes('-s')) {
            addOutput('Linux');
        } else if (args.includes('-m')) {
            addOutput('x86_64');
        } else {
            addOutput('Linux');
        }
    }
    
    function runUptime() {
        const uptime = '2 days, 14 hours, 23 minutes';
        const loadAvg = '0.52, 0.34, 0.28';
        const users = '1';
        addOutput(` ${uptime},  ${users} user,  load average: ${loadAvg}`);
    }
    
    function runTop() {
        addOutput('top - 10:30:45 up 2 days, 14:23,  1 user,  load average: 0.52, 0.34, 0.28');
        addOutput('Tasks: 123 total,   1 running, 122 sleeping,   0 stopped,   0 zombie');
        addOutput('%Cpu(s):  2.3 us,  1.2 sy,  0.0 ni, 96.3 id,  0.2 wa,  0.0 hi,  0.0 si,  0.0 st');
        addOutput('MiB Mem :  8192.0 total,  2048.0 free,  3072.0 used,  3072.0 buff/cache');
        addOutput('MiB Swap:  2048.0 total,  2048.0 free,     0.0 used.  4096.0 avail Mem');
        addOutput('');
        addOutput('  PID USER      PR  NI    VIRT    RES    SHR S  %CPU  %MEM     TIME+ COMMAND');
        addOutput(' 1234 perseus   20   0  123456  12345   1234 S   2.3   0.2   0:00.12 bash');
        addOutput(' 1235 perseus   20   0  234567  23456   2345 S   1.8   0.3   0:00.08 nmap');
        addOutput(' 1236 perseus   20   0  345678  34567   3456 S   1.2   0.4   0:00.05 python3');
        addOutput(' 1237 perseus   20   0  456789  45678   4567 S   0.8   0.6   0:00.03 metasploit');
    }
    
    function runIfconfig() {
        addOutput('eth0: flags=4163<UP,BROADCAST,RUNNING,MULTICAST>  mtu 1500');
        addOutput('        inet 192.168.1.100  netmask 255.255.255.0  broadcast 192.168.1.255');
        addOutput('        inet6 fe80::1234:5678:9abc:def0  prefixlen 64  scopeid 0x20<link>');
        addOutput('        ether 00:11:22:33:44:55  txqueuelen 1000  (Ethernet)');
        addOutput('        RX packets 12345  bytes 1234567 (1.2 MB)');
        addOutput('        RX errors 0  dropped 0  overruns 0  frame 0');
        addOutput('        TX packets 12345  bytes 1234567 (1.2 MB)');
        addOutput('        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0');
        addOutput('');
        addOutput('lo: flags=73<UP,LOOPBACK,RUNNING>  mtu 65536');
        addOutput('        inet 127.0.0.1  netmask 255.0.0.0');
        addOutput('        inet6 ::1  prefixlen 128  scopeid 0x10<host>');
        addOutput('        loop  txqueuelen 1000  (Local Loopback)');
        addOutput('        RX packets 1234  bytes 123456 (123.4 KB)');
        addOutput('        RX errors 0  dropped 0  overruns 0  frame 0');
        addOutput('        TX packets 1234  bytes 123456 (123.4 KB)');
        addOutput('        TX errors 0  dropped 0 overruns 0  carrier 0  collisions 0');
    }
    
    function showHistory() {
        if (commandHistory.length === 0) {
            addOutput('No commands in history');
            return;
        }
        
        commandHistory.forEach((cmd, index) => {
            addOutput(`${(index + 1).toString().padStart(4)}  ${cmd}`);
        });
    }
    
    function runNeofetch() {
        addOutput('                    #               root@kali');
        addOutput('                   #os.            ---------------');
        addOutput('                   #s, .##, .##,    OS: Kali Linux 2023.4 x86_64');
        addOutput('                   #s, .##, .##,    Host: Virtual Machine');
        addOutput('                   #s, .##, .##,    Kernel: 6.1.0-kali9-amd64');
        addOutput('                   #s, .##, .##,    Uptime: 2 days, 14 hours, 23 minutes');
        addOutput('                   #s, .##, .##,    Packages: 1234 (dpkg)');
        addOutput('                   #s, .##, .##,    Shell: bash 5.2.15');
        addOutput('                   #s, .##, .##,    Terminal: xterm-256color');
        addOutput('                   #s, .##, .##,    CPU: Intel i7-8700K (8) @ 3.7GHz');
        addOutput('                   #s, .##, .##,    Memory: 8192MiB / 8192MiB');
        addOutput('                   #s, .##, .##,    GPU: VMware SVGA II Adapter');
        addOutput('                   #s, .##, .##,    Disk: 50GiB / 100GiB (50%)');
        addOutput('                   #s, .##, .##,    Local IP: 192.168.1.100');
        addOutput('                   #s, .##, .##,    Theme: Kali-Dark');
        addOutput('                   #s, .##, .##,    Icons: Flat-Remix-Blue-Dark');
    }
    
    function runFortune() {
        const fortunes = [
            "A bug in the hand is better than one as yet undetected.",
            "A computer scientist is someone who fixes things that aren't broken.",
            "A complex system that works is invariably found to have evolved from a simple system that worked.",
            "Any sufficiently advanced technology is indistinguishable from magic.",
            "Debugging is twice as hard as writing the code in the first place.",
            "Don't worry if it doesn't work right. If everything did, you'd be out of a job.",
            "First, solve the problem. Then, write the code.",
            "Good code is its own best documentation.",
            "It's not a bug – it's an undocumented feature.",
            "The best error message is the one that never shows up.",
            "The only way to learn a new programming language is by writing programs in it.",
            "There are only two hard things in Computer Science: cache invalidation and naming things.",
            "Unix is user-friendly. It's just very selective about who its friends are.",
            "When in doubt, use brute force.",
            "You can't trust code that you did not completely write yourself."
        ];
        
        const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
        addOutput(randomFortune);
    }
    
    function runCowsay(args) {
        const message = args.join(' ') || 'Hello from Kali Linux!';
        
        addOutput(' ________________________________________');
        addOutput('/ ' + message.padEnd(38) + ' \\');
        addOutput('\\ ' + ' '.repeat(38) + ' /');
        addOutput(' ----------------------------------------');
        addOutput('        \\   ^__^');
        addOutput('         \\  (oo)\\_______');
        addOutput('            (__)\\       )\\/\\');
        addOutput('                ||----w |');
        addOutput('                ||     ||');
    }

    function changeTheme() {
        currentTheme = (currentTheme + 1) % themes.length;
        document.documentElement.className = `dark-theme ${themes[currentTheme]}`;
        addOutput(`Theme changed to: ${themeNames[currentTheme]}`);
    }
    
    // Focus for input (not sure if this works broke it down stupidely many times)
    function focusInput(node) {
        node.focus();
    }
</script>

<div class="terminal-content theme-{themes[currentTheme]}">
    <div class="terminal-body" bind:this={terminalBody}>
        {#each commandOutput as output, index}
            {#if output.type === 'output'}
                <div class="output-line">{output.content}</div>
            {:else if output.type === 'command'}
                <div class="command-line">
                    <span class="prompt">{currentDirectory}$</span>
                    <span class="command">{output.content}</span>
                </div>
            {:else if output.type === 'prompt'}
                {#if index === commandOutput.length - 1}
                    <!-- Current prompt - interactive -->
                    <div class="prompt-line">
                        <span class="prompt">{output.content}</span>
                        <input 
                            type="text" 
                            bind:value={commandInput}
                            on:keydown={handleKeydown}
                            class="command-input"
                            placeholder=""
                            autocomplete="off"
                            spellcheck="false"
                            use:focusInput
                        />
                    </div>
                {:else}
                    <!-- Old prompt - just text this was a bitch to set up and figure out -->
                    <div class="prompt-line">
                        <span class="prompt">{output.content}</span>
                        <span class="command-input-display"></span>
                    </div>
                {/if}
            {/if}
        {/each}
        
        {#if isBooting}
            <div class="boot-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {bootProgress}%"></div>
                </div>
                <span class="progress-text">Booting Kali Linux... {Math.round(bootProgress)}%</span>
            </div>
        {/if}
        
        {#if isScanning}
            <div class="scan-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: {scanProgress}%"></div>
                </div>
                <span class="progress-text">Scanning... {scanProgress}%</span>
            </div>
        {/if}
    </div>
</div>

<style>
    /* terminal Theme CSS  */
    .terminal-content {
        background: var(--bg-color, #1a1a1a);
        color: var(--text-color, #00ff00);
        font-family: 'Courier New', monospace;
        font-size: 14px;
        line-height: 1.4;
        height: 100%;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
    }
    
    .terminal-body {
        flex: 1;
        padding: 12px;
        overflow-y: auto;
        background: var(--bg-color, #1a1a1a);
        font-family: 'Courier New', monospace;
        font-size: 14px;
    }
    
    .output-line {
        color: var(--output-color, #cccccc);
        margin-bottom: 3px;
        white-space: pre-wrap;
        font-size: 14px;
    }
    
    .command-line {
        display: flex;
        margin-bottom: 3px;
        align-items: center;
        font-size: 14px;
    }
    
    .prompt-line {
        display: flex;
        align-items: center;
        font-size: 14px;
    }
    
    .prompt {
        color: var(--prompt-color, #00ff00);
        margin-right: 8px;
        font-weight: bold;
        font-size: 14px;
    }
    
    .command {
        color: var(--command-color, #ffffff);
        font-size: 14px;
    }
    
    .command-input {
        background: transparent;
        border: none;
        color: var(--command-color, #ffffff);
        font-family: 'Courier New', monospace;
        font-size: 14px;
        outline: none;
        flex: 1;
        caret-color: var(--prompt-color, #00ff00);
    }
    
    .command-input::placeholder {
        color: transparent;
    }
    
    .boot-progress {
        margin-top: 8px;
        padding: 12px;
        background: linear-gradient(135deg, var(--bg-color, #1a1a1a) 0%, var(--bg-secondary, #2a2a2a) 100%);
        border-radius: 6px;
        border: 1px solid var(--prompt-color, #00ff00);
        box-shadow: 0 2px 8px rgba(0, 255, 0, 0.1);
    }
    
    .scan-progress {
        margin-top: 8px;
        padding: 8px;
        background: var(--bg-secondary, #2a2a2a);
        border-radius: 4px;
    }
    
    .progress-bar {
        width: 100%;
        height: 6px;
        background: var(--bg-color, #1a1a1a);
        border-radius: 3px;
        overflow: hidden;
        margin-bottom: 6px;
        border: 1px solid var(--border-color, #333);
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, var(--prompt-color, #00ff00) 0%, var(--prompt-secondary, #00cc00) 100%);
        transition: width 0.4s ease;
        box-shadow: 0 0 8px rgba(0, 255, 0, 0.3);
    }
    
    .progress-text {
        font-size: 11px;
        color: var(--prompt-color, #00ff00);
        font-weight: bold;
        text-shadow: 0 0 4px rgba(0, 255, 0, 0.5);
    }
    
    /* Scrollbar styling */
    .terminal-body::-webkit-scrollbar {
        width: 8px;
    }
    
    .terminal-body::-webkit-scrollbar-track {
        background: var(--bg-color, #1a1a1a);
    }
    
    .terminal-body::-webkit-scrollbar-thumb {
        background: var(--border-color, #333333);
        border-radius: 4px;
    }
    
    .terminal-body::-webkit-scrollbar-thumb:hover {
        background: var(--border-hover, #555555);
    }
    
    /* Themes */
    .theme-dracula {
        --bg-color: #282a36;
        --bg-secondary: #44475a;
        --text-color: #f8f8f2;
        --output-color: #f8f8f2;
        --prompt-color: #50fa7b;
        --prompt-secondary: #69ff94;
        --command-color: #ff79c6;
        --border-color: #6272a4;
        --border-hover: #bd93f9;
    }
    
    .theme-solarized {
        --bg-color: #002b36;
        --bg-secondary: #073642;
        --text-color: #839496;
        --output-color: #93a1a1;
        --prompt-color: #859900;
        --prompt-secondary: #b58900;
        --command-color: #268bd2;
        --border-color: #586e75;
        --border-hover: #657b83;
    }
    
    .theme-onedark {
        --bg-color: #282c34;
        --bg-secondary: #3e4451;
        --text-color: #abb2bf;
        --output-color: #abb2bf;
        --prompt-color: #98c379;
        --prompt-secondary: #7cb342;
        --command-color: #61afef;
        --border-color: #5c6370;
        --border-hover: #7f848e;
    }
    
    .theme-material {
        --bg-color: #263238;
        --bg-secondary: #37474f;
        --text-color: #eeffff;
        --output-color: #b2ccd6;
        --prompt-color: #c3e88d;
        --prompt-secondary: #f07178;
        --command-color: #89ddff;
        --border-color: #546e7a;
        --border-hover: #78909c;
    }
    
    .theme-gruvbox {
        --bg-color: #282828;
        --bg-secondary: #3c3836;
        --text-color: #ebdbb2;
        --output-color: #d5c4a1;
        --prompt-color: #b8bb26;
        --prompt-secondary: #98971a;
        --command-color: #83a598;
        --border-color: #504945;
        --border-hover: #665c54;
    }
</style> 