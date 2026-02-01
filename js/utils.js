/**
 * Portfolio OS - Utilities
 * Helpers, Audio, Global State
 */

// Global state
let systemVolume = 0.03;
let audioCtx = null;
const windowStates = {};

// Initialize AudioContext lazily
function getAudioContext() {
    if (!audioCtx) {
        audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtx;
}

// Play sound
function playSound(freq, type, dur) {
    if (systemVolume <= 0) return;

    try {
        const ctx = getAudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, ctx.currentTime);
        gain.gain.setValueAtTime(systemVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + dur);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + dur);
    } catch (e) {
        // Audio not supported
    }
}

// Sleep utility
function sleep(ms) {
    return new Promise(r => setTimeout(r, ms));
}

// Escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Init global sounds
function initGlobalSounds() {
    document.body.addEventListener('mouseenter', (e) => {
        if (e.target.matches('.icon, .start-item, .file-item, .contact-item, .taskbar-tab')) {
            playSound(800, 'sine', 0.008);
        }
    }, true);
}
