document.addEventListener('DOMContentLoaded', () => {
    const storedTheme = localStorage.getItem('flowsync-theme');
    const themeAttr = storedTheme === 'light' ? 'light' : '';
    document.documentElement.setAttribute('data-theme', themeAttr);

    const statMembers = document.getElementById('stat-members');
    const storedMembers = parseInt(localStorage.getItem('flowsync-team-members'), 10);
    statMembers.textContent = Number.isNaN(storedMembers) || storedMembers < 1 ? 1 : storedMembers;

    // Personalize the welcome title
    const storedName = localStorage.getItem('flowsync-username') || '';
    const titleEl = document.getElementById('s5-title');
    if (titleEl && storedName) {
        const firstName = storedName.trim().split(/\s+/)[0];
        titleEl.innerHTML = `Welcome, ${firstName}! <span class="s5-success__emoji" aria-hidden="true">🎉</span>`;
    }

    // Apply accent color from onboarding
    const accentMap = {
        blue:   { primary: '#2563EB', hover: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.15)' },
        purple: { primary: '#7C3AED', hover: '#6D28D9', glow: 'rgba(124, 58, 237, 0.15)' },
        green:  { primary: '#10B981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.15)' },
        pink:   { primary: '#EC4899', hover: '#DB2777', glow: 'rgba(236, 72, 153, 0.15)' },
        red:    { primary: '#EF4444', hover: '#DC2626', glow: 'rgba(239, 68, 68, 0.15)' }
    };
    const accentKey = localStorage.getItem('flowsync-accent') || 'blue';
    const accent = accentMap[accentKey] || accentMap.blue;
    document.documentElement.style.setProperty('--color-primary', accent.primary);
    document.documentElement.style.setProperty('--color-primary-hover', accent.hover);
    document.documentElement.style.setProperty('--shadow-glow-primary', accent.glow);

    const confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;

    const ctx = confettiCanvas.getContext('2d');
    if (!ctx) return;

    function resizeCanvas() {
        confettiCanvas.width = window.innerWidth;
        confettiCanvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

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

    for (let i = 0; i < confettiCount; i++) {
        confettiList.push(new ConfettiParticle());
    }

    let animationTime = 0;
    const maxAnimationTime = 300;

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
            requestAnimationFrame(animateConfetti);
        } else {
            ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        }
    }

    animateConfetti();
});