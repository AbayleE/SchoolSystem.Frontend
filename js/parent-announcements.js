// Parent - Announcements Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const announcementsContainer = document.getElementById('announcementsContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/announcements`);
      if (response && response.data && response.data.length > 0) {
        announcementsContainer.innerHTML = response.data.map(announce => `
          <div class="card">
            <div class="card-header">
              <h3 class="card-title">${announce.title}</h3>
              <span class="announcement-date">${new Date(announce.publishedDate).toLocaleDateString()}</span>
            </div>
            <div class="card-body">
              <p>${announce.content}</p>
              ${announce.attachments ? `<p><strong>Attachments:</strong> ${announce.attachments.length} file(s)</p>` : ''}
            </div>
          </div>
        `).join('');
      } else {
        announcementsContainer.innerHTML = '<div class="empty-state">No announcements yet.</div>';
      }
    } catch (error) {
      console.error('Error loading announcements:', error);
      announcementsContainer.innerHTML = '<div class="empty-state">Failed to load announcements.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
