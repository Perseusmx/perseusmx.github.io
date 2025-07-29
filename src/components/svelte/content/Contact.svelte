<script>
    // Contact stuff
    let iconCache = {};
    
    async function loadIcon(iconName) {
        if (iconCache[iconName]) {
            return iconCache[iconName];
        }
        
        try {
            let iconPath = '';
            if (iconName === 'github') {
                iconPath = '/node_modules/@hackernoon/pixel-icon-library/icons/SVG/brands/github.svg';
            } else {
                iconPath = `/node_modules/@hackernoon/pixel-icon-library/icons/SVG/regular/${iconName}.svg`;
            }
            
            const response = await fetch(iconPath);
            if (response.ok) {
                const svgContent = await response.text();
                iconCache[iconName] = svgContent;
                return svgContent;
            }
        } catch (error) {
            console.warn(`Failed to load icon: ${iconName}`, error);
        }
        
        // Fallback to emoji
        const fallbackIcons = {
            'envelope': '📧',
            'phone-ringing-high': '📱',
            'code': '💻',
            'github': '🐙'
        };
        return fallbackIcons[iconName] || '❓';
    }
    
    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            // Could add a toast notification here
            console.log('Copied to clipboard:', text);
        });
    }
</script>

<div class="contact-content">
    <h2>Contact Me</h2>
    
    <div class="contact-methods">
        <div class="contact-item">
            <div class="contact-header">
                {#await loadIcon('envelope')}
                    <span class="icon-text">⏳</span>
                {:then svgContent}
                    {@html svgContent}
                {:catch}
                    <span class="icon-text">📧</span>
                {/await}
                <h3>Email</h3>
            </div>
            <p>p3rseus@mailbox.org</p>
            <button class="copy-btn" on:click={() => copyToClipboard('p3rseus@mailbox.org')}>
                Copy Email
            </button>
        </div>
        
        <div class="contact-item">
            <div class="contact-header">
                {#await loadIcon('phone-ringing-high')}
                    <span class="icon-text">⏳</span>
                {:then svgContent}
                    {@html svgContent}
                {:catch}
                    <span class="icon-text">📱</span>
                {/await}
                <h3>Phone</h3>
            </div>
            <p>I'd prefer if you'd email me first.</p>
        </div>
        
        <div class="contact-item">
            <div class="contact-header">
                {#await loadIcon('code')}
                    <span class="icon-text">⏳</span>
                {:then svgContent}
                    {@html svgContent}
                {:catch}
                    <span class="icon-text">💻</span>
                {/await}
                <h3>TryHackMe</h3>
            </div>
            <a href="https://tryhackme.com/p/perseus5" target="_blank" rel="noopener noreferrer" class="contact-link">
                tryhackme.com/p/perseus5
            </a>
        </div>
        
        <div class="contact-item">
            <div class="contact-header">
                {#await loadIcon('github')}
                    <span class="icon-text">⏳</span>
                {:then svgContent}
                    {@html svgContent}
                {:catch}
                    <span class="icon-text">🐙</span>
                {/await}
                <h3>GitHub</h3>
            </div>
            <a href="https://github.com/perseusmx" target="_blank" rel="noopener noreferrer" class="contact-link">
                github.com/perseusmx
            </a>
        </div>
    </div>
    
    <div class="contact-note">
        <p>Feel free to reach out, or just to say hello!</p>
    </div>
</div>

<style>
    .contact-content {
        padding: 20px;
        font-family: 'VT323', monospace;
        transition: color 0.3s ease;
    }
    
    h2 {
        color: var(--font-color);
        margin-bottom: 20px;
        font-size: 1.5em;
        transition: color 0.3s ease;
    }
    
    .contact-methods {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .contact-item {
        background: var(--surface-color);
        border: 2px inset var(--border-color);
        padding: 15px;
        border-radius: 6px;
        transition: all 0.2s ease;
    }
    
    .contact-item:hover {
        transform: translateY(-2px);
        box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.2);
    }
    
    .contact-header {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
    }
    
    .contact-header :global(svg) {
        width: 20px;
        height: 20px;
        fill: var(--font-color);
        transition: fill 0.3s ease;
    }
    
    .icon-text {
        font-size: 20px;
    }
    
    .contact-item h3 {
        margin: 0;
        font-size: 1.1em;
        color: var(--font-color);
        transition: color 0.3s ease;
    }
    
    .contact-item p {
        margin: 0 0 8px 0;
        color: var(--font-color);
        font-size: 0.9em;
        transition: color 0.3s ease;
    }
    
    .contact-link {
        color: #007acc;
        text-decoration: none;
        font-size: 0.9em;
        transition: color 0.2s ease;
    }
    
    .contact-link:hover {
        color: #005a9e;
        text-decoration: underline;
    }
    
    .copy-btn {
        background-color: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
        padding: 4px 8px;
        font-family: 'VT323', monospace;
        font-size: 0.8em;
        cursor: pointer;
        transition: all 0.2s ease;
        color: var(--font-color);
    }
    
    .copy-btn:hover {
        background-color: var(--header-color);
        transform: scale(1.05);
    }
    
    .contact-note {
        margin-top: 20px;
        padding: 15px;
        background: var(--surface-color);
        border: 1px inset var(--border-color);
        border-radius: 6px;
    }
    
    .contact-note p {
        margin: 0;
        font-size: 0.9em;
        color: var(--font-color);
        transition: color 0.3s ease;
    }
</style> 