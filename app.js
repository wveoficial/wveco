// WV & Co. Interactive Functionality
(function() {
    'use strict';

    // DOM Elements
    const menuToggle = document.getElementById('menuToggle');
    const mobileNav = document.getElementById('mobileNav');
    const navLinks = document.querySelectorAll('.nav-link, .nav-link-mobile');
    const animatedElements = document.querySelectorAll('[class*="animate-"]');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.produto-card');

    // Mobile Menu Toggle
    function initMobileMenu() {
        if (!menuToggle || !mobileNav) return;

        // Set initial ARIA attributes
        menuToggle.setAttribute('aria-expanded', 'false');
        menuToggle.setAttribute('aria-controls', 'mobileNav');
        mobileNav.setAttribute('aria-hidden', 'true');

        menuToggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const isActive = menuToggle.classList.contains('active');
            
            if (isActive) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        // Close menu when clicking on mobile nav links
        const mobileNavLinks = document.querySelectorAll('.nav-link-mobile');
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', function() {
                // Add a small delay to allow smooth scroll to start
                setTimeout(() => {
                    closeMobileMenu();
                }, 150);
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(e) {
            if (menuToggle.classList.contains('active') && 
                !menuToggle.contains(e.target) && 
                !mobileNav.contains(e.target)) {
                closeMobileMenu();
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuToggle.classList.contains('active')) {
                closeMobileMenu();
            }
        });
    }

    function openMobileMenu() {
        menuToggle.classList.add('active');
        mobileNav.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // Update ARIA attributes
        menuToggle.setAttribute('aria-expanded', 'true');
        mobileNav.setAttribute('aria-hidden', 'false');
        
        // Focus first menu item for accessibility
        const firstLink = mobileNav.querySelector('.nav-link-mobile');
        if (firstLink) {
            setTimeout(() => firstLink.focus(), 100);
        }
    }

    function closeMobileMenu() {
        menuToggle.classList.remove('active');
        mobileNav.classList.remove('active');
        document.body.style.overflow = '';
        
        // Update ARIA attributes
        menuToggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
    }

    // Product Filter Functionality
    function initProductFilters() {
        if (!filterButtons.length || !productCards.length) return;

        filterButtons.forEach(button => {
            button.addEventListener('click', function(e) {
                e.preventDefault();
                
                const filterValue = this.getAttribute('data-filter');
                
                // Update active filter button
                filterButtons.forEach(btn => btn.classList.remove('active'));
                this.classList.add('active');
                
                // Filter products with animation
                filterProducts(filterValue);
            });
        });
    }

    function filterProducts(filter) {
        productCards.forEach((card, index) => {
            const category = card.getAttribute('data-category');
            const shouldShow = filter === 'all' || category === filter;
            
            if (shouldShow) {
                // Show card with staggered animation
                card.classList.remove('hidden');
                card.style.animationDelay = `${index * 0.1}s`;
                
                // Re-trigger animation
                card.classList.remove('visible');
                setTimeout(() => {
                    card.classList.add('visible');
                }, 50);
            } else {
                // Hide card
                card.classList.add('hidden');
                card.classList.remove('visible');
            }
        });
    }

    // Smooth Scrolling for Navigation Links
    function initSmoothScrolling() {
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                const href = this.getAttribute('href');
                
                // Only handle internal links
                if (href && href.startsWith('#')) {
                    e.preventDefault();
                    
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const headerHeight = document.querySelector('.header').offsetHeight;
                        const targetPosition = targetElement.offsetTop - headerHeight - 20;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });

                        // Update active link
                        updateActiveNavLink(targetId);
                    }
                }
            });
        });
    }

    // Update Active Navigation Link
    function updateActiveNavLink(activeId) {
        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === `#${activeId}`) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Fix Instagram Link
    function initInstagramLink() {
        const instagramButton = document.querySelector('[href="https://instagram.com"]');
        if (instagramButton) {
            instagramButton.addEventListener('click', function(e) {
                // Ensure the link opens correctly
                console.log('Redirecting to Instagram...');
                
                // Additional fallback - force window.open if needed
                if (!e.defaultPrevented) {
                    setTimeout(() => {
                        window.open('https://instagram.com', '_blank', 'noopener,noreferrer');
                    }, 100);
                }
            });
        }
    }

    // Intersection Observer for Scroll Animations
    function initScrollAnimations() {
        // Check if Intersection Observer is supported
        if (!window.IntersectionObserver) {
            // Fallback: just show all elements
            animatedElements.forEach(el => el.classList.add('visible'));
            return;
        }

        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Unobserve element after animation to improve performance
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        // Observe all animated elements
        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    // Header Scroll Effect
    function initHeaderScrollEffect() {
        const header = document.querySelector('.header');
        if (!header) return;

        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeader() {
            const scrollY = window.scrollY;
            
            if (scrollY > 100) {
                header.style.background = 'rgba(255, 255, 255, 0.98)';
                header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
            } else {
                header.style.background = 'rgba(255, 255, 255, 0.95)';
                header.style.boxShadow = 'none';
            }
            
            lastScrollY = scrollY;
            ticking = false;
        }

        function requestTick() {
            if (!ticking) {
                requestAnimationFrame(updateHeader);
                ticking = true;
            }
        }

        window.addEventListener('scroll', requestTick);
    }

    // Navigation Spy (highlight current section in navigation)
    function initNavigationSpy() {
        const sections = document.querySelectorAll('section[id]');
        if (!sections.length) return;

        const observerOptions = {
            threshold: 0.3,
            rootMargin: '-20% 0px -50% 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.getAttribute('id');
                    updateActiveNavLink(sectionId);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Preloader Animation
    function initPreloader() {
        // Add a simple fade-in effect to the body when page loads
        document.body.style.opacity = '0';
        document.body.style.transition = 'opacity 0.5s ease-in';
        
        window.addEventListener('load', function() {
            document.body.style.opacity = '1';
        });
    }

    // Performance Optimization: Debounce Function
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction() {
            const context = this;
            const args = arguments;
            const later = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    }

    // Handle Window Resize
    function initResizeHandler() {
        const handleResize = debounce(function() {
            // Close mobile menu if window is resized to desktop size
            if (window.innerWidth >= 768) {
                closeMobileMenu();
            }
        }, 250);

        window.addEventListener('resize', handleResize);
    }

    // Enhanced Button Interactions
    function initButtonEnhancements() {
        const buttons = document.querySelectorAll('.btn');
        
        buttons.forEach(button => {
            // Add ripple effect on click
            button.addEventListener('click', function(e) {
                // Don't add ripple if it's the Instagram link - let it work normally
                if (this.getAttribute('href') === 'https://instagram.com') {
                    return;
                }
                
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.width = ripple.style.height = size + 'px';
                ripple.style.left = x + 'px';
                ripple.style.top = y + 'px';
                ripple.classList.add('ripple');
                
                // Add ripple styles
                ripple.style.position = 'absolute';
                ripple.style.borderRadius = '50%';
                ripple.style.background = 'rgba(255, 255, 255, 0.3)';
                ripple.style.transform = 'scale(0)';
                ripple.style.animation = 'ripple 600ms linear';
                ripple.style.pointerEvents = 'none';
                
                this.appendChild(ripple);
                
                setTimeout(() => {
                    ripple.remove();
                }, 600);
            });
        });

        // Add ripple animation styles
        const style = document.createElement('style');
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: scale(4);
                    opacity: 0;
                }
            }
            .btn {
                position: relative;
                overflow: hidden;
            }
        `;
        document.head.appendChild(style);
    }

    // Accessibility Enhancements
    function initAccessibility() {
        // Skip to main content link
        const skipLink = document.createElement('a');
        skipLink.href = '#main';
        skipLink.textContent = 'Pular para o conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--color-green-olive);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 1001;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', function() {
            this.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', function() {
            this.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main landmark if not present
        const main = document.querySelector('main');
        if (main && !main.hasAttribute('id')) {
            main.setAttribute('id', 'main');
        }

        // Enhance focus visibility
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });

        document.addEventListener('mousedown', function() {
            document.body.classList.remove('using-keyboard');
        });
    }

    // Form Enhancements (if forms are added later)
    function initFormEnhancements() {
        const forms = document.querySelectorAll('form');
        
        forms.forEach(form => {
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                // Add floating label effect
                input.addEventListener('focus', function() {
                    this.parentElement.classList.add('focused');
                });
                
                input.addEventListener('blur', function() {
                    if (!this.value) {
                        this.parentElement.classList.remove('focused');
                    }
                });
                
                // Check if input has value on load
                if (input.value) {
                    input.parentElement.classList.add('focused');
                }
            });
        });
    }

    // Enhanced Image Placeholders with Shimmer Effect
    function initImagePlaceholders() {
        const imagePlaceholders = document.querySelectorAll('.image-placeholder');
        
        imagePlaceholders.forEach(placeholder => {
            // Add loading animation
            placeholder.style.position = 'relative';
            
            // Create animated background pattern
            const pattern = document.createElement('div');
            pattern.style.cssText = `
                position: absolute;
                top: 0;
                left: -100%;
                width: 100%;
                height: 100%;
                background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
                animation: shimmer 2s infinite;
                pointer-events: none;
            `;
            
            placeholder.appendChild(pattern);
        });
        
        // Add shimmer animation
        const shimmerStyle = document.createElement('style');
        shimmerStyle.textContent = `
            @keyframes shimmer {
                0% { left: -100%; }
                100% { left: 100%; }
            }
        `;
        document.head.appendChild(shimmerStyle);
    }

    // Enhanced Product Card Interactions
    function initProductCardEnhancements() {
        productCards.forEach(card => {
            // Add hover sound effect placeholder (could be extended)
            card.addEventListener('mouseenter', function() {
                this.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
            });

            // Add click tracking for analytics (placeholder)
            card.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                const title = this.querySelector('.card-title')?.textContent;
                console.log(`Product card clicked: ${category} - ${title}`);
            });
        });
    }

    // Keyboard Navigation for Filters
    function initFilterKeyboardNavigation() {
        filterButtons.forEach((button, index) => {
            button.addEventListener('keydown', function(e) {
                let targetIndex = index;
                
                switch(e.key) {
                    case 'ArrowRight':
                        e.preventDefault();
                        targetIndex = (index + 1) % filterButtons.length;
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        targetIndex = (index - 1 + filterButtons.length) % filterButtons.length;
                        break;
                    case 'Home':
                        e.preventDefault();
                        targetIndex = 0;
                        break;
                    case 'End':
                        e.preventDefault();
                        targetIndex = filterButtons.length - 1;
                        break;
                    default:
                        return;
                }
                
                filterButtons[targetIndex].focus();
            });
        });
    }

    // Error Handling
    function initErrorHandling() {
        window.addEventListener('error', function(e) {
            console.warn('WV & Co. Website Error:', e.error);
            // Could send error to analytics service here
        });

        // Handle unhandled promise rejections
        window.addEventListener('unhandledrejection', function(e) {
            console.warn('WV & Co. Website Unhandled Promise:', e.reason);
        });
    }

    // Debug Mobile Menu
    function debugMobileMenu() {
        console.log('Menu Toggle Element:', menuToggle);
        console.log('Mobile Nav Element:', mobileNav);
        console.log('Window Width:', window.innerWidth);
        
        if (menuToggle) {
            console.log('Menu Toggle Display:', getComputedStyle(menuToggle).display);
        }
        
        if (mobileNav) {
            console.log('Mobile Nav Display:', getComputedStyle(mobileNav).display);
        }
    }

    // Initialize all functionality when DOM is ready
    function init() {
        // Debug info
        debugMobileMenu();
        
        // Core functionality
        initMobileMenu();
        initSmoothScrolling();
        initScrollAnimations();
        initHeaderScrollEffect();
        initNavigationSpy();
        initResizeHandler();
        initInstagramLink();
        
        // New ecommerce functionality
        initProductFilters();
        initProductCardEnhancements();
        initFilterKeyboardNavigation();
        
        // Enhancements
        initButtonEnhancements();
        initAccessibility();
        initFormEnhancements();
        initImagePlaceholders();
        initErrorHandling();
        initPreloader();

        // Add loaded class to body for CSS hooks
        document.body.classList.add('loaded');
        
        console.log('🎨 WV & Co. website initialized successfully!');
        console.log('📱 Mobile menu should be working on screens < 768px');
        console.log('🛍️ Product filtering system activated');
        console.log('✨ E-commerce enhancements loaded');
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Expose some functions globally for potential external use
    window.WVCo = {
        closeMobileMenu: closeMobileMenu,
        openMobileMenu: openMobileMenu,
        filterProducts: filterProducts,
        debugMobileMenu: debugMobileMenu,
        version: '2.0.0'
    };

})();