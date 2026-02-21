// Parent - Children's Attendance Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const attendanceContainer = document.getElementById('attendanceContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/parents/${parent.id}/children/attendance`);
      if (response && response.data && response.data.length > 0) {
        attendanceContainer.innerHTML = response.data.map(record => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${record.childName}</h3>
              <span class="badge">${Math.round(record.percentage)}% Present</span>
            </div>
            <div class="card-body">
              <div class="stats-grid">
                <div class="stat-card">
                  <div class="stat-content">
                    <div class="stat-value">${record.presentDays}</div>
                    <div class="stat-label">Days Present</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-content">
                    <div class="stat-value">${record.absentDays}</div>
                    <div class="stat-label">Days Absent</div>
                  </div>
                </div>
                <div class="stat-card">
                  <div class="stat-content">
                    <div class="stat-value">${record.lateDays}</div>
                    <div class="stat-label">Days Late</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        attendanceContainer.innerHTML = '<div class="empty-state">No attendance records.</div>';
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      attendanceContainer.innerHTML = '<div class="empty-state">Failed to load attendance.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
