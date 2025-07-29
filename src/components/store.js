import { writable, readable } from 'svelte/store';
import About from './svelte/content/About.svelte';
import Notes from './svelte/content/Notes.svelte';
import SnakeGame from './svelte/content/SnakeGame.svelte';
import Contact from './svelte/content/Contact.svelte';
import Terminal from './svelte/content/Terminal.svelte';

// available apps
export const APPS = readable([
    { id: 'About', title: '~About', icon: 'user' },
    { id: 'Notes', title: '~Notes', icon: 'pen-nib' },
    { id: 'SnakeGame', title: '~Snake', icon: 'ellipses-horizontal' },
    { id: 'Contact', title: '~Contact', icon: 'envelope' },
    { id: 'Github', title: '~Github', icon: 'github' },
    { id: 'Terminal', title: '~Terminal', icon: 'code' },
]);

const components = { About, Notes, SnakeGame, Contact, Terminal, Github: null };
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
                
                // Specific sizes for windows
                let windowSize = { width: 550, height: 400 };
                if (app.id === 'About') {
                    windowSize = { width: 550, height: 700 };
                } else if (app.id === 'Notes') {
                    windowSize = { width: 1000, height: 800 };
                } else if (app.id === 'SnakeGame') {
                    windowSize = { width: 600, height: 700 };
                } else if (app.id === 'Terminal') {
                    windowSize = { width: 800, height: 600 };
                } else if (app.id === 'Contact') {
                    windowSize = { width: 650, height: 500 };
                }
                
                // math
                let position;
                if (app.id === 'Notes') {
                    // Center the Notes window on screen (assuming 1920x1080 screen)
                    position = { x: 460, y: 140 }; // (1920-1000)/2, (1080-800)/2
                } else if (app.id === 'SnakeGame') {
                    // Center the SnakeGame window on screen
                    position = { x: 660, y: 190 }; // (1920-600)/2, (1080-700)/2
                } else if (app.id === 'Terminal') {
                    // Center the Terminal window on screen
                    position = { x: 560, y: 240 }; // (1920-800)/2, (1080-600)/2
                } else if (app.id === 'Contact') {
                    // Center the Contact window on screen
                    position = { x: 635, y: 290 }; // (1920-650)/2, (1080-500)/2
                } else {
                    position = { x: 50 + id * 25, y: 50 + id * 25 };
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