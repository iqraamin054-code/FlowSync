/**
 * FlowSync Onboarding Script
 * Premium Multi-step UX and animations
 */

document.addEventListener('DOMContentLoaded', () => {
    // Current state
    let currentStep = 1;
    const totalSteps = 5;
    
    // Selections state
    const onboardingState = {
        role: '',
        companyName: '',
        industry: '',
        teamSize: '',
        country: '',
        teamMembers: [],
        theme: 'dark',
        accentColor: 'blue',
        notifications: {
            email: true,
            push: false,
            activity: true
        },
        language: 'en',
        integrations: {
            slack: false,
            gdrive: false,
            github: false
        }
    };

    // DOM Elements
    const mainShell = document.getElementById('onboarding-main');
    const progressFill = document.getElementById('progress-fill');
    const stepLabel = document.getElementById('step-label');
    const stepElements = document.querySelectorAll('.ob-step');
    const panels = document.querySelectorAll('.ob-panel');
    const obThemeBtn = document.getElementById('ob-theme-btn');
    
    // Step 1 Elements
    const roleCards = document.querySelectorAll('.s1-card');
    const s1NextBtn = document.getElementById('s1-next');
    
    // Step 2 Elements
    const s2Form = document.getElementById('s2-form');
    const companyNameInput = document.getElementById('company-name');
    const industrySelect = document.getElementById('industry');
    const teamSizeSelect = document.getElementById('team-size');
    const countrySelect = document.getElementById('country');
    const s2NextBtn = document.getElementById('s2-next');
    const s2BackBtn = document.getElementById('s2-back');

    // Step 3 Elements
    const inviteEmailInput = document.getElementById('invite-email');
    const inviteRoleSelect = document.getElementById('invite-role');
    const addMemberBtn = document.getElementById('add-member-btn');
    const s3MembersContainer = document.getElementById('s3-members');
    const s3EmptyHint = document.getElementById('s3-empty-hint');
    const s3NextBtn = document.getElementById('s3-next');
    const s3BackBtn = document.getElementById('s3-back');
    const s3SkipBtn = document.getElementById('s3-skip');

    // Step 4 Elements
    const s4ThemeLight = document.getElementById('ws-theme-light');
    const s4ThemeDark = document.getElementById('ws-theme-dark');
    const s4ThemeLightLabel = document.getElementById('theme-light-label');
    const s4ThemeDarkLabel = document.getElementById('theme-dark-label');
    
    const colorSwatches = document.querySelectorAll('.s4-color-swatch');
    const notifEmail = document.getElementById('notif-email');
    const notifPush = document.getElementById('notif-push');
    const notifActivity = document.getElementById('notif-activity');
    const languageSelect = document.getElementById('ws-language');
    const intSlack = document.getElementById('int-slack');
    const intGdrive = document.getElementById('int-gdrive');
    const intGithub = document.getElementById('int-github');
    const s4NextBtn = document.getElementById('s4-next');
    const s4BackBtn = document.getElementById('s4-back');

    // Step 5 Elements
    const loadingView = document.getElementById('s5-loading');
    const successView = document.getElementById('s5-success');
    const s5ProgressFill = document.getElementById('s5-progress-fill');
    const task1 = document.getElementById('task-1');
    const task2 = document.getElementById('task-2');
    const task3 = document.getElementById('task-3');
    const statMembers = document.getElementById('stat-members');
    const confettiCanvas = document.getElementById('confetti-canvas');

    // Initialize Ripple Hover Effect for buttons
    initializeRipples();

    // Theme Switcher Sync with Landing page system (data-theme)
    initTheme();

    // ────────────────────────────────────────────────────────────
    // NAVIGATION LOGIC (Horizontal Slide 400ms)
    // ────────────────────────────────────────────────────────────
    
    function updateProgress() {
        // Calculate progress percentage (20% to 100%)
        const percentage = (currentStep / totalSteps) * 100;
        progressFill.style.width = `${percentage}%`;
        progressFill.setAttribute('aria-valuenow', percentage);
        
        stepLabel.textContent = `Step ${currentStep} of ${totalSteps}`;

        // Update progress step indicators
        stepElements.forEach((el, idx) => {
            const stepNum = idx + 1;
            el.classList.remove('ob-step--active', 'ob-step--done');
            el.removeAttribute('aria-current');
            
            if (stepNum === currentStep) {
                el.classList.add('ob-step--active');
                el.setAttribute('aria-current', 'step');
            } else if (stepNum < currentStep) {
                el.classList.add('ob-step--done');
            }
        });
    }

    function goToStep(nextStep) {
        if (nextStep < 1 || nextStep > totalSteps) return;

        const currentPanel = document.querySelector(`.ob-panel[data-step="${currentStep}"]`);
        const nextPanel = document.querySelector(`.ob-panel[data-step="${nextStep}"]`);

        if (nextStep > currentStep) {
            // Sliding forward: exit left, enter from right
            currentPanel.classList.add('ob-panel--exit-left');
            currentPanel.classList.remove('ob-panel--active');
            
            nextPanel.classList.remove('ob-panel--exit-left');
            nextPanel.style.transform = 'translateX(60px)';
            
            // Force redraw/reflow
            nextPanel.offsetHeight;
            
            nextPanel.classList.add('ob-panel--active');
            nextPanel.style.transform = '';
        } else {
            // Sliding backward: exit right, enter from left
            currentPanel.classList.remove('ob-panel--active', 'ob-panel--exit-left');
            currentPanel.style.transform = 'translateX(60px)';
            
            nextPanel.classList.remove('ob-panel--exit-left');
            nextPanel.style.transform = 'translateX(-60px)';
            
            // Force redraw/reflow
            nextPanel.offsetHeight;
            
            nextPanel.classList.add('ob-panel--active');
            nextPanel.style.transform = '';
        }

        currentStep = nextStep;
        updateProgress();

        if (currentStep === 5) {
            startStep5Simulation();
        }
    }

    // ────────────────────────────────────────────────────────────
    // STEP 1: Welcome / Role selection
    // ────────────────────────────────────────────────────────────
    
    roleCards.forEach(card => {
        card.addEventListener('click', () => {
            // Clear current selection
            roleCards.forEach(c => {
                c.setAttribute('aria-pressed', 'false');
            });
            
            card.setAttribute('aria-pressed', 'true');
            onboardingState.role = card.getAttribute('data-value');
            
            // Enable Next Button
            s1NextBtn.removeAttribute('disabled');
            s1NextBtn.removeAttribute('aria-disabled');
        });
    });

    s1NextBtn.addEventListener('click', () => {
        if (onboardingState.role) {
            goToStep(2);
        }
    });

    // ────────────────────────────────────────────────────────────
    // STEP 2: Company Info / Floating labels & validation
    // ────────────────────────────────────────────────────────────

    const textInputs = [companyNameInput];
    const selectInputs = [industrySelect, teamSizeSelect, countrySelect];

    // Helper to clear error display
    function clearError(inputEl, errEl) {
        inputEl.classList.remove('is-invalid');
        errEl.textContent = '';
    }

    // Helper to set error display
    function setError(inputEl, errEl, message) {
        inputEl.classList.add('is-invalid');
        errEl.textContent = message;
    }

    // Inline validation listeners
    companyNameInput.addEventListener('input', () => {
        const errEl = document.getElementById('err-company-name');
        if (companyNameInput.value.trim().length > 0) {
            clearError(companyNameInput, errEl);
            companyNameInput.classList.add('has-value');
        } else {
            companyNameInput.classList.remove('has-value');
            setError(companyNameInput, errEl, 'Company name is required');
        }
    });

    selectInputs.forEach(select => {
        select.addEventListener('change', () => {
            const errEl = document.getElementById(`err-${select.id}`);
            if (select.value) {
                clearError(select, errEl);
                select.classList.add('has-value');
            }
        });
    });

    s2NextBtn.addEventListener('click', (e) => {
        e.preventDefault();
        let isValid = true;

        // Company Name Validate
        const compErr = document.getElementById('err-company-name');
        if (!companyNameInput.value.trim()) {
            setError(companyNameInput, compErr, 'Company name is required');
            isValid = false;
        } else {
            clearError(companyNameInput, compErr);
        }

        // Dropdowns Validate
        selectInputs.forEach(select => {
            const errEl = document.getElementById(`err-${select.id}`);
            if (!select.value) {
                setError(select, errEl, `${select.nextElementSibling.textContent.replace('*', '').trim()} is required`);
                isValid = false;
            } else {
                clearError(select, errEl);
            }
        });

        if (isValid) {
            onboardingState.companyName = companyNameInput.value.trim();
            onboardingState.industry = industrySelect.value;
            onboardingState.teamSize = teamSizeSelect.value;
            onboardingState.country = countrySelect.value;
            goToStep(3);
        }
    });

    s2BackBtn.addEventListener('click', () => {
        goToStep(1);
    });

    // ────────────────────────────────────────────────────────────
    // STEP 3: Invite Team
    // ────────────────────────────────────────────────────────────

    function renderMembers() {
        s3MembersContainer.innerHTML = '';
        if (onboardingState.teamMembers.length === 0) {
            s3EmptyHint.style.display = 'block';
        } else {
            s3EmptyHint.style.display = 'none';
            onboardingState.teamMembers.forEach((member, index) => {
                const chip = document.createElement('div');
                chip.className = 's3-chip';
                
                chip.innerHTML = `
                    <span class="s3-chip__email">${escapeHTML(member.email)}</span>
                    <span class="s3-chip__role">${escapeHTML(member.role)}</span>
                    <button class="s3-chip__remove" data-index="${index}" aria-label="Remove ${escapeHTML(member.email)}">
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                    </button>
                `;
                
                s3MembersContainer.appendChild(chip);
            });
        }

        // Attach delete events
        const removeButtons = s3MembersContainer.querySelectorAll('.s3-chip__remove');
        removeButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const index = parseInt(btn.getAttribute('data-index'), 10);
                onboardingState.teamMembers.splice(index, 1);
                renderMembers();
            });
        });
    }

    addMemberBtn.addEventListener('click', () => {
        const email = inviteEmailInput.value.trim();
        const role = inviteRoleSelect.value;
        const errEl = document.getElementById('err-invite-email');

        if (!email) {
            setError(inviteEmailInput, errEl, 'Email is required');
            return;
        }

        // Simple Email regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError(inviteEmailInput, errEl, 'Enter a valid email address');
            return;
        }

        // Check duplicates
        if (onboardingState.teamMembers.some(m => m.email.toLowerCase() === email.toLowerCase())) {
            setError(inviteEmailInput, errEl, 'Teammate already invited');
            return;
        }

        clearError(inviteEmailInput, errEl);
        onboardingState.teamMembers.push({ email, role });
        
        // Reset Inputs
        inviteEmailInput.value = '';
        inviteEmailInput.classList.remove('has-value');
        
        renderMembers();
        
        // Focus back
        inviteEmailInput.focus();
    });

    inviteEmailInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addMemberBtn.click();
        }
    });

    s3NextBtn.addEventListener('click', () => {
        goToStep(4);
    });

    s3SkipBtn.addEventListener('click', () => {
        onboardingState.teamMembers = [];
        renderMembers();
        goToStep(4);
    });

    s3BackBtn.addEventListener('click', () => {
        goToStep(2);
    });

    // ────────────────────────────────────────────────────────────
    // STEP 4: Workspace Preferences
    // ────────────────────────────────────────────────────────────

    // Theme Picker Event — persist to localStorage (same key + convention as app.js)
    s4ThemeLight.addEventListener('change', () => {
        s4ThemeLightLabel.classList.add('s4-theme-card--active');
        s4ThemeDarkLabel.classList.remove('s4-theme-card--active');
        onboardingState.theme = 'light';
        document.documentElement.setAttribute('data-theme', 'light');
        localStorage.setItem('flowsync-theme', 'light');
    });

    s4ThemeDark.addEventListener('change', () => {
        s4ThemeDarkLabel.classList.add('s4-theme-card--active');
        s4ThemeLightLabel.classList.remove('s4-theme-card--active');
        onboardingState.theme = 'dark';
        // app.js uses '' (empty string) for dark — match that convention
        document.documentElement.setAttribute('data-theme', '');
        localStorage.setItem('flowsync-theme', '');
    });

    // Accent Colors Swatches Selection
    colorSwatches.forEach(swatch => {
        const radio = swatch.querySelector('input[type="radio"]');
        swatch.addEventListener('click', () => {
            colorSwatches.forEach(s => s.classList.remove('s4-color-swatch--active'));
            swatch.classList.add('s4-color-swatch--active');
            radio.checked = true;
            onboardingState.accentColor = radio.value;
            updateAccentColorCSS(radio.value);
        });
    });

    function updateAccentColorCSS(colorName) {
        // Map selected swatch color to FlowSync primary variables
        const colorsMap = {
            blue: { primary: '#2563EB', hover: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.15)' },
            purple: { primary: '#7C3AED', hover: '#6D28D9', glow: 'rgba(124, 58, 237, 0.15)' },
            green: { primary: '#10B981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.15)' },
            pink: { primary: '#EC4899', hover: '#DB2777', glow: 'rgba(236, 72, 153, 0.15)' },
            red: { primary: '#EF4444', hover: '#DC2626', glow: 'rgba(239, 68, 68, 0.15)' }
        };

        const config = colorsMap[colorName] || colorsMap.blue;
        document.documentElement.style.setProperty('--color-primary', config.primary);
        document.documentElement.style.setProperty('--color-primary-hover', config.hover);
        document.documentElement.style.setProperty('--shadow-glow-primary', config.glow);
    }

    s4NextBtn.addEventListener('click', () => {
        // Collect state values
        onboardingState.notifications.email = notifEmail.checked;
        onboardingState.notifications.push = notifPush.checked;
        onboardingState.notifications.activity = notifActivity.checked;
        onboardingState.language = languageSelect.value;
        onboardingState.integrations.slack = intSlack.checked;
        onboardingState.integrations.gdrive = intGdrive.checked;
        onboardingState.integrations.github = intGithub.checked;
        
        goToStep(5);
    });

    s4BackBtn.addEventListener('click', () => {
        goToStep(3);
    });

    // ────────────────────────────────────────────────────────────
    // STEP 5: Success & Loading Simulation
    // ────────────────────────────────────────────────────────────

    function startStep5Simulation() {
        // Reset view states
        loadingView.style.display = 'flex';
        successView.style.display = 'none';
        successView.setAttribute('hidden', 'true');
        s5ProgressFill.style.width = '0%';
        
        // Reset tasks
        task1.className = 's5-task';
        task1.querySelector('.s5-task__icon').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ob-task-svg-spin"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`;
        task1.querySelector('.ob-task-svg-spin').style.animation = 'spin .8s linear infinite';
        
        task2.className = 's5-task s5-task--pending';
        task2.querySelector('.s5-task__icon').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M9 9h6M9 13h4"/></svg>`;
        
        task3.className = 's5-task s5-task--pending';
        task3.querySelector('.s5-task__icon').innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`;

        // Simulation Timeline
        
        // 1. Preparing Workspace (0s to 1.2s)
        setTimeout(() => {
            s5ProgressFill.style.width = '33%';
            completeTask(task1);
            startTaskSpinner(task2);
        }, 1200);

        // 2. Creating Dashboard (1.2s to 2.4s)
        setTimeout(() => {
            s5ProgressFill.style.width = '66%';
            completeTask(task2);
            startTaskSpinner(task3);
        }, 2400);

        // 3. Syncing Data (2.4s to 3.6s)
        setTimeout(() => {
            s5ProgressFill.style.width = '100%';
            completeTask(task3);
        }, 3600);

        // 4. Reveal success view (4.0s)
        setTimeout(() => {
            // Animate transition fade
            loadingView.style.opacity = '0';
            loadingView.style.transition = 'opacity .4s ease';
            
            setTimeout(() => {
                loadingView.style.display = 'none';
                successView.style.display = 'flex';
                successView.removeAttribute('hidden');
                
                // Set stats values
                statMembers.textContent = onboardingState.teamMembers.length + 1; // plus the user
                
                // Start confetti!
                initConfetti();
            }, 400);
        }, 4100);
    }

    function startTaskSpinner(taskEl) {
        taskEl.classList.remove('s5-task--pending');
        const iconEl = taskEl.querySelector('.s5-task__icon');
        iconEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="ob-task-svg-spin"><polyline points="23 4 23 10 17 10"/><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10"/></svg>`;
        iconEl.querySelector('.ob-task-svg-spin').style.animation = 'spin .8s linear infinite';
    }

    function completeTask(taskEl) {
        taskEl.classList.remove('s5-task--pending');
        taskEl.classList.add('s5-task--done');
        const iconEl = taskEl.querySelector('.s5-task__icon');
        iconEl.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>`;
    }

    // ────────────────────────────────────────────────────────────
    // HELPER FUNCTIONS & EFFECTS
    // ────────────────────────────────────────────────────────────

    // Escape HTML Helper
    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({
                '&': '&amp;',
                '<': '&lt;',
                '>': '&gt;',
                "'": '&#39;',
                '"': '&quot;'
            }[tag] || tag)
        );
    }

    // Interactive theme initializer — reads from localStorage, same key as landing page app.js
    function initTheme() {
        // app.js stores 'light' for light mode, '' (empty string) for dark mode
        const stored = localStorage.getItem('flowsync-theme');
        const isLight = stored === 'light';
        const attrValue = isLight ? 'light' : '';

        document.documentElement.setAttribute('data-theme', attrValue);
        onboardingState.theme = isLight ? 'light' : 'dark';

        // Sync Step 4 theme cards to match persisted preference
        if (isLight) {
            s4ThemeLight.checked = true;
            s4ThemeLightLabel.classList.add('s4-theme-card--active');
            s4ThemeDarkLabel.classList.remove('s4-theme-card--active');
        } else {
            s4ThemeDark.checked = true;
            s4ThemeDarkLabel.classList.add('s4-theme-card--active');
            s4ThemeLightLabel.classList.remove('s4-theme-card--active');
        }

        // Header theme toggle button
        obThemeBtn.addEventListener('click', () => {
            const current = document.documentElement.getAttribute('data-theme');
            const nextIsLight = current !== 'light';          // toggle
            const nextAttr    = nextIsLight ? 'light' : '';   // '' = dark (app.js convention)

            document.documentElement.setAttribute('data-theme', nextAttr);
            localStorage.setItem('flowsync-theme', nextAttr); // persist across pages
            onboardingState.theme = nextIsLight ? 'light' : 'dark';

            // Sync Step 4 theme cards if currently visible
            if (nextIsLight) {
                s4ThemeLight.checked = true;
                s4ThemeLightLabel.classList.add('s4-theme-card--active');
                s4ThemeDarkLabel.classList.remove('s4-theme-card--active');
            } else {
                s4ThemeDark.checked = true;
                s4ThemeDarkLabel.classList.add('s4-theme-card--active');
                s4ThemeLightLabel.classList.remove('s4-theme-card--active');
            }
        });
    }

    // Premium ripple effects logic
    function initializeRipples() {
        document.body.addEventListener('mousedown', (e) => {
            const button = e.target.closest('.ripple');
            if (!button) return;

            const rect = button.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            
            button.style.setProperty('--ripple-x', `${x}%`);
            button.style.setProperty('--ripple-y', `${y}%`);
        });
    }

    // Confetti Engine
    function initConfetti() {
        const ctx = confettiCanvas.getContext('2d');
        let animationFrameId;

        // Resize canvas to window size
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;

        const colors = ['#2563EB', '#7C3AED', '#38BDF8', '#10B981', '#F59E0B', '#EF4444'];
        const confettiCount = 180;
        const confettiList = [];

        class ConfettiParticle {
            constructor() {
                this.x = Math.random() * confettiCanvas.width;
                this.y = Math.random() * confettiCanvas.height - confettiCanvas.height;
                this.size = Math.random() * 8 + 6;
                this.color = colors[Math.floor(Math.random() * colors.length)];
                this.speed = Math.random() * 4 + 3;
                this.rotation = Math.random() * 360;
                this.rotationSpeed = Math.random() * 4 - 2;
                this.wobble = Math.random() * 10;
                this.wobbleSpeed = Math.random() * 0.05 + 0.02;
            }

            update() {
                this.y += this.speed;
                this.x += Math.sin(this.wobble) * 1.5;
                this.wobble += this.wobbleSpeed;
                this.rotation += this.rotationSpeed;
            }

            draw() {
                ctx.save();
                ctx.translate(this.x, this.y);
                ctx.rotate((this.rotation * Math.PI) / 180);
                ctx.fillStyle = this.color;
                ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
                ctx.restore();
            }
        }

        // Initialize particles
        for (let i = 0; i < confettiCount; i++) {
            confettiList.push(new ConfettiParticle());
        }

        let animationTime = 0;
        const maxAnimationTime = 300; // frames (~5 seconds)

        function animateConfetti() {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
            
            let elementsActive = false;
            confettiList.forEach(particle => {
                particle.update();
                particle.draw();
                if (particle.y < confettiCanvas.height) {
                    elementsActive = true;
                }
            });

            animationTime++;

            if (elementsActive && animationTime < maxAnimationTime) {
                animationFrameId = requestAnimationFrame(animateConfetti);
            } else {
                ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
                cancelAnimationFrame(animationFrameId);
            }
        }

        animateConfetti();

        // Responsive handling
        window.addEventListener('resize', () => {
            if (confettiCanvas) {
                confettiCanvas.width = window.innerWidth;
                confettiCanvas.height = window.innerHeight;
            }
        });
    }
});
