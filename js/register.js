// Register Page Script
document.addEventListener('DOMContentLoaded', function() {
    // Check if already logged in
    if (Auth.isAuthenticated()) {
        Auth.redirectToDashboard();
        return;
    }
    
    const registerForm = document.getElementById('registerForm');
    const invitationCodeInput = document.getElementById('invitationCode');
    
    // Auto-fill invitation code from URL if present
    const invitationCode = getQueryParam('code');
    if (invitationCode) {
        invitationCodeInput.value = invitationCode;
    }
    
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            invitationCode: document.getElementById('invitationCode').value.trim(),
            firstName: document.getElementById('firstName').value.trim(),
            lastName: document.getElementById('lastName').value.trim(),
            email: document.getElementById('email').value.trim(),
            password: document.getElementById('password').value,
            confirmPassword: document.getElementById('confirmPassword').value
        };
        
        // Validate inputs
        if (!formData.invitationCode) {
            showError('errorMessage', 'Invitation code is required');
            return;
        }
        
        if (!formData.firstName || !formData.lastName) {
            showError('errorMessage', 'Please enter your full name');
            return;
        }
        
        if (!isValidEmail(formData.email)) {
            showError('errorMessage', 'Please enter a valid email address');
            return;
        }
        
        if (!isValidPassword(formData.password)) {
            showError('errorMessage', 'Password must be at least 8 characters and contain letters and numbers');
            return;
        }
        
        if (formData.password !== formData.confirmPassword) {
            showError('errorMessage', 'Passwords do not match');
            return;
        }
        
        // Disable submit button
        const submitBtn = registerForm.querySelector('button[type="submit"]');
        submitBtn.disabled = true;
        submitBtn.textContent = 'Registering...';
        
        try {
            const result = await Auth.register(formData);
            
            if (result.success) {
                showSuccess('successMessage', result.message || 'Registration successful! Redirecting to login...');
                
                // Clear form
                registerForm.reset();
                
                // Redirect to login after 2 seconds
                setTimeout(() => {
                    window.location.href = '/index.html';
                }, 2000);
            } else {
                showError('errorMessage', result.error || 'Registration failed. Please try again.');
                submitBtn.disabled = false;
                submitBtn.textContent = 'Register';
            }
        } catch (error) {
            showError('errorMessage', 'An error occurred. Please try again.');
            submitBtn.disabled = false;
            submitBtn.textContent = 'Register';
        }
    });
});
