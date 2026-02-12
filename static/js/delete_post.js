// delete_post.js - Complete and Fixed JavaScript
document.addEventListener('DOMContentLoaded', function() {
    console.log('Delete post script loaded');
    
    // Get all required elements
    const deleteBtn = document.getElementById('deleteBtn');
    const thinkAgainBtn = document.getElementById('thinkAgainBtn');
    const confirmationStep = document.getElementById('confirmationStep');
    const confirmInput = document.getElementById('confirmInput');
    const finalDeleteBtn = document.getElementById('finalDeleteBtn');
    const cancelConfirmBtn = document.getElementById('cancelConfirm');
    const successModal = document.getElementById('successModal');
    const deleteForm = document.querySelector('.delete-form');
    
    // Debug logging
    console.log('Elements found:', {
        deleteBtn: !!deleteBtn,
        thinkAgainBtn: !!thinkAgainBtn,
        confirmationStep: !!confirmationStep,
        confirmInput: !!confirmInput,
        finalDeleteBtn: !!finalDeleteBtn,
        cancelConfirmBtn: !!cancelConfirmBtn,
        deleteForm: !!deleteForm
    });
    
    // Add dynamic styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        @keyframes slideDown { from { transform: translateY(-20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }
        @keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-5px); } 75% { transform: translateX(5px); } }
        .reconsider-modal { position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.9); display: flex; align-items: center; justify-content: center; z-index: 1001; animation: fadeIn 0.3s ease; backdrop-filter: blur(10px); }
        .reconsider-content { background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%); border-radius: 24px; padding: 3rem; max-width: 500px; width: 90%; border: 2px solid #475569; box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5); animation: scaleIn 0.4s cubic-bezier(0.4, 0, 0.2, 1); position: relative; }
        .close-reconsider { position: absolute; top: 1rem; right: 1rem; background: none; border: none; color: #94a3b8; font-size: 2rem; cursor: pointer; width: 40px; height: 40px; border-radius: 50%; display: flex; align-items: center; justify-content: center; transition: all 0.3s ease; }
        .close-reconsider:hover { color: #fbbf24; background: rgba(251, 191, 36, 0.1); transform: rotate(90deg); }
        .reconsider-list li { padding: 1rem; margin-bottom: 0.75rem; background: rgba(255, 255, 255, 0.05); border-radius: 10px; color: #e2e8f0; display: flex; align-items: center; gap: 1rem; animation: slideDown 0.3s ease-out; animation-fill-mode: both; }
        .reconsider-buttons { display: flex; gap: 1rem; margin-top: 2rem; }
        .btn-reconsider { flex: 1; padding: 1rem 1.5rem; border: none; border-radius: 10px; font-weight: 600; cursor: pointer; transition: all 0.3s ease; }
        .btn-reconsider-continue { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; }
        .btn-reconsider-keep { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; }
        @keyframes fadeOut { from { opacity: 1; } to { opacity: 0; } }
    `;
    document.head.appendChild(style);
    
    // Main delete button - shows confirmation step
    if (deleteBtn) {
        console.log('Setting up delete button');
        deleteBtn.addEventListener('click', function(e) {
            console.log('Delete button clicked');
            e.preventDefault(); // CRITICAL: Prevent form submission
            e.stopPropagation();
            
            // Show loading effect
            const originalText = this.querySelector('.btn-text').textContent;
            this.querySelector('.btn-text').textContent = 'Loading...';
            this.disabled = true;
            
            setTimeout(() => {
                this.querySelector('.btn-text').textContent = originalText;
                this.disabled = false;
                showConfirmationStep();
            }, 500);
        });
    } else {
        console.error('Delete button not found!');
    }
    
    // Think Again button - shows reconsider modal
    if (thinkAgainBtn) {
        console.log('Setting up think again button');
        thinkAgainBtn.addEventListener('click', function(e) {
            console.log('Think again button clicked');
            e.preventDefault();
            e.stopPropagation();
            createReconsiderModal();
        });
    }
    
    // Confirmation input validation
    if (confirmInput && finalDeleteBtn) {
        console.log('Setting up confirmation input');
        confirmInput.addEventListener('input', function() {
            const inputValue = this.value.trim().toUpperCase();
            const isConfirmed = inputValue === 'DELETE';
            
            finalDeleteBtn.disabled = !isConfirmed;
            
            if (isConfirmed) {
                this.style.borderColor = '#10b981';
                this.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.3)';
                createConfettiEffect();
            } else {
                this.style.borderColor = '#475569';
                this.style.boxShadow = 'none';
            }
        });
        
        // Final delete button handler
        finalDeleteBtn.addEventListener('click', function(e) {
            if (!this.disabled) {
                console.log('Final delete clicked');
                e.preventDefault();
                simulateDeletion();
            }
        });
    }
    
    // Cancel confirmation button
    if (cancelConfirmBtn) {
        cancelConfirmBtn.addEventListener('click', function(e) {
            e.preventDefault();
            hideConfirmationStep();
        });
    }
    
    // Escape key handler
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const modal = document.querySelector('.reconsider-modal');
            if (modal) {
                closeModal(modal);
            }
        }
    });
    
    // Helper Functions
    function showConfirmationStep() {
        console.log('Showing confirmation step');
        const buttonGroup = document.querySelector('.button-group');
        if (!buttonGroup || !confirmationStep) {
            console.error('Required elements not found for confirmation step');
            return;
        }
        
        // Hide button group with animation
        buttonGroup.style.opacity = '0';
        buttonGroup.style.transform = 'translateY(20px)';
        buttonGroup.style.pointerEvents = 'none';
        
        setTimeout(() => {
            buttonGroup.style.display = 'none';
            confirmationStep.style.display = 'block';
            
            setTimeout(() => {
                confirmationStep.style.opacity = '1';
                confirmationStep.style.transform = 'translateY(0)';
                
                // Focus on confirmation input
                if (confirmInput) {
                    confirmInput.focus();
                }
            }, 10);
        }, 300);
    }
    
    function hideConfirmationStep() {
        console.log('Hiding confirmation step');
        if (!confirmationStep) return;
        
        confirmationStep.style.opacity = '0';
        confirmationStep.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            confirmationStep.style.display = 'none';
            
            // Show button group again
            const buttonGroup = document.querySelector('.button-group');
            if (buttonGroup) {
                buttonGroup.style.display = 'flex';
                buttonGroup.style.opacity = '0';
                buttonGroup.style.transform = 'translateY(20px)';
                
                setTimeout(() => {
                    buttonGroup.style.opacity = '1';
                    buttonGroup.style.transform = 'translateY(0)';
                    buttonGroup.style.pointerEvents = 'all';
                }, 10);
            }
            
            // Clear confirmation input
            if (confirmInput) {
                confirmInput.value = '';
                confirmInput.style.borderColor = '#475569';
                confirmInput.style.boxShadow = 'none';
            }
            
            if (finalDeleteBtn) {
                finalDeleteBtn.disabled = true;
                finalDeleteBtn.innerHTML = '<span class="btn-icon">🗑️</span><span class="btn-text">Yes, Delete Permanently</span><span class="btn-hover-effect"></span>';
            }
        }, 300);
    }
    
    function createReconsiderModal() {
        console.log('Creating reconsider modal');
        
        // Remove any existing modal
        const existingModal = document.querySelector('.reconsider-modal');
        if (existingModal) {
            existingModal.remove();
        }
        
        const modal = document.createElement('div');
        modal.className = 'reconsider-modal';
        
        modal.innerHTML = `
            <div class="reconsider-content">
                <button class="close-reconsider" title="Close">&times;</button>
                <div style="text-align: center; margin-bottom: 2rem;">
                    <div style="font-size: 4rem; margin-bottom: 1rem; animation: float 3s ease-in-out infinite;">🤔</div>
                    <h3 style="color: #fbbf24; font-size: 2rem; margin-bottom: 0.5rem; font-weight: 800;">Think Again!</h3>
                    <p style="color: #94a3b8; font-size: 1.1rem;">Consider these points before deleting</p>
                </div>
                
                <ul class="reconsider-list">
                    <li style="animation-delay: 0.1s"><span style="font-size: 1.5rem">📊</span><span>This post has valuable engagement metrics</span></li>
                    <li style="animation-delay: 0.2s"><span style="font-size: 1.5rem">💬</span><span>There might be important user comments</span></li>
                    <li style="animation-delay: 0.3s"><span style="font-size: 1.5rem">🔗</span><span>External websites could be linking to it</span></li>
                    <li style="animation-delay: 0.4s"><span style="font-size: 1.5rem">📈</span><span>It contributes to your content SEO</span></li>
                    <li style="animation-delay: 0.5s"><span style="font-size: 1.5rem">🔄</span><span>You can edit instead of deleting</span></li>
                    <li style="animation-delay: 0.6s"><span style="font-size: 1.5rem">🏆</span><span>It represents your work and effort</span></li>
                </ul>
                
                <div class="reconsider-buttons">
                    <button class="btn-reconsider btn-reconsider-keep">Keep This Post</button>
                    <button class="btn-reconsider btn-reconsider-continue">Continue to Delete</button>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Add event listeners
        modal.querySelector('.close-reconsider').addEventListener('click', () => closeModal(modal));
        modal.querySelector('.btn-reconsider-keep').addEventListener('click', () => {
            closeModal(modal);
            showKeepMessage();
        });
        modal.querySelector('.btn-reconsider-continue').addEventListener('click', () => {
            closeModal(modal);
            showConfirmationStep();
        });
        
        // Close when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }
    
    function closeModal(modal) {
        modal.style.opacity = '0';
        modal.style.transform = 'scale(0.9)';
        setTimeout(() => {
            modal.remove();
        }, 300);
    }
    
    function showKeepMessage() {
        const message = document.createElement('div');
        message.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
            color: white;
            padding: 1rem 2rem;
            border-radius: 12px;
            box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
            z-index: 1001;
            animation: slideDown 0.3s ease;
            display: flex;
            align-items: center;
            gap: 0.75rem;
            font-weight: 600;
        `;
        
        message.innerHTML = `<span>🎉</span><span>Great decision! Post kept safe.</span>`;
        document.body.appendChild(message);
        
        setTimeout(() => {
            message.style.opacity = '0';
            message.style.transform = 'translateX(100px)';
            setTimeout(() => message.remove(), 300);
        }, 3000);
    }
    
    function simulateDeletion() {
        console.log('Simulating deletion');
        
        // Show progress bar
        const progressBar = document.createElement('div');
        progressBar.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 4px;
            background: linear-gradient(90deg, #ef4444, #dc2626);
            z-index: 1002;
            transition: width 2s ease;
        `;
        document.body.appendChild(progressBar);
        
        // Start progress
        setTimeout(() => progressBar.style.width = '100%', 100);
        
        // Update button text to show progress
        const steps = [
            { time: 500, text: 'Preparing deletion...' },
            { time: 1000, text: 'Removing from database...' },
            { time: 1500, text: 'Cleaning up...' },
            { time: 2000, text: 'Finalizing...' }
        ];
        
        steps.forEach(step => {
            setTimeout(() => {
                if (finalDeleteBtn) {
                    finalDeleteBtn.innerHTML = `<span style="color: white;">${step.text}</span>`;
                }
            }, step.time);
        });
        
        // Submit form after animation
        setTimeout(() => {
            progressBar.remove();
            if (deleteForm) {
                console.log('Submitting form');
                deleteForm.submit();
            }
        }, 2500);
    }
    
    function createConfettiEffect() {
        for (let i = 0; i < 20; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 10px;
                height: 10px;
                background: ${['#ef4444', '#fbbf24', '#10b981', '#3b82f6'][Math.floor(Math.random() * 4)]};
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                z-index: 1000;
                top: ${window.innerHeight}px;
                left: ${Math.random() * window.innerWidth}px;
                pointer-events: none;
            `;
            
            document.body.appendChild(confetti);
            
            confetti.animate([
                { transform: 'translate(0, 0)', opacity: 1 },
                { transform: `translate(${Math.random() * 200 - 100}px, -${Math.random() * 300}px)`, opacity: 0.7 },
                { transform: `translate(${Math.random() * 400 - 200}px, -${Math.random() * 600}px)`, opacity: 0 }
            ], {
                duration: 1500,
                easing: 'cubic-bezier(0.215, 0.610, 0.355, 1)'
            }).onfinish = () => confetti.remove();
        }
    }
    
    // Word count calculation
    function calculateWordCount() {
        const excerptElement = document.querySelector('.post-excerpt');
        if (excerptElement) {
            const text = excerptElement.textContent || excerptElement.innerText;
            const words = text.trim().split(/\s+/).filter(word => word.length > 0);
            const count = words.length;
            
            // Update display
            const wordCountElement = document.querySelector('.stat-text');
            if (wordCountElement && wordCountElement.textContent.includes('Content:')) {
                wordCountElement.textContent = `Content: ${count} words`;
            }
        }
    }
    
    // Initialize
    calculateWordCount();
    console.log('Script initialization complete');
});