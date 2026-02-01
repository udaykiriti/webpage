# Portfolio OS v3.0

A Linux/GNOME-inspired personal portfolio website with a desktop environment UI.

## Project Structure

```
d:\webpage\
├── index.html          # Main HTML file
├── README.md           # This file
├── assets/             # Images and media
│   └── profile.png
├── css/                # Modular stylesheets
│   ├── base.css        # Variables, reset, typography
│   ├── layout.css      # Desktop, panel, icons, menus
│   ├── windows.css     # Window chrome and controls
│   ├── pages.css       # Content pages (about, skills, etc.)
│   └── utilities.css   # Responsive, themes, overlays
└── js/                 # Modular scripts
    ├── utils.js        # Audio, helpers
    ├── boot.js         # Boot sequence, screensaver
    ├── windows.js      # Window management
    ├── terminal.js     # Terminal commands
    ├── ui.js           # Start menu, clock, settings
    └── main.js         # Entry point
```

## Features

- **Linux Boot Sequence** - Kernel-style boot animation
- **GNOME-Style Desktop** - Top panel, traffic light buttons
- **Draggable Windows** - About, Projects, Skills, Contact, Resume
- **Working Terminal** - Commands: `help`, `ls`, `neofetch`, `theme`
- **GitHub Integration** - Auto-fetches repositories
- **Theme Switcher** - Dark, Light, Default themes
- **Responsive Design** - Works on mobile devices

## Quick Start

1. Open `index.html` in your browser
2. Wait for boot sequence
3. Click desktop icons or use terminal

## Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Show all commands |
| `about` | Open About window |
| `skills` | Open Skills window |
| `projects` | Open Projects window |
| `neofetch` | System info |
| `theme dark` | Dark theme |
| `theme light` | Light theme |

## Customization

- Edit `css/base.css` for colors and fonts
- Edit `js/terminal.js` to add commands
- Edit `index.html` to update content

## License

MIT
