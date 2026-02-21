// Manager Dashboard Controller
// Handles loading and displaying manager-specific data

window.ManagerDashboard = {
    async init() {
        // Verify authentication and role
        if (!Auth.isAuthenticated()) {
            window.location.href = '../pages/login-new.html';
            return;
        }
        
        const userRole = Auth.getUserRole();
        if (userRole !== APP_CONFIG.ROLES.MANAGER) {
            Auth.redirectToDashboard();
            return;
        }
        
        // Setup UI
        this.setupEventListeners();
        this.updateUserProfile();
        
        // Load data with error handling
        try {
            await Promise.allSettled([
                this.loadDepartments(),
                this.loadStaff(),
                this.loadBudget(),
                this.loadTasks()
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
    
    async loadDepartments() {
        try {
            const response = await ApiClient.get('/managers/departments');
            const departments = response.data || [];
            
            document.getElementById('totalDepartments').textContent = departments.length;
            this.renderDepartments(departments);
            
        } catch (error) {
            console.error('Error loading departments:', error);
            this.renderDepartmentsEmpty();
        }
    },
    
    renderDepartments(departments) {
        const container = document.getElementById('departmentsContainer');
        
        if (departments.length === 0) {
            this.renderDepartmentsEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Department Name</th>
                        <th>Head</th>
                        <th>Staff Count</th>
                        <th>Budget</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${departments.map(dept => `
                        <tr>
                            <td>${dept.name || 'N/A'}</td>
                            <td>${dept.headName || 'N/A'}</td>
                            <td>${dept.staffCount || 0}</td>
                            <td>$${(dept.budget || 0).toLocaleString()}</td>
                            <td><span class="status-badge ${dept.isActive ? 'active' : 'inactive'}">${dept.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderDepartmentsEmpty() {
        const container = document.getElementById('departmentsContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">🏢</div>
                <p>No departments found</p>
            </div>
        `;
    },
    
    async loadStaff() {
        try {
            const response = await ApiClient.get('/managers/staff');
            const staff = response.data || [];
            
            document.getElementById('totalStaff').textContent = staff.length;
            this.renderStaff(staff);
            
        } catch (error) {
            console.error('Error loading staff:', error);
            this.renderStaffEmpty();
        }
    },
    
    renderStaff(staff) {
        const container = document.getElementById('staffContainer');
        
        if (staff.length === 0) {
            this.renderStaffEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Position</th>
                        <th>Department</th>
                        <th>Email</th>
                        <th>Join Date</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${staff.slice(0, 20).map(emp => `
                        <tr>
                            <td>${emp.firstName} ${emp.lastName || ''}</td>
                            <td>${emp.position || 'N/A'}</td>
                            <td>${emp.department || 'N/A'}</td>
                            <td>${emp.email || 'N/A'}</td>
                            <td>${emp.joinDate ? new Date(emp.joinDate).toLocaleDateString() : 'N/A'}</td>
                            <td><span class="status-badge ${emp.isActive ? 'active' : 'inactive'}">${emp.isActive ? 'Active' : 'Inactive'}</span></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderStaffEmpty() {
        const container = document.getElementById('staffContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">👥</div>
                <p>No staff members found</p>
            </div>
        `;
    },
    
    async loadBudget() {
        try {
            const response = await ApiClient.get('/managers/budget');
            const budgets = response.data || [];
            
            if (budgets.length > 0) {
                const totalBudget = budgets.reduce((sum, b) => sum + (b.allocated || 0), 0);
                document.getElementById('budgetAllocated').textContent = '$' + totalBudget.toLocaleString();
            }
            
            this.renderBudget(budgets);
            
        } catch (error) {
            console.error('Error loading budget:', error);
            this.renderBudgetEmpty();
        }
    },
    
    renderBudget(budgets) {
        const container = document.getElementById('budgetContainer');
        
        if (budgets.length === 0) {
            this.renderBudgetEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Allocated</th>
                        <th>Spent</th>
                        <th>Remaining</th>
                        <th>Usage %</th>
                    </tr>
                </thead>
                <tbody>
                    ${budgets.slice(0, 15).map(budget => {
                        const allocated = budget.allocated || 0;
                        const spent = budget.spent || 0;
                        const remaining = allocated - spent;
                        const percentage = allocated > 0 ? Math.round((spent / allocated) * 100) : 0;
                        
                        return `
                            <tr>
                                <td>${budget.category || 'N/A'}</td>
                                <td>$${allocated.toLocaleString()}</td>
                                <td>$${spent.toLocaleString()}</td>
                                <td>$${remaining.toLocaleString()}</td>
                                <td><div style="width: 100px; background: #f0f0f0; border-radius: 4px; overflow: hidden;"><div style="width: ${percentage}%; height: 20px; background: ${percentage > 80 ? '#f44336' : '#4CAF50'}; display: flex; align-items: center; justify-content: center; color: white; font-size: 12px;">${percentage}%</div></div></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderBudgetEmpty() {
        const container = document.getElementById('budgetContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">💰</div>
                <p>No budget data available</p>
            </div>
        `;
    },
    
    async loadTasks() {
        try {
            const response = await ApiClient.get('/managers/tasks');
            const tasks = response.data || [];
            
            const pending = tasks.filter(t => t.status === 'Pending').length;
            document.getElementById('pendingTasks').textContent = pending;
            
            this.renderTasks(tasks);
            
        } catch (error) {
            console.error('Error loading tasks:', error);
            this.renderTasksEmpty();
        }
    },
    
    renderTasks(tasks) {
        const container = document.getElementById('tasksContainer');
        
        if (tasks.length === 0) {
            this.renderTasksEmpty();
            return;
        }
        
        container.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>Task</th>
                        <th>Assigned To</th>
                        <th>Due Date</th>
                        <th>Priority</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${tasks.slice(0, 15).map(task => {
                        let priorityColor = '#2196F3'; // Blue for Normal
                        if (task.priority === 'High') priorityColor = '#f44336'; // Red
                        else if (task.priority === 'Low') priorityColor = '#4CAF50'; // Green
                        
                        return `
                            <tr>
                                <td>${task.title || 'N/A'}</td>
                                <td>${task.assignedTo || 'Unassigned'}</td>
                                <td>${task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'N/A'}</td>
                                <td><span style="color: ${priorityColor}; font-weight: bold;">${task.priority || 'Normal'}</span></td>
                                <td><span class="status-badge active">${task.status || 'Pending'}</span></td>
                            </tr>
                        `;
                    }).join('')}
                </tbody>
            </table>
        `;
    },
    
    renderTasksEmpty() {
        const container = document.getElementById('tasksContainer');
        container.innerHTML = `
            <div class="empty-state">
                <div class="empty-state-icon">📊</div>
                <p>No tasks</p>
            </div>
        `;
    },
    
    showError(message) {
        console.error('Dashboard Error:', message);
    }
};

// Initialize on document load
document.addEventListener('DOMContentLoaded', () => {
    ManagerDashboard.init();
});
