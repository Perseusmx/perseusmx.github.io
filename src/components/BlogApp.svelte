<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import BlogPost from './svelte/content/BlogPost.svelte';
    
    // Stores for state (will have to probably rework this entire thing)
    const posts = writable([]);
    const filteredPosts = writable([]);
    const currentView = writable('list');
    const selectedPost = writable(null);
    const searchTerm = writable('');
    const selectedTags = writable([]);
    
    let allTags = [];
    let loading = true;
    
    onMount(async () => {
        try {
            console.log('BlogApp: Loading posts...');
            const response = await fetch('/api/blog/posts.json?t=' + Date.now());
            const data = await response.json();
            console.log('BlogApp: API response:', data);
            
            // Extract posts from the API response 
            const postsData = data.posts || [];
            const tagsData = data.tags || [];
            
            console.log('BlogApp: Posts loaded:', postsData.length);
            
            posts.set(postsData);
            filteredPosts.set(postsData);
            
            // Use tags from API 
            allTags = tagsData.sort();
            
            loading = false;
        } catch (error) {
            console.error('Failed to load posts:', error);
            loading = false;
        }
    });
    
    // Filtering stuff
    $: {
        let filtered = $posts;
        
        // Filter by search term
        if ($searchTerm) {
            const term = $searchTerm.toLowerCase();
            filtered = filtered.filter(post => 
                post.data.title.toLowerCase().includes(term) ||
                post.data.excerpt.toLowerCase().includes(term) ||
                (post.data.tags && post.data.tags.some(tag => tag.toLowerCase().includes(term)))
            );
        }
        
        // Filter by tags
        if ($selectedTags.length > 0) {
            filtered = filtered.filter(post => 
                post.data.tags && $selectedTags.every(tag => post.data.tags.includes(tag))
            );
        }
        
        filteredPosts.set(filtered);
    }
    
    function openPost(post) {
        selectedPost.set(post);
        currentView.set('post');
        // Update URL for client-side routing
        window.history.pushState({ post: post.slug }, '', `/blog/${post.slug}`);
    }
    
    function goBack() {
        currentView.set('list');
        selectedPost.set(null);
        // Update URL back to blog list
        window.history.pushState({}, '', '/blog');
    }
    
    function toggleTag(tag) {
        if ($selectedTags.includes(tag)) {
            selectedTags.set($selectedTags.filter(t => t !== tag));
        } else {
            selectedTags.set([...$selectedTags, tag]);
        }
    }
    
    function clearFilters() {
        searchTerm.set('');
        selectedTags.set([]);
    }
    
    // Handle browser back/forward buttons
    onMount(() => {
        window.addEventListener('popstate', (event) => {
            if (event.state && event.state.post) {
                // Find the post and open it
                const post = $posts.find(p => p.slug === event.state.post);
                if (post) {
                    openPost(post);
                }
            } else {
                goBack();
            }
        });
    });
</script>

<div class="blog-app">
    {#if $currentView === 'list'}
        <div class="blog-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="search-section">
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        bind:value={$searchTerm}
                        class="search-input"
                    />
                </div>
                
                <div class="tags-section">
                    <h3>Tags</h3>
                    <div class="tag-buttons">
                        {#each allTags as tag}
                            <button 
                                class="tag-btn {$selectedTags.includes(tag) ? 'active' : ''}"
                                on:click={() => toggleTag(tag)}
                                type="button"
                                aria-pressed={$selectedTags.includes(tag)}
                            >
                                #{tag}
                            </button>
                        {/each}
                    </div>
                    {#if $searchTerm || $selectedTags.length > 0}
                        <button class="clear-btn" on:click={clearFilters} type="button">
                            Clear filters
                        </button>
                    {/if}
                </div>
            </div>
            
            <!-- Main content -->
            <div class="main-content">
                <div class="content-header">
                    <h2>All Notes ({$filteredPosts.length})</h2>
                </div>
                
                <div class="posts-list">
                    {#if $filteredPosts.length === 0}
                        <div class="no-posts">
                            <p>No notes found matching your search.</p>
                            <button class="clear-btn" on:click={clearFilters} type="button">Clear filters</button>
                        </div>
                    {:else}
                        {#each $filteredPosts as post}
                            <div 
                                class="post-card" 
                                on:click={() => openPost(post)}
                                on:keydown={(e) => e.key === 'Enter' && openPost(post)}
                                role="button"
                                tabindex="0"
                                aria-label="Open post: {post.data.title}"
                            >
                                <div class="post-header">
                                    <h3>{post.data.title}</h3>
                                    <span class="post-date">{new Date(post.data.date).toLocaleDateString()}</span>
                                </div>
                                <p class="post-excerpt">{post.data.excerpt}</p>
                                <div class="post-tags">
                                    {#each post.data.tags as tag}
                                        <span class="tag">#{tag}</span>
                                    {/each}
                                </div>
                            </div>
                        {/each}
                    {/if}
                </div>
            </div>
        </div>
    {:else}
        <div class="post-view">
            <BlogPost selectedPost={$selectedPost} on:back={goBack} />
        </div>
    {/if}
</div>

<style>
    .blog-app {
        height: 100%;
        font-family: 'VT323', monospace;
        line-height: 1.6;
    }
    
    /* Layout */
    .blog-layout {
        display: flex;
        height: 100%;
        gap: 25px;
    }
    
    /* Sidebar */
    .sidebar {
        width: 280px;
        background-color: var(--surface-color);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        padding: 18px;
        display: flex;
        flex-direction: column;
        height: fit-content;
        transition: border-color 0.3s ease;
    }
    
    .search-section {
        margin-bottom: 20px;
    }
    
    .search-input {
        width: 100%;
        padding: 10px 12px;
        border: 2px solid var(--border-color);
        border-radius: 6px;
        background-color: var(--surface-color);
        color: var(--font-color);
        font-family: 'VT323', monospace;
        font-size: 1em;
        box-sizing: border-box;
        transition: border-color 0.3s ease, background-color 0.3s ease, color 0.3s ease;
    }
    
    .search-input:focus {
        outline: none;
        border-color: #007acc;
        box-shadow: 0 0 0 2px rgba(0, 122, 204, 0.2);
    }
    
    .tags-section {
        flex: 1;
    }
    
    .tags-section h3 {
        color: var(--font-color);
        margin: 0 0 15px 0;
        font-size: 1.2em;
        transition: color 0.3s ease;
    }
    
    .tag-buttons {
        display: flex;
        flex-direction: column;
        gap: 8px;
        margin-bottom: 15px;
    }
    
    .tag-btn {
        padding: 8px 12px;
        border: 1px solid var(--border-color);
        border-radius: 4px;
        background-color: var(--surface-color);
        color: var(--font-color);
        font-family: 'VT323', monospace;
        font-size: 0.9em;
        cursor: pointer;
        transition: all 0.2s ease;
        text-align: left;
    }
    
    .tag-btn:hover {
        background-color: var(--border-color);
        color: var(--surface-color);
    }
    
    .tag-btn.active {
        background-color: var(--border-color);
        color: var(--surface-color);
    }
    
    .clear-btn {
        padding: 8px 16px;
        border: 2px solid var(--border-color);
        border-radius: 4px;
        background-color: var(--surface-color);
        color: var(--font-color);
        font-family: 'VT323', monospace;
        cursor: pointer;
        transition: all 0.2s ease;
        width: 100%;
    }
    
    .clear-btn:hover {
        background-color: var(--border-color);
        color: var(--surface-color);
    }
    
    /* Main Stuff */
    .main-content {
        flex: 1;
    }
    
    .content-header {
        margin-bottom: 20px;
    }
    
    .content-header h2 {
        color: var(--font-color);
        margin: 0;
        font-size: 1.5em;
        transition: color 0.3s ease;
    }
    
    .posts-list {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }
    
    .post-card {
        background-color: var(--surface-color);
        border: 2px solid var(--border-color);
        border-radius: 8px;
        padding: 20px;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .post-card:hover,
    .post-card:focus {
        transform: translateY(-2px);
        box-shadow: 3px 3px 0 var(--shadow-color);
        outline: 2px solid var(--border-color);
        outline-offset: 2px;
    }
    
    .post-header {
        display: flex;
        justify-content: space-between;
        align-items: flex-start;
        margin-bottom: 10px;
    }
    
    .post-header h3 {
        color: var(--font-color);
        margin: 0;
        flex: 1;
        font-size: 1.3em;
        transition: color 0.3s ease;
    }
    
    .post-date {
        color: #666;
        font-size: 0.9em;
        white-space: nowrap;
        margin-left: 10px;
    }
    
    .post-excerpt {
        color: var(--font-color);
        margin: 10px 0;
        line-height: 1.5;
        transition: color 0.3s ease;
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 15px;
    }
    
    .tag {
        background-color: var(--surface-color);
        border: 1px solid var(--border-color);
        padding: 2px 6px;
        border-radius: 3px;
        font-size: 0.8em;
        color: var(--font-color);
    }
    
    .no-posts {
        text-align: center;
        padding: 40px 20px;
        color: var(--font-color);
        transition: color 0.3s ease;
    }
    
    .no-posts p {
        margin-bottom: 15px;
    }
    
    /* Post View */
    .post-view {
        max-width: 1200px;
        margin: 0 auto;
    }
</style> 