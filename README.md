# PerseusPage - Retro Portfolio

My personal portfolio website with a retro computer vibe. Think old-school terminal meets modern web design, but actually usable.

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)

## What's This About?

Basically, I got tired of boring portfolio sites and decided to build something that looks cool. It's got a retro computer aesthetic with a boot screen, desktop environment, and terminal - but it's actually functional and not just for show.

## Cool Stuff It Does

- **Boot Screen**: Yeah, it actually boots up like an old computer. With clouds, waves, and fake error messages for authenticity
- **Desktop Environment**: macOS-style windows you can drag around, dock at the bottom, the whole deal
- **Interactive Terminal**: Real terminal with commands and stuff. Not just a fake one
- **Theme System**: Dark/light mode that actually works and looks good
- **Responsive**: Works on your phone too, not just desktop
- **About Page**: Auto-opens when you load the site (because why not?)

## Tech Stuff

- **Astro** - Because static sites are fast and I'm lazy
- **Svelte** - For the interactive bits that actually need to be interactive
- **Custom CSS** - Because I wanted it to look exactly how I wanted
- **VT323 Font** - That old terminal font that makes everything look legit

## Project Structure

```
src/
├── components/
│   ├── svelte/
│   │   ├── App.svelte              # Main app wrapper
│   │   ├── BootScreen.svelte       # The boot screen
│   │   ├── Desktop.svelte          # Desktop environment
│   │   ├── Window.svelte           # Draggable windows
│   │   ├── Dock.svelte             # Bottom dock
│   │   └── content/
│   │       ├── About.svelte        # About page
│   │       ├── Contact.svelte      # Contact form
│   │       └── Terminal.svelte     # Interactive terminal
│   └── store.js                    # Window management
├── layouts/
│   └── Layout.astro               # Main layout
├── pages/
│   └── index.astro                # Home page
└── styles/
    └── global.css                 # Global styles
```

## Getting Started

### Prerequisites

- Node.js (16 or higher)
- npm (or yarn if you're fancy)

### Installation

1. Clone it:
```bash
git clone <repository-url>
cd PerseusPage
```

2. Install stuff:
```bash
npm install
```

3. Run it:
```bash
npm run dev
```

4. Open `http://localhost:4321` in your browser

### Build for Production

```bash
npm run build
```

## Features Breakdown

### Boot Screen
- Shows a realistic boot sequence with fake system messages
- Has floating clouds and ocean waves (because summer vibes)
- Includes error simulation and rare easter egg messages
- Takes about 15-20 seconds to complete (might reconsider if this is actually smart to keep)

### Desktop Environment
- macOS-style window management
- Draggable windows with proper title bars
- Dock at the bottom with app icons
- System tray with time and theme toggle

### Terminal
- Real interactive terminal with commands
- Multiple themes (Dracula, Solarized, etc.)
- Virtual file system for fun
- Actually responds to commands

### About Page
- Auto-opens when the site loads
- Shows my info in a JSON-like format
- Typing animations and hover effects
- Contact links and social stuff

## Why I Built It This Way

Looks cool.

## Development Notes

- The boot screen uses CSS animations for the clouds and waves
- Window management is handled through Svelte stores
- Theme system uses CSS variables for easy customization
- Everything is responsive because mobile users exist

## Future Ideas

- Maybe add more apps to the desktop
- Could add sound effects (but probably won't)
- Might add more terminal commands
- Could integrate with real APIs for weather/time

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Credits & Inspiration

### Design Inspiration
- **Poolsuite.fm** - Original inspiration for the retro aesthetic and design philosophy
- **Kali Linux** - Terminal aesthetic and command inspiration
- **macOS** - Window management and dock design patterns

### Resources Used
- **VT323 Font** - Monospace font by Peter Wiegel for authentic terminal feel
- **Gogh Themes** - Terminal color scheme inspiration from [Gogh](https://gogh-co.github.io/Gogh/)
- **Icons** - [@hackernoon/pixel-icon-library](https://www.npmjs.com/package/@hackernoon/pixel-icon-library) - Pixel art icons used throughout the interface
- **Wallpaper** - Ocean wallpaper background image




