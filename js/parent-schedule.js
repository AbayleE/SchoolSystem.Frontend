// Parent - Children's Schedule Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const scheduleContainer = document.getElementById('scheduleContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/parents/${parent.id}/children/schedule`);
      if (response && response.data && response.data.length > 0) {
        scheduleContainer.innerHTML = response.data.map(child => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${child.childName} - ${child.className}</h3>
            </div>
            <div class="card-body">
              <div class="table-wrapper">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Time</th>
                      <th>Subject</th>
                      <th>Teacher</th>
                      <th>Room</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${child.classes.map(cls => `
                      <tr>
                        <td>${cls.timeSlot}</td>
                        <td>${cls.subject}</td>
                        <td>${cls.teacherName}</td>
                        <td>${cls.room}</td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        scheduleContainer.innerHTML = '<div class="empty-state">No schedule available.</div>';
      }
    } catch (error) {
      console.error('Error loading schedule:', error);
      scheduleContainer.innerHTML = '<div class="empty-state">Failed to load schedule.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
