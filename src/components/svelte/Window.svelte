<script>
    import { createEventDispatcher } from 'svelte';
    import { windowManager } from '../store.js';
    
    export let window;
    
    const dispatch = createEventDispatcher();
    
    let isDragging = false;
    let dragOffset = { x: 0, y: 0 };
    let windowElement;
    let iconCache = {};
    
    async function loadIcon(iconName) {
        if (iconCache[iconName]) {
            return iconCache[iconName];
        }
        
        try {
            let iconPath = '';
            if (iconName === 'github') {
                iconPath = '/icons/SVG/brands/github.svg';
            } else {
                iconPath = `/icons/SVG/regular/${iconName}.svg`;
            }
            
            const response = await fetch(iconPath);
            const svgContent = await response.text();
            iconCache[iconName] = svgContent;
            return svgContent;
        } catch (error) {
            console.warn(`Failed to load icon: ${iconName}`, error);
            return null;
        }
    }
    
    function handleMouseDown(event) {
        // Don't start dragging if clicking on window controls
        if (event.target.closest('.window-controls')) return;
        
        isDragging = true;
        const rect = windowElement.getBoundingClientRect();
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        
        dragOffset = {
            x: clientX - rect.left,
            y: clientY - rect.top
        };
        
        windowManager.focus(window.id);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchmove', handleTouchMove, { passive: false });
        document.addEventListener('touchend', handleTouchEnd);
    }
    
    function handleMouseMove(event) {
        if (!isDragging) return;
        
        const clientX = event.touches ? event.touches[0].clientX : event.clientX;
        const clientY = event.touches ? event.touches[0].clientY : event.clientY;
        
        const newX = clientX - dragOffset.x;
        const newY = clientY - dragOffset.y;
        
        // Update window position in store
        windowManager.updatePosition(window.id, { x: newX, y: newY });
    }
    
    function handleTouchMove(event) {
        if (!isDragging) return;
        event.preventDefault(); // Prevent scrolling while dragging
        handleMouseMove(event);
    }
    
    function handleMouseUp() {
        isDragging = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
    }
    
    function handleTouchEnd() {
        handleMouseUp();
    }
    
    function closeWindow() {
        windowManager.close(window.id);
    }
    
    function minimizeWindow() {
        windowManager.toggleMinimize(window.id);
    }
</script>

    <div 
        class="window {isDragging ? 'dragging' : ''}"
        style="left: {window.position.x}px; top: {window.position.y}px; width: {window.size.width}px; height: {window.size.height}px; z-index: {window.zIndex};"
        bind:this={windowElement}
        role="application"
        aria-label="{window.title} window"
    >
    <div 
        class="title-bar" 
        on:mousedown={handleMouseDown}
        on:touchstart={handleMouseDown}
        on:keydown={(e) => e.key === 'Enter' && handleMouseDown(e)}
        role="button"
        tabindex="0"
        aria-label="Drag to move {window.title} window"
    >
        <div class="title-bar-grip">
            <div class="grip-line"></div>
            <div class="grip-line"></div>
            <div class="grip-line"></div>
        </div>
        <div class="window-title">
            {#await loadIcon(window.icon)}
                <span class="icon-text">⏳</span>
            {:then svgContent}
                {@html svgContent}
            {:catch}
                <span class="icon-text">{window.icon}</span>
            {/await}
            {window.title}
        </div>
        <div class="window-controls">
            <button class="control-btn minimize" on:click={minimizeWindow}>
                <span>−</span>
            </button>
            <button class="control-btn close" on:click={closeWindow}>
                <span>×</span>
            </button>
        </div>
    </div>
    
    <div class="window-content">
        <svelte:component this={window.component} />
    </div>
</div>

<style>
    .window {
        position: absolute;
        background-color: var(--surface-color);
        border: 3px solid var(--border-color);
        border-radius: 8px;
        box-shadow: 5px 5px 0 var(--shadow-color);
        overflow: hidden;
        cursor: default;
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .window.dragging {
        cursor: grabbing;
    }
    
    .title-bar {
        display: flex;
        align-items: center;
        background-color: var(--header-color);
        border-bottom: 2px solid var(--border-color);
        padding: 8px 12px;
        cursor: grab;
        min-height: 32px;
        transition: background-color 0.3s ease, border-color 0.3s ease;
    }
    
    .title-bar:active {
        cursor: grabbing;
    }
    
    .title-bar-grip {
        display: flex;
        flex-direction: column;
        gap: 2px;
        margin-right: 12px;
    }
    
    .grip-line {
        width: 16px;
        height: 2px;
        background-color: var(--border-color);
        border-radius: 1px;
    }
    
    .window-title {
        flex: 1;
        font-weight: bold;
        font-size: 1.1em;
        color: var(--font-color);
        display: flex;
        align-items: center;
        gap: 8px;
    }
    
    .window-title :global(svg) {
        width: 16px;
        height: 16px;
        fill: var(--font-color);
    }
    
    .icon-text {
        font-size: 14px;
        margin-right: 4px;
    }
    
    .window-controls {
        display: flex;
        gap: 8px;
    }
    
    .control-btn {
        width: 24px;
        height: 24px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        background-color: var(--surface-color);
        color: var(--font-color);
        font-weight: bold;
        font-size: 14px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
    }
    
    .control-btn:hover {
        transform: scale(1.1);
    }
    
    .control-btn.minimize:hover {
        background-color: #ffd700;
    }
    
    .control-btn.close:hover {
        background-color: #ff4444;
        color: white;
    }
    
    /* Mobile optimizations */
    @media (max-width: 768px) {
        .window {
            min-width: 300px;
            min-height: 200px;
        }
        
        .title-bar {
            padding: 8px 12px;
            min-height: 44px; /* Better touch target */
        }
        
        .control-btn {
            width: 32px;
            height: 32px;
            font-size: 16px;
        }
        
        .window-title {
            font-size: 1em;
        }
        
        .window-content {
            height: calc(100% - 44px);
        }
    }
    
    .window-content {
        height: calc(100% - 48px);
        overflow: auto;
        background-color: var(--surface-color);
        user-select: text;
        cursor: auto;
        transition: background-color 0.3s ease;
    }
    
    /* Custom scrollbar */
    .window-content::-webkit-scrollbar {
        width: 12px;
    }
    
    .window-content::-webkit-scrollbar-track {
        background: var(--bg-color);
        border-left: 1px solid var(--border-color);
    }
    
    .window-content::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 6px;
    }
    
    .window-content::-webkit-scrollbar-thumb:hover {
        background: #333;
    }
</style> 