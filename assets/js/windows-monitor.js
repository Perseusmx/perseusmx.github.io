// The Windows 98-style monitor simulation
document.addEventListener('DOMContentLoaded', function() {
    const startButton = document.getElementById('startButton');
    const startMenu = document.getElementById('startMenu');
    const programsMenu = document.getElementById('programsMenu');
    const desktopIcons = document.querySelectorAll('.desktop-icon');
    const menuItems = document.querySelectorAll('.menu-item');

    // Handle the start button clicks
    startButton.addEventListener('click', function(e) {
        e.stopPropagation();
        startMenu.classList.toggle('active');
        programsMenu.classList.remove('active');
    });

    // Close menus when clicking elsewhere
    document.addEventListener('click', function(e) {
        if (!startMenu.contains(e.target) && !startButton.contains(e.target)) {
            startMenu.classList.remove('active');
            programsMenu.classList.remove('active');
        }
    });

    // Handle desktop icon clicks
    desktopIcons.forEach(icon => {
        icon.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            handleDesktopIcon(target);
        });

        icon.addEventListener('dblclick', function() {
            const target = this.getAttribute('data-target');
            handleDesktopIconDoubleClick(target);
        });
    });

    // Handle menu item clicks
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.stopPropagation();
            const target = this.getAttribute('data-target');
            handleMenuItem(target);
        });
    });

    // Handle single clicks on desktop icons
    function handleDesktopIcon(target) {
        // Clear any existing selections
        desktopIcons.forEach(icon => icon.classList.remove('selected'));
        
        // Select the clicked icon
        event.target.closest('.desktop-icon').classList.add('selected');
        
        // Do different things for different icons
        switch(target) {
            case 'my-computer':
                showMessage('My Computer', 'This would open My Computer in a real Windows 95 system.');
                break;
            case 'recycle-bin':
                showMessage('Recycle Bin', 'This would open the Recycle Bin in a real Windows 95 system.');
                break;
            case 'network-neighborhood':
                showMessage('Network Neighborhood', 'This would open Network Neighborhood in a real Windows 95 system.');
                break;
            case 'my-documents':
                showMessage('My Documents', 'This would open My Documents in a real Windows 95 system.');
                break;
        }
    }

    // Handle double clicks on desktop icons
    function handleDesktopIconDoubleClick(target) {
        switch(target) {
            case 'my-computer':
                showMessage('My Computer', 'Double-clicked! This would open My Computer in a real Windows 95 system.');
                break;
            case 'recycle-bin':
                showMessage('Recycle Bin', 'Double-clicked! This would open the Recycle Bin in a real Windows 95 system.');
                break;
            case 'network-neighborhood':
                showMessage('Network Neighborhood', 'Double-clicked! This would open Network Neighborhood in a real Windows 95 system.');
                break;
            case 'my-documents':
                showMessage('My Documents', 'Double-clicked! This would open My Documents in a real Windows 95 system.');
                break;
        }
    }

    // Handle clicks on menu items
    function handleMenuItem(target) {
        switch(target) {
            case 'programs':
                startMenu.classList.remove('active');
                programsMenu.classList.add('active');
                break;
            case 'documents':
                showMessage('Documents', 'This would open Documents in a real Windows 95 system.');
                startMenu.classList.remove('active');
                break;
            case 'settings':
                showMessage('Settings', 'This would open Settings in a real Windows 95 system.');
                startMenu.classList.remove('active');
                break;
            case 'find':
                showMessage('Find', 'This would open Find in a real Windows 95 system.');
                startMenu.classList.remove('active');
                break;
            case 'help':
                showMessage('Help', 'This would open Help in a real Windows 95 system.');
                startMenu.classList.remove('active');
                break;
            case 'run':
                showMessage('Run', 'This would open the Run dialog in a real Windows 95 system.');
                startMenu.classList.remove('active');
                break;
            case 'shutdown':
                handleShutdown();
                break;
            // Items in the programs menu
            case 'solitaire':
                showMessage('Solitaire', 'Card games are for breaks between hacking sessions! 🃏');
                programsMenu.classList.remove('active');
                break;
            case 'minesweeper':
                showMessage('Minesweeper', 'Finding real security vulnerabilities is more fun! 💣');
                programsMenu.classList.remove('active');
                break;
            case 'paint':
                showMessage('Paint', 'Draw your network diagrams here (when implemented) 🎨');
                programsMenu.classList.remove('active');
                break;
            case 'notepad':
                showMessage('Notepad', 'Perfect for taking hacking notes 📝');
                programsMenu.classList.remove('active');
                break;
            case 'calculator':
                showMessage('Calculator', 'Hex calculator coming soon... 🧮');
                programsMenu.classList.remove('active');
                break;
            case 'wordpad':
                showMessage('WordPad', 'This would open WordPad in a real Windows 95 system.');
                programsMenu.classList.remove('active');
                break;
            case 'nmap':
                showMessage('Nmap', 'Network mapper - essential for reconnaissance! 🔍');
                programsMenu.classList.remove('active');
                break;
            case 'wireshark':
                showMessage('Wireshark', 'Packet analysis tool - see what\'s on the wire! 📡');
                programsMenu.classList.remove('active');
                break;
            case 'metasploit':
                showMessage('Metasploit', 'Penetration testing framework - use responsibly! ⚔️');
                programsMenu.classList.remove('active');
                break;
            case 'control-panel':
                showMessage('Control Panel', 'This would open Control Panel in a real Windows 95 system.');
                programsMenu.classList.remove('active');
                break;
            case 'explorer':
                showMessage('Windows Explorer', 'This would open Windows Explorer in a real Windows 95 system.');
                programsMenu.classList.remove('active');
                break;
        }
    }

    // Show a Windows 95-style popup message
    function showMessage(title, message) {
        // Get rid of any existing message boxes
        const existingBoxes = document.querySelectorAll('.message-box');
        existingBoxes.forEach(box => box.remove());

        const messageBox = document.createElement('div');
        messageBox.className = 'message-box';
        messageBox.innerHTML = `
            <div class="message-header">
                <span class="message-icon">ℹ️</span>
                <span class="message-title">${title}</span>
                <span class="message-close" onclick="this.parentElement.parentElement.remove()">✕</span>
            </div>
            <div class="message-content">
                <p>${message}</p>
            </div>
            <div class="message-footer">
                <button onclick="this.parentElement.parentElement.remove()">OK</button>
            </div>
        `;

        document.body.appendChild(messageBox);

        // Remove the message after 5 seconds
        setTimeout(() => {
            if (messageBox.parentElement) {
                messageBox.remove();
            }
        }, 5000);
    }

    // Handle the shutdown button
    function handleShutdown() {
        const shutdownBox = document.createElement('div');
        shutdownBox.className = 'message-box';
        shutdownBox.innerHTML = `
            <div class="message-header">
                <span class="message-icon">⚠️</span>
                <span class="message-title">Shut Down Windows</span>
                <span class="message-close" onclick="this.parentElement.parentElement.remove()">✕</span>
            </div>
            <div class="message-content">
                <p>Are you sure you want to shut down your computer?</p>
            </div>
            <div class="message-footer">
                <button onclick="this.parentElement.parentElement.remove()">Cancel</button>
                <button onclick="shutdownComputer()" style="margin-left: 10px;">Yes</button>
            </div>
        `;

        document.body.appendChild(shutdownBox);
        startMenu.classList.remove('active');
    }

    // Shutdown effect
    window.shutdownComputer = function() {
        const overlay = document.createElement('div');
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: #000;
            z-index: 9999;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-family: 'Courier New', monospace;
            font-size: 16px;
        `;
        overlay.textContent = 'It is now safe to turn off your computer.';
        document.body.appendChild(overlay);

        setTimeout(() => {
            overlay.remove();
        }, 3000);
    };

    // Add message box styles
    const style = document.createElement('style');
    style.textContent = `
        .message-box {
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            width: 300px;
            background: #c0c0c0;
            border: 2px solid #fff;
            border-right: 2px solid #808080;
            border-bottom: 2px solid #808080;
            border-left: 2px solid #fff;
            box-shadow: 2px 2px 4px rgba(0,0,0,0.3);
            z-index: 2000;
            font-family: "MS Sans Serif", "Microsoft Sans Serif", sans-serif;
        }

        .message-header {
            display: flex;
            align-items: center;
            padding: 8px;
            background: #000080;
            color: #fff;
            border-bottom: 1px solid #808080;
        }

        .message-icon {
            margin-right: 8px;
            font-size: 16px;
        }

        .message-title {
            flex: 1;
            font-weight: bold;
            font-size: 12px;
        }

        .message-close {
            cursor: pointer;
            padding: 2px 6px;
            background: #c0c0c0;
            color: #000;
            font-size: 10px;
            font-weight: bold;
            border: 1px solid #fff;
            border-right: 1px solid #808080;
            border-bottom: 1px solid #808080;
            border-left: 1px solid #fff;
        }

        .message-close:hover {
            background: #d0d0d0;
        }

        .message-content {
            padding: 16px;
            background: #c0c0c0;
            color: #000;
            font-size: 11px;
            line-height: 1.4;
        }

        .message-footer {
            padding: 8px;
            background: #c0c0c0;
            border-top: 1px solid #808080;
            text-align: center;
        }

        .message-footer button {
            padding: 4px 16px;
            background: #c0c0c0;
            border: 2px solid #fff;
            border-right: 2px solid #808080;
            border-bottom: 2px solid #808080;
            border-left: 2px solid #fff;
            cursor: pointer;
            font-family: "MS Sans Serif", "Microsoft Sans Serif", sans-serif;
            font-size: 11px;
            font-weight: bold;
            color: #000;
        }

        .message-footer button:hover {
            background: #d0d0d0;
        }

        .message-footer button:active {
            border: 2px solid #808080;
            border-right: 2px solid #fff;
            border-bottom: 2px solid #fff;
            border-left: 2px solid #808080;
        }
    `;
    document.head.appendChild(style);
}); 