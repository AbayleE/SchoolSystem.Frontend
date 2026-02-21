// Login Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (Auth.isAuthenticated()) {
        Auth.redirectToDashboard();
        return;
    }
    
    const loginForm = document.getElementById('loginForm');
    
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        // Validate inputs
        if (!email || !password) {
            showError('errorMessage', 'Please enter both email and password');
            return;
        }
        
        if (!isValidEmail(email)) {
            showError('errorMessage', 'Please enter a valid email address');
            return;
        }
        
        // Disable submit button
        const submitBtn = loginForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Logging in...';
        
        try {
            const result = await Auth.login(email, password);
            
            if (result.success) {
                // Redirect to appropriate dashboard
                this.showPopover("Logged In");
                Auth.redirectToDashboard();
            } else {
                showError('errorMessage', result.error || 'Login failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Login';
            }
        } catch (error) {
            this.showPopover("An error occurred. Please try again.");
            showError('errorMessage', 'An error occurred. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Login';
        }
    });
});
