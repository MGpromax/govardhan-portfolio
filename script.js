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

// Authorized Admin Email
const AUTHORIZED_ADMIN = "mgpromax31@gmail.com";

// Cloudinary Configuration
const CLOUDINARY_CLOUD_NAME = "dldfOuldk"; // Your Cloudinary cloud name
const CLOUDINARY_UPLOAD_PRESET = "unsigned_preset"; // Create a new unsigned preset with this name in Cloudinary dashboard

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

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
        let typingSpeed = 100;

        function type() {
            try {
        const currentPhrase = phrases[phraseIndex];

                if (isDeleting) {
                charIndex--;
                typedText.textContent = currentPhrase.substring(0, charIndex);
                    typingSpeed = 50;
                } else {
                    charIndex++;
                    typedText.textContent = currentPhrase.substring(0, charIndex);
                    typingSpeed = 100;
                }

                if (!isDeleting && charIndex === currentPhrase.length) {
                    isDeleting = true;
                    typingSpeed = 2000; // Pause at end
                } else if (isDeleting && charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                    typingSpeed = 500; // Pause before typing next
                }

                setTimeout(type, typingSpeed);
            } catch (e) {
                console.error('Typewriter error:', e);
            }
        }

        // Start typing
        setTimeout(type, 1000);
        console.log('Typewriter initialized');
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

    // Simplified tilt effect with throttling
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            throttleUpdate(card, () => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 25; // Reduced intensity
                const rotateY = (centerX - x) / 25;
            
                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
            });
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
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
    
    // Throttled mousemove handler for better performance
    let lastMoveTime = 0;
    const throttleDelay = 5; // Smoother updates
    
    document.addEventListener('mousemove', (e) => {
        const now = Date.now();
        if (now - lastMoveTime < throttleDelay) return;
        lastMoveTime = now;
        lastMouseMoveTime = now;
        
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

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;
    progressBar.style.width = scrollPercent + '%';
});

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
   FIREBASE AUTHENTICATION
   ============================================ */
function initFirebaseAuth() {
    firebase.auth().onAuthStateChanged((user) => {
        if (user) {
            currentUser = user;
            if (user.email === AUTHORIZED_ADMIN) {
                isAdmin = true;
                enableAdminMode();
                showAdminPanel(user);
            } else {
                isAdmin = false;
                disableAdminMode();
                showToast('⚠️ Not authorized! Only admin can edit.');
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
        });
    }

    // Close on outside click
    if (adminModal) {
        adminModal.addEventListener('click', (e) => {
            if (e.target === adminModal) {
                adminModal.classList.remove('show');
            }
        });
    }

    // Email/Password Sign-in
    const emailLoginBtn = document.getElementById('email-login');
    const adminEmailInput = document.getElementById('admin-email');
    const adminPasswordInput = document.getElementById('admin-password');
    
    if (emailLoginBtn) {
        emailLoginBtn.addEventListener('click', () => {
            const email = adminEmailInput.value.trim();
            const password = adminPasswordInput.value;
            
            if (!email || !password) {
                showToast('⚠️ Enter email and password!');
                return;
            }
            
            firebase.auth().signInWithEmailAndPassword(email, password)
                .then((result) => {
                    console.log('Signed in:', result.user.email);
                    showToast('✅ Login successful!');
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    if (error.code === 'auth/user-not-found') {
                        showToast('❌ User not found!');
                    } else if (error.code === 'auth/wrong-password') {
                        showToast('❌ Wrong password!');
                    } else {
                        showToast('❌ Login failed: ' + error.message);
                    }
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

    // Google Sign-in
    if (googleLoginBtn) {
        googleLoginBtn.addEventListener('click', () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            firebase.auth().signInWithPopup(provider)
                .then((result) => {
                    console.log('Signed in:', result.user.email);
                })
                .catch((error) => {
                    console.error('Login error:', error);
                    showToast('❌ Login failed: ' + error.message);
                });
        });
    }

    // Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            firebase.auth().signOut()
                .then(() => {
                    showToast('👋 Logged out successfully!');
                })
                .catch((error) => {
                    console.error('Logout error:', error);
                });
        });
    }
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
            if (galleryModal) galleryModal.classList.remove('show');
        });
    }
    if (galleryModal) {
        galleryModal.addEventListener('click', (e) => {
            if (e.target === galleryModal) {
                galleryModal.classList.remove('show');
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
    if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        showToast('❌ Cloudinary widget not loaded! Please check configuration.');
                return;
            }

    if (CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" || !CLOUDINARY_CLOUD_NAME) {
        showToast('❌ Please configure Cloudinary cloud name in script.js (line 21)');
        alert('⚠️ Cloudinary Not Configured!\n\nPlease set your Cloudinary cloud name in script.js:\n\n1. Go to https://cloudinary.com and sign up/login\n2. Get your cloud name from the dashboard\n3. Update line 21 in script.js:\n   const CLOUDINARY_CLOUD_NAME = "your-cloud-name";');
        return;
    }
    
    const resourceType = type === 'music' ? 'video' : type === 'videos' ? 'video' : 'image';
    
    const uploadWidget = cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'camera'],
        resourceType: resourceType,
        // Let the preset handle the base folder, use publicIdPrefix for subfolders
        publicIdPrefix: `members/${member}/${type}/`,
        multiple: type !== 'music', // Allow multiple for photos/videos, single for music
        maxFileSize: type === 'photos' ? 10000000 : 100000000, // 10MB for images, 100MB for videos/audio
        clientAllowedFormats: type === 'photos' ? ['jpg', 'jpeg', 'png', 'gif', 'webp'] : 
                             type === 'music' ? ['mp3', 'wav', 'ogg', 'm4a'] : 
                             ['mp4', 'webm', 'mov', 'avi']
    }, (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            showToast('❌ Upload error: ' + error.message);
                return;
            }

        if (result.event === 'success') {
            const url = result.info.secure_url;
            const publicId = result.info.public_id;
            
            if (type === 'music') {
                // Single music file
                saveMediaToFirebase(member, 'music', url, publicId);
            } else {
                // Multiple photos/videos for gallery
                saveMediaToFirebaseGallery(member, type, url, publicId);
            }
        }
    });
    
    uploadWidget.open();
}

function openCloudinaryPFPUpload(member) {
    if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        showToast('❌ Cloudinary widget not loaded! Please check configuration.');
        return;
    }
    
    if (CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" || !CLOUDINARY_CLOUD_NAME) {
        showToast('❌ Please configure Cloudinary cloud name in script.js (line 21)');
        alert('⚠️ Cloudinary Not Configured!\n\nPlease set your Cloudinary cloud name in script.js:\n\n1. Go to https://cloudinary.com and sign up/login\n2. Get your cloud name from the dashboard\n3. Update line 21 in script.js:\n   const CLOUDINARY_CLOUD_NAME = "your-cloud-name";');
        return;
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "ml_default") {
        showToast('❌ Please configure Cloudinary upload preset in script.js (line 22)');
        return;
    }
    
    console.log('Opening Cloudinary PFP upload with:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
    });
    
    const uploadWidget = cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'camera'],
        resourceType: 'image',
        // Remove publicIdPrefix to avoid conflicts
        multiple: false,
        maxFileSize: 10000000, // 10MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp'],
        cropping: true,
        croppingAspectRatio: 1, // Square/circular for profile pictures
        croppingDefaultSelectionRatio: 1,
        croppingShowDimensions: true,
        croppingCoordinatesMode: 'custom' // Allows manual positioning
    }, (error, result) => {
        if (error) {
            console.error('Cloudinary upload error:', error);
            showToast('❌ Upload error: ' + error.message);
            return;
        }
        
        if (result.event === 'success') {
            // Get the cropped circular image URL
            const url = result.info.secure_url;
            // Apply circular transformation using Cloudinary
            const circularUrl = url.replace('/upload/', '/upload/w_400,h_400,c_fill,g_face,r_max/');
            const publicId = result.info.public_id;
            savePFPToFirebase(member, circularUrl, publicId);
        }
    });
    
    uploadWidget.open();
}

function openCloudinaryPhotoUpload(member) {
    if (typeof cloudinary === 'undefined' || !cloudinary.createUploadWidget) {
        showToast('❌ Cloudinary widget not loaded! Please check configuration.');
        return;
    }
    
    if (CLOUDINARY_CLOUD_NAME === "YOUR_CLOUD_NAME" || !CLOUDINARY_CLOUD_NAME) {
        showToast('❌ Please configure Cloudinary cloud name in script.js (line 21)');
        alert('⚠️ Cloudinary Not Configured!\n\nPlease set your Cloudinary cloud name in script.js:\n\n1. Go to https://cloudinary.com and sign up/login\n2. Get your cloud name from the dashboard\n3. Update line 21 in script.js:\n   const CLOUDINARY_CLOUD_NAME = "your-cloud-name";');
        return;
    }
    
    if (!CLOUDINARY_UPLOAD_PRESET || CLOUDINARY_UPLOAD_PRESET === "ml_default") {
        showToast('❌ Please configure Cloudinary upload preset in script.js (line 22)');
        return;
    }
    
    console.log('Opening Cloudinary photo upload with:', {
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET
    });
    
    const uploadWidget = cloudinary.createUploadWidget({
        cloudName: CLOUDINARY_CLOUD_NAME,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        sources: ['local', 'camera'],
        resourceType: 'image',
        // Remove publicIdPrefix to avoid conflicts
        multiple: false,
        maxFileSize: 10000000, // 10MB
        clientAllowedFormats: ['jpg', 'jpeg', 'png', 'gif', 'webp']
    }, (error, result) => {
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

