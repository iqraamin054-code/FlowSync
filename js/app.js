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
    const dashSearchInput = document.getElementById('dash-search-input');
    const dashStateLabels = {
        projects: 'Project Workspace',
        automation: 'Automation Center',
        analytics: 'Business Analytics'
    };
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

                    // Update search placeholder to reflect current section
                    if (dashSearchInput) {
                        dashSearchInput.placeholder = state ? (dashStateLabels[state] || 'Overview') : 'Overview';
                    }

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

    // ────────────────────────────────────────────────────────────
    // PRICING CALCULATOR
    // ────────────────────────────────────────────────────────────

    const calc = {
        el: {
            slider: document.getElementById('team-size'),
            valueDisplay: document.getElementById('team-size-value'),
            radios: document.querySelectorAll('input[name="billing"]'),
            planBtns: document.querySelectorAll('.calc-plan-btn'),
            planBadge: document.getElementById('calc-plan-badge'),
            billingLabel: document.getElementById('calc-billing-label'),
            billingDisplay: document.getElementById('calc-billing-display'),
            monthlyPrice: document.getElementById('calc-monthly-price'),
            periodLabel: document.getElementById('calc-period-label'),
            discountRow: document.getElementById('calc-discount-row'),
            discountAmount: document.getElementById('calc-discount-amount'),
            savingsRow: document.getElementById('calc-savings-row'),
            savings: document.getElementById('calc-savings'),
            estimatedMonthly: document.getElementById('calc-estimated-monthly'),
            estimatedYearly: document.getElementById('calc-estimated-yearly'),
            members: document.getElementById('calc-members'),
            cta: document.getElementById('calc-cta')
        },
        state: {
            teamSize: 1,
            billing: 'monthly',
            plan: 'starter'
        },
        prices: { starter: 12, professional: 24, enterprise: 39 }
    };

    if (!calc.el.slider) return;

    function animateValue(el, target, prefix, suffix, duration) {
        if (!el) return;
        const current = parseFloat(el.textContent.replace(/[$,]/g, '')) || 0;
        if (current === target) return;
        el.classList.add('updating');
        const startTime = performance.now();
        const diff = target - current;

        function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            const val = current + diff * eased;
            el.textContent = prefix + val.toFixed(2) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.classList.remove('updating');
        }

        requestAnimationFrame(tick);
    }

    function formatCurrency(val) {
        return '$' + val.toFixed(2);
    }

    function updateCalculator() {
        const { teamSize, billing, plan } = calc.state;
        const pricePerUser = calc.prices[plan];
        const monthlyRaw = pricePerUser * teamSize;
        const isYearly = billing === 'yearly';
        const discount = isYearly ? monthlyRaw * 12 * 0.2 : 0;
        const yearlyRaw = monthlyRaw * 12;
        const yearlyAfterDiscount = yearlyRaw - discount;
        const monthlyEffective = isYearly ? yearlyAfterDiscount / 12 : monthlyRaw;

        // Animate displayed values
        animateValue(calc.el.monthlyPrice, monthlyEffective, '', '', 400);
        animateValue(calc.el.estimatedMonthly, monthlyEffective, '$', '', 400);
        animateValue(calc.el.estimatedYearly, yearlyAfterDiscount, '$', '', 400);

        // Static updates
        if (calc.el.members) calc.el.members.textContent = teamSize;
        if (calc.el.planBadge) calc.el.planBadge.textContent = plan.charAt(0).toUpperCase() + plan.slice(1);
        if (calc.el.periodLabel) calc.el.periodLabel.textContent = isYearly ? '/mo (billed yearly)' : '/mo';
        if (calc.el.billingLabel) calc.el.billingLabel.textContent = isYearly ? 'Yearly' : 'Monthly';
        if (calc.el.billingDisplay) calc.el.billingDisplay.textContent = isYearly ? 'Yearly' : 'Monthly';

        // Discount & Savings rows
        if (isYearly) {
            if (calc.el.discountRow) calc.el.discountRow.style.display = 'flex';
            if (calc.el.discountAmount) calc.el.discountAmount.textContent = '-' + formatCurrency(discount);
            if (calc.el.savingsRow) calc.el.savingsRow.style.display = 'flex';
            if (calc.el.savings) calc.el.savings.textContent = formatCurrency(discount) + '/year';
        } else {
            if (calc.el.discountRow) calc.el.discountRow.style.display = 'none';
            if (calc.el.savingsRow) calc.el.savingsRow.style.display = 'none';
        }

        // Pulse CTA
        if (calc.el.cta) {
            calc.el.cta.classList.remove('pulse');
            void calc.el.cta.offsetWidth;
            calc.el.cta.classList.add('pulse');
        }
    }

    // Slider
    calc.el.slider.addEventListener('input', () => {
        calc.state.teamSize = parseInt(calc.el.slider.value, 10);
        if (calc.el.valueDisplay) calc.el.valueDisplay.textContent = calc.state.teamSize;
        calc.el.slider.setAttribute('aria-valuenow', calc.state.teamSize);
        updateCalculator();
    });

    // Billing radios
    calc.el.radios.forEach(radio => {
        radio.addEventListener('change', () => {
            if (radio.checked) {
                calc.state.billing = radio.value;
                updateCalculator();
            }
        });
    });

    // Plan buttons
    calc.el.planBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            calc.el.planBtns.forEach(b => {
                b.classList.remove('active');
                b.setAttribute('aria-checked', 'false');
                b.setAttribute('tabindex', '-1');
            });
            btn.classList.add('active');
            btn.setAttribute('aria-checked', 'true');
            btn.setAttribute('tabindex', '0');
            btn.focus();
            calc.state.plan = btn.getAttribute('data-plan');
            updateCalculator();
        });

        btn.addEventListener('keydown', (e) => {
            const btns = Array.from(calc.el.planBtns);
            const idx = btns.indexOf(btn);
            let nextIdx = -1;
            if (e.key === 'ArrowRight' || e.key === 'ArrowDown') nextIdx = (idx + 1) % btns.length;
            else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') nextIdx = (idx - 1 + btns.length) % btns.length;
            if (nextIdx >= 0) {
                e.preventDefault();
                btns[nextIdx].click();
            }
        });
    });

    // Initialize
    calc.el.slider.value = 1;
    calc.el.valueDisplay.textContent = '1';
    updateCalculator();

    // ────────────────────────────────────────────────────────────
    // LOGIN MODAL
    // ────────────────────────────────────────────────────────────

    const loginOverlay = document.getElementById('login-overlay');
    const loginModal = document.querySelector('.login-modal');
    const loginForm = document.getElementById('login-form');
    const loginEmail = document.getElementById('login-email');
    const loginPassword = document.getElementById('login-password');
    const loginError = document.getElementById('login-error');
    const loginBtn = document.getElementById('login-btn');
    const loginClose = document.getElementById('login-close');
    const loginBack = document.getElementById('login-back');
    const loginTrial = document.getElementById('login-trial');

    function openLoginModal() {
        loginOverlay.classList.add('is-open');
        loginOverlay.removeAttribute('aria-hidden');
        document.body.style.overflow = 'hidden';
        loginForm.reset();
        loginError.classList.remove('is-visible');
        loginError.textContent = '';
        loginModal.classList.remove('shake');
        setTimeout(() => loginEmail.focus(), 100);
    }

    function closeLoginModal() {
        loginOverlay.classList.remove('is-open');
        loginOverlay.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        loginError.classList.remove('is-visible');
        loginError.textContent = '';
    }

    if (loginOverlay && loginForm) {
        // Open on Login button clicks
        document.querySelectorAll('.nav-login, .nav-drawer-login').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                openLoginModal();
            });
        });

        // Close via close button
        if (loginClose) loginClose.addEventListener('click', closeLoginModal);

        // Close via Back to Home button
        if (loginBack) loginBack.addEventListener('click', closeLoginModal);

        // Close on overlay click
        loginOverlay.addEventListener('click', (e) => {
            if (e.target === loginOverlay) closeLoginModal();
        });

        // Close on Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && loginOverlay.classList.contains('is-open')) closeLoginModal();
        });

        // Start Free Trial inside modal → go to onboarding
        if (loginTrial) {
            loginTrial.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.href = 'onboarding.html';
            });
        }

        // Form submit
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            loginError.classList.remove('is-visible');
            loginError.textContent = '';
            loginModal.classList.remove('shake');

            const email = loginEmail.value.trim();
            const password = loginPassword.value.trim();

            if (!email || !password) {
                loginError.textContent = 'Please fill in all fields.';
                loginError.classList.add('is-visible');
                loginModal.classList.add('shake');
                return;
            }

            const storedEmail = localStorage.getItem('flowsync-email');
            const storedPassword = localStorage.getItem('flowsync-password');

            if (!storedEmail || email.toLowerCase() !== storedEmail.toLowerCase()) {
                loginError.textContent = 'No account found. Please start your free trial.';
                loginError.classList.add('is-visible');
                loginModal.classList.add('shake');
                loginBtn.classList.add('loading');
                setTimeout(() => loginBtn.classList.remove('loading'), 600);
                return;
            }

            if (password !== storedPassword) {
                loginError.textContent = 'Incorrect password.';
                loginError.classList.add('is-visible');
                loginModal.classList.add('shake');
                loginBtn.classList.add('loading');
                setTimeout(() => loginBtn.classList.remove('loading'), 600);
                return;
            }

            // Success
            loginBtn.textContent = 'Signing in...';
            loginBtn.classList.add('loading');
            localStorage.setItem('isLoggedIn', 'true');
            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);
        });
    }

    // Password visibility toggle
    const pwToggle = document.getElementById('login-pw-toggle');
    const pwInput = document.getElementById('login-password');
    if (pwToggle && pwInput) {
        pwToggle.addEventListener('click', () => {
            const isPassword = pwInput.getAttribute('type') === 'password';
            pwInput.setAttribute('type', isPassword ? 'text' : 'password');
            pwToggle.querySelector('.login-eye').style.display = isPassword ? 'none' : '';
            pwToggle.querySelector('.login-eye-off').style.display = isPassword ? '' : 'none';
        });
    }

    /* ── Scroll Reveal ── */
    const initReveal = () => {
        if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
        const els = document.querySelectorAll('.reveal');
        if (!els.length) return;
        const io = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('reveal-visible');
                    io.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15, rootMargin: '0px 0px -80px 0px' });
        els.forEach((el) => io.observe(el));
    };
    initReveal();

    /* ── Cursor Glow ── */
    (() => {
        const glow = document.getElementById('cursor-glow');
        if (!glow || matchMedia('(hover: none) and (pointer: coarse)').matches) return;
        let raf = null;
        const onMove = (e) => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                glow.style.transform = `translate(calc(${e.clientX}px - 50%), calc(${e.clientY}px - 50%))`;
            });
        };
        document.addEventListener('mousemove', onMove, { passive: true });
    })();

    /* ── Back to Top ── */
    (() => {
        const btn = document.getElementById('back-to-top');
        if (!btn) return;
        let ticking = false;
        const onScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    btn.classList.toggle('is-visible', window.scrollY > 400);
                    ticking = false;
                });
                ticking = true;
            }
        };
        window.addEventListener('scroll', onScroll, { passive: true });
        btn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    })();
});
