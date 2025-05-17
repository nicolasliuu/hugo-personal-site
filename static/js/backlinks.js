// Backlinks functionality for Hugo blog

document.addEventListener("DOMContentLoaded", function() {
    // Only process on single post pages
    if (!document.body.classList.contains('post-single')) {
        return;
    }

    // Get current post slug from URL
    const currentSlug = getCurrentSlug();
    if (!currentSlug) return;

    // Fetch all posts
    fetchPosts().then(posts => {
        // Build backlinks map
        const backlinks = findBacklinks(posts, currentSlug);
        
        // Render backlinks
        renderBacklinks(backlinks);
    }).catch(error => {
        console.error("Error loading backlinks:", error);
    });
});

// Get current slug from URL
function getCurrentSlug() {
    const path = window.location.pathname;
    // Remove trailing slash if present
    const normalizedPath = path.endsWith('/') ? path.slice(0, -1) : path;
    // Get the last segment of the path
    const segments = normalizedPath.split('/');
    return segments[segments.length - 1];
}

// Fetch all posts
async function fetchPosts() {
    try {
        const response = await fetch('/index.json');
        if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
        }
        const data = await response.json();
        return data.items || [];
    } catch (error) {
        console.error("Error fetching posts:", error);
        return [];
    }
}

// Find posts that link to the current post
function findBacklinks(posts, currentSlug) {
    const backlinks = [];
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    
    posts.forEach(post => {
        if (post.content) {
            let match;
            let hasBacklink = false;
            
            // Reset regex state
            wikiLinkRegex.lastIndex = 0;
            
            while ((match = wikiLinkRegex.exec(post.content)) !== null) {
                const linkParts = match[1].split('|');
                const linkTarget = linkParts[0].trim();
                
                // Check if this post links to the current post
                if (linkTarget === currentSlug) {
                    hasBacklink = true;
                    break;
                }
            }
            
            if (hasBacklink) {
                backlinks.push({
                    title: post.title,
                    permalink: post.permalink
                });
            }
        }
    });
    
    return backlinks;
}

// Render backlinks in the UI
function renderBacklinks(backlinks) {
    // Create backlinks container if it doesn't exist
    let container = document.querySelector('.backlinks-container');
    
    if (!container) {
        const postContent = document.querySelector('.post-content');
        if (!postContent) return;
        
        container = document.createElement('div');
        container.className = 'backlinks-container';
        container.innerHTML = `
            <h3>Backlinks</h3>
            <div class="backlinks-list"></div>
        `;
        
        postContent.parentNode.insertBefore(container, postContent.nextSibling);
    }
    
    const backlinksListElement = container.querySelector('.backlinks-list');
    
    if (backlinks.length === 0) {
        backlinksListElement.innerHTML = '<p>No backlinks found.</p>';
        return;
    }
    
    backlinksListElement.innerHTML = backlinks.map(link => `
        <div class="backlink-item">
            <a href="${link.permalink}">${link.title}</a>
        </div>
    `).join('');
}

// Process wiki-style links in content
function processWikiLinks() {
    const contentElements = document.querySelectorAll('.post-content p, .post-content li');
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    
    contentElements.forEach(element => {
        const originalText = element.innerHTML;
        const newText = originalText.replace(wikiLinkRegex, (match, content) => {
            const parts = content.split('|');
            const slug = parts[0].trim();
            const text = parts.length > 1 ? parts[1].trim() : slug;
            
            return `<a href="/${slug}/" class="wiki-link">${text}</a>`;
        });
        
        if (originalText !== newText) {
            element.innerHTML = newText;
        }
    });
}

// Initialize wiki links once DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    processWikiLinks();
}); 