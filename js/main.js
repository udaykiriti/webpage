/**
 * Portfolio OS v3.0 - Main Entry
 * Initializes all modules
 */

document.addEventListener('DOMContentLoaded', () => {
    runBoot();
    initClock();
    initTerminal();
    initSkillsTabs();
    makeDraggable(document.querySelectorAll('.window'));
    fetchGitHubRepos();
    initScreensaver();
    initContextMenu();
    initKeyboardNav();
    initGlobalSounds();
});
