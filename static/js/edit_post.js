// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
    // Initialize character counter
    const contentTextarea = document.querySelector('textarea');
    const charCount = document.querySelector('.char-count');
    
    if (contentTextarea && charCount) {
        updateCharCount();
        contentTextarea.addEventListener('input', updateCharCount);
        
        function updateCharCount() {
            const count = contentTextarea.value.length;
            charCount.textContent = `${count} characters`;
            
            // Add warning class if over certain limit
            if (count > 500) {
                charCount.classList.add('limit-warning');
            } else {
                charCount.classList.remove('limit-warning');
            }
        }
    }
    
    // Format buttons functionality
    const formatButtons = document.querySelectorAll('.format-btn');
    formatButtons.forEach(button => {
        button.addEventListener('click', function() {
            const format = this.dataset.format;
            const textarea = document.querySelector('textarea');
            if (!textarea) return;
            
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const selectedText = textarea.value.substring(start, end);
            let formattedText = '';
            
            switch(format) {
                case 'bold':
                    formattedText = `**${selectedText}**`;
                    break;
                case 'italic':
                    formattedText = `*${selectedText}*`;
                    break;
                case 'link':
                    formattedText = `[${selectedText}](url)`;
                    break;
            }
            
            // Insert formatted text
            const newValue = textarea.value.substring(0, start) + 
                           formattedText + 
                           textarea.value.substring(end);
            textarea.value = newValue;
            
            // Update character count
            updateCharCount();
            
            // Animate button click
            this.style.transform = 'scale(0.9)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        });
    });
    
    // Form submission animation
    const submitBtn = document.querySelector('.submit-btn');
    const editForm = document.querySelector('.edit-form');
    
    if (editForm && submitBtn) {
        editForm.addEventListener('submit', function(e) {
            // Add loading state
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            // Optional: Add slight delay to show loading animation
            setTimeout(() => {
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            }, 3000);
        });
    }
    
    // Preview functionality
    const previewModal = document.getElementById('previewModal');
    const previewBtn = document.querySelector('.preview-btn');
    const closePreviewBtn = document.querySelector('.close-preview');
    
    if (previewBtn) {
        previewBtn.addEventListener('click', previewPost);
    }
    
    if (closePreviewBtn) {
        closePreviewBtn.addEventListener('click', function() {
            previewModal.style.display = 'none';
        });
    }
    
    // Close modal when clicking outside
    previewModal.addEventListener('click', function(e) {
        if (e.target === previewModal) {
            previewModal.style.display = 'none';
        }
    });
    
    // Input focus animations
    const inputs = document.querySelectorAll('input[type="text"], textarea');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
    
    // Auto-save indicator (optional)
    let autoSaveInterval;
    const autoSaveIndicator = document.createElement('div');
    autoSaveIndicator.className = 'auto-save-indicator';
    autoSaveIndicator.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 10px 20px;
        border-radius: 25px;
        display: none;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(16, 185, 129, 0.4);
    `;
    document.body.appendChild(autoSaveIndicator);
    
    // Set up auto-save simulation
    if (editForm) {
        editForm.addEventListener('input', function() {
            clearTimeout(autoSaveInterval);
            
            autoSaveInterval = setTimeout(() => {
                showAutoSaveIndicator();
            }, 2000);
        });
    }
    
    function showAutoSaveIndicator() {
        autoSaveIndicator.textContent = '🔄 Auto-saved';
        autoSaveIndicator.style.display = 'block';
        autoSaveIndicator.style.animation = 'none';
        autoSaveIndicator.offsetHeight; // Trigger reflow
        autoSaveIndicator.style.animation = 'fadeInOut 2s ease';
        
        setTimeout(() => {
            autoSaveIndicator.style.display = 'none';
        }, 2000);
    }
    
    // Add animation for auto-save indicator
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInOut {
            0% { opacity: 0; transform: translateY(10px); }
            20% { opacity: 1; transform: translateY(0); }
            80% { opacity: 1; transform: translateY(0); }
            100% { opacity: 0; transform: translateY(-10px); }
        }
    `;
    document.head.appendChild(style);
});

// Preview post function
function previewPost() {
    const modal = document.getElementById('previewModal');
    const previewBody = document.getElementById('previewBody');
    
    // Get form data
    const formData = new FormData(document.querySelector('.edit-form'));
    let previewHTML = '';
    
    // Generate preview (simplified - you can expand this)
    formData.forEach((value, key) => {
        if (value && key !== 'csrfmiddlewaretoken') {
            previewHTML += `
                <div class="preview-item">
                    <h4>${key.charAt(0).toUpperCase() + key.slice(1)}</h4>
                    <p>${value}</p>
                </div>
            `;
        }
    });
    
    previewBody.innerHTML = previewHTML || '<p>No content to preview</p>';
    modal.style.display = 'flex';
    
    // Add entry animation
    setTimeout(() => {
        modal.style.opacity = '1';
    }, 10);
}