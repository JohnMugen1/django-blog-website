// Blog Posts Page - Interactive Features
document.querySelectorAll('.read-time').forEach(element => {
    const wordCount = parseInt(element.dataset.words) || 0;
    const minutes = Math.max(1, Math.ceil(wordCount / 200));
    element.textContent = `${minutes} min read`;
});

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // Loading Overlay
    // ===========================================
    const loadingOverlay = document.getElementById('loadingOverlay');
    
    // Show loading overlay initially
    if (loadingOverlay) {
        loadingOverlay.classList.add('active');
        
        // Hide loading after content loads
        window.addEventListener('load', () => {
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
            }, 500);
        });
        
        // Fallback in case load event doesn't fire
        setTimeout(() => {
            loadingOverlay.classList.remove('active');
        }, 2000);
    }
    
    // ===========================================
    // Filter Posts Functionality
    // ===========================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const postCards = document.querySelectorAll('.post-card');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            const filter = this.dataset.filter;
            
            // Filter posts with animation
            postCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'flex';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
            
            // Show empty state if no posts after filtering
            setTimeout(() => {
                const visibleCards = document.querySelectorAll('.post-card[style*="display: flex"]');
                const noPostsContainer = document.querySelector('.no-posts-container');
                
                if (noPostsContainer && visibleCards.length === 0 && filter !== 'all') {
                    const emptyState = noPostsContainer.querySelector('.empty-state');
                    if (emptyState) {
                        emptyState.querySelector('.empty-state-title').textContent = 'No Posts Found';
                        emptyState.querySelector('.empty-state-description').textContent = 'Try a different filter or create a new post.';
                    }
                    noPostsContainer.style.display = 'flex';
                } else if (noPostsContainer) {
                    noPostsContainer.style.display = 'none';
                }
            }, 350);
        });
    });
    
    // ===========================================
    // Scroll to Top Button
    // ===========================================
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    
    if (scrollTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollTopBtn.classList.add('visible');
            } else {
                scrollTopBtn.classList.remove('visible');
            }
        });
        
        scrollTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===========================================
    // Card Bookmark Functionality
    // ===========================================
    const bookmarkButtons = document.querySelectorAll('.card-action-btn[aria-label="Bookmark"]');
    
    bookmarkButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far', 'fa-bookmark');
                icon.classList.add('fas', 'fa-bookmark');
                this.style.color = 'var(--post-primary)';
                
                // Show notification
                showNotification('Post bookmarked!', 'success');
            } else {
                icon.classList.remove('fas', 'fa-bookmark');
                icon.classList.add('far', 'fa-bookmark');
                this.style.color = '';
                
                showNotification('Bookmark removed', 'info');
            }
        });
    });
    
    // ===========================================
    // Card Share Functionality
    // ===========================================
    const shareButtons = document.querySelectorAll('.card-action-btn[aria-label="Share"]');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const postCard = this.closest('.post-card');
            const postTitle = postCard.querySelector('.title-text').textContent;
            const postUrl = window.location.href;
            
            if (navigator.share) {
                navigator.share({
                    title: postTitle,
                    url: postUrl
                });
            } else {
                // Fallback: Copy to clipboard
                navigator.clipboard.writeText(`${postTitle} - ${postUrl}`).then(() => {
                    showNotification('Link copied to clipboard!', 'success');
                });
            }
        });
    });
    
    // ===========================================
    // Like Post Functionality
    // ===========================================
    const likeButtons = document.querySelectorAll('.footer-text:nth-child(2)');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.color = 'var(--post-primary)';
                
                // Animate the heart
                icon.style.animation = 'heartBeat 0.6s ease';
                setTimeout(() => {
                    icon.style.animation = '';
                }, 600);
                
                showNotification('Post liked!', 'success');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.color = '';
                
                showNotification('Like removed', 'info');
            }
        });
    });
    
    // Add heart beat animation
    const heartBeatStyle = document.createElement('style');
    heartBeatStyle.textContent = `
        @keyframes heartBeat {
            0% { transform: scale(1); }
            25% { transform: scale(1.2); }
            50% { transform: scale(1); }
            75% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(heartBeatStyle);
    
    // ===========================================
    // Hover Effects for Cards
    // ===========================================
    postCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
        
        // Click to go to detail page
        const titleLink = card.querySelector('.title-link');
        const readLink = card.querySelector('.post-link');
        
        if (titleLink && readLink) {
            const detailUrl = titleLink.getAttribute('href');
            
            card.addEventListener('click', function(e) {
                // Don't trigger if clicking on buttons or links
                if (!e.target.closest('.card-actions') && 
                    !e.target.closest('.post-link') && 
                    !e.target.closest('.title-link')) {
                    window.location.href = detailUrl;
                }
            });
        }
    });
    
    // ===========================================
    // Pagination
    // ===========================================
    const pageLinks = document.querySelectorAll('.page-link:not(.prev):not(.next):not(.active)');
    
    pageLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all pages
            document.querySelectorAll('.page-link').forEach(l => {
                l.classList.remove('active');
            });
            
            // Add active class to clicked page
            this.classList.add('active');
            
            // Simulate loading new page
            loadingOverlay.classList.add('active');
            setTimeout(() => {
                loadingOverlay.classList.remove('active');
                showNotification(`Page ${this.textContent} loaded`, 'info');
            }, 800);
        });
    });
    
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
            border-left: 4px solid var(--post-${type});
            min-width: 300px;
            max-width: 400px;
        `;
        
        // Add icon based on type
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';
        
        notification.innerHTML = `
            <i class="fas fa-${icon}" style="color: var(--post-${type}); font-size: 1.2rem;"></i>
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
        const notificationStyle = document.createElement('style');
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
        if (!document.querySelector('#notification-styles')) {
            notificationStyle.id = 'notification-styles';
            document.head.appendChild(notificationStyle);
        }
    }
    
    // ===========================================
    // Word Count Calculator
    // ===========================================
    function calculateTotalWords() {
        const wordCountElements = document.querySelectorAll('.post-card .stat:nth-child(1) span');
        let totalWords = 0;
        
        wordCountElements.forEach(element => {
            const text = element.textContent;
            const words = parseInt(text.replace(' words', '')) || 0;
            totalWords += words;
        });
        
        const totalWordsElement = document.querySelector('.stat-item:nth-child(2) .stat-number');
        if (totalWordsElement) {
            totalWordsElement.textContent = totalWords.toLocaleString();
        }
    }
    
    calculateTotalWords();
    
    // ===========================================
    // Initialize Tooltips
    // ===========================================
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function(e) {
            const tooltipText = this.getAttribute('title');
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = tooltipText;
            
            document.body.appendChild(tooltip);
            
            const rect = this.getBoundingClientRect();
            tooltip.style.position = 'fixed';
            tooltip.style.top = (rect.top - tooltip.offsetHeight - 10) + 'px';
            tooltip.style.left = (rect.left + rect.width / 2 - tooltip.offsetWidth / 2) + 'px';
            tooltip.style.zIndex = '10000';
            tooltip.style.background = 'var(--dark)';
            tooltip.style.color = 'white';
            tooltip.style.padding = '0.5rem 0.75rem';
            tooltip.style.borderRadius = '8px';
            tooltip.style.fontSize = '0.875rem';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.pointerEvents = 'none';
            tooltip.style.boxShadow = 'var(--post-shadow-sm)';
            
            this.tooltip = tooltip;
        });
        
        element.addEventListener('mouseleave', function() {
            if (this.tooltip) {
                this.tooltip.remove();
                this.tooltip = null;
            }
        });
    });
    
    // ===========================================
    // Keyboard Shortcuts
    // ===========================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + N to create new post
        if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
            e.preventDefault();
            const createBtn = document.querySelector('.create-post-btn');
            if (createBtn) {
                createBtn.click();
            }
        }
        
        // Escape to close notifications
        if (e.key === 'Escape') {
            const notifications = document.querySelectorAll('.notification');
            notifications.forEach(notification => {
                notification.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.remove();
                    }
                }, 300);
            });
        }
    });
    
    // ===========================================
    // Performance Optimization
    // ===========================================
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Recalculate layouts if needed
            AOS.refresh();
        }, 250);
    });
    
    // ===========================================
    // Lazy Load Images (if any)
    // ===========================================
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.add('loaded');
                        observer.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
});