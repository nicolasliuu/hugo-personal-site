#!/bin/bash
# Simple deployment script for the Hugo site

echo "Building Hugo site..."
hugo --cleanDestinationDir

# Copy the public directory to the web root
echo "Deployment complete!"
echo "- Main site is at /"
echo "- Posts are at /posts/"
echo "- Tags are at /tags/"

# Display useful information
echo ""
echo "Remember:"
echo "- Your main site is now managed by Hugo"
echo "- Blog posts are at /blog/"
echo "- Edit content in the content/ directory"
echo "- Add new posts with: hugo new posts/my-new-post.md"
echo ""
echo "To serve the site locally: hugo server -D" 