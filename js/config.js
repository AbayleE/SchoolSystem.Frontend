// Configuration file
const CONFIG = {
    // API Configuration
    API_BASE_URL: 'http://localhost:5000/api', // Update this to your backend URL
    
    // Application Settings
    APP_NAME: 'School System',
    APP_VERSION: '1.0.0',
    
    // Token Settings
    TOKEN_STORAGE_KEY: 'authToken',
    USER_DATA_KEY: 'userData',
    USER_ROLE_KEY: 'userRole',
    
    // Session Settings
    SESSION_TIMEOUT: 3600000, // 1 hour in milliseconds
    
    // Pagination
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
    
    // File Upload
    MAX_FILE_SIZE: 5242880, // 5MB in bytes
    ALLOWED_FILE_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
    
    // Validation
    MIN_PASSWORD_LENGTH: 8,
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    
    // UI Settings
    TOAST_DURATION: 5000, // 5 seconds
    DEBOUNCE_DELAY: 300, // 300ms
    
    // Role Definitions
    ROLES: {
        SYSTEM_OWNER: 'SystemOwner',
        SCHOOL_ADMIN: 'SchoolAdmin',
        MANAGER: 'Manager',
        TEACHER: 'Teacher',
        PARENT: 'Parent',
        STUDENT: 'Student'
    }
};

// Make config available globally
window.APP_CONFIG = CONFIG;
