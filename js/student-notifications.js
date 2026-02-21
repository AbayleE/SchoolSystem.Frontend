// Student Notifications Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const notificationsContainer = document.getElementById('notificationsContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/students/${student.id}/notifications`);
      if (response && response.data && response.data.length > 0) {
        notificationsContainer.innerHTML = response.data.map(notif => `
          <div class="notification-item ${notif.read ? '' : 'unread'}">
            <div class="notification-header">
              <span class="notification-title"><strong>${notif.title}</strong></span>
              <span class="notification-time">${new Date(notif.createdAt).toLocaleString()}</span>
            </div>
            <div class="notification-body">
              <p>${notif.message}</p>
            </div>
          </div>
        `).join('');
      } else {
        notificationsContainer.innerHTML = '<div class="empty-state">No notifications.</div>';
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
      notificationsContainer.innerHTML = '<div class="empty-state">Failed to load notifications.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
