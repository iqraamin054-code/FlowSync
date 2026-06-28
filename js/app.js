document.addEventListener('DOMContentLoaded', () => {

    /* ---- Theme: saved preference, default dark ---- */
    const stored = localStorage.getItem('flowsync-theme');
    const initialTheme = stored || '';
    document.documentElement.setAttribute('data-theme', initialTheme);
    const isLight = initialTheme === 'light';
    const label = isLight ? 'Switch to dark mode' : 'Switch to light mode';
    const themeText = isLight ? 'Light Mode' : 'Dark Mode';
    document.querySelectorAll('.theme-toggle').forEach(b => b.setAttribute('aria-label', label));
    document.querySelectorAll('.theme-label').forEach(l => l.textContent = themeText);

    /* ---- Hamburger Toggle ---- */
    const toggleBtn = document.getElementById('nav-toggle-btn');
    const navMenu = document.getElementById('nav-menu');
    const navOverlay = document.getElementById('nav-overlay');

    const closeNav = () => {
        navMenu.classList.remove('active');
        toggleBtn.classList.remove('active');
        toggleBtn.setAttribute('aria-expanded', 'false');
        navOverlay.classList.remove('active');
        document.body.style.overflow = '';
    };

    const openNav = () => {
        navMenu.classList.add('active');
        toggleBtn.classList.add('active');
        toggleBtn.setAttribute('aria-expanded', 'true');
        navOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const restoreDesktop = () => {
        if (window.innerWidth > 991) {
            document.body.style.overflow = '';
            if (navMenu.classList.contains('active')) closeNav();
        }
    };
    window.addEventListener('resize', restoreDesktop);

    const closeBtn = document.getElementById('nav-close-btn');

    if (toggleBtn && navMenu && navOverlay) {
        toggleBtn.addEventListener('click', () => {
            const isActive = navMenu.classList.contains('active');
            if (isActive) closeNav(); else openNav();
        });

        if (closeBtn) closeBtn.addEventListener('click', closeNav);

        navOverlay.addEventListener('click', closeNav);

        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', closeNav);
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && navMenu.classList.contains('active')) closeNav();
        });
    }

    /* ---- Theme Toggle ---- */
    document.querySelectorAll('.theme-toggle').forEach(btn => {
        btn.addEventListener('click', () => {
            const html = document.documentElement;
            const isLight = html.getAttribute('data-theme') === 'light';
            const next = isLight ? '' : 'light';
            html.setAttribute('data-theme', next);
            localStorage.setItem('flowsync-theme', next);
            const newLabel = next === 'light' ? 'Switch to dark mode' : 'Switch to light mode';
            const themeText = next === 'light' ? 'Light Mode' : 'Dark Mode';
            document.querySelectorAll('.theme-toggle').forEach(b => {
                b.setAttribute('aria-label', newLabel);
            });
            document.querySelectorAll('.theme-label').forEach(l => {
                l.textContent = themeText;
            });
        });
    });

    /* ---- FAQ Accordion (delegated) ---- */
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', function () {
            const item = this.parentElement;
            const isActive = item.classList.contains('active');

            document.querySelectorAll('.faq-item.active').forEach(open => {
                if (open !== item) open.classList.remove('active');
            });

            item.classList.toggle('active');
        });
    });

    /* ---- Counter Animation ---- */
    const counters = document.querySelectorAll('.stat-num');
    if (counters.length) {
        let countersAnimated = false;

        const animateCounters = () => {
            if (countersAnimated) return;
            countersAnimated = true;

            counters.forEach(counter => {
                const target = parseFloat(counter.getAttribute('data-target'));
                const isDecimal = target % 1 !== 0;
                const duration = 2000;
                const step = Math.max(target / 60, isDecimal ? 0.1 : 1);
                let current = 0;

                const update = () => {
                    current += step;
                    if (current >= target) {
                        counter.textContent = isDecimal ? target.toFixed(1) : Math.round(target);
                        return;
                    }
                    counter.textContent = isDecimal ? current.toFixed(1) : Math.round(current);
                    requestAnimationFrame(update);
                };

                update();
            });
        };

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.disconnect();
                }
            });
        }, { threshold: 0.3 });

        counters[0].closest('.stats-grid') &&
            observer.observe(counters[0].closest('.stats-grid'));
    }

    /* ---- Interactive Dashboard (Problem → Solution) ---- */
    const probCards = document.querySelectorAll('.problem-card[data-hover]');
    const dashWrapper = document.getElementById('interactive-dash');
    let dashDebounce = null;
    let dashAnimating = false;
    let dashCurrentState = null;

    if (probCards.length && dashWrapper) {
        // Initial: show activity rows and float card
        const initRows = dashWrapper.querySelectorAll('.activity-row');
        initRows.forEach(row => {
            row.style.opacity = '1';
            row.style.transform = 'translateY(0)';
        });
        const initFloat = dashWrapper.querySelector('.solution-float-card');
        if (initFloat) {
            initFloat.style.opacity = '1';
            initFloat.style.transform = 'scale(1)';
        }
        const animateKPI = (el, target, formatted) => {
            const isFormatted = !!formatted;
            const duration = 800;
            const start = performance.now();

            const update = (now) => {
                const elapsed = now - start;
                const progress = Math.min(elapsed / duration, 1);
                const eased = 1 - Math.pow(1 - progress, 3);
                const current = Math.round(eased * target);

                if (isFormatted) {
                    if (formatted === 'dollar') {
                        el.textContent = '$' + current.toLocaleString();
                    } else if (formatted === 'percent') {
                        el.textContent = '+' + current + '%';
                    } else if (formatted === 'percent-pure') {
                        el.textContent = current + '%';
                    }
                } else {
                    el.textContent = current;
                }

                if (progress < 1) {
                    requestAnimationFrame(update);
                } else {
                    if (isFormatted) {
                        if (formatted === 'dollar') {
                            el.textContent = '$' + target.toLocaleString();
                        } else if (formatted === 'percent') {
                            el.textContent = '+' + target + '%';
                        } else if (formatted === 'percent-pure') {
                            el.textContent = target + '%';
                        }
                    } else {
                        el.textContent = target;
                    }
                }
            };

            requestAnimationFrame(update);
        };

        const determineFormat = (text) => {
            if (text.includes('$')) return 'dollar';
            if (text === '+0%' || text.includes('%')) {
                if (text.startsWith('+')) return 'percent';
                return 'percent-pure';
            }
            return null;
        };

        const animateDashState = (state) => {
            if (dashAnimating) return;
            if (state === dashCurrentState) return;

            dashAnimating = true;

            const statsContainer = dashWrapper.querySelector('.dash-stats-container');
            const panelsContainer = dashWrapper.querySelector('.dash-panels-container');
            const floatCard = dashWrapper.querySelector('.solution-float-card');

            // Step 1: 150ms — wrapper fades to 70%
            dashWrapper.style.transition = 'opacity 0.15s ease';
            dashWrapper.style.opacity = '0.7';

            setTimeout(() => {
                // Step 2: 150ms — old content fades (handled by CSS transitions)
                // Remove old state
                if (dashCurrentState) {
                    dashWrapper.removeAttribute('data-dash-state');
                }

                setTimeout(() => {
                    // Step 3: 200ms — apply new state, start animations
                    if (state) {
                        dashWrapper.setAttribute('data-dash-state', state);
                    }
                    dashCurrentState = state;

                    // Reset counters to 0 before animating
                    const newStats = statsContainer.querySelectorAll('.stat-value[data-target]');
                    newStats.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        const currentText = stat.textContent;
                        const fmt = determineFormat(currentText);
                        if (fmt === 'dollar') stat.textContent = '$0';
                        else if (fmt === 'percent') stat.textContent = '+0%';
                        else if (fmt === 'percent-pure') stat.textContent = '0%';
                        else stat.textContent = '0';
                    });

                    // Trigger activity row cascading (reset then animate)
                    let targetContainer = panelsContainer.querySelector('[data-activity="' + (state || 'default') + '"]');
                    if (!targetContainer) {
                        // find visible one
                        targetContainer = panelsContainer.querySelector('.dash-panel-default .activity-list');
                    }
                    if (targetContainer) {
                        const rows = targetContainer.querySelectorAll('.activity-row');
                        rows.forEach((row, i) => {
                            row.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                            row.style.transitionDelay = (i * 80) + 'ms';
                            row.style.opacity = '0';
                            row.style.transform = 'translateY(8px)';
                            requestAnimationFrame(() => {
                                row.style.opacity = '1';
                                row.style.transform = 'translateY(0)';
                            });
                        });
                    }

                    // Animate KPIs with 800ms counter
                    newStats.forEach(stat => {
                        const target = parseInt(stat.getAttribute('data-target'));
                        if (isNaN(target)) return;
                        const currentText = stat.textContent;
                        const fmt = determineFormat(currentText);
                        animateKPI(stat, target, fmt);
                    });

                    // Float card animation
                    if (floatCard) {
                        floatCard.style.transition = 'opacity 0.35s ease, transform 0.35s ease';
                        floatCard.style.opacity = '0';
                        floatCard.style.transform = 'scale(0.95)';
                        requestAnimationFrame(() => {
                            floatCard.style.opacity = '1';
                            floatCard.style.transform = 'scale(1)';
                        });
                    }

                    setTimeout(() => {
                        // Step 4: 150ms — wrapper back to full opacity
                        dashWrapper.style.opacity = '1';
                        dashAnimating = false;
                    }, 200);
                }, 150);
            }, 150);
        };

        const resetToDefault = () => {
            if (dashAnimating) return;
            animateDashState(null);
        };

        probCards.forEach(card => {
            const state = card.getAttribute('data-hover');

            card.addEventListener('mouseenter', () => {
                if (dashDebounce) {
                    clearTimeout(dashDebounce);
                    dashDebounce = null;
                }
                animateDashState(state);
            });

            card.addEventListener('mouseleave', () => {
                if (dashDebounce) clearTimeout(dashDebounce);
                dashDebounce = setTimeout(() => {
                    resetToDefault();
                    dashDebounce = null;
                }, 500);
            });

            card.addEventListener('focus', () => {
                if (dashDebounce) {
                    clearTimeout(dashDebounce);
                    dashDebounce = null;
                }
                animateDashState(state);
            });

            card.addEventListener('blur', () => {
                if (dashDebounce) clearTimeout(dashDebounce);
                dashDebounce = setTimeout(() => {
                    resetToDefault();
                    dashDebounce = null;
                }, 500);
            });
        });
    }
});
