// School Admin Dashboard Controller
// Handles loading and displaying school admin-specific data

window.SchoolAdminDashboard = {
    async init() {
        // Verify authentication and role
        if (!Auth.isAuthenticated()) {
            window.location.href = '../pages/login-new.html';
            return;
        }
        
        const userRole = Auth.getUserRole();
        if (userRole !== APP_CONFIG.ROLES.SCHOOL_ADMIN) {
            Auth.redirectToDashboard();
            return;
        }
        
        // Setup UI
        this.setupEventListeners();
        this.updateUserProfile();
        
        // Load data with error handling
        try {
            await Promise.allSettled([
                this.loadStudents(),
                this.loadTeachers(),
                this.loadClasses(),
                this.loadSchedule()
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
        
        // Modal buttons
        const addStudentBtn = document.getElementById('addStudentBtn');
        if (addStudentBtn) {
            addStudentBtn.addEventListener('click', () => {
                document.getElementById('addStudentModal').classList.add('active');
            });
        }
        
        const studentForm = document.getElementById('studentForm');
        if (studentForm) {
            studentForm.addEventListener('submit', (e) => this.handleAddStudent(e));
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
    
    async loadStudents() {
        try {
            const response = await ApiClient.get('/admin/students');
            const students = response.data || [];
            
            document.getElementById('totalStudents').textContent = students.length;
            this.renderStudents(students);
            
        } catch (error) {
            console.error('Error loading students:', error);
            this.renderStudentsEmpty();
        }
    },
    
    renderStudents(students) {
        const container = document.getElementById('studentsContainer');
        
        if (students.length === 0) {
            this.renderStudentsEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Grade Level</th>
                        <th>Class</th>
                        <th>Enrollment Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${students.slice(0, 20).map(student => `
                        <tr>
                            <td>${student.firstName} ${student.lastName || ''}</td>
                            <td>${student.email || 'N/A'}</td>
                            <td>${student.gradeLevel || 'N/A'}</td>
                            <td>${student.className || 'N/A'}</td>
                            <td>${student.enrollmentDate ? new Date(student.enrollmentDate).toLocaleDateString() : 'N/A'}</td>
                            <td><span class="status-badge ${student.isActive ? 'active' : 'inactive'}">${student.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderStudentsEmpty() {
        const container = document.getElementById('studentsContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👨‍🎓</div>
                <p>No students found</p>
            </div>
        `;
    },
    
    async loadTeachers() {
        try {
            const response = await ApiClient.get('/admin/teachers');
            const teachers = response.data || [];
            
            document.getElementById('totalTeachers').textContent = teachers.length;
            this.renderTeachers(teachers);
            
        } catch (error) {
            console.error('Error loading teachers:', error);
            this.renderTeachersEmpty();
        }
    },
    
    renderTeachers(teachers) {
        const container = document.getElementById('teachersContainer');
        
        if (teachers.length === 0) {
            this.renderTeachersEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Qualification</th>
                        <th>Subjects</th>
                        <th>Joining Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${teachers.slice(0, 20).map(teacher => `
                        <tr>
                            <td>${teacher.firstName} ${teacher.lastName || ''}</td>
                            <td>${teacher.email || 'N/A'}</td>
                            <td>${teacher.qualification || 'N/A'}</td>
                            <td>${teacher.subjects || 'N/A'}</td>
                            <td>${teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : 'N/A'}</td>
                            <td><span class="status-badge ${teacher.isActive ? 'active' : 'inactive'}">${teacher.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderTeachersEmpty() {
        const container = document.getElementById('teachersContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👨‍🏫</div>
                <p>No teachers found</p>
            </div>
        `;
    },
    
    async loadClasses() {
        try {
            const response = await ApiClient.get('/admin/classes');
            const classes = response.data || [];
            
            document.getElementById('totalClasses').textContent = classes.length;
            this.renderClasses(classes);
            
        } catch (error) {
            console.error('Error loading classes:', error);
            this.renderClassesEmpty();
        }
    },
    
    renderClasses(classes) {
        const container = document.getElementById('classesContainer');
        
        if (classes.length === 0) {
            this.renderClassesEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Class Name</th>
                        <th>Teacher</th>
                        <th>Grade Level</th>
                        <th>Students</th>
                        <th>Room</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${classes.slice(0, 20).map(cls => `
                        <tr>
                            <td>${cls.name || 'N/A'}</td>
                            <td>${cls.teacherName || 'N/A'}</td>
                            <td>${cls.gradeLevel || 'N/A'}</td>
                            <td>${cls.studentCount || 0}</td>
                            <td>${cls.room || 'N/A'}</td>
                            <td><span class="status-badge ${cls.isActive ? 'active' : 'inactive'}">${cls.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderClassesEmpty() {
        const container = document.getElementById('classesContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏫</div>
                <p>No classes found</p>
            </div>
        `;
    },
    
    async loadSchedule() {
        try {
            const response = await ApiClient.get('/admin/schedule');
            const schedule = response.data || [];
            
            this.renderSchedule(schedule);
            
        } catch (error) {
            console.error('Error loading schedule:', error);
            this.renderScheduleEmpty();
        }
    },
    
    renderSchedule(schedule) {
        const container = document.getElementById('scheduleContainer');
        
        if (schedule.length === 0) {
            this.renderScheduleEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Class</th>
                        <th>Day</th>
                        <th>Time</th>
                        <th>Subject</th>
                        <th>Teacher</th>
                        <th>Room</th>
                    </tr>
                </thead>
                <tbody>
                    ${schedule.slice(0, 20).map(slot => `
                        <tr>
                            <td>${slot.className || 'N/A'}</td>
                            <td>${slot.day || 'N/A'}</td>
                            <td>${slot.startTime || 'N/A'} - ${slot.endTime || 'N/A'}</td>
                            <td>${slot.subject || 'N/A'}</td>
                            <td>${slot.teacherName || 'N/A'}</td>
                            <td>${slot.room || 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderScheduleEmpty() {
        const container = document.getElementById('scheduleContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📚</div>
                <p>No schedule available</p>
            </div>
        `;
    },
    
    async handleAddStudent(e) {
        e.preventDefault();
        
        const form = e.target;
        const inputs = form.querySelectorAll('input');
        const studentData = {};
        
        inputs.forEach(input => {
            const label = input.previousElementSibling?.textContent || '';
            if (label.includes('First')) studentData.firstName = input.value;
            else if (label.includes('Last')) studentData.lastName = input.value;
            else if (label.includes('Email')) studentData.email = input.value;
            else if (label.includes('Grade')) studentData.gradeLevel = input.value;
        });
        
        try {
            await ApiClient.post('/admin/students', studentData);
            document.getElementById('addStudentModal').classList.remove('active');
            form.reset();
            await this.loadStudents();
        } catch (error) {
            console.error('Error adding student:', error);
            alert('Failed to add student');
        }
    },
    
    showError(message) {
        console.error('Dashboard Error:', message);
    }
};

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    SchoolAdminDashboard.init();
});
