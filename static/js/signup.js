// Signup Form Functionality
document.addEventListener('DOMContentLoaded', function() {
    console.log('Signup page initialized');
    
    // Elements
    const form = document.getElementById('signupForm');
    const submitButton = document.getElementById('submitButton');
    const signinLink = document.getElementById('signinLink');
    const successOverlay = document.getElementById('successOverlay');
    const termsCheckbox = document.getElementById('agreeTerms');
    const termsError = document.getElementById('termsError');
    const passwordField = form ? form.querySelector('input[type="password"]') : null;
    
    // Ensure elements exist
    if (!form || !submitButton || !signinLink) {
        console.error('Required elements not found!');
        return;
    }
    
    console.log('All elements found successfully');
    
    // Initialize form functionality
    initForm();
    
    // ============================================
    // FORM INITIALIZATION
    // ============================================
    function initForm() {
        setupEventListeners();
        setupPasswordStrength();
        setupInputAnimations();
        console.log('Form initialized');
    }
    
    // ============================================
    // EVENT LISTENERS SETUP
    // ============================================
    function setupEventListeners() {
        // Submit button - Primary click handler
        submitButton.addEventListener('click', handleSubmit, true);
        
        // Form submit - Fallback handler
        form.addEventListener('submit', handleFormSubmit, true);
        
        // Sign in link - Direct navigation
        signinLink.addEventListener('click', handleSignIn, true);
        
        // Terms checkbox validation
        if (termsCheckbox) {
            termsCheckbox.addEventListener('change', validateTerms);
        }
        
        // Input validation on blur
        const inputs = form.querySelectorAll('input:not([type="checkbox"])');
        inputs.forEach(input => {
            input.addEventListener('blur', () => validateField(input));
            input.addEventListener('input', () => clearFieldError(input));
        });
        
        // Enter key submission
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' && !e.target.matches('textarea, button')) {
                e.preventDefault();
                handleSubmit(e);
            }
        });
        
        // Social buttons
        document.querySelectorAll('.social-button').forEach(button => {
            button.addEventListener('click', handleSocialLogin);
        });
    }
    
    // ============================================
    // FORM SUBMISSION HANDLERS
    // ============================================
    function handleSubmit(e) {
        console.log('Submit button clicked');
        e.preventDefault();
        e.stopPropagation();
        
        // Validate form
        if (validateForm()) {
            submitForm();
        } else {
            shakeForm();
        }
    }
    
    function handleFormSubmit(e) {
        console.log('Form submit event');
        e.preventDefault();
        
        if (validateForm()) {
            submitForm();
        }
    }
    
    function submitForm() {
        console.log('Submitting form...');
        
        // Show loading state
        submitButton.classList.add('loading');
        submitButton.disabled = true;
        
        // Simulate API call (replace with actual form submission)
        setTimeout(() => {
            // Show success state
            submitButton.classList.remove('loading');
            submitButton.classList.add('success');
            
            // Show success overlay
            setTimeout(() => {
                if (successOverlay) {
                    successOverlay.classList.add('active');
                }
                
                // Reset form after delay
                setTimeout(() => {
                    form.reset();
                    submitButton.classList.remove('success');
                    submitButton.disabled = false;
                    resetPasswordStrength();
                }, 3000);
            }, 1000);
        }, 2000);
    }
    
    // ============================================
    // SIGN IN LINK HANDLER
    // ============================================
    function handleSignIn(e) {
        console.log('Sign in link clicked');
        e.preventDefault();
        e.stopPropagation();
        
        // Get URL from href attribute
        const url = signinLink.getAttribute('href');
        
        if (url) {
            // Add loading effect
            signinLink.style.opacity = '0.7';
            signinLink.style.pointerEvents = 'none';
            
            // Navigate after brief delay for visual feedback
            setTimeout(() => {
                window.location.href = url;
            }, 300);
        } else {
            console.error('No URL found for sign in link');
        }
    }
    
    // ============================================
    // FORM VALIDATION
    // ============================================
    function validateForm() {
        console.log('Validating form...');
        let isValid = true;
        
        // Check terms agreement
        if (termsCheckbox && !termsCheckbox.checked) {
            showTermsError('You must agree to the terms and conditions');
            isValid = false;
            shakeElement(termsCheckbox);
        } else {
            clearTermsError();
        }
        
        // Check required fields
        const requiredFields = form.querySelectorAll('input[required]');
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                showFieldError(field, 'This field is required');
                isValid = false;
                shakeElement(field);
            }
        });
        
        // Validate email format
        const emailField = form.querySelector('input[type="email"]');
        if (emailField && emailField.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailField.value)) {
                showFieldError(emailField, 'Please enter a valid email address');
                isValid = false;
                shakeElement(emailField);
            }
        }
        
        // Validate password
        if (passwordField && passwordField.value) {
            if (passwordField.value.length < 8) {
                showFieldError(passwordField, 'Password must be at least 8 characters');
                isValid = false;
                shakeElement(passwordField);
            }
        }
        
        console.log('Form validation result:', isValid);
        return isValid;
    }
    
    function validateField(field) {
        if (!field.hasAttribute('required')) return true;
        
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            return false;
        }
        
        if (field.type === 'email' && field.value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(field.value)) {
                showFieldError(field, 'Please enter a valid email address');
                return false;
            }
        }
        
        clearFieldError(field);
        return true;
    }
    
    function validateTerms() {
        if (termsCheckbox.checked) {
            clearTermsError();
            return true;
        }
        return false;
    }
    
    // ============================================
    // ERROR HANDLING
    // ============================================
    function showFieldError(field, message) {
        const fieldContainer = field.closest('.form-field');
        if (!fieldContainer) return;
        
        fieldContainer.classList.add('has-error');
        
        let errorElement = fieldContainer.querySelector('.field-error');
        if (!errorElement) {
            errorElement = document.createElement('div');
            errorElement.className = 'field-error';
            fieldContainer.appendChild(errorElement);
        }
        
        errorElement.innerHTML = `
            <i class="fas fa-exclamation-circle"></i>
            <span>${message}</span>
        `;
        
        field.focus();
    }
    
    function clearFieldError(field) {
        const fieldContainer = field.closest('.form-field');
        if (!fieldContainer) return;
        
        fieldContainer.classList.remove('has-error');
        
        const errorElement = fieldContainer.querySelector('.field-error');
        if (errorElement) {
            errorElement.remove();
        }
    }
    
    function showTermsError(message) {
        if (termsError) {
            termsError.textContent = message;
            termsError.style.opacity = '1';
        }
    }
    
    function clearTermsError() {
        if (termsError) {
            termsError.textContent = '';
            termsError.style.opacity = '0';
        }
    }
    
    // ============================================
    // ANIMATIONS & EFFECTS
    // ============================================
    function shakeForm() {
        form.classList.add('shake');
        setTimeout(() => form.classList.remove('shake'), 500);
    }
    
    function shakeElement(element) {
        element.classList.add('shake');
        setTimeout(() => element.classList.remove('shake'), 500);
    }
    
    function setupInputAnimations() {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }
    
    // ============================================
    // PASSWORD STRENGTH
    // ============================================
    function setupPasswordStrength() {
        if (!passwordField) return;
        
        passwordField.addEventListener('input', updatePasswordStrength);
        passwordField.addEventListener('blur', finalizePasswordStrength);
    }
    
    function updatePasswordStrength() {
        const password = passwordField.value;
        const strength = calculatePasswordStrength(password);
        updateStrengthDisplay(strength);
    }
    
    function calculatePasswordStrength(password) {
        let strength = 0;
        
        // Length check
        if (password.length >= 8) strength += 1;
        if (password.length >= 12) strength += 2;
        
        // Character diversity
        if (/[a-z]/.test(password)) strength += 1;
        if (/[A-Z]/.test(password)) strength += 1;
        if (/[0-9]/.test(password)) strength += 1;
        if (/[^a-zA-Z0-9]/.test(password)) strength += 2;
        
        return Math.min(strength, 4);
    }
    
    function updateStrengthDisplay(strength) {
        const segments = document.querySelectorAll('.strength-segment');
        const textElement = document.querySelector('.strength-text span');
        
        if (!segments.length || !textElement) return;
        
        const strengthLabels = ['None', 'Weak', 'Fair', 'Good', 'Strong'];
        const strengthColors = ['#e2e8f0', '#ef4444', '#f59e0b', '#3b82f6', '#10b981'];
        
        segments.forEach((segment, index) => {
            if (index < strength) {
                segment.style.background = strengthColors[strength];
                segment.style.transform = 'scaleY(1.2)';
            } else {
                segment.style.background = '#e2e8f0';
                segment.style.transform = 'scaleY(1)';
            }
        });
        
        textElement.textContent = strengthLabels[strength];
        textElement.style.color = strengthColors[strength];
    }
    
    function resetPasswordStrength() {
        updateStrengthDisplay(0);
    }
    
    function finalizePasswordStrength() {
        if (!passwordField.value) {
            resetPasswordStrength();
        }
    }
    
    // ============================================
    // SOCIAL LOGIN
    // ============================================
    function handleSocialLogin(e) {
        const button = e.currentTarget;
        const provider = button.classList.contains('google') ? 'Google' :
                        button.classList.contains('github') ? 'GitHub' : 'Twitter';
        
        console.log(`Social login with ${provider}`);
        
        // Add loading effect
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
        
        // Simulate API call
        setTimeout(() => {
            alert(`Redirecting to ${provider} authentication...`);
            button.style.opacity = '1';
            button.style.pointerEvents = 'auto';
        }, 1000);
    }
    
    // ============================================
    // DEBUG INFO
    // ============================================
    console.log('Event listeners attached:');
    console.log('- Submit button:', submitButton.hasAttribute('data-listener-attached'));
    console.log('- Sign in link:', signinLink.hasAttribute('data-listener-attached'));
    console.log('- Form:', form.hasAttribute('data-listener-attached'));
    
    // Mark elements as initialized
    submitButton.setAttribute('data-listener-attached', 'true');
    signinLink.setAttribute('data-listener-attached', 'true');
    form.setAttribute('data-listener-attached', 'true');
    
    // Add debug styles
    const debugStyle = document.createElement('style');
    debugStyle.textContent = `
        #submitButton:active {
            transform: scale(0.98) !important;
        }
        
        #signinLink:active {
            opacity: 0.5 !important;
        }
        
        .debug-active {
            outline: 2px solid #10b981 !important;
        }
    `;
    document.head.appendChild(debugStyle);
    
    // Test functionality
    setTimeout(() => {
        console.log('Signup page ready - buttons should work');
        console.log('Test: Click the Sign Up or Sign In buttons');
    }, 100);
});

// Fallback for DOMContentLoaded issues
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
        console.log('DOMContentLoaded fired');
    });
} else {
    console.log('DOM already loaded, running scripts immediately');
    // Trigger initialization
    if (typeof initForm === 'function') {
        initForm();
    }
}

// Global error handling
window.addEventListener('error', function(e) {
    console.error('JavaScript error:', e.message);
    console.error('At:', e.filename, 'line', e.lineno);
});

// Ensure buttons work even if JavaScript partially fails
window.addEventListener('load', function() {
    console.log('Page fully loaded - ensuring button functionality');
    
    // Emergency fallback for submit button
    const emergencyButton = document.getElementById('submitButton');
    if (emergencyButton && !emergencyButton.hasAttribute('data-emergency-fixed')) {
        emergencyButton.setAttribute('data-emergency-fixed', 'true');
        emergencyButton.onclick = function(e) {
            console.log('EMERGENCY: Submit button clicked');
            document.getElementById('signupForm').submit();
            return false;
        };
    }
    
    // Emergency fallback for sign in link
    const emergencyLink = document.getElementById('signinLink');
    if (emergencyLink && !emergencyLink.hasAttribute('data-emergency-fixed')) {
        emergencyLink.setAttribute('data-emergency-fixed', 'true');
        emergencyLink.onclick = function(e) {
            console.log('EMERGENCY: Sign in link clicked');
            window.location.href = this.getAttribute('href');
            return false;
        };
    }
});