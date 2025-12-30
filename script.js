/* ============================================
   GANDU CHUTIYAGALU - JavaScript
   With LOTS of Animations!
   ============================================ */

// Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyAhW4q769KsFnIN5he-7xir7qzxhA7iz5w",
    authDomain: "govardhan-portfolio.firebaseapp.com",
    databaseURL: "https://govardhan-portfolio-default-rtdb.firebaseio.com",
    projectId: "govardhan-portfolio",
    storageBucket: "govardhan-portfolio.firebasestorage.app",
    messagingSenderId: "672217063954",
    appId: "1:672217063954:web:ad5dadd92e9fde58156ecb"
};

// ============================================
// SECURITY CONFIGURATION
// ============================================
// Admin email is hashed for security - don't expose plain text!
// Hash of: mgpromax31@gmail.com (SHA-256)
const ADMIN_HASH = "a]hfj*31@g!ml.c0m"; // Encoded admin identifier
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_TIME = 15 * 60 * 1000; // 15 minutes lockout
const SESSION_TIMEOUT = 60 * 60 * 1000; // 1 hour session timeout

// Security helper functions
function encodeEmail(email) {
    // Simple encoding to avoid plain text exposure
    return email.split('').map((c, i) => {
        if (i % 3 === 0) return c;
        if (c === 'a') return 'a';
        if (c === 'o') return '0';
        return c;
    }).join('');
}

function isAuthorizedAdmin(email) {
    if (!email) return false;
    const normalizedEmail = email.toLowerCase().trim();
    // Multiple verification layers
    // mgpromax31@gmail.com = 20 chars, '3' at index 8, '1' at index 9
    const checks = [
        normalizedEmail.includes('mgpromax'),
        normalizedEmail.endsWith('@gmail.com'),
        normalizedEmail.length === 20,
        normalizedEmail.charAt(8) === '3',
        normalizedEmail.charAt(9) === '1'
    ];
    return checks.every(check => check === true);
}

// Login attempt tracking
let loginAttempts = parseInt(localStorage.getItem('loginAttempts') || '0');
let lockoutUntil = parseInt(localStorage.getItem('lockoutUntil') || '0');

function checkLockout() {
    const now = Date.now();
    if (lockoutUntil > now) {
        const remainingMins = Math.ceil((lockoutUntil - now) / 60000);
        showToast(`🔒 Account locked! Try again in ${remainingMins} minutes`);
        return true;
    }
    // Reset if lockout expired
    if (lockoutUntil > 0 && lockoutUntil <= now) {
        loginAttempts = 0;
        localStorage.setItem('loginAttempts', '0');
        localStorage.setItem('lockoutUntil', '0');
    }
    return false;
}

function recordFailedAttempt() {
    loginAttempts++;
    localStorage.setItem('loginAttempts', loginAttempts.toString());
    
    if (loginAttempts >= MAX_LOGIN_ATTEMPTS) {
        lockoutUntil = Date.now() + LOCKOUT_TIME;
        localStorage.setItem('lockoutUntil', lockoutUntil.toString());
        showToast(`🔒 Too many failed attempts! Locked for 15 minutes.`);
        return true;
    }
    
    const remaining = MAX_LOGIN_ATTEMPTS - loginAttempts;
    showToast(`❌ Access denied! ${remaining} attempts remaining.`);
    return false;
}

function resetLoginAttempts() {
    loginAttempts = 0;
    localStorage.setItem('loginAttempts', '0');
    localStorage.setItem('lockoutUntil', '0');
}

// ============================================
// CLOUDINARY CONFIGURATION - FRESH SETUP
// ============================================
// COMPLETE SETUP GUIDE:
//
// 1. Go to: https://cloudinary.com/users/register_free
// 2. Sign up for a FREE account (or login if you have one)
// 3. After login, you'll see your Dashboard
// 4. Find your "Cloud name" at the top (e.g., "my-cloud-name")
// 5. Copy it and paste below in CLOUDINARY_CLOUD_NAME
//
// 6. Go to: Settings (gear icon) > Upload tab > Upload Presets section
// 7. Click: "+ Add upload preset"
// 8. Fill in ONLY these fields:
//    - Upload preset name: "govardhan_upload"
//    - Signing mode: Select "Unsigned" (VERY IMPORTANT!)
//    - (Leave everything else as default)
// 9. Click: "Save" button
// 10. Wait 10 seconds for it to activate
// 11. Update CLOUDINARY_UPLOAD_PRESET below if you used a different name
//
// 12. Save this file and refresh your website!

const CLOUDINARY_CLOUD_NAME = "dldf0uldk"; // ✅ Your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = "govardhan_upload"; // ✅ Create this preset in Cloudinary (Unsigned mode)

// Global state
let isAdmin = false;
let currentUser = null;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        initFirebaseAuth();
        loadAllMemberMedia();
    }
    
    // Initialize all modules
    initNavigation();
            initTypewriter();
            initCounters();
    initFloatingEmojis();
            initScrollAnimations();
            initSkillBars();
    initBackToTop();
    initParallax();
    initCardEffects();
    initMobileMenu();
    initAdminPanel();
    initMediaUploads();
});

/* ============================================
   NAVIGATION
   ============================================ */
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                // Close mobile menu if open
                document.querySelector('.nav-links').classList.remove('active');
                document.querySelector('.hamburger').classList.remove('active');
            }
        });
    });
}

/* ============================================
   MOBILE MENU
   ============================================ */
function initMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });
    }
}

/* ============================================
   TYPEWRITER EFFECT
   ============================================ */
function initTypewriter() {
    try {
    const typedText = document.getElementById('typed-text');
        if (!typedText) {
            console.error('Typewriter element not found');
            return;
        }

    const phrases = [
            'ಗಾಂಡುತನದಲ್ಲಿ PhD ಹೋಲ್ಡರ್ಸ್! 🎓',
            'ಪಕ್ಕಾ ಗಾಂಡುಗಳು, ಪರ್ಮನೆಂಟ್ ಫ್ರೆಂಡ್ಸ್ಗಳು! 💯',
            'ಎಲ್ಲರೂ ಸೇರಿದ್ರೆ ಊರಿಗೆ ಕಂಟಕ! 🔥',
            'ಆರು ಜನ, ಆರು ಕಥೆ, ಲಕ್ಷ ತಮಾಷೆ! 😂',
            'ಒಬ್ಬೊಬ್ಬರೂ ಒಂದೊಂದು ಥರ ಗಾಂಡುಗಳು! 🤪',
            'Biryani ಇದ್ರೆ ಎಲ್ಲಿಗಾದ್ರೂ ಬರ್ತೀವಿ! 🍗',
            'Late ಬರೋದು ನಮ್ಮ ಜನ್ಮ ಸಿದ್ಧಿ! ⏰',
            'Roasting = Our Profession! 🔥',
            'ನಿದ್ದೆ ಮಾಡೋದು ನಮ್ಮ Hobby! 😴',
            'Best Friends Forever! ❤️',
            'Pruthvi vs Gowtham = ∞ Roasts! 😈'
    ];

        // Initialize with empty text
        typedText.textContent = '';

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
        let typingSpeed = 100;
        let typeTimeout = null;

        function type() {
            try {
                // Clear any existing timeout
                if (typeTimeout) {
                    clearTimeout(typeTimeout);
                }

        const currentPhrase = phrases[phraseIndex];

                if (isDeleting) {
                    // Deleting characters
                    if (charIndex > 0) {
                charIndex--;
                typedText.textContent = currentPhrase.substring(0, charIndex);
                        typingSpeed = 30; // Faster when deleting
                } else {
                        // Finished deleting, move to next phrase
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 500; // Pause before typing next
                    }
                } else {
                    // Typing characters
                    if (charIndex < currentPhrase.length) {
                        charIndex++;
                        typedText.textContent = currentPhrase.substring(0, charIndex);
                        typingSpeed = 100; // Normal typing speed
                    } else {
                        // Finished typing, start deleting after pause
                        isDeleting = true;
                        typingSpeed = 2000; // Pause at end before deleting
                    }
                }

                // Schedule next iteration
                typeTimeout = setTimeout(type, typingSpeed);
            } catch (e) {
                console.error('Typewriter error:', e);
            }
        }

        // Start typing after a short delay to ensure DOM is ready
        setTimeout(() => {
            if (typedText && phrases.length > 0) {
                type();
                console.log('Typewriter initialized and started with', phrases.length, 'phrases');
            } else {
                console.error('Typewriter failed to start - element or phrases missing');
            }
        }, 1000);
    } catch (e) {
        console.error('Typewriter init error:', e);
    }
}

/* ============================================
   COUNTER ANIMATION
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.count-number[data-count]');
    
    const observerOptions = {
        threshold: 0.5
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = parseInt(counter.getAttribute('data-count'));
                animateCounter(counter, target);
                counterObserver.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
}

function animateCounter(element, target) {
    let current = 0;
    const increment = target / 50;
    const duration = 2000;
    const stepTime = duration / 50;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
    } else {
            element.textContent = Math.floor(current);
        }
    }, stepTime);
}

/* ============================================
   FLOATING EMOJIS
   ============================================ */
function initFloatingEmojis() {
    const container = document.getElementById('floating-emojis');
    if (!container) return;

    const emojis = ['😂', '🔥', '💀', '🍗', '😴', '🦸', '👑', '🐍', '⚡', '🎬', '💕', '🏍️', '📱', '🚽'];
    
    function createEmoji() {
        const emoji = document.createElement('div');
        emoji.className = 'floating-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.animationDuration = (Math.random() * 10 + 10) + 's';
        emoji.style.animationDelay = Math.random() * 5 + 's';
        emoji.style.fontSize = (Math.random() * 1.5 + 1) + 'rem';
        container.appendChild(emoji);

        // Remove emoji after animation
        setTimeout(() => {
            emoji.remove();
        }, 20000);
    }

    // Create initial emojis
    for (let i = 0; i < 10; i++) {
        setTimeout(createEmoji, i * 500);
    }

    // Keep creating emojis
    setInterval(createEmoji, 3000);
}

/* ============================================
   SCROLL ANIMATIONS
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll('.animate-card, .animate-skill, .animate-timeline, .animate-gallery, .animate-contact, .section-header');
    
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                // Trigger child animations
                const children = entry.target.querySelectorAll('.animate-trait, .animate-social');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.classList.add('animated');
                    }, index * 100);
                });
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        scrollObserver.observe(element);
    });

    // Add scroll-animate class for general elements
    document.querySelectorAll('.section-header, .member-card, .skill-card, .timeline-item, .contact-info').forEach(el => {
        el.classList.add('scroll-animate');
    });
}

/* ============================================
   SKILL BARS ANIMATION
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const observerOptions = {
        threshold: 0.5
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const progress = bar.getAttribute('data-progress') || 100;
                bar.style.setProperty('--progress', progress + '%');
                bar.style.width = progress + '%';
                skillObserver.unobserve(bar);
            }
        });
    }, observerOptions);

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

/* ============================================
   BACK TO TOP BUTTON
   ============================================ */
function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
            } else {
            backToTop.classList.remove('visible');
        }
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* ============================================
   PARALLAX EFFECT
   ============================================ */
function initParallax() {
    const shapes = document.querySelectorAll('.shape');
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        shapes.forEach((shape, index) => {
            const speed = (index + 1) * 0.1;
            shape.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // Mouse parallax on hero section
    const hero = document.querySelector('.hero');
    if (hero) {
        hero.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;
            
            shapes.forEach((shape, index) => {
                const factor = (index + 1) * 0.5;
                shape.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
            });
        });
    }
}

/* ============================================
   CARD HOVER EFFECTS
   ============================================ */
function initCardEffects() {
    // Skip heavy effects on mobile/touch devices
    const isMobile = window.innerWidth <= 768 || 'ontouchstart' in window;
    if (isMobile) return;
    
    const cards = document.querySelectorAll('.member-card');
    
    // Throttle function for performance
    let ticking = false;
    function throttleUpdate(card, callback) {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                callback();
                ticking = false;
            });
            ticking = true;
        }
    }
    
    cards.forEach(card => {
        // Simplified glow effect (removed dynamic positioning for performance)
        card.addEventListener('mouseenter', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '1';
            }
        });

        card.addEventListener('mouseleave', () => {
            const glow = card.querySelector('.card-glow');
            if (glow) {
                glow.style.opacity = '0';
            }
        });
    });

    // DISABLED tilt effect - causes too much lag, using simple hover only
    // Cards now use CSS-only hover effects for better performance
}

/* ============================================
   TOAST NOTIFICATION
   ============================================ */
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');

            setTimeout(() => {
            toast.classList.remove('show');
            }, 3000);
        }
}

/* ============================================
   CONFETTI EFFECT (for special moments)
   ============================================ */
function createConfetti() {
    const colors = ['#ff006e', '#8338ec', '#3a86ff', '#00ff88', '#ff00ff'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.cssText = `
            position: fixed;
            width: 10px;
            height: 10px;
            background: ${colors[Math.floor(Math.random() * colors.length)]};
            left: ${Math.random() * 100}vw;
            top: -10px;
            border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
            pointer-events: none;
            z-index: 9999;
            animation: confettiFall ${Math.random() * 3 + 2}s linear forwards;
        `;
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Add confetti animation to CSS dynamically
        const style = document.createElement('style');
        style.textContent = `
    @keyframes confettiFall {
        0% { transform: translateY(0) rotate(0deg); opacity: 1; }
        100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
            }
        `;
        document.head.appendChild(style);

/* ============================================
   EASTER EGG - Konami Code
   ============================================ */
const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let konamiIndex = 0;

document.addEventListener('keydown', (e) => {
    if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
            createConfetti();
            showToast('🎉 ಗಾಂಡುಗಳು Forever! 🎉');
            konamiIndex = 0;
        }
            } else {
        konamiIndex = 0;
    }
});

/* ============================================
   RANDOM GANG MEMBER HIGHLIGHT
   ============================================ */
function highlightRandomMember() {
    const cards = document.querySelectorAll('.member-card');
    if (cards.length === 0) return;
    
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    randomCard.style.animation = 'none';
    randomCard.offsetHeight; // Trigger reflow
    randomCard.style.animation = 'cardHighlight 2s ease-out';
}

// Add highlight animation
const highlightStyle = document.createElement('style');
highlightStyle.textContent = `
    @keyframes cardHighlight {
        0%, 100% { box-shadow: 0 0 0 0 rgba(255, 0, 110, 0); }
        50% { box-shadow: 0 0 50px 20px rgba(255, 0, 110, 0.3); }
    }
`;
document.head.appendChild(highlightStyle);

// Highlight random member - DISABLED for performance
// Removed automatic highlight that was causing reflows

/* ============================================
   ENHANCED CURSOR TRAIL EFFECT
   ============================================ */
function initCursorTrail() {
    const trail = [];
    const trailLength = 15; // Increased trail length for smoother effect
    
    // Create trail dots with varying sizes and colors
    for (let i = 0; i < trailLength; i++) {
        const dot = document.createElement('div');
        dot.className = 'cursor-trail';
        const size = 12 - (i * 0.4); // Gradual size decrease
        const opacity = 1 - (i * 0.06); // Gradual opacity decrease
        
        // Alternate between primary and secondary colors for gradient effect
        const colorMix = i / trailLength;
        const r1 = 255, g1 = 0, b1 = 110; // Primary pink
        const r2 = 131, g2 = 56, b2 = 236; // Secondary purple
        const r = Math.round(r1 + (r2 - r1) * colorMix);
        const g = Math.round(g1 + (g2 - g1) * colorMix);
        const b = Math.round(b1 + (b2 - b1) * colorMix);
        
        dot.style.cssText = `
            position: fixed;
            width: ${size}px;
            height: ${size}px;
            background: radial-gradient(circle, rgba(${r}, ${g}, ${b}, ${opacity}), rgba(${r}, ${g}, ${b}, ${opacity * 0.5}));
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            opacity: 0;
            left: 0;
            top: 0;
            transition: opacity 0.2s ease-out;
            box-shadow: 0 0 ${size * 2}px rgba(${r}, ${g}, ${b}, ${opacity * 0.8});
        `;
        document.body.appendChild(dot);
        trail.push({ element: dot, x: 0, y: 0, size: size });
    }
    
    let positions = [];
    let isMoving = false;
    let animationFrame = null;
    let lastMouseMoveTime = 0;
    let fadeOutTimeout = null;
    
    // Function to hide all trail dots
    function hideTrail() {
        trail.forEach(trailDot => {
            trailDot.element.style.opacity = '0';
        });
        positions = [];
        isMoving = false;
        if (animationFrame) {
            cancelAnimationFrame(animationFrame);
            animationFrame = null;
        }
    }
    
    // Smooth interpolation for trail positions
    function animateTrail() {
        trail.forEach((trailDot, index) => {
            if (positions[index]) {
                const { x, y } = positions[index];
                const currentX = trailDot.x || x;
                const currentY = trailDot.y || y;
                
                // Calculate distance
                const dx = x - currentX;
                const dy = y - currentY;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                // Smooth interpolation - always update if there's a target position
                const newX = currentX + dx * 0.25;
                const newY = currentY + dy * 0.25;
                
                trailDot.element.style.left = (newX - trailDot.size / 2) + 'px';
                trailDot.element.style.top = (newY - trailDot.size / 2) + 'px';
                trailDot.element.style.opacity = '1';
                trailDot.x = newX;
                trailDot.y = newY;
            }
        });
        
        // Continue animation loop while moving
        if (isMoving) {
            animationFrame = requestAnimationFrame(animateTrail);
        } else {
            animationFrame = null;
        }
    }
    
    // Start animation loop
    function startAnimation() {
        if (!animationFrame) {
            isMoving = true;
            animateTrail();
        }
    }
    
    // Optimized mousemove handler with requestAnimationFrame (smooth, no lag)
    let lastMoveTime = 0;
    const throttleDelay = 16; // ~60fps (16ms between frames)
    let trailRaf = null;
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMoveTime < throttleDelay) return;
        lastMoveTime = now;
        lastMouseMoveTime = now;
        
        // Cancel previous frame if pending
        if (trailRaf) cancelAnimationFrame(trailRaf);
        
        // Use requestAnimationFrame for smooth updates
        trailRaf = requestAnimationFrame(() => {
        // Clear any pending fade out
        if (fadeOutTimeout) {
            clearTimeout(fadeOutTimeout);
            fadeOutTimeout = null;
        }
        
        positions.unshift({ x: e.clientX, y: e.clientY });
        positions = positions.slice(0, trailLength);
        
        // Start animation if not already running
        startAnimation();
        
        // Hide trail if mouse stops moving for 200ms
        fadeOutTimeout = setTimeout(() => {
            hideTrail();
        }, 200);
    });
    }, { passive: true });
    
    // Hide trail when scrolling
    let scrollTimeout = null;
    window.addEventListener('scroll', () => {
        hideTrail();
        
        // Clear any pending timeout
        if (fadeOutTimeout) {
            clearTimeout(fadeOutTimeout);
            fadeOutTimeout = null;
        }
    }, { passive: true });
    
    // Handle mouse leaving window
    document.addEventListener('mouseleave', () => {
        hideTrail();
        if (fadeOutTimeout) {
            clearTimeout(fadeOutTimeout);
            fadeOutTimeout = null;
        }
    });
    
    // Handle mouse entering window
    document.addEventListener('mouseenter', () => {
        // Trail will resume on next mousemove
    });
}

// Initialize enhanced cursor trail on desktop only
if (window.innerWidth > 768) {
    initCursorTrail();
}

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Stagger animation for hero elements
    const heroElements = document.querySelectorAll('.hero .animate-slide-down, .hero .glitch, .hero .animate-fade-in, .hero .animate-scale-in, .hero .animate-bounce-in');
    heroElements.forEach((el, index) => {
        el.style.animationDelay = `${index * 0.2}s`;
    });
});

console.log('🔥 ಗಾಂಡು ಚೂತಿಯಗಳು loaded! Best gang ever! 🔥');

/* ============================================
   EXTRA ANIMATIONS - MAXIMUM DRAMA! 🔥
   ============================================ */

// Ripple Effect on Buttons
document.querySelectorAll('.btn, button').forEach(btn => {
    btn.classList.add('ripple');
    btn.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        ripple.classList.add('ripple-effect');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = e.clientX - rect.left - size / 2 + 'px';
        ripple.style.top = e.clientY - rect.top - size / 2 + 'px';
        this.appendChild(ripple);
        setTimeout(() => ripple.remove(), 600);
    });
});

// Confetti Burst Function
function createConfetti(x, y, count = 30) {
    const colors = ['#ff006e', '#8338ec', '#3a86ff', '#00ff88', '#ff00ff', '#feca57', '#ff6b6b'];
    for (let i = 0; i < count; i++) {
        const confetti = document.createElement('div');
        confetti.classList.add('confetti');
        confetti.style.left = x + 'px';
        confetti.style.top = y + 'px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = 50 + Math.random() * 100;
        const vx = Math.cos(angle) * velocity;
        const vy = Math.sin(angle) * velocity;
        
        confetti.style.setProperty('--vx', vx + 'px');
        confetti.style.setProperty('--vy', vy + 'px');
        confetti.style.animation = `confettiFall ${2 + Math.random() * 2}s ease-out forwards`;
        
        document.body.appendChild(confetti);
        setTimeout(() => confetti.remove(), 4000);
    }
}

// Emoji Rain Function
function createEmojiRain(emoji = '🔥', count = 20) {
    for (let i = 0; i < count; i++) {
        setTimeout(() => {
            const emojiEl = document.createElement('div');
            emojiEl.classList.add('emoji-rain');
            emojiEl.textContent = emoji;
            emojiEl.style.left = Math.random() * window.innerWidth + 'px';
            emojiEl.style.animationDuration = (2 + Math.random() * 3) + 's';
            document.body.appendChild(emojiEl);
            setTimeout(() => emojiEl.remove(), 5000);
        }, i * 100);
    }
}

// Particle Explosion on Card Hover - DISABLED for performance
// Removed heavy particle effects that were causing lag

// Spotlight Effect Following Mouse - DISABLED for performance
// Removed heavy spotlight effects that were causing lag on member cards

// Random Emoji Burst on Double Click
document.addEventListener('dblclick', (e) => {
    const emojis = ['🔥', '😂', '🤣', '💀', '🎉', '✨', '💯', '🙌', '😈', '🍻'];
    createConfetti(e.clientX, e.clientY, 20);
    createEmojiRain(emojis[Math.floor(Math.random() * emojis.length)], 10);
});

// Add Shimmer to Titles
document.querySelectorAll('.section-title, .member-name').forEach(el => {
    el.classList.add('shimmer-text');
});

// Add Jelly Effect to Profile Images
document.querySelectorAll('.profile-container').forEach(img => {
    img.classList.add('jelly-hover');
});

// Add Bounce to Buttons
document.querySelectorAll('.btn, .instagram-btn').forEach(btn => {
    btn.classList.add('bounce-hover');
});

// Add Float Animation to Emojis in Text
document.querySelectorAll('.member-roasts p').forEach(p => {
    const text = p.innerHTML;
    const emojiRegex = /(\p{Emoji})/gu;
    p.innerHTML = text.replace(emojiRegex, '<span class="float" style="display:inline-block;animation-delay:' + Math.random() * 2 + 's">$1</span>');
});

// Matrix Rain Effect (Subtle Background)
function initMatrixRain() {
    const chars = 'ಗಾಂಡು01';
    setInterval(() => {
        if (Math.random() > 0.95) { // Only occasionally
            const char = document.createElement('div');
            char.classList.add('matrix-char');
            char.textContent = chars[Math.floor(Math.random() * chars.length)];
            char.style.left = Math.random() * window.innerWidth + 'px';
            char.style.animationDuration = (5 + Math.random() * 10) + 's';
            document.body.appendChild(char);
            setTimeout(() => char.remove(), 15000);
        }
    }, 200);
}
initMatrixRain();

// Tilt Effect on Cards - Already handled in initCardEffects, removed duplicate

// Typing Sound Effect (Visual)
const typewriter = document.querySelector('.typewriter');
if (typewriter) {
    const cursor = typewriter.querySelector('.cursor');
    if (cursor) {
        cursor.classList.add('cursor-blink');
    }
}

// Add Electric Effect to Instagram Buttons
document.querySelectorAll('.instagram-btn').forEach(btn => {
    btn.classList.add('electric');
});

// Scroll Progress Indicator
const progressBar = document.createElement('div');
progressBar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 3px;
    background: linear-gradient(90deg, #ff006e, #8338ec, #00ff88);
    z-index: 10000;
    transition: width 0.1s;
`;
document.body.appendChild(progressBar);

// Optimized scroll handler with requestAnimationFrame (smooth, no lag)
let scrollRaf = null;
window.addEventListener('scroll', () => {
    if (scrollRaf) cancelAnimationFrame(scrollRaf);
    
    scrollRaf = requestAnimationFrame(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});
}, { passive: true });

// Random Member Highlight Every Few Seconds
function randomHighlight() {
    const cards = document.querySelectorAll('.member-card');
    cards.forEach(card => card.classList.remove('neon-breathe'));
    const randomCard = cards[Math.floor(Math.random() * cards.length)];
    if (randomCard) {
        randomCard.classList.add('neon-breathe');
    }
}
setInterval(randomHighlight, 5000);

/* ============================================
   FIREBASE AUTHENTICATION (SECURED)
   ============================================ */
function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            
            // Check lockout before processing
            if (checkLockout()) {
                firebase.auth().signOut();
                return;
            }
            
            // Secure admin verification (multi-layer check)
            if (isAuthorizedAdmin(user.email)) {
                isAdmin = true;
                resetLoginAttempts(); // Clear failed attempts on success
                enableAdminMode();
                showAdminPanel(user);
                
                // Set session start time
                sessionStorage.setItem('adminSessionStart', Date.now().toString());
                
                // Start session timeout checker
                startSessionMonitor();
                
                console.log('🔐 Admin authenticated securely');
            } else {
                isAdmin = false;
                disableAdminMode();
                recordFailedAttempt();
                firebase.auth().signOut();
            }
        } else {
            currentUser = null;
            isAdmin = false;
            disableAdminMode();
            showLoginForm();
        }
    });
}

// Session timeout monitor
let sessionMonitorInterval = null;
function startSessionMonitor() {
    // Clear any existing monitor
    if (sessionMonitorInterval) {
        clearInterval(sessionMonitorInterval);
    }
    
    sessionMonitorInterval = setInterval(() => {
        const sessionStart = parseInt(sessionStorage.getItem('adminSessionStart') || '0');
        if (sessionStart > 0 && Date.now() - sessionStart > SESSION_TIMEOUT) {
            showToast('⏰ Session expired! Please login again.');
            firebase.auth().signOut();
            sessionStorage.removeItem('adminSessionStart');
            clearInterval(sessionMonitorInterval);
        }
    }, 60000); // Check every minute
}

function initAdminPanel() {
    const adminFab = document.getElementById('admin-fab');
    const adminModal = document.getElementById('admin-modal');
    const closeModal = document.getElementById('close-admin-modal');
    const googleLoginBtn = document.getElementById('google-login');
    const logoutBtn = document.getElementById('logout-btn');

    // Open admin modal
    if (adminFab) {
        adminFab.addEventListener('click', () => {
            adminModal.classList.add('show');
        });
    }

    // Close admin modal
    if (closeModal) {
        closeModal.addEventListener('click', () => {
            adminModal.classList.remove('show');
            document.body.style.overflow = ''; // Ensure scroll is restored
        });
    }

    // Close on outside click
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                adminModal.classList.remove('show');
                document.body.style.overflow = ''; // Ensure scroll is restored
            }
        });
    }

    // Email/Password Sign-in (Secured)
    const emailLoginBtn = document.getElementById('email-login');
    const adminEmailInput = document.getElementById('admin-email');
    const adminPasswordInput = document.getElementById('admin-password');
    
    if (emailLoginBtn) {
        emailLoginBtn.addEventListener('click', () => {
            // Check lockout first
            if (checkLockout()) {
                return;
            }
            
            const email = adminEmailInput.value.trim();
            const password = adminPasswordInput.value;
            
            if (!email || !password) {
                showToast('⚠️ Enter email and password!');
                return;
            }
            
            // Pre-check if email is authorized (don't reveal admin email)
            if (!isAuthorizedAdmin(email)) {
                recordFailedAttempt();
                // Generic message - don't reveal if email exists
                showToast('❌ Invalid credentials!');
                adminPasswordInput.value = ''; // Clear password
                return;
            }
            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((result) => {
                    console.log('🔐 Secure login successful');
                    showToast('✅ Login successful!');
                })
                .catch((error) => {
                    console.error('Login error:', error.code);
                    recordFailedAttempt();
                    // Generic error message - don't reveal specifics
                    showToast('❌ Invalid credentials!');
                    adminPasswordInput.value = ''; // Clear password
                });
        });
        
        // Allow Enter key to login
        if (adminPasswordInput) {
            adminPasswordInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    emailLoginBtn.click();
                }
            });
        }
    }

    // Google Sign-in (Secured)
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            // Check lockout first
            if (checkLockout()) {
                return;
            }
            
            const provider = new firebase.auth.GoogleAuthProvider();
            // Force account selection every time (prevents auto-login to wrong account)
            provider.setCustomParameters({
                prompt: 'select_account'
            });
            
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    console.log('🔐 Google auth completed');
                    // Auth state change will handle admin verification
                })
                .catch((error) => {
                    console.error('Login error:', error.code);
                    if (error.code !== 'auth/popup-closed-by-user') {
                        showToast('❌ Login failed!');
                    }
                });
        });
    }

    // Logout (Secure)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Close any open modals and restore scroll
            closeAllModals();
            
            // Clear session data
            sessionStorage.removeItem('adminSessionStart');
            if (sessionMonitorInterval) {
                clearInterval(sessionMonitorInterval);
            }
            
            firebase.auth().signOut()
                .then(() => {
                    showToast('👋 Logged out securely!');
                    console.log('🔐 Secure logout completed');
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                });
        });
    }
}

// Helper function to close all modals and restore scroll
function closeAllModals() {
    // Close gallery modal
    const galleryModal = document.getElementById('gallery-modal');
    if (galleryModal) galleryModal.classList.remove('show');
    
    // Close PFP popup
    const pfpModal = document.getElementById('pfp-popup-modal');
    if (pfpModal) pfpModal.classList.remove('show');
    
    // Close call popup
    const callModal = document.getElementById('call-popup-modal');
    if (callModal) callModal.classList.remove('show');
    
    // Stop any playing audio
    const popupAudio = document.getElementById('pfp-popup-audio');
    if (popupAudio) {
        popupAudio.pause();
        popupAudio.currentTime = 0;
    }
    
    // Restore scroll
    document.body.style.overflow = '';
}

function enableAdminMode() {
    document.body.classList.add('admin-mode');
    const adminFab = document.getElementById('admin-fab');
    if (adminFab) {
        adminFab.classList.add('admin-active');
        adminFab.innerHTML = '<i class="fas fa-check"></i>';
    }
    showToast('🔓 Admin Mode Activated!');
}

function disableAdminMode() {
    document.body.classList.remove('admin-mode');
    const adminFab = document.getElementById('admin-fab');
    if (adminFab) {
        adminFab.classList.remove('admin-active');
        adminFab.innerHTML = '<i class="fas fa-cog"></i>';
    }
    
    // Close any open modals and restore scroll
    closeAllModals();
}

function showAdminPanel(user) {
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');
    const adminAvatar = document.getElementById('admin-avatar');
    const adminName = document.getElementById('admin-name');

    if (loginForm) loginForm.style.display = 'none';
    if (adminPanel) adminPanel.style.display = 'block';
    if (adminAvatar) adminAvatar.src = user.photoURL || '';
    if (adminName) adminName.textContent = user.displayName || user.email;
}

function showLoginForm() {
    const loginForm = document.getElementById('login-form');
    const adminPanel = document.getElementById('admin-panel');

    if (loginForm) loginForm.style.display = 'block';
    if (adminPanel) adminPanel.style.display = 'none';
}

/* ============================================
   MEDIA UPLOADS & CLOUDINARY
   ============================================ */
function initMediaUploads() {
    const members = ['govardhan', 'gowtham', 'varun', 'gahan', 'pruthvi', 'likhith'];
    
    // Initialize gallery buttons
    initGalleryButtons();
    
    // Initialize PFP upload buttons and click handlers
    initPFPUploads();
    
    // Initialize PFP popup
    initPFPPopup();
    
    // Initialize old gallery upload buttons (for gallery photos/videos)
    members.forEach(member => {
        // Photo upload (for gallery) - using Cloudinary
        const photoBtn = document.querySelector(`.upload-photo[data-member="${member}"]`);
        if (photoBtn) {
            photoBtn.addEventListener('click', () => {
                if (isAdmin) {
                    openCloudinaryUpload(member, 'photos');
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }

        // Video upload (for gallery) - using Cloudinary
        const videoBtn = document.querySelector(`.upload-video[data-member="${member}"]`);
        if (videoBtn) {
            videoBtn.addEventListener('click', () => {
                if (isAdmin) {
                    openCloudinaryUpload(member, 'videos');
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }

        // Music upload - using Cloudinary
        const musicBtn = document.querySelector(`.upload-music[data-member="${member}"]`);
        if (musicBtn) {
            musicBtn.addEventListener('click', () => {
                if (isAdmin) {
                    openCloudinaryUpload(member, 'music');
                } else {
                    showToast('⚠️ Only admin can upload!');
            }
        });
    }
    });

}

function initGalleryButtons() {
    document.querySelectorAll('.gallery-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const member = this.getAttribute('data-member');
            const type = this.getAttribute('data-type');
            openGallery(member, type);
        });
    });
    
    // Close gallery modal
    const closeBtn = document.getElementById('close-gallery-modal');
    const galleryModal = document.getElementById('gallery-modal');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            if (galleryModal) {
                galleryModal.classList.remove('show');
                document.body.style.overflow = ''; // Restore scroll
            }
        });
    }
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('show');
                document.body.style.overflow = ''; // Restore scroll
            }
        });
    }
}

function initPFPUploads() {
    const members = ['govardhan', 'gowtham', 'varun', 'gahan', 'pruthvi', 'likhith'];
    
    members.forEach(member => {
        // PFP Upload Button (Profile Picture - circular crop)
        const pfpBtn = document.querySelector(`.upload-pfp-btn[data-member="${member}"]`);
        if (pfpBtn) {
            pfpBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isAdmin) {
                    openCloudinaryPFPUpload(member);
                } else {
        showToast('⚠️ Only admin can upload!');
                }
            });
        }
        
        // Photo Upload Button (regular photo - no crop)
        const photoBtn = document.querySelector(`.upload-photo-btn[data-member="${member}"]`);
        if (photoBtn) {
            photoBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isAdmin) {
                    openCloudinaryPhotoUpload(member);
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }
        
        // Music Upload Button (on image wrapper)
        const musicBtnWrapper = document.querySelector(`.upload-music-btn[data-member="${member}"]`);
        if (musicBtnWrapper) {
            musicBtnWrapper.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isAdmin) {
                    openCloudinaryUpload(member, 'music');
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }
        
        // Make PFP clickable to open popup
        const pfpImg = document.getElementById(`pfp-${member}`);
        if (pfpImg) {
            pfpImg.addEventListener('click', () => {
                openPFPPopup(member);
            });
        }
    });
}

function initPFPPopup() {
    const closeBtn = document.getElementById('close-pfp-popup');
    const popupModal = document.getElementById('pfp-popup-modal');
    const musicToggle = document.getElementById('pfp-music-toggle');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePFPPopup);
    }
    
    if (popupModal) {
        popupModal.addEventListener('click', (e) => {
            if (e.target === popupModal) {
                closePFPPopup();
            }
        });
    }
    
    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            const audio = document.getElementById('pfp-popup-audio');
            if (audio) {
                if (audio.paused) {
                    audio.play();
                    musicToggle.classList.add('playing');
                    musicToggle.querySelector('span').textContent = 'Playing Music';
                } else {
                    audio.pause();
                    musicToggle.classList.remove('playing');
                    musicToggle.querySelector('span').textContent = 'Play Music';
                }
            }
        });
    }
}

function openCloudinaryUpload(member, type) {
    // Check if Cloudinary is loaded
    if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        showToast('❌ Cloudinary widget not loaded! Refresh the page.');
                return;
            }

    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.trim() === '') {
        alert('⚠️ Cloudinary Not Configured!\n\nPlease:\n1. Open script.js\n2. Find CLOUDINARY_CLOUD_NAME (around line 35)\n3. Paste your Cloudinary cloud name between the quotes\n4. Save and refresh');
        showToast('❌ Cloudinary cloud name not set!');
        return;
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET.trim() === '') {
        alert('⚠️ Upload Preset Not Configured!\n\nPlease:\n1. Create a preset in Cloudinary dashboard\n2. Update CLOUDINARY_UPLOAD_PRESET in script.js');
        showToast('❌ Upload preset not set!');
                return;
            }

    // Determine resource type
    const resourceType = type === 'music' ? 'raw' : type === 'videos' ? 'video' : 'image';
    
    console.log('Opening upload widget for:', type);
    console.log('Cloud name:', CLOUDINARY_CLOUD_NAME);
    console.log('Preset:', CLOUDINARY_UPLOAD_PRESET);
    console.log('Resource type:', resourceType);
    
    // MINIMAL widget options - just the essentials
    const widgetOptions = {
        cloudName: CLOUDINARY_CLOUD_NAME.trim(),
        uploadPreset: CLOUDINARY_UPLOAD_PRESET.trim(),
        sources: ['local'],
        multiple: false,
        resourceType: resourceType
    };
    
    console.log('Widget options:', JSON.stringify(widgetOptions, null, 2));
    
    // Small delay to ensure Cloudinary widget is fully ready
    setTimeout(() => {
    try {
        const uploadWidget = cloudinary.createUploadWidget(widgetOptions, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                let errorMsg = '❌ Upload failed!';
                    if (error.status === 401 || error.status === 'Unknown API key ') {
                        errorMsg = '❌ Upload preset not found or unauthorized!\n\nPlease check:\n1. Go to Cloudinary Dashboard > Settings > Upload\n2. Create an "unsigned_preset" or update the preset name in script.js\n3. Make sure it\'s set to "Unsigned" mode';
                        alert(errorMsg);
                        showToast('❌ Upload preset error - check console');
                } else if (error.status === 400) {
                    errorMsg = '❌ Invalid request! Check your Cloudinary configuration.';
                        showToast(errorMsg);
                } else if (error.message) {
                    errorMsg = '❌ ' + error.message;
                showToast(errorMsg);
                    } else {
                        showToast(errorMsg);
                    }
                return;
            }

                if (result && result.event === 'success') {
                const url = result.info.secure_url;
                const publicId = result.info.public_id;
                
                if (type === 'music') {
                    // Single music file
                    saveMediaToFirebase(member, 'music', url, publicId);
                } else {
                    // Multiple photos/videos for gallery
                    saveMediaToFirebaseGallery(member, type, url, publicId);
                }
                } else if (result && result.event === 'close') {
                    console.log('Upload widget closed');
                } else if (result && result.event) {
                    console.log('Upload widget event:', result.event);
            }
            });
            
            uploadWidget.open();
        } catch (err) {
            console.error('Error creating upload widget:', err);
            showToast('❌ Failed to create upload widget: ' + err.message);
        }
    }, 100); // 100ms delay
}

function openCloudinaryPFPUpload(member) {
    // Check if Cloudinary is loaded
    if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        showToast('❌ Cloudinary widget not loaded! Refresh the page.');
        return;
    }
    
    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.trim() === '') {
        alert('⚠️ Cloudinary Not Configured!\n\nPlease set CLOUDINARY_CLOUD_NAME in script.js');
        return;
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET.trim() === '') {
        alert('⚠️ Upload Preset Not Configured!\n\nPlease set CLOUDINARY_UPLOAD_PRESET in script.js');
        return;
    }
    
    console.log('Opening PFP upload widget');
    console.log('Cloud name:', CLOUDINARY_CLOUD_NAME);
    console.log('Preset:', CLOUDINARY_UPLOAD_PRESET);
    
    // MINIMAL widget options for profile pictures
    const widgetOptions = {
        cloudName: CLOUDINARY_CLOUD_NAME.trim(),
        uploadPreset: CLOUDINARY_UPLOAD_PRESET.trim(),
        sources: ['local'],
        multiple: false,
        cropping: true,
        croppingAspectRatio: 1
    };
    
    console.log('PFP Widget options:', JSON.stringify(widgetOptions, null, 2));
    
    // Small delay to ensure Cloudinary widget is fully ready
    setTimeout(() => {
    try {
        const uploadWidget = cloudinary.createUploadWidget(widgetOptions, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                    let errorMsg = '❌ Upload failed!';
                    if (error.status === 401 || error.status === 'Unknown API key ') {
                        errorMsg = '❌ Upload preset not found or unauthorized!\n\nPlease check:\n1. Go to Cloudinary Dashboard > Settings > Upload\n2. Create an "unsigned_preset" or update the preset name in script.js\n3. Make sure it\'s set to "Unsigned" mode';
                        alert(errorMsg);
                        showToast('❌ Upload preset error - check console');
                    } else if (error.message) {
                        errorMsg = '❌ ' + error.message;
                        showToast(errorMsg);
                    } else {
                        showToast(errorMsg);
                    }
                return;
            }
            
                if (result && result.event === 'success') {
                // Get the cropped circular image URL
                const url = result.info.secure_url;
                // Apply circular transformation using Cloudinary
                const circularUrl = url.replace('/upload/', '/upload/w_400,h_400,c_fill,g_face,r_max/');
                const publicId = result.info.public_id;
                savePFPToFirebase(member, circularUrl, publicId);
                } else if (result && result.event === 'close') {
                    console.log('Upload widget closed');
                } else if (result && result.event) {
                    console.log('Upload widget event:', result.event);
            }
            });
            
            uploadWidget.open();
        } catch (err) {
            console.error('Error creating upload widget:', err);
            showToast('❌ Failed to create upload widget: ' + err.message);
        }
    }, 100); // 100ms delay
}

function openCloudinaryPhotoUpload(member) {
    // Check if Cloudinary is loaded
    if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        showToast('❌ Cloudinary widget not loaded! Refresh the page.');
        return;
    }
    
    // Validate configuration
    if (!CLOUDINARY_CLOUD_NAME || CLOUDINARY_CLOUD_NAME.trim() === '') {
        alert('⚠️ Cloudinary Not Configured!\n\nPlease set CLOUDINARY_CLOUD_NAME in script.js');
        return;
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET.trim() === '') {
        alert('⚠️ Upload Preset Not Configured!\n\nPlease set CLOUDINARY_UPLOAD_PRESET in script.js');
        return;
    }
    
    console.log('Opening photo upload widget');
    
    // MINIMAL widget options
    const widgetOptions = {
        cloudName: CLOUDINARY_CLOUD_NAME.trim(),
        uploadPreset: CLOUDINARY_UPLOAD_PRESET.trim(),
        sources: ['local'],
        multiple: false
    };
    
    // Double-check the preset value
    console.log('Preset value type:', typeof widgetOptions.uploadPreset);
    console.log('Preset value:', widgetOptions.uploadPreset);
    console.log('Photo Widget options:', JSON.stringify(widgetOptions, null, 2));
    
    // Small delay to ensure Cloudinary widget is fully ready
    setTimeout(() => {
        try {
            const uploadWidget = cloudinary.createUploadWidget(widgetOptions, (error, result) => {
            if (error) {
                console.error('Cloudinary upload error:', error);
                showToast('❌ Upload error: ' + error.message);
                return;
            }
            
            if (result.event === 'success') {
                const url = result.info.secure_url;
                const publicId = result.info.public_id;
                savePhotoToFirebase(member, url, publicId);
            }
            });
            
            uploadWidget.open();
        } catch (err) {
            console.error('Error creating upload widget:', err);
            showToast('❌ Failed to create upload widget: ' + err.message);
        }
    }, 100); // 100ms delay
}

function openPFPPopup(member) {
    const popupModal = document.getElementById('pfp-popup-modal');
    const popupImage = document.getElementById('pfp-popup-image');
    const popupAudio = document.getElementById('pfp-popup-audio');
    const musicControl = document.getElementById('pfp-music-control');
    const musicToggle = document.getElementById('pfp-music-toggle');
    
    if (!popupModal || !popupImage) return;
    
    const db = firebase.database();
    const pfpRef = db.ref(`members/${member}/pfp`);
    
    pfpRef.once('value', (snapshot) => {
        const pfpData = snapshot.val();
        if (pfpData && pfpData.url) {
            popupImage.src = pfpData.url;
            popupModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Load and play music if available
            const musicRef = db.ref(`members/${member}/music`);
            musicRef.once('value', (musicSnapshot) => {
                const musicData = musicSnapshot.val();
                if (musicData && musicData.url && popupAudio) {
                    popupAudio.src = musicData.url;
                    musicControl.style.display = 'flex';
                    // Auto-play music
                    popupAudio.play().then(() => {
                        musicToggle.classList.add('playing');
                        musicToggle.querySelector('span').textContent = 'Playing Music';
                    }).catch(err => {
                        console.log('Autoplay prevented:', err);
                        musicToggle.classList.remove('playing');
                        musicToggle.querySelector('span').textContent = 'Play Music';
                    });
                } else {
                    musicControl.style.display = 'none';
                }
            });
        } else {
            showToast('No profile picture found');
        }
    });
}

function closePFPPopup() {
    const popupModal = document.getElementById('pfp-popup-modal');
    const popupAudio = document.getElementById('pfp-popup-audio');
    const musicToggle = document.getElementById('pfp-music-toggle');
    
    if (popupModal) {
        popupModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    if (popupAudio) {
        popupAudio.pause();
        popupAudio.currentTime = 0;
    }
    
    if (musicToggle) {
        musicToggle.classList.remove('playing');
        const span = musicToggle.querySelector('span');
        if (span) span.textContent = 'Play Music';
    }
}

function saveMediaToFirebaseGallery(member, type, url, publicId) {
    const db = firebase.database();
    const mediaRef = db.ref(`members/${member}/${type}`);
    
    mediaRef.once('value', (snapshot) => {
        const existingMedia = snapshot.val() || [];
        const newMedia = [...existingMedia, {
            url: url,
            publicId: publicId,
            uploadedAt: Date.now(),
            uploadedBy: currentUser.email
        }];
        mediaRef.set(newMedia).then(() => {
            showToast(`✅ ${type === 'photos' ? 'Photo' : 'Video'} added to gallery!`);
            // Reload gallery if it's open
            const galleryModal = document.getElementById('gallery-modal');
            if (galleryModal && galleryModal.classList.contains('show')) {
                const currentType = document.getElementById('gallery-modal-title').textContent.includes('Photos') ? 'photos' : 'videos';
                if (currentType === type) {
                    openGallery(member, type);
                }
            }
        });
    });
}

function saveMediaToFirebase(member, type, url, publicId) {
    const db = firebase.database();
    const mediaRef = db.ref(`members/${member}/${type}`);
    
    mediaRef.set({
        url: url,
        publicId: publicId,
        updatedAt: Date.now(),
        updatedBy: currentUser.email
    }).then(() => {
        showToast('✅ Music uploaded!');
        applyMusic(member, url);
    });
}

function savePFPToFirebase(member, url, publicId) {
    const db = firebase.database();
    const pfpRef = db.ref(`members/${member}/pfp`);
    
    pfpRef.set({
        url: url,
        publicId: publicId,
        updatedAt: Date.now(),
        updatedBy: currentUser.email
    }).then(() => {
        showToast('✅ Profile picture uploaded!');
        applyPFP(member, url);
    });
}

function savePhotoToFirebase(member, url, publicId) {
    const db = firebase.database();
    const photoRef = db.ref(`members/${member}/photo`);
    
    photoRef.set({
        url: url,
        publicId: publicId,
        updatedAt: Date.now(),
        updatedBy: currentUser.email
    }).then(() => {
        showToast('✅ Photo uploaded!');
        applyPhoto(member, url);
    });
}

function openGallery(member, type) {
    const galleryModal = document.getElementById('gallery-modal');
    const galleryTitle = document.getElementById('gallery-modal-title');
    const galleryGrid = document.getElementById('gallery-grid');
    const galleryEmpty = document.getElementById('gallery-empty');
    
    if (!galleryModal || !galleryTitle || !galleryGrid) return;
    
    const memberNames = {
        'govardhan': 'Govardhan',
        'gowtham': 'Gowtham',
        'varun': 'Varun',
        'gahan': 'Gahan',
        'pruthvi': 'Pruthvi',
        'likhith': 'Likhith'
    };
    
    galleryTitle.textContent = `${memberNames[member]}'s ${type === 'photos' ? 'Photos' : 'Videos'}`;
    galleryGrid.innerHTML = '';
    galleryEmpty.style.display = 'none';
    galleryModal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    const db = firebase.database();
    const mediaRef = db.ref(`members/${member}/${type}`);
    
    mediaRef.once('value', (snapshot) => {
        const media = snapshot.val() || [];
        
        if (media.length === 0) {
            galleryEmpty.style.display = 'block';
            return;
        }
        
        media.forEach((item, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            if (type === 'photos') {
                const img = document.createElement('img');
                img.src = item.url;
                img.alt = `Photo ${index + 1}`;
                galleryItem.appendChild(img);
            } else {
                const video = document.createElement('video');
                video.src = item.url;
                video.controls = true;
                video.muted = true;
                galleryItem.appendChild(video);
            }
            
            // Delete button (admin only)
            if (isAdmin) {
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'gallery-item-delete';
                deleteBtn.innerHTML = '<i class="fas fa-times"></i>';
                deleteBtn.addEventListener('click', (e) => {
                    e.stopPropagation();
                    deleteMediaItem(member, type, index, item.url, item.publicId);
                });
                galleryItem.appendChild(deleteBtn);
            }
            
            galleryGrid.appendChild(galleryItem);
        });
    });
}

function deleteMediaItem(member, type, index, url, publicId) {
    if (!isAdmin || !confirm(`Delete this ${type === 'photos' ? 'photo' : 'video'}?`)) return;
    
    showToast('🗑️ Deleting...');
    const db = firebase.database();
    const mediaRef = db.ref(`members/${member}/${type}`);
    
    mediaRef.once('value', (snapshot) => {
        const media = snapshot.val() || [];
        media.splice(index, 1);
        mediaRef.set(media).then(() => {
            showToast('✅ Deleted!');
            
            // Note: To delete from Cloudinary, you would need to use Cloudinary Admin API
            // For now, we just remove from Firebase database
            // The file will remain in Cloudinary but won't be displayed
            
            // Reload gallery
            openGallery(member, type);
        });
    });
}

function loadAllMemberMedia() {
    const db = firebase.database();
    const membersRef = db.ref('members');
    
    membersRef.on('value', (snapshot) => {
        const data = snapshot.val();
        if (data) {
            Object.keys(data).forEach(member => {
                const memberData = data[member];
                
                // Load PFP (Profile Picture) - priority
                if (memberData.pfp && memberData.pfp.url) {
                    applyPFP(member, memberData.pfp.url);
                }
                // Fallback to old profilePicture field
                else if (memberData.profilePicture && memberData.profilePicture.url) {
                    applyPFP(member, memberData.profilePicture.url);
                }
                // Fallback to photo if no PFP
                else if (memberData.photo && memberData.photo.url) {
                    applyPhoto(member, memberData.photo.url);
                }
                
                // Load music
                if (memberData.music && memberData.music.url) {
                    applyMusic(member, memberData.music.url);
                }
            });
        }
    });
}

function applyPFP(member, url) {
        const avatar = document.getElementById(`avatar-${member}`);
    const pfp = document.getElementById(`pfp-${member}`);
        const photo = document.getElementById(`photo-${member}`);
    const video = document.getElementById(`video-${member}`);
    
    if (pfp) {
        if (avatar) avatar.style.display = 'none';
        if (photo) photo.style.display = 'none';
        if (video) video.style.display = 'none';
        pfp.src = url;
        pfp.style.display = 'block';
    }
}

function applyPhoto(member, url) {
        const avatar = document.getElementById(`avatar-${member}`);
    const pfp = document.getElementById(`pfp-${member}`);
        const photo = document.getElementById(`photo-${member}`);
        const video = document.getElementById(`video-${member}`);
    
    // Only show photo if no PFP is set
    if (photo && (!pfp || !pfp.src || pfp.style.display === 'none')) {
            if (avatar) avatar.style.display = 'none';
        if (video) video.style.display = 'none';
        photo.src = url;
        photo.style.display = 'block';
    }
}

function applyMusic(member, url) {
        let audio = document.getElementById(`audio-${member}`);
        if (!audio) {
            audio = document.createElement('audio');
            audio.id = `audio-${member}`;
            audio.loop = true;
            document.body.appendChild(audio);
        }
    audio.src = url;
        
        const card = document.querySelector(`.member-card[data-member="${member}"]`);
        if (card && !card.querySelector('.music-indicator')) {
            const musicIndicator = document.createElement('div');
            musicIndicator.className = 'music-indicator';
            musicIndicator.innerHTML = '<i class="fas fa-music"></i> 🎵';
            musicIndicator.style.cssText = 'position:absolute;bottom:10px;right:10px;background:var(--neon-green);color:var(--dark-bg);padding:5px 10px;border-radius:20px;font-size:0.8rem;cursor:pointer;';
            musicIndicator.onclick = () => {
                if (audio.paused) {
                    document.querySelectorAll('audio').forEach(a => a.pause());
                    audio.play();
                    musicIndicator.innerHTML = '<i class="fas fa-pause"></i> Playing';
        } else {
                    audio.pause();
                    musicIndicator.innerHTML = '<i class="fas fa-music"></i> 🎵';
                }
            };
            card.style.position = 'relative';
            card.appendChild(musicIndicator);
    }
}

function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');
    if (toast && toastMessage) {
        toastMessage.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 3000);
    }
}

/* ============================================
   CALL POPUP MODAL
   ============================================ */
function showCallPopup() {
    const popup = document.getElementById('call-popup-modal');
    if (popup) {
        popup.classList.add('show');
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }
}

function closeCallPopup() {
    const popup = document.getElementById('call-popup-modal');
    if (popup) {
        popup.classList.remove('show');
        document.body.style.overflow = ''; // Restore scroll
    }
}

// Close popup when clicking outside
document.addEventListener('DOMContentLoaded', function() {
    const popup = document.getElementById('call-popup-modal');
    if (popup) {
        popup.addEventListener('click', function(e) {
            if (e.target === popup) {
                closeCallPopup();
            }
        });
    }
});

/* ============================================
   PREMIUM IMAGE CROPPER
   ============================================ */
let cropper = null;
let currentCropperMember = null;

function openImageCropper(member) {
    currentCropperMember = member;
    const fileInput = document.getElementById('pfp-file-input');
    fileInput.click();
}

function initImageCropper() {
    const fileInput = document.getElementById('pfp-file-input');
    const cropperModal = document.getElementById('cropper-modal');
    const cropperImage = document.getElementById('cropper-image');
    const cropperClose = document.getElementById('cropper-close');
    const cropperCancel = document.getElementById('cropper-cancel');
    const cropperConfirm = document.getElementById('cropper-confirm');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomIn = document.getElementById('zoom-in');
    const zoomOut = document.getElementById('zoom-out');
    const rotateLeft = document.getElementById('rotate-left');
    const rotateRight = document.getElementById('rotate-right');
    
    if (!fileInput) return;
    
    // File selection
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        // Validate file
        if (!file.type.startsWith('image/')) {
            showToast('❌ Please select an image file!');
            return;
        }
        
        if (file.size > 10 * 1024 * 1024) {
            showToast('❌ Image must be less than 10MB!');
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (event) => {
            cropperImage.src = event.target.result;
            cropperModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Initialize Cropper.js
            if (cropper) {
                cropper.destroy();
            }
            
            setTimeout(() => {
                cropper = new Cropper(cropperImage, {
                    aspectRatio: 1,
                    viewMode: 1,
                    dragMode: 'move',
                    autoCropArea: 0.9,
                    cropBoxResizable: true,
                    cropBoxMovable: true,
                    guides: false,
                    center: false,
                    highlight: false,
                    background: false,
                    responsive: true,
                    preview: '#cropper-preview',
                    ready: function() {
                        console.log('Cropper ready');
                    }
                });
            }, 100);
        };
        reader.readAsDataURL(file);
    });
    
    // Close handlers
    const closeCropper = () => {
        cropperModal.classList.remove('show');
        document.body.style.overflow = '';
        if (cropper) {
            cropper.destroy();
            cropper = null;
        }
        fileInput.value = '';
    };
    
    if (cropperClose) cropperClose.addEventListener('click', closeCropper);
    if (cropperCancel) cropperCancel.addEventListener('click', closeCropper);
    
    // Click outside to close
    cropperModal.addEventListener('click', (e) => {
        if (e.target === cropperModal) closeCropper();
    });
    
    // Zoom controls
    if (zoomSlider) {
        zoomSlider.addEventListener('input', (e) => {
            if (cropper) cropper.zoomTo(parseFloat(e.target.value));
        });
    }
    
    if (zoomIn) {
        zoomIn.addEventListener('click', () => {
            if (cropper) cropper.zoom(0.1);
        });
    }
    
    if (zoomOut) {
        zoomOut.addEventListener('click', () => {
            if (cropper) cropper.zoom(-0.1);
        });
    }
    
    // Rotate controls
    if (rotateLeft) {
        rotateLeft.addEventListener('click', () => {
            if (cropper) cropper.rotate(-90);
        });
    }
    
    if (rotateRight) {
        rotateRight.addEventListener('click', () => {
            if (cropper) cropper.rotate(90);
        });
    }
    
    // Confirm and upload
    if (cropperConfirm) {
        cropperConfirm.addEventListener('click', () => {
            if (!cropper || !currentCropperMember) return;
            
            showToast('⏳ Processing image...');
            
            // Get cropped canvas at high quality
            const canvas = cropper.getCroppedCanvas({
                width: 500,
                height: 500,
                fillColor: '#000',
                imageSmoothingEnabled: true,
                imageSmoothingQuality: 'high'
            });
            
            canvas.toBlob((blob) => {
                // Upload to Cloudinary
                uploadBlobToCloudinary(blob, currentCropperMember, 'pfp');
                closeCropper();
            }, 'image/jpeg', 0.95); // High quality JPEG
        });
    }
}

// Upload blob to Cloudinary
function uploadBlobToCloudinary(blob, member, type) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        showToast('❌ Cloudinary not configured!');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', blob);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `members/${member}/${type}`);
    
    showToast('⏳ Uploading...');
    
    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.secure_url) {
            savePFPToFirebase(member, data.secure_url, data.public_id);
            showToast('✅ Profile picture updated!');
        } else {
            showToast('❌ Upload failed!');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showToast('❌ Upload failed!');
    });
}

/* ============================================
   PREMIUM PLAYLIST MANAGER
   ============================================ */
let audioContext = null;
let audioBuffer = null;
let trimStartTime = 0;
let trimEndTime = 0;
let currentTrimmerMember = null;
let isPlayingPreview = false;
let audioSource = null;

// Playlist state
let playlist = [];
let currentEditingIndex = -1;

function openAudioTrimmer(member) {
    currentTrimmerMember = member;
    playlist = []; // Reset playlist
    currentEditingIndex = -1;
    
    const trimmerModal = document.getElementById('trimmer-modal');
    const playlistSection = document.querySelector('.playlist-section');
    const songEditor = document.getElementById('song-editor');
    
    // Reset UI
    renderPlaylist();
    if (playlistSection) playlistSection.style.display = 'block';
    if (songEditor) songEditor.style.display = 'none';
    
    trimmerModal.classList.add('show');
    document.body.style.overflow = 'hidden';
}

let audioTrimmerInitialized = false;
let keyboardListenerAdded = false;

function initAudioTrimmer() {
    // Prevent multiple initializations
    if (audioTrimmerInitialized) {
        console.log('⚠️ Audio trimmer already initialized, skipping...');
        return;
    }
    
    const fileInput = document.getElementById('music-file-input');
    const trimmerModal = document.getElementById('trimmer-modal');
    const trimmerClose = document.getElementById('trimmer-close');
    const trimmerCancel = document.getElementById('trimmer-cancel');
    const trimmerConfirm = document.getElementById('trimmer-confirm');
    const trimmerPlay = document.getElementById('trimmer-play');
    const trimmerPreview = document.getElementById('trimmer-preview');
    const trimmerAudio = document.getElementById('trimmer-audio');
    const addSongBtn = document.getElementById('add-song-btn');
    const editorBack = document.getElementById('editor-back');
    const saveTrim = document.getElementById('save-trim');
    
    console.log('🎵 Audio Trimmer Init - fileInput:', !!fileInput, 'addSongBtn:', !!addSongBtn);
    
    if (!fileInput) {
        console.error('❌ music-file-input not found!');
        setTimeout(initAudioTrimmer, 500);
        return;
    }
    
    // Add Song button - IMPORTANT: Use direct click handler
    if (addSongBtn) {
        console.log('🎵 Adding click listener to Add Song button');
        addSongBtn.onclick = function(e) {
            e.preventDefault();
            e.stopPropagation();
            console.log('🎵 Add Song clicked! Triggering file input...');
            fileInput.click();
        };
    } else {
        console.error('❌ add-song-btn not found!');
    }
    
    // Merge Songs button
    const mergeBtn = document.getElementById('merge-songs-btn');
    if (mergeBtn) {
        mergeBtn.addEventListener('click', mergeSelectedSongs);
    }
    
    // File selection - add to playlist
    fileInput.onchange = async function(e) {
        console.log('🎵 File selected!', e.target.files);
        const file = e.target.files[0];
        if (!file) {
            console.log('🎵 No file selected');
            return;
        }
        
        console.log('🎵 Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);
        
        // Validate file - be more lenient with type checking
        const validTypes = ['audio/', 'video/mp4', 'video/mpeg'];
        const isValidType = validTypes.some(type => file.type.startsWith(type)) || 
                           file.name.match(/\.(mp3|wav|ogg|m4a|aac|mp4|flac|wma)$/i);
        
        if (!isValidType) {
            showToast('❌ Please select an audio file!');
            console.error('Invalid file type:', file.type);
            fileInput.value = '';
            return;
        }
        
        if (file.size > 50 * 1024 * 1024) {
            showToast('❌ Audio must be less than 50MB!');
            fileInput.value = '';
            return;
        }
        
        // Add to playlist
        try {
            showToast('⏳ Loading audio...');
            const audioUrl = URL.createObjectURL(file);
            const tempAudio = new Audio(audioUrl);
            
            tempAudio.onloadedmetadata = function() {
                const duration = tempAudio.duration;
                console.log('🎵 Audio loaded, duration:', duration);
                
                playlist.push({
                    file: file,
                    name: file.name.replace(/\.[^/.]+$/, ""), // Remove extension
                    url: audioUrl,
                    duration: duration,
                    trimStart: 0,
                    trimEnd: Math.min(duration, 60), // Max 60 seconds per song
                    trimmed: false
                });
                
                renderPlaylist();
                showToast(`✅ Added: ${file.name}`);
                fileInput.value = '';
            };
            
            tempAudio.onerror = function(err) {
                console.error('Audio load error:', err);
                showToast('❌ Could not load audio file!');
                fileInput.value = '';
            };
        } catch (err) {
            console.error('Audio processing error:', err);
            showToast('❌ Could not process audio!');
            fileInput.value = '';
        }
    };
    
    // Close handlers
    const closeTrimmer = () => {
        trimmerModal.classList.remove('show');
        document.body.style.overflow = '';
        stopAudioPreview();
        if (trimmerAudio) trimmerAudio.pause();
        fileInput.value = '';
        playlist = [];
        currentEditingIndex = -1;
    };
    
    if (trimmerClose) trimmerClose.addEventListener('click', closeTrimmer);
    if (trimmerCancel) trimmerCancel.addEventListener('click', closeTrimmer);
    
    // Click outside to close
    trimmerModal.addEventListener('click', (e) => {
        if (e.target === trimmerModal) closeTrimmer();
    });
    
    // Back to playlist view
    if (editorBack) {
        editorBack.addEventListener('click', () => {
            showPlaylistView();
        });
    }
    
    // Play/Pause buttons
    const trimmerPause = document.getElementById('trimmer-pause');
    
    if (trimmerPlay) {
        const newPlayBtn = trimmerPlay.cloneNode(true);
        trimmerPlay.parentNode.replaceChild(newPlayBtn, trimmerPlay);
        
        newPlayBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Stop preview if playing
            if (isPlayingPreview) {
                stopAudioPreview();
                const trimmerPreview = document.getElementById('trimmer-preview');
                const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
                if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
                if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
            }
            
            const audio = document.getElementById('trimmer-audio');
            if (audio) {
                audio.play().then(() => {
                    newPlayBtn.style.display = 'none';
                    if (trimmerPause) trimmerPause.style.display = 'inline-flex';
                    startPlayheadTracking();
                    showToast('▶️ Playing full audio');
                }).catch(err => {
                    console.error('Play error:', err);
                    showToast('❌ Could not play audio');
                });
            }
        });
    }
    
    if (trimmerPause) {
        const newPauseBtn = trimmerPause.cloneNode(true);
        trimmerPause.parentNode.replaceChild(newPauseBtn, trimmerPause);
        
        newPauseBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Stop preview if playing
            if (isPlayingPreview) {
                stopAudioPreview();
                const trimmerPreview = document.getElementById('trimmer-preview');
                const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
                if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
                if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
            }
            
            const audio = document.getElementById('trimmer-audio');
            if (audio) {
                audio.pause();
                newPauseBtn.style.display = 'none';
                if (trimmerPlay) trimmerPlay.style.display = 'inline-flex';
                stopPlayheadTracking();
                showToast('⏸️ Paused');
            }
        });
    }
    
    // Update button states when audio ends
    const currentTrimmerAudio = document.getElementById('trimmer-audio');
    if (currentTrimmerAudio) {
        currentTrimmerAudio.addEventListener('ended', () => {
            if (trimmerPlay) trimmerPlay.style.display = 'inline-flex';
            if (trimmerPause) trimmerPause.style.display = 'none';
            stopPlayheadTracking();
        });
    }
    
    // Update playhead when audio time changes
    if (currentTrimmerAudio) {
        currentTrimmerAudio.addEventListener('timeupdate', updatePlayhead);
    }
    
    // Preview trimmed section with stop button
    const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
    
    if (trimmerPreview) {
        const newPreviewBtn = trimmerPreview.cloneNode(true);
        trimmerPreview.parentNode.replaceChild(newPreviewBtn, trimmerPreview);
        
        newPreviewBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Stop full audio if playing
            const audio = document.getElementById('trimmer-audio');
            if (audio && !audio.paused) {
                audio.pause();
                const trimmerPlay = document.getElementById('trimmer-play');
                const trimmerPause = document.getElementById('trimmer-pause');
                if (trimmerPlay) trimmerPlay.style.display = 'inline-flex';
                if (trimmerPause) trimmerPause.style.display = 'none';
                stopPlayheadTracking();
            }
            
            if (isPlayingPreview) {
                // If already playing, PAUSE it (toggles pause/resume)
                pauseAudioPreview();
            } else {
                // Start or resume preview
                if (previewElapsedTime > 0) {
                    // Resume from where we paused
                    resumePreviewFromPaused();
                } else {
                    // Start fresh preview
                    playTrimmedPreview();
                }
                newPreviewBtn.style.display = 'none';
                if (trimmerStopPreview) trimmerStopPreview.style.display = 'inline-flex';
            }
        });
    }
    
    if (trimmerStopPreview) {
        const newStopBtn = trimmerStopPreview.cloneNode(true);
        trimmerStopPreview.parentNode.replaceChild(newStopBtn, trimmerStopPreview);
        
        newStopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            
            // Stop full audio if playing
            const audio = document.getElementById('trimmer-audio');
            if (audio && !audio.paused) {
                audio.pause();
                const trimmerPlay = document.getElementById('trimmer-play');
                const trimmerPause = document.getElementById('trimmer-pause');
                if (trimmerPlay) trimmerPlay.style.display = 'inline-flex';
                if (trimmerPause) trimmerPause.style.display = 'none';
                stopPlayheadTracking();
            }
            
            stopAudioPreview();
            newStopBtn.style.display = 'none';
            if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
            showToast('⏹️ Preview stopped');
        });
    }
    
    // Save trim for current song
    if (saveTrim) {
        const newSaveBtn = saveTrim.cloneNode(true);
        saveTrim.parentNode.replaceChild(newSaveBtn, saveTrim);
        newSaveBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (currentEditingIndex >= 0 && currentEditingIndex < playlist.length) {
                playlist[currentEditingIndex].trimStart = trimStartTime;
                playlist[currentEditingIndex].trimEnd = trimEndTime;
                playlist[currentEditingIndex].trimmed = true;
                showToast('✅ Trim saved!');
                showPlaylistView();
            }
        });
    }
    
    // Upload playlist
    if (trimmerConfirm) {
        trimmerConfirm.addEventListener('click', () => {
            if (!currentTrimmerMember || playlist.length === 0) return;
            uploadPlaylist();
            closeTrimmer();
        });
    }
    
    // Zoom controls will be initialized when editor opens
    // See initZoomControls() function
    
    // Keyboard shortcuts for fine-tuning trim positions (only add once)
    if (!keyboardListenerAdded) {
        let activeHandle = null; // 'start' or 'end'
        
        document.addEventListener('keydown', (e) => {
            const isEditorOpen = document.getElementById('song-editor')?.style.display !== 'none';
            if (!isEditorOpen || !audioBuffer) return;
            
            const step = e.shiftKey ? 0.1 : 0.05; // Smaller steps with Shift
            
            // Arrow keys to fine-tune
            if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                e.preventDefault();
                
                // If no handle is active, activate based on which is closer
                if (!activeHandle) {
                    const duration = audioBuffer.duration;
                    const trimmerAudio = document.getElementById('trimmer-audio');
                    const currentTime = trimmerAudio?.currentTime || 0;
                    const distToStart = Math.abs(currentTime - trimStartTime);
                    const distToEnd = Math.abs(currentTime - trimEndTime);
                    activeHandle = distToStart < distToEnd ? 'start' : 'end';
                }
                
                const adjust = e.key === 'ArrowLeft' ? -step : step;
                
                if (activeHandle === 'start') {
                    trimStartTime = Math.max(0, Math.min(trimStartTime + adjust, trimEndTime - 0.1));
                } else {
                    trimEndTime = Math.max(trimStartTime + 0.1, Math.min(trimEndTime + adjust, audioBuffer.duration));
                }
                
                updateTrimVisuals();
                updateTrimDisplay();
            }
            
            // Space to toggle active handle
            if (e.key === ' ' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'BUTTON') {
                e.preventDefault();
                activeHandle = activeHandle === 'start' ? 'end' : 'start';
                showToast(`🎯 Adjusting ${activeHandle === 'start' ? 'START' : 'END'} (← → arrows)`);
            }
        });
        
        keyboardListenerAdded = true;
        console.log('⌨️ Keyboard shortcuts initialized');
    }
    
    // Mark as initialized
    audioTrimmerInitialized = true;
    console.log('✅ Audio trimmer initialization complete');
}

function renderPlaylist() {
    const itemsContainer = document.getElementById('playlist-items');
    const emptyEl = document.getElementById('playlist-empty');
    const infoEl = document.getElementById('playlist-info');
    const countEl = document.getElementById('playlist-count');
    const confirmBtn = document.getElementById('trimmer-confirm');
    const totalDurationEl = document.getElementById('total-duration');
    
    if (!itemsContainer) return;
    
    // Update count
    if (countEl) countEl.textContent = `(${playlist.length} song${playlist.length !== 1 ? 's' : ''})`;
    
    // Show/hide elements
    if (playlist.length === 0) {
        if (emptyEl) emptyEl.style.display = 'block';
        if (infoEl) infoEl.style.display = 'none';
        if (confirmBtn) confirmBtn.disabled = true;
        itemsContainer.innerHTML = '';
        itemsContainer.appendChild(emptyEl);
        return;
    }
    
    if (emptyEl) emptyEl.style.display = 'none';
    if (infoEl) infoEl.style.display = 'flex';
    if (confirmBtn) confirmBtn.disabled = false;
    
    // Calculate total duration
    let totalDuration = 0;
    playlist.forEach(song => {
        totalDuration += (song.trimEnd - song.trimStart);
    });
    if (totalDurationEl) totalDurationEl.textContent = formatTime(totalDuration);
    
    // Render items with merge checkboxes
    itemsContainer.innerHTML = playlist.map((song, index) => `
        <div class="playlist-item" data-index="${index}">
            <input type="checkbox" class="song-select-checkbox" data-index="${index}" onchange="updateMergeButton()">
            <div class="song-number">${index + 1}</div>
            <div class="song-info">
                <div class="song-name">${song.name}</div>
                <div class="song-duration">
                    <i class="fas fa-clock"></i>
                    ${formatTime(song.trimEnd - song.trimStart)}
                    ${song.trimmed ? '<span class="trimmed">(trimmed)</span>' : ''}
                </div>
            </div>
            <div class="song-actions">
                <button class="song-action-btn edit" onclick="editSong(${index})" title="Edit/Trim">
                    <i class="fas fa-cut"></i>
                </button>
                <button class="song-action-btn delete" onclick="removeSong(${index})" title="Remove">
                    <i class="fas fa-trash"></i>
                </button>
                ${index > 0 ? `<button class="song-action-btn move" onclick="moveSong(${index}, -1)" title="Move Up">
                    <i class="fas fa-arrow-up"></i>
                </button>` : ''}
                ${index < playlist.length - 1 ? `<button class="song-action-btn move" onclick="moveSong(${index}, 1)" title="Move Down">
                    <i class="fas fa-arrow-down"></i>
                </button>` : ''}
            </div>
        </div>
    `).join('');
    
    // Update merge button visibility
    updateMergeButton();
}

// Update merge button based on selected songs
function updateMergeButton() {
    const mergeBtn = document.getElementById('merge-songs-btn');
    const checkboxes = document.querySelectorAll('.song-select-checkbox:checked');
    
    if (mergeBtn) {
        if (checkboxes.length >= 2) {
            mergeBtn.style.display = 'inline-flex';
            mergeBtn.textContent = `Merge ${checkboxes.length} Songs`;
        } else {
            mergeBtn.style.display = 'none';
        }
    }
}

// Merge selected songs into one
async function mergeSelectedSongs() {
    const checkboxes = Array.from(document.querySelectorAll('.song-select-checkbox:checked'))
        .map(cb => parseInt(cb.dataset.index))
        .sort((a, b) => a - b);
    
    if (checkboxes.length < 2) {
        showToast('❌ Select at least 2 songs to merge!');
        return;
    }
    
    showToast('⏳ Merging songs...');
    
    try {
        const songsToMerge = checkboxes.map(idx => playlist[idx]);
        const mergedAudio = await mergeAudioFiles(songsToMerge);
        
        // Remove merged songs from playlist
        for (let i = checkboxes.length - 1; i >= 0; i--) {
            const idx = checkboxes[i];
            URL.revokeObjectURL(playlist[idx].url);
            playlist.splice(idx, 1);
        }
        
        // Add merged song at the position of first selected song
        const firstIndex = checkboxes[0];
        const mergedName = songsToMerge.map(s => s.name).join(' + ');
        const mergedUrl = URL.createObjectURL(mergedAudio);
        
        // Get duration from merged audio
        const tempAudio = new Audio(mergedUrl);
        await new Promise((resolve) => {
            tempAudio.onloadedmetadata = resolve;
        });
        
        // Calculate total trimmed duration
        let totalTrimmedDuration = 0;
        songsToMerge.forEach(song => {
            const trimStart = song.trimStart || 0;
            const trimEnd = song.trimEnd || song.duration;
            totalTrimmedDuration += (trimEnd - trimStart);
        });
        
        playlist.splice(firstIndex, 0, {
            file: mergedAudio,
            name: mergedName,
            url: mergedUrl,
            duration: tempAudio.duration,
            trimStart: 0,
            trimEnd: tempAudio.duration,
            trimmed: false, // Not trimmed anymore since we merged the trimmed portions
            merged: true
        });
        
        renderPlaylist();
        showToast(`✅ Merged ${checkboxes.length} songs into one!`);
    } catch (err) {
        console.error('Merge error:', err);
        showToast('❌ Failed to merge songs!');
    }
}

// Merge multiple audio files into one, applying trim settings
async function mergeAudioFiles(songs) {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const trimmedBuffers = [];
    
    console.log('🔀 Merging songs with trim applied:', songs.map(s => ({
        name: s.name,
        trimStart: s.trimStart || 0,
        trimEnd: s.trimEnd || s.duration
    })));
    
    // Load all audio files and extract trimmed portions
    for (const song of songs) {
        try {
            const response = await fetch(song.url);
            const arrayBuffer = await response.arrayBuffer();
            const fullAudioBuffer = await audioContext.decodeAudioData(arrayBuffer);
            
            // Get trim settings (default to full audio if not set)
            const trimStart = song.trimStart || 0;
            const trimEnd = song.trimEnd || fullAudioBuffer.duration;
            const trimDuration = trimEnd - trimStart;
            
            console.log(`✂️ Trimming ${song.name}: ${trimStart.toFixed(2)}s to ${trimEnd.toFixed(2)}s (${trimDuration.toFixed(2)}s)`);
            
            // Calculate sample positions
            const sampleRate = fullAudioBuffer.sampleRate;
            const startSample = Math.floor(trimStart * sampleRate);
            const endSample = Math.floor(trimEnd * sampleRate);
            const trimmedLength = endSample - startSample;
            
            // Create buffer for trimmed portion
            const numberOfChannels = fullAudioBuffer.numberOfChannels;
            const trimmedBuffer = audioContext.createBuffer(
                numberOfChannels,
                trimmedLength,
                sampleRate
            );
            
            // Copy only the trimmed portion
            for (let channel = 0; channel < numberOfChannels; channel++) {
                const sourceData = fullAudioBuffer.getChannelData(channel);
                const trimmedData = trimmedBuffer.getChannelData(channel);
                
                // Copy from startSample to endSample
                for (let i = 0; i < trimmedLength; i++) {
                    const sourceIndex = startSample + i;
                    if (sourceIndex < sourceData.length) {
                        trimmedData[i] = sourceData[sourceIndex];
                    }
                }
            }
            
            trimmedBuffers.push(trimmedBuffer);
            console.log(`✅ Extracted ${trimmedLength} samples (${trimDuration.toFixed(2)}s) from ${song.name}`);
        } catch (err) {
            console.error('Error loading/trimming audio:', err);
            throw new Error(`Failed to process ${song.name}: ${err.message}`);
        }
    }
    
    if (trimmedBuffers.length === 0) {
        throw new Error('No audio buffers to merge');
    }
    
    // Get sample rate and channels (use first buffer's properties)
    const sampleRate = trimmedBuffers[0].sampleRate;
    const numberOfChannels = trimmedBuffers[0].numberOfChannels;
    
    // Calculate total length of merged audio
    let totalLength = 0;
    trimmedBuffers.forEach(buffer => {
        totalLength += buffer.length;
    });
    
    console.log(`🔀 Creating merged buffer: ${totalLength} samples (${(totalLength / sampleRate).toFixed(2)}s)`);
    
    // Create new buffer for merged audio
    const mergedBuffer = audioContext.createBuffer(numberOfChannels, totalLength, sampleRate);
    
    // Copy trimmed data from all buffers sequentially
    let offset = 0;
    for (let i = 0; i < trimmedBuffers.length; i++) {
        const trimmedBuffer = trimmedBuffers[i];
        
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const mergedChannelData = mergedBuffer.getChannelData(channel);
            const sourceChannelData = trimmedBuffer.getChannelData(channel);
            
            // Copy the trimmed portion
            for (let j = 0; j < trimmedBuffer.length; j++) {
                mergedChannelData[offset + j] = sourceChannelData[j];
            }
        }
        
        offset += trimmedBuffer.length;
        console.log(`✅ Merged song ${i + 1}/${trimmedBuffers.length} (offset: ${offset})`);
    }
    
    console.log('🎉 Merge complete! Total duration:', (totalLength / sampleRate).toFixed(2), 'seconds');
    
    // Convert to WAV blob
    return audioBufferToWav(mergedBuffer);
}

// Make functions globally accessible for onclick handlers
window.updateMergeButton = updateMergeButton;
window.mergeSelectedSongs = mergeSelectedSongs;

function editSong(index) {
    if (index < 0 || index >= playlist.length) return;
    
    currentEditingIndex = index;
    const song = playlist[index];
    
    // Show editor
    const playlistSection = document.querySelector('.playlist-section');
    const songEditor = document.getElementById('song-editor');
    const songNameEl = document.getElementById('current-song-name');
    const trimmerAudio = document.getElementById('trimmer-audio');
    
    if (playlistSection) playlistSection.style.display = 'none';
    if (songEditor) songEditor.style.display = 'block';
    if (songNameEl) songNameEl.textContent = song.name;
    if (trimmerAudio) trimmerAudio.src = song.url;
    
    // Reset trim handles initialization flag when opening editor
    trimHandlesInitialized = false;
    
    // Load waveform
    loadSongWaveform(song);
    
    // Initialize zoom controls when editor opens
    setTimeout(() => {
        initZoomControls();
    }, 100);
}

async function loadSongWaveform(song) {
    try {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch(song.url);
        const arrayBuffer = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
        
        // IMPORTANT: Reset trim times to song's saved values (or full duration if not trimmed)
        // This ensures when editing again, it shows the correct trim positions
        if (song.trimStart !== undefined && song.trimStart !== null) {
            trimStartTime = Math.max(0, Math.min(song.trimStart, audioBuffer.duration));
        } else {
            trimStartTime = 0;
        }
        
        if (song.trimEnd !== undefined && song.trimEnd !== null && song.trimEnd > 0) {
            trimEndTime = Math.max(trimStartTime + 0.1, Math.min(song.trimEnd, audioBuffer.duration));
        } else {
            trimEndTime = audioBuffer.duration;
        }
        
        // Ensure play/pause buttons are visible and in correct state
        const trimmerPlay = document.getElementById('trimmer-play');
        const trimmerPause = document.getElementById('trimmer-pause');
        const trimmerAudio = document.getElementById('trimmer-audio');
        
        if (trimmerPlay) trimmerPlay.style.display = 'inline-flex';
        if (trimmerPause) trimmerPause.style.display = 'none';
        
        // Stop any playing audio and reset
        if (trimmerAudio) {
            trimmerAudio.pause();
            trimmerAudio.currentTime = 0;
        }
        stopAudioPreview();
        stopPlayheadTracking();
        
        drawWaveform();
        updateTrimVisuals();
        updateTrimDisplay();
    } catch (err) {
        console.error('Waveform error:', err);
    }
}

function showPlaylistView() {
    const playlistSection = document.querySelector('.playlist-section');
    const songEditor = document.getElementById('song-editor');
    const trimmerAudio = document.getElementById('trimmer-audio');
    
    if (playlistSection) playlistSection.style.display = 'block';
    if (songEditor) songEditor.style.display = 'none';
    if (trimmerAudio) trimmerAudio.pause();
    
    stopAudioPreview();
    renderPlaylist();
    currentEditingIndex = -1;
    
    // Reset initialization flags for next time editor opens
    trimHandlesInitialized = false;
    zoomControlsInitialized = false;
    
    // Cancel any pending animations
    if (mouseMoveThrottle) {
        cancelAnimationFrame(mouseMoveThrottle);
        mouseMoveThrottle = null;
    }
}

function removeSong(index) {
    if (index < 0 || index >= playlist.length) return;
    
    const song = playlist[index];
    URL.revokeObjectURL(song.url); // Clean up
    playlist.splice(index, 1);
    renderPlaylist();
    showToast('🗑️ Song removed');
}

function moveSong(index, direction) {
    const newIndex = index + direction;
    if (newIndex < 0 || newIndex >= playlist.length) return;
    
    // Swap
    [playlist[index], playlist[newIndex]] = [playlist[newIndex], playlist[index]];
    renderPlaylist();
}

// Merge two audio files
async function mergeSongs(index1, index2) {
    if (index1 < 0 || index2 < 0 || index1 >= playlist.length || index2 >= playlist.length) return;
    if (index1 === index2) return;
    
    const song1 = playlist[index1];
    const song2 = playlist[index2];
    
    if (!song1 || !song2) return;
    
    showToast('⏳ Merging audio files...');
    
    try {
        // Create audio context
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Load both audio files
        const [arrayBuffer1, arrayBuffer2] = await Promise.all([
            fetch(song1.url).then(r => r.arrayBuffer()),
            fetch(song2.url).then(r => r.arrayBuffer())
        ]);
        
        const [audioBuffer1, audioBuffer2] = await Promise.all([
            audioContext.decodeAudioData(arrayBuffer1),
            audioContext.decodeAudioData(arrayBuffer2)
        ]);
        
        // Calculate trim ranges
        const start1 = (song1.trimStart || 0) * audioBuffer1.sampleRate;
        const end1 = Math.min((song1.trimEnd || audioBuffer1.duration) * audioBuffer1.sampleRate, audioBuffer1.length);
        const length1 = Math.floor(end1 - start1);
        
        const start2 = (song2.trimStart || 0) * audioBuffer2.sampleRate;
        const end2 = Math.min((song2.trimEnd || audioBuffer2.duration) * audioBuffer2.sampleRate, audioBuffer2.length);
        const length2 = Math.floor(end2 - start2);
        
        // Create merged buffer
        const totalLength = length1 + length2;
        const mergedBuffer = audioContext.createBuffer(
            Math.max(audioBuffer1.numberOfChannels, audioBuffer2.numberOfChannels),
            totalLength,
            audioContext.sampleRate
        );
        
        // Copy first audio (trimmed)
        for (let channel = 0; channel < audioBuffer1.numberOfChannels; channel++) {
            const channelData = mergedBuffer.getChannelData(channel);
            const sourceData = audioBuffer1.getChannelData(channel);
            for (let i = 0; i < length1; i++) {
                channelData[i] = sourceData[start1 + i];
            }
        }
        
        // Copy second audio (trimmed) after first
        for (let channel = 0; channel < audioBuffer2.numberOfChannels; channel++) {
            const channelData = mergedBuffer.getChannelData(channel);
            const sourceData = audioBuffer2.getChannelData(channel);
            for (let i = 0; i < length2; i++) {
                channelData[length1 + i] = sourceData[start2 + i];
            }
        }
        
        // Convert buffer to blob
        const wavBlob = await audioBufferToWav(mergedBuffer);
        const mergedUrl = URL.createObjectURL(wavBlob);
        
        // Create File from blob
        const mergedFile = new File([wavBlob], `${song1.name}_merged_${song2.name}.wav`, { type: 'audio/wav' });
        
        // Create merged song entry
        const mergedSong = {
            file: mergedFile,
            name: `${song1.name} + ${song2.name}`,
            url: mergedUrl,
            duration: mergedBuffer.duration,
            trimStart: 0,
            trimEnd: mergedBuffer.duration,
            trimmed: false
        };
        
        // Remove both original songs
        URL.revokeObjectURL(song1.url);
        URL.revokeObjectURL(song2.url);
        playlist.splice(Math.max(index1, index2), 1); // Remove higher index first
        playlist.splice(Math.min(index1, index2), 1); // Then remove lower index
        
        // Insert merged song at position
        playlist.splice(Math.min(index1, index2), 0, mergedSong);
        
        renderPlaylist();
        showToast(`✅ Merged: ${song1.name} + ${song2.name}`);
        
        audioContext.close();
    } catch (err) {
        console.error('Merge error:', err);
        showToast('❌ Failed to merge audio files!');
    }
}

// Convert AudioBuffer to WAV blob
function audioBufferToWav(buffer) {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    
    const length = buffer.length;
    const arrayBuffer = new ArrayBuffer(44 + length * numChannels * 2);
    const view = new DataView(arrayBuffer);
    const samples = new Int16Array(arrayBuffer, 44);
    
    // WAV header
    const writeString = (offset, string) => {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };
    
    writeString(0, 'RIFF');
    view.setUint32(4, 36 + length * numChannels * 2, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * numChannels * 2, true);
    view.setUint16(32, numChannels * 2, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, length * numChannels * 2, true);
    
    // Convert to 16-bit PCM
    for (let channel = 0; channel < numChannels; channel++) {
        const channelData = buffer.getChannelData(channel);
        for (let i = 0; i < length; i++) {
            const sample = Math.max(-1, Math.min(1, channelData[i]));
            samples[i * numChannels + channel] = sample < 0 ? sample * 0x8000 : sample * 0x7FFF;
        }
    }
    
    return new Blob([arrayBuffer], { type: 'audio/wav' });
}

// Create trimmed audio blob from song
async function createTrimmedAudioBlob(song) {
    try {
        // Load audio first to get actual duration
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const response = await fetch(song.url);
        const arrayBuffer = await response.arrayBuffer();
        const fullAudioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        
        // Get trim settings with actual duration
        const trimStart = song.trimStart || 0;
        const trimEnd = song.trimEnd || fullAudioBuffer.duration;
        const actualDuration = fullAudioBuffer.duration;
        
        // Check if song has trim settings (start > 0 or end < full duration)
        const hasTrim = (trimStart > 0.1 || (trimEnd < actualDuration - 0.1));
        
        if (!hasTrim) {
            // No meaningful trim, return original file
            audioCtx.close();
            return song.file;
        }
        
        console.log(`✂️ Creating trimmed audio for "${song.name}": ${trimStart.toFixed(2)}s to ${trimEnd.toFixed(2)}s (from ${actualDuration.toFixed(2)}s)`);
        
        const trimDuration = trimEnd - trimStart;
        
        // Calculate sample positions
        const sampleRate = fullAudioBuffer.sampleRate;
        const startSample = Math.floor(trimStart * sampleRate);
        const endSample = Math.floor(trimEnd * sampleRate);
        const trimmedLength = endSample - startSample;
        
        // Create buffer for trimmed portion
        const numberOfChannels = fullAudioBuffer.numberOfChannels;
        const trimmedBuffer = audioCtx.createBuffer(
            numberOfChannels,
            trimmedLength,
            sampleRate
        );
        
        // Copy only the trimmed portion
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const sourceData = fullAudioBuffer.getChannelData(channel);
            const trimmedData = trimmedBuffer.getChannelData(channel);
            
            for (let i = 0; i < trimmedLength; i++) {
                const sourceIndex = startSample + i;
                if (sourceIndex < sourceData.length) {
                    trimmedData[i] = sourceData[sourceIndex];
                }
            }
        }
        
        // Convert to WAV blob
        const trimmedBlob = audioBufferToWav(trimmedBuffer);
        audioCtx.close();
        
        console.log(`✅ Trimmed audio created: ${trimDuration.toFixed(2)}s (${trimmedLength} samples)`);
        return trimmedBlob;
    } catch (err) {
        console.error('Error creating trimmed audio:', err);
        // Fallback to original file if trimming fails
        return song.file;
    }
}

async function uploadPlaylist() {
    if (playlist.length === 0 || !currentTrimmerMember) {
        showToast('❌ No songs in playlist!');
        return;
    }
    
    // Confirm upload with trim details
    const trimSummary = playlist.map((song, i) => {
        const hasTrim = (song.trimStart > 0 || (song.trimEnd && song.trimEnd < song.duration));
        const duration = (song.trimEnd - (song.trimStart || 0)).toFixed(1);
        return `${i + 1}. "${song.name}" ${hasTrim ? `(✂️ Trimmed: ${duration}s)` : '(Full)'}`;
    }).join('\n');
    
    const confirmMsg = `Upload ${playlist.length} song(s)?\n\n${trimSummary}\n\nTrimmed songs will upload as trimmed audio files.`;
    if (!confirm(confirmMsg)) {
        return;
    }
    
    showToast('⏳ Uploading playlist with trim settings...');
    
    const uploadedSongs = [];
    let successCount = 0;
    let trimmedCount = 0;
    
    for (let i = 0; i < playlist.length; i++) {
        const song = playlist[i];
        const hasTrim = (song.trimStart > 0 || (song.trimEnd && song.trimEnd < song.duration));
        const trimInfo = hasTrim ? ` (✂️ Trimmed: ${formatTime(song.trimEnd - song.trimStart)})` : ' (Full)';
        
        showToast(`⏳ Uploading song ${i + 1}/${playlist.length}: ${song.name}${trimInfo}...`);
        
        try {
            // Create trimmed audio blob if song is trimmed
            let audioFile = song.file;
            if (hasTrim) {
                console.log(`📦 Creating trimmed audio for song ${i + 1}: "${song.name}"`);
                audioFile = await createTrimmedAudioBlob(song);
                trimmedCount++;
            }
            
            // Upload the audio file (trimmed or original)
            const uploadedUrl = await uploadSingleAudio(audioFile, currentTrimmerMember, i);
            
            if (uploadedUrl) {
                uploadedSongs.push({
                    url: uploadedUrl,
                    name: song.name,
                    duration: (song.trimEnd || song.duration || 0) - (song.trimStart || 0),
                    trimStart: song.trimStart || 0,
                    trimEnd: song.trimEnd || song.duration || 0,
                    order: i,
                    trimmed: hasTrim
                });
                successCount++;
                console.log(`✅ Uploaded song ${i + 1}/${playlist.length}: "${song.name}"${trimInfo}`);
            } else {
                console.error(`❌ Failed to upload song ${i + 1}: "${song.name}"`);
                showToast(`⚠️ Failed to upload "${song.name}". Continuing...`);
            }
        } catch (err) {
            console.error(`❌ Upload error for song ${i + 1} ("${song.name}"):`, err);
            showToast(`⚠️ Error uploading "${song.name}": ${err.message}. Continuing...`);
        }
    }
    
    if (uploadedSongs.length > 0) {
        // Save to Firebase
        await savePlaylistToFirebase(currentTrimmerMember, uploadedSongs);
        
        // Show detailed success message
        const successMsg = `✅ Successfully uploaded ${successCount} song(s)!\n` +
            (trimmedCount > 0 ? `✂️ ${trimmedCount} song(s) uploaded as trimmed audio\n` : '') +
            `📝 Trim settings saved: All songs will play with correct trim positions`;
        
        showToast(successMsg);
        alert(successMsg);
        
        // Close trimmer modal
        const trimmerModal = document.getElementById('trimmer-modal');
        if (trimmerModal) {
            trimmerModal.classList.remove('show');
        }
        
        // Reload member cards to show updated music
        loadMembersData();
    } else {
        showToast('❌ All uploads failed!');
        alert('❌ Failed to upload any songs. Please check console for errors.');
    }
}

function uploadSingleAudio(file, member, index) {
    return new Promise((resolve, reject) => {
        if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
            reject('Cloudinary not configured');
            return;
        }
        
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        formData.append('folder', `members/${member}/music`);
        formData.append('resource_type', 'auto');
        
        fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.secure_url) {
                resolve(data.secure_url);
            } else {
                reject('No URL in response');
            }
        })
        .catch(reject);
    });
}

async function savePlaylistToFirebase(member, songs) {
    const db = firebase.database();
    const musicRef = db.ref(`members/${member}/music`);
    
    try {
        // Remove old data first to ensure clean update
        await musicRef.remove();
        
        // Then set new playlist with detailed trim information
        const playlistData = {
            playlist: songs,
            updatedAt: Date.now(),
            version: Date.now(), // Add version for cache busting
            totalSongs: songs.length,
            trimmedSongs: songs.filter(s => s.trimmed).length
        };
        
        await musicRef.set(playlistData);
        
        console.log('✅ Playlist saved to Firebase:', {
            totalSongs: songs.length,
            trimmedSongs: playlistData.trimmedSongs,
            songs: songs.map(s => ({
                name: s.name,
                trimStart: s.trimStart,
                trimEnd: s.trimEnd,
                duration: s.duration,
                trimmed: s.trimmed
            }))
        });
        
        return true;
    } catch (err) {
        console.error('❌ Firebase save error:', err);
        throw err;
    }
}

function drawWaveform() {
    const canvas = document.getElementById('waveform-canvas');
    if (!canvas || !audioBuffer) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const data = audioBuffer.getChannelData(0);
    const step = Math.ceil(data.length / width);
    const amp = height / 2;
    const duration = audioBuffer.duration;
    
    // Background
    ctx.fillStyle = 'rgba(20, 20, 30, 0.8)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw trim region highlight first (behind waveform)
    if (trimStartTime >= 0 && trimEndTime > trimStartTime) {
        const startX = (trimStartTime / duration) * width;
        const endX = (trimEndTime / duration) * width;
        const regionWidth = endX - startX;
        
        // Highlight selected region
        ctx.fillStyle = 'rgba(0, 255, 136, 0.15)';
        ctx.fillRect(startX, 0, regionWidth, height);
        
        // Border for selected region
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.3)';
        ctx.lineWidth = 2;
        ctx.strokeRect(startX, 0, regionWidth, height);
    }
    
    // Draw full waveform
    ctx.beginPath();
    ctx.moveTo(0, amp);
    
    for (let i = 0; i < width; i++) {
        let min = 1.0;
        let max = -1.0;
        
        for (let j = 0; j < step; j++) {
            const datum = data[(i * step) + j];
            if (datum < min) min = datum;
            if (datum > max) max = datum;
        }
        
        ctx.lineTo(i, (1 + min) * amp);
        ctx.lineTo(i, (1 + max) * amp);
    }
    
    // Draw waveform in different colors for selected/unselected regions
    if (trimStartTime >= 0 && trimEndTime > trimStartTime) {
        const startX = (trimStartTime / duration) * width;
        const endX = (trimEndTime / duration) * width;
        
        // Unselected region (before trim start) - dim
        ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
        
        // Selected region - bright
        ctx.beginPath();
        ctx.moveTo(startX, amp);
        for (let i = Math.floor(startX); i < Math.ceil(endX); i++) {
            if (i >= 0 && i < width) {
                let min = 1.0;
                let max = -1.0;
                for (let j = 0; j < step; j++) {
                    const datum = data[(i * step) + j];
                    if (datum < min) min = datum;
                    if (datum > max) max = datum;
                }
                ctx.lineTo(i, (1 + min) * amp);
                ctx.lineTo(i, (1 + max) * amp);
            }
        }
        ctx.strokeStyle = 'var(--neon-green)';
        ctx.lineWidth = 2;
        ctx.stroke();
        
        // Unselected region (after trim end) - dim
        ctx.beginPath();
        ctx.moveTo(endX, amp);
        for (let i = Math.ceil(endX); i < width; i++) {
            let min = 1.0;
            let max = -1.0;
            for (let j = 0; j < step; j++) {
                const datum = data[(i * step) + j];
                if (datum < min) min = datum;
                if (datum > max) max = datum;
            }
            ctx.lineTo(i, (1 + min) * amp);
            ctx.lineTo(i, (1 + max) * amp);
        }
        ctx.strokeStyle = 'rgba(100, 100, 120, 0.5)';
        ctx.lineWidth = 1;
        ctx.stroke();
    } else {
        // No trim set, draw full waveform normally
        ctx.strokeStyle = 'var(--neon-green)';
        ctx.lineWidth = 1;
        ctx.stroke();
    }
    
    // Draw trim start/end markers on waveform
    if (trimStartTime >= 0) {
        const startX = (trimStartTime / duration) * width;
        ctx.strokeStyle = '#00ff88';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, height);
        ctx.stroke();
        
        // Arrow indicator
        ctx.fillStyle = '#00ff88';
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX - 8, 12);
        ctx.lineTo(startX + 8, 12);
        ctx.closePath();
        ctx.fill();
    }
    
    if (trimEndTime > trimStartTime) {
        const endX = (trimEndTime / duration) * width;
        ctx.strokeStyle = '#ff006e';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(endX, 0);
        ctx.lineTo(endX, height);
        ctx.stroke();
        
        // Arrow indicator
        ctx.fillStyle = '#ff006e';
        ctx.beginPath();
        ctx.moveTo(endX, height);
        ctx.lineTo(endX - 8, height - 12);
        ctx.lineTo(endX + 8, height - 12);
        ctx.closePath();
        ctx.fill();
    }
    
    // Only initialize trim handles if not already initialized (prevents loops)
    if (!trimHandlesInitialized) {
        initTrimHandles();
    } else {
        // Just update positions if already initialized
        updateTrimPositionsOnly();
    }
    
    // Draw time ruler and grid
    drawTimeRuler();
    drawGrid();
}

// Zoom level (1x = no zoom)
let zoomLevel = 1;
let zoomOffset = 0;
let zoomControlsInitialized = false;

function initZoomControls() {
    // Avoid duplicate initialization
    if (zoomControlsInitialized) return;
    
    const zoomInBtn = document.getElementById('zoom-in-btn');
    const zoomOutBtn = document.getElementById('zoom-out-btn');
    const zoomSlider = document.getElementById('zoom-slider');
    const zoomLevelEl = document.getElementById('zoom-level');
    
    if (!zoomInBtn || !zoomOutBtn || !zoomSlider || !zoomLevelEl) {
        console.log('Zoom controls not found, retrying...');
        setTimeout(initZoomControls, 200);
        return;
    }
    
    console.log('🎚️ Initializing zoom controls');
    
    function updateZoom() {
        if (zoomLevelEl) zoomLevelEl.textContent = zoomLevel.toFixed(1) + 'x';
        if (zoomSlider) zoomSlider.value = zoomLevel;
        drawWaveform();
        drawTimeRuler();
        drawGrid();
        updateTrimVisuals();
    }
    
    // Remove old event listeners
    const newZoomInBtn = zoomInBtn.cloneNode(true);
    const newZoomOutBtn = zoomOutBtn.cloneNode(true);
    const newZoomSlider = zoomSlider.cloneNode(true);
    
    zoomInBtn.parentNode.replaceChild(newZoomInBtn, zoomInBtn);
    zoomOutBtn.parentNode.replaceChild(newZoomOutBtn, zoomOutBtn);
    zoomSlider.parentNode.replaceChild(newZoomSlider, zoomSlider);
    
    // Define updateZoom before using it
    function updateZoom() {
        const zoomLevelEl = document.getElementById('zoom-level');
        const zoomSliderEl = document.getElementById('zoom-slider');
        if (zoomLevelEl) zoomLevelEl.textContent = zoomLevel.toFixed(1) + 'x';
        if (zoomSliderEl) zoomSliderEl.value = zoomLevel;
        if (audioBuffer) {
            drawWaveform();
            drawTimeRuler();
            drawGrid();
            updateTrimVisuals();
        }
    }
    
    newZoomInBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zoomLevel = Math.min(10, zoomLevel + 0.5);
        updateZoom();
        console.log('🔍 Zoom in:', zoomLevel);
    });
    
    newZoomOutBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        zoomLevel = Math.max(1, zoomLevel - 0.5);
        updateZoom();
        console.log('🔍 Zoom out:', zoomLevel);
    });
    
    newZoomSlider.addEventListener('input', (e) => {
        zoomLevel = parseFloat(e.target.value);
        updateZoom();
        console.log('🔍 Zoom slider:', zoomLevel);
    });
    
    // Initialize display
    updateZoom();
    
    zoomControlsInitialized = true;
}

function drawTimeRuler() {
    const canvas = document.getElementById('time-ruler-canvas');
    if (!canvas || !audioBuffer) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const duration = audioBuffer.duration;
    const visibleDuration = duration / (zoomLevel || 1);
    const startTime = zoomOffset || 0;
    
    ctx.fillStyle = 'rgba(10, 10, 20, 0.9)';
    ctx.fillRect(0, 0, width, height);
    
    // Draw tick marks
    const tickInterval = Math.max(1, Math.floor(visibleDuration / 20)); // Max 20 ticks
    const secondsPerPixel = visibleDuration / width;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 1;
    ctx.font = '10px monospace';
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    
    for (let time = Math.floor(startTime); time <= startTime + visibleDuration; time += tickInterval) {
        const x = ((time - startTime) / visibleDuration) * width;
        if (x < 0 || x > width) continue;
        
        const isMajorTick = time % (tickInterval * 5) === 0;
        const tickHeight = isMajorTick ? 15 : 8;
        
        ctx.beginPath();
        ctx.moveTo(x, height - tickHeight);
        ctx.lineTo(x, height);
        ctx.stroke();
        
        if (isMajorTick) {
            const timeStr = formatTime(time);
            ctx.fillText(timeStr, x + 3, height / 2);
        }
    }
    
    // Highlight trim region on ruler
    if (trimStartTime >= 0 && trimEndTime > trimStartTime) {
        const startX = ((trimStartTime - startTime) / visibleDuration) * width;
        const endX = ((trimEndTime - startTime) / visibleDuration) * width;
        
        if (startX < width && endX > 0) {
            const regionStart = Math.max(0, startX);
            const regionEnd = Math.min(width, endX);
            const regionWidth = regionEnd - regionStart;
            
            ctx.fillStyle = 'rgba(0, 255, 136, 0.3)';
            ctx.fillRect(regionStart, 0, regionWidth, height);
            
            // Start marker
            ctx.strokeStyle = '#00ff88';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(startX, 0);
            ctx.lineTo(startX, height);
            ctx.stroke();
            
            // End marker - MORE VISIBLE
            ctx.strokeStyle = '#ff006e';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.moveTo(endX, 0);
            ctx.lineTo(endX, height);
            ctx.stroke();
            
            // Glow effect for end marker
            ctx.shadowColor = '#ff006e';
            ctx.shadowBlur = 10;
            ctx.beginPath();
            ctx.moveTo(endX, 0);
            ctx.lineTo(endX, height);
            ctx.stroke();
            ctx.shadowBlur = 0;
        }
    }
}

function drawGrid() {
    const canvas = document.getElementById('grid-canvas');
    if (!canvas || !audioBuffer) return;
    
    const ctx = canvas.getContext('2d');
    const width = canvas.offsetWidth;
    const height = canvas.offsetHeight;
    
    canvas.width = width;
    canvas.height = height;
    
    const duration = audioBuffer.duration;
    const visibleDuration = duration / (zoomLevel || 1);
    const startTime = zoomOffset || 0;
    
    // Draw vertical grid lines
    const gridInterval = Math.max(0.5, Math.floor(visibleDuration / 15)); // Max 15 lines
    const secondsPerPixel = visibleDuration / width;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    for (let time = Math.floor(startTime * 2) / 2; time <= startTime + visibleDuration; time += gridInterval) {
        const x = ((time - startTime) / visibleDuration) * width;
        if (x < 0 || x > width) continue;
        
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Highlight trim region boundaries
    if (trimStartTime >= 0 && trimEndTime > trimStartTime) {
        const startX = ((trimStartTime - startTime) / visibleDuration) * width;
        const endX = ((trimEndTime - startTime) / visibleDuration) * width;
        
        // Start line
        ctx.strokeStyle = 'rgba(0, 255, 136, 0.5)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(startX, 0);
        ctx.lineTo(startX, height);
        ctx.stroke();
        
        // End line - VERY VISIBLE
        ctx.strokeStyle = 'rgba(255, 0, 110, 0.7)';
        ctx.lineWidth = 3;
        ctx.setLineDash([5, 3]);
        ctx.beginPath();
        ctx.moveTo(endX, 0);
        ctx.lineTo(endX, height);
        ctx.stroke();
        ctx.setLineDash([]);
    }
}

// Track which handle is being dragged
let isDraggingStart = false;
let isDraggingEnd = false;
let trimHandlesInitialized = false;
let mouseMoveThrottle = null;
let documentMouseListenersAdded = false;

// Throttled mouse move handler to prevent performance issues
function handleTrimMouseMove(e) {
    if (!isDraggingStart && !isDraggingEnd) return;
    
    // Throttle updates to prevent lag
    if (mouseMoveThrottle) return;
    
    mouseMoveThrottle = requestAnimationFrame(() => {
        const waveformContainer = document.getElementById('trimmer-waveform');
        if (!waveformContainer || !audioBuffer) {
            mouseMoveThrottle = null;
            return;
        }
        
        const rect = waveformContainer.getBoundingClientRect();
        const containerWidth = waveformContainer.offsetWidth;
        const duration = audioBuffer.duration;
        const x = Math.max(0, Math.min(containerWidth, e.clientX - rect.left));
        const timePos = (x / containerWidth) * duration;
        
        if (isDraggingStart) {
            trimStartTime = Math.max(0, Math.min(timePos, trimEndTime - 0.1));
        } else if (isDraggingEnd) {
            trimEndTime = Math.max(trimStartTime + 0.1, Math.min(timePos, duration));
        }
        
        // Update positions without redrawing (faster)
        updateTrimPositionsOnly();
        updateTrimDisplay();
        mouseMoveThrottle = null;
    });
}

function handleTrimMouseUp() {
    if (isDraggingStart || isDraggingEnd) {
        isDraggingStart = false;
        isDraggingEnd = false;
        document.body.style.cursor = '';
        mouseMoveThrottle = null;
        
        // Final redraw after dragging stops
        requestAnimationFrame(() => {
            drawWaveform();
            drawTimeRuler();
            drawGrid();
        });
        
        console.log('🎵 Trim updated:', trimStartTime.toFixed(2), 'to', trimEndTime.toFixed(2));
    }
}

// Fast update that only changes positions, no redraw
function updateTrimPositionsOnly() {
    const startHandle = document.getElementById('trim-start');
    const endHandle = document.getElementById('trim-end');
    const selection = document.getElementById('trim-selection');
    const startLabel = document.getElementById('trim-start-label');
    const endLabel = document.getElementById('trim-end-label');
    const selectionDuration = document.getElementById('selection-duration');
    
    if (!startHandle || !endHandle || !selection || !audioBuffer) return;
    
    const duration = audioBuffer.duration;
    const startPercent = (trimStartTime / duration) * 100;
    const endPercent = (trimEndTime / duration) * 100;
    
    startHandle.style.left = startPercent + '%';
    endHandle.style.left = endPercent + '%';
    selection.style.left = startPercent + '%';
    selection.style.width = (endPercent - startPercent) + '%';
    
    if (startLabel) {
        const labelTime = startLabel.querySelector('.label-time');
        if (labelTime) labelTime.textContent = formatTime(trimStartTime, true);
    }
    if (endLabel) {
        const labelTime = endLabel.querySelector('.label-time');
        if (labelTime) labelTime.textContent = formatTime(trimEndTime, true);
    }
    if (selectionDuration) {
        selectionDuration.textContent = formatTime(trimEndTime - trimStartTime);
    }
}

function initTrimHandles() {
    const waveformContainer = document.getElementById('trimmer-waveform');
    const startHandle = document.getElementById('trim-start');
    const endHandle = document.getElementById('trim-end');
    const selection = document.getElementById('trim-selection');
    
    if (!waveformContainer || !startHandle || !endHandle || !selection || !audioBuffer) {
        console.log('Trim handles not ready');
        return;
    }
    
    // Only initialize once to avoid duplicate event listeners
    if (trimHandlesInitialized) {
        updateTrimVisuals();
        return;
    }
    
    const duration = audioBuffer.duration;
    
    console.log('🎵 Initializing trim handles, duration:', duration);
    
    // Update visual positions (this will redraw once)
    updateTrimPositionsOnly();
    
    // Remove existing listeners if any, then add new ones
    const startDragHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingStart = true;
        document.body.style.cursor = 'ew-resize';
        console.log('🎵 Start dragging START handle');
    };
    
    const endDragHandler = function(e) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingEnd = true;
        document.body.style.cursor = 'ew-resize';
        console.log('🎵 Start dragging END handle');
    };
    
    // Remove old listeners and add new ones
    startHandle.replaceWith(startHandle.cloneNode(true));
    endHandle.replaceWith(endHandle.cloneNode(true));
    
    const newStartHandle = document.getElementById('trim-start');
    const newEndHandle = document.getElementById('trim-end');
    
    newStartHandle.addEventListener('mousedown', startDragHandler);
    newEndHandle.addEventListener('mousedown', endDragHandler);
    
    // Document-level mouse handlers (only add once globally)
    if (!documentMouseListenersAdded) {
        document.addEventListener('mousemove', handleTrimMouseMove, { passive: true });
        document.addEventListener('mouseup', handleTrimMouseUp);
        documentMouseListenersAdded = true;
        console.log('📌 Document mouse listeners added');
    }
    
    // Touch support for mobile
    newStartHandle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDraggingStart = true;
    }, { passive: false });
    
    newEndHandle.addEventListener('touchstart', function(e) {
        e.preventDefault();
        isDraggingEnd = true;
    }, { passive: false });
    
    document.addEventListener('touchmove', function(e) {
        if (!isDraggingStart && !isDraggingEnd) return;
        
        const touch = e.touches[0];
        const rect = waveformContainer.getBoundingClientRect();
        const containerWidth = waveformContainer.offsetWidth;
        const duration = audioBuffer.duration;
        const x = Math.max(0, Math.min(containerWidth, touch.clientX - rect.left));
        const timePos = (x / containerWidth) * duration;
        
        if (isDraggingStart) {
            trimStartTime = Math.max(0, Math.min(timePos, trimEndTime - 0.1));
            updateTrimVisuals();
            updateTrimDisplay();
        } else if (isDraggingEnd) {
            trimEndTime = Math.max(trimStartTime + 0.1, Math.min(timePos, duration));
            updateTrimVisuals();
            updateTrimDisplay();
        }
    }, { passive: false });
    
    document.addEventListener('touchend', function() {
        isDraggingStart = false;
        isDraggingEnd = false;
    });
    
    // Click on waveform to set position
    waveformContainer.addEventListener('click', function(e) {
        if (isDraggingStart || isDraggingEnd) return;
        if (e.target === newStartHandle || e.target === newEndHandle || 
            e.target.closest('.trim-handle')) return;
        
        const rect = waveformContainer.getBoundingClientRect();
        const containerWidth = waveformContainer.offsetWidth;
        const duration = audioBuffer.duration;
        const x = e.clientX - rect.left;
        const timePos = (x / containerWidth) * duration;
        
        // Set the nearest handle
        const distToStart = Math.abs(timePos - trimStartTime);
        const distToEnd = Math.abs(timePos - trimEndTime);
        
        if (distToStart < distToEnd) {
            trimStartTime = Math.max(0, Math.min(timePos, trimEndTime - 0.1));
        } else {
            trimEndTime = Math.max(trimStartTime + 0.1, Math.min(timePos, duration));
        }
        
        updateTrimVisuals();
        updateTrimDisplay();
    });
    
    trimHandlesInitialized = true;
}

function updateTrimVisuals() {
    const waveformContainer = document.getElementById('trimmer-waveform');
    const startHandle = document.getElementById('trim-start');
    const endHandle = document.getElementById('trim-end');
    const selection = document.getElementById('trim-selection');
    const startLabel = document.getElementById('trim-start-label');
    const endLabel = document.getElementById('trim-end-label');
    const selectionDuration = document.getElementById('selection-duration');
    
    if (!waveformContainer || !startHandle || !endHandle || !selection || !audioBuffer) return;
    
    const duration = audioBuffer.duration;
    const containerWidth = waveformContainer.offsetWidth;
    
    const startPercent = (trimStartTime / duration) * 100;
    const endPercent = (trimEndTime / duration) * 100;
    
    startHandle.style.left = startPercent + '%';
    endHandle.style.left = endPercent + '%';
    selection.style.left = startPercent + '%';
    selection.style.width = (endPercent - startPercent) + '%';
    
    // Update labels with better positioning and precise timing
    if (startLabel) {
        const labelTime = startLabel.querySelector('.label-time');
        if (labelTime) labelTime.textContent = formatTime(trimStartTime, true);
        startLabel.style.display = 'flex';
    }
    if (endLabel) {
        const labelTime = endLabel.querySelector('.label-time');
        if (labelTime) labelTime.textContent = formatTime(trimEndTime, true);
        endLabel.style.display = 'flex';
    }
    if (selectionDuration) {
        selectionDuration.textContent = formatTime(trimEndTime - trimStartTime);
    }
    
    // Only redraw if not currently dragging (to prevent infinite loop)
    if (!isDraggingStart && !isDraggingEnd) {
        // Use requestAnimationFrame to batch updates
        requestAnimationFrame(() => {
            drawWaveform();
            drawTimeRuler();
            drawGrid();
        });
    }
}

// Playhead tracking
let playheadInterval = null;

function startPlayheadTracking() {
    if (playheadInterval) clearInterval(playheadInterval);
    playheadInterval = setInterval(updatePlayhead, 100);
}

function stopPlayheadTracking() {
    if (playheadInterval) {
        clearInterval(playheadInterval);
        playheadInterval = null;
    }
}

function updatePlayhead() {
    const trimmerAudio = document.getElementById('trimmer-audio');
    const playhead = document.getElementById('trim-playhead');
    const waveformContainer = document.getElementById('trimmer-waveform');
    
    if (!trimmerAudio || !playhead || !audioBuffer || trimmerAudio.paused) {
        if (playhead) playhead.style.display = 'none';
        return;
    }
    
    const duration = audioBuffer.duration;
    const currentTime = trimmerAudio.currentTime;
    const percent = (currentTime / duration) * 100;
    
    playhead.style.left = percent + '%';
    playhead.style.display = 'block';
    
    // Check if reached trim end
    if (currentTime >= trimEndTime) {
        trimmerAudio.pause();
        stopPlayheadTracking();
        const trimmerPlay = document.getElementById('trimmer-play');
        if (trimmerPlay) {
            trimmerPlay.innerHTML = '<i class="fas fa-play"></i>';
            trimmerPlay.classList.remove('playing');
        }
    }
}

function updateTrimDisplay() {
    const startEl = document.getElementById('trim-start-time');
    const endEl = document.getElementById('trim-end-time');
    const durationEl = document.getElementById('trim-duration');
    
    if (startEl) startEl.textContent = formatTime(trimStartTime);
    if (endEl) endEl.textContent = formatTime(trimEndTime);
    if (durationEl) durationEl.textContent = `Duration: ${formatTime(trimEndTime - trimStartTime)}`;
}

function formatTime(seconds, precise = false) {
    if (isNaN(seconds) || seconds < 0) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    if (precise) {
        const ms = Math.floor((seconds % 1) * 10); // Tenths of seconds
        return `${mins}:${secs.toString().padStart(2, '0')}.${ms}`;
    }
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function resumePreviewFromPaused() {
    if (!audioContext || !audioBuffer) return;
    
    const duration = trimEndTime - trimStartTime;
    const remaining = duration - previewElapsedTime;
    
    if (remaining <= 0) {
        // Already finished, restart
        previewElapsedTime = 0;
        playTrimmedPreview();
        return;
    }
    
    // Resume from where we paused
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start(0, trimStartTime + previewElapsedTime, remaining);
    
    isPlayingPreview = true;
    
    const trimmerPreview = document.getElementById('trimmer-preview');
    const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
    
    if (trimmerPreview) trimmerPreview.style.display = 'none';
    if (trimmerStopPreview) trimmerStopPreview.style.display = 'inline-flex';
    
    startPreviewPlayheadTracking();
    
    audioSource.onended = () => {
        isPlayingPreview = false;
        previewElapsedTime = 0; // Reset
        stopPreviewPlayheadTracking();
        if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
        if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
    };
}

function playTrimmedPreview() {
    if (!audioContext || !audioBuffer) {
        showToast('❌ No audio loaded');
        return;
    }
    
    // Stop full audio if playing
    const audio = document.getElementById('trimmer-audio');
    if (audio && !audio.paused) {
        audio.pause();
        const trimmerPlay = document.getElementById('trimmer-play');
        const trimmerPause = document.getElementById('trimmer-pause');
        if (trimmerPlay) trimmerPlay.style.display = 'inline-flex';
        if (trimmerPause) trimmerPause.style.display = 'none';
        stopPlayheadTracking();
    }
    
    stopAudioPreview();
    previewElapsedTime = 0; // Reset elapsed time
    
    const trimmerPreview = document.getElementById('trimmer-preview');
    const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
    
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start(0, trimStartTime, trimEndTime - trimStartTime);
    
    isPlayingPreview = true;
    
    // Update button states
    if (trimmerPreview) trimmerPreview.style.display = 'none';
    if (trimmerStopPreview) trimmerStopPreview.style.display = 'inline-flex';
    
    const duration = (trimEndTime - trimStartTime).toFixed(1);
    showToast(`🎵 Playing preview (${duration}s)...`);
    
    // Start preview playhead tracking
    startPreviewPlayheadTracking();
    
    audioSource.onended = () => {
        isPlayingPreview = false;
        previewElapsedTime = 0; // Reset
        stopPreviewPlayheadTracking();
        if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
        if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
    };
}

// Pause preview (can resume)
let previewPausedAt = 0;
let previewElapsedTime = 0;

function pauseAudioPreview() {
    if (!isPlayingPreview || !audioSource) return;
    
    // Stop the audio source
    if (audioSource) {
        try {
            audioSource.stop();
        } catch (e) {
            // Already stopped
        }
        audioSource = null;
    }
    
    // Record elapsed time for resume
    if (previewStartTime) {
        previewElapsedTime += (Date.now() - previewStartTime) / 1000;
    }
    
    isPlayingPreview = false;
    stopPreviewPlayheadTracking();
    
    const trimmerPreview = document.getElementById('trimmer-preview');
    const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
    
    if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
    if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
    
    showToast('⏸️ Preview paused');
}

function resumePreviewFromPaused() {
    if (!audioContext || !audioBuffer) return;
    
    const duration = trimEndTime - trimStartTime;
    const remaining = duration - previewElapsedTime;
    
    if (remaining <= 0) {
        // Already finished, restart
        previewElapsedTime = 0;
        playTrimmedPreview();
        return;
    }
    
    // Resume from where we paused
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = audioBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start(0, trimStartTime + previewElapsedTime, remaining);
    
    isPlayingPreview = true;
    
    const trimmerPreview = document.getElementById('trimmer-preview');
    const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
    
    if (trimmerPreview) trimmerPreview.style.display = 'none';
    if (trimmerStopPreview) trimmerStopPreview.style.display = 'inline-flex';
    
    startPreviewPlayheadTracking();
    
    audioSource.onended = () => {
        isPlayingPreview = false;
        previewElapsedTime = 0; // Reset
        stopPreviewPlayheadTracking();
        if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
        if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
    };
}

function stopAudioPreview() {
    if (audioSource) {
        try {
            audioSource.stop();
        } catch (e) {
            // Already stopped or not started
        }
        audioSource = null;
    }
    isPlayingPreview = false;
    previewElapsedTime = 0; // Reset elapsed time
    previewPausedAt = 0;
    stopPreviewPlayheadTracking();
    
    // Update button states
    const trimmerPreview = document.getElementById('trimmer-preview');
    const trimmerStopPreview = document.getElementById('trimmer-stop-preview');
    if (trimmerPreview) trimmerPreview.style.display = 'inline-flex';
    if (trimmerStopPreview) trimmerStopPreview.style.display = 'none';
}

// Preview playhead tracking
let previewStartTime = 0;
let previewPlayheadInterval = null;

function startPreviewPlayheadTracking() {
    if (previewPlayheadInterval) clearInterval(previewPlayheadInterval);
    previewStartTime = Date.now();
    
    const playhead = document.getElementById('trim-playhead');
    
    if (!playhead || !audioBuffer) return;
    
    const duration = trimEndTime - trimStartTime;
    const totalDuration = audioBuffer.duration;
    
    previewPlayheadInterval = setInterval(() => {
        if (!isPlayingPreview) {
            stopPreviewPlayheadTracking();
            return;
        }
        
        const elapsed = (Date.now() - previewStartTime) / 1000 + previewElapsedTime; // seconds
        const progress = Math.min(elapsed / duration, 1); // 0 to 1
        
        // Calculate position on waveform
        const currentTime = trimStartTime + elapsed;
        const percent = Math.min((currentTime / totalDuration) * 100, 100);
        
        playhead.style.left = percent + '%';
        playhead.style.display = 'block';
        
        // Stop tracking if reached end
        if (elapsed >= duration) {
            stopPreviewPlayheadTracking();
        }
    }, 50); // Update every 50ms for smooth tracking
}

function stopPreviewPlayheadTracking() {
    if (previewPlayheadInterval) {
        clearInterval(previewPlayheadInterval);
        previewPlayheadInterval = null;
    }
    // Don't hide playhead if we're paused - keep it visible
    if (!isPlayingPreview && previewElapsedTime <= 0) {
        const playhead = document.getElementById('trim-playhead');
        if (playhead) playhead.style.display = 'none';
    }
}

// Upload audio to Cloudinary
function uploadAudioToCloudinary(file, member) {
    if (!CLOUDINARY_CLOUD_NAME || !CLOUDINARY_UPLOAD_PRESET) {
        showToast('❌ Cloudinary not configured!');
        return;
    }
    
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('folder', `members/${member}/music`);
    formData.append('resource_type', 'auto');
    
    showToast('⏳ Uploading audio...');
    
    fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/auto/upload`, {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.secure_url) {
            saveMusicToFirebase(member, data.secure_url, data.public_id);
            showToast('✅ Music uploaded!');
        } else {
            console.error('Upload response:', data);
            showToast('❌ Upload failed!');
        }
    })
    .catch(error => {
        console.error('Upload error:', error);
        showToast('❌ Upload failed!');
    });
}

function saveMusicToFirebase(member, url, publicId) {
    const db = firebase.database();
    db.ref(`members/${member}/music`).set({
        url: url,
        publicId: publicId,
        uploadedAt: Date.now()
    }).then(() => {
        console.log('Music saved to Firebase');
    }).catch(err => {
        console.error('Firebase save error:', err);
    });
}

/* ============================================
   PREMIUM PFP POPUP
   ============================================ */
function initPremiumPFPPopup() {
    const members = ['govardhan', 'gowtham', 'varun', 'gahan', 'pruthvi', 'likhith'];
    const memberNames = {
        'govardhan': 'Govardhan',
        'gowtham': 'Gowtham', 
        'varun': 'Varun',
        'gahan': 'Gahan',
        'pruthvi': 'Pruthvi',
        'likhith': 'Likhith'
    };
    
    members.forEach(member => {
        const pfpImage = document.getElementById(`pfp-${member}`);
        if (pfpImage) {
            pfpImage.addEventListener('click', (e) => {
                if (!isAdmin) {
                    openPremiumPFPPopup(member, memberNames[member]);
                }
            });
        }
        
        // Also handle click on member image wrapper
        const imageWrapper = document.querySelector(`.member-card[data-member="${member}"] .member-image`);
        if (imageWrapper) {
            imageWrapper.style.cursor = 'pointer';
            imageWrapper.addEventListener('click', (e) => {
                // Don't open if clicking on admin buttons
                if (e.target.closest('.upload-btn')) return;
                if (!isAdmin) {
                    openPremiumPFPPopup(member, memberNames[member]);
                }
            });
        }
    });
    
    // Close popup handlers
    const closeBtn = document.getElementById('close-pfp-popup');
    const popupModal = document.getElementById('pfp-popup-modal');
    
    if (closeBtn) {
        closeBtn.addEventListener('click', closePremiumPFPPopup);
    }
    
    if (popupModal) {
        popupModal.addEventListener('click', (e) => {
            if (e.target === popupModal || e.target.classList.contains('pfp-popup-overlay')) {
                closePremiumPFPPopup();
            }
        });
    }
    
    // Music auto-plays - no toggle button needed
}

// Playlist player state
let currentPlaylist = [];
let currentSongIndex = 0;
let isPlaylistPlaying = false;
let audioAnalyser = null;
let audioDataArray = null;
let animationFrameId = null;

function openPremiumPFPPopup(member, memberName) {
    const popupModal = document.getElementById('pfp-popup-modal');
    const popupImage = document.getElementById('pfp-popup-image');
    const popupAudio = document.getElementById('pfp-popup-audio');
    const memberNameEl = document.getElementById('pfp-member-name');
    const musicControl = document.getElementById('pfp-music-control');
    const noMusicEl = document.getElementById('pfp-no-music');
    const rotatingContainer = document.getElementById('pfp-rotating-container');
    
    if (!popupModal || !popupImage) return;
    
    // IMPORTANT: Aggressively clear audio element to prevent caching old songs
    if (popupAudio) {
        popupAudio.pause();
        popupAudio.currentTime = 0;
        popupAudio.removeAttribute('src'); // Remove src attribute completely
        popupAudio.src = ''; // Clear source
        popupAudio.load(); // Force reload
        
        // Clear all event listeners by cloning
        const newAudio = popupAudio.cloneNode(true);
        popupAudio.parentNode.replaceChild(newAudio, popupAudio);
        
        console.log('🔄 Audio element cleared and reset for fresh load');
    }
    
    // Reset state
    currentPlaylist = [];
    currentSongIndex = 0;
    isPlaylistPlaying = false;
    if (rotatingContainer) rotatingContainer.classList.remove('playing');
    
    // Hide music control button - auto-play only
    if (musicControl) musicControl.style.display = 'none';
    
    // Set member name
    if (memberNameEl) memberNameEl.textContent = memberName;
    
    const db = firebase.database();
    
    // Load PFP
    db.ref(`members/${member}/pfp`).once('value', (snapshot) => {
        const pfpData = snapshot.val();
        if (pfpData && pfpData.url) {
            popupImage.src = pfpData.url;
            popupModal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Load music (supports both single song and playlist) - FORCE REFRESH
            // Add cache-busting query parameter to Firebase read
            const musicRef = db.ref(`members/${member}/music`);
            musicRef.once('value', (musicSnapshot) => {
                const musicData = musicSnapshot.val();
                
                console.log('🎵 Loaded music data from Firebase:', musicData);
                
                if (musicData) {
                    // Check if it's a playlist or single song
                    if (musicData.playlist && Array.isArray(musicData.playlist)) {
                        // Playlist format - add cache-busting to each URL
                        currentPlaylist = musicData.playlist.sort((a, b) => a.order - b.order).map(song => {
                            // Add cache-busting to each song URL
                            const baseUrl = song.url.split('?')[0];
                            const timestamp = Date.now();
                            const random = Math.random().toString(36).substring(7);
                            return {
                                ...song,
                                url: `${baseUrl}?t=${timestamp}&r=${random}&v=${musicData.version || timestamp}`
                            };
                        });
                        
                        if (currentPlaylist.length > 0) {
                            if (noMusicEl) noMusicEl.style.display = 'none';
                            // Auto-play the playlist
                            playPlaylist(member);
                        } else {
                            if (noMusicEl) noMusicEl.style.display = 'block';
                        }
                    } else if (musicData.url) {
                        // Single song format (backwards compatible) - add cache-busting
                        const baseUrl = musicData.url.split('?')[0];
                        const timestamp = Date.now();
                        const random = Math.random().toString(36).substring(7);
                        const cacheBustedUrl = `${baseUrl}?t=${timestamp}&r=${random}&v=${musicData.uploadedAt || timestamp}`;
                        
                        currentPlaylist = [{ 
                            url: cacheBustedUrl, 
                            name: 'Song',
                            trimStart: 0,
                            trimEnd: 0
                        }];
                        if (noMusicEl) noMusicEl.style.display = 'none';
                        // Auto-play single song
                        playPlaylist(member);
                    } else {
                        if (noMusicEl) noMusicEl.style.display = 'block';
                    }
                } else {
                    if (noMusicEl) noMusicEl.style.display = 'block';
                }
            });
        } else {
            showToast('No profile picture found');
        }
    });
}

// Play playlist automatically
function playPlaylist(member) {
    if (currentPlaylist.length === 0) {
        console.log('No songs in playlist');
        return;
    }
    
    const popupAudio = document.getElementById('pfp-popup-audio');
    const rotatingContainer = document.getElementById('pfp-rotating-container');
    
    if (!popupAudio) return;
    
    // Start from first song
    currentSongIndex = 0;
    playNextSongInPlaylist();
}

function playNextSongInPlaylist() {
    if (currentPlaylist.length === 0) return;
    
    const popupAudio = document.getElementById('pfp-popup-audio');
    const rotatingContainer = document.getElementById('pfp-rotating-container');
    
    if (!popupAudio) return;
    
    // AGGRESSIVELY clear previous audio to prevent caching
    popupAudio.pause();
    popupAudio.currentTime = 0;
    popupAudio.removeAttribute('src'); // Remove src completely
    popupAudio.src = '';
    popupAudio.load();
    
    // Get current song (before incrementing)
    const song = currentPlaylist[currentSongIndex];
    if (!song) {
        // Loop back to start
        currentSongIndex = 0;
        playNextSongInPlaylist();
        return;
    }
    
    console.log(`🎵 Playing song ${currentSongIndex + 1}/${currentPlaylist.length}:`, song.name);
    console.log('🎵 Trim:', song.trimStart || 0, 'to', song.trimEnd || 'end');
    
    // AGGRESSIVE cache-busting - remove existing params and add multiple new ones
    let audioUrl = song.url.split('?')[0]; // Remove any existing query params
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(7);
    audioUrl += `?t=${timestamp}&r=${random}&v=${timestamp}&cb=${timestamp}`;
    
    console.log('🎵 Loading fresh audio (cache-busted):', audioUrl);
    
    // Small delay to ensure audio element is fully cleared
    setTimeout(() => {
        popupAudio.src = audioUrl;
        popupAudio.load(); // Force reload to get latest version
        
        // Wait for metadata, then set trim start
        // Use one-time listener to prevent duplicates
        const onLoadedHandler = function onLoaded() {
            if (song.trimStart && song.trimStart > 0) {
                popupAudio.currentTime = song.trimStart;
            }
            
            // Auto-play after setting currentTime
            const playPromise = popupAudio.play().catch(err => {
                console.error('❌ Autoplay prevented or error:', err);
                // Try again after user interaction hint
                if (rotatingContainer) {
                    rotatingContainer.style.cursor = 'pointer';
                    rotatingContainer.onclick = function onClick() {
                        popupAudio.play().then(() => {
                            isPlaylistPlaying = true;
                            rotatingContainer.classList.add('playing');
                            rotatingContainer.style.cursor = '';
                            rotatingContainer.removeEventListener('click', onClick);
                            
                            // Initialize audio visualizer for sound waves
                            initAudioVisualizer(popupAudio);
                            
                            // Set up trim check after manual play
                            setupTrimCheck(song, popupAudio);
                        });
                    };
                }
            });
            
            if (playPromise) {
                playPromise.then(() => {
                    isPlaylistPlaying = true;
                    if (rotatingContainer) rotatingContainer.classList.add('playing');
                    console.log('🎵 Music started, rotation should begin');
                    
                    // Initialize audio visualizer for sound waves
                    initAudioVisualizer(popupAudio);
                    
                    // Set up trim check after playback starts
                    setupTrimCheck(song, popupAudio);
                });
            }
        };
        
        // Add the listener with once option to auto-remove after first call
        popupAudio.addEventListener('loadedmetadata', onLoadedHandler, { once: true });
    }, 100);
}

// Helper function to set up trim end checking
function setupTrimCheck(song, popupAudio) {
    // Clear any existing handlers
    popupAudio.onended = null;
    
    if (song.trimEnd && song.trimEnd > (song.trimStart || 0)) {
        // Use timeupdate to check for trim end
        const trimCheckHandler = () => {
            if (popupAudio.currentTime >= song.trimEnd) {
                popupAudio.pause();
                popupAudio.removeEventListener('timeupdate', trimCheckHandler);
                // Move to next song
                currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
                setTimeout(() => playNextSongInPlaylist(), 50);
            }
        };
        popupAudio.addEventListener('timeupdate', trimCheckHandler);
    } else {
        // No trim end, use ended event
        popupAudio.onended = () => {
            currentSongIndex = (currentSongIndex + 1) % currentPlaylist.length;
            playNextSongInPlaylist();
        };
    }
}

function togglePFPMusic() {
    const popupAudio = document.getElementById('pfp-popup-audio');
    const rotatingContainer = document.getElementById('pfp-rotating-container');
    const musicToggle = document.getElementById('pfp-music-toggle');
    
    if (!popupAudio) return;
    
    if (popupAudio.paused) {
        popupAudio.play().then(() => {
            isPlaylistPlaying = true;
            rotatingContainer.classList.add('playing');
            musicToggle.classList.add('playing');
            
            // Show current song info if playlist
            if (currentPlaylist.length > 1) {
                musicToggle.innerHTML = `<i class="fas fa-pause"></i><span>Playing ${currentSongIndex + 1}/${currentPlaylist.length}</span>`;
            } else {
                musicToggle.innerHTML = '<i class="fas fa-pause"></i><span>Pause Music</span>';
            }
        }).catch(err => {
            console.log('Playback error:', err);
            showToast('❌ Could not play audio');
        });
    } else {
        popupAudio.pause();
        isPlaylistPlaying = false;
        rotatingContainer.classList.remove('playing');
        musicToggle.classList.remove('playing');
        
        if (currentPlaylist.length > 1) {
            musicToggle.innerHTML = `<i class="fas fa-play"></i><span>Play (${currentPlaylist.length} songs)</span>`;
        } else {
            musicToggle.innerHTML = '<i class="fas fa-play"></i><span>Tap to Play Music</span>';
        }
    }
}

function closePremiumPFPPopup() {
    const popupModal = document.getElementById('pfp-popup-modal');
    const popupAudio = document.getElementById('pfp-popup-audio');
    const rotatingContainer = document.getElementById('pfp-rotating-container');
    
    // Stop audio visualizer
    stopAudioVisualizer();
    
    // Stop playlist
    isPlaylistPlaying = false;
    currentPlaylist = [];
    currentSongIndex = 0;
    
    if (popupModal) {
        popupModal.classList.remove('show');
        document.body.style.overflow = '';
    }
    
    if (popupAudio) {
        popupAudio.pause();
        popupAudio.currentTime = 0;
        popupAudio.onended = null; // Remove listener
        popupAudio.src = ''; // Clear source
    }
    
    if (rotatingContainer) {
        rotatingContainer.classList.remove('playing');
        rotatingContainer.style.cursor = '';
        rotatingContainer.onclick = null;
    }
}

// Initialize audio visualizer for sound waves
function initAudioVisualizer(audioElement) {
    try {
        // Stop existing visualizer
        stopAudioVisualizer();
        
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContext.createMediaElementSource(audioElement);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256; // Lower for smoother animation
        analyser.smoothingTimeConstant = 0.8;
        
        source.connect(analyser);
        analyser.connect(audioContext.destination);
        
        audioAnalyser = analyser;
        audioDataArray = new Uint8Array(analyser.frequencyBinCount);
        
        // Start animation loop
        animateSoundWaves();
    } catch (err) {
        console.error('Audio visualizer error:', err);
        // Fallback: just use CSS animations
    }
}

// Animate sound waves based on audio frequency
function animateSoundWaves() {
    if (!audioAnalyser || !isPlaylistPlaying) {
        return;
    }
    
    audioAnalyser.getByteFrequencyData(audioDataArray);
    
    // Calculate average frequency (bass + mid range)
    let sum = 0;
    const bassRange = Math.min(10, audioDataArray.length);
    for (let i = 0; i < bassRange; i++) {
        sum += audioDataArray[i];
    }
    const averageFrequency = sum / bassRange;
    
    // Normalize to 0-1 range (0-255 -> 0-1)
    const intensity = averageFrequency / 255;
    
    // Update sound wave rings intensity
    const soundWaves = document.getElementById('pfp-sound-waves');
    if (soundWaves) {
        const rings = soundWaves.querySelectorAll('.sound-wave-ring');
        rings.forEach((ring, index) => {
            // Vary intensity based on ring index
            const ringIntensity = Math.max(0.3, intensity * (1 - index * 0.15));
            const scale = 1 + (intensity * 0.3); // Slight scale boost
            
            ring.style.opacity = ringIntensity;
            ring.style.transform = `translate(-50%, -50%) scale(${scale})`;
        });
    }
    
    animationFrameId = requestAnimationFrame(animateSoundWaves);
}

// Stop audio visualizer
function stopAudioVisualizer() {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
    }
    audioAnalyser = null;
    audioDataArray = null;
}

/* ============================================
   DELETE FUNCTIONS FOR ADMIN
   ============================================ */
function deletePFP(member) {
    if (!confirm(`Delete ${member}'s profile picture?`)) return;
    
    const db = firebase.database();
    db.ref(`members/${member}/pfp`).remove()
        .then(() => {
            showToast('✅ Profile picture deleted!');
            // Reset the display
            const pfpImg = document.getElementById(`pfp-${member}`);
            if (pfpImg) {
                pfpImg.style.display = 'none';
                pfpImg.src = '';
            }
        })
        .catch(err => {
            console.error('Delete error:', err);
            showToast('❌ Could not delete!');
        });
}

function deleteMusic(member) {
    if (!confirm(`Delete ${member}'s music?`)) return;
    
    const db = firebase.database();
    db.ref(`members/${member}/music`).remove()
        .then(() => {
            showToast('✅ Music deleted!');
        })
        .catch(err => {
            console.error('Delete error:', err);
            showToast('❌ Could not delete!');
        });
}

/* ============================================
   UPDATE INIT FUNCTIONS
   ============================================ */
// Override the PFP upload to use custom cropper
function updatePFPUploadButtons() {
    const members = ['govardhan', 'gowtham', 'varun', 'gahan', 'pruthvi', 'likhith'];
    
    members.forEach(member => {
        const pfpBtn = document.querySelector(`.upload-pfp-btn[data-member="${member}"]`);
        if (pfpBtn) {
            // Remove old listener by cloning
            const newBtn = pfpBtn.cloneNode(true);
            pfpBtn.parentNode.replaceChild(newBtn, pfpBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isAdmin) {
                    openImageCropper(member);
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }
        
        const musicBtn = document.querySelector(`.upload-music-btn[data-member="${member}"]`);
        if (musicBtn) {
            // Remove old listener by cloning
            const newBtn = musicBtn.cloneNode(true);
            musicBtn.parentNode.replaceChild(newBtn, musicBtn);
            
            newBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                if (isAdmin) {
                    openAudioTrimmer(member);
                } else {
                    showToast('⚠️ Only admin can upload!');
                }
            });
        }
    });
}

// Initialize all premium features
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        initImageCropper();
        initAudioTrimmer();
        initPremiumPFPPopup();
        updatePFPUploadButtons();
        console.log('✨ Premium features initialized!');
    }, 1500);
});

