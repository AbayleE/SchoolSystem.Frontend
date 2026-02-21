// System Owner Dashboard Controller
// Handles loading and displaying system-wide data

window.SystemOwnerDashboard = {
    async init() {
        // Verify authentication and role
        if (!Auth.isAuthenticated()) {
            window.location.href = '../pages/login-new.html';
            return;
        }
        
        const userRole = Auth.getUserRole();
        if (userRole !== APP_CONFIG.ROLES.SYSTEM_OWNER) {
            Auth.redirectToDashboard();
            return;
        }
        
        // Setup UI
        this.setupEventListeners();
        this.updateUserProfile();
        
        // Load data with error handling
        try {
            await Promise.allSettled([
                this.loadAnalytics(),
                this.loadSchools(),
                this.loadUsers(),
                this.loadBilling(),
                this.loadActivityLog()
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
        
        const addSchoolBtn = document.getElementById('addSchoolBtn');
        if (addSchoolBtn) {
            addSchoolBtn.addEventListener('click', () => {
                alert('Add School feature coming soon');
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
    
    async loadAnalytics() {
        try {
            const response = await ApiClient.get('/systemowner/analytics');
            const analytics = response.data || {};
            
            // Update stats
            document.getElementById('totalSchools').textContent = analytics.totalSchools || 0;
            document.getElementById('totalUsers').textContent = analytics.totalUsers || 0;
            document.getElementById('totalStudents').textContent = analytics.totalStudents || 0;
            document.getElementById('totalRevenue').textContent = '$' + ((analytics.totalRevenue || 0).toLocaleString());
            
            this.renderAnalytics(analytics);
            
        } catch (error) {
            console.error('Error loading analytics:', error);
            this.renderAnalyticsEmpty();
        }
    },
    
    renderAnalytics(analytics) {
        const container = document.getElementById('analyticsContainer');
        
        const cards = [
            {
                title: 'User Distribution',
                content: `
                    <div style="padding: 10px 0;">
                        <div style="margin-bottom: 10px;">Teachers: <strong>${analytics.teacherCount || 0}</strong></div>
                        <div style="margin-bottom: 10px;">Students: <strong>${analytics.studentCount || 0}</strong></div>
                        <div style="margin-bottom: 10px;">Admins: <strong>${analytics.adminCount || 0}</strong></div>
                        <div>Parents: <strong>${analytics.parentCount || 0}</strong></div>
                    </div>
                `
            },
            {
                title: 'System Health',
                content: `
                    <div style="padding: 10px 0;">
                        <div style="margin-bottom: 10px;">Active Schools: <strong>${analytics.activeSchools || 0}</strong></div>
                        <div style="margin-bottom: 10px;">Active Users: <strong>${analytics.activeUsers || 0}</strong></div>
                        <div style="margin-bottom: 10px;">Uptime: <strong>${analytics.systemUptime || 'N/A'}</strong></div>
                        <div>Last Backup: <strong>${analytics.lastBackup ? new Date(analytics.lastBackup).toLocaleDateString() : 'N/A'}</strong></div>
                    </div>
                `
            },
            {
                title: 'Financial Overview',
                content: `
                    <div style="padding: 10px 0;">
                        <div style="margin-bottom: 10px;">Monthly Revenue: <strong>$${(analytics.monthlyRevenue || 0).toLocaleString()}</strong></div>
                        <div style="margin-bottom: 10px;">Annual Revenue: <strong>$${(analytics.annualRevenue || 0).toLocaleString()}</strong></div>
                        <div style="margin-bottom: 10px;">Avg School Subscription: <strong>$${(analytics.avgSubscription || 0).toLocaleString()}</strong></div>
                        <div>Pending Payments: <strong>$${(analytics.pendingPayments || 0).toLocaleString()}</strong></div>
                    </div>
                `
            }
        ];
        
        container.innerHTML = cards.map(card => `
            <div class="chart-card">
                <h3>${card.title}</h3>
                ${card.content}
            </div>
        `).join('');
    },
    
    renderAnalyticsEmpty() {
        const container = document.getElementById('analyticsContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>No analytics data available</p>
            </div>
        `;
    },
    
    async loadSchools() {
        try {
            const response = await ApiClient.get('/systemowner/schools');
            const schools = response.data || [];
            
            this.renderSchools(schools);
            
        } catch (error) {
            console.error('Error loading schools:', error);
            this.renderSchoolsEmpty();
        }
    },
    
    renderSchools(schools) {
        const container = document.getElementById('schoolsContainer');
        
        if (schools.length === 0) {
            this.renderSchoolsEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>School Name</th>
                        <th>Principal</th>
                        <th>Email</th>
                        <th>Students</th>
                        <th>Teachers</th>
                        <th>Subscription</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${schools.slice(0, 20).map(school => `
                        <tr>
                            <td><strong>${school.name || 'N/A'}</strong></td>
                            <td>${school.principalName || 'N/A'}</td>
                            <td>${school.email || 'N/A'}</td>
                            <td>${school.studentCount || 0}</td>
                            <td>${school.teacherCount || 0}</td>
                            <td>${school.subscriptionPlan || 'N/A'}</td>
                            <td><span class="status-badge ${school.isActive ? 'active' : 'inactive'}">${school.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderSchoolsEmpty() {
        const container = document.getElementById('schoolsContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏫</div>
                <p>No schools found</p>
            </div>
        `;
    },
    
    async loadUsers() {
        try {
            const response = await ApiClient.get('/systemowner/users');
            const users = response.data || [];
            
            this.renderUsers(users);
            
        } catch (error) {
            console.error('Error loading users:', error);
            this.renderUsersEmpty();
        }
    },
    
    renderUsers(users) {
        const container = document.getElementById('usersContainer');
        
        if (users.length === 0) {
            this.renderUsersEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Role</th>
                        <th>School</th>
                        <th>Last Login</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${users.slice(0, 20).map(user => `
                        <tr>
                            <td>${user.firstName} ${user.lastName || ''}</td>
                            <td>${user.email || 'N/A'}</td>
                            <td>${user.role || 'N/A'}</td>
                            <td>${user.schoolName || 'N/A'}</td>
                            <td>${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'}</td>
                            <td><span class="status-badge ${user.isActive ? 'active' : 'inactive'}">${user.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderUsersEmpty() {
        const container = document.getElementById('usersContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <p>No users found</p>
            </div>
        `;
    },
    
    async loadBilling() {
        try {
            const response = await ApiClient.get('/systemowner/billing');
            const billing = response.data || [];
            
            this.renderBilling(billing);
            
        } catch (error) {
            console.error('Error loading billing:', error);
            this.renderBillingEmpty();
        }
    },
    
    renderBilling(billing) {
        const container = document.getElementById('billingContainer');
        
        if (billing.length === 0) {
            this.renderBillingEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>School</th>
                        <th>Plan</th>
                        <th>Monthly Cost</th>
                        <th>Renewal Date</th>
                        <th>Status</th>
                        <th>Payment Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${billing.slice(0, 20).map(bill => `
                        <tr>
                            <td>${bill.schoolName || 'N/A'}</td>
                            <td>${bill.plan || 'N/A'}</td>
                            <td>$${(bill.monthlyCost || 0).toLocaleString()}</td>
                            <td>${bill.renewalDate ? new Date(bill.renewalDate).toLocaleDateString() : 'N/A'}</td>
                            <td><span class="status-badge ${bill.isActive ? 'active' : 'inactive'}">${bill.isActive ? 'Active' : 'Inactive'}</span></td>
                            <td><span class="status-badge ${bill.paymentStatus === 'Paid' ? 'active' : 'inactive'}">${bill.paymentStatus || 'Pending'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderBillingEmpty() {
        const container = document.getElementById('billingContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <p>No billing data available</p>
            </div>
        `;
    },
    
    async loadActivityLog() {
        try {
            const response = await ApiClient.get('/systemowner/activity');
            const activity = response.data || [];
            
            this.renderActivityLog(activity);
            
        } catch (error) {
            console.error('Error loading activity log:', error);
            this.renderActivityEmpty();
        }
    },
    
    renderActivityLog(activity) {
        const container = document.getElementById('activityContainer');
        
        if (activity.length === 0) {
            this.renderActivityEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Action</th>
                        <th>School</th>
                        <th>Details</th>
                        <th>Timestamp</th>
                    </tr>
                </thead>
                <tbody>
                    ${activity.slice(0, 25).map(log => `
                        <tr>
                            <td>${log.userName || 'System'}</td>
                            <td>${log.action || 'N/A'}</td>
                            <td>${log.schoolName || 'System'}</td>
                            <td>${log.details || '-'}</td>
                            <td>${log.timestamp ? new Date(log.timestamp).toLocaleString() : 'N/A'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderActivityEmpty() {
        const container = document.getElementById('activityContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📋</div>
                <p>No activity log available</p>
            </div>
        `;
    },
    
    showError(message) {
        console.error('Dashboard Error:', message);
    }
};

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    SystemOwnerDashboard.init();
});
