---
title: Hello World
date: 2025-05-17
lastmod: 2025-05-20
tags: [meta]
draft: false
---

I'm updating my site! The old one felt too much like LinkedIn slop and was pretty disconnected to what I wanted my site to be.

### Some changes

1. Way more minimal! 

Revamped the theme and way less stuff to scroll through.
   {{< gif src="/videos/old_website_animation.gif" width="1000px" alt="Previous website's loading screen"  >}}

2. Improved the copy.

More genuine, less LinkedIn-y. Showing things for what they are. I don't think anyone even visited the old site, but even *I* couldn't stand seeing my own site talking about my passions for leveraging cutting-edge technologies championing cross-functional initiatives, building at the intersection of AI, Crypto, Healthcare, Finance, B2B SaaS...

3. I have a "writings" page now.

My brain has been stuck on consume mode for so long, I forgot what it's like to actually write something.


### How it's built

I used [Hugo](https://gohugo.io/), and everything's written in HTML and CSS. The posts are written in markdown and I guess Hugo works its magic converting markdown to HTML.

I was about to say this was deployed on [Vercel](https://vercel.com), and for about 3-ish hours it was. Then I decided to deploy it on [Cloudflare Pages](https://pages.cloudflare.com/) instead. No real reason, for low traffic static sites like this one I really don't think it'll make a difference. But I used Vercel so often before, so I thought it'd be neat to try something new. How does Cloudflare even make money?

It didn't take too long to change it over to Cloudflare. I had to:
- Transfer my DNS to Cloudflare
- Delete some CNAME records
- Set up domain redirecting (`www.nicolasliu.com` points to `nicolasliu.com`)
- And get confused along the way seeing my browser and `curl` still load the old website or not work altogether, leading me to a rabbit hole on local DNS caching.

### What's next?

Hopefully some more writing and sharing interesting stuff I come across online. Could be technical, non-technical, career related, or just dumping what's on my mind.