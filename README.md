# Nicolas Liu's Personal Website

A minimal static blog with clean URLs, backlinks and graph visualization.

## Features

- Minimal and clean design with responsive layout
- Markdown-based blog posts with YAML front matter
- Wiki-style links between posts (`[[link|text]]`)
- Automatic backlinks to show connections between posts
- Interactive graph visualization using D3.js
- Tag-based filtering and organization
- Clean URLs (no .html extensions in the address bar)
- Works perfectly with GitHub Pages hosting

## Local Development

To test the site locally, use Python's built-in HTTP server:

```bash
# Using Python 3
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

### URL Structure in Development Mode

In local development mode, the site automatically detects that it's running on localhost and uses query parameters instead of clean URLs:

- Local development: `post.html?id=hello-world`
- Production: `/post/hello-world`

This is because Python's simple HTTP server doesn't support the 404.html redirect method used by GitHub Pages for clean URLs. The site detects the environment and adjusts automatically.

## Project Structure

- `index.html` - Main homepage
- `blogs.html` - Blog listing page
- `post.html` - Individual post template
- `404.html` - Custom page for client-side routing with GitHub Pages
- `blog.js` - JavaScript for the blog functionality
- `blog.css` - Blog-specific styles
- `styles.css` - Main site styles
- `posts/` - Directory containing all blog posts as Markdown files
- `posts/index.json` - Index of all blog posts with metadata
- `images/` - Directory for storing images
- `test-browser.js` - Browser-based testing tool

## How to Write a New Post

1. Create a new Markdown file in the `posts/` directory (e.g., `my-new-post.md`)
2. Add YAML front matter at the top of the file:

```markdown
---
title: My New Post
date: 2023-07-01
tags: [example, tutorial]
---

# My New Post Content
```

3. Add your post to `posts/index.json` with the appropriate metadata:

```json
{
  "id": "my-new-post",
  "title": "My New Post",
  "date": "2023-07-01",
  "excerpt": "A short excerpt from the post...",
  "tags": ["example", "tutorial"]
}
```

4. To link to other posts, use wiki-style links: `[[post-id|display text]]`

## Deploying to GitHub Pages

1. Push your code to a GitHub repository
2. Go to Settings > Pages
3. Set the source branch (usually `main` or `master`)
4. Your site will be available at `https://[your-username].github.io/[repository-name]/`

### Clean URLs with GitHub Pages

The site uses client-side routing with a custom 404.html page to handle clean URLs on GitHub Pages. This allows URLs like:

- `/blogs` instead of `/blogs.html`
- `/post/hello-world` instead of `/post.html?id=hello-world`

This approach works because GitHub Pages serves the 404.html file for any non-existent path, and the JavaScript in that file redirects to the correct page.

## Debugging

If you encounter issues:

1. Open the browser's developer console (F12) to check for error messages
2. Use the test button that appears in the bottom-right corner of the page to run diagnostics
3. Make sure the paths in your URLs match your repository structure

### Development vs. Production Mode

The site automatically detects whether it's running:
- In **development mode** (localhost) - Uses query parameters like `post.html?id=hello-world`
- In **production mode** (GitHub Pages) - Uses clean URLs like `/post/hello-world`

The test tool shows which mode is active and adjusts its behavior accordingly.

### Running Tests

To manually run tests in the browser, click the "Run Blog Tests" button that appears in the bottom-right corner of any page, or run the following in the console:

```javascript
// Add the test script
const script = document.createElement('script');
script.src = 'test-browser.js';
document.head.appendChild(script);

// Wait for it to load, then run tests
setTimeout(() => runAllTests(), 1000);
```
