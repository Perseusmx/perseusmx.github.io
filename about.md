---
layout: default
title: About
---

<div class="about-container">
  <div class="about-content">
    <h1>About</h1>
    
    <div class="about-text">
      <p>A personal blog where I share thoughts and experiences. The interactive terminal elements are side projects I've built for fun.</p>
      
      <div class="status-indicator">
        <span class="status-dot"></span>
        <span class="status-text">Work in Progress</span>
      </div>
    </div>
  </div>
</div>

<style>
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.about-content h1 {
  color: var(--green);
  border-bottom: 2px solid var(--green);
  padding-bottom: 0.5rem;
  margin-bottom: 2rem;
}

.about-text p {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--text-color);
  margin-bottom: 2rem;
}

.status-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: rgba(0, 255, 0, 0.1);
  border: 1px solid var(--green);
  border-radius: 4px;
  max-width: fit-content;
}

.status-dot {
  width: 12px;
  height: 12px;
  background: var(--green);
  border-radius: 50%;
  animation: pulse 2s infinite;
}

.status-text {
  color: var(--green);
  font-weight: bold;
  font-family: 'Courier New', monospace;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}
</style> 