import { getPost, calculateReadingTime, getAllPosts } from '../../../../lib/blog.js';

export async function getStaticPaths() {
    const posts = await getAllPosts();
    return posts.map(post => ({
        params: { slug: post.slug },
        props: { post }
    }));
}

export async function GET({ params, props }) {
    try {
        const { slug } = params;
        const post = props?.post || await getPost(slug);
        
        if (!post) {
            return new Response(JSON.stringify({ error: 'Post not found' }), {
                status: 404,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
        }
        
        // Calculate reading time
        const readingTime = calculateReadingTime(post.body);
        
        return new Response(JSON.stringify({
            content: post.body,
            readingTime: readingTime,
            data: {
                title: post.data.title,
                date: post.data.date.toISOString(),
                tags: post.data.tags,
                excerpt: post.data.excerpt
            }
        }), {
            status: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    } catch (error) {
        console.error('Error fetching blog post:', error);
        return new Response(JSON.stringify({ error: 'Failed to fetch post' }), {
            status: 500,
            headers: {
                'Content-Type': 'application/json'
            }
        });
    }
} 