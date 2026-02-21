// Student Classes Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    // Load tenant theme
    applyTenantTheme();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Load student's classes
    const classesContainer = document.getElementById('classesContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/students/${student.id}/classes`);
      if (response && response.data && response.data.length > 0) {
        classesContainer.innerHTML = response.data.map(cls => `
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Class Name</th>
                  <th>Section</th>
                  <th>Teacher</th>
                  <th>Room</th>
                </tr>
              </thead>
              <tbody>
                ${response.data.map(c => `
                  <tr>
                    <td>${c.name}</td>
                    <td>${c.section || '-'}</td>
                    <td>${c.teacherName || '-'}</td>
                    <td>${c.room || '-'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `).join('');
      } else {
        classesContainer.innerHTML = '<div class="empty-state">No classes enrolled yet.</div>';
      }
    } catch (error) {
      console.error('Error loading classes:', error);
      classesContainer.innerHTML = '<div class="empty-state">Failed to load classes.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
