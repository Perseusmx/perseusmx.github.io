<script>
    import { onMount } from 'svelte';
    import { createEventDispatcher } from 'svelte';
    
    const dispatch = createEventDispatcher();
    
    let bootStep = 0;
    let bootProgress = 0;
    let bootMessages = [
        '[ OK ] Loading PerseusOS kernel...',
        '[ OK ] Mounting filesystems...',
        '[ WARN ] High CPU usage detected...',
        '[ OK ] Starting system services...',
        '[ OK ] Configuring network interfaces...',
        '[ ERROR ] Network timeout...',
        '[ INFO ] Retrying connection...',
        '[ OK ] Starting networking services...',
        '[ OK ] Loading desktop environment...',
        '[ WARN ] Memory allocation failed...',
        '[ INFO ] Reallocating resources...',
        '[ OK ] Initializing window manager...',
        '[ OK ] Starting terminal service...',
        '[ OK ] Loading user interface...',
        '[ OK ] PerseusOS ready! 🌊'
    ];
    
    let rareMessages = [
        '[INFO] Palm tree swaying detected...',
        '[OK] Coconut counter initialized...',
        '[INFO] Seagull migration patterns loaded...',
        '[OK] Beach mode activated...',
        '[INFO] Sand in keyboard detected...',
        '[WARN] Sunscreen levels low...',
        '[INFO] Ocean breeze detected...',
        '[OK] Tropical vibes loaded...',
        '[INFO] Beach towel status: deployed...',
        '[OK] Sunset mode enabled...'
    ];
    
    let currentMessage = '';
    let isTyping = false;
    let showCursor = true;
    let bootComplete = false;
    
    onMount(() => {
        startBootSequence();
    });
    
    function startBootSequence() {
        const bootInterval = setInterval(() => {
            if (bootStep < bootMessages.length) {
                currentMessage = bootMessages[bootStep];
                isTyping = true;
                
                // Check if this is an error/warning message
                let messageDelay = 600;
                if (currentMessage.includes('[ ERROR ]') || currentMessage.includes('[ WARN ]')) {
                    messageDelay = 1000; // Longer delay for errors
                }
                
                // Simulate typing effect
                setTimeout(() => {
                    isTyping = false;
                    bootStep++;
                    bootProgress = (bootStep / bootMessages.length) * 100;
                    
                    // 10% chance to show a rare message
                    if (Math.random() < 0.1 && bootStep < bootMessages.length - 2) {
                        setTimeout(() => {
                            const rareMessage = rareMessages[Math.floor(Math.random() * rareMessages.length)];
                            bootMessages.splice(bootStep, 0, rareMessage);
                        }, 200);
                    }
                    

                }, messageDelay);
            } else {
                clearInterval(bootInterval);
                setTimeout(() => {
                    bootComplete = true;
                    setTimeout(() => {
                        dispatch('bootComplete');
                    }, 1500); // Longer delay to show "System Ready" message
                }, 1000); // Extra delay before starting completion
            }
        }, 800);
    }
    
    // Cursor blink effect
    setInterval(() => {
        showCursor = !showCursor;
    }, 500);
</script>

<div class="boot-screen" class:complete={bootComplete}>
    <!-- Floating Clouds -->
    <div class="cloud cloud-1">☁️</div>
    <div class="cloud cloud-2">☁️</div>
    <div class="cloud cloud-3">☁️</div>
    
    <!-- Ocean Waves -->
    <div class="wave wave-1"></div>
    <div class="wave wave-2"></div>
    <div class="wave wave-3"></div>
    
    <div class="boot-content">
        <div class="boot-header">
            <div class="palm-logo">🌴</div>
            <h1>PerseusOS v1.0</h1>
            <p>Retro-inspired Personal Portfolio System</p>
        </div>
        
        <div class="boot-messages">
            {#each bootMessages.slice(Math.max(0, bootStep - 8), bootStep) as message}
                <div class="boot-message" class:error={message.includes('[ ERROR ]')} class:warning={message.includes('[ WARN ]')} class:info={message.includes('[ INFO ]')} class:rare={message.includes('[INFO]') || message.includes('[OK]') && (message.includes('Palm') || message.includes('Coconut') || message.includes('Seagull') || message.includes('Beach') || message.includes('Sand') || message.includes('Sunscreen') || message.includes('Ocean') || message.includes('Tropical') || message.includes('Beach towel') || message.includes('Sunset'))}>
                    {message}
                </div>
            {/each}
            
            {#if bootStep < bootMessages.length}
                <div class="boot-message typing" class:error={currentMessage.includes('[ ERROR ]')} class:warning={currentMessage.includes('[ WARN ]')} class:info={currentMessage.includes('[ INFO ]')} class:rare={currentMessage.includes('[INFO]') || currentMessage.includes('[OK]') && (currentMessage.includes('Palm') || currentMessage.includes('Coconut') || currentMessage.includes('Seagull') || currentMessage.includes('Beach') || currentMessage.includes('Sand') || currentMessage.includes('Sunscreen') || currentMessage.includes('Ocean') || currentMessage.includes('Tropical') || currentMessage.includes('Beach towel') || currentMessage.includes('Sunset'))}>
                    {currentMessage}
                    {#if showCursor && isTyping}<span class="cursor">|</span>{/if}
                </div>
            {/if}
        </div>
        
        <div class="boot-progress">
            <div class="progress-bar">
                <div class="progress-fill" style="width: {bootProgress}%"></div>
            </div>
            <div class="progress-text">Boot Progress: {Math.round(bootProgress)}%</div>
        </div>
        
        {#if bootComplete}
            <div class="boot-complete">
                <div class="complete-message">
                    <h2>🌊 System Ready!</h2>
                    <p>Welcome to PerseusOS - Summer Edition</p>
                    <div class="loading-dots">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        {/if}
    </div>
</div>

<style>
    .boot-screen {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: linear-gradient(135deg, #87CEEB 0%, #98D8E8 25%, #B0E0E6 50%, #87CEEB 75%, #98D8E8 100%);
        background-image: url('/images/ocean-wallpaper.webp');
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        color: #2F4F4F;
        font-family: 'VT323', monospace;
        z-index: 9999;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: opacity 1s ease;
    }
    
    .boot-screen.complete {
        opacity: 0;
        pointer-events: none;
    }
    
    .boot-content {
        max-width: 600px;
        width: 90%;
        padding: 40px;
        background: rgba(216, 208, 200, 0.95);
        border: 3px outset #000000;
        border-radius: 8px;
        box-shadow: 
            inset 2px 2px 4px rgba(255, 255, 255, 0.8),
            inset -2px -2px 4px rgba(0, 0, 0, 0.3),
            0 4px 8px rgba(0, 0, 0, 0.3);
        backdrop-filter: blur(2px);
    }
    
    .boot-header {
        text-align: center;
        margin-bottom: 40px;
        border-bottom: 2px solid #000000;
        padding-bottom: 20px;
    }
    
    .boot-header h1 {
        font-size: 2.5em;
        margin: 0;
        color: #2F4F4F;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .boot-header p {
        font-size: 1.2em;
        margin: 10px 0 0 0;
        color: #2F4F4F;
        opacity: 0.9;
    }
    
    .palm-logo {
        font-size: 4em;
        margin: 0 0 20px 0;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        animation: sway 3s ease-in-out infinite;
    }
    
    .boot-messages {
        margin-bottom: 30px;
        height: 200px;
        overflow: hidden;
        background: rgba(0, 0, 0, 0.1);
        border: 1px inset #000000;
        padding: 10px;
        border-radius: 4px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
        line-height: 1.4;
    }
    
    .boot-message {
        font-size: 0.9em;
        margin: 2px 0;
        color: #2F4F4F;
        opacity: 0.9;
        font-family: 'Courier New', monospace;
    }
    
    .boot-message.typing {
        animation: blink 1s infinite;
    }
    
    .boot-message.error {
        color: #DC143C;
        font-weight: bold;
    }
    
    .boot-message.warning {
        color: #FF8C00;
        font-weight: bold;
    }
    
    .boot-message.info {
        color: #4169E1;
        font-weight: bold;
    }
    
    .boot-message.rare {
        color: #9370DB;
        font-weight: bold;
        animation: rareGlow 2s ease-in-out infinite alternate;
    }
    
    .cursor {
        animation: blink 0.5s infinite;
    }
    
    .boot-progress {
        margin-bottom: 30px;
    }
    
    .progress-bar {
        width: 100%;
        height: 20px;
        background: rgba(168, 192, 208, 0.3);
        border: 2px inset #000000;
        border-radius: 10px;
        overflow: hidden;
        margin-bottom: 10px;
        box-shadow: 
            inset 1px 1px 2px rgba(255, 255, 255, 0.8),
            inset -1px -1px 2px rgba(0, 0, 0, 0.2);
    }
    
    .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, #87CEEB, #98D8E8);
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(135, 206, 235, 0.5);
    }
    
    .progress-text {
        text-align: center;
        font-size: 1em;
        color: #2F4F4F;
        opacity: 0.8;
    }
    
    .boot-complete {
        text-align: center;
        animation: fadeIn 1s ease;
    }
    
    .complete-message h2 {
        font-size: 2em;
        margin: 0 0 10px 0;
        color: #2F4F4F;
        text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
    }
    
    .complete-message p {
        font-size: 1.2em;
        margin: 0 0 20px 0;
        color: #2F4F4F;
        opacity: 0.9;
    }
    
    .loading-dots {
        display: flex;
        justify-content: center;
        gap: 8px;
    }
    
    .loading-dots span {
        width: 8px;
        height: 8px;
        background: #87CEEB;
        border-radius: 50%;
        animation: loadingDots 1.4s infinite ease-in-out;
    }
    
    .loading-dots span:nth-child(1) { animation-delay: -0.32s; }
    .loading-dots span:nth-child(2) { animation-delay: -0.16s; }
    
    @keyframes sway {
        0%, 100% { transform: rotate(-2deg); }
        50% { transform: rotate(2deg); }
    }
    
    @keyframes blink {
        0%, 50% { opacity: 1; }
        51%, 100% { opacity: 0; }
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    
    @keyframes loadingDots {
        0%, 80%, 100% {
            transform: scale(0);
            opacity: 0.5;
        }
        40% {
            transform: scale(1);
            opacity: 1;
        }
    }
    
    @keyframes rareGlow {
        from { text-shadow: 0 0 5px #9370DB; }
        to { text-shadow: 0 0 15px #9370DB, 0 0 25px #9370DB; }
    }
    
    /* Floating Clouds */
    .cloud {
        position: absolute;
        font-size: 3em;
        opacity: 0.7;
        pointer-events: none;
        z-index: 1;
    }
    
    .cloud-1 {
        top: 20%;
        left: -100px;
        animation: float1 25s linear infinite;
    }
    
    .cloud-2 {
        top: 40%;
        left: -150px;
        animation: float2 30s linear infinite;
        animation-delay: 5s;
    }
    
    .cloud-3 {
        top: 60%;
        left: -120px;
        animation: float3 35s linear infinite;
        animation-delay: 10s;
    }
    
    /* Ocean Waves */
    .wave {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 200%;
        height: 150px;
        background: linear-gradient(45deg, transparent 20%, rgba(135, 206, 235, 0.8) 50%, transparent 80%);
        border-radius: 50% 50% 0 0;
        animation: wave 4s ease-in-out infinite;
        pointer-events: none;
        z-index: 1;
        box-shadow: 0 0 20px rgba(135, 206, 235, 0.5);
    }
    
    .wave-1 {
        animation-delay: 0s;
        opacity: 0.9;
        height: 180px;
    }
    
    .wave-2 {
        animation-delay: 1.5s;
        opacity: 0.7;
        height: 140px;
    }
    
    .wave-3 {
        animation-delay: 3s;
        opacity: 0.5;
        height: 120px;
    }
    
    @keyframes float1 {
        0% { transform: translateX(-100px); }
        100% { transform: translateX(calc(100vw + 100px)); }
    }
    
    @keyframes float2 {
        0% { transform: translateX(-150px); }
        100% { transform: translateX(calc(100vw + 150px)); }
    }
    
    @keyframes float3 {
        0% { transform: translateX(-120px); }
        100% { transform: translateX(calc(100vw + 120px)); }
    }
    
    @keyframes wave {
        0%, 100% { transform: translateX(-50%) scaleY(1); }
        50% { transform: translateX(-50%) scaleY(1.4); }
    }
    
    /* Responsive design */
    @media (max-width: 768px) {
        .boot-content {
            padding: 20px;
            width: 95%;
        }
        
        .boot-header h1 {
            font-size: 2em;
        }
        
        .boot-message {
            font-size: 1em;
        }
        
        .cloud {
            font-size: 2em;
        }
        
        .wave {
            height: 80px;
        }
        
        .wave-1 {
            height: 100px;
        }
        
        .wave-2 {
            height: 80px;
        }
        
        .wave-3 {
            height: 60px;
        }
    }
</style>
