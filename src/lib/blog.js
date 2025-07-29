import { getCollection } from 'astro:content';

// Get all blog posts sorted by date
export async function getAllPosts() {
    const posts = await getCollection('blog');
    return posts.sort((a, b) => new Date(b.data.date) - new Date(a.data.date));
}

// Get a single post by slug
export async function getPost(slug) {
    const posts = await getCollection('blog');
    return posts.find(post => post.slug === slug);
}

// Get posts by tag
export async function getPostsByTag(tag) {
    const posts = await getAllPosts();
    return posts.filter(post => post.data.tags.includes(tag));
}

// Get all unique tags
export async function getAllTags() {
    const posts = await getAllPosts();
    const tags = posts.flatMap(post => post.data.tags);
    return [...new Set(tags)];
}

// Calculate reading time (rough estimate: 200 words per minute)
export function calculateReadingTime(content) {
    const wordCount = content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200);
    return readingTime;
}

// Format date for display
export function formatDate(date) {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Search posts by title, excerpt, or content
export async function searchPosts(query) {
    const posts = await getAllPosts();
    const searchTerm = query.toLowerCase();
    
    return posts.filter(post => {
        const title = post.data.title.toLowerCase();
        const excerpt = post.data.excerpt.toLowerCase();
        const content = post.body.toLowerCase();
        const tags = post.data.tags.join(' ').toLowerCase();
        
        return title.includes(searchTerm) || 
               excerpt.includes(searchTerm) || 
               content.includes(searchTerm) ||
               tags.includes(searchTerm);
    });
} 