// Student Assignments Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const assignmentsContainer = document.getElementById('assignmentsContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/students/${student.id}/assignments`);
      if (response && response.data && response.data.length > 0) {
        assignmentsContainer.innerHTML = response.data.map(assignment => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${assignment.title}</h3>
              <span class="badge badge-${assignment.status.toLowerCase()}">${assignment.status}</span>
            </div>
            <div class="card-body">
              <p>${assignment.description}</p>
              <div class="assignment-meta">
                <span class="meta-item"><strong>Subject:</strong> ${assignment.subject}</span>
                <span class="meta-item"><strong>Due:</strong> ${new Date(assignment.dueDate).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        `).join('');
      } else {
        assignmentsContainer.innerHTML = '<div class="empty-state">No assignments yet.</div>';
      }
    } catch (error) {
      console.error('Error loading assignments:', error);
      assignmentsContainer.innerHTML = '<div class="empty-state">Failed to load assignments.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
