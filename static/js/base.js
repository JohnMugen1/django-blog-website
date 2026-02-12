// Django Blog - Base JavaScript
// Mobile navigation and interactive features

document.addEventListener('DOMContentLoaded', function() {
    // ===========================================
    // Mobile Navigation Toggle
    // ===========================================
    const mobileToggle = document.querySelector('.mobile-toggle');
    const mobileNav = document.querySelector('.mobile-nav');
    const mobileClose = document.querySelector('.mobile-close');
    const body = document.body;
    
    if (mobileToggle && mobileNav) {
        mobileToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            this.setAttribute('aria-expanded', !isExpanded);
            mobileNav.classList.toggle('active');
            body.style.overflow = mobileNav.classList.contains('active') ? 'hidden' : '';
            this.classList.toggle('active');
        });
        
        mobileClose.addEventListener('click', function() {
            mobileToggle.setAttribute('aria-expanded', 'false');
            mobileNav.classList.remove('active');
            body.style.overflow = '';
            mobileToggle.classList.remove('active');
        });
        
        // Close mobile nav when clicking outside
        mobileNav.addEventListener('click', function(e) {
            if (e.target === mobileNav) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                body.style.overflow = '';
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile nav when pressing Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && mobileNav.classList.contains('active')) {
                mobileToggle.setAttribute('aria-expanded', 'false');
                mobileNav.classList.remove('active');
                body.style.overflow = '';
                mobileToggle.classList.remove('active');
            }
        });
        
        // Close mobile nav when clicking on a link
        const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-logout-btn');
        mobileLinks.forEach(link => {
            link.addEventListener('click', function() {
                setTimeout(() => {
                    mobileToggle.setAttribute('aria-expanded', 'false');
                    mobileNav.classList.remove('active');
                    body.style.overflow = '';
                    mobileToggle.classList.remove('active');
                }, 300);
            });
        });
    }
    
    // ===========================================
    // Active Navigation Link Highlighting
    // ===========================================
    function setActiveNavLink() {
        const currentPath = window.location.pathname;
        const navLinks = document.querySelectorAll('.nav-link, .mobile-nav-link');
        
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href && currentPath.includes(href.split('/')[1] || '')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    // Set active link on page load
    setActiveNavLink();
    
    // ===========================================
    // Button Ripple Effects
    // ===========================================
    const buttons = document.querySelectorAll('.nav-btn, .logout-btn, .login-btn, .submit-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            // Only create ripple if button has background (not transparent)
            if (window.getComputedStyle(this).backgroundColor !== 'rgba(0, 0, 0, 0)') {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.7);
                    transform: scale(0);
                    animation: ripple 0.6s linear;
                    pointer-events: none;
                    width: ${size}px;
                    height: ${size}px;
                    top: ${y}px;
                    left: ${x}px;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                
                const existingRipples = this.querySelectorAll('.ripple');
                existingRipples.forEach(r => r.remove());
                
                ripple.classList.add('ripple');
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            }
        });
    });
    
    // Add ripple CSS
    const rippleStyle = document.createElement('style');
    rippleStyle.textContent = `
        @keyframes ripple {
            to {
                transform: scale(4);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(rippleStyle);
    
    // ===========================================
    // Form Input Animations
    // ===========================================
    const formInputs = document.querySelectorAll('input:not([type="submit"]):not([type="button"]), textarea, select');
    
    formInputs.forEach(input => {
        // Add floating label effect if parent has floating-label class
        if (input.parentElement.classList.contains('floating-label')) {
            input.addEventListener('focus', () => {
                input.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', () => {
                if (!input.value) {
                    input.parentElement.classList.remove('focused');
                }
            });
            
            // Check on load
            if (input.value) {
                input.parentElement.classList.add('focused');
            }
        }
        
        // Add focus styling
        input.addEventListener('focus', () => {
            input.parentElement.classList.add('focused');
        });
        
        input.addEventListener('blur', () => {
            if (!input.value && !input.parentElement.classList.contains('floating-label')) {
                input.parentElement.classList.remove('focused');
            }
        });
    });
    
    // ===========================================
    // Password Visibility Toggle
    // ===========================================
    const passwordToggles = document.querySelectorAll('.password-toggle');
    
    passwordToggles.forEach(toggle => {
        toggle.addEventListener('click', function() {
            const input = this.previousElementSibling;
            const icon = this.querySelector('i');
            
            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.remove('fa-eye');
                icon.classList.add('fa-eye-slash');
                this.setAttribute('aria-label', 'Hide password');
            } else {
                input.type = 'password';
                icon.classList.remove('fa-eye-slash');
                icon.classList.add('fa-eye');
                this.setAttribute('aria-label', 'Show password');
            }
        });
    });
    
    // ===========================================
    // Smooth Scrolling for Anchor Links
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            if (href !== '#' && href !== '#!') {
                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    
                    // Close mobile menu if open
                    if (mobileNav && mobileNav.classList.contains('active')) {
                        mobileToggle.setAttribute('aria-expanded', 'false');
                        mobileNav.classList.remove('active');
                        body.style.overflow = '';
                        mobileToggle.classList.remove('active');
                    }
                    
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
    
    // ===========================================
    // Loading Animation
    // ===========================================
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
        
        // Remove loading spinners if any
        const loaders = document.querySelectorAll('.loader, .loading');
        loaders.forEach(loader => {
            loader.style.opacity = '0';
            setTimeout(() => {
                if (loader.parentNode) {
                    loader.remove();
                }
            }, 300);
        });
    });
    
    // ===========================================
    // Auto-hide Messages
    // ===========================================
    const messages = document.querySelectorAll('.message, .alert');
    
    messages.forEach(message => {
        const closeBtn = message.querySelector('.close, .message-close');
        
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                message.style.animation = 'fadeOut 0.3s ease forwards';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 300);
            });
        }
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.style.animation = 'fadeOut 0.5s ease forwards';
                setTimeout(() => {
                    if (message.parentNode) {
                        message.remove();
                    }
                }, 500);
            }
        }, 5000);
    });
    
    // ===========================================
    // Card Hover Effects
    // ===========================================
    const cards = document.querySelectorAll('.card, .post-card, .blog-card');
    
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-5px)';
            card.style.boxShadow = 'var(--shadow-lg)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--shadow-md)';
        });
    });
    
    // ===========================================
    // Tooltips
    // ===========================================
    const tooltips = document.querySelectorAll('[data-tooltip]');
    
    tooltips.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltipText = this.getAttribute('data-tooltip');
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
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
            tooltip.style.borderRadius = 'var(--radius-sm)';
            tooltip.style.fontSize = 'var(--text-sm)';
            tooltip.style.whiteSpace = 'nowrap';
            tooltip.style.pointerEvents = 'none';
            
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
    // Back to Top Button
    // ===========================================
    const backToTop = document.querySelector('.back-to-top');
    
    if (backToTop) {
        function toggleBackToTop() {
            if (window.scrollY > 300) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }
        
        toggleBackToTop();
        
        window.addEventListener('scroll', toggleBackToTop);
        
        backToTop.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
});