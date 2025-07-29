# PerseusPage - Retro Portfolio

A personal portfolio website with a retro computer aesthetic, featuring a Kali Linux-style terminal, interactive blog, and macOS-style desktop environment.

## 🎨 Features

- **Retro Computer Aesthetic**: Kali Linux-inspired design with terminal themes
- **Interactive Terminal**: Fully functional terminal with 20+ commands
- **Blog System**: Markdown-based blog with multiple posts (PLACEHOLDERS )
- **Theme System**: 5 different terminal themes (Dracula, Solarized, One Dark, Material Ocean, Gruvbox)
- **Window Management**: Draggable windows with title bars and control buttons
- **Responsive Design**: Works on desktop and mobile devices
- **Smooth Animations**: CSS transitions and hover effects throughout

## 🛠️ Tech Stack

- **Framework**: [Astro](https://astro.build/) - Static site generator
- **UI Components**: [Svelte](https://svelte.dev/) - Reactive JavaScript framework
- **Styling**: Custom CSS with CSS variables for theming
- **Font**: VT323 monospace font for authentic retro feel
- **Markdown**: Blog posts written in Markdown

## 📁 Project Structure

```
src/
├── components/
│   ├── svelte/
│   │   ├── Desktop.svelte          # Main desktop container
│   │   ├── Window.svelte           # Draggable window component
│   │   ├── Dock.svelte             # macOS-style dock navigation
│   │   └── content/
│   │       ├── About.svelte        # About page content
│   │       ├── BlogPost.svelte     # Blog post viewer
│   │       ├── Contact.svelte      # Contact information
│   │       ├── Notes.svelte        # Blog listing
│   │       ├── SnakeGame.svelte    # Retro Snake game
│   │       └── Terminal.svelte     # Interactive terminal
│   └── store.js                    # Svelte store for window management
├── content/
│   └── blog/                       # Markdown blog posts
├── layouts/
│   └── Layout.astro               # Main layout with fonts and styles
├── pages/
│   ├── index.astro                # Home page
│   └── api/                       # Blog API endpoints
└── styles/
    └── global.css                 # Global styles and CSS variables
```

## 🚀 Getting Started

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

## 🎯 Usage

### Navigation

- **Dock**: Click on any icon in the bottom dock to open the corresponding application
- **Windows**: Drag windows by their title bars to reposition them
- **Window Controls**: Use the minimize (−) and close (×) buttons in window title bars

### Applications

1. **About Me** (👤): Personal information and contact details
2. **Notes** (📝): Blog posts and articles
3. **Contact** (📧): Contact information and social links
4. **Terminal** (💻): Interactive Kali Linux-style terminal
5. **Snake Game** (🎮): Classic arcade game

### Terminal Commands

The terminal includes 20+ commands:
- **System**: `whoami`, `pwd`, `ls`, `cd`, `uname`, `date`, `uptime`, `top`, `ifconfig`
- **Security**: `nmap`, `whois`, `dig`, `ping`, `netstat`, `ps`
- **File Operations**: `cat`, `history`, `clear`
- **Fun**: `echo`, `neofetch`, `fortune`, `cowsay`
- **Themes**: `theme` - Cycle through 5 terminal themes

## 🎨 Customization

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
const components = { About, Notes, Contact, Terminal, SnakeGame, NewApp };
```

## 📱 Responsive Design

The application is fully responsive and includes:
- Mobile-optimized dock sizing
- Touch-friendly interactions
- Responsive window layouts
- Adaptive typography

## 🎵 Retro Computer Inspiration

This project captures the nostalgic feel of early computing with:

- Kali Linux terminal aesthetic
- Retro computer color schemes
- Monospace typography
- Bordered windows and controls
- Classic terminal commands

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Contact

For questions or feedback, please open an issue on GitHub.

## 🙏 Credits

- **Poolsuite.fm** - Original inspiration for the retro aesthetic and design philosophy
- **VT323 Font** - Monospace font by Peter Wiegel for authentic terminal feel
- **Kali Linux** - Terminal aesthetic and command inspiration
- **Gogh Themes** - Terminal color scheme inspiration from [Gogh](https://gogh-co.github.io/Gogh/)
- **Icons** - [@hackernoon/pixel-icon-library](https://www.npmjs.com/package/@hackernoon/pixel-icon-library) - Pixel art icons used throughout the interface
- **Wallpaper** - [D3Ext/aesthetic-wallpapers](https://github.com/D3Ext/aesthetic-wallpapers) - Ocean wallpaper background image
