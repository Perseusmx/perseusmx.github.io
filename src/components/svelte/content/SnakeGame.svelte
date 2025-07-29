<script>
    import { onMount, onDestroy } from 'svelte';
    
    // Game state
    let canvas;
    let ctx;
    let isInitialized = false;
    let gameLoop;
    let gameRunning = false;
    let score = 0;
    let highScore = 0;
    
    // Snake
    let snake = [{ x: 10, y: 10 }];
    let dx = 1;
    let dy = 0;
    
    // Food
    let food = { x: 15, y: 15 };
    
    // Game settings
    const gridSize = 16;
    const tileCount = 20;
    const gameSpeed = 200;
    
    // Icons
    let playIcon = '';
    let pauseIcon = '';
    let refreshIcon = '';
    let snakeIcon = '';
    
    async function loadIcons() {
        try {
            const [playResponse, pauseResponse, refreshResponse, snakeResponse] = await Promise.all([
                fetch('/node_modules/@hackernoon/pixel-icon-library/icons/SVG/regular/play.svg'),
                fetch('/node_modules/@hackernoon/pixel-icon-library/icons/SVG/regular/pause.svg'),
                fetch('/node_modules/@hackernoon/pixel-icon-library/icons/SVG/regular/refresh.svg'),
                fetch('/node_modules/@hackernoon/pixel-icon-library/icons/SVG/regular/ellipses-horizontal.svg')
            ]);
            
            playIcon = await playResponse.text();
            pauseIcon = await pauseResponse.text();
            refreshIcon = await refreshResponse.text();
            snakeIcon = await snakeResponse.text();
        } catch (error) {
            console.warn('Failed to load icons:', error);
        }
    }
    
    // Initialize game
    function initGame() {
        console.log('Initializing SnakeGame...');
        if (!canvas) {
            console.error('Canvas not found');
            return;
        }
        
        try {
            ctx = canvas.getContext('2d');
            canvas.width = tileCount * gridSize;
            canvas.height = tileCount * gridSize;
            
            // Load high score
            highScore = parseInt(localStorage.getItem('snakeHighScore')) || 0;
            
            resetGame();
            drawGame();
            isInitialized = true;
            console.log('SnakeGame initialized successfully');
        } catch (error) {
            console.error('Failed to initialize SnakeGame:', error);
        }
    }
    
    // Reset game
    function resetGame() {
        snake = [{ x: 10, y: 10 }];
        dx = 1;
        dy = 0;
        score = 0;
        gameRunning = false;
        generateFood();
    }
    
    // Start game
    function startGame() {
        if (gameRunning) return;
        console.log('Starting game...');
        gameRunning = true;
        gameLoop = setInterval(updateGame, gameSpeed);
        console.log('Game loop started');
    }
    
    // Pause game
    function pauseGame() {
        if (!gameRunning) return;
        gameRunning = false;
        clearInterval(gameLoop);
    }
    
    // Update game
    function updateGame() {
        if (!gameRunning) return;
        
        console.log('Updating game, snake at:', snake[0].x, snake[0].y);
        
        // Move snake
        const head = { x: snake[0].x + dx, y: snake[0].y + dy };
        
        // Check wall collision
        if (head.x < 0 || head.x >= tileCount || head.y < 0 || head.y >= tileCount) {
            console.log('Wall collision!');
            endGame();
            return;
        }
        
        // Check self collision
        for (let i = 0; i < snake.length; i++) {
            if (snake[i].x === head.x && snake[i].y === head.y) {
                console.log('Self collision!');
                endGame();
                return;
            }
        }
        
        snake.unshift(head);
        
        // Check food collision
        if (head.x === food.x && head.y === food.y) {
            console.log('Food eaten!');
            score += 10;
            generateFood();
        } else {
            snake.pop();
        }
        
        drawGame();
    }
    
    // Generate food
    function generateFood() {
        let newFood;
        do {
            newFood = {
                x: Math.floor(Math.random() * tileCount),
                y: Math.floor(Math.random() * tileCount)
            };
        } while (snake.some(segment => segment.x === newFood.x && segment.y === newFood.y));
        food = newFood;
    }
    
    // End game
    function endGame() {
        gameRunning = false;
        clearInterval(gameLoop);
        if (score > highScore) {
            highScore = score;
            localStorage.setItem('snakeHighScore', highScore.toString());
        }
    }
    
    // Draw game
    function drawGame() {
        if (!ctx) return;
        
        // Ccanvas
        ctx.fillStyle = '#000000'; // Black background
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw grid
        ctx.strokeStyle = '#333333'; // Dark gray grid
        ctx.lineWidth = 0.5;
        for (let i = 0; i <= tileCount; i++) {
            ctx.beginPath();
            ctx.moveTo(i * gridSize, 0);
            ctx.lineTo(i * gridSize, canvas.height);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(0, i * gridSize);
            ctx.lineTo(canvas.width, i * gridSize);
            ctx.stroke();
        }
        
        // Snake
        snake.forEach((segment, index) => {
            if (index === 0) {
                ctx.fillStyle = '#00ff00'; // Green head
            } else {
                ctx.fillStyle = '#008000'; // Dark green body
            }
            ctx.fillRect(
                segment.x * gridSize + 1,
                segment.y * gridSize + 1,
                gridSize - 2,
                gridSize - 2
            );
        });
        
        // food
        ctx.fillStyle = '#ff0000'; // Red food
        ctx.fillRect(
            food.x * gridSize + 2,
            food.y * gridSize + 2,
            gridSize - 4,
            gridSize - 4
        );
        
        console.log('Drawing snake at:', snake[0].x, snake[0].y);
    }
    
    // keyboard commands
    function handleKeydown(event) {
        switch (event.key) {
            case 'ArrowUp':
            case 'w':
            case 'W':
                if (dy !== 1) { dx = 0; dy = -1; }
                break;
            case 'ArrowDown':
            case 's':
            case 'S':
                if (dy !== -1) { dx = 0; dy = 1; }
                break;
            case 'ArrowLeft':
            case 'a':
            case 'A':
                if (dx !== 1) { dx = -1; dy = 0; }
                break;
            case 'ArrowRight':
            case 'd':
            case 'D':
                if (dx !== -1) { dx = 1; dy = 0; }
                break;
            case ' ':
                event.preventDefault();
                if (gameRunning) {
                    pauseGame();
                } else {
                    startGame();
                }
                break;
        }
    }
    
    onMount(() => {
        console.log('SnakeGame component mounted');
        loadIcons();
        setTimeout(initGame, 100);
        window.addEventListener('keydown', handleKeydown);
    });
    
    onDestroy(() => {
        if (gameLoop) {
            clearInterval(gameLoop);
        }
        window.removeEventListener('keydown', handleKeydown);
    });
</script>

<div class="snake-game">
    <div class="game-header">
        <h1>
            {#if snakeIcon}
                {@html snakeIcon}
            {:else}
                🐍
            {/if}
            Retro Snake
        </h1>
        <p>Use arrow keys or WASD to move</p>
    </div>
    
    <div class="game-container">
        <div class="game-info">
            <div class="score-board">
                <div class="score">
                    <span class="label">Score:</span>
                    <span class="value">{score}</span>
                </div>
                <div class="high-score">
                    <span class="label">High Score:</span>
                    <span class="value">{highScore}</span>
                </div>
            </div>
            
            <div class="controls">
                <button class="control-btn" on:click={startGame} disabled={gameRunning}>
                    {#if playIcon}
                        {@html playIcon}
                    {:else}
                        ▶
                    {/if}
                    Start
                </button>
                <button class="control-btn" on:click={pauseGame} disabled={!gameRunning}>
                    {#if pauseIcon}
                        {@html pauseIcon}
                    {:else}
                        ⏸
                    {/if}
                    Pause
                </button>
                <button class="control-btn" on:click={resetGame}>
                    {#if refreshIcon}
                        {@html refreshIcon}
                    {:else}
                        ↻
                    {/if}
                    Reset
                </button>
            </div>
        </div>
        
        <div class="game-area">
            <canvas 
                bind:this={canvas}
                class="game-canvas"
                tabindex="0"
                on:click={() => canvas.focus()}
                on:keydown={(e) => e.key === 'Enter' && canvas.focus()}
                aria-label="Snake game canvas. Click or press Enter to focus and start playing."
            ></canvas>
            
            {#if !isInitialized}
                <div class="loading">
                    <p>Loading game...</p>
                </div>
            {/if}
        </div>
        
        <div class="instructions">
            <h3>How to Play</h3>
            <div class="controls-list">
                <div class="control-item">
                    <span class="key">↑↓←→</span>
                    <span class="desc">Move snake</span>
                </div>
                <div class="control-item">
                    <span class="key">WASD</span>
                    <span class="desc">Alternative movement</span>
                </div>
                <div class="control-item">
                    <span class="key">Space</span>
                    <span class="desc">Pause/Resume</span>
                </div>
            </div>
            <p class="objective">Eat the red food to grow and earn points. Don't hit the walls or yourself!</p>
            <p class="debug">Debug: {isInitialized ? 'Game initialized' : 'Initializing...'}</p>
        </div>
    </div>
</div>

<style>
    .snake-game {
        padding: 10px;
        font-family: 'VT323', monospace;
        line-height: 1.6;
        height: 100%;
        overflow: hidden;
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        transition: color 0.3s ease;
    }
    
    .game-header {
        text-align: center;
        margin-bottom: 20px;
    }
    
    h1 {
        color: var(--font-color);
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 10px;
        margin-bottom: 20px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: color 0.3s ease, border-color 0.3s ease;
    }
    
    h1 :global(svg) {
        width: 24px;
        height: 24px;
        fill: currentColor;
    }
    
    .game-container {
        background-color: var(--surface-color);
        border: 3px solid var(--border-color);
        border-radius: 12px;
        padding: 15px;
        margin: 10px 0;
        box-shadow: 5px 5px 0 var(--shadow-color);
        flex: 1;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        transition: background-color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }
    
    .game-info {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
        flex-wrap: wrap;
        gap: 15px;
    }
    
    .score-board {
        display: flex;
        gap: 30px;
    }
    
    .score, .high-score {
        display: flex;
        flex-direction: column;
        align-items: center;
    }
    
    .label {
        font-size: 0.9em;
        color: #666;
    }
    
    .value {
        font-size: 1.5em;
        font-weight: bold;
        color: var(--font-color);
    }
    
    .controls {
        display: flex;
        gap: 10px;
    }
    
    .control-btn {
        background-color: var(--surface-color);
        border: 2px solid var(--border-color);
        border-radius: 6px;
        padding: 8px 16px;
        font-family: 'VT323', monospace;
        font-size: 1em;
        cursor: pointer;
        transition: all 0.2s ease;
        display: flex;
        align-items: center;
        gap: 6px;
    }
    
    .control-btn :global(svg) {
        width: 16px;
        height: 16px;
        fill: currentColor;
    }
    
    .control-btn:hover:not(:disabled) {
        background-color: var(--border-color);
        color: var(--surface-color);
        transform: translateY(-2px);
    }
    
    .control-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }
    
    .game-area {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 1;
        margin: 10px 0;
    }
    
    .game-canvas {
        border: 3px solid var(--border-color);
        border-radius: 8px;
        background-color: var(--bg-color);
        cursor: crosshair;
        max-width: 100%;
        max-height: 100%;
        width: auto;
        height: auto;
    }
    
    .loading {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 20px;
        border-radius: 8px;
        text-align: center;
    }
    
    .instructions {
        margin-top: 25px;
        padding: 20px;
        background-color: rgba(255, 255, 255, 0.1);
        border: 1px solid var(--border-color);
        border-radius: 8px;
    }
    
    .instructions h3 {
        color: var(--font-color);
        margin: 0 0 15px 0;
        text-align: center;
    }
    
    .controls-list {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
        gap: 10px;
        margin-bottom: 15px;
    }
    
    .control-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 8px;
        background-color: var(--surface-color);
        border: 1px solid var(--border-color);
        border-radius: 4px;
    }
    
    .key {
        background-color: var(--border-color);
        color: var(--surface-color);
        padding: 2px 8px;
        border-radius: 3px;
        font-size: 0.9em;
        font-weight: bold;
    }
    
    .desc {
        font-size: 0.9em;
        color: var(--font-color);
    }
    
    .objective {
        text-align: center;
        font-style: italic;
        color: #666;
        margin: 0 0 10px 0;
    }
    
    .debug {
        text-align: center;
        font-size: 0.8em;
        color: #999;
        margin: 0;
    }
    
    @media (max-width: 768px) {
        .game-info {
            flex-direction: column;
            align-items: center;
        }
        
        .score-board {
            justify-content: center;
        }
        
        .controls {
            justify-content: center;
        }
        
        .game-canvas {
            max-width: 100%;
            height: auto;
        }
        
        .snake-game {
            padding: 10px;
        }
        
        .game-container {
            padding: 15px;
        }
    }
</style> 