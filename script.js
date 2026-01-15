/**
 * Workstation v3.0 Serenity Engine
 */

let systemVolume = 0.05;

document.addEventListener('DOMContentLoaded', () => {
    runBIOS();
    initClock();
    initTerminal();
    makeDraggable(document.querySelectorAll('.window'));
    fetchGitHubRepos();
    initScreensaver();
    initContextMenu();
    initGlobalSounds();
});

// 1. BIOS Boot Sequence
async function runBIOS() {
    const bios = document.getElementById('bios-text');
    const screen = document.getElementById('bios-screen');
    const lines = [
        "SYSTEM BIOS (C) 2026",
        "CPU: Intel(R) Core(TM) i9-14900K @ 6.00GHz",
        "Memory Test: 65536KB OK",
        "Detecting Primary Master ... [OK]",
        "Detecting Primary Slave  ... [NONE]",
        "Loading Boot Sector ... DONE",
        "Initializing Workstation GUI ...",
        "READY."
    ];

    for (const line of lines) {
        const div = document.createElement('div');
        div.textContent = line;
        bios.appendChild(div);
        await new Promise(r => setTimeout(r, Math.random() * 200 + 100));
    }

    setTimeout(() => {
        screen.style.display = 'none';
        clickSound(440, 'sine', 0.1); 
    }, 500);
}

// 2. Window Management & Dragging
function updateTaskbar() {
    const container = document.getElementById('taskbar-tabs');
    if (!container) return;
    container.innerHTML = '';
    const windows = document.querySelectorAll('.window:not(#sticky-note)');
    
    windows.forEach(win => {
        if (!win.classList.contains('hidden')) {
            const tab = document.createElement('div');
            tab.className = 'taskbar-tab';
            const icon = win.querySelector('.window-icon')?.textContent || '📄';
            const title = win.querySelector('.window-title')?.textContent || 'App';
            tab.innerHTML = `<span>${icon}</span> ${title.split(' - ')[0]}`;
            
            tab.onclick = () => {
                document.querySelectorAll('.window').forEach(w => w.style.zIndex = 5);
                win.style.zIndex = 10;
            };
            container.appendChild(tab);
        }
    });
}

function makeDraggable(windows) {
    windows.forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;
        let x = 0, y = 0, nx = 0, ny = 0;

        header.onmousedown = (e) => {
            if (e.target.className === 'window-close') return;
            e.preventDefault();
            document.querySelectorAll('.window').forEach(w => w.style.zIndex = 5);
            win.style.zIndex = 10;

            nx = e.clientX;
            ny = e.clientY;

            document.onmousemove = (e) => {
                x = nx - e.clientX;
                y = ny - e.clientY;
                nx = e.clientX;
                ny = e.clientY;
                win.style.top = (win.offsetTop - y) + "px";
                win.style.left = (win.offsetLeft - x) + "px";
            };

            document.onmouseup = () => {
                document.onmousemove = null;
                document.onmouseup = null;
            };
        };
    });
}

function openWindow(id) {
    clickSound(300, 'square', 0.05);
    const win = document.getElementById(id);
    win.classList.remove('hidden');
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 5);
    win.style.zIndex = 10;
    updateTaskbar();
}

function closeWindow(id) {
    clickSound(200, 'square', 0.05);
    document.getElementById(id).classList.add('hidden');
    updateTaskbar();
}

// 3. Start Menu & Clock
function toggleStartMenu() {
    clickSound(400, 'sine', 0.02);
    document.getElementById('start-menu').classList.toggle('hidden');
}

document.addEventListener('click', (e) => {
    const menu = document.getElementById('start-menu');
    const btn = document.getElementById('start-btn');
    if (menu && !menu.contains(e.target) && btn && !btn.contains(e.target)) {
        menu.classList.add('hidden');
    }
});

function initClock() {
    const clock = document.getElementById('clock');
    setInterval(() => {
        const now = new Date();
        clock.textContent = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }, 1000);
}

// 4. GitHub Fetching
async function fetchGitHubRepos() {
    const grid = document.querySelector('#window-projects .file-grid');
    const netLight = document.getElementById('network-light');
    if (!grid) return;

    try {
        if (netLight) netLight.classList.add('active');
        grid.innerHTML = "<p>Scanning storage...</p>";
        const response = await fetch('https://api.github.com/users/udaykiriti/repos?sort=updated');
        const repos = await response.json();
        grid.innerHTML = "";
        
        repos.forEach(repo => {
            const file = document.createElement('a');
            file.href = repo.html_url;
            file.className = 'file-item';
            file.target = '_blank';
            
            let icon = '📄';
            const name = repo.name.toLowerCase();
            if (name.includes('linux') || name.includes('kernel')) icon = '🐧';
            else if (name.includes('workshop')) icon = '🏪';
            else if (name.includes('machine-learning') || name.includes('classifier')) icon = '🧠';
            else if (name.includes('movie')) icon = '🎬';
            else if (name.includes('chat') || name.includes('lan')) icon = '💬';
            else if (name.includes('cp') || name.includes('algorithm')) icon = '🔢';
            else if (name.includes('rust')) icon = '🦀';
            else if (repo.language === 'C++') icon = '⚙️';
            else if (repo.language === 'JavaScript' || repo.language === 'HTML') icon = '🌐';
            
            file.innerHTML = `
                <span class="file-icon">${icon}</span>
                <span class="file-name">${repo.name.substring(0, 12)}${repo.name.length > 12 ? '~1' : ''}</span>
            `;
            grid.appendChild(file);
        });
    } catch (e) {
        grid.innerHTML = "<p>Error: ACCESS_DENIED</p>";
    } finally {
        if (netLight) setTimeout(() => netLight.classList.remove('active'), 500);
    }
}

// 5. Terminal Logic
function initTerminal() {
    const inp = document.getElementById('terminal-input');
    const out = document.getElementById('terminal-output');
    if (!inp) return;

    inp.onkeydown = (e) => {
        if (e.key === 'Enter') {
            const val = inp.value.trim().toLowerCase();
            const line = document.createElement('div');
            line.textContent = `> ${inp.value}`;
            out.appendChild(line);

            if (val === 'help') {
                out.innerHTML += "<div>Commands: help, cls, ver, whoami, music</div>";
            } else if (val === 'cls') {
                out.innerHTML = '';
            } else if (val === 'ver') {
                out.innerHTML += "<div>Workstation v3.0 [Serenity Edition]</div>";
            } else if (val === 'music') {
                openWindow('window-media');
            } else if (val) {
                out.innerHTML += `<div>'${val}' is not a valid system command.</div>`;
            }

            inp.value = '';
            inp.parentElement.parentElement.scrollTop = 9999;
        }
    };
}

// 6. Media Player Logic
let isPlaying = false;
let audioInterval;
function toggleMusic() {
    const status = document.querySelector('.player-status');
    const bars = document.querySelectorAll('.player-visualizer .bar');
    isPlaying = !isPlaying;
    
    if (isPlaying) {
        status.textContent = 'PLAYING...';
        clickSound(600, 'sine', 0.1);
        audioInterval = setInterval(() => {
            bars.forEach(bar => {
                bar.style.height = Math.random() * 100 + '%';
            });
            if (Math.random() > 0.8) clickSound(Math.random() * 200 + 400, 'triangle', 0.05);
        }, 100);
    } else {
        status.textContent = 'PAUSED';
        clearInterval(audioInterval);
        bars.forEach(bar => bar.style.height = '2px');
    }
}

function stopMusic() {
    isPlaying = false;
    document.querySelector('.player-status').textContent = 'STOPPED';
    clearInterval(audioInterval);
    document.querySelectorAll('.player-visualizer .bar').forEach(bar => bar.style.height = '2px');
}

// 7. Starfield Screensaver
function initScreensaver() {
    const canvas = document.getElementById('screensaver');
    const ctx = canvas.getContext('2d');
    let stars = [];
    let idleTime = 0;
    const IDLE_LIMIT = 60;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    for (let i = 0; i < 400; i++) {
        stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width
        });
    }

    function draw() {
        if (canvas.classList.contains('hidden')) return;
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        
        stars.forEach(star => {
            star.z -= 5;
            if (star.z <= 0) star.z = canvas.width;
            const sx = (star.x / star.z) * canvas.width + canvas.width / 2;
            const sy = (star.y / star.z) * canvas.height + canvas.height / 2;
            const size = (1 - star.z / canvas.width) * 3;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        });
        requestAnimationFrame(draw);
    }

    function resetIdle() {
        idleTime = 0;
        canvas.classList.add('hidden');
    }

    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('keydown', resetIdle);

    setInterval(() => {
        idleTime++;
        if (idleTime >= IDLE_LIMIT) {
            canvas.classList.remove('hidden');
            draw();
        }
    }, 1000);
}

// 8. Control Panel & Context Menu
function changeTheme(theme) {
    document.body.className = ''; 
    if (theme !== 'serenity') document.body.classList.add(`theme-${theme}`);
    clickSound(500, 'sine', 0.1);
}

function toggleScanlines() {
    const overlay = document.querySelector('.crt-overlay');
    overlay.style.display = overlay.style.display === 'none' ? 'block' : 'none';
    clickSound(800, 'sine', 0.05);
}

function updateVolume(val) {
    systemVolume = val / 1000;
    clickSound(440, 'sine', 0.1);
}

function initContextMenu() {
    const menu = document.createElement('div');
    menu.id = 'context-menu';
    menu.className = 'hidden';
    menu.innerHTML = `
        <div class="context-item" onclick="location.reload()">Refresh</div>
        <div class="context-divider"></div>
        <div class="context-item" onclick="openWindow('window-settings')">Properties</div>
        <div class="context-item" onclick="openWindow('window-terminal')">New Terminal</div>
    `;
    document.body.appendChild(menu);

    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        menu.classList.remove('hidden');
        menu.style.top = `${e.clientY}px`;
        menu.style.left = `${e.clientX}px`;
    });

    document.addEventListener('click', () => menu.classList.add('hidden'));
}

function initGlobalSounds() {
    document.querySelectorAll('a, button, .icon, .ql-icon, .start-item').forEach(el => {
        el.addEventListener('mouseenter', () => clickSound(800, 'sine', 0.01));
    });
}

function clickSound(freq, type, dur) {
    try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(systemVolume, audioCtx.currentTime);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + dur);
    } catch(e) {}
}
