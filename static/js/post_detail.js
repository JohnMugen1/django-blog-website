// Post Detail Page - Interactive Features

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // Initialize Elements
    // ===========================================
    const scrollProgress = document.querySelector('.scroll-progress');
    const progressBar = document.querySelector('.progress-bar');
    const progressText = document.querySelector('.progress-text');
    const readingTimeIndicator = document.querySelector('.reading-time-indicator');
    const timeCircle = document.querySelector('.circle');
    const timeText = document.querySelector('.time-text');
    const scrollTopBtn = document.getElementById('scrollTopBtn');
    const themeToggle = document.getElementById('themeToggle');
    const fontSizeToggle = document.getElementById('fontSizeToggle');
    const tocToggle = document.getElementById('tocToggle');
    const tocContent = document.getElementById('tocContent');
    const notificationToast = document.getElementById('notificationToast');
    const copyButtons = document.querySelectorAll('.copy-code, .copy-link, .share-link.copy');
    const shareButtons = document.querySelectorAll('.share-btn, .share-link:not(.copy)');
    
    // ===========================================
    // Scroll Progress Indicator
    // ===========================================
    function updateScrollProgress() {
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight - windowHeight;
        const scrolled = window.scrollY;
        const progress = (scrolled / documentHeight) * 100;
        
        if (progressBar) {
            progressBar.style.width = `${progress}%`;
        }
        
        if (progressText) {
            progressText.textContent = `${Math.round(progress)}%`;
        }
        
        // Show reading time indicator after 10% scroll
        if (readingTimeIndicator && timeCircle && timeText) {
            if (progress > 10) {
                readingTimeIndicator.classList.add('visible');
                
                // Calculate reading progress based on scroll position relative to article
                const article = document.querySelector('.detail-article');
                if (article) {
                    const articleTop = article.offsetTop;
                    const articleHeight = article.offsetHeight;
                    const articleBottom = articleTop + articleHeight;
                    const viewportMiddle = window.scrollY + (windowHeight / 2);
                    
                    // Calculate how much of the article has been read
                    let articleProgress = 0;
                    if (viewportMiddle > articleTop && viewportMiddle < articleBottom) {
                        articleProgress = ((viewportMiddle - articleTop) / articleHeight) * 100;
                    } else if (viewportMiddle >= articleBottom) {
                        articleProgress = 100;
                    }
                    
                    // Update circle progress
                    const circumference = 2 * Math.PI * 15.9155; // Circle radius from SVG
                    const offset = circumference - (articleProgress / 100) * circumference;
                    timeCircle.style.strokeDasharray = `${circumference} ${circumference}`;
                    timeCircle.style.strokeDashoffset = offset;
                    
                    timeText.textContent = `${Math.round(articleProgress)}%`;
                }
            } else {
                readingTimeIndicator.classList.remove('visible');
            }
        }
    }
    
    window.addEventListener('scroll', updateScrollProgress);
    updateScrollProgress(); // Initial call
    
    // ===========================================
    // Scroll to Top Button
    // ===========================================
    if (scrollTopBtn) {
        // Show/hide button based on scroll position
        function toggleScrollTopButton() {
            if (window.scrollY > 500) {
                scrollTopBtn.style.opacity = '1';
                scrollTopBtn.style.visibility = 'visible';
                scrollTopBtn.style.transform = 'translateY(0)';
            } else {
                scrollTopBtn.style.opacity = '0';
                scrollTopBtn.style.visibility = 'hidden';
                scrollTopBtn.style.transform = 'translateY(20px)';
            }
        }
        
        window.addEventListener('scroll', toggleScrollTopButton);
        toggleScrollTopButton(); // Initial call
        
        // Scroll to top on click
        scrollTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // ===========================================
    // Theme Toggle
    // ===========================================
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const html = document.documentElement;
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            html.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Update icon
            const icon = this.querySelector('i');
            if (newTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            } else {
                icon.classList.remove('fa-sun');
                icon.classList.add('fa-moon');
            }
            
            showToast('Theme changed to ' + newTheme);
        });
        
        // Load saved theme
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
            const icon = themeToggle.querySelector('i');
            if (savedTheme === 'dark') {
                icon.classList.remove('fa-moon');
                icon.classList.add('fa-sun');
            }
        }
    }
    
    // ===========================================
    // Font Size Toggle
    // ===========================================
    if (fontSizeToggle) {
        const content = document.querySelector('.content-paragraphs');
        let fontSize = 100; // percentage
        
        fontSizeToggle.addEventListener('click', function() {
            fontSize += 25;
            if (fontSize > 200) {
                fontSize = 75;
            }
            
            if (content) {
                content.style.fontSize = `${fontSize}%`;
            }
            
            // Update icon based on font size
            const icon = this.querySelector('i');
            if (fontSize >= 125) {
                icon.classList.remove('fa-text-height');
                icon.classList.add('fa-text-width');
            } else if (fontSize <= 100) {
                icon.classList.remove('fa-text-width');
                icon.classList.add('fa-text-height');
            }
            
            showToast(`Font size: ${fontSize}%`);
            localStorage.setItem('fontSize', fontSize);
        });
        
        // Load saved font size
        const savedFontSize = localStorage.getItem('fontSize');
        if (savedFontSize && content) {
            fontSize = parseInt(savedFontSize);
            content.style.fontSize = `${fontSize}%`;
            
            const icon = fontSizeToggle.querySelector('i');
            if (fontSize >= 125) {
                icon.classList.add('fa-text-width');
                icon.classList.remove('fa-text-height');
            }
        }
    }
    
    // ===========================================
    // Table of Contents Toggle
    // ===========================================
    if (tocToggle && tocContent) {
        tocToggle.addEventListener('click', function() {
            tocContent.classList.toggle('collapsed');
            const icon = this.querySelector('i');
            icon.classList.toggle('fa-chevron-up');
            icon.classList.toggle('fa-chevron-down');
        });
    }
    
    // ===========================================
    // Copy to Clipboard Functionality
    // ===========================================
    copyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const textToCopy = window.location.href;
            
            try {
                await navigator.clipboard.writeText(textToCopy);
                showToast('Link copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy: ', err);
                showToast('Failed to copy link', 'error');
            }
        });
    });
    
    // ===========================================
    // Share Buttons
    // ===========================================
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const url = window.location.href;
            const title = document.querySelector('.article-title')?.textContent || '';
            const text = document.querySelector('.lead-text')?.textContent || '';
            
            let shareUrl;
            
            if (this.classList.contains('twitter') || this.closest('.twitter')) {
                shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
            } else if (this.classList.contains('facebook') || this.closest('.facebook')) {
                shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
            } else if (this.classList.contains('linkedin') || this.closest('.linkedin')) {
                shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
                showToast('Opening share dialog...');
            }
        });
    });
    
    // ===========================================
    // Highlight Active TOC Item
    // ===========================================
    const tocLinks = document.querySelectorAll('.toc-link, .sidebar-toc-link');
    const sections = document.querySelectorAll('h2, h3');
    
    function highlightActiveTOC() {
        let currentSection = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const scrollPosition = window.scrollY + 150; // Offset for header
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
            }
        });
        
        tocLinks.forEach(link => {
            link.classList.remove('active');
            const href = link.getAttribute('href');
            if (href === `#${currentSection}`) {
                link.classList.add('active');
                
                // Add visual indicator for active item
                link.style.color = 'var(--detail-primary)';
                link.style.background = 'rgba(139, 92, 246, 0.1)';
                link.style.fontWeight = '700';
            } else {
                link.style.color = '';
                link.style.background = '';
                link.style.fontWeight = '';
            }
        });
    }
    
    window.addEventListener('scroll', highlightActiveTOC);
    highlightActiveTOC(); // Initial call
    
    // ===========================================
    // Like/Comment Functionality
    // ===========================================
    const likeButtons = document.querySelectorAll('.comment-like, .share-btn.like');
    
    likeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const countElement = this.querySelector('span');
            const icon = this.querySelector('i');
            let count = parseInt(countElement.textContent) || 0;
            
            if (icon.classList.contains('far')) {
                // Like
                count++;
                icon.classList.remove('far');
                icon.classList.add('fas');
                icon.style.color = 'var(--detail-error)';
                showToast('Liked!');
            } else {
                // Unlike
                count = Math.max(0, count - 1);
                icon.classList.remove('fas');
                icon.classList.add('far');
                icon.style.color = '';
                showToast('Like removed');
            }
            
            countElement.textContent = count;
            
            // Animate the like
            icon.style.animation = 'heartBeat 0.6s ease';
            setTimeout(() => {
                icon.style.animation = '';
            }, 600);
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
    // Follow Author Button
    // ===========================================
    const followBtn = document.querySelector('.follow-btn');
    if (followBtn) {
        followBtn.addEventListener('click', function() {
            const icon = this.querySelector('i');
            const isFollowing = icon.classList.contains('fa-user-check');
            
            if (isFollowing) {
                // Unfollow
                icon.classList.remove('fa-user-check');
                icon.classList.add('fa-user-plus');
                this.innerHTML = '<i class="fas fa-user-plus"></i> Follow';
                showToast('Unfollowed author');
            } else {
                // Follow
                icon.classList.remove('fa-user-plus');
                icon.classList.add('fa-user-check');
                this.innerHTML = '<i class="fas fa-user-check"></i> Following';
                showToast('Following author');
            }
        });
    }
    
    // ===========================================
    // Save for Later Button
    // ===========================================
    const saveBtn = document.querySelector('.save-btn');
    if (saveBtn) {
        saveBtn.addEventListener('click', function() {
            const icon = this.querySelector('.btn-icon i');
            const isSaved = icon.classList.contains('fas');
            
            if (isSaved) {
                // Unsave
                icon.classList.remove('fas');
                icon.classList.add('far');
                showToast('Removed from saved');
            } else {
                // Save
                icon.classList.remove('far');
                icon.classList.add('fas');
                showToast('Saved for later');
            }
        });
    }
    
    // ===========================================
    // Comment Form Submission
    // ===========================================
    const commentForm = document.querySelector('.comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const textarea = this.querySelector('.comment-input');
            const comment = textarea.value.trim();
            
            if (comment.length < 10) {
                showToast('Comment must be at least 10 characters', 'error');
                textarea.focus();
                return;
            }
            
            // Simulate submission
            const submitBtn = this.querySelector('.submit-comment');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Posting...';
            submitBtn.disabled = true;
            
            setTimeout(() => {
                // Add new comment to list
                const commentsList = document.querySelector('.comments-list');
                const newComment = document.createElement('div');
                newComment.className = 'comment';
                newComment.innerHTML = `
                    <div class="comment-avatar">
                        <div class="avatar-small">Y</div>
                    </div>
                    <div class="comment-content">
                        <div class="comment-header">
                            <span class="comment-author">You</span>
                            <span class="comment-date">Just now</span>
                            <button class="comment-like">
                                <i class="far fa-heart"></i>
                                <span>0</span>
                            </button>
                        </div>
                        <p class="comment-text">${comment}</p>
                        <div class="comment-actions">
                            <button class="reply-btn">Reply</button>
                            <button class="share-btn">Share</button>
                        </div>
                    </div>
                `;
                
                commentsList.prepend(newComment);
                
                // Reset form
                textarea.value = '';
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
                
                showToast('Comment posted successfully!');
                
                // Add event listener to new like button
                const newLikeBtn = newComment.querySelector('.comment-like');
                newLikeBtn.addEventListener('click', function() {
                    const countElement = this.querySelector('span');
                    const icon = this.querySelector('i');
                    let count = parseInt(countElement.textContent) || 0;
                    
                    if (icon.classList.contains('far')) {
                        count++;
                        icon.classList.remove('far');
                        icon.classList.add('fas');
                        icon.style.color = 'var(--detail-error)';
                    } else {
                        count = Math.max(0, count - 1);
                        icon.classList.remove('fas');
                        icon.classList.add('far');
                        icon.style.color = '';
                    }
                    
                    countElement.textContent = count;
                });
            }, 1500);
        });
    }
    
    // ===========================================
    // Toast Notification System
    // ===========================================
    function showToast(message, type = 'success') {
        if (!notificationToast) return;
        
        // Update content
        const icon = notificationToast.querySelector('i');
        const text = notificationToast.querySelector('.toast-message');
        
        if (type === 'error') {
            icon.className = 'fas fa-exclamation-circle';
            notificationToast.style.background = 'var(--detail-gradient-secondary)';
        } else if (type === 'warning') {
            icon.className = 'fas fa-exclamation-triangle';
            notificationToast.style.background = 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)';
        } else {
            icon.className = 'fas fa-check-circle';
            notificationToast.style.background = 'var(--detail-gradient-primary)';
        }
        
        text.textContent = message;
        
        // Show toast
        notificationToast.classList.add('show');
        
        // Hide after 3 seconds
        setTimeout(() => {
            notificationToast.classList.remove('show');
        }, 3000);
    }
    
    // ===========================================
    // Print Article Functionality
    // ===========================================
    const printBtn = document.querySelector('.print-btn');
    if (printBtn) {
        printBtn.addEventListener('click', function() {
            // Trigger print dialog
            setTimeout(() => {
                showToast('Print dialog opened');
            }, 100);
        });
    }
    
    // ===========================================
    // Code Block Copy Functionality
    // ===========================================
    const codeCopyButtons = document.querySelectorAll('.copy-code');
    
    codeCopyButtons.forEach(button => {
        button.addEventListener('click', async function() {
            const codeBlock = this.closest('.code-block');
            const code = codeBlock.querySelector('code').textContent;
            
            try {
                await navigator.clipboard.writeText(code);
                
                // Visual feedback
                const originalHTML = this.innerHTML;
                this.innerHTML = '<i class="fas fa-check"></i> Copied!';
                this.style.background = 'var(--detail-success)';
                this.style.color = 'white';
                this.style.borderColor = 'transparent';
                
                setTimeout(() => {
                    this.innerHTML = originalHTML;
                    this.style.background = '';
                    this.style.color = '';
                    this.style.borderColor = '';
                }, 2000);
                
                showToast('Code copied to clipboard!');
            } catch (err) {
                console.error('Failed to copy code: ', err);
                showToast('Failed to copy code', 'error');
            }
        });
    });
    
    // ===========================================
    // Keyboard Shortcuts
    // ===========================================
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + P to print
        if ((e.ctrlKey || e.metaKey) && e.key === 'p') {
            e.preventDefault();
            window.print();
            showToast('Opening print dialog...');
        }
        
        // Ctrl/Cmd + L to scroll to top
        if ((e.ctrlKey || e.metaKey) && e.key === 'l') {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Ctrl/Cmd + / to toggle TOC
        if ((e.ctrlKey || e.metaKey) && e.key === '/') {
            e.preventDefault();
            if (tocToggle) {
                tocToggle.click();
            }
        }
        
        // Escape to close any open modals/toasts
        if (e.key === 'Escape') {
            notificationToast.classList.remove('show');
        }
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
    
    // ===========================================
    // Performance Optimization
    // ===========================================
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(() => {
            // Refresh any layout-dependent features
            highlightActiveTOC();
            updateScrollProgress();
        }, 250);
    });
});