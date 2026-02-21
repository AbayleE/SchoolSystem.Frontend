// Parent - My Children Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const childrenContainer = document.getElementById('childrenContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/parents/${parent.id}/children`);
      if (response && response.data && response.data.length > 0) {
        childrenContainer.innerHTML = response.data.map(child => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${child.firstName} ${child.lastName}</h3>
              <span class="badge">${child.currentClass || 'N/A'}</span>
            </div>
            <div class="card-body">
              <p><strong>Roll No:</strong> ${child.rollNumber}</p>
              <p><strong>Registration No:</strong> ${child.registrationNumber}</p>
              <p><strong>Date of Birth:</strong> ${new Date(child.dateOfBirth).toLocaleDateString()}</p>
            </div>
          </div>
        `).join('');
      } else {
        childrenContainer.innerHTML = '<div class="empty-state">No children registered.</div>';
      }
    } catch (error) {
      console.error('Error loading children:', error);
      childrenContainer.innerHTML = '<div class="empty-state">Failed to load children information.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
