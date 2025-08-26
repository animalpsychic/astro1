// src/lib/post-utils.ts
import { getCollection } from 'astro:content';

export async function getRelatedAndAdjacentPosts(currentPost: any) {
  const allPosts = await getCollection('blog');

  // Filter out the current post
  const posts = allPosts.filter(post => post.slug !== currentPost.slug);

  // Sort posts by date for next/previous
  posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());

  // Find next and previous posts
  const currentIndex = posts.findIndex(post => post.slug === currentPost.slug);
  const prevPost = currentIndex > 0 ? posts[currentIndex - 1] : null;
  const nextPost = currentIndex < posts.length - 1 ? posts[currentIndex + 1] : null;

  // Filter for related posts by publication date
  const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
  const relatedPosts = posts
    .filter(post => {
      const diff = Math.abs(currentPost.data.pubDate.valueOf() - post.data.pubDate.valueOf());
      return diff <= thirtyDaysInMs;
    })
    .slice(0, 3); // Get up to 3 related posts

  return { relatedPosts, prevPost, nextPost };
}
