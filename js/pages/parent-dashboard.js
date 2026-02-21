// Parent Dashboard Controller
// Handles loading and displaying parent-specific data

window.ParentDashboard = {
    async init() {
        // Verify authentication and role
        if (!Auth.isAuthenticated()) {
            window.location.href = '../pages/login-new.html';
            return;
        }
        
        const userRole = Auth.getUserRole();
        if (userRole !== APP_CONFIG.ROLES.PARENT) {
            Auth.redirectToDashboard();
            return;
        }
        
        // Setup UI
        this.setupEventListeners();
        this.updateUserProfile();
        
        // Load data with error handling
        try {
            await Promise.allSettled([
                this.loadChildren(),
                this.loadGrades(),
                this.loadAttendance(),
                this.loadMessages()
            ]);
        } catch (error) {
            console.error('Error loading dashboard data:', error);
            this.showError('Failed to load some dashboard data');
        }
    },
    
    setupEventListeners() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async (e) => {
                e.preventDefault();
                await Auth.logout();
                window.location.href = '../pages/login-new.html';
            });
        }
    },
    
    updateUserProfile() {
        const user = Auth.getUser();
        if (user) {
            const nameEl = document.getElementById('userName');
            if (nameEl) {
                nameEl.textContent = user.firstName ? `${user.firstName} ${user.lastName || ''}` : user.email;
            }
        }
    },
    
    async loadChildren() {
        try {
            // Get children for this parent
            const response = await ApiClient.get('/parents/children');
            const children = response.data || [];
            
            document.getElementById('totalChildren').textContent = children.length;
            this.renderChildren(children);
            
        } catch (error) {
            console.error('Error loading children:', error);
            this.renderChildrenEmpty();
        }
    },
    
    renderChildren(children) {
        const container = document.getElementById('childrenContainer');
        
        if (children.length === 0) {
            this.renderChildrenEmpty();
            return;
        }
        
        container.innerHTML = children.map(child => `
            <div class="child-card">
                <h3>${child.firstName} ${child.lastName}</h3>
                <div class="child-info">
                    <div><span class="info-label">Grade Level:</span> ${child.gradeLevel || 'N/A'}</div>
                    <div><span class="info-label">Class:</span> ${child.className || 'N/A'}</div>
                    <div><span class="info-label">Teacher:</span> ${child.teacherName || 'N/A'}</div>
                    <div><span class="info-label">Enrollment Date:</span> ${child.enrollmentDate ? new Date(child.enrollmentDate).toLocaleDateString() : 'N/A'}</div>
                </div>
            </div>
        `).join('');
    },
    
    renderChildrenEmpty() {
        const container = document.getElementById('childrenContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👨‍🎓</div>
                <p>No children registered yet</p>
            </div>
        `;
    },
    
    async loadGrades() {
        try {
            const response = await ApiClient.get('/parents/grades');
            const grades = response.data || [];
            
            // Calculate average grade
            if (grades.length > 0) {
                const avgGrade = Math.round(
                    grades.reduce((sum, g) => sum + (g.score || 0), 0) / grades.length
                );
                document.getElementById('avgGrade').textContent = avgGrade + '%';
            }
            
            this.renderGrades(grades);
            
        } catch (error) {
            console.error('Error loading grades:', error);
            this.renderGradesEmpty();
        }
    },
    
    renderGrades(grades) {
        const container = document.getElementById('gradesContainer');
        
        if (grades.length === 0) {
            this.renderGradesEmpty();
            return;
        }
        
        container.innerHTML = grades.slice(0, 10).map(grade => {
            let gradeColor = '#4CAF50'; // Green for A
            if (grade.score < 70) gradeColor = '#f44336'; // Red for F
            else if (grade.score < 80) gradeColor = '#ff9800'; // Orange for C
            else if (grade.score < 90) gradeColor = '#2196F3'; // Blue for B
            
            return `
                <div class="grade-item">
                    <div class="grade-info">
                        <div class="subject">${grade.studentName} - ${grade.subject}</div>
                        <div class="assignment-name">${grade.assignmentName || 'Assessment'} - ${grade.gradeDate ? new Date(grade.gradeDate).toLocaleDateString() : 'N/A'}</div>
                    </div>
                    <div class="grade-badge" style="background: ${gradeColor};">${grade.score || 0}%</div>
                </div>
            `;
        }).join('');
    },
    
    renderGradesEmpty() {
        const container = document.getElementById('gradesContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>No grades available yet</p>
            </div>
        `;
    },
    
    async loadAttendance() {
        try {
            const response = await ApiClient.get('/parents/attendance');
            const attendance = response.data || [];
            
            // Calculate average attendance
            if (attendance.length > 0) {
                const presentDays = attendance.filter(a => a.status === 'Present').length;
                const avgAttendance = Math.round((presentDays / attendance.length) * 100);
                document.getElementById('avgAttendance').textContent = avgAttendance + '%';
            }
            
            this.renderAttendance(attendance);
            
        } catch (error) {
            console.error('Error loading attendance:', error);
            this.renderAttendanceEmpty();
        }
    },
    
    renderAttendance(attendance) {
        const container = document.getElementById('attendanceContainer');
        
        if (attendance.length === 0) {
            this.renderAttendanceEmpty();
            return;
        }
        
        container.innerHTML = attendance.slice(0, 10).map(record => {
            let badgeClass = 'present';
            let statusText = record.status;
            
            if (record.status === 'Absent') {
                badgeClass = 'absent';
            } else if (record.status === 'Late') {
                badgeClass = 'late';
            }
            
            return `
                <div class="attendance-item">
                    <div>
                        <strong>${record.studentName}</strong> - ${record.date ? new Date(record.date).toLocaleDateString() : 'N/A'}
                    </div>
                    <span class="attendance-badge ${badgeClass}">${statusText}</span>
                </div>
            `;
        }).join('');
    },
    
    renderAttendanceEmpty() {
        const container = document.getElementById('attendanceContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✅</div>
                <p>No attendance records yet</p>
            </div>
        `;
    },
    
    async loadMessages() {
        try {
            const response = await ApiClient.get('/parents/messages');
            const messages = response.data || [];
            
            const unread = messages.filter(m => !m.isRead).length;
            document.getElementById('unreadMessages').textContent = unread;
            
            this.renderMessages(messages);
            
        } catch (error) {
            console.error('Error loading messages:', error);
            this.renderMessagesEmpty();
        }
    },
    
    renderMessages(messages) {
        const container = document.getElementById('messagesContainer');
        
        if (messages.length === 0) {
            this.renderMessagesEmpty();
            return;
        }
        
        container.innerHTML = messages.slice(0, 5).map(msg => `
            <div class="message-item" style="background: ${!msg.isRead ? '#e3f2fd' : '#f9f9f9'};">
                <div>
                    <div style="font-weight: bold; color: #333;">${msg.subject}</div>
                    <div style="font-size: 12px; color: #999;">From: ${msg.senderName} - ${msg.sentDate ? new Date(msg.sentDate).toLocaleDateString() : 'N/A'}</div>
                </div>
            </div>
        `).join('');
    },
    
    renderMessagesEmpty() {
        const container = document.getElementById('messagesContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">✉️</div>
                <p>No messages</p>
            </div>
        `;
    },
    
    showError(message) {
        console.error('Dashboard Error:', message);
    }
};

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    ParentDashboard.init();
});
