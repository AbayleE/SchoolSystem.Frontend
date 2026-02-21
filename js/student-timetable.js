// Student Timetable Page Controller
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const student = JSON.parse(localStorage.getItem('user'));
    if (!student || student.role !== 'student') {
      window.location.href = 'login-new.html';
      return;
    }

    applyTenantTheme();
    initializeSidebar();
    
    const timetableContainer = document.getElementById('timetableContainer');
    const apiClient = new ApiClient();
    
    try {
      const response = await apiClient.get(`/api/students/${student.id}/timetable`);
      if (response && response.data && response.data.length > 0) {
        const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
        timetableContainer.innerHTML = `
          <div class="table-wrapper">
            <table class="table">
              <thead>
                <tr>
                  <th>Time</th>
                  ${days.map(d => `<th>${d}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${generateTimetableRows(response.data)}
              </tbody>
            </table>
          </div>
        `;
      } else {
        timetableContainer.innerHTML = '<div class="empty-state">No timetable available.</div>';
      }
    } catch (error) {
      console.error('Error loading timetable:', error);
      timetableContainer.innerHTML = '<div class="empty-state">Failed to load timetable.</div>';
    }
  } catch (error) {
    console.error('Error initializing page:', error);
  }
});

function generateTimetableRows(data) {
  // Group by time slot
  const timeSlots = [...new Set(data.map(d => d.timeSlot))].sort();
  return timeSlots.map(slot => `
    <tr>
      <td>${slot}</td>
      ${['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => {
        const entry = data.find(d => d.timeSlot === slot && d.day === day);
        return `<td>${entry ? entry.className : '-'}</td>`;
      }).join('')}
    </tr>
  `).join('');
}
