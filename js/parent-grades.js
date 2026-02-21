// Parent - Children's Grades Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const gradesContainer = document.getElementById('gradesContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/parents/${parent.id}/children/grades`);
      if (response && response.data && response.data.length > 0) {
        gradesContainer.innerHTML = response.data.map(record => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${record.childName} - ${record.subject}</h3>
              <span class="grade-badge">${record.grade}</span>
            </div>
            <div class="card-body">
              <p><strong>Teacher:</strong> ${record.teacherName}</p>
              <p><strong>Term:</strong> ${record.term}</p>
              <p><strong>Percentage:</strong> ${record.percentage}%</p>
            </div>
          </div>
        `).join('');
      } else {
        gradesContainer.innerHTML = '<div class="empty-state">No grades available.</div>';
      }
    } catch (error) {
      console.error('Error loading grades:', error);
      gradesContainer.innerHTML = '<div class="empty-state">Failed to load grades.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
