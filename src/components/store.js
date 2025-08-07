import { writable, readable } from 'svelte/store';
import About from './svelte/content/About.svelte';
import Contact from './svelte/content/Contact.svelte';
import Terminal from './svelte/content/Terminal.svelte';

// available apps
export const APPS = readable([
    { id: 'About', title: '~About', icon: 'user' },
    { id: 'Contact', title: '~Contact', icon: 'envelope' },
    { id: 'Github', title: '~Github', icon: 'github' },
    { id: 'Terminal', title: '~Terminal', icon: 'code' },
]);

const components = { About, Contact, Terminal, Github: null };
let nextWindowId = 0;

function createWindowManager() {
    const { subscribe, update } = writable({
        windows: [],
        activeWindowId: null,
    });

    const bringToFront = (state, id) => {
        let maxZ = 0;
        state.windows.forEach(w => { if (w.zIndex > maxZ) maxZ = w.zIndex; });
        const windows = state.windows.map(w => w.id === id ? { ...w, zIndex: maxZ + 1 } : w);
        return { windows, activeWindowId: id };
    };

    return {
        subscribe,
        open: (app) => {
            update(state => {
                const existingWindow = state.windows.find(w => w.appId === app.id);
                if (existingWindow) {
                    return bringToFront(state, existingWindow.id);
                }
                const id = nextWindowId++;
                
                // Get screen dimensions for responsive design
                const screenWidth = window.innerWidth || 1920;
                const screenHeight = window.innerHeight || 1080;
                const isMobile = screenWidth < 768;
                
                // Mobile-responsive window sizes
                let windowSize;
                if (isMobile) {
                    // Mobile: smaller windows that fit on screen
                    if (app.id === 'About') {
                        windowSize = { width: screenWidth - 20, height: screenHeight - 100 };
                    } else if (app.id === 'Terminal') {
                        windowSize = { width: screenWidth - 20, height: screenHeight - 100 };
                    } else if (app.id === 'Contact') {
                        windowSize = { width: screenWidth - 20, height: screenHeight - 100 };
                    } else {
                        windowSize = { width: screenWidth - 20, height: screenHeight - 100 };
                    }
                } else {
                    // Desktop: original sizes
                    windowSize = { width: 550, height: 400 };
                    if (app.id === 'About') {
                        windowSize = { width: 550, height: 700 };
                    } else if (app.id === 'Terminal') {
                        windowSize = { width: 800, height: 600 };
                    } else if (app.id === 'Contact') {
                        windowSize = { width: 650, height: 500 };
                    }
                }
                
                // Mobile-responsive positioning
                let position;
                
                if (isMobile) {
                    // Mobile: position windows to fit on screen
                    if (app.id === 'Terminal') {
                        position = { x: 10, y: 40 };
                    } else if (app.id === 'Contact') {
                        position = { x: 10, y: 40 };
                    } else {
                        position = { x: 10, y: 40 };
                    }
                } else {
                    // Desktop: center windows on screen
                    if (app.id === 'Terminal') {
                        position = { x: Math.max(10, (screenWidth - 800) / 2), y: Math.max(40, (screenHeight - 600) / 2) };
                    } else if (app.id === 'Contact') {
                        position = { x: Math.max(10, (screenWidth - 650) / 2), y: Math.max(40, (screenHeight - 500) / 2) };
                    } else {
                        position = { x: 50 + id * 25, y: 50 + id * 25 };
                    }
                }
                
                const newWindow = {
                    id,
                    appId: app.id,
                    title: app.title,
                    icon: app.icon,
                    component: components[app.id],
                    position: position,
                    size: windowSize,
                    zIndex: 100 + id,
                    isMinimized: false,
                };
                return bringToFront({ ...state, windows: [...state.windows, newWindow] }, id);
            });
        },
        close: (id) => update(state => ({ ...state, windows: state.windows.filter(w => w.id !== id) })),
        focus: (id) => update(state => bringToFront(state, id)),
        updatePosition: (id, position) => update(state => ({
            ...state,
            windows: state.windows.map(w => w.id === id ? { ...w, position } : w)
        })),
        toggleMinimize: (id) => update(state => ({
            ...state,
            windows: state.windows.map(w => w.id === id ? { ...w, isMinimized: !w.isMinimized } : w)
        })),
    };
}

export const windowManager = createWindowManager(); 