<script>
    import { onMount } from 'svelte';
    import { writable } from 'svelte/store';
    import BlogPost from './BlogPost.svelte';
    
    // State stuff
    const currentView = writable('list'); // 'list' or 'post'
    const selectedPost = writable(null);
    const searchQuery = writable('');
    const selectedTag = writable('');
    
    // Blogstuff
    let posts = [];
    let tags = [];
    let filteredPosts = [];
    
    onMount(async () => {
        try {
            // Fetch blog data
            const response = await fetch('/api/blog/posts.json?t=' + Date.now());
            const data = await response.json();
            console.log('Fetched posts:', data.posts.length, 'posts');
            console.log('Post titles:', data.posts.map(p => p.data.title));
            posts = data.posts;
            tags = data.tags;
            filteredPosts = posts;
        } catch (error) {
            console.error('Failed to load blog posts:', error);
            // Fallback sample
            posts = [
                {
                    slug: 'welcome-to-my-blog',
                    data: {
                        title: 'Welcome to My Digital Notes',
                        date: '2024-01-15',
                        tags: ['intro', 'blog'],
                        excerpt: 'A brief introduction to my new blog where I\'ll share thoughts on coding, design, and everything in between.'
                    }
                },
                {
                    slug: 'building-a-retro-portfolio',
                    data: {
                        title: 'Building a Retro-Inspired Portfolio',
                        date: '2024-01-20',
                        tags: ['portfolio', 'astro', 'svelte', 'design'],
                        excerpt: 'The journey of creating this retro-styled portfolio website using Astro and Svelte, and why I chose this aesthetic.'
                    }
                }
            ];
            tags = ['intro', 'blog', 'portfolio', 'astro', 'svelte', 'design'];
            filteredPosts = posts;
        }
    });
    
    // search and tag filters
    $: {
        let filtered = posts;
        
        if ($searchQuery) {
            const query = $searchQuery.toLowerCase();
            filtered = filtered.filter(post => 
                post.data.title.toLowerCase().includes(query) ||
                post.data.excerpt.toLowerCase().includes(query) ||
                post.data.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        if ($selectedTag) {
            filtered = filtered.filter(post => 
                post.data.tags.includes($selectedTag)
            );
        }
        
        filteredPosts = filtered;
    }
    
    function openPost(post) {
        console.log('Opening post:', post.data.title);
        selectedPost.set(post);
        currentView.set('post');
    }
    
    function goBack() {
        console.log('Going back to list view');
        currentView.set('list');
        selectedPost.set(null);
    }
    
    function clearFilters() {
        searchQuery.set('');
        selectedTag.set('');
    }
</script>

<div class="notes-content">
    {#if $currentView === 'list'}
        <div class="blog-layout">
            <!-- Sidebar -->
            <div class="sidebar">
                <div class="sidebar-header">
                    <h1>📝 Notes</h1>
                    <p>My digital thoughts</p>
                </div>
                
                <div class="search-section">
                    <input 
                        type="text" 
                        placeholder="Search notes..." 
                        bind:value={$searchQuery}
                        class="search-input"
                    />
                </div>
                
                <div class="tags-section">
                    <h3>Tags</h3>
                    <div class="tag-buttons">
                        {#each tags as tag}
                            <button 
                                class="tag-btn {$selectedTag === tag ? 'active' : ''}"
                                on:click={() => selectedTag.set($selectedTag === tag ? '' : tag)}
                                type="button"
                                aria-pressed={$selectedTag === tag}
                            >
                                #{tag}
                            </button>
                        {/each}
                    </div>
                    {#if $searchQuery || $selectedTag}
                        <button class="clear-btn" on:click={clearFilters} type="button">
                            Clear filters
                        </button>
                    {/if}
                </div>
            </div>
            
            <!-- Main content -->
            <div class="main-content">
                <div class="content-header">
                    <h2>All Notes ({filteredPosts.length})</h2>
                </div>
                
                <div class="posts-list">
                    {#if filteredPosts.length === 0}
                        <div class="no-posts">
                            <p>No notes found matching your search.</p>
                            <button class="clear-btn" on:click={clearFilters} type="button">Clear filters</button>
                        </div>
                    {:else}
                        {#each filteredPosts as post}
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
        <BlogPost {selectedPost} on:back={goBack} />
    {/if}
</div>

<style>
    .notes-content {
        height: 100%;
        font-family: 'VT323', monospace;
        line-height: 1.6;
    }
    
    /* Blog Layout */
    .blog-layout {
        display: flex;
        height: 100%;
    }
    
    /* Sidebar */
    .sidebar {
        width: 300px;
        background-color: var(--bg-color);
        border-right: 2px solid var(--border-color);
        padding: 20px;
        display: flex;
        flex-direction: column;
    }
    
    .sidebar-header {
        margin-bottom: 20px;
    }
    
    .sidebar-header h1 {
        color: var(--font-color);
        margin: 0 0 5px 0;
        font-size: 1.8em;
    }
    
    .sidebar-header p {
        color: var(--font-color);
        margin: 0;
        opacity: 0.8;
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
    
    /* Main Content */
    .main-content {
        flex: 1;
        padding: 20px;
        overflow-y: auto;
    }
    
    .content-header {
        margin-bottom: 20px;
    }
    
    .content-header h2 {
        color: var(--font-color);
        margin: 0;
        font-size: 1.5em;
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
    }
    
    .post-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 6px;
        margin-top: 15px;
    }
    
    .tag {
        background-color: var(--bg-color);
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
    }
    
    .no-posts p {
        margin-bottom: 15px;
    }
</style> 