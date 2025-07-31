# PerseusPage - Retro Portfolio

A personal portfolio website with a retro computer aesthetic, featuring a Kali Linux-style terminal, interactive blog, and macOS-style desktop environment.

![Astro](https://img.shields.io/badge/Astro-FF5D01?style=for-the-badge&logo=astro&logoColor=white)
![Svelte](https://img.shields.io/badge/Svelte-FF3E00?style=for-the-badge&logo=svelte&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![Markdown](https://img.shields.io/badge/Markdown-000000?style=for-the-badge&logo=markdown&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-100000?style=for-the-badge&logo=github&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=GitHub%20Pages&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)



## Features

- **Retro Computer Aesthetic**: Kali Linux-inspired design with terminal themes
- **Interactive Terminal**: Fully functional terminal with 20+ commands
- **Blog System**: Astro-based markdown blog with syntax highlighting
- **Theme System**: 5 different terminal themes (Dracula, Solarized, One Dark, Material Ocean, Gruvbox)
- **Window Management**: Draggable windows with title bars and control buttons
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: CSS transitions and hover effects throughout
- **Snake Game**: Classic retro arcade game with authentic styling
- **Contact System**: Interactive contact page with toast notifications
- **Data Corruption Effects**: Animated email corruption for retro aesthetic

## Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **UI Components**: [Svelte](https://svelte.dev/) - Reactive JavaScript framework
- **Styling**: Custom CSS with CSS variables for theming
- **Font**: VT323 monospace font for authentic retro feel
- **Markdown**: Blog posts written in Markdown with Shiki syntax highlighting
- **Content Collections**: Astro's built-in content management

## Project Structure

```
src/
├── components/
│   ├── svelte/
│   │   ├── Desktop.svelte          # Main desktop container
│   │   ├── Window.svelte           # Draggable window component
│   │   ├── Dock.svelte             # macOS-style dock navigation
│   │   └── content/
│   │       ├── About.svelte        # About page 
│   │       ├── Contact.svelte      # Contact 
│   │       └── SnakeGame.svelte    # Retro Snake game
│   └── store.js                    # Svelte store for window management
├── content/
│   └── blog/                       # Markdown blog posts
├── layouts/
│   └── Layout.astro               # Main layout with fonts and styles
├── pages/
│   ├── index.astro                # Home page
│   ├── blog.astro                 # Blog listing page
│   └── blog/[slug].astro          # Individual blog post pages
└── styles/
    └── global.css                 # Global styles and CSS variables
```

## Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd PerseusPage
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:4321`

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Usage

### Navigation

- **Dock**: Click on any icon in the bottom dock to open the corresponding application
- **Windows**: Drag windows by their title bars to reposition them
- **Window Controls**: Use the minimize (−) and close (×) buttons in window title bars

### Applications

1. **About Me**: Personal information 
2. **Contact**: Contact information 
3. **Terminal**: Interactive Kali Linux-style terminal
4. **Snake Game**: Classic arcade game with retro styling
5. **Blog**: Direct navigation to the markdown blog system

### Terminal Commands

The terminal includes 20+ commands:
- **System**: `whoami`, `pwd`, `ls`, `cd`, `uname`, `date`, `uptime`, `top`, `ifconfig`
- **Security**: `nmap`, `whois`, `dig`, `ping`, `netstat`, `ps`
- **File Operations**: `cat`, `history`, `clear`
- **Fun**: `echo`, `neofetch`, `fortune`, `cowsay`
- **Themes**: `theme` - Cycle through 5 terminal themes

### Blog System

- **Markdown Support**: Write posts in Markdown with full syntax highlighting
- **Content Collections**: Astro's built-in content management
- **Responsive Design**: Optimized for all screen sizes
- **Search & Filter**: Client-side search and tag filtering
- **Syntax Highlighting**: VS Code-like code block styling

## Customization

### Terminal Themes

The terminal supports 5 different themes:
- **Dracula**: Deep purple with bright green prompts
- **Solarized Dark**: Dark blue-gray with muted colors
- **One Dark**: Dark gray with vibrant accents
- **Material Ocean**: Deep blue with material design colors
- **Gruvbox Dark**: Warm dark theme with muted colors

### Colors

The color scheme is defined in `src/styles/global.css` using CSS variables:

```css
:root {
    --bg-color: #d8d0c8;        /* Background beige */
    --surface-color: #ffffff;    /* Window backgrounds */
    --border-color: #000000;     /* Borders and text */
    --font-color: #000000;       /* Text color */
    --shadow-color: rgba(0, 0, 0, 0.5); /* Shadows */
    --dock-bg-color: rgba(255, 255, 255, 0.5); /* Dock background */
}
```

### Adding New Applications

1. Create a new Svelte component in `src/components/svelte/content/`
2. Add the app definition to `src/components/store.js`:

```javascript
export const APPS = readable([
    // ... existing apps
    { id: 'NewApp', title: 'New App', icon: '🆕' },
]);
```

3. Import and add the component to the components object:

```javascript
import NewApp from './svelte/content/NewApp.svelte';
const components = { About, Contact, Terminal, SnakeGame, NewApp };
```

## Responsive Design

The application is fully responsive and includes:
- Mobile-optimized dock sizing
- Touch-friendly interactions
- Responsive window layouts
- Adaptive typography
- Scrollable blog content

## Retro Computer Inspiration

This project captures the nostalgic feel of early computing with:

- Kali Linux terminal aesthetic
- Retro computer color schemes
- Monospace typography
- Bordered windows and controls
- Classic terminal commands
- Data corruption effects
- Authentic retro game styling

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Contact

For questions or feedback, please open an issue on GitHub.

## Credits

- **Poolsuite.fm** - Original inspiration for the retro aesthetic and design philosophy
- **VT323 Font** - Monospace font by Peter Wiegel for authentic terminal feel
- **Kali Linux** - Terminal aesthetic and command inspiration
- **Gogh Themes** - Terminal color scheme inspiration from [Gogh](https://gogh-co.github.io/Gogh/)
- **Icons** - [@hackernoon/pixel-icon-library](https://www.npmjs.com/package/@hackernoon/pixel-icon-library) - Pixel art icons used throughout the interface
- **Wallpaper** - [D3Ext/aesthetic-wallpapers](https://github.com/D3Ext/aesthetic-wallpapers) - Ocean wallpaper background image

# Updated Wed Jul 30 01:39:05 CEST 2025
