/**
 * Portfolio OS - Window Management
 */

// Update taskbar
function updateTaskbar() {
    const container = document.getElementById('taskbar-tabs');
    if (!container) return;
    container.innerHTML = '';

    const windows = document.querySelectorAll('.window:not(.hidden)');

    windows.forEach(win => {
        const tab = document.createElement('div');
        tab.className = 'taskbar-tab';
        if (win.classList.contains('minimized')) tab.classList.add('minimized');

        const iconSvg = win.querySelector('.window-icon svg')?.outerHTML || '';
        const title = win.querySelector('.window-title')?.textContent?.split(' - ')[0] || 'Window';

        tab.innerHTML = `${iconSvg}<span>${title}</span>`;

        tab.onclick = () => {
            if (win.classList.contains('minimized')) {
                restoreWindow(win.id);
            }
            bringToFront(win);
            updateTaskbar();
        };

        container.appendChild(tab);
    });
}

// Bring window to front
function bringToFront(win) {
    document.querySelectorAll('.window').forEach(w => w.style.zIndex = 5);
    win.style.zIndex = 10;
}

// Make windows draggable
function makeDraggable(windows) {
    windows.forEach(win => {
        const header = win.querySelector('.window-header');
        if (!header) return;

        let isDragging = false;
        let startX, startY, initialX, initialY;

        const onStart = (e) => {
            if (e.target.closest('.window-controls')) return;

            isDragging = true;
            bringToFront(win);

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            startX = clientX;
            startY = clientY;
            initialX = win.offsetLeft;
            initialY = win.offsetTop;

            e.preventDefault();
        };

        const onMove = (e) => {
            if (!isDragging) return;

            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            win.style.left = (initialX + deltaX) + 'px';
            win.style.top = (initialY + deltaY) + 'px';
        };

        const onEnd = () => {
            isDragging = false;
        };

        header.addEventListener('mousedown', onStart);
        header.addEventListener('touchstart', onStart, { passive: false });
        document.addEventListener('mousemove', onMove);
        document.addEventListener('touchmove', onMove, { passive: false });
        document.addEventListener('mouseup', onEnd);
        document.addEventListener('touchend', onEnd);
    });
}

// Window operations
function openWindow(id) {
    playSound(400, 'sine', 0.03);
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.remove('hidden', 'minimized');
    bringToFront(win);
    updateTaskbar();

    document.getElementById('start-menu')?.classList.add('hidden');
}

function closeWindow(id) {
    playSound(300, 'sine', 0.03);
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.add('hidden');
    win.classList.remove('minimized', 'maximized');
    delete windowStates[id];
    updateTaskbar();
}

function minimizeWindow(id) {
    playSound(350, 'sine', 0.02);
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.add('minimized');
    updateTaskbar();
}

function restoreWindow(id) {
    const win = document.getElementById(id);
    if (!win) return;

    win.classList.remove('minimized');
    bringToFront(win);
    updateTaskbar();
}

function maximizeWindow(id) {
    playSound(400, 'sine', 0.03);
    const win = document.getElementById(id);
    if (!win) return;

    if (win.classList.contains('maximized')) {
        win.classList.remove('maximized');
        if (windowStates[id]) {
            Object.assign(win.style, windowStates[id]);
        }
    } else {
        windowStates[id] = {
            top: win.style.top,
            left: win.style.left,
            width: win.style.width,
            height: win.style.height
        };
        win.classList.add('maximized');
    }
}
