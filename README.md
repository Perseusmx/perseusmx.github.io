# Perseus Blog

A personal blog built with Jekyll, featuring a custom Kali Linux terminal interface. Built on top of the hacked-jekyll theme with vanilla JavaScript for interactivity and custom CSS for terminal styling. Still a work in progress.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Features

- **Interactive Terminal**: Custom terminal emulator with realistic command outputs
- **Clean Design**: Minimalistic layout with terminal aesthetics
- **Custom 404**: Data corruption effects for missing pages

## Tech Stack

- **Jekyll** - Static site generator
- **hacked-jekyll theme** - Terminal/JSON-themed base
- **Vanilla JavaScript** - Interactive terminal and effects
- **Custom CSS** - Terminal styling and animations
- **Typed.js** - Animated typing effects

## Structure

- `_data/json.yml` - Site content and tech stack
- `_layouts/` - Custom layouts including terminal interface
- `assets/` - CSS, JS, and terminal assets
- `_posts/` - Blog posts organized by category

## Customization

Modify `_data/json.yml` to update your information, tech stack, and focus areas.

## Security

This blog implements security headers to protect against common web vulnerabilities:

- **Content Security Policy (CSP)**: Prevents XSS attacks
- **X-Frame-Options**: Prevents clickjacking attacks  
- **X-Content-Type-Options**: Prevents MIME sniffing
- **Referrer Policy**: Controls referrer information
- **HSTS**: Already provided by GitHub Pages

### Testing

```bash
# Start Jekyll server
bundle exec jekyll serve
```

## Credits

This blog is built on top of the [hacked-jekyll](https://github.com/piazzai/hacked-jekyll) theme by [piazzai](https://github.com/piazzai), which is licensed under the MIT License. The original theme has been heavily modified to include:

- Custom terminal interface
- Interactive terminal simulations
- Enhanced security headers
- Blog functionality
- Custom layouts and styling

**Original Theme**: [hacked-jekyll](https://github.com/piazzai/hacked-jekyll) - A responsive, minimalistic Jekyll theme with a "hacked" JSON appearance. 