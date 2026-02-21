// Student Dashboard Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    // Set user info
    document.getElementById('studentName').textContent = `${student.firstName} ${student.lastName}`;
    document.getElementById('studentGreetingName').textContent = student.firstName;
    
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
      const response = await apiClient.get(`/api/students/${student.id}/dashboard`);
      if (response && response.data) {
        const { stats, recentAssignments, recentGrades, upcomingClasses } = response.data;
        
        // Update stats
        if (stats) {
          document.getElementById('totalClassesStat').textContent = stats.totalClasses || 0;
          document.getElementById('pendingAssignmentsStat').textContent = stats.pendingAssignments || 0;
          document.getElementById('averageGradeStat').textContent = `${stats.averageGrade || 0}%`;
          document.getElementById('attendancePercentageStat').textContent = `${stats.attendancePercentage || 0}%`;
        }

        // Update assignment badge
        if (stats?.pendingAssignments > 0) {
          const badge = document.getElementById('assignmentBadge');
          badge.textContent = stats.pendingAssignments;
          badge.style.display = 'inline-block';
        }
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  } catch (error) {
    console.error('Error initializing student dashboard:', error);
  }
});
