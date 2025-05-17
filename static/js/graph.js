// Graph visualization for Hugo blog

document.addEventListener("DOMContentLoaded", function() {
    // Check if we're on a post page or the main blog page
    const isPostPage = document.body.classList.contains('post-single');
    const isBlogPage = document.body.classList.contains('blog') || document.body.classList.contains('posts');
    
    if (!isPostPage && !isBlogPage) {
        return;
    }
    
    // Get current slug if on a post page
    const currentSlug = isPostPage ? getCurrentSlug() : null;
    
    // Fetch all posts
    fetchPosts().then(posts => {
        // Create the graph container
        createGraphContainer(isPostPage ? '.post-content' : '.posts-list');
        
        // Generate graph data
        const graphData = generateGraphData(posts, currentSlug);
        
        // Render the graph
        renderGraph(graphData, currentSlug);
    }).catch(error => {
        console.error("Error loading graph data:", error);
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

// Fetch all posts using Hugo's JSON API
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

// Create graph container
function createGraphContainer(parentSelector) {
    const parent = document.querySelector(parentSelector);
    if (!parent) return;
    
    let container = document.querySelector('.graph-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'graph-container';
        container.innerHTML = `
            <h3>Post Network</h3>
            <div class="graph-view" id="graph-view"></div>
        `;
        
        // If on a post page, add after content
        // If on blog page, add after post list
        if (document.body.classList.contains('post-single')) {
            parent.parentNode.insertBefore(container, parent.nextSibling);
        } else {
            parent.parentNode.appendChild(container);
        }
    }
}

// Generate graph data from posts
function generateGraphData(posts, currentSlug) {
    const nodes = [];
    const links = [];
    const nodesMap = {};
    const wikiLinkRegex = /\[\[(.*?)\]\]/g;
    
    // Create nodes for all posts
    posts.forEach((post, index) => {
        const slug = getSlugFromPermalink(post.permalink);
        
        nodes.push({
            id: slug,
            name: post.title,
            url: post.permalink,
            group: 1,
            focused: slug === currentSlug
        });
        
        nodesMap[slug] = index;
    });
    
    // Create links based on wiki-style links
    posts.forEach(sourcePost => {
        const sourceSlug = getSlugFromPermalink(sourcePost.permalink);
        const sourceIndex = nodesMap[sourceSlug];
        
        if (sourcePost.content) {
            const matches = [...sourcePost.content.matchAll(wikiLinkRegex)];
            
            matches.forEach(match => {
                const linkParts = match[1].split('|');
                const targetSlug = linkParts[0].trim();
                const targetIndex = nodesMap[targetSlug];
                
                if (targetIndex !== undefined && sourceIndex !== targetIndex) {
                    links.push({
                        source: sourceIndex,
                        target: targetIndex,
                        value: 1
                    });
                }
            });
        }
    });
    
    return { nodes, links };
}

// Extract slug from permalink
function getSlugFromPermalink(permalink) {
    if (!permalink) return '';
    
    // Remove trailing slash if present
    const normalizedPath = permalink.endsWith('/') ? permalink.slice(0, -1) : permalink;
    // Get the last segment of the path
    const segments = normalizedPath.split('/');
    return segments[segments.length - 1];
}

// Render the graph using D3.js
function renderGraph(data, currentSlug) {
    const container = document.getElementById('graph-view');
    if (!container) return;
    
    // Clear any existing graph
    container.innerHTML = '';
    
    // If no data, show message
    if (data.nodes.length === 0) {
        container.innerHTML = '<p>No posts to visualize.</p>';
        return;
    }
    
    // Set dimensions
    const width = container.clientWidth;
    const height = container.clientHeight || 400;
    
    // Create SVG
    const svg = d3.select(container)
        .append('svg')
        .attr('width', width)
        .attr('height', height);
    
    // Create force simulation
    const simulation = d3.forceSimulation(data.nodes)
        .force('link', d3.forceLink(data.links).id(d => d.id))
        .force('charge', d3.forceManyBody().strength(-100))
        .force('center', d3.forceCenter(width / 2, height / 2));
    
    // Add links
    const link = svg.append('g')
        .selectAll('line')
        .data(data.links)
        .enter()
        .append('line')
        .attr('stroke', '#999')
        .attr('stroke-opacity', 0.6)
        .attr('stroke-width', d => Math.sqrt(d.value));
    
    // Add nodes
    const node = svg.append('g')
        .selectAll('circle')
        .data(data.nodes)
        .enter()
        .append('circle')
        .attr('r', d => d.focused ? 8 : 5)
        .attr('fill', d => d.focused ? '#3494E6' : '#666')
        .call(drag(simulation));
    
    // Add titles (tooltips)
    node.append('title')
        .text(d => d.name);
    
    // Add click event to navigate to post
    node.on('click', (event, d) => {
        window.location.href = d.url;
    });
    
    // Update positions on simulation tick
    simulation.on('tick', () => {
        link
            .attr('x1', d => d.source.x)
            .attr('y1', d => d.source.y)
            .attr('x2', d => d.target.x)
            .attr('y2', d => d.target.y);
        
        node
            .attr('cx', d => d.x)
            .attr('cy', d => d.y);
    });
    
    // Drag functions for nodes
    function drag(simulation) {
        function dragstarted(event) {
            if (!event.active) simulation.alphaTarget(0.3).restart();
            event.subject.fx = event.subject.x;
            event.subject.fy = event.subject.y;
        }
        
        function dragged(event) {
            event.subject.fx = event.x;
            event.subject.fy = event.y;
        }
        
        function dragended(event) {
            if (!event.active) simulation.alphaTarget(0);
            event.subject.fx = null;
            event.subject.fy = null;
        }
        
        return d3.drag()
            .on('start', dragstarted)
            .on('drag', dragged)
            .on('end', dragended);
    }
} 