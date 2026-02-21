// Student Dashboard Integration
(function () {
    const scheduleBody = document.getElementById('studentScheduleBody');
    const assignmentsContainer = document.getElementById('studentAssignments');
    const eventsContainer = document.getElementById('studentEvents');
    const gradesContainer = document.getElementById('studentGrades');

    const studentName = document.getElementById('studentName');
    const studentGreetingName = document.getElementById('studentGreetingName');
    const studentGreetingSubtitle = document.getElementById('studentGreetingSubtitle');

    const statGpa = document.getElementById('statGpa');
    const statGpaChange = document.getElementById('statGpaChange');
    const statAttendance = document.getElementById('statAttendance');
    const statAttendanceChange = document.getElementById('statAttendanceChange');
    const statAssignments = document.getElementById('statAssignments');
    const statAssignmentsChange = document.getElementById('statAssignmentsChange');
    const statNextClass = document.getElementById('statNextClass');
    const statNextClassTime = document.getElementById('statNextClassTime');
    const scheduleDate = document.getElementById('scheduleDate');

    const assignmentBadge = document.getElementById('assignmentBadge');
    const messageBadge = document.getElementById('messageBadge');
    const notificationBadge = document.getElementById('notificationBadge');
    const topbarNotificationBadge = document.getElementById('topbarNotificationBadge');

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
            scheduleBody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: var(--spacing-6); color: var(--color-text-tertiary);">No schedule available.</td></tr>';
            return;
        }

        scheduleBody.innerHTML = items.map(item => {
            const status = item.status || 'Upcoming';
            const badgeClass = status.toLowerCase().includes('complete') ? 'badge-success'
                : status.toLowerCase().includes('progress') ? 'badge-primary'
                : 'badge-gray';

            return `
                <tr>
                    <td><span class="font-medium">${item.time || ''}</span></td>
                    <td><strong>${item.subject || ''}</strong></td>
                    <td>${item.teacher || ''}</td>
                    <td>${item.room || ''}</td>
                    <td><span class="badge ${badgeClass}">${status}</span></td>
                </tr>
            `;
        }).join('');
    }

    function renderAssignments(items = []) {
        if (!assignmentsContainer) return;
        if (!items.length) {
            assignmentsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-title">No assignments</div><div class="empty-state-description">You have no pending assignments.</div></div>';
            return;
        }

        assignmentsContainer.innerHTML = items.map(item => {
            const dueDate = item.dueDate ? formatDate(item.dueDate) : '—';
            const status = item.status || 'Pending';
            const badgeClass = status.toLowerCase().includes('urgent') ? 'badge-error'
                : status.toLowerCase().includes('pending') ? 'badge-warning'
                : 'badge-gray';
            const timeLeft = item.timeLeft || '';

            return `
                <div style="display: flex; gap: var(--spacing-4); padding: var(--spacing-4); background: var(--color-bg-secondary); border-radius: var(--radius-md);">
                    <div style="flex: 1;">
                        <div style="font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-1);">${item.title || 'Untitled Assignment'}</div>
                        <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${item.subject || ''} • Due: ${dueDate}</div>
                    </div>
                    <div style="text-align: right;">
                        <span class="badge ${badgeClass}">${status}</span>
                        <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary); margin-top: var(--spacing-1);">${timeLeft}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderEvents(items = []) {
        if (!eventsContainer) return;
        if (!items.length) {
            eventsContainer.innerHTML = '<div class="empty-state"><div class="empty-state-title">No upcoming events</div><div class="empty-state-description">Your calendar is clear.</div></div>';
            return;
        }

        eventsContainer.innerHTML = items.map(item => {
            const date = item.date ? new Date(item.date) : null;
            const day = date ? String(date.getDate()).padStart(2, '0') : '--';
            const month = date ? date.toLocaleString('en-US', { month: 'short' }).toUpperCase() : '---';
            const color = item.color || 'var(--color-primary)';
            return `
                <div style="display: flex; gap: var(--spacing-3);">
                    <div style="flex-shrink: 0; width: 56px; height: 56px; background: ${color}; color: white; border-radius: var(--radius-md); display: flex; flex-direction: column; align-items: center; justify-content: center;">
                        <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${day}</div>
                        <div style="font-size: var(--font-size-xs);">${month}</div>
                    </div>
                    <div>
                        <div style="font-weight: var(--font-weight-semibold); margin-bottom: var(--spacing-1);">${item.title || ''}</div>
                        <div style="font-size: var(--font-size-sm); color: var(--color-text-secondary);">${item.location || ''}</div>
                    </div>
                </div>
            `;
        }).join('');
    }

    function renderGrades(items = []) {
        if (!gradesContainer) return;
        if (!items.length) {
            gradesContainer.innerHTML = '<div class="empty-state"><div class="empty-state-title">No grades yet</div><div class="empty-state-description">Grades will appear once published.</div></div>';
            return;
        }

        gradesContainer.innerHTML = items.map(item => {
            const score = item.score ?? '—';
            const percent = item.percent ?? item.score ?? 0;
            const barClass = percent >= 85 ? 'success' : percent >= 70 ? 'warning' : 'error';
            return `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div style="font-weight: var(--font-weight-medium);">${item.subject || ''}</div>
                        <div style="font-size: var(--font-size-xs); color: var(--color-text-tertiary);">${item.title || ''}</div>
                    </div>
                    <div style="font-size: var(--font-size-xl); font-weight: var(--font-weight-bold);">${score}</div>
                </div>
                <div class="progress"><div class="progress-bar ${barClass}" style="width: ${Math.min(percent, 100)}%;"></div></div>
            `;
        }).join('');
    }

    function updateUserProfile(user) {
        if (!user) return;
        const displayName = user.fullName || user.name || user.firstName || 'Student';
        setText(studentName, displayName, 'Student');
        setText(studentGreetingName, displayName, 'Student');
        if (studentGreetingSubtitle && user.className) {
            studentGreetingSubtitle.textContent = `Class: ${user.className}`;
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
            ApiClient.students.getMe(),
            ApiClient.students.getDashboard(),
            ApiClient.students.getTimetable(today),
            ApiClient.students.getAssignments({ status: 'pending', limit: 5 }),
            ApiClient.students.getGrades({ limit: 5 }),
            ApiClient.students.getAttendance(),
            ApiClient.students.getNotifications(),
            ApiClient.students.getMessages(),
            ApiClient.calendar.getEvents({ scope: 'student', from: today })
        ]);

        const [profileRes, dashboardRes, timetableRes, assignmentsRes, gradesRes, attendanceRes, notificationsRes, messagesRes, eventsRes] = requests;

        if (profileRes.status === 'fulfilled') {
            updateUserProfile(profileRes.value);
        }

        if (dashboardRes.status === 'fulfilled') {
            const summary = dashboardRes.value || {};
            setText(statGpa, summary.gpa);
            setText(statGpaChange, summary.gpaChange || '');
            setText(statAttendance, summary.attendanceRate ? `${summary.attendanceRate}%` : '—');
            setText(statAttendanceChange, summary.attendanceChange || '');
            setText(statAssignments, summary.pendingAssignments);
            setText(statAssignmentsChange, summary.assignmentNote || '');
            setText(statNextClass, summary.nextClass?.subject || summary.nextClassName || '—');
            setText(statNextClassTime, summary.nextClass?.time || summary.nextClassTime || '');
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

        if (gradesRes.status === 'fulfilled') {
            const items = gradesRes.value?.items || gradesRes.value?.grades || gradesRes.value || [];
            renderGrades(items);
        }

        if (attendanceRes.status === 'fulfilled') {
            // Optional: add attendance details when backend provides
        }

        if (notificationsRes.status === 'fulfilled') {
            const items = notificationsRes.value?.items || notificationsRes.value?.notifications || notificationsRes.value || [];
            setBadge(notificationBadge, items.length);
            setBadge(topbarNotificationBadge, items.length);
        }

        if (messagesRes.status === 'fulfilled') {
            const items = messagesRes.value?.items || messagesRes.value?.threads || messagesRes.value || [];
            setBadge(messageBadge, items.length);
        }

        if (eventsRes.status === 'fulfilled') {
            const items = eventsRes.value?.items || eventsRes.value?.events || eventsRes.value || [];
            renderEvents(items);
        }
    }

    document.addEventListener('DOMContentLoaded', () => {
        Auth.requireRole([Auth.ROLES.STUDENT]);
        if (window.TenantTheme) {
            TenantTheme.loadTenantTheme();
        }
        loadData().catch(error => {
            console.error('Student dashboard load failed:', error);
        });
    });
})();
