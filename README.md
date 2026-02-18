# SchoolSystem.Frontend

A multi-tenant school management system frontend built with HTML, CSS, and JavaScript.

## Overview

This is a comprehensive frontend application for managing schools, students, teachers, and administrative tasks. It features role-based access control and supports multiple user types with distinct dashboards and capabilities.

## Features

### Multi-Tenant Architecture
- Support for multiple schools in a single system
- Isolated data and access per tenant
- Centralized system management

### User Roles & Dashboards

1. **System Owner**
   - Manage all schools across the system
   - View system-wide statistics
   - Manage users and system settings
   - Dashboard: `/pages/dashboard-systemowner.html`

2. **School Admin**
   - Manage school-specific data
   - Oversee students and teachers
   - Manage classes and schedules
   - Dashboard: `/pages/dashboard-schooladmin.html`

3. **Manager**
   - Manage departments and staff
   - Track tasks and operations
   - View department budgets
   - Dashboard: `/pages/dashboard-manager.html`

4. **Teacher**
   - Manage classes and students
   - Grade assignments
   - Track student progress
   - Dashboard: `/pages/dashboard-teacher.html`

5. **Parent**
   - View children's progress
   - Monitor grades and attendance
   - Communicate with teachers
   - Dashboard: `/pages/dashboard-parent.html`

6. **Student**
   - View class schedule
   - Track assignments
   - Check grades and attendance
   - Dashboard: `/pages/dashboard-student.html`

### Authentication & Security

- **Login System**: Secure authentication for all users
- **Invitation-Based Registration**: New users can only register with a valid invitation code
- **Role-Based Access Control**: Each role can only access their designated dashboard
- **Token-Based Authentication**: JWT tokens for secure API communication
- **Auto-Redirect**: Unauthorized access attempts redirect to appropriate pages

## Project Structure

```
SchoolSystem.Frontend/
├── index.html                 # Login page (entry point)
├── pages/                     # Dashboard pages
│   ├── register.html          # Invitation-based registration
│   ├── dashboard-systemowner.html
│   ├── dashboard-schooladmin.html
│   ├── dashboard-manager.html
│   ├── dashboard-teacher.html
│   ├── dashboard-parent.html
│   └── dashboard-student.html
├── css/                       # Stylesheets
│   ├── main.css              # Core styles and components
│   └── login.css             # Login/register specific styles
├── js/                        # JavaScript files
│   ├── config.js             # Application configuration
│   ├── utils.js              # Utility functions
│   ├── api.js                # API client
│   ├── auth.js               # Authentication logic
│   ├── dashboard.js          # Shared dashboard functionality
│   ├── login.js              # Login page script
│   └── register.js           # Registration page script
└── assets/                    # Static assets
    └── images/               # Images and icons
```

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- A backend API server (see SchoolSystem.Backend repository)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/AbayleE/SchoolSystem.Frontend.git
cd SchoolSystem.Frontend
```

2. Configure the API endpoint:
   - Open `js/config.js`
   - Update `API_BASE_URL` to point to your backend server:
   ```javascript
   API_BASE_URL: 'http://your-backend-url:port/api'
   ```

3. Serve the application:
   - Using Python:
     ```bash
     python -m http.server 8000
     ```
   - Using Node.js:
     ```bash
     npx http-server -p 8000
     ```
   - Or use any web server (Apache, Nginx, etc.)

4. Access the application:
   - Open your browser and navigate to `http://localhost:8000`

## Usage

### Logging In

1. Navigate to the login page (index.html)
2. Enter your email and password
3. Click "Login"
4. You'll be redirected to your role-specific dashboard

### Registering

1. Obtain an invitation code from your school administrator
2. Click "Register here" on the login page
3. Enter your invitation code and complete the registration form
4. After successful registration, you'll be redirected to login

### Navigating Dashboards

Each role has a unique dashboard with:
- Navigation bar with role-specific links
- Statistics cards showing key metrics
- Data tables for managing relevant information
- Logout button for secure session termination

### Role-Based Access

- Users can only access their designated dashboard
- Attempting to access another role's dashboard will redirect to your own
- All pages require authentication
- Unauthenticated users are redirected to login

## API Integration

The frontend communicates with the backend through the API client (`js/api.js`). Key endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration with invitation
- `POST /api/auth/logout` - User logout
- `GET /api/auth/verify` - Verify token validity
- `POST /api/auth/validate-invitation` - Validate invitation code

### Users
- `GET /api/users/profile` - Get current user profile
- `GET /api/users` - List all users (admin only)
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Schools
- `GET /api/schools` - List all schools
- `GET /api/schools/:id` - Get school details
- `POST /api/schools` - Create school
- `PUT /api/schools/:id` - Update school
- `DELETE /api/schools/:id` - Delete school

### Students, Teachers, Classes
- Similar CRUD operations available for each entity
- See `js/api.js` for complete endpoint list

## Customization

### Styling

Modify `css/main.css` to customize:
- Color scheme (CSS variables in `:root`)
- Typography
- Layout and spacing
- Component styles

### Adding New Features

1. Create new HTML page in `/pages/`
2. Add corresponding JavaScript file in `/js/`
3. Update navigation and routing in `auth.js`
4. Add API endpoints in `api.js` if needed

## Security Considerations

- Always use HTTPS in production
- Store tokens securely
- Implement CORS properly on backend
- Validate all user inputs
- Sanitize HTML to prevent XSS attacks
- Implement rate limiting on backend
- Use secure password requirements
- Regularly update dependencies

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please open an issue on GitHub.

## Related Repositories

- [SchoolSystem.Backend](https://github.com/AbayleE/SchoolSystem.Backend) - Backend API
- [SchoolSystem.Domain](https://github.com/AbayleE/SchoolSystem.Domain) - Domain models