import { getAllPosts, getAllTags } from '../../../lib/blog.js';

export async function GET() {
    try {
        const posts = await getAllPosts();
        const tags = await getAllTags();
        
        // Transform posts for the frontend
        const transformedPosts = posts.map(post => ({
            slug: post.slug,
            data: {
                title: post.data.title,
                date: post.data.date.toISOString(),
                tags: post.data.tags,
                excerpt: post.data.excerpt
            }
        }));
        
        return new Response(JSON.stringify({
            posts: transformedPosts,
            tags: tags
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching blog posts:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch posts' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 