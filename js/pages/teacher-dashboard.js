// Teacher Dashboard Integration
(function () {
    const scheduleBody = document.getElementById('teacherScheduleBody');
    const assignmentsContainer = document.getElementById('teacherAssignments');
    const performanceContainer = document.getElementById('teacherPerformance');

    const teacherName = document.getElementById('teacherName');
    const teacherGreetingName = document.getElementById('teacherGreetingName');
    const teacherGreetingSubtitle = document.getElementById('teacherGreetingSubtitle');

    const statStudents = document.getElementById('teacherStatStudents');
    const statStudentsNote = document.getElementById('teacherStatStudentsNote');
    const statClasses = document.getElementById('teacherStatClasses');
    const statClassesNote = document.getElementById('teacherStatClassesNote');
    const statPending = document.getElementById('teacherStatPending');
    const statPendingNote = document.getElementById('teacherStatPendingNote');
    const statToGrade = document.getElementById('teacherStatToGrade');
    const statToGradeNote = document.getElementById('teacherStatToGradeNote');
    const scheduleDate = document.getElementById('teacherScheduleDate');

    const assignmentBadge = document.getElementById('teacherAssignmentBadge');
    const messageBadge = document.getElementById('teacherMessageBadge');
    const notificationBadge = document.getElementById('teacherNotificationBadge');

    function setBadge(el, count) {
        if (!el) return;
        if (count && count > 0) {
            el.textContent = count;
            el.style.display = '';
        } else {
            el.style.display = 'none';
        }
    }

    function setText(el, value, fallback = '—') {
        if (!el) return;
        el.textContent = value || fallback;
    }

    function formatDateLabel(date) {
        const d = date ? new Date(date) : new Date();
        return d.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    }

    function renderSchedule(items = []) {
        if (!scheduleBody) return;
        if (!items.length) {
            scheduleBody.innerHTML = '<tr><td colspan="6" style="text-align: center; padding: var(--spacing-6); color: var(--color-text-tertiary);">No classes scheduled.</td></tr>';
            return;
        }

        scheduleBody.innerHTML = items.map(item => {
            const status = item.status || 'Upcoming';
            const badgeClass = status.toLowerCase().includes('progress') ? 'badge-primary'
                : status.toLowerCase().includes('complete') ? 'badge-success'
                : 'badge-gray';

            return `
                <tr>
                    <td><span class="font-medium">${item.time || ''}</span></td>
                    <td><strong>${item.className || ''}</strong></td>
                    <td>${item.subject || ''}</td>
                    <td>${item.room || ''}</td>
                    <td>${item.studentCount || '—'} students</td>
                    <td>
                        ${item.actionLabel
                            ? `<button class="btn btn-sm btn-primary">${item.actionLabel}</button>`
                            : `<span class="badge ${badgeClass}">${status}</span>`}
                    </td>
                </tr>
            `;
        }).join('');
    }

    function renderAssignments(items = []) {
        if (!assignmentsContainer) return;
        if (!items.length) {
            assignmentsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-title">No assignments</div><div class="empty-state-description">Assignments will appear here once created.</div></div>';
            return;
        }

        assignmentsContainer.innerHTML = items.map(item => {
            const dueDate = item.dueDate ? formatDate(item.dueDate) : '—';
            const submitted = item.submittedCount ?? 0;
            const total = item.totalCount ?? 0;
            const progress = total ? Math.round((submitted / total) * 100) : 0;
            const progressClass = progress >= 75 ? 'success' : progress >= 40 ? '' : 'warning';

            return `
                <div style="display: flex; gap: var(--spacing-4); padding: var(--spacing-4); background: var(--color-bg-secondary); border-radius: var(--radius-md);">
                    <div style="flex: 1;">
                        <div style="font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-1);">${item.title || 'Untitled Assignment'}</div>
                        <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${item.className || ''} • Due: ${dueDate}</div>
                        <div class="progress" style="margin-top: var(--spacing-2);"><div class="progress-bar ${progressClass}" style="width: ${progress}%;"></div></div>
                        <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: var(--spacing-1);">${submitted}/${total} submitted</div>
                    </div>
                    <div style="text-align: right;"><button class="btn btn-sm btn-outline">View</button></div>
                </div>
            `;
        }).join('');
    }

    function renderPerformance(items = []) {
        if (!performanceContainer) return;
        if (!items.length) {
            performanceContainer.innerHTML = '<div class="empty-state"><div class="empty-state-title">No performance data</div><div class="empty-state-description">Class performance metrics will appear here.</div></div>';
            return;
        }

        performanceContainer.innerHTML = items.map(item => {
            const percent = item.averageScore ?? 0;
            const barClass = percent >= 80 ? 'success' : percent >= 70 ? 'warning' : 'error';
            return `
                <div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: var(--spacing-2);">
                        <span style="font-weight: var(--font-weight-medium);">${item.className || ''}</span>
                        <span style="font-weight: var(--font-weight-bold);">${percent}%</span>
                    </div>
                    <div class="progress"><div class="progress-bar ${barClass}" style="width: ${Math.min(percent, 100)}%;"></div></div>
                </div>
            `;
        }).join('');
    }

    function updateUserProfile(user) {
        if (!user) return;
        const displayName = user.fullName || user.name || user.firstName || 'Teacher';
        setText(teacherName, displayName, 'Teacher');
        setText(teacherGreetingName, displayName, 'Teacher');
        if (teacherGreetingSubtitle && user.department) {
            teacherGreetingSubtitle.textContent = `Department: ${user.department}`;
        }

        const avatarEls = document.querySelectorAll('[data-user-avatar]');
        avatarEls.forEach(el => {
            if (user.avatarUrl) {
                el.src = user.avatarUrl;
                el.style.display = '';
            }
        });
    }

    async function loadData() {
        const today = new Date().toISOString().split('T')[0];
        setText(scheduleDate, formatDateLabel(today));

        const requests = await Promise.allSettled([
            ApiClient.teachers.getMe(),
            ApiClient.teachers.getDashboard(),
            ApiClient.teachers.getTimetable(today),
            ApiClient.teachers.getAssignments({ limit: 5 }),
            ApiClient.teachers.getClasses(),
            ApiClient.notifications.getAll(),
            ApiClient.messages.getThreads()
        ]);

        const [profileRes, dashboardRes, timetableRes, assignmentsRes, classesRes, notificationsRes, messagesRes] = requests;

        if (profileRes.status === 'fulfilled') {
            updateUserProfile(profileRes.value);
        }

        if (dashboardRes.status === 'fulfilled') {
            const summary = dashboardRes.value || {};
            setText(statStudents, summary.totalStudents);
            setText(statStudentsNote, summary.studentNote || '');
            setText(statClasses, summary.classesToday);
            setText(statClassesNote, summary.classNote || '');
            setText(statPending, summary.pendingSubmissions);
            setText(statPendingNote, summary.pendingNote || '');
            setText(statToGrade, summary.toGrade);
            setText(statToGradeNote, summary.toGradeNote || '');
        }

        if (timetableRes.status === 'fulfilled') {
            const items = timetableRes.value?.items || timetableRes.value?.classes || timetableRes.value || [];
            renderSchedule(items);
        }

        if (assignmentsRes.status === 'fulfilled') {
            const items = assignmentsRes.value?.items || assignmentsRes.value?.assignments || assignmentsRes.value || [];
            renderAssignments(items);
            setBadge(assignmentBadge, items.length);
        }

        if (classesRes.status === 'fulfilled') {
            const items = classesRes.value?.items || classesRes.value?.classes || classesRes.value || [];
            renderPerformance(items);
            populateClassSelectors(items);
        }

        if (notificationsRes.status === 'fulfilled') {
            const items = notificationsRes.value?.items || notificationsRes.value?.notifications || notificationsRes.value || [];
            setBadge(notificationBadge, items.length);
        }

        if (messagesRes.status === 'fulfilled') {
            const items = messagesRes.value?.items || messagesRes.value?.threads || messagesRes.value || [];
            setBadge(messageBadge, items.length);
        }
    }

    function populateClassSelectors(items = []) {
        const classOptions = items.map(item => {
            const id = item.id || item.classId || '';
            const name = item.name || item.className || 'Class';
            return `<option value="${id}">${name}</option>`;
        }).join('');

        document.querySelectorAll('[data-assignment-class], [data-attendance-class]').forEach(select => {
            select.innerHTML = classOptions || '<option value="">No classes available</option>';
        });
    }

    async function submitAssignment(form, submitBtn) {
        const payload = {
            title: form.querySelector('[data-assignment-title]')?.value?.trim(),
            classId: form.querySelector('[data-assignment-class]')?.value,
            dueDate: form.querySelector('[data-assignment-due]')?.value,
            description: form.querySelector('[data-assignment-description]')?.value?.trim()
        };

        submitBtn.disabled = true;
        try {
            await ApiClient.teachers.createAssignment(payload);
            if (window.Toast) {
                Toast.success('Assignment created successfully.');
            }
            form.reset();
        } catch (error) {
            if (window.Toast) {
                Toast.error(handleApiError(error));
            }
        } finally {
            submitBtn.disabled = false;
        }
    }

    async function submitAttendance(form, submitBtn) {
        const payload = {
            date: form.querySelector('[data-attendance-date]')?.value,
            notes: form.querySelector('[data-attendance-notes]')?.value?.trim()
        };
        const classId = form.querySelector('[data-attendance-class]')?.value;

        submitBtn.disabled = true;
        try {
            await ApiClient.teachers.markAttendance(classId, payload);
            if (window.Toast) {
                Toast.success('Attendance saved.');
            }
            form.reset();
        } catch (error) {
            if (window.Toast) {
                Toast.error(handleApiError(error));
            }
        } finally {
            submitBtn.disabled = false;
        }
    }

    function registerModalHandlers() {
        document.addEventListener('click', (e) => {
            if (e.target.matches('[data-assignment-submit]')) {
                const form = e.target.closest('.modal')?.querySelector('[data-assignment-form]');
                if (form) {
                    submitAssignment(form, e.target);
                }
            }

            if (e.target.matches('[data-attendance-submit]')) {
                const form = e.target.closest('.modal')?.querySelector('[data-attendance-form]');
                if (form) {
                    submitAttendance(form, e.target);
                }
            }

            if (e.target.matches('[data-modal-cancel]')) {
                e.preventDefault();
                e.target.closest('.modal-backdrop')?.remove();
                document.body.style.overflow = '';
            }
        });
    }

    document.addEventListener('DOMContentLoaded', () => {
        Auth.requireRole([Auth.ROLES.TEACHER]);
        if (window.TenantTheme) {
            TenantTheme.loadTenantTheme();
        }
        registerModalHandlers();
        loadData().catch(error => {
            console.error('Teacher dashboard load failed:', error);
        });
    });
})();
