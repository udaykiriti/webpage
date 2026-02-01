/**
 * Portfolio OS - Boot Sequence
 */

async function runBoot() {
    const bios = document.getElementById('bios-text');
    const screen = document.getElementById('bios-screen');

    const lines = [
        '[    0.000000] Linux version 6.1.0-portfolio (uday@dev) (gcc 12.2.0)',
        '[    0.000012] Command line: BOOT_IMAGE=/vmlinuz root=/dev/nvme0n1p2',
        '[    0.000024] BIOS-provided physical RAM map:',
        '[    0.000035] ACPI: RSDP 0x00000000000F0000',
        '[    0.000089] CPU: AMD Ryzen 9 7950X 16-Core @ 5.7GHz',
        '[    0.000156] Memory: 65536MB DDR5 available',
        '[    0.000312] NVMe: Samsung 990 Pro 2TB initialized',
        '',
        '[  OK  ] Started Network Manager.',
        '[  OK  ] Started GNOME Display Manager.',
        '[  OK  ] Started Portfolio Service.',
        '[  OK  ] Reached target Graphical Interface.',
        '',
        'portfolio login: uday',
        'Welcome to Portfolio OS 3.0 LTS'
    ];

    for (const line of lines) {
        const div = document.createElement('div');
        div.textContent = line;
        div.style.animationDelay = '0s';
        bios.appendChild(div);
        await sleep(80 + Math.random() * 60);
    }

    await sleep(400);
    screen.style.opacity = '0';
    screen.style.transition = 'opacity 0.3s';

    setTimeout(() => {
        screen.style.display = 'none';
        playSound(600, 'sine', 0.08);
    }, 300);
}

// Screensaver
function initScreensaver() {
    const canvas = document.getElementById('screensaver');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let stars = [];
    let idleTime = 0;
    const IDLE_LIMIT = 120;
    let animating = false;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function initStars() {
        stars = [];
        for (let i = 0; i < 300; i++) {
            stars.push({
                x: Math.random() * canvas.width - canvas.width / 2,
                y: Math.random() * canvas.height - canvas.height / 2,
                z: Math.random() * canvas.width
            });
        }
    }

    function draw() {
        if (!animating) return;

        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        stars.forEach(star => {
            star.z -= 4;
            if (star.z <= 0) star.z = canvas.width;

            const sx = (star.x / star.z) * canvas.width + canvas.width / 2;
            const sy = (star.y / star.z) * canvas.height + canvas.height / 2;
            const size = Math.max(0.5, (1 - star.z / canvas.width) * 2.5);
            const brightness = Math.floor((1 - star.z / canvas.width) * 255);

            ctx.fillStyle = `rgb(${brightness},${brightness},${brightness})`;
            ctx.beginPath();
            ctx.arc(sx, sy, size, 0, Math.PI * 2);
            ctx.fill();
        });

        requestAnimationFrame(draw);
    }

    function resetIdle() {
        idleTime = 0;
        if (animating) {
            animating = false;
            canvas.classList.add('hidden');
        }
    }

    window.addEventListener('resize', () => {
        resize();
        initStars();
    });

    document.addEventListener('mousemove', resetIdle);
    document.addEventListener('keydown', resetIdle);
    document.addEventListener('touchstart', resetIdle);
    document.addEventListener('click', resetIdle);

    resize();
    initStars();

    setInterval(() => {
        idleTime++;
        if (idleTime >= IDLE_LIMIT && !animating) {
            animating = true;
            canvas.classList.remove('hidden');
            draw();
        }
    }, 1000);
}

// Shutdown
function initiateShutdown() {
    playSound(200, 'square', 0.1);

    document.querySelectorAll('.window').forEach(win => {
        win.classList.add('hidden');
    });

    document.getElementById('start-menu')?.classList.add('hidden');

    setTimeout(() => {
        document.getElementById('shutdown-screen')?.classList.remove('hidden');
    }, 400);
}
