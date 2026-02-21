// Authentication Management
const Auth = {
    // Role definitions
    ROLES: {
        SYSTEM_OWNER: 'SystemOwner',
        SCHOOL_ADMIN: 'SchoolAdmin',
        MANAGER: 'Manager',
        TEACHER: 'Teacher',
        PARENT: 'Parent',
        STUDENT: 'Student'
    },
    
    // Role-based dashboard pages
    DASHBOARD_PAGES: {
        'SystemOwner': '/pages/dashboard-systemowner.html',
        'SchoolAdmin': '/pages/dashboard-schooladmin.html',
        'Manager': '/pages/dashboard-manager.html',
        'Teacher': '/pages/dashboard-teacher-new.html',
        'Parent': '/pages/dashboard-parent.html',
        'Student': '/pages/dashboard-student-new.html'
    },
    
    // Save token to localStorage
    saveToken(token) {
        localStorage.setItem('authToken', token);
    },
    
    // Get token from localStorage
    getToken() {
        return localStorage.getItem('authToken');
    },
    
    // Remove token from localStorage
    removeToken() {
        localStorage.removeItem('authToken');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userData');
    },
    
    // Save user data
    saveUserData(userData) {
        localStorage.setItem('userData', JSON.stringify(userData));
        if (userData.role) {
            localStorage.setItem('userRole', userData.role);
        }
    },
    
    // Get user data
    getUserData() {
        const data = localStorage.getItem('userData');
        return data ? JSON.parse(data) : null;
    },
    
    // Get user role
    getUserRole() {
        return localStorage.getItem('userRole');
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // Verify token with backend
    async verifyToken() {
        try {
            const response = await ApiClient.auth.verifyToken();
            return response.valid === true;
        } catch (error) {
            console.error('Token verification failed:', error);
            return false;
        }
    },
    
    // Login user
    async login(email, password, options = {}) {
        try {
            const payload = typeof email === 'object'
                ? email
                : {
                    email,
                    password,
                    ...options
                };

            const response = await ApiClient.auth.login(payload);
            
            if (response.token) {
                this.saveToken(response.token);
                
                if (response.user) {
                    this.saveUserData(response.user);
                }
                
                return {
                    success: true,
                    user: response.user
                };
            }
            
            return {
                success: false,
                error: 'Invalid login response'
            };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error)
            };
        }
    },
    
    // Register user
    async register(userData) {
        try {
            const response = await ApiClient.auth.register(userData);
            
            return {
                success: true,
                message: response.message || 'Registration successful'
            };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error)
            };
        }
    },
    
    // Logout user
    async logout() {
        try {
            await ApiClient.auth.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            this.removeToken();
            window.location.href = '/pages/login-new.html';
        }
    },
    
    // Check if user has specific role
    hasRole(role) {
        const userRole = this.getUserRole();
        return userRole === role;
    },
    
    // Check if user has any of the specified roles
    hasAnyRole(roles) {
        const userRole = this.getUserRole();
        return roles.includes(userRole);
    },
    
    // Redirect to appropriate dashboard
    redirectToDashboard() {
        const userRole = this.getUserRole();
        const dashboardPage = this.DASHBOARD_PAGES[userRole];
        
        if (dashboardPage) {
            window.location.href = dashboardPage;
        } else {
            console.error('Unknown role:', userRole);
            this.logout();
        }
    },
    
    // Protect page - redirect if not authenticated
    requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = '/pages/login-new.html';
            return false;
        }
        return true;
    },
    
    // Protect page - redirect if user doesn't have required role
    requireRole(allowedRoles) {
        if (!this.requireAuth()) {
            return false;
        }
        
        const userRole = this.getUserRole();
        
        if (!allowedRoles.includes(userRole)) {
            // Redirect to their own dashboard
            this.redirectToDashboard();
            return false;
        }
        
        return true;
    },
    
    // Validate invitation code
    async validateInvitation(code) {
        try {
            const response = await ApiClient.auth.validateInvitation(code);
            return {
                success: true,
                data: response
            };
        } catch (error) {
            return {
                success: false,
                error: handleApiError(error)
            };
        }
    }
};
