// Student Attendance Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const attendanceContainer = document.getElementById('attendanceContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/students/${student.id}/attendance`);
      if (response && response.data) {
        const { records, summary } = response.data;
        attendanceContainer.innerHTML = `
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">✅</div>
              <div class="stat-content">
                <div class="stat-value">${summary?.present || 0}</div>
                <div class="stat-label">Present</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">❌</div>
              <div class="stat-content">
                <div class="stat-value">${summary?.absent || 0}</div>
                <div class="stat-label">Absent</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏰</div>
              <div class="stat-content">
                <div class="stat-value">${summary?.late || 0}</div>
                <div class="stat-label">Late</div>
              </div>
            </div>
          </div>
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Remarks</th>
                </tr>
              </thead>
              <tbody>
                ${records?.map(r => `
                  <tr>
                    <td>${new Date(r.date).toLocaleDateString()}</td>
                    <td><span class="badge badge-${r.status.toLowerCase()}">${r.status}</span></td>
                    <td>${r.remarks || '-'}</td>
                  </tr>
                `).join('') || '<tr><td colspan="3">No records</td></tr>'}
              </tbody>
            </table>
          </div>
        `;
      } else {
        attendanceContainer.innerHTML = '<div class="empty-state">No attendance records available.</div>';
      }
    } catch (error) {
      console.error('Error loading attendance:', error);
      attendanceContainer.innerHTML = '<div class="empty-state">Failed to load attendance.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
