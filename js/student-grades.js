// Student Grades Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const gradesContainer = document.getElementById('gradesContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/students/${student.id}/grades`);
      if (response && response.data && response.data.length > 0) {
        gradesContainer.innerHTML = response.data.map(grade => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${grade.subject}</h3>
              <span class="grade-badge">${grade.grade}</span>
            </div>
            <div class="card-body">
              <p><strong>Teacher:</strong> ${grade.teacherName}</p>
              <p><strong>Term:</strong> ${grade.term}</p>
              <p><strong>Date:</strong> ${new Date(grade.dateGraded).toLocaleDateString()}</p>
            </div>
          </div>
        `).join('');
      } else {
        gradesContainer.innerHTML = '<div class="empty-state">No grades available yet.</div>';
      }
    } catch (error) {
      console.error('Error loading grades:', error);
      gradesContainer.innerHTML = '<div class="empty-state">Failed to load grades.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
