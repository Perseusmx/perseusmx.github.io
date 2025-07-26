# Perseus Blog

My personal cybersecurity blog built with Jekyll. Features a custom Kali Linux terminal interface that actually works - you can type commands and get realistic outputs. Built on the hacked-jekyll theme but heavily customized with vanilla JavaScript and custom CSS to create a proper terminal experience.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg "MIT License Badge")](https://opensource.org/licenses/MIT)

## What's Here

- **Working Terminal**: Real terminal emulator with command history, realistic outputs, and proper terminal behavior
- **Blog Section**: Clean blog layout with search, category filtering, and tag system
- **Theme Toggle**: Switch between dark (black/green) and light (mint/dark green) themes - both maintain the terminal aesthetic
- **Email Protection**: Click-to-reveal email addresses to avoid spam bots
- **Mobile Friendly**: Works properly on phones and tablets
- **SEO Ready**: All the meta tags and structured data for search engines
- **Fast Loading**: Optimized to prevent the flash of unstyled content

## Tech Stuff

- **Jekyll** - Static site generator
- **hacked-jekyll theme** - Starting point (heavily modified)
- **Vanilla JavaScript** - Terminal logic, theme switching, email obfuscation
- **Custom CSS** - Terminal styling, animations, responsive design
- **Typed.js** - Typing animations for the terminal

## File Structure

- `_data/json.yml` - My info, tech stack, and content
- `_layouts/` - Custom page layouts including the terminal
- `assets/` - All the CSS, JS, and terminal assets
- `_posts/` - Blog posts organized by category

## Customizing

Just edit `_data/json.yml` to change your info, tech stack, and focus areas.

## Security Features

Added some basic security headers:

- **CSP** - Prevents XSS attacks
- **X-Frame-Options** - Stops clickjacking
- **X-Content-Type-Options** - Prevents MIME sniffing
- **Referrer Policy** - Controls referrer info

### Local Development

```bash
# Install Ruby dependencies
bundle install

# Start the dev server
bundle exec jekyll serve --livereload

# Build for production
bundle exec jekyll build
```

## Credits

Built on the [hacked-jekyll](https://github.com/piazzai/hacked-jekyll) theme by [piazzai](https://github.com/piazzai) (MIT License). The original theme was just a JSON-style layout - I added the working terminal, blog functionality, theme switching, and all the interactive features. 