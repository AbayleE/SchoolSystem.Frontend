// Parent - Messages Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const messagesContainer = document.getElementById('messagesContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/parents/${parent.id}/messages`);
      if (response && response.data && response.data.length > 0) {
        messagesContainer.innerHTML = response.data.map(msg => `
          <div class="message-item">
            <div class="message-header">
              <span class="message-sender"><strong>${msg.senderName}</strong></span>
              <span class="message-time">${new Date(msg.sentDate).toLocaleString()}</span>
            </div>
            <div class="message-body">
              <p><strong>Regarding:</strong> ${msg.regarding || 'General'}</p>
              <p>${msg.content}</p>
            </div>
          </div>
        `).join('');
      } else {
        messagesContainer.innerHTML = '<div class="empty-state">No messages yet.</div>';
      }
    } catch (error) {
      console.error('Error loading messages:', error);
      messagesContainer.innerHTML = '<div class="empty-state">Failed to load messages.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});
