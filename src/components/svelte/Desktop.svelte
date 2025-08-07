<script>
    import { onMount } from 'svelte';
    import { windowManager } from '../store.js';
    import Window from './Window.svelte';
    import Dock from './Dock.svelte';
    
    let windows = [];
    let activeWindowId = null;
    let currentTime = new Date().toLocaleTimeString();
    let isDarkTheme = false;
    let iconCache = {};

    
    windowManager.subscribe(state => {
        windows = state.windows;
        activeWindowId = state.activeWindowId;
    });
    
    // Update time every second, because why NOT
    setInterval(() => {
        currentTime = new Date().toLocaleTimeString();
    }, 1000);
    
    // Load theme preference from localStorage
    onMount(() => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            isDarkTheme = true;
            document.documentElement.classList.add('dark-theme');
        }
        
        // Auto-open About window after a short delay
        setTimeout(() => {
            windowManager.open({ id: 'About', title: '~About', icon: 'user' });
        }, 500);
    });
    
    async function loadIcon(iconName) {
        if (iconCache[iconName]) {
            return iconCache[iconName];
        }
        
        try {
            const iconPath = `/icons/SVG/regular/${iconName}.svg`;
            const response = await fetch(iconPath);
            if (response.ok) {
                const svgContent = await response.text();
                iconCache[iconName] = svgContent;
                return svgContent;
            }
        } catch (error) {
            console.warn(`Failed to load icon: ${iconName}`, error);
        }
        
        return '🌙'; // Fallback
    }
    
    function toggleTheme() {
        isDarkTheme = !isDarkTheme;
        
        if (isDarkTheme) {
            document.documentElement.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
        } else {
            document.documentElement.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
        }
    }
</script>

<div class="desktop">
    <!-- System Tray Header -->
    <div class="system-tray">
        <div class="tray-left">
            <span class="welcome-text">Welcome to my page</span>
        </div>
        <div class="tray-center">
            <span class="copyright-text">
                Perseus © 2024 Built with 
                <a href="https://astro.build" target="_blank" rel="noopener noreferrer">Astro</a> & 
                <a href="https://svelte.dev" target="_blank" rel="noopener noreferrer">Svelte</a>
            </span>
        </div>
        <div class="tray-right">
            <button 
                class="theme-pill" 
                on:click={toggleTheme} 
                on:keydown={(e) => e.key === 'Enter' && toggleTheme()}
                aria-label="Toggle theme"
                type="button"
            >
                <div class="pill-track">
                    <div class="pill-slider" class:dark={isDarkTheme}>
                        {#await loadIcon(isDarkTheme ? 'sun' : 'moon')}
                            <span class="icon-text">⏳</span>
                        {:then svgContent}
                            {@html svgContent}
                        {:catch}
                            <span class="icon-text">{isDarkTheme ? '☀️' : '🌙'}</span>
                        {/await}
                    </div>
                </div>
            </button>
            <span class="time-display">{currentTime}</span>
        </div>
    </div>
    
    <!-- Sticky Note -->
    <div class="sticky-note">
        <div class="sticky-content">
            <h3>📝 Work in Progress</h3>
            <p>This is a testbed/portfolio site, but most of the stuff actually works!</p>
            <p>Feel free to explore the terminal and other features.</p>
        </div>
    </div>
    
    <!-- Render all windows -->
    {#each windows as window (window.id)}
        {#if !window.isMinimized}
            <Window {window} />
        {/if}
    {/each}
    
    <!-- Dock at the bottom -->
    <Dock />
</div>

<style>
    .desktop {
        position: relative;
        width: 100vw;
        height: 100vh;
        overflow: hidden;
        background-color: var(--bg-color);
        		background-image: url('/images/ocean-wallpaper.webp');
		/* Fallback for browsers that don't support WebP */
		@supports not (background-image: url('/images/ocean-wallpaper.webp')) {
			background-image: url('/images/ocean-wallpaper-optimized.png');
		}
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        background-attachment: fixed;
    }
    
    .desktop::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0);
        transition: background 0.3s ease;
        pointer-events: none;
        z-index: 0;
    }
    
    :global(.dark-theme) .desktop::before {
        background: rgba(0, 0, 0, 0.4);
    }
    
    .system-tray {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        height: 30px;
        background: rgba(var(--surface-color-rgb), 0.95);
        border-bottom: 2px solid var(--border-color);
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 12px;
        font-family: 'VT323', monospace;
        font-size: 14px;
        z-index: 1001;
        box-shadow: 0 2px 4px var(--shadow-color);
        backdrop-filter: blur(2px);
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .tray-left {
        display: flex;
        align-items: center;
        flex: 1;
    }
    
    .tray-center {
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
    }
    
    .tray-right {
        display: flex;
        align-items: center;
        gap: 12px;
        flex: 1;
        justify-content: flex-end;
    }
    
    .welcome-text {
        color: var(--font-color);
        font-weight: normal;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.8);
        transition: color 0.3s ease;
        font-size: 14px;
    }
    
    .copyright-text {
        color: var(--font-color);
        font-size: 10px;
        opacity: 0.8;
        text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.6);
        transition: color 0.3s ease;
    }
    
    .copyright-text a {
        color: var(--font-color);
        text-decoration: underline;
        transition: color 0.3s ease;
    }
    
    .copyright-text a:hover {
        color: #007acc;
        text-shadow: 1px 1px 2px rgba(0, 122, 204, 0.8);
    }
    
    /* Sticky Note Styles */
    .sticky-note {
        position: fixed;
        top: 120px;
        right: 30px;
        width: 200px;
        background: #fef7b0;
        border: 1px solid #d4c365;
        border-radius: 2px;
        box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.2),
            0 4px 8px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        transform: rotate(2deg);
        pointer-events: none;
        font-family: 'VT323', monospace;
    }
    
    /* Mobile responsive sticky note */
    @media (max-width: 768px) {
        .sticky-note {
            top: 80px;
            right: 10px;
            width: 150px;
            transform: rotate(1deg);
        }
    }
    
    .sticky-note::before {
        content: '';
        position: absolute;
        top: -8px;
        left: 50%;
        transform: translateX(-50%);
        width: 0;
        height: 0;
        border-left: 8px solid transparent;
        border-right: 8px solid transparent;
        border-bottom: 8px solid #d4c365;
    }
    
    .sticky-content {
        padding: 15px;
        color: #1a1a1a;
        font-size: 14px;
        line-height: 1.4;
    }
    
    .sticky-content h3 {
        margin: 0 0 10px 0;
        font-size: 16px;
        color: #5d4a1a;
        font-weight: normal;
    }
    
    .sticky-content p {
        margin: 0 0 8px 0;
        font-size: 12px;
    }
    
    .sticky-content p:last-child {
        margin-bottom: 0;
    }
    
    .theme-pill {
        cursor: pointer;
        user-select: none;
        background: none;
        border: none;
        padding: 0;
        margin: 0;
        font-family: inherit;
        font-size: inherit;
        color: inherit;
        outline: none;
    }
    
    .theme-pill:focus {
        outline: 2px solid var(--border-color);
        outline-offset: 2px;
    }
    
    .pill-track {
        width: 44px;
        height: 20px;
        background: rgba(var(--bg-color-rgb), 0.95);
        border: 1px solid var(--border-color);
        border-radius: 12px;
        position: relative;
        transition: all 0.3s ease;
        backdrop-filter: blur(2px);
    }
    
    .pill-slider {
        width: 18px;
        height: 16px;
        background: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 10px;
        position: absolute;
        top: 1px;
        left: 1px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.3s ease;
        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    
    .pill-slider.dark {
        transform: translateX(24px);
        background: var(--font-color);
    }
    
    .pill-slider :global(svg) {
        width: 12px;
        height: 12px;
        fill: var(--font-color);
        transition: fill 0.3s ease;
    }
    
    .pill-slider.dark :global(svg) {
        fill: var(--bg-color);
    }
    
    .theme-pill:hover .pill-track {
        background: rgba(168, 192, 208, 0.95);
    }
    
    .time-display {
        color: var(--font-color);
        font-weight: normal;
        background: rgba(var(--bg-color-rgb), 0.95);
        border: 1px inset var(--border-color);
        padding: 2px 8px;
        border-radius: 3px;
        box-shadow: 
            inset 1px 1px 2px rgba(255, 255, 255, 0.8),
            inset -1px -1px 2px rgba(0, 0, 0, 0.2);
        backdrop-filter: blur(2px);
        transition: color 0.3s ease, background-color 0.3s ease, border-color 0.3s ease;
    }
</style> 