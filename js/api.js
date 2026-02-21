// API Client for backend communication
// Note: Update API_BASE_URL to match your backend URL
const API_BASE_URL = (window.APP_CONFIG && window.APP_CONFIG.API_BASE_URL) ? window.APP_CONFIG.API_BASE_URL : 'http://localhost:5275/api';

window.ApiClient  = {
    // Make HTTP request
    async request(endpoint, options = {}) {
        const url = `${API_BASE_URL}${endpoint}`;
        const token = Auth.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const config = {
            ...options,
            headers,
            mode: 'cors',
            credentials: 'omit'
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw data;
            }
            
            return data;
        } catch (error) {
            console.error('API Request Error:', error);
            throw error;
        }
    },
    
    // GET request
    async get(endpoint) {
        return this.request(endpoint, {
            method: 'GET'
        });
    },
    
    // POST request
    async post(endpoint, data) {
        return this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },
    
    // PUT request
    async put(endpoint, data) {
        return this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },
    
    // DELETE request
    async delete(endpoint) {
        return this.request(endpoint, {
            method: 'DELETE'
        });
    },
    
    // Authentication endpoints
    auth: {
        login(credentials) {
            return ApiClient.post('/auth/login', credentials);
        },
        
        register(userData) {
            return ApiClient.post('/auth/register', userData);
        },
        
        logout() {
            return ApiClient.post('/auth/logout', {});
        },
        
        verifyToken() {
            return ApiClient.get('/auth/verify');
        },
        
        validateInvitation(code) {
            return ApiClient.post('/auth/validate-invitation', { code });
        },

        requestPasswordReset(email) {
            return ApiClient.post('/auth/forgot-password', { email });
        },

        resetPassword(payload) {
            return ApiClient.post('/auth/reset-password', payload);
        }
        }
    },
    
    // User endpoints
    users: {
        getProfile() {
            return ApiClient.get('/users/profile');
        },
        
        updateProfile(data) {
            return ApiClient.put('/users/profile', data);
        },
        
        getAll() {
            return ApiClient.get('/users');
        },
        
        getById(id) {
            return ApiClient.get(`/users/${id}`);
        },
        
        create(userData) {
            return ApiClient.post('/users', userData);
        },
        
        update(id, userData) {
            return ApiClient.put(`/users/${id}`, userData);
        },
        
        delete(id) {
            return ApiClient.delete(`/users/${id}`);
        }
    },
    
    // School endpoints
    schools: {
        getAll() {
            return ApiClient.get('/schools');
        },
        
        getById(id) {
            return ApiClient.get(`/schools/${id}`);
        },
        
        create(schoolData) {
            return ApiClient.post('/schools', schoolData);
        },
        
        update(id, schoolData) {
            return ApiClient.put(`/schools/${id}`, schoolData);
        },
        
        delete(id) {
            return ApiClient.delete(`/schools/${id}`);
        },

        search(query) {
            return ApiClient.get(`/schools/search?query=${encodeURIComponent(query)}`);
        },

        getTheme(id) {
            return ApiClient.get(`/schools/${id}/theme`);
        }
    },
    
    // Students endpoints
    students: {
        getAll() {
            return ApiClient.get('/students');
        },
        
        getById(id) {
            return ApiClient.get(`/students/${id}`);
        },
        
        create(studentData) {
            return ApiClient.post('/students', studentData);
        },
        
        update(id, studentData) {
            return ApiClient.put(`/students/${id}`, studentData);
        },
        
        delete(id) {
            return ApiClient.delete(`/students/${id}`);
        },

        getMe() {
            return ApiClient.get('/students/me');
        },

        getDashboard() {
            return ApiClient.get('/students/me/dashboard');
        },

        getTimetable(date) {
            const query = date ? `?date=${encodeURIComponent(date)}` : '';
            return ApiClient.get(`/students/me/timetable${query}`);
        },

        getAssignments(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/students/me/assignments${query ? `?${query}` : ''}`);
        },

        getGrades(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/students/me/grades${query ? `?${query}` : ''}`);
        },

        getAttendance(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/students/me/attendance${query ? `?${query}` : ''}`);
        },

        getNotifications() {
            return ApiClient.get('/students/me/notifications');
        },

        getMessages() {
            return ApiClient.get('/students/me/messages');
        },

        getFees() {
            return ApiClient.get('/students/me/fees');
        }
    },
    
    // Teachers endpoints
    teachers: {
        getAll() {
            return ApiClient.get('/teachers');
        },
        
        getById(id) {
            return ApiClient.get(`/teachers/${id}`);
        },
        
        create(teacherData) {
            return ApiClient.post('/teachers', teacherData);
        },
        
        update(id, teacherData) {
            return ApiClient.put(`/teachers/${id}`, teacherData);
        },
        
        delete(id) {
            return ApiClient.delete(`/teachers/${id}`);
        },

        getMe() {
            return ApiClient.get('/teachers/me');
        },

        getDashboard() {
            return ApiClient.get('/teachers/me/dashboard');
        },

        getTimetable(date) {
            const query = date ? `?date=${encodeURIComponent(date)}` : '';
            return ApiClient.get(`/teachers/me/timetable${query}`);
        },

        getClasses() {
            return ApiClient.get('/teachers/me/classes');
        },

        getAssignments(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/teachers/me/assignments${query ? `?${query}` : ''}`);
        },

        createAssignment(payload) {
            return ApiClient.post('/teachers/me/assignments', payload);
        },

        getAttendance(classId, date) {
            const query = new URLSearchParams({ date }).toString();
            return ApiClient.get(`/teachers/me/classes/${classId}/attendance${query ? `?${query}` : ''}`);
        },

        markAttendance(classId, payload) {
            return ApiClient.post(`/teachers/me/classes/${classId}/attendance`, payload);
        },

        getGrades(classId) {
            return ApiClient.get(`/teachers/me/classes/${classId}/grades`);
        },

        submitGrades(classId, payload) {
            return ApiClient.post(`/teachers/me/classes/${classId}/grades`, payload);
        }
    },
    
    // Classes endpoints
    classes: {
        getAll() {
            return ApiClient.get('/classes');
        },
        
        getById(id) {
            return ApiClient.get(`/classes/${id}`);
        },
        
        create(classData) {
            return ApiClient.post('/classes', classData);
        },
        
        update(id, classData) {
            return ApiClient.put(`/classes/${id}`, classData);
        },
        
        delete(id) {
            return ApiClient.delete(`/classes/${id}`);
        },

        getStudents(id) {
            return ApiClient.get(`/classes/${id}/students`);
        },

        getTimetable(id) {
            return ApiClient.get(`/classes/${id}/timetable`);
        }
    },

    // Assignments endpoints
    assignments: {
        getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/assignments${query ? `?${query}` : ''}`);
        },

        getById(id) {
            return ApiClient.get(`/assignments/${id}`);
        },

        create(data) {
            return ApiClient.post('/assignments', data);
        },

        update(id, data) {
            return ApiClient.put(`/assignments/${id}`, data);
        },

        submit(id, data) {
            return ApiClient.post(`/assignments/${id}/submit`, data);
        }
    },

    // Grades endpoints
    grades: {
        getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/grades${query ? `?${query}` : ''}`);
        },

        submit(data) {
            return ApiClient.post('/grades', data);
        }
    },

    // Attendance endpoints
    attendance: {
        getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/attendance${query ? `?${query}` : ''}`);
        },

        mark(data) {
            return ApiClient.post('/attendance', data);
        }
    },

    // Notifications endpoints
    notifications: {
        getAll() {
            return ApiClient.get('/notifications');
        },

        markRead(id) {
            return ApiClient.put(`/notifications/${id}/read`, {});
        }
    },

    // Messaging endpoints
    messages: {
        getThreads() {
            return ApiClient.get('/messages/threads');
        },

        getThread(id) {
            return ApiClient.get(`/messages/threads/${id}`);
        },

        send(data) {
            return ApiClient.post('/messages', data);
        }
    },

    // Announcements endpoints
    announcements: {
        getAll() {
            return ApiClient.get('/announcements');
        },

        create(data) {
            return ApiClient.post('/announcements', data);
        }
    },

    // Calendar / Events endpoints
    calendar: {
        getEvents(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/calendar/events${query ? `?${query}` : ''}`);
        },

        createEvent(data) {
            return ApiClient.post('/calendar/events', data);
        }
    },

    // Fees & Billing endpoints
    fees: {
        getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/fees${query ? `?${query}` : ''}`);
        },

        pay(data) {
            return ApiClient.post('/fees/payments', data);
        }
    },

    // Reports endpoints
    reports: {
        getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/reports${query ? `?${query}` : ''}`);
        },

        export(data) {
            return ApiClient.post('/reports/export', data);
        }
    },

    // Analytics endpoints
    analytics: {
        getUsage(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/analytics/usage${query ? `?${query}` : ''}`);
        }
    },

    // Subscription & Billing endpoints (Manager)
    billing: {
        getSubscription() {
            return ApiClient.get('/billing/subscription');
        },

        getInvoices() {
            return ApiClient.get('/billing/invoices');
        }
    },

    // Audit Logs
    auditLogs: {
        getAll(params = {}) {
            const query = new URLSearchParams(params).toString();
            return ApiClient.get(`/audit-logs${query ? `?${query}` : ''}`);
        }
    },

    // Settings
    settings: {
        getAll() {
            return ApiClient.get('/settings');
        },

        update(data) {
            return ApiClient.put('/settings', data);
        }
        }
    }
};
