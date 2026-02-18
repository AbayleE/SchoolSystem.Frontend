// Shared Dashboard Functionality
const Dashboard = {
    // Initialize dashboard
    init(requiredRole) {
        // Protect page - require authentication and specific role
        if (!Auth.requireRole([requiredRole])) {
            return;
        }
        
        // Load user info
        this.loadUserInfo();
        
        // Setup logout button
        this.setupLogout();
    },
    
    // Load and display user information
    loadUserInfo() {
        const userData = Auth.getUserData();
        
        if (userData) {
            // Update user name in navbar
            const userNameElement = document.getElementById('userName');
            if (userNameElement) {
                userNameElement.textContent = `${userData.firstName || ''} ${userData.lastName || ''}`.trim();
            }
            
            // Update user role badge
            const userRoleElement = document.getElementById('userRole');
            if (userRoleElement) {
                userRoleElement.textContent = userData.role || Auth.getUserRole();
            }
        }
    },
    
    // Setup logout functionality
    setupLogout() {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', async function(e) {
                e.preventDefault();
                
                if (confirm('Are you sure you want to logout?')) {
                    await Auth.logout();
                }
            });
        }
    },
    
    // Load data with loading state
    async loadData(elementId, loadFunction, renderFunction) {
        const container = document.getElementById(elementId);
        
        if (!container) {
            console.error(`Element with id '${elementId}' not found`);
            return;
        }
        
        // Show loading
        container.innerHTML = '<div class="loading-spinner"></div>';
        
        try {
            const data = await loadFunction();
            renderFunction(container, data);
        } catch (error) {
            console.error('Error loading data:', error);
            container.innerHTML = `
                <div class="error-message">
                    Failed to load data. Please try again later.
                </div>
            `;
        }
    },
    
    // Render statistics cards
    renderStats(stats) {
        return stats.map(stat => `
            <div class="stat-card">
                <div class="stat-icon">${stat.icon}</div>
                <div class="stat-info">
                    <h3>${stat.value}</h3>
                    <p>${stat.label}</p>
                </div>
            </div>
        `).join('');
    },
    
    // Render data table
    renderTable(columns, data) {
        let html = '<table><thead><tr>';
        
        // Headers
        columns.forEach(col => {
            html += `<th>${col.label}</th>`;
        });
        html += '</tr></thead><tbody>';
        
        // Rows
        if (data && data.length > 0) {
            data.forEach(row => {
                html += '<tr>';
                columns.forEach(col => {
                    const value = col.render ? col.render(row) : row[col.field];
                    html += `<td>${sanitizeHTML(value)}</td>`;
                });
                html += '</tr>';
            });
        } else {
            html += `<tr><td colspan="${columns.length}" class="text-center">No data available</td></tr>`;
        }
        
        html += '</tbody></table>';
        return html;
    }
};
