/**
 * Portfolio OS - UI Components
 * Start menu, clock, skills tabs, settings, GitHub
 */

// Start Menu
function toggleStartMenu() {
    playSound(450, 'sine', 0.02);
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');

    menu.classList.toggle('hidden');
    btn.setAttribute('aria-expanded', !menu.classList.contains('hidden'));
}

// Close start menu on outside click
document.addEventListener('click', (e) => {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');

    if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        menu.classList.add('hidden');
        btn?.setAttribute('aria-expanded', 'false');
    }
});

// Clock
function initClock() {
    const clock = document.getElementById('clock');

    const update = () => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    update();
    setInterval(update, 1000);
}

// Skills Tabs
function initSkillsTabs() {
    const tabs = document.querySelectorAll('.skill-tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.dataset.tab;

            tabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            document.querySelectorAll('.skills-panel').forEach(p => p.classList.remove('active'));
            document.getElementById(`panel-${tabId}`)?.classList.add('active');

            playSound(500, 'sine', 0.02);
        });
    });
}

// GitHub Repos
async function fetchGitHubRepos() {
    const grid = document.querySelector('#window-projects .file-grid');
    const netLight = document.getElementById('network-light');
    const countEl = document.getElementById('project-count');

    if (!grid) return;

    const CACHE_KEY = 'github_repos';
    const CACHE_TTL = 5 * 60 * 1000;

    // Check cache
    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, time } = JSON.parse(cached);
            if (Date.now() - time < CACHE_TTL) {
                renderRepos(grid, data);
                if (countEl) countEl.textContent = `${data.length} objects`;
                return;
            }
        }
    } catch (e) {
        localStorage.removeItem(CACHE_KEY);
    }

    // Fetch
    try {
        netLight?.classList.add('active');
        grid.innerHTML = '<p style="padding: 20px; color: #888;">Loading repositories...</p>';

        const res = await fetch('https://api.github.com/users/udaykiriti/repos?sort=updated&per_page=30');
        if (!res.ok) throw new Error('Network error');

        const repos = await res.json();

        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: repos, time: Date.now() }));

        renderRepos(grid, repos);
        if (countEl) countEl.textContent = `${repos.length} objects`;

    } catch (e) {
        grid.innerHTML = '<p style="padding: 20px; color: #ff6b6b;">Error loading repositories</p>';
        if (countEl) countEl.textContent = 'Error';
    } finally {
        setTimeout(() => netLight?.classList.remove('active'), 500);
    }
}

function renderRepos(grid, repos) {
    grid.innerHTML = '';

    const folderSvg = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M10 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z"/></svg>`;

    repos.forEach(repo => {
        const item = document.createElement('a');
        item.href = repo.html_url;
        item.target = '_blank';
        item.rel = 'noopener noreferrer';
        item.className = 'file-item';
        item.setAttribute('role', 'listitem');

        const displayName = repo.name.length > 14
            ? repo.name.substring(0, 12) + '...'
            : repo.name;

        item.innerHTML = `
      <div class="file-icon">${folderSvg}</div>
      <span class="file-name">${displayName}</span>
    `;

        grid.appendChild(item);
    });
}

// Settings
function changeTheme(theme) {
    document.body.classList.remove('theme-dark', 'theme-light');

    if (theme === 'dark') {
        document.body.classList.add('theme-dark');
    } else if (theme === 'light') {
        document.body.classList.add('theme-light');
    }

    playSound(500, 'sine', 0.05);
}

function toggleScanlines() {
    const overlay = document.querySelector('.crt-overlay');
    if (overlay) {
        overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
        playSound(600, 'sine', 0.03);
    }
}

function updateVolume(val) {
    systemVolume = val / 1000;
    playSound(440, 'sine', 0.1);
}

// Context Menu
function initContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.className = 'hidden';
    menu.style.cssText = `
    position: fixed;
    background: #2d2d2d;
    border: 1px solid #1a1a1a;
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
    min-width: 160px;
    z-index: 100000;
    padding: 4px 0;
    border-radius: 8px;
  `;

    menu.innerHTML = `
    <div class="ctx-item" onclick="location.reload()">Refresh</div>
    <div class="ctx-divider"></div>
    <div class="ctx-item" onclick="openWindow('window-about')">Open README</div>
    <div class="ctx-item" onclick="openWindow('window-terminal')">Open Terminal</div>
    <div class="ctx-item" onclick="openWindow('window-settings')">Settings</div>
  `;

    document.body.appendChild(menu);

    const style = document.createElement('style');
    style.textContent = `
    .ctx-item {
      padding: 8px 20px;
      cursor: pointer;
      font-size: 12px;
      color: #e0e0e0;
    }
    .ctx-item:hover {
      background: rgba(240, 136, 62, 0.2);
      color: #f0883e;
    }
    .ctx-divider {
      height: 1px;
      background: #333;
      margin: 4px 0;
    }
  `;
    document.head.appendChild(style);

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.classList.remove('hidden');
        menu.style.left = Math.min(e.clientX, window.innerWidth - 170) + 'px';
        menu.style.top = Math.min(e.clientY, window.innerHeight - 150) + 'px';
    });

    document.addEventListener('click', () => menu.classList.add('hidden'));
}

// Keyboard Navigation
function initKeyboardNav() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            const windows = [...document.querySelectorAll('.window:not(.hidden)')]
                .sort((a, b) => (parseInt(b.style.zIndex) || 0) - (parseInt(a.style.zIndex) || 0));

            if (windows.length > 0) {
                closeWindow(windows[0].id);
            }
        }
    });

    document.querySelectorAll('.icon, .start-item').forEach(el => {
        el.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                el.click();
            }
        });
    });
}
