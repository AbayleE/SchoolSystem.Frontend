// Authentication pages integration
(function () {
    const roleCards = document.querySelectorAll('.role-card');
    const loginForm = document.getElementById('loginForm');
    const forgotForm = document.getElementById('forgotForm');
    const schoolGrid = document.getElementById('schoolGrid');
    const schoolSearch = document.getElementById('schoolSearch');
    const successMessage = document.getElementById('successMessage');
    const loginError = document.getElementById('loginError');

    let selectedRole = null;

    function setRole(card) {
        roleCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        selectedRole = card.dataset.role;
    }

    function initRoleSelection() {
        if (!roleCards.length) return;
        roleCards.forEach(card => {
            card.addEventListener('click', () => setRole(card));
        });
        const preselected = document.querySelector('.role-card.selected');
        if (preselected) {
            selectedRole = preselected.dataset.role;
        }
    }

    async function handleLogin(e) {
        e.preventDefault();
        if (!loginForm) return;

        const email = loginForm.querySelector('[data-login-email]')?.value?.trim();
        const password = loginForm.querySelector('[data-login-password]')?.value?.trim();
        const schoolId = localStorage.getItem('selectedSchoolId');

        if (!email || !password) {
            showInlineError('Please enter your email and password.');
            return;
        }

        const btn = loginForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner spinner-sm" style="border-color: white; border-top-color: transparent;"></div>';

        try {
            const payload = {
                email,
                password,
                role: selectedRole || undefined,
                schoolId: schoolId || undefined
            };

            const result = await Auth.login(payload);
            if (result.success) {
                Auth.redirectToDashboard();
                return;
            }

            showInlineError(result.error || 'Login failed.');
        } catch (error) {
            showInlineError(handleApiError(error));
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    async function handleForgot(e) {
        e.preventDefault();
        if (!forgotForm) return;

        const email = forgotForm.querySelector('[data-forgot-email]')?.value?.trim();
        if (!email) {
            return;
        }

        const btn = forgotForm.querySelector('button[type="submit"]');
        const originalText = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<div class="spinner spinner-sm" style="border-color: white; border-top-color: transparent;"></div>';

        try {
            await ApiClient.auth.requestPasswordReset(email);
            if (successMessage) {
                successMessage.style.display = 'block';
            }
            forgotForm.reset();
        } catch (error) {
            if (window.Toast) {
                Toast.error(handleApiError(error));
            }
        } finally {
            btn.disabled = false;
            btn.innerHTML = originalText;
        }
    }

    function showInlineError(message) {
        if (!loginError) return;
        loginError.textContent = message;
        loginError.style.display = 'block';
    }

    async function loadSchools(query = '') {
        if (!schoolGrid) return;
        schoolGrid.innerHTML = '<div class="card" style="grid-column: 1/-1; text-align: center; padding: var(--spacing-8);">Loading schools...</div>';

        try {
            const data = query
                ? await ApiClient.schools.search(query)
                : await ApiClient.schools.getAll();

            const schools = Array.isArray(data) ? data : (data.items || data.schools || []);
            renderSchools(schools);
        } catch (error) {
            schoolGrid.innerHTML = '<div class="card" style="grid-column: 1/-1; text-align: center; padding: var(--spacing-8);">No schools available.</div>';
        }
    }

    function renderSchools(schools) {
        if (!schoolGrid) return;
        if (!schools.length) {
            schoolGrid.innerHTML = '<div class="card" style="grid-column: 1/-1; text-align: center; padding: var(--spacing-8);">No schools found.</div>';
            return;
        }

        schoolGrid.innerHTML = schools.map(school => {
            const logo = school.logoUrl || school.logo || 'https://via.placeholder.com/80/1A73E8/FFFFFF?text=SC';
            const name = school.name || school.schoolName || 'Unnamed School';
            const location = school.city || school.location || 'Ethiopia';
            const count = school.studentCount || school.students || '—';

            return `
                <div class="school-card" data-school-id="${school.id || ''}">
                    <img src="${logo}" alt="${name}" class="school-logo">
                    <h3 class="school-name">${name}</h3>
                    <div class="school-info">
                        <div class="school-info-item">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd"/></svg>
                            ${location}
                        </div>
                        <div class="school-info-item">
                            <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/></svg>
                            ${count} Students
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        schoolGrid.querySelectorAll('.school-card').forEach(card => {
            card.addEventListener('click', () => {
                const schoolId = card.dataset.schoolId;
                const schoolName = card.querySelector('.school-name')?.textContent || '';
                const logoUrl = card.querySelector('.school-logo')?.src || '';

                localStorage.setItem('selectedSchoolId', schoolId || '');
                localStorage.setItem('selectedSchool', JSON.stringify({ id: schoolId, name: schoolName, logoUrl }));

                if (window.Toast) {
                    Toast.success('School selected successfully.');
                }

                setTimeout(() => {
                    window.location.href = 'login-new.html';
                }, 300);
            });
        });
    }

    function initSchoolSearch() {
        if (!schoolSearch) return;
        schoolSearch.addEventListener('input', debounce(() => {
            loadSchools(schoolSearch.value.trim());
        }, 300));
    }

    document.addEventListener('DOMContentLoaded', async () => {
        initRoleSelection();
        if (loginForm) {
            loginForm.addEventListener('submit', handleLogin);
        }
        if (forgotForm) {
            forgotForm.addEventListener('submit', handleForgot);
        }
        if (schoolGrid) {
            initSchoolSearch();
            loadSchools();
        }
        if (window.TenantTheme) {
            TenantTheme.loadTenantTheme();
        }
    });
})();
