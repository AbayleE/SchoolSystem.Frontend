/* ================================================================
   CORE UI COMPONENTS - JavaScript
   Professional Interactive Components for School Management System
   ================================================================ */

// ================================================================
// SIDEBAR MANAGEMENT
// ================================================================
class Sidebar {
  constructor() {
    this.sidebar = document.querySelector('.sidebar');
    this.toggleBtn = document.querySelector('.topbar-toggle');
    this.overlay = document.querySelector('.mobile-overlay');
    this.isCollapsed = localStorage.getItem('sidebar-collapsed') === 'true';
    
    this.init();
  }

  init() {
    // Set initial state
    if (this.isCollapsed && window.innerWidth > 768) {
      this.sidebar?.classList.add('collapsed');
    }

    // Toggle button
    this.toggleBtn?.addEventListener('click', () => this.toggle());

    // Mobile overlay
    this.overlay?.addEventListener('click', () => this.closeMobile());

    // Handle window resize
    window.addEventListener('resize', () => this.handleResize());
  }

  toggle() {
    if (window.innerWidth <= 768) {
      this.toggleMobile();
    } else {
      this.toggleCollapse();
    }
  }

  toggleCollapse() {
    this.sidebar?.classList.toggle('collapsed');
    this.isCollapsed = this.sidebar?.classList.contains('collapsed');
    localStorage.setItem('sidebar-collapsed', this.isCollapsed);
  }

  toggleMobile() {
    this.sidebar?.classList.toggle('mobile-open');
    this.overlay?.classList.toggle('active');
    document.body.style.overflow = this.sidebar?.classList.contains('mobile-open') ? 'hidden' : '';
  }

  closeMobile() {
    this.sidebar?.classList.remove('mobile-open');
    this.overlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  handleResize() {
    if (window.innerWidth > 768) {
      this.closeMobile();
      if (this.isCollapsed) {
        this.sidebar?.classList.add('collapsed');
      }
    } else {
      this.sidebar?.classList.remove('collapsed');
    }
  }
}

// ================================================================
// MODAL MANAGEMENT
// ================================================================
class Modal {
  constructor(modalId) {
    this.modalId = modalId;
    this.modal = null;
    this.backdrop = null;
  }

  show() {
    // Create backdrop
    this.backdrop = document.createElement('div');
    this.backdrop.className = 'modal-backdrop';
    
    // Create modal
    this.modal = document.getElementById(this.modalId);
    if (!this.modal) return;
    
    // Append to backdrop
    const modalClone = this.modal.cloneNode(true);
    modalClone.style.display = 'flex';
    this.backdrop.appendChild(modalClone);
    document.body.appendChild(this.backdrop);
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
    
    // Setup close handlers
    this.setupCloseHandlers();
  }

  hide() {
    if (this.backdrop) {
      this.backdrop.remove();
      document.body.style.overflow = '';
    }
  }

  setupCloseHandlers() {
    // Close button
    const closeBtn = this.backdrop.querySelector('.modal-close');
    closeBtn?.addEventListener('click', () => this.hide());
    
    // Backdrop click
    this.backdrop.addEventListener('click', (e) => {
      if (e.target === this.backdrop) {
        this.hide();
      }
    });
    
    // Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.hide();
      }
    });
  }
}

// Helper function to show modals
function showModal(modalId) {
  const modal = new Modal(modalId);
  modal.show();
  return modal;
}

// ================================================================
// DROPDOWN MANAGEMENT
// ================================================================
class Dropdown {
  constructor(element) {
    this.trigger = element;
    this.menu = element.nextElementSibling;
    this.isOpen = false;
    
    this.init();
  }

  init() {
    this.trigger.addEventListener('click', (e) => {
      e.stopPropagation();
      this.toggle();
    });

    document.addEventListener('click', () => {
      if (this.isOpen) {
        this.close();
      }
    });
  }

  toggle() {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  open() {
    // Close other dropdowns
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
      menu.style.display = 'none';
    });
    
    this.menu.style.display = 'block';
    this.isOpen = true;
  }

  close() {
    this.menu.style.display = 'none';
    this.isOpen = false;
  }
}

// Initialize all dropdowns
function initDropdowns() {
  document.querySelectorAll('[data-dropdown]').forEach(trigger => {
    new Dropdown(trigger);
  });
}

// ================================================================
// TAB MANAGEMENT
// ================================================================
class Tabs {
  constructor(container) {
    this.container = container;
    this.tabs = container.querySelectorAll('.tab');
    this.panes = container.querySelectorAll('.tab-pane');
    
    this.init();
  }

  init() {
    this.tabs.forEach((tab, index) => {
      tab.addEventListener('click', () => this.switchTab(index));
    });
  }

  switchTab(index) {
    // Remove active class from all
    this.tabs.forEach(tab => tab.classList.remove('active'));
    this.panes.forEach(pane => pane.classList.remove('active'));
    
    // Add active to selected
    this.tabs[index].classList.add('active');
    this.panes[index].classList.add('active');
  }
}

// Initialize all tabs
function initTabs() {
  document.querySelectorAll('[data-tabs]').forEach(container => {
    new Tabs(container);
  });
}

// ================================================================
// TOAST NOTIFICATIONS
// ================================================================
class Toast {
  static container = null;

  static init() {
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.className = 'toast-container';
      document.body.appendChild(this.container);
    }
  }

  static show(message, type = 'info', duration = 3000) {
    this.init();

    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    const icon = this.getIcon(type);
    toast.innerHTML = `
      <div style="flex-shrink: 0;">${icon}</div>
      <div style="flex: 1;">${message}</div>
      <button onclick="this.parentElement.remove()" style="background: none; border: none; cursor: pointer; color: inherit; font-size: 20px; padding: 0; margin-left: 8px;">&times;</button>
    `;
    
    this.container.appendChild(toast);

    // Auto remove
    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
      }, duration);
    }

    return toast;
  }

  static getIcon(type) {
    const icons = {
      success: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"/></svg>',
      error: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"/></svg>',
      warning: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/></svg>',
      info: '<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clip-rule="evenodd"/></svg>'
    };
    return icons[type] || icons.info;
  }

  static success(message, duration) {
    return this.show(message, 'success', duration);
  }

  static error(message, duration) {
    return this.show(message, 'error', duration);
  }

  static warning(message, duration) {
    return this.show(message, 'warning', duration);
  }

  static info(message, duration) {
    return this.show(message, 'info', duration);
  }
}

// ================================================================
// TABLE WITH SEARCH AND PAGINATION
// ================================================================
class DataTable {
  constructor(tableId, options = {}) {
    this.table = document.getElementById(tableId);
    this.tbody = this.table?.querySelector('tbody');
    this.data = options.data || [];
    this.currentPage = 1;
    this.pageSize = options.pageSize || 10;
    this.searchTerm = '';
    this.sortColumn = null;
    this.sortDirection = 'asc';
    
    if (this.table) {
      this.init();
    }
  }

  init() {
    // Setup search if provided
    if (this.table.dataset.search) {
      const searchInput = document.querySelector(this.table.dataset.search);
      searchInput?.addEventListener('input', (e) => {
        this.searchTerm = e.target.value.toLowerCase();
        this.currentPage = 1;
        this.render();
      });
    }

    // Setup sorting
    this.table.querySelectorAll('th[data-sortable]').forEach(th => {
      th.style.cursor = 'pointer';
      th.addEventListener('click', () => {
        this.sortColumn = th.dataset.sortable;
        this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        this.render();
      });
    });

    this.render();
  }

  setData(data) {
    this.data = data;
    this.currentPage = 1;
    this.render();
  }

  filter(data) {
    if (!this.searchTerm) return data;
    
    return data.filter(row => {
      return Object.values(row).some(value => 
        String(value).toLowerCase().includes(this.searchTerm)
      );
    });
  }

  sort(data) {
    if (!this.sortColumn) return data;
    
    return [...data].sort((a, b) => {
      const aVal = a[this.sortColumn];
      const bVal = b[this.sortColumn];
      
      if (aVal < bVal) return this.sortDirection === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  paginate(data) {
    const start = (this.currentPage - 1) * this.pageSize;
    const end = start + this.pageSize;
    return data.slice(start, end);
  }

  render() {
    let data = [...this.data];
    data = this.filter(data);
    data = this.sort(data);
    
    const totalPages = Math.ceil(data.length / this.pageSize);
    const paginatedData = this.paginate(data);
    
    // Render table body (implementation depends on table structure)
    // This is a placeholder - customize based on your needs
    
    // Render pagination
    this.renderPagination(totalPages);
  }

  renderPagination(totalPages) {
    const paginationId = this.table.dataset.pagination;
    if (!paginationId) return;
    
    const pagination = document.getElementById(paginationId);
    if (!pagination) return;
    
    let html = '';
    
    // Previous button
    html += `<button class="pagination-btn" ${this.currentPage === 1 ? 'disabled' : ''} onclick="window.table_${this.table.id}.prevPage()">Previous</button>`;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
      if (i === 1 || i === totalPages || (i >= this.currentPage - 1 && i <= this.currentPage + 1)) {
        html += `<button class="pagination-btn ${i === this.currentPage ? 'active' : ''}" onclick="window.table_${this.table.id}.goToPage(${i})">${i}</button>`;
      } else if (i === this.currentPage - 2 || i === this.currentPage + 2) {
        html += `<span style="padding: 0 8px;">...</span>`;
      }
    }
    
    // Next button
    html += `<button class="pagination-btn" ${this.currentPage === totalPages ? 'disabled' : ''} onclick="window.table_${this.table.id}.nextPage()">Next</button>`;
    
    pagination.innerHTML = html;
  }

  nextPage() {
    this.currentPage++;
    this.render();
  }

  prevPage() {
    this.currentPage--;
    this.render();
  }

  goToPage(page) {
    this.currentPage = page;
    this.render();
  }
}

// ================================================================
// FORM VALIDATION
// ================================================================
class FormValidator {
  constructor(formId) {
    this.form = document.getElementById(formId);
    this.init();
  }

  init() {
    this.form?.addEventListener('submit', (e) => {
      if (!this.validate()) {
        e.preventDefault();
      }
    });

    // Real-time validation
    this.form?.querySelectorAll('input, select, textarea').forEach(field => {
      field.addEventListener('blur', () => this.validateField(field));
      field.addEventListener('input', () => this.clearError(field));
    });
  }

  validate() {
    let isValid = true;
    const fields = this.form.querySelectorAll('[required], [data-validate]');
    
    fields.forEach(field => {
      if (!this.validateField(field)) {
        isValid = false;
      }
    });
    
    return isValid;
  }

  validateField(field) {
    this.clearError(field);
    
    // Required check
    if (field.hasAttribute('required') && !field.value.trim()) {
      this.showError(field, 'This field is required');
      return false;
    }
    
    // Email validation
    if (field.type === 'email' && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        this.showError(field, 'Please enter a valid email address');
        return false;
      }
    }
    
    // Min length
    if (field.dataset.minlength && field.value.length < parseInt(field.dataset.minlength)) {
      this.showError(field, `Minimum length is ${field.dataset.minlength} characters`);
      return false;
    }
    
    // Custom validation
    if (field.dataset.validate) {
      const validator = field.dataset.validate;
      if (window[validator] && !window[validator](field.value)) {
        this.showError(field, field.dataset.errorMessage || 'Invalid value');
        return false;
      }
    }
    
    return true;
  }

  showError(field, message) {
    field.classList.add('error');
    
    const errorEl = document.createElement('span');
    errorEl.className = 'form-error';
    errorEl.textContent = message;
    
    field.parentElement.appendChild(errorEl);
  }

  clearError(field) {
    field.classList.remove('error');
    const error = field.parentElement.querySelector('.form-error');
    error?.remove();
  }
}

// ================================================================
// LOADING OVERLAY
// ================================================================
function showLoading(container) {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.innerHTML = '<div class="spinner"></div>';
  
  const target = typeof container === 'string' 
    ? document.getElementById(container) 
    : container || document.body;
  
  target.style.position = 'relative';
  target.appendChild(overlay);
  
  return overlay;
}

function hideLoading(overlay) {
  overlay?.remove();
}

// ================================================================
// INITIALIZE ON DOM LOAD
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
  // Initialize sidebar
  new Sidebar();
  
  // Initialize dropdowns
  initDropdowns();
  
  // Initialize tabs
  initTabs();
  
  // Set active nav item based on current page
  const currentPath = window.location.pathname;
  document.querySelectorAll('.sidebar-nav-link').forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    }
  });
});

// ================================================================
// UTILITY FUNCTIONS
// ================================================================

// Format date
function formatDate(date, format = 'MMM DD, YYYY') {
  const d = new Date(date);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  
  return format
    .replace('YYYY', d.getFullYear())
    .replace('MMM', months[d.getMonth()])
    .replace('DD', String(d.getDate()).padStart(2, '0'))
    .replace('HH', String(d.getHours()).padStart(2, '0'))
    .replace('mm', String(d.getMinutes()).padStart(2, '0'));
}

// Format currency
function formatCurrency(amount, currency = 'ETB') {
  return new Intl.NumberFormat('en-ET', {
    style: 'currency',
    currency: currency
  }).format(amount);
}

// Debounce function
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Export to global scope
window.Sidebar = Sidebar;
window.Modal = Modal;
window.showModal = showModal;
window.Dropdown = Dropdown;
window.Tabs = Tabs;
window.Toast = Toast;
window.DataTable = DataTable;
window.FormValidator = FormValidator;
window.showLoading = showLoading;
window.hideLoading = hideLoading;
window.formatDate = formatDate;
window.formatCurrency = formatCurrency;
window.debounce = debounce;
