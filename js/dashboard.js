/**
 * FlowSync Dashboard Script
 * Premium UX controls, dynamic preferences (theme, color, language, user data),
 * and interactive custom SVG charts.
 */

document.addEventListener('DOMContentLoaded', () => {
    // Session guard — redirect to landing if not logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = 'index.html';
        return;
    }

    // ────────────────────────────────────────────────────────────
    // 1. STATE & STORAGE PREFERENCES
    // ────────────────────────────────────────────────────────────

    const preferences = {
        theme: localStorage.getItem('flowsync-theme') || 'dark', // '' or 'dark' / 'light'
        accent: localStorage.getItem('flowsync-accent') || 'blue',
        language: localStorage.getItem('flowsync-language') || 'en',
        username: localStorage.getItem('flowsync-username') || 'Alex R.',
        company: localStorage.getItem('flowsync-company') || 'Synergy Analytics',
        members: parseInt(localStorage.getItem('flowsync-team-members'), 10) || 1
    };

    // DOM Elements
    const root = document.documentElement;
    const dbThemeBtn = document.getElementById('db-theme-btn');
    
    // User profile elements
    const usernameUpper = document.getElementById('username-upper');
    const usernameLower = document.getElementById('username-lower');
    const avatarUpper = document.getElementById('avatar-upper');
    const avatarLower = document.getElementById('avatar-lower');
    const dashboardHeading = document.getElementById('dashboard-heading');

    // ────────────────────────────────────────────────────────────
    // 2. THEME SYNCHRONIZATION
    // ────────────────────────────────────────────────────────────

    function applyTheme(theme) {
        const attrVal = theme === 'light' ? 'light' : '';
        root.setAttribute('data-theme', attrVal);
        preferences.theme = theme;
        localStorage.setItem('flowsync-theme', attrVal === 'light' ? 'light' : '');
    }

    // Initialize Theme — read raw localStorage value and normalize
    const rawTheme = localStorage.getItem('flowsync-theme');
    applyTheme(rawTheme === 'light' ? 'light' : 'dark');

    // Theme Toggle Handler
    if (dbThemeBtn) {
        dbThemeBtn.addEventListener('click', () => {
            const nextTheme = root.getAttribute('data-theme') === 'light' ? 'dark' : 'light';
            applyTheme(nextTheme);
        });
    }

    // ────────────────────────────────────────────────────────────
    // 3. ACCENT COLOR STYLING
    // ────────────────────────────────────────────────────────────

    function applyAccentColor(accentColor) {
        const colorsMap = {
            blue: { primary: '#2563EB', hover: '#1D4ED8', glow: 'rgba(37, 99, 235, 0.15)', rgb: '37, 99, 235' },
            purple: { primary: '#7C3AED', hover: '#6D28D9', glow: 'rgba(124, 58, 237, 0.15)', rgb: '124, 58, 237' },
            green: { primary: '#10B981', hover: '#059669', glow: 'rgba(16, 185, 129, 0.15)', rgb: '16, 185, 129' },
            pink: { primary: '#EC4899', hover: '#DB2777', glow: 'rgba(236, 72, 153, 0.15)', rgb: '236, 72, 153' },
            red: { primary: '#EF4444', hover: '#DC2626', glow: 'rgba(239, 68, 68, 0.15)', rgb: '239, 68, 68' }
        };

        const config = colorsMap[accentColor] || colorsMap.blue;
        root.style.setProperty('--color-primary', config.primary);
        root.style.setProperty('--color-primary-hover', config.hover);
        root.style.setProperty('--shadow-glow-primary', config.glow);
        root.style.setProperty('--color-primary-rgb', config.rgb);
    }

    // Initialize Accent Color
    applyAccentColor(preferences.accent);

    // ────────────────────────────────────────────────────────────
    // 4. DYNAMIC USERNAME & COMPANY DATA
    // ────────────────────────────────────────────────────────────

    function getInitials(name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return 'FS';
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function applyUserPreferences() {
        // Names
        if (usernameUpper) usernameUpper.textContent = preferences.username;
        if (usernameLower) usernameLower.textContent = preferences.username;
        
        // Avatars
        const initials = getInitials(preferences.username);
        if (avatarUpper) avatarUpper.textContent = initials;
        if (avatarLower) avatarLower.textContent = initials;

        // Dropdown popover header profile info
        const pdName = document.getElementById('pd-name');
        const pdAvatar = document.getElementById('pd-avatar');
        if (pdName) pdName.textContent = preferences.username;
        if (pdAvatar) pdAvatar.textContent = initials;

        // Company
        if (dashboardHeading) {
            dashboardHeading.textContent = `FLOWSYNC • ${preferences.company.toUpperCase()} OVERVIEW`;
        }
    }

    applyUserPreferences();

    // ────────────────────────────────────────────────────────────
    // 5. LOCALIZATION & TRANSLATIONS
    // ────────────────────────────────────────────────────────────

    const translations = {
        en: {
            dashboard: "Dashboard",
            analytics: "Analytics",
            projects: "Projects",
            team: "Team",
            messages: "Messages",
            settings: "Settings",
            active: "active",
            activeUsers: "Active Users",
            monthlyRevenue: "Monthly Revenue",
            conversionRate: "Conversion Rate",
            growth: "Growth",
            growthTrends: "Platform Growth Trends",
            projectStatus: "Project Status",
            ongoingCount: "4 ongoing projects",
            activityFeed: "Team Activity Feed",
            globalView: "Global View",
            localView: "Local View",
            global: "Global",
            local: "Local",
            act1: "completed UK Sync",
            act2: "pushed code to main now",
            act3: "created report",
            membersLabel: "Members",
            workspaceLabel: "Workspace",
            possibilitiesLabel: "Possibilities"
        },
        "en-gb": {
            dashboard: "Dashboard",
            analytics: "Analytics",
            projects: "Projects",
            team: "Team",
            messages: "Messages",
            settings: "Settings",
            active: "active",
            activeUsers: "Active Users",
            monthlyRevenue: "Monthly Revenue",
            conversionRate: "Conversion Rate",
            growth: "Growth",
            growthTrends: "Platform Growth Trends",
            projectStatus: "Project Status",
            ongoingCount: "4 ongoing projects",
            activityFeed: "Team Activity Feed",
            globalView: "Global View",
            localView: "Local View",
            global: "Global",
            local: "Local",
            act1: "completed UK Sync",
            act2: "pushed code to main now",
            act3: "created report",
            membersLabel: "Members",
            workspaceLabel: "Workspace",
            possibilitiesLabel: "Possibilities"
        },
        de: {
            dashboard: "Übersicht",
            analytics: "Analysen",
            projects: "Projekte",
            team: "Team",
            messages: "Nachrichten",
            settings: "Einstellungen",
            active: "aktiv",
            activeUsers: "Aktive Benutzer",
            monthlyRevenue: "Monatlicher Umsatz",
            conversionRate: "Konversionsrate",
            growth: "Wachstum",
            growthTrends: "Plattform-Wachstumstrends",
            projectStatus: "Projektstatus",
            ongoingCount: "4 laufende Projekte",
            activityFeed: "Aktivitäts-Feed",
            globalView: "Globale Ansicht",
            localView: "Lokale Ansicht",
            global: "Global",
            local: "Lokal",
            act1: "hat UK-Sync abgeschlossen",
            act2: "hat Code in Main gepusht",
            act3: "hat Bericht erstellt",
            membersLabel: "Mitglieder",
            workspaceLabel: "Arbeitsbereich",
            possibilitiesLabel: "Möglichkeiten"
        },
        fr: {
            dashboard: "Tableau de Bord",
            analytics: "Analyses",
            projects: "Projets",
            team: "Équipe",
            messages: "Messages",
            settings: "Paramètres",
            active: "actif",
            activeUsers: "Utilisateurs Actifs",
            monthlyRevenue: "Revenu Mensuel",
            conversionRate: "Taux de Conversion",
            growth: "Croissance",
            growthTrends: "Tendances de Croissance",
            projectStatus: "Statut des Projets",
            ongoingCount: "4 projets en cours",
            activityFeed: "Flux d'Activité",
            globalView: "Vue Globale",
            localView: "Vue Locale",
            global: "Global",
            local: "Local",
            act1: "a terminé la synchro UK",
            act2: "a déployé le code sur main",
            act3: "a créé un rapport",
            membersLabel: "Membres",
            workspaceLabel: "Espace",
            possibilitiesLabel: "Possibilités"
        },
        es: {
            dashboard: "Tablero",
            analytics: "Analítica",
            projects: "Proyectos",
            team: "Equipo",
            messages: "Mensajes",
            settings: "Ajustes",
            active: "activo",
            activeUsers: "Usuarios Activos",
            monthlyRevenue: "Ingresos Mensuales",
            conversionRate: "Tasa de Conversión",
            growth: "Crecimiento",
            growthTrends: "Tendencias de Crecimiento",
            projectStatus: "Estado de Proyectos",
            ongoingCount: "4 proyectos en curso",
            activityFeed: "Feed de Actividad",
            globalView: "Vista Global",
            localView: "Vista Local",
            global: "Global",
            local: "Local",
            act1: "completó la sincronización UK",
            act2: "subió código a main ahora",
            act3: "creó un reporte",
            membersLabel: "Miembros",
            workspaceLabel: "Espacio",
            possibilitiesLabel: "Posibilidades"
        },
        ja: {
            dashboard: "ダッシュボード",
            analytics: "分析",
            projects: "プロジェクト",
            team: "チーム",
            messages: "メッセージ",
            settings: "設定",
            active: "アクティブ",
            activeUsers: "アクティブユーザー",
            monthlyRevenue: "月次収益",
            conversionRate: "コンバージョン率",
            growth: "成長率",
            growthTrends: "成長トレンド",
            projectStatus: "プロジェクト状況",
            ongoingCount: "4つの進行中プロジェクト",
            activityFeed: "チーム活動フィード",
            globalView: "グローバル表示",
            localView: "ローカル表示",
            global: "グローバル",
            local: "ローカル",
            act1: "がUK同期を完了しました",
            act2: "がコードをメインに反映しました",
            act3: "がレポートを作成しました",
            membersLabel: "メンバー",
            workspaceLabel: "ワークスペース",
            possibilitiesLabel: "可能性"
        },
        zh: {
            dashboard: "仪表板",
            analytics: "数据分析",
            projects: "项目",
            team: "团队",
            messages: "消息",
            settings: "设置",
            active: "在线",
            activeUsers: "活跃用户",
            monthlyRevenue: "月收入",
            conversionRate: "转化率",
            growth: "增长率",
            growthTrends: "平台增长趋势",
            projectStatus: "项目状态",
            ongoingCount: "4个进行中的项目",
            activityFeed: "团队动态列表",
            globalView: "全局视图",
            localView: "本地视图",
            global: "全局",
            local: "本地",
            act1: "完成了英国节点同步",
            act2: "刚刚推送代码到主分支",
            act3: "创建了新报告",
            membersLabel: "成员",
            workspaceLabel: "工作区",
            possibilitiesLabel: "无限可能"
        },
        ar: {
            dashboard: "لوحة التحكم",
            analytics: "التحليلات",
            projects: "المشاريع",
            team: "الفريق",
            messages: "الرسائل",
            settings: "الإعدادات",
            active: "نشط",
            activeUsers: "المستخدمين النشطين",
            monthlyRevenue: "الإيرادات الشهرية",
            conversionRate: "معدل التحويل",
            growth: "النمو",
            growthTrends: "اتجاهات نمو المنصة",
            projectStatus: "حالة المشاريع",
            ongoingCount: "٤ مشاريع مستمرة",
            activityFeed: "آخر نشاط للفريق",
            globalView: "عرض عالمي",
            localView: "عرض محلي",
            global: "عالمي",
            local: "محلي",
            act1: "أكمل مزامنة المملكة المتحدة",
            act2: "قام برفع الكود إلى الفرع الرئيسي",
            act3: "أنشأ تقريرًا جديدًا",
            membersLabel: "أعضاء",
            workspaceLabel: "مساحة العمل",
            possibilitiesLabel: "إمكانيات"
        },
        ur: {
            dashboard: "ڈیش بورڈ",
            analytics: "تجزیات",
            projects: "پروجیکٹس",
            team: "ٹیم",
            messages: "پیغامات",
            settings: "ترتیبات",
            active: "آن لائن",
            activeUsers: "فعال صارفین",
            monthlyRevenue: "ماہانہ آمدنی",
            conversionRate: "کنورژن ریٹ",
            growth: "ترقی",
            growthTrends: "پلیٹ فارم کی ترقی",
            projectStatus: "منصوبوں کی صورتحال",
            ongoingCount: "4 جاری منصوبے",
            activityFeed: "ٹیم کی سرگرمیاں",
            globalView: "عالمی تناظر",
            localView: "مقامی تناظر",
            global: "عالمی",
            local: "مقامی",
            act1: "نے یوکے سنک مکمل کر لیا",
            act2: "نے کوڈ مین برانچ میں پش کر دیا",
            act3: "نے نئی رپورٹ تیار کی",
            membersLabel: "ارکان",
            workspaceLabel: "کام کی جگہ",
            possibilitiesLabel: "امکانات"
        }
    };

    function translateUI(lang) {
        const dict = translations[lang] || translations.en;
        
        // Helper to safely translate elements
        // For nav links (which have SVG children), target the .nav-text span
        const t = (id, key) => {
            const el = document.getElementById(id);
            if (el && dict[key]) {
                const navText = el.querySelector('.nav-text');
                if (navText) {
                    navText.textContent = dict[key];
                } else {
                    el.textContent = dict[key];
                }
            }
        };

        const tClass = (selector, key) => {
            const el = document.querySelector(selector);
            if (el && dict[key]) el.textContent = dict[key];
        };

        // Navigation links
        t("nav-dashboard", "dashboard");
        t("nav-analytics", "analytics");
        t("nav-projects", "projects");
        t("nav-team", "team");
        t("nav-messages", "messages");
        t("nav-settings", "settings");

        // Profile active labels
        const statusLabels = document.querySelectorAll(".profile-status");
        statusLabels.forEach(el => el.textContent = dict.active);

        // Scope
        t("scope-status", "global");

        // KPI Widget Titles
        t("m1-title", "activeUsers");
        t("m2-title", "monthlyRevenue");
        t("m3-title", "conversionRate");
        t("m4-title", "growth");

        // Panel Titles
        tClass("#chart-heading", "growthTrends");
        tClass("#project-heading", "projectStatus");
        t("ongoing-projects-count", "ongoingCount");
        tClass("#activity-heading", "activityFeed");
        
        // Feed Items
        t("act-1", "act1");
        t("act-2", "act2");
        t("act-3", "act3");
    }

    // Initialize UI language translation
    translateUI(preferences.language);

    // ────────────────────────────────────────────────────────────
    // 5b. LANGUAGE SELECTOR HANDLER
    // ────────────────────────────────────────────────────────────
    const langSelector = document.getElementById("lang-selector");
    if (langSelector) {
        langSelector.value = preferences.language;
        langSelector.addEventListener('change', (e) => {
            const val = e.target.value;
            preferences.language = val;
            localStorage.setItem('flowsync-language', val);
            translateUI(val);
        });
    }

    // ────────────────────────────────────────────────────────────
    // 5c. MOBILE & DESKTOP HAMBURGER SIDEBAR TOGGLE
    // ────────────────────────────────────────────────────────────
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebar = document.querySelector('.db-sidebar');

    function openSidebar() {
        if (sidebar) {
            sidebar.classList.add('is-open');
            sidebar.classList.remove('is-closed');
        }
        if (sidebarOverlay) sidebarOverlay.classList.add('is-visible');
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', 'true');
            hamburgerBtn.classList.add('is-hidden'); // Hide the hamburger sign
        }
    }

    // Explicitly handles closing the sidebar
    function closeSidebar() {
        if (sidebar) {
            sidebar.classList.remove('is-open');
            sidebar.classList.add('is-closed');
        }
        if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
        if (hamburgerBtn) {
            hamburgerBtn.setAttribute('aria-expanded', 'false');
            hamburgerBtn.classList.remove('is-hidden'); // Show the hamburger sign
        }
    }

    // Hamburger is mobile-only: on desktop sidebar is always open
    if (hamburgerBtn) {
        hamburgerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            // Only toggle on mobile (hamburger is hidden on desktop via CSS)
            const isOpen = sidebar && sidebar.classList.contains('is-open');
            if (isOpen) {
                closeSidebar();
            } else {
                openSidebar();
            }
        });
    }

    if (sidebarCloseBtn) {
        sidebarCloseBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closeSidebar();
        });
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // On resize to desktop: reset any mobile open/close state
    window.addEventListener('resize', () => {
        if (window.innerWidth > 900) {
            // Desktop: sidebar is always visible, clear mobile state
            if (sidebar) {
                sidebar.classList.remove('is-open');
                sidebar.classList.remove('is-closed');
            }
            if (sidebarOverlay) sidebarOverlay.classList.remove('is-visible');
        }
    });

    // ────────────────────────────────────────────────────────────
    // ────────────────────────────────────────────────────────────
    // 5d. PREMIUM PROFILE DROPDOWN
    // ────────────────────────────────────────────────────────────

    const profileUpper = document.getElementById('sidebar-profile-upper');
    const pd = document.getElementById('profile-dropdown');
    let pdOpen = false;

    // User data from localStorage
    const userData = {
        name: localStorage.getItem('flowsync-username') || 'Alex R.',
        email: localStorage.getItem('flowsync-email') || 'alex@example.com',
        company: localStorage.getItem('flowsync-company') || 'Synergy Analytics',
        industry: localStorage.getItem('flowsync-industry') || 'Technology',
        teamSize: localStorage.getItem('flowsync-team-members') || '5',
        role: localStorage.getItem('flowsync-role') || 'Team Lead',
        theme: localStorage.getItem('flowsync-theme') || '',
        language: localStorage.getItem('flowsync-language') || 'en',
        accent: localStorage.getItem('flowsync-accent') || 'blue',
        notifEnabled: localStorage.getItem('flowsync-notif') !== 'false'
    };

    const langNames = {
        en: 'English', 'en-gb': 'English (UK)', de: 'Deutsch', fr: 'Français',
        es: 'Español', ja: '日本語', zh: '中文', ar: 'العربية', ur: 'اردو'
    };
    const langMap = { English: 'en', Urdu: 'ur', French: 'fr', Spanish: 'es' };

    function getInitials(name) {
        const parts = name.trim().split(/\s+/);
        if (parts.length === 0) return 'FS';
        if (parts.length === 1) return parts[0].substring(0, 2).toUpperCase();
        return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }

    function populateDropdown() {
        const avatars = document.querySelectorAll('#pd-avatar, #avatar-upper, #avatar-lower');
        const initials = getInitials(userData.name);
        avatars.forEach(el => { if (el) el.textContent = initials; });
        const nameEls = document.querySelectorAll('#pd-name, #username-upper, #username-lower');
        nameEls.forEach(el => { if (el) el.textContent = userData.name; });
        const emailEl = document.getElementById('pd-email');
        if (emailEl) emailEl.textContent = userData.email;
        const themeHint = document.getElementById('pd-hint-theme');
        if (themeHint) themeHint.textContent = userData.theme === 'light' ? 'Light' : 'Dark';
        const langHint = document.getElementById('pd-hint-lang');
        if (langHint) langHint.textContent = langNames[userData.language] || 'English';
        const notifToggle = document.getElementById('pd-notif-toggle');
        if (notifToggle) notifToggle.checked = userData.notifEnabled;
    }

    // Toggle dropdown
    function togglePD(e) {
        if (e && e.target.closest('.profile-alert-icon')) return;
        if (e) e.stopPropagation();
        pdOpen = !pdOpen;
        pd.classList.toggle('is-open', pdOpen);
        pd.removeAttribute('hidden');
        if (pdOpen) {
            pd.querySelectorAll('[tabindex="-1"]').forEach(el => el.setAttribute('tabindex', '0'));
            const firstItem = pd.querySelector('[data-action]');
            if (firstItem) setTimeout(() => firstItem.focus(), 100);
            populateDropdown();
        } else {
            pd.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', '-1'));
        }
    }

    function closePD() {
        if (!pdOpen) return;
        pdOpen = false;
        pd.classList.remove('is-open');
        pd.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', '-1'));
    }

    if (profileUpper && pd) {
        profileUpper.addEventListener('click', togglePD);
        pd.addEventListener('click', (e) => e.stopPropagation());
        document.addEventListener('click', closePD);
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && pdOpen) closePD(); });
    }

    // ── Menu item actions ──
    pd.addEventListener('click', (e) => {
        const btn = e.target.closest('[data-action]');
        if (!btn) return;
        const action = btn.getAttribute('data-action');
        if (action === 'profile') showProfileModal();
        else if (action === 'appearance') showAppearanceModal();
        else if (action === 'language') showLanguageModal();
        else if (action === 'settings') { closePD(); window.location.href = '#'; }
        else if (action === 'help') showHelpModal();
    });

    // Notifications toggle
    const notifToggle = document.getElementById('pd-notif-toggle');
    if (notifToggle) {
        notifToggle.addEventListener('change', () => {
            userData.notifEnabled = notifToggle.checked;
            localStorage.setItem('flowsync-notif', notifToggle.checked);
        });
    }

    // ── Helpers ──
    function createOverlay() {
        const ov = document.createElement('div');
        ov.className = 'pd-overlay';
        document.body.appendChild(ov);
        return ov;
    }

    function openOverlay(overlay) {
        overlay.classList.add('is-open');
        document.body.style.overflow = 'hidden';
    }

    function closeOverlay(overlay) {
        overlay.classList.remove('is-open');
        document.body.style.overflow = '';
        setTimeout(() => { if (overlay.parentNode) overlay.remove(); }, 300);
    }

    function closeOnEscape(overlay, e) {
        if (e.key === 'Escape') closeOverlay(overlay);
    }

    // ── Profile Modal ──
    function showProfileModal() {
        closePD();
        const ov = createOverlay();
        ov.innerHTML = `
            <div class="pd-modal" role="dialog" aria-label="Profile">
                <div class="pd-modal-header">
                    <span class="pd-modal-title">Profile</span>
                    <button class="pd-modal-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="pd-field"><span class="pd-field-label">Full Name</span><span class="pd-field-value">${userData.name}</span></div>
                <div class="pd-field"><span class="pd-field-label">Email</span><span class="pd-field-value">${userData.email}</span></div>
                <div class="pd-field"><span class="pd-field-label">Company</span><span class="pd-field-value">${userData.company}</span></div>
                <div class="pd-field"><span class="pd-field-label">Industry</span><span class="pd-field-value">${userData.industry}</span></div>
                <div class="pd-field"><span class="pd-field-label">Team Size</span><span class="pd-field-value">${userData.teamSize} members</span></div>
                <div class="pd-field"><span class="pd-field-label">Role</span><span class="pd-field-value">${userData.role}</span></div>
                <div class="pd-field"><span class="pd-field-label">Theme</span><span class="pd-field-value">${userData.theme === 'light' ? 'Light' : 'Dark'}</span></div>
                <div class="pd-field"><span class="pd-field-label">Language</span><span class="pd-field-value">${langNames[userData.language] || 'English'}</span></div>
            </div>`;
        ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov); });
        ov.querySelector('.pd-modal-close').addEventListener('click', () => closeOverlay(ov));
        document.addEventListener('keydown', (e) => closeOnEscape(ov, e), { once: true });
        openOverlay(ov);
    }

    // ── Appearance Modal ──
    function showAppearanceModal() {
        closePD();
        const ov = createOverlay();
        const currentTheme = userData.theme === 'light' ? 'light' : 'dark';
        ov.innerHTML = `
            <div class="pd-modal" role="dialog" aria-label="Appearance">
                <div class="pd-modal-header">
                    <span class="pd-modal-title">Appearance</span>
                    <button class="pd-modal-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="pd-theme-options">
                    <label class="pd-theme-opt${currentTheme === 'light' ? ' is-active' : ''}" data-theme-value="light">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                        <span>Light</span>
                        <span class="pd-theme-opt-indicator"></span>
                    </label>
                    <label class="pd-theme-opt${currentTheme === 'dark' ? ' is-active' : ''}" data-theme-value="dark">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                        <span>Dark</span>
                        <span class="pd-theme-opt-indicator"></span>
                    </label>
                    <label class="pd-theme-opt" data-theme-value="system">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                        <span>System</span>
                        <span class="pd-theme-opt-indicator"></span>
                    </label>
                </div>
            </div>`;
        ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov); });
        ov.querySelector('.pd-modal-close').addEventListener('click', () => closeOverlay(ov));
        document.addEventListener('keydown', (e) => closeOnEscape(ov, e), { once: true });
        ov.querySelectorAll('.pd-theme-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                const val = opt.getAttribute('data-theme-value');
                ov.querySelectorAll('.pd-theme-opt').forEach(o => o.classList.remove('is-active'));
                opt.classList.add('is-active');
                const theme = val === 'system' ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : val;
                userData.theme = theme;
                localStorage.setItem('flowsync-theme', theme === 'light' ? 'light' : '');
                root.setAttribute('data-theme', theme === 'light' ? 'light' : '');
                const hint = document.getElementById('pd-hint-theme');
                if (hint) hint.textContent = val.charAt(0).toUpperCase() + val.slice(1);
            });
        });
        openOverlay(ov);
    }

    // ── Language Modal ──
    function showLanguageModal() {
        closePD();
        const ov = createOverlay();
        const langs = [
            { code: 'en', label: 'English' }, { code: 'ur', label: 'Urdu' },
            { code: 'fr', label: 'French' }, { code: 'es', label: 'Spanish' }
        ];
        ov.innerHTML = `
            <div class="pd-modal" role="dialog" aria-label="Language">
                <div class="pd-modal-header">
                    <span class="pd-modal-title">Language</span>
                    <button class="pd-modal-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="pd-lang-options">
                    ${langs.map(l => `
                        <label class="pd-lang-opt${l.code === userData.language ? ' is-active' : ''}" data-lang="${l.code}">
                            <span>${l.label}</span>
                            <span class="pd-lang-opt-check"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg></span>
                        </label>
                    `).join('')}
                </div>
            </div>`;
        ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov); });
        ov.querySelector('.pd-modal-close').addEventListener('click', () => closeOverlay(ov));
        document.addEventListener('keydown', (e) => closeOnEscape(ov, e), { once: true });
        ov.querySelectorAll('.pd-lang-opt').forEach(opt => {
            opt.addEventListener('click', () => {
                const code = opt.getAttribute('data-lang');
                userData.language = code;
                localStorage.setItem('flowsync-language', code);
                ov.querySelectorAll('.pd-lang-opt').forEach(o => o.classList.remove('is-active'));
                opt.classList.add('is-active');
                const hint = document.getElementById('pd-hint-lang');
                const label = langs.find(l => l.code === code);
                if (hint && label) hint.textContent = label.label;
                // Re-translate dashboard if translateUI exists
                if (typeof translateUI === 'function') translateUI(code);
                // Update lang selector if present
                const langSel = document.getElementById('lang-selector');
                if (langSel) langSel.value = code;
            });
        });
        openOverlay(ov);
    }

    // ── Help Modal ──
    function showHelpModal() {
        closePD();
        const ov = createOverlay();
        ov.innerHTML = `
            <div class="pd-modal" role="dialog" aria-label="Help Center">
                <div class="pd-modal-header">
                    <span class="pd-modal-title">Help Center</span>
                    <button class="pd-modal-close" aria-label="Close"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg></button>
                </div>
                <div class="pd-help-content">
                    <p class="pd-help-text">Need help with FlowSync? Browse our resources or reach out to our support team.</p>
                    <div class="pd-help-links">
                        <a href="#" class="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg> Documentation</a>
                        <a href="#" class="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg> Contact Support</a>
                        <a href="#" class="pd-help-link"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg> Privacy & Security</a>
                    </div>
                </div>
            </div>`;
        ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov); });
        ov.querySelector('.pd-modal-close').addEventListener('click', () => closeOverlay(ov));
        document.addEventListener('keydown', (e) => closeOnEscape(ov, e), { once: true });
        openOverlay(ov);
    }

    // ── Logout Confirmation ──
    const pdLogoutBtn = document.getElementById('pd-logout-btn');
    if (pdLogoutBtn) {
        pdLogoutBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            closePD();
            const ov = createOverlay();
            ov.innerHTML = `
                <div class="pd-modal pd-confirm" role="alertdialog" aria-label="Logout">
                    <div class="pd-confirm-icon"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg></div>
                    <div class="pd-confirm-title">Logout?</div>
                    <p class="pd-confirm-msg">Are you sure you want to logout from FlowSync?</p>
                    <div class="pd-confirm-actions">
                        <button class="pd-confirm-cancel" id="pd-confirm-cancel">Cancel</button>
                        <button class="pd-confirm-logout" id="pd-confirm-logout-btn">Logout</button>
                    </div>
                </div>`;
            ov.addEventListener('click', (e) => { if (e.target === ov) closeOverlay(ov); });
            document.addEventListener('keydown', (e) => closeOnEscape(ov, e), { once: true });
            ov.querySelector('#pd-confirm-cancel').addEventListener('click', () => closeOverlay(ov));
            ov.querySelector('#pd-confirm-logout-btn').addEventListener('click', () => {
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('flowsync-username');
                localStorage.removeItem('flowsync-email');
                localStorage.removeItem('flowsync-company');
                localStorage.removeItem('flowsync-industry');
                localStorage.removeItem('flowsync-role');
                localStorage.removeItem('flowsync-team-members');
                window.location.href = 'index.html';
            });
            openOverlay(ov);
        });
    }

    // Init
    populateDropdown();

    // ────────────────────────────────────────────────────────────
    // 6. SVG LINE CHART TOOLTIP INTERACTION
    // ────────────────────────────────────────────────────────────

    const trendsChartContainer = document.getElementById('trends-chart-container');
    const chartTooltip = document.getElementById('chart-tooltip');
    
    if (trendsChartContainer && chartTooltip) {
        const hotspots = trendsChartContainer.querySelectorAll('.chart-hotspot');
        
        hotspots.forEach(spot => {
            spot.addEventListener('mouseenter', (e) => {
                const cx = parseFloat(spot.getAttribute('cx'));
                const cy = parseFloat(spot.getAttribute('cy'));
                const strokeColor = spot.getAttribute('fill');

                // Values based on coordinate
                let usersVal = "950";
                let trialsVal = "750";
                let dateVal = "Sept 21";

                if (cx === 310) {
                    dateVal = "Aug 15";
                    usersVal = "1,120";
                    trialsVal = "550";
                } else if (cx === 440 && strokeColor === '#10B981') {
                    dateVal = "Sept 21";
                    usersVal = "980";
                    trialsVal = "790";
                } else if (cx === 440 && strokeColor === '#7C3AED') {
                    dateVal = "Sept 21";
                    usersVal = "980";
                    trialsVal = "580";
                } else if (cx === 440) {
                    dateVal = "Sept 21";
                    usersVal = "1,040";
                    trialsVal = "750";
                }

                // Inject data to tooltip
                document.getElementById('tt-date').textContent = dateVal;
                document.getElementById('tt-val-users').textContent = usersVal;
                document.getElementById('tt-val-trials').textContent = trialsVal;

                // Show tooltip and position it near hotspot (percentage calculations for responsiveness)
                const widthPercent = (cx / 600) * 100;
                const heightPercent = (cy / 320) * 100;

                chartTooltip.style.left = `calc(${widthPercent}% - 60px)`;
                chartTooltip.style.top = `calc(${heightPercent}% - 90px)`;
                chartTooltip.classList.add('is-visible');
            });

            spot.addEventListener('mouseleave', () => {
                chartTooltip.classList.remove('is-visible');
            });
        });
    }

    // Ripple effects for cards
    const rippleCards = document.querySelectorAll('.ripple');
    rippleCards.forEach(card => {
        card.addEventListener('mousedown', (e) => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--ripple-x', `${x}%`);
            card.style.setProperty('--ripple-y', `${y}%`);
        });
    });

    // ────────────────────────────────────────────────────────────
    // 7. NOTIFICATIONS DROPDOWN
    // ────────────────────────────────────────────────────────────

    const notifBtn = document.getElementById('btn-notifications');
    let notifDropdown = null;

    if (notifBtn) {
        notifBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            if (notifDropdown && notifDropdown.parentNode) {
                notifDropdown.remove();
                notifDropdown = null;
                return;
            }

            notifDropdown = document.createElement('div');
            notifDropdown.className = 'notifications-dropdown';
            notifDropdown.innerHTML = `
                <div class="notif-header">Notifications</div>
                <div class="notif-item"><span class="notif-dot"></span> New Report Ready</div>
                <div class="notif-item"><span class="notif-dot"></span> System Update</div>
                <div class="notif-item"><span class="notif-dot"></span> 3 New Messages</div>
            `;

            notifBtn.appendChild(notifDropdown);
        });

        document.addEventListener('click', () => {
            if (notifDropdown && notifDropdown.parentNode) {
                notifDropdown.remove();
                notifDropdown = null;
            }
        });
    }

    // ────────────────────────────────────────────────────────────
    // 8. CHART LINE DRAW-IN ANIMATION
    // ────────────────────────────────────────────────────────────

    function animatePathDraw(paths, duration, stagger) {
        paths.forEach((path, i) => {
            const length = path.getTotalLength();
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;
            path.style.animation = `chartLineDraw ${duration}s cubic-bezier(0.16, 1, 0.3, 1) ${i * stagger}s forwards`;
        });
    }

    // Main chart glow lines
    const glowLines = document.querySelectorAll('.main-chart-svg .glow-line');
    animatePathDraw(glowLines, 1.5, 0.15);

    // KPI sparkline stroke paths (last path in each sparkline-svg)
    document.querySelectorAll('.sparkline-svg').forEach((svg, i) => {
        const paths = svg.querySelectorAll('path');
        if (paths.length > 0) {
            const strokePath = paths[paths.length - 1];
            const length = strokePath.getTotalLength();
            strokePath.style.strokeDasharray = length;
            strokePath.style.strokeDashoffset = length;
            strokePath.style.animation = `chartLineDraw 1s cubic-bezier(0.16, 1, 0.3, 1) ${0.4 + i * 0.1}s forwards`;
        }
    });
});
