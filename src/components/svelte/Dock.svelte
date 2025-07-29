<script>
    import { APPS, windowManager } from '../store.js';
    
    let apps = [];
    let iconCache = {};
    
    APPS.subscribe(value => {
        apps = value;
    });
    
    async function loadIcon(iconName) {
        if (iconCache[iconName]) {
            return iconCache[iconName];
        }
        
        try {
            // Loads from brands first but just in case it doesn't work it has nasty emojis as fallback
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
        
        // Fallback to emoji (disgusting)
        const fallbackIcons = {
            'user': '👤',
            'folder': '📁',
            'ellipses-horizontal': '🐍',
            'message': '📧',
            'github': '🐙',
            'code': '💻'
        };
        return fallbackIcons[iconName] || '❓';
    }
    
    function openApp(app) {
        if (app.id === 'Github') {
            // Redirect to GitHub
            window.open('https://github.com/yourusername', '_blank');
        } else if (app.id === 'Notes') {
            // Navigate to blog page
            window.location.href = '/blog';
        } else {
            windowManager.open(app);
        }
    }
</script>

<div class="dock-container">
    <div class="dock">
        {#each apps as app}
            <button 
                class="dock-item" 
                on:click={() => openApp(app)}
                on:mouseenter={(e) => e.currentTarget.classList.add('hover')}
                on:mouseleave={(e) => e.currentTarget.classList.remove('hover')}
                on:keydown={(e) => e.key === 'Enter' && openApp(app)}
                aria-label="Open {app.title}"
                type="button"
            >
                <div class="dock-icon">
                    {#await loadIcon(app.icon)}
                        <span class="icon-text">⏳</span>
                    {:then svgContent}
                        {@html svgContent}
                    {:catch}
                        <span class="icon-text">{app.icon}</span>
                    {/await}
                </div>
                <div class="dock-label">{app.title}</div>
            </button>
        {/each}
    </div>
</div>

<style>
    .dock-container {
        position: fixed;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        z-index: 1000;
    }
    
    .dock {
        display: flex;
        align-items: flex-end;
        background: var(--surface-color);
        border: 3px outset var(--border-color);
        border-top: 3px outset var(--border-color);
        border-left: 3px outset var(--border-color);
        border-right: 3px outset var(--border-color);
        border-bottom: none;
        border-radius: 8px 8px 0 0;
        padding: 8px 20px 12px 20px;
        box-shadow: 
            inset 2px 2px 4px rgba(255, 255, 255, 0.8),
            inset -2px -2px 4px rgba(0, 0, 0, 0.3),
            0 -4px 8px var(--shadow-color);
        gap: 8px;
        position: relative;
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .dock::before {
        content: '';
        position: absolute;
        top: 2px;
        left: 2px;
        right: 2px;
        bottom: 0;
        background: var(--bg-color);
        border-radius: 5px 5px 0 0;
        pointer-events: none;
        transition: background-color 0.3s ease;
    }
    
    .dock-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        cursor: pointer;
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        position: relative;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: inherit;
    }
    
    .dock-item:hover {
        transform: translateY(-5px) scale(1.05);
    }
    
    .dock-icon {
        width: 60px;
        height: 60px;
        background: var(--surface-color);
        border: 2px outset var(--border-color);
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 8px;
        transition: all 0.2s ease;
        box-shadow: 
            inset 1px 1px 2px rgba(255, 255, 255, 0.9),
            inset -1px -1px 2px rgba(0, 0, 0, 0.2);
        position: relative;
        z-index: 1;
    }
    
    .dock-icon::before {
        content: '';
        position: absolute;
        top: 1px;
        left: 1px;
        right: 1px;
        bottom: 1px;
        background: var(--bg-color);
        border-radius: 2px;
        pointer-events: none;
        z-index: -1;
        transition: background-color 0.3s ease;
    }
    
    .dock-item:hover .dock-icon {
        background: var(--bg-color);
        border: 2px inset var(--border-color);
        box-shadow: 
            inset 2px 2px 4px rgba(0, 0, 0, 0.2),
            inset -1px -1px 2px rgba(255, 255, 255, 0.5);
        transform: scale(1.1) translateY(-3px);
    }
    
    .icon-text {
        font-size: 2em;
        line-height: 1;
        position: relative;
        z-index: 2;
    }
    
    .dock-icon :global(svg) {
        width: 32px;
        height: 32px;
        fill: var(--font-color);
        position: relative;
        z-index: 2;
        transition: fill 0.3s ease;
    }
    
    .dock-label {
        font-size: 0.85em;
        color: var(--font-color);
        background: var(--bg-color);
        border: 2px outset var(--bg-color);
        border-radius: 4px;
        padding: 8px 12px;
        white-space: nowrap;
        opacity: 0;
        transform: translateY(10px);
        transition: all 0.2s ease;
        position: absolute;
        bottom: 80px;
        left: 50%;
        transform: translateX(-50%) translateY(10px);
        box-shadow: 
            inset 2px 2px 4px rgba(255, 255, 255, 0.8),
            inset -2px -2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px var(--shadow-color);
        font-weight: normal;
        font-family: 'VT323', monospace;
    }
    
    .dock-item:hover .dock-label {
        opacity: 1;
        transform: translateX(-50%) translateY(0);
    }
    
    /* Magnification effect */
    .dock-item:hover + .dock-item .dock-icon {
        transform: scale(1.03);
    }
    
    .dock-item:hover + .dock-item + .dock-item .dock-icon {
        transform: scale(1.01);
    }
    
    /* Reverse direction */
    .dock-item:hover ~ .dock-item .dock-icon {
        transform: scale(1.03);
    }
    
    .dock-item:hover ~ .dock-item ~ .dock-item .dock-icon {
        transform: scale(1.01);
    }
    

    
    /* Responsive stuff (probably will have to fix to work on mobile) */
    @media (max-width: 768px) {
        .dock {
            padding: 8px 12px;
            gap: 4px;
        }
        
        .dock-icon {
            width: 50px;
            height: 50px;
        }
        
        .icon-text {
            font-size: 1.5em;
        }
        
        .dock-label {
            font-size: 0.7em;
            padding: 2px 6px;
        }
    }
</style> 