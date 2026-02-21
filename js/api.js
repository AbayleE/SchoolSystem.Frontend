// API Client for backend communication
// Note: Update API_BASE_URL to match your backend URL
const API_BASE_URL = config.API_BASE_URL; // Change this to your backend URL

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
        }
    }
};
