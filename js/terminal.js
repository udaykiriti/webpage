/**
 * Portfolio OS - Terminal
 */

function initTerminal() {
    const input = document.getElementById('terminal-input');
    const output = document.getElementById('terminal-output');

    if (!input) return;

    const commands = {
        help: () => `Available commands:
  help     - Show this help
  about    - About me
  skills   - Open skills window
  projects - Open projects window
  contact  - Open contact window
  resume   - Open resume window
  clear    - Clear terminal
  date     - Show current date
  whoami   - Show user info
  theme    - Change theme (dark/light/default)
  neofetch - System info
  shutdown - Shutdown system`,

        about: () => {
            openWindow('window-about');
            return 'Opening About window...';
        },

        skills: () => {
            openWindow('window-skills');
            return 'Opening Skills window...';
        },

        projects: () => {
            openWindow('window-projects');
            return 'Opening Projects window...';
        },

        contact: () => {
            openWindow('window-contact');
            return 'Opening Contact window...';
        },

        resume: () => {
            openWindow('window-resume');
            return 'Opening Resume window...';
        },

        clear: () => {
            output.innerHTML = '';
            return null;
        },

        date: () => new Date().toString(),

        whoami: () => `User: Uday Kiriti
Role: Software Developer (Fresher)
Specialization: C++, Web Development, Automation
Status: Available for opportunities`,

        neofetch: () => `       .-.         uday@portfolio
      (o o)        ---------------
      | O |        OS: Portfolio OS 3.0 LTS
      \\ ~ /        Kernel: 6.1.0-portfolio
       ^~^         Shell: bash 5.2.15
                   Resolution: ${window.innerWidth}x${window.innerHeight}
                   Theme: GNOME Dark
                   CPU: AMD Ryzen 9 7950X
                   Memory: 64GB DDR5`,

        shutdown: () => {
            initiateShutdown();
            return 'Initiating shutdown...';
        },

        theme: (args) => {
            if (args === 'dark') {
                changeTheme('dark');
                return 'Theme changed to dark mode';
            } else if (args === 'light') {
                changeTheme('light');
                return 'Theme changed to light mode';
            } else if (args === 'default') {
                changeTheme('default');
                return 'Theme changed to default';
            }
            return 'Usage: theme [dark|light|default]';
        },

        ls: () => 'README.md  projects/  skills.conf  contact.sh  resume.pdf',

        pwd: () => '/home/uday',

        cat: (args) => {
            if (args === 'README.md') {
                openWindow('window-about');
                return 'Opening README.md...';
            }
            return `cat: ${args || 'file'}: No such file`;
        }
    };

    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const value = input.value.trim();
            if (!value) return;

            // Echo command
            const cmdLine = document.createElement('div');
            cmdLine.innerHTML = `<span class="prompt-user">uday@portfolio</span>:<span class="prompt-path">~</span>$ ${escapeHtml(value)}`;
            output.appendChild(cmdLine);

            // Parse and execute
            const [cmd, ...args] = value.toLowerCase().split(' ');
            let result;

            if (commands[cmd]) {
                result = commands[cmd](args.join(' '));
            } else if (value) {
                result = `bash: ${cmd}: command not found`;
            }

            if (result !== null && result !== undefined) {
                const resultLine = document.createElement('div');
                resultLine.style.whiteSpace = 'pre-wrap';
                resultLine.textContent = result;
                output.appendChild(resultLine);
            }

            output.appendChild(document.createElement('br'));

            input.value = '';
            output.scrollTop = output.scrollHeight;
        }
    });
}
