// Parent Dashboard Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const parent = JSON.parse(localStorage.getItem('user'));
    if (!parent || parent.role !== 'parent') {
      window.location.href = 'login-new.html';
      return;
    }

    // Set user info
    document.getElementById('parentName').textContent = `${parent.firstName} ${parent.lastName}`;
    document.getElementById('parentGreetingName').textContent = parent.firstName;
    
    // Apply theme
    applyTenantTheme();
    
    // Initialize sidebar
    initializeSidebar();
    
    // Initialize topbar interactions
    const topbarToggle = document.querySelector('.topbar-toggle');
    topbarToggle?.addEventListener('click', () => {
      document.querySelector('.sidebar').classList.toggle('active');
    });

    const apiClient = new ApiClient();

    // Load dashboard data
    try {
      const response = await apiClient.get(`/api/parents/${parent.id}/dashboard`);
      if (response && response.data) {
        const { stats, children, recentGrades } = response.data;
        
        // Update stats
        if (stats) {
          document.getElementById('totalChildrenStat').textContent = stats.totalChildren || 0;
          document.getElementById('avgGradeStat').textContent = `${stats.averageGrade || 0}%`;
          document.getElementById('avgAttendanceStat').textContent = `${stats.averageAttendance || 0}%`;
          document.getElementById('unreadMessagesStat').textContent = stats.unreadMessages || 0;
        }

        // Display children
        if (children && children.length > 0) {
          document.getElementById('recentChildrenContainer').innerHTML = children.slice(0, 2).map(child => `
            <div class="child-info-item">
              <h4>${child.firstName} ${child.lastName}</h4>
              <p>Class: ${child.currentClass}</p>
              <p>Roll: ${child.rollNumber}</p>
            </div>
          `).join('');
        }

        // Display grades
        if (recentGrades && recentGrades.length > 0) {
          document.getElementById('recentGradesContainer').innerHTML = recentGrades.slice(0, 3).map(grade => `
            <div class="grade-info-item">
              <span>${grade.childName} - ${grade.subject}: <strong>${grade.grade}</strong></span>
            </div>
          `).join('');
        }

        // Update message badge
        if (stats?.unreadMessages > 0) {
          const badge = document.getElementById('messageBadge');
          badge.textContent = stats.unreadMessages;
          badge.style.display = 'inline-block';
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  } catch (error) {
    console.error('Error initializing parent dashboard:', error);
  }
});
