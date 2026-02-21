// Multi-tenant theme support
(function () {
    const THEME_STORAGE_KEY = 'selectedSchool';

    function getStoredSchool() {
        const raw = localStorage.getItem(THEME_STORAGE_KEY);
        if (!raw) {
            return null;
        }
        try {
            return JSON.parse(raw);
        } catch (e) {
            return { id: raw };
        }
    }

    function applyThemeVariables(theme = {}) {
        const root = document.documentElement;
        if (theme.primaryColor) {
            root.style.setProperty('--color-primary', theme.primaryColor);
        }
        if (theme.secondaryColor) {
            root.style.setProperty('--color-secondary', theme.secondaryColor);
        }
        if (theme.primaryLight) {
            root.style.setProperty('--color-primary-light', theme.primaryLight);
        }
        if (theme.primaryDark) {
            root.style.setProperty('--color-primary-dark', theme.primaryDark);
        }
    }

    function updateBranding(school = {}) {
        const nameEls = document.querySelectorAll('[data-school-name]');
        const logoEls = document.querySelectorAll('[data-school-logo]');
        const name = school.name || school.schoolName || '';
        const logo = school.logoUrl || school.logo || '';

        nameEls.forEach(el => {
            if (name) {
                el.textContent = name;
            }
        });

        logoEls.forEach(el => {
            if (logo) {
                el.src = logo;
                el.style.display = '';
            }
        });
    }

    async function loadTenantTheme() {
        const stored = getStoredSchool();
        if (!stored) {
            return;
        }

        if (stored.theme || stored.logoUrl || stored.name) {
            applyThemeVariables(stored.theme || stored);
            updateBranding(stored);
            return;
        }

        if (!window.ApiClient || !stored.id) {
            return;
        }

        try {
            const school = await ApiClient.schools.getById(stored.id);
            if (school) {
                localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(school));
                applyThemeVariables(school.theme || school);
                updateBranding(school);
            }
        } catch (error) {
            console.error('Failed to load tenant theme:', error);
        }
    }

    window.TenantTheme = {
        loadTenantTheme,
        applyThemeVariables,
        updateBranding
    };
})();
