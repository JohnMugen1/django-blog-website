// Post Form - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // Initialize Elements
    // ===========================================
    const form = document.getElementById('postForm');
    const previewBtn = document.getElementById('previewBtn');
    const previewModal = document.getElementById('previewModal');
    const closePreview = document.getElementById('closePreview');
    const editPreview = document.getElementById('editPreview');
    const publishPreview = document.getElementById('publishPreview');
    const helpBtn = document.getElementById('helpBtn');
    const helpModal = document.getElementById('helpModal');
    const closeHelp = document.getElementById('closeHelp');
    const submitBtn = form?.querySelector('.submit-btn');
    const submitOverlay = form?.querySelector('.submit-overlay');
    
    // ===========================================
    // Form Field Management
    // ===========================================
    const titleInput = form?.querySelector('input[type="text"]');
    const bodyTextarea = form?.querySelector('textarea');
    const wordCountEl = document.getElementById('wordCount');
    const charCountEl = document.getElementById('charCount');
    
    // Word and Character Counting
    if (bodyTextarea) {
        function updateCounts() {
            const text = bodyTextarea.value;
            const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            const chars = text.length;
            
            if (wordCountEl) wordCountEl.textContent = words;
            if (charCountEl) charCountEl.textContent = chars.toLocaleString();
            
            // Update preview if modal is open
            const previewWordCount = document.getElementById('previewWordCount');
            if (previewWordCount) {
                previewWordCount.textContent = words.toLocaleString();
            }
        }
        
        bodyTextarea.addEventListener('input', updateCounts);
        bodyTextarea.addEventListener('change', updateCounts);
        
        // Initialize counts
        updateCounts();
    }
    
    // Character Counter for Title
    if (titleInput) {
        const charCounter = titleInput.closest('.form-field-group')?.querySelector('.char-counter');
        
        titleInput.addEventListener('input', function() {
            const maxLength = this.maxLength || 200;
            const currentLength = this.value.length;
            const percentage = (currentLength / maxLength) * 100;
            
            if (charCounter) {
                charCounter.classList.add('visible');
                const counterText = charCounter.querySelector('.counter-text');
                const counterFill = charCounter.querySelector('.counter-fill');
                
                if (counterText) {
                    counterText.textContent = `${currentLength}/${maxLength}`;
                }
                
                if (counterFill) {
                    counterFill.style.width = `${percentage}%`;
                    
                    // Change color based on percentage
                    if (percentage > 90) {
                        counterFill.style.background = 'var(--form-gradient-error)';
                    } else if (percentage > 75) {
                        counterFill.style.background = 'var(--form-gradient-secondary)';
                    } else {
                        counterFill.style.background = 'var(--form-gradient-primary)';
                    }
                }
            }
        });
        
        // Trigger on load if there's existing content
        if (titleInput.value) {
            titleInput.dispatchEvent(new Event('input'));
        }
    }
    
    // ===========================================
    // Preview Functionality
    // ===========================================
    if (previewBtn && previewModal) {
        previewBtn.addEventListener('click', function() {
            const title = titleInput?.value || 'Your Title Here';
            const body = bodyTextarea?.value || 'Your content will appear here...';
            const wordCount = bodyTextarea ? (bodyTextarea.value.trim() === '' ? 0 : bodyTextarea.value.trim().split(/\s+/).length) : 0;
            
            // Update preview content
            const previewTitle = document.getElementById('previewTitle');
            const previewBody = document.getElementById('previewBody');
            const previewWordCount = document.getElementById('previewWordCount');
            
            if (previewTitle) {
                previewTitle.textContent = title || 'Your Title Here';
            }
            
            if (previewBody) {
                // Simple formatting for preview
                const formattedBody = body
                    .split('\n')
                    .map(paragraph => `<p>${paragraph || '&nbsp;'}</p>`)
                    .join('');
                previewBody.innerHTML = formattedBody;
            }
            
            if (previewWordCount) {
                previewWordCount.textContent = wordCount.toLocaleString();
            }
            
            // Show modal
            previewModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }
    
    if (closePreview) {
        closePreview.addEventListener('click', function() {
            previewModal.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
    
    if (editPreview) {
        editPreview.addEventListener('click', function() {
            previewModal.classList.remove('active');
            document.body.style.overflow = '';
            
            // Focus on title input
            if (titleInput) {
                titleInput.focus();
            }
        });
    }
    
    if (publishPreview) {
        publishPreview.addEventListener('click', function() {
            // Simulate form submission
            if (form) {
                previewModal.classList.remove('active');
                document.body.style.overflow = '';
                
                // Show submitting state
                if (submitBtn && submitOverlay) {
                    submitBtn.disabled = true;
                    setTimeout(() => {
                        form.submit();
                    }, 1000);
                }
            }
        });
    }
    
    // Close modal on escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && previewModal.classList.contains('active')) {
            previewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // Close modal when clicking outside
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
    
    // ===========================================
    // Form Submission
    // ===========================================
    if (form && submitBtn && submitOverlay) {
        form.addEventListener('submit', function(e) {
            // Basic validation
            const title = titleInput?.value?.trim();
            const body = bodyTextarea?.value?.trim();
            
            let isValid = true;
            let errorMessage = '';
            
            if (!title) {
                isValid = false;
                errorMessage = 'Title is required';
                if (titleInput) {
                    titleInput.focus();
                    titleInput.style.borderColor = 'var(--form-error)';
                }
            } else if (title.length < 5) {
                isValid = false;
                errorMessage = 'Title must be at least 5 characters';
                if (titleInput) {
                    titleInput.focus();
                    titleInput.style.borderColor = 'var(--form-error)';
                }
            } else if (!body) {
                isValid = false;
                errorMessage = 'Content is required';
                if (bodyTextarea) {
                    bodyTextarea.focus();
                    bodyTextarea.style.borderColor = 'var(--form-error)';
                }
            } else if (body.length < 50) {
                isValid = false;
                errorMessage = 'Content must be at least 50 characters';
                if (bodyTextarea) {
                    bodyTextarea.focus();
                    bodyTextarea.style.borderColor = 'var(--form-error)';
                }
            }
            
            if (!isValid) {
                e.preventDefault();
                showNotification(errorMessage, 'error');
                return false;
            }
            
            // Show submitting state
            submitBtn.disabled = true;
            submitBtn.value = 'Publishing...';
            
            // Show overlay
            setTimeout(() => {
                submitOverlay.style.opacity = '1';
                submitOverlay.style.visibility = 'visible';
            }, 300);
            
            // Show success notification
            showNotification('Publishing your post...', 'success');
        });
    }
    
    // ===========================================
    // Help Modal
    // ===========================================
    if (helpBtn && helpModal) {
        helpBtn.addEventListener('click', function() {
            helpModal.classList.toggle('active');
        });
        
        // Position help modal above FAB
        const updateHelpModalPosition = () => {
            const fabRect = helpBtn.getBoundingClientRect();
            helpModal.style.bottom = `${fabRect.height + 20}px`;
        };
        
        updateHelpModalPosition();
        window.addEventListener('resize', updateHelpModalPosition);
    }
    
    if (closeHelp) {
        closeHelp.addEventListener('click', function() {
            helpModal.classList.remove('active');
        });
    }
    
    // Close help modal when clicking outside
    document.addEventListener('click', function(e) {
        if (!helpModal.contains(e.target) && !helpBtn.contains(e.target) && helpModal.classList.contains('active')) {
            helpModal.classList.remove('active');
        }
    });
    
    // ===========================================
    // Form Auto-save Simulation
    // ===========================================
    let autoSaveTimeout;
    const formStatus = document.querySelector('.form-status');
    const statusText = formStatus?.querySelector('.status-text');
    const statusTime = formStatus?.querySelector('.status-time');
    
    function simulateAutoSave() {
        if (formStatus && statusText && statusTime) {
            formStatus.style.opacity = '1';
            statusText.textContent = 'Draft saved';
            
            // Update time
            const now = new Date();
            const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            statusTime.textContent = timeString;
            
            // Pulse animation
            formStatus.style.animation = 'none';
            setTimeout(() => {
                formStatus.style.animation = 'savePulse 0.6s ease';
            }, 10);
            
            // Fade out after 3 seconds
            setTimeout(() => {
                formStatus.style.opacity = '0.6';
            }, 3000);
        }
    }
    
    // Auto-save on input (debounced)
    if (form) {
        form.addEventListener('input', function() {
            clearTimeout(autoSaveTimeout);
            autoSaveTimeout = setTimeout(simulateAutoSave, 2000);
        });
        
        // Initial auto-save
        setTimeout(simulateAutoSave, 1000);
    }
    
    // Add save pulse animation
    const savePulseStyle = document.createElement('style');
    savePulseStyle.textContent = `
        @keyframes savePulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(savePulseStyle);
    
    // ===========================================
    // Form Field Focus Effects
    // ===========================================
    const formInputs = form?.querySelectorAll('input, textarea, select');
    
    if (formInputs) {
        formInputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
                this.style.borderColor = 'var(--form-primary)';
                
                // Add ripple effect
                const ripple = document.createElement('span');
                ripple.className = 'input-ripple';
                this.parentElement.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
                if (!this.value && !this.classList.contains('invalid')) {
                    this.style.borderColor = '';
                }
            });
            
            // Validate on blur
            input.addEventListener('blur', function() {
                if (this.required && !this.value.trim()) {
                    this.classList.add('invalid');
                    this.style.borderColor = 'var(--form-error)';
                    showNotification(`${this.name || 'Field'} is required`, 'error');
                } else {
                    this.classList.remove('invalid');
                    if (this.checkValidity()) {
                        this.style.borderColor = 'var(--form-success)';
                        setTimeout(() => {
                            if (document.activeElement !== this) {
                                this.style.borderColor = '';
                            }
                        }, 1000);
                    }
                }
            });
        });
    }
    
    // ===========================================
    // Notification System
    // ===========================================
    function showNotification(message, type = 'info') {
        // Create notification container if it doesn't exist
        let notificationContainer = document.querySelector('.notification-container');
        if (!notificationContainer) {
            notificationContainer = document.createElement('div');
            notificationContainer.className = 'notification-container';
            notificationContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(notificationContainer);
        }
        
        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            background: white;
            color: var(--text);
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
            display: flex;
            align-items: center;
            gap: 0.75rem;
            animation: slideInRight 0.3s ease, fadeOut 0.3s ease 2.7s forwards;
            border-left: 4px solid var(--form-${type});
            min-width: 300px;
            max-width: 400px;
        `;
        
        // Add icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}" style="color: var(--form-${type}); font-size: 1.2rem;"></i>
            <span style="flex: 1;">${message}</span>
            <button class="notification-close" style="background: none; border: none; color: var(--text-light); cursor: pointer; font-size: 1.1rem;">
                <i class="fas fa-times"></i>
            </button>
        `;
        
        // Add to container
        notificationContainer.appendChild(notification);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.animation = 'fadeOut 0.3s ease forwards';
            setTimeout(() => {
                notification.remove();
            }, 300);
        });
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            }
        }, 3000);
        
        // Add notification animations
        if (!document.querySelector('#notification-animations')) {
            const notificationStyle = document.createElement('style');
            notificationStyle.id = 'notification-animations';
            notificationStyle.textContent = `
                @keyframes slideInRight {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes fadeOut {
                    from {
                        opacity: 1;
                        transform: translateX(0);
                    }
                    to {
                        opacity: 0;
                        transform: translateX(100%);
                    }
                }
            `;
            document.head.appendChild(notificationStyle);
        }
        
        // Add input ripple animation
        if (!document.querySelector('#input-ripple-animation')) {
            const rippleStyle = document.createElement('style');
            rippleStyle.id = 'input-ripple-animation';
            rippleStyle.textContent = `
                .input-ripple {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    width: 0;
                    height: 0;
                    border-radius: 50%;
                    background: rgba(99, 102, 241, 0.2);
                    transform: translate(-50%, -50%);
                    animation: rippleExpand 0.6s ease-out;
                    pointer-events: none;
                }
                
                @keyframes rippleExpand {
                    to {
                        width: 300px;
                        height: 300px;
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(rippleStyle);
        }
    }
    
    // ===========================================
    // Keyboard Shortcuts
    // ===========================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + S to save draft
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            simulateAutoSave();
            showNotification('Draft saved', 'success');
        }
        
        // Ctrl/Cmd + P to preview
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            if (previewBtn) previewBtn.click();
        }
        
        // Escape to close modals
        if (e.key === 'Escape') {
            if (previewModal.classList.contains('active')) {
                previewModal.classList.remove('active');
                document.body.style.overflow = '';
            }
            if (helpModal.classList.contains('active')) {
                helpModal.classList.remove('active');
            }
        }
    });
    
    // ===========================================
    // Progress Steps Animation
    // ===========================================
    const progressSteps = document.querySelectorAll('.step');
    let currentStep = 0;
    
    function updateProgressSteps() {
        progressSteps.forEach((step, index) => {
            if (index <= currentStep) {
                step.classList.add('active');
            } else {
                step.classList.remove('active');
            }
        });
        
        // Animate step activation
        if (progressSteps[currentStep]) {
            progressSteps[currentStep].style.animation = 'stepActivate 0.6s ease';
            setTimeout(() => {
                progressSteps[currentStep].style.animation = '';
            }, 600);
        }
    }
    
    // Add step activation animation
    if (!document.querySelector('#step-animation')) {
        const stepStyle = document.createElement('style');
        stepStyle.id = 'step-animation';
        stepStyle.textContent = `
            @keyframes stepActivate {
                0% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.2);
                }
                100% {
                    transform: scale(1.1);
                }
            }
        `;
        document.head.appendChild(stepStyle);
    }
    
    // Simulate step progression based on form interaction
    if (titleInput) {
        titleInput.addEventListener('blur', function() {
            if (this.value.trim().length >= 5 && currentStep < 1) {
                currentStep = 1;
                updateProgressSteps();
            }
        });
    }
    
    if (bodyTextarea) {
        bodyTextarea.addEventListener('blur', function() {
            if (this.value.trim().length >= 50 && currentStep < 2) {
                currentStep = 2;
                updateProgressSteps();
            }
        });
    }
    
    // Initialize progress steps
    updateProgressSteps();
    
    // ===========================================
    // Form Validation on Submit
    // ===========================================
    function validateForm() {
        let isValid = true;
        const errors = [];
        
        if (titleInput && (!titleInput.value || titleInput.value.trim().length < 5)) {
            isValid = false;
            errors.push('Title must be at least 5 characters');
            titleInput.classList.add('invalid');
        }
        
        if (bodyTextarea && (!bodyTextarea.value || bodyTextarea.value.trim().length < 50)) {
            isValid = false;
            errors.push('Content must be at least 50 characters');
            bodyTextarea.classList.add('invalid');
        }
        
        if (!isValid) {
            showNotification(errors.join('. '), 'error');
        }
        
        return isValid;
    }
    
    // Attach validation to form submit
    if (form) {
        form.addEventListener('submit', function(e) {
            if (!validateForm()) {
                e.preventDefault();
                return false;
            }
        });
    }
});