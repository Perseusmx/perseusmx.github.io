<script>
    import { createEventDispatcher, onMount } from 'svelte';
    import { marked } from 'marked';
    
    export let selectedPost;
    
    const dispatch = createEventDispatcher();
    
    let postContent = '';
    let readingTime = 0;
    let contentElement;
    
    onMount(async () => {
        if (selectedPost) {
            console.log('BlogPost: Loading post:', selectedPost.slug);
            try {
                const response = await fetch(`/api/blog/posts/${selectedPost.slug}.json`);
                const data = await response.json();
                console.log('BlogPost: Content loaded, length:', data.content.length);
                postContent = marked(data.content);
                readingTime = data.readingTime;
            } catch (error) {
                console.error('Failed to load post content:', error);
                postContent = '<p>Error loading post content.</p>';
                readingTime = 0;
            }
        }
    });
    
    function goBack() {
        dispatch('back');
    }
    
    function formatDate(date) {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
</script>

<div class="blog-post-wrapper">
    <div class="blog-post">
        <div class="post-header">
            <button class="back-btn" on:click={goBack}>
                ← Back to Notes
            </button>
            
            <div class="post-meta">
                <h1>{selectedPost?.data.title}</h1>
                <div class="meta-info">
                    <span class="date">{formatDate(selectedPost?.data.date)}</span>
                    <span class="reading-time">📖 {readingTime} min read</span>
                </div>
                <div class="post-tags">
                    {#each selectedPost?.data.tags || [] as tag}
                        <span class="tag">#{tag}</span>
                    {/each}
                </div>
            </div>
        </div>
        
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="post-content" bind:this={contentElement}>
            {#if postContent}
                <div class="markdown-wrapper">
                    {@html postContent}
                </div>
            {:else}
                <div class="loading">
                    <p>Loading post content...</p>
                </div>
            {/if}
        </div>
        
        <div class="post-footer">
            <button class="back-btn" on:click={goBack}>
                ← Back to Notes
            </button>
        </div>
    </div>
</div>

<style>
    .blog-post-wrapper {
        height: calc(100vh - 300px);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    .blog-post {
        padding: 30px 40px 120px 40px;
        font-family: 'VT323', monospace;
        line-height: 1.6;
        flex: 1;
        overflow-y: auto;
        margin-bottom: 60px;
    }
    
    .post-header {
        margin-bottom: 30px;
    }
    
    .back-btn {
        padding: 8px 16px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        background-color: var(--surface-color);
        color: var(--font-color);
        font-family: 'VT323', monospace;
        cursor: pointer;
        transition: all 0.2s ease;
        margin-bottom: 20px;
    }
    
    .back-btn:hover {
        background-color: var(--border-color);
        color: var(--surface-color);
    }
    
    .post-meta h1 {
        color: var(--font-color);
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 10px;
        margin-bottom: 15px;
        font-size: 1.8em;
        transition: color 0.3s ease, border-color 0.3s ease;
    }
    
    .meta-info {
        display: flex;
        gap: 20px;
        margin-bottom: 15px;
        color: #666;
        font-size: 0.9em;
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 20px;
    }
    
    .tag {
        background-color: var(--surface-color);
        border: 1px solid var(--border-color);
        padding: 4px 8px;
        border-radius: 4px;
        font-size: 0.9em;
        color: var(--font-color);
    }
    
    .post-content {
        color: var(--font-color);
        line-height: 1.7;
        padding-bottom: 80px;
        transition: color 0.3s ease;
    }
    
    .markdown-wrapper {
        /* Standard markdown content styling */
        padding-bottom: 60px;
    }
    
    .post-content :global(h1) {
        color: var(--font-color);
        border-bottom: 2px solid var(--border-color);
        padding-bottom: 8px;
        margin: 30px 0 20px 0;
        font-size: 1.5em;
    }
    
    .post-content :global(h2) {
        color: var(--font-color);
        margin: 25px 0 15px 0;
        font-size: 1.3em;
    }
    
    .post-content :global(h3) {
        color: var(--font-color);
        margin: 20px 0 10px 0;
        font-size: 1.1em;
    }
    
    .post-content :global(p) {
        margin: 15px 0;
    }
    
    .post-content :global(ul), .post-content :global(ol) {
        margin: 15px 0;
        padding-left: 20px;
    }
    
    .post-content :global(li) {
        margin: 8px 0;
    }
    
    .post-content :global(blockquote) {
        border-left: 4px solid var(--border-color);
        padding-left: 15px;
        margin: 20px 0;
        font-style: italic;
        color: #666;
    }
    
    .post-content :global(code) {
        background-color: var(--surface-color);
        border: 1px solid var(--border-color);
        padding: 2px 6px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
    }
    
    .post-content :global(pre) {
        background-color: var(--bg-color);
        border: 2px solid var(--border-color);
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 20px 0;
    }
    
    .post-content :global(pre code) {
        background: none;
        border: none;
        padding: 0;
        border-radius: 0;
    }
    
    .post-content :global(strong) {
        font-weight: bold;
    }
    
    .post-content :global(em) {
        font-style: italic;
    }
    
    .post-content :global(a) {
        color: #007acc;
        text-decoration: underline;
    }
    
    .post-content :global(a:hover) {
        color: #005a9e;
    }
    
    /* Code block styling */
    .post-content :global(pre) {
        background-color: var(--surface-color);
        border: 2px solid var(--border-color);
        padding: 15px;
        border-radius: 6px;
        overflow-x: auto;
        margin: 20px 0;
    }
    
    /* Button styling in markdown */
    .post-content :global(button) {
        cursor: pointer;
    }
    
    .post-content :global(hr) {
        border: none;
        border-top: 2px solid var(--border-color);
        margin: 30px 0;
    }
    
    .post-footer {
        margin-top: 40px;
        margin-bottom: 40px;
        padding-top: 20px;
        padding-bottom: 20px;
        border-top: 2px solid var(--border-color);
        transition: border-color 0.3s ease;
    }
    
    .loading {
        text-align: center;
        padding: 40px 20px;
        color: var(--font-color);
        transition: color 0.3s ease;
    }
    
    /* Custom scrollbar */
    .blog-post::-webkit-scrollbar {
        width: 12px;
    }
    
    .blog-post::-webkit-scrollbar-track {
        background: var(--bg-color);
        border-left: 1px solid var(--border-color);
    }
    
    .blog-post::-webkit-scrollbar-thumb {
        background: var(--border-color);
        border-radius: 6px;
    }
    
    .blog-post::-webkit-scrollbar-thumb:hover {
        background: #333;
    }
</style> 