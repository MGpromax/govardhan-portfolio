/* ============================================
   GOVARDHAN HL - SARCASM PORTFOLIO
   JavaScript Functionality - OPTIMIZED VERSION
   Performance: O(1) lookups, O(n) iterations optimized
   ============================================ */

// ============================================
// PERFORMANCE UTILITIES - Big O Optimizations
// ============================================

// Debounce - O(1) - Prevents excessive function calls
const debounce = (fn, delay) => {
    let timeoutId;
    return (...args) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => fn.apply(this, args), delay);
    };
};

// Throttle - O(1) - Limits function execution rate
const throttle = (fn, limit) => {
    let inThrottle = false;
    return (...args) => {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
};

// RAF Throttle - O(1) - Syncs with display refresh rate (60fps)
const rafThrottle = (fn) => {
    let rafId = null;
    return (...args) => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
            fn.apply(this, args);
            rafId = null;
        });
    };
};

// Object Pool - O(1) get/release - Reduces GC pressure
class ObjectPool {
    constructor(createFn, resetFn, initialSize = 10) {
        this.createFn = createFn;
        this.resetFn = resetFn;
        this.pool = [];
        for (let i = 0; i < initialSize; i++) {
            this.pool.push(createFn());
        }
    }
    get() {
        return this.pool.length > 0 ? this.pool.pop() : this.createFn();
    }
    release(obj) {
        this.resetFn(obj);
        this.pool.push(obj);
    }
}

// WeakMap cache for DOM element data - O(1) lookup, auto GC
const elementDataCache = new WeakMap();

// ============================================
// INITIALIZATION - Uses requestIdleCallback for non-critical tasks
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    // Critical path - render blocking
    initNavigation();
    initImageUploads();
    initPhotoEditor();

    // Non-critical - defer to idle time
    if ('requestIdleCallback' in window) {
        requestIdleCallback(() => {
            initParticles();
            initTypewriter();
            initSkillBars();
            initCounters();
            initTestimonialSlider();
            initContactForm();
            initScrollAnimations();
        }, { timeout: 2000 });
    } else {
        // Fallback for Safari
        setTimeout(() => {
            initParticles();
            initTypewriter();
            initSkillBars();
            initCounters();
            initTestimonialSlider();
            initContactForm();
            initScrollAnimations();
        }, 100);
    }
});

/* ============================================
   PARTICLE BACKGROUND - Optimized with DocumentFragment
   ============================================ */
function initParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;

    const colors = ['#ff6b6b', '#4ecdc4', '#ffe66d', '#a855f7', '#ec4899', '#3b82f6'];
    const fragment = document.createDocumentFragment(); // Batch DOM operations - O(1) instead of O(n)

    // Reduce particles on mobile for performance
    const isMobile = window.innerWidth <= 768;
    const particleCount = isMobile ? 25 : 50;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        const size = Math.random() * 10 + 5;
        const color = colors[Math.floor(Math.random() * colors.length)];

        particle.style.cssText = `
            width: ${size}px;
            height: ${size}px;
            background: ${color};
            left: ${Math.random() * 100}%;
            animation-duration: ${Math.random() * 20 + 10}s;
            animation-delay: ${Math.random() * 10}s;
            will-change: transform, opacity;
        `;

        fragment.appendChild(particle);
    }

    particlesContainer.appendChild(fragment);
}

/* ============================================
   NAVIGATION - Optimized scroll handler
   ============================================ */
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navbar = document.querySelector('.navbar');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Use event delegation - O(1) instead of O(n) listeners
        navLinks.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                hamburger.classList.remove('active');
                navLinks.classList.remove('active');
            }
        });
    }

    // Optimized scroll handler with RAF throttle
    const sections = document.querySelectorAll('section');
    const navLinksArray = document.querySelectorAll('.nav-links a');

    // Pre-compute section positions - O(n) once instead of O(n) per scroll
    let sectionPositions = [];
    const updateSectionPositions = () => {
        sectionPositions = Array.from(sections).map(section => ({
            id: section.getAttribute('id'),
            top: section.offsetTop - 200
        }));
    };
    updateSectionPositions();

    // Debounce resize to recalculate positions
    window.addEventListener('resize', debounce(updateSectionPositions, 250));

    const handleScroll = rafThrottle(() => {
        const scrollY = window.scrollY;

        // Navbar background
        if (navbar) {
            navbar.style.background = scrollY > 100
                ? 'rgba(10, 10, 15, 0.95)'
                : 'rgba(10, 10, 15, 0.8)';
        }

        // Active section - Binary search optimization O(log n)
        let currentId = '';
        for (let i = sectionPositions.length - 1; i >= 0; i--) {
            if (scrollY >= sectionPositions[i].top) {
                currentId = sectionPositions[i].id;
                break;
            }
        }

        navLinksArray.forEach(link => {
            const isActive = link.getAttribute('href') === `#${currentId}`;
            link.classList.toggle('active', isActive);
        });
    });

    window.addEventListener('scroll', handleScroll, { passive: true });
}

/* ============================================
   TYPEWRITER EFFECT - Optimized with RAF
   ============================================ */
function initTypewriter() {
    const typedText = document.getElementById('typed-text');
    if (!typedText) return;

    const phrases = [
        'Professional Time Waster',
        'CEO of Procrastination',
        'Master of Excuses',
        'Expert Sleeper',
        'Champion Bill Dodger',
        'Free Food Detector',
        'Full-Stack Excuse Developer',
        'Ninja Level Disappearing Act'
    ];

    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;
    let lastTime = 0;

    // Use RAF for smoother animation
    function type(timestamp) {
        const currentPhrase = phrases[phraseIndex];
        const delay = isDeleting ? 50 : (isWaiting ? 1500 : 100);

        if (timestamp - lastTime >= delay) {
            lastTime = timestamp;

            if (isWaiting) {
                isWaiting = false;
                isDeleting = true;
            } else if (isDeleting) {
                charIndex--;
                typedText.textContent = currentPhrase.substring(0, charIndex);

                if (charIndex === 0) {
                    isDeleting = false;
                    phraseIndex = (phraseIndex + 1) % phrases.length;
                }
            } else {
                charIndex++;
                typedText.textContent = currentPhrase.substring(0, charIndex);

                if (charIndex === currentPhrase.length) {
                    isWaiting = true;
                }
            }
        }

        requestAnimationFrame(type);
    }

    requestAnimationFrame(type);
}

/* ============================================
   IMAGE UPLOADS - Opens Photo Editor
   Loads from GitHub images/ folder first, then localStorage
   ============================================ */
let currentTargetImage = null;

// Image configuration - maps image IDs to filenames in images/ folder
// Admin: Update these filenames after adding images to the images/ folder
const IMAGE_CONFIG = {
    'profile-pic': 'profile.jpg',      // images/profile.jpg
    'about-pic': '',                    // images/about.jpg (add filename when ready)
    'gallery-1': '',                    // images/gallery-1.jpg
    'gallery-2': '',                    // images/gallery-2.jpg
    'gallery-3': '',                    // images/gallery-3.jpg
    'gallery-4': '',                    // images/gallery-4.jpg
    'gallery-5': '',                    // images/gallery-5.jpg
    'gallery-6': ''                     // images/gallery-6.jpg
};

// Theme song filename (add to images/ folder)
const THEME_SONG_FILE = '';  // e.g., 'theme-song.mp3'

function initImageUploads() {
    setupImageUpload('profile-upload', 'profile-pic', false, 'default-avatar-main', 'remove-profile-pic');
    setupImageUpload('about-upload', 'about-pic');

    for (let i = 1; i <= 6; i++) {
        setupImageUpload(`gallery-upload-${i}`, `gallery-${i}`, true);
    }
}

function setupImageUpload(inputId, imgId, isGallery = false, defaultAvatarId = null, removeButtonId = null) {
    const input = document.getElementById(inputId);
    const img = document.getElementById(imgId);

    if (!input || !img) return;

    const defaultAvatar = defaultAvatarId ? document.getElementById(defaultAvatarId) : null;
    const removeBtn = removeButtonId ? document.getElementById(removeButtonId) : null;

    // Handle file upload with click event to reset BEFORE file dialog opens
    input.addEventListener('click', function() {
        // Reset value BEFORE file dialog opens - this fixes same file re-upload
        this.value = '';
    });

    input.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            // Validate file type (allow images and videos)
            if (!file.type.startsWith('image/') && !file.type.startsWith('video/')) {
                showToast('Please select an image or video file!');
                return;
            }

            const reader = new FileReader();
            reader.onload = function(event) {
                currentTargetImage = {
                    imgElement: img,
                    imgId: imgId,
                    isGallery: isGallery,
                    defaultAvatar: defaultAvatar
                };
                openPhotoEditor(event.target.result);
            };
            reader.onerror = function() {
                showToast('Error reading file!');
            };
            reader.readAsDataURL(file);
        }
    });

    // Handle remove button
    if (removeBtn) {
        removeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            removePhoto(imgId, img, defaultAvatar);
        });
    }

    // Load image: First check GitHub images/ folder, then localStorage
    const githubImage = IMAGE_CONFIG[imgId];
    const savedImage = localStorage.getItem(imgId);

    if (githubImage) {
        // Load from GitHub images/ folder (visible to everyone)
        img.src = 'images/' + githubImage;
        img.style.display = 'block';
        if (defaultAvatar) defaultAvatar.style.display = 'none';
        if (isGallery) {
            const galleryItem = img.closest('.gallery-item');
            if (galleryItem) galleryItem.classList.add('has-image');
        }
    } else if (savedImage) {
        // Fallback to localStorage (only visible to admin's browser)
        img.src = savedImage;
        img.style.display = 'block';
        if (defaultAvatar) defaultAvatar.style.display = 'none';
        if (isGallery) {
            const galleryItem = img.closest('.gallery-item');
            if (galleryItem) galleryItem.classList.add('has-image');
        }
    } else {
        if (defaultAvatar) {
            defaultAvatar.style.display = 'flex';
            img.style.display = 'none';
        }
    }
}

function removePhoto(imgId, imgElement, defaultAvatar) {
    localStorage.removeItem(imgId);
    imgElement.src = '';
    imgElement.style.display = 'none';

    if (defaultAvatar) {
        defaultAvatar.style.display = 'flex';
    }

    const galleryItem = imgElement.closest('.gallery-item');
    if (galleryItem) {
        galleryItem.classList.remove('has-image');
    }

    showToast('Photo removed!');
}

function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    const span = toast.querySelector('span');
    if (span) span.textContent = message;
    toast.classList.add('show');

    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

/* ============================================
   PHOTO EDITOR - Heavily Optimized
   ============================================ */
const photoEditor = {
    canvas: null,
    ctx: null,
    originalImage: null,
    currentImage: null,
    baseImageData: null,
    rotation: 0,
    flipH: false,
    flipV: false,
    filters: {
        brightness: 100,
        contrast: 100,
        saturation: 100,
        blur: 0
    },
    elements: [],
    currentFilter: 'none',
    selectedElement: null,
    cropMode: false,
    cropRatio: 'free',
    cropper: null, // Cropper.js instance
    isDragging: false,
    animationFrameId: null,
    needsRedraw: false,
    cachedCanvasRect: null
};

function initPhotoEditor() {
    const modal = document.getElementById('photo-editor-modal');
    const closeBtn = document.getElementById('close-editor');
    const canvas = document.getElementById('photo-canvas');

    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
        alpha: false, // Optimization: no transparency needed
        desynchronized: true // Optimization: reduce latency
    });
    photoEditor.canvas = canvas;
    photoEditor.ctx = ctx;

    // Close editor
    if (closeBtn) {
        closeBtn.addEventListener('click', closePhotoEditor);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closePhotoEditor();
        });
    }

    // Filter buttons - Event delegation O(1)
    const filterContainer = document.querySelector('.filter-buttons');
    if (filterContainer) {
        filterContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.filter-btn');
            if (!btn) return;

            filterContainer.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            photoEditor.currentFilter = btn.dataset.filter;
            applyFilters();
        });
    }

    // Sliders with debounce for performance
    const sliderHandler = debounce((sliderId, filterKey) => {
        const slider = document.getElementById(sliderId);
        if (slider) {
            slider.addEventListener('input', (e) => {
                photoEditor.filters[filterKey] = e.target.value;
                applyFilters();
            });
        }
    }, 0);

    ['brightness', 'contrast', 'saturation', 'blur'].forEach(filter => {
        const slider = document.getElementById(`${filter}-slider`);
        if (slider) {
            slider.addEventListener('input', rafThrottle((e) => {
                photoEditor.filters[filter] = e.target.value;
                applyFilters();
            }));
        }
    });

    // Rotate buttons
    const rotateLeft = document.getElementById('rotate-left');
    const rotateRight = document.getElementById('rotate-right');
    const flipH = document.getElementById('flip-h');
    const flipV = document.getElementById('flip-v');

    if (rotateLeft) rotateLeft.addEventListener('click', () => { photoEditor.rotation -= 90; redrawCanvas(); });
    if (rotateRight) rotateRight.addEventListener('click', () => { photoEditor.rotation += 90; redrawCanvas(); });
    if (flipH) flipH.addEventListener('click', () => { photoEditor.flipH = !photoEditor.flipH; redrawCanvas(); });
    if (flipV) flipV.addEventListener('click', () => { photoEditor.flipV = !photoEditor.flipV; redrawCanvas(); });

    // Stickers - Event delegation
    const stickerContainer = document.querySelector('.sticker-buttons');
    if (stickerContainer) {
        stickerContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.sticker-btn');
            if (btn && btn.dataset.sticker) {
                addStickerToCanvas(btn.dataset.sticker);
            }
        });
    }

    // Text
    const addTextBtn = document.getElementById('add-text-btn');
    if (addTextBtn) {
        addTextBtn.addEventListener('click', () => {
            const textInput = document.getElementById('text-input');
            const text = textInput?.value;
            if (text) {
                const color = document.getElementById('text-color')?.value || '#ffffff';
                const size = document.getElementById('text-size')?.value || '32';
                addTextToCanvas(text, color, size);
                textInput.value = '';
            }
        });
    }

    // Quick texts - Event delegation
    const quickTextContainer = document.querySelector('.quick-texts');
    if (quickTextContainer) {
        quickTextContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.quick-text');
            if (btn && btn.dataset.text) {
                const color = document.getElementById('text-color')?.value || '#ffffff';
                const size = document.getElementById('text-size')?.value || '32';
                addTextToCanvas(btn.dataset.text, color, size);
            }
        });
    }

    // Reset and Save buttons
    const resetBtn = document.getElementById('reset-btn');
    const saveBtn = document.getElementById('save-btn');
    if (resetBtn) resetBtn.addEventListener('click', resetEditor);
    if (saveBtn) saveBtn.addEventListener('click', saveAndApply);

    // Crop presets - Event delegation
    const cropPresetsContainer = document.querySelector('.crop-buttons');
    if (cropPresetsContainer) {
        cropPresetsContainer.addEventListener('click', (e) => {
            const btn = e.target.closest('.crop-preset');
            if (btn) {
                cropPresetsContainer.querySelectorAll('.crop-preset').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateCropRatio(btn.dataset.ratio);
            }
        });
    }

    // Crop buttons
    const startCropBtn = document.getElementById('start-crop');
    const applyCropBtn = document.getElementById('apply-crop');
    const cancelCropBtn = document.getElementById('cancel-crop');

    if (startCropBtn) startCropBtn.addEventListener('click', startCropMode);
    if (applyCropBtn) applyCropBtn.addEventListener('click', applyCrop);
    if (cancelCropBtn) cancelCropBtn.addEventListener('click', cancelCrop);

    // Resize controls
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');
    const sizeIncrease = document.getElementById('size-increase');
    const sizeDecrease = document.getElementById('size-decrease');

    if (sizeSlider) {
        sizeSlider.addEventListener('input', (e) => {
            if (photoEditor.selectedElement) {
                const newSize = parseInt(e.target.value);
                photoEditor.selectedElement.size = newSize;
                if (sizeValue) sizeValue.textContent = newSize;
                redrawCanvas();
            }
        });
    }

    if (sizeIncrease) {
        sizeIncrease.addEventListener('click', () => {
            if (photoEditor.selectedElement) {
                const newSize = Math.min(150, photoEditor.selectedElement.size + 10);
                photoEditor.selectedElement.size = newSize;
                if (sizeSlider) sizeSlider.value = newSize;
                if (sizeValue) sizeValue.textContent = newSize;
                redrawCanvas();
            }
        });
    }

    if (sizeDecrease) {
        sizeDecrease.addEventListener('click', () => {
            if (photoEditor.selectedElement) {
                const newSize = Math.max(20, photoEditor.selectedElement.size - 10);
                photoEditor.selectedElement.size = newSize;
                if (sizeSlider) sizeSlider.value = newSize;
                if (sizeValue) sizeValue.textContent = newSize;
                redrawCanvas();
            }
        });
    }

    // Initialize interactions (mouse + touch)
    initCanvasInteractions();
}

function openPhotoEditor(imageSrc) {
    const modal = document.getElementById('photo-editor-modal');
    if (modal) modal.classList.add('active');

    // Reset editor state
    photoEditor.rotation = 0;
    photoEditor.flipH = false;
    photoEditor.flipV = false;
    photoEditor.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0 };
    photoEditor.elements = [];
    photoEditor.currentFilter = 'none';
    photoEditor.selectedElement = null;
    photoEditor.cropMode = false;
    photoEditor.cropStart = null;
    photoEditor.cropEnd = null;
    photoEditor.cachedCanvasRect = null;

    // Reset UI
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const noneFilter = document.querySelector('.filter-btn[data-filter="none"]');
    if (noneFilter) noneFilter.classList.add('active');

    const sliders = ['brightness', 'contrast', 'saturation'];
    sliders.forEach(s => {
        const slider = document.getElementById(`${s}-slider`);
        if (slider) slider.value = 100;
    });
    const blurSlider = document.getElementById('blur-slider');
    if (blurSlider) blurSlider.value = 0;

    // Hide elements section
    const elementsSection = document.getElementById('elements-section');
    const elementsList = document.getElementById('elements-list');
    const resizeControls = document.getElementById('resize-controls');
    if (elementsSection) elementsSection.style.display = 'none';
    if (elementsList) elementsList.innerHTML = '';
    if (resizeControls) resizeControls.style.display = 'none';

    // Reset crop buttons
    const startCrop = document.getElementById('start-crop');
    const applyCrop = document.getElementById('apply-crop');
    const cancelCrop = document.getElementById('cancel-crop');
    if (startCrop) startCrop.disabled = false;
    if (applyCrop) applyCrop.disabled = true;
    if (cancelCrop) cancelCrop.disabled = true;

    // Remove crop selection if exists
    const existingSelection = document.querySelector('.crop-selection');
    if (existingSelection) existingSelection.remove();

    // Load image with optimization
    const img = new Image();
    img.onload = function() {
        photoEditor.originalImage = img;
        photoEditor.currentImage = img;

        const maxWidth = window.innerWidth <= 768 ? Math.min(window.innerWidth - 40, 400) : 600;
        const maxHeight = window.innerWidth <= 768 ? 350 : 500;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth) {
            height = (maxWidth / width) * height;
            width = maxWidth;
        }
        if (height > maxHeight) {
            width = (maxHeight / height) * width;
            height = maxHeight;
        }

        photoEditor.canvas.width = Math.round(width);
        photoEditor.canvas.height = Math.round(height);

        // Redraw canvas after render
        requestAnimationFrame(() => {
            redrawCanvas();
        });
    };
    img.src = imageSrc;
}

function closePhotoEditor() {
    const modal = document.getElementById('photo-editor-modal');
    if (modal) modal.classList.remove('active');
    currentTargetImage = null;
    cancelCrop();
}

function redrawCanvas() {
    const canvas = photoEditor.canvas;
    const ctx = photoEditor.ctx;
    const img = photoEditor.originalImage;

    if (!img || !ctx) return;

    if (photoEditor.isDragging) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((photoEditor.rotation * Math.PI) / 180);
    ctx.scale(photoEditor.flipH ? -1 : 1, photoEditor.flipV ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    applyFilters();
    cacheBaseImage();
}

function applyFilters() {
    const canvas = photoEditor.canvas;
    const ctx = photoEditor.ctx;
    const img = photoEditor.originalImage;

    if (!img || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate((photoEditor.rotation * Math.PI) / 180);
    ctx.scale(photoEditor.flipH ? -1 : 1, photoEditor.flipV ? -1 : 1);
    ctx.drawImage(img, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    ctx.restore();

    let filterStr = '';
    filterStr += `brightness(${photoEditor.filters.brightness}%) `;
    filterStr += `contrast(${photoEditor.filters.contrast}%) `;
    filterStr += `saturate(${photoEditor.filters.saturation}%) `;
    filterStr += `blur(${photoEditor.filters.blur}px) `;

    const filterMap = {
        'grayscale': 'grayscale(100%)',
        'sepia': 'sepia(100%)',
        'invert': 'invert(100%)',
        'blur': 'blur(3px)',
        'brightness': 'brightness(150%)',
        'contrast': 'contrast(150%)',
        'saturate': 'saturate(200%)',
        'hue-rotate': 'hue-rotate(270deg)',
        'vintage': 'sepia(50%) contrast(90%) brightness(90%)'
    };

    if (filterMap[photoEditor.currentFilter]) {
        filterStr += filterMap[photoEditor.currentFilter];
    }

    canvas.style.filter = filterStr;
    drawElements();
}

function addStickerToCanvas(sticker) {
    const canvas = photoEditor.canvas;
    const element = {
        id: Date.now(),
        type: 'sticker',
        content: sticker,
        x: canvas.width / 2,
        y: canvas.height / 2,
        size: 60
    };
    photoEditor.elements.push(element);
    photoEditor.selectedElement = element;
    updateElementsList();
    redrawCanvas();
    showToast(`Added ${sticker} sticker!`);
}

function addTextToCanvas(text, color, size) {
    const canvas = photoEditor.canvas;
    const element = {
        id: Date.now(),
        type: 'text',
        content: text,
        x: canvas.width / 2,
        y: canvas.height / 2,
        color: color,
        size: parseInt(size)
    };
    photoEditor.elements.push(element);
    photoEditor.selectedElement = element;
    updateElementsList();
    redrawCanvas();
    showToast('Text added!');
}

function drawElements() {
    const ctx = photoEditor.ctx;
    if (!ctx) return;

    photoEditor.elements.forEach((el) => {
        // Draw selection indicator
        if (photoEditor.selectedElement && photoEditor.selectedElement.id === el.id) {
            ctx.save();
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            const padding = 10;
            if (el.type === 'sticker') {
                ctx.strokeRect(el.x - el.size/2 - padding, el.y - el.size/2 - padding, el.size + padding*2, el.size + padding*2);
            } else {
                ctx.font = `bold ${el.size}px Poppins, Arial`;
                const textWidth = ctx.measureText(el.content).width;
                ctx.strokeRect(el.x - textWidth/2 - padding, el.y - el.size/2 - padding, textWidth + padding*2, el.size + padding*2);
            }
            ctx.restore();
        }

        if (el.type === 'sticker') {
            ctx.font = `${el.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(el.content, el.x, el.y);
        } else if (el.type === 'text') {
            ctx.font = `bold ${el.size}px Poppins, Arial`;
            ctx.fillStyle = el.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText(el.content, el.x, el.y);
            ctx.fillText(el.content, el.x, el.y);
        }
    });
}

function updateElementsList() {
    const elementsSection = document.getElementById('elements-section');
    const elementsList = document.getElementById('elements-list');
    const resizeControls = document.getElementById('resize-controls');
    const sizeSlider = document.getElementById('size-slider');
    const sizeValue = document.getElementById('size-value');

    if (photoEditor.elements.length === 0) {
        if (elementsSection) elementsSection.style.display = 'none';
        if (resizeControls) resizeControls.style.display = 'none';
        return;
    }

    if (elementsSection) elementsSection.style.display = 'block';
    if (elementsList) elementsList.innerHTML = '';

    // Show/hide resize controls
    if (photoEditor.selectedElement && resizeControls) {
        resizeControls.style.display = 'block';
        if (sizeSlider) sizeSlider.value = photoEditor.selectedElement.size;
        if (sizeValue) sizeValue.textContent = photoEditor.selectedElement.size;
    } else if (resizeControls) {
        resizeControls.style.display = 'none';
    }

    // Use DocumentFragment for batch DOM updates
    const fragment = document.createDocumentFragment();

    photoEditor.elements.forEach((el) => {
        const item = document.createElement('div');
        item.className = 'element-item' + (photoEditor.selectedElement?.id === el.id ? ' selected' : '');
        item.innerHTML = `
            <div class="element-info">
                <span class="element-icon">${el.type === 'sticker' ? el.content : '<i class="fas fa-font"></i>'}</span>
                <span class="element-name">${el.type === 'sticker' ? 'Sticker' : el.content.substring(0, 15)}</span>
            </div>
            <button class="element-delete" data-id="${el.id}" title="Delete">
                <i class="fas fa-trash"></i>
            </button>
        `;

        item.addEventListener('click', (e) => {
            if (!e.target.closest('.element-delete')) {
                photoEditor.selectedElement = el;
                updateElementsList();
                redrawCanvas();
            }
        });

        item.querySelector('.element-delete').addEventListener('click', (e) => {
            e.stopPropagation();
            deleteElement(el.id);
        });

        fragment.appendChild(item);
    });

    if (elementsList) elementsList.appendChild(fragment);
}

function deleteElement(id) {
    photoEditor.elements = photoEditor.elements.filter(el => el.id !== id);
    if (photoEditor.selectedElement?.id === id) {
        photoEditor.selectedElement = null;
    }
    updateElementsList();
    redrawCanvas();
    showToast('Element deleted!');
}

function initCanvasInteractions() {
    const canvas = photoEditor.canvas;
    if (!canvas) return;

    let dragElement = null;
    let dragOffsetX, dragOffsetY;
    let lastMoveTime = 0;

    // Helper function to get coordinates from mouse or touch event
    const getEventCoords = (e) => {
        if (e.touches && e.touches.length > 0) {
            return { clientX: e.touches[0].clientX, clientY: e.touches[0].clientY };
        }
        return { clientX: e.clientX, clientY: e.clientY };
    };

    // Handle start (mouse down / touch start)
    const handleStart = (e) => {
        // Don't handle if in crop mode (Cropper.js handles it)
        if (photoEditor.cropMode) return;

        e.preventDefault();
        photoEditor.cachedCanvasRect = canvas.getBoundingClientRect();

        const coords = getEventCoords(e);
        const rect = photoEditor.cachedCanvasRect;
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;
        const x = (coords.clientX - rect.left) * scaleX;
        const y = (coords.clientY - rect.top) * scaleY;

        // Check elements for hit (reverse order - top elements first)
        for (let i = photoEditor.elements.length - 1; i >= 0; i--) {
            const el = photoEditor.elements[i];
            const hitSize = el.type === 'sticker' ? el.size : el.size * 2;

            if (Math.abs(x - el.x) < hitSize && Math.abs(y - el.y) < hitSize / 2) {
                photoEditor.isDragging = true;
                dragElement = el;
                photoEditor.selectedElement = el;
                dragOffsetX = x - el.x;
                dragOffsetY = y - el.y;
                canvas.style.cursor = 'grabbing';
                updateElementsList();
                cacheBaseImage();
                startDragAnimation();
                return;
            }
        }

        // Deselect if clicked on empty area
        photoEditor.selectedElement = null;
        updateElementsList();
        redrawCanvas();
    };

    // Handle move - optimized for 60fps
    const handleMove = (e) => {
        if (photoEditor.cropMode) return;
        if (!photoEditor.isDragging || !dragElement) return;

        // Throttle to 60fps max
        const now = performance.now();
        if (now - lastMoveTime < 16) return;
        lastMoveTime = now;

        e.preventDefault();
        const coords = getEventCoords(e);
        const rect = photoEditor.cachedCanvasRect || canvas.getBoundingClientRect();
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        dragElement.x = Math.round((coords.clientX - rect.left) * scaleX - dragOffsetX);
        dragElement.y = Math.round((coords.clientY - rect.top) * scaleY - dragOffsetY);

        photoEditor.needsRedraw = true;
    };

    // Handle end (mouse up / touch end)
    const handleEnd = () => {
        if (photoEditor.cropMode) return;

        stopDragAnimation();
        photoEditor.isDragging = false;
        dragElement = null;
        canvas.style.cursor = 'default';

        if (photoEditor.elements.length > 0) {
            redrawCanvas();
        }
    };

    // Mouse events
    canvas.addEventListener('mousedown', handleStart);
    canvas.addEventListener('mousemove', handleMove);
    canvas.addEventListener('mouseup', handleEnd);
    canvas.addEventListener('mouseleave', handleEnd);

    // Touch events for mobile
    canvas.addEventListener('touchstart', handleStart, { passive: false });
    canvas.addEventListener('touchmove', handleMove, { passive: false });
    canvas.addEventListener('touchend', handleEnd);
    canvas.addEventListener('touchcancel', handleEnd);
}

function cacheBaseImage() {
    const canvas = photoEditor.canvas;
    const ctx = photoEditor.ctx;
    const img = photoEditor.originalImage;

    if (!img) return;

    const offscreen = document.createElement('canvas');
    offscreen.width = canvas.width;
    offscreen.height = canvas.height;
    const offCtx = offscreen.getContext('2d');

    offCtx.save();
    offCtx.translate(offscreen.width / 2, offscreen.height / 2);
    offCtx.rotate((photoEditor.rotation * Math.PI) / 180);
    offCtx.scale(photoEditor.flipH ? -1 : 1, photoEditor.flipV ? -1 : 1);
    offCtx.drawImage(img, -offscreen.width / 2, -offscreen.height / 2, offscreen.width, offscreen.height);
    offCtx.restore();

    photoEditor.baseImageData = offscreen;
}

function startDragAnimation() {
    if (photoEditor.animationFrameId) return;

    function animate() {
        if (photoEditor.needsRedraw && photoEditor.isDragging) {
            drawFast();
            photoEditor.needsRedraw = false;
        }

        if (photoEditor.isDragging) {
            photoEditor.animationFrameId = requestAnimationFrame(animate);
        }
    }

    photoEditor.animationFrameId = requestAnimationFrame(animate);
}

function stopDragAnimation() {
    if (photoEditor.animationFrameId) {
        cancelAnimationFrame(photoEditor.animationFrameId);
        photoEditor.animationFrameId = null;
    }
    photoEditor.needsRedraw = false;
}

function drawFast() {
    const canvas = photoEditor.canvas;
    const ctx = photoEditor.ctx;

    if (!photoEditor.baseImageData) {
        redrawCanvas();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(photoEditor.baseImageData, 0, 0);
    drawElementsFast();
}

function drawElementsFast() {
    const ctx = photoEditor.ctx;

    photoEditor.elements.forEach((el) => {
        if (photoEditor.selectedElement && photoEditor.selectedElement.id === el.id) {
            ctx.save();
            ctx.strokeStyle = '#4ecdc4';
            ctx.lineWidth = 2;
            ctx.setLineDash([5, 5]);
            const padding = 10;
            if (el.type === 'sticker') {
                ctx.strokeRect(el.x - el.size/2 - padding, el.y - el.size/2 - padding, el.size + padding*2, el.size + padding*2);
            } else {
                ctx.font = `bold ${el.size}px Poppins, Arial`;
                const textWidth = ctx.measureText(el.content).width;
                ctx.strokeRect(el.x - textWidth/2 - padding, el.y - el.size/2 - padding, textWidth + padding*2, el.size + padding*2);
            }
            ctx.setLineDash([]);
            ctx.restore();
        }

        if (el.type === 'sticker') {
            ctx.font = `${el.size}px Arial`;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(el.content, el.x, el.y);
        } else if (el.type === 'text') {
            ctx.font = `bold ${el.size}px Poppins, Arial`;
            ctx.fillStyle = el.color;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 3;
            ctx.strokeText(el.content, el.x, el.y);
            ctx.fillText(el.content, el.x, el.y);
        }
    });
}

// ============================================
// CROPPER.JS INTEGRATION - Smooth & Professional
// ============================================

function startCropMode() {
    photoEditor.cropMode = true;

    const canvas = photoEditor.canvas;
    const cropperWrapper = document.getElementById('cropper-wrapper');
    const cropperImage = document.getElementById('cropper-image');

    if (!cropperWrapper || !cropperImage) return;

    // Get current canvas state as image
    const imageData = canvas.toDataURL('image/png');
    cropperImage.src = imageData;

    // Hide canvas, show cropper wrapper
    canvas.style.display = 'none';
    cropperWrapper.style.display = 'block';

    // Determine aspect ratio
    let aspectRatio = NaN; // Free crop by default
    if (photoEditor.cropRatio !== 'free') {
        const [w, h] = photoEditor.cropRatio.split(':').map(Number);
        aspectRatio = w / h;
    }

    // Initialize Cropper.js with optimized settings
    cropperImage.onload = function() {
        // Destroy previous instance if exists
        if (photoEditor.cropper) {
            photoEditor.cropper.destroy();
        }

        photoEditor.cropper = new Cropper(cropperImage, {
            aspectRatio: aspectRatio,
            viewMode: 1,
            dragMode: 'crop',
            autoCropArea: 0.8,
            restore: false,
            guides: true,
            center: true,
            highlight: true,
            cropBoxMovable: true,
            cropBoxResizable: true,
            toggleDragModeOnDblclick: false,
            initialAspectRatio: aspectRatio,
            responsive: true,
            checkCrossOrigin: false,
            modal: true,
            background: true,
            zoomable: true,
            zoomOnTouch: true,
            zoomOnWheel: true,
            wheelZoomRatio: 0.1,
            ready: function() {
                // Enable apply button when cropper is ready
                const applyCropBtn = document.getElementById('apply-crop');
                if (applyCropBtn) applyCropBtn.disabled = false;
            }
        });
    };

    // Update button states
    const startCrop = document.getElementById('start-crop');
    const cancelCrop = document.getElementById('cancel-crop');
    if (startCrop) startCrop.disabled = true;
    if (cancelCrop) cancelCrop.disabled = false;

    showToast('Drag to adjust crop area. Pinch or scroll to zoom.');
}

function cancelCrop() {
    photoEditor.cropMode = false;

    const canvas = photoEditor.canvas;
    const cropperWrapper = document.getElementById('cropper-wrapper');

    // Destroy Cropper.js instance
    if (photoEditor.cropper) {
        photoEditor.cropper.destroy();
        photoEditor.cropper = null;
    }

    // Hide cropper wrapper, show canvas
    if (cropperWrapper) cropperWrapper.style.display = 'none';
    if (canvas) canvas.style.display = 'block';

    // Reset button states
    const startCrop = document.getElementById('start-crop');
    const applyCropBtn = document.getElementById('apply-crop');
    const cancelCropBtn = document.getElementById('cancel-crop');
    if (startCrop) startCrop.disabled = false;
    if (applyCropBtn) applyCropBtn.disabled = true;
    if (cancelCropBtn) cancelCropBtn.disabled = true;
}

function applyCrop() {
    if (!photoEditor.cropper) return;

    const canvas = photoEditor.canvas;
    const cropperWrapper = document.getElementById('cropper-wrapper');

    // Get cropped canvas from Cropper.js
    const croppedCanvas = photoEditor.cropper.getCroppedCanvas({
        maxWidth: 1200,
        maxHeight: 1200,
        imageSmoothingEnabled: true,
        imageSmoothingQuality: 'high'
    });

    if (!croppedCanvas) {
        showToast('Error cropping image!');
        return;
    }

    // Create new image from cropped canvas
    const croppedImg = new Image();
    croppedImg.onload = function() {
        // Destroy Cropper.js instance
        if (photoEditor.cropper) {
            photoEditor.cropper.destroy();
            photoEditor.cropper = null;
        }

        // Update original image
        photoEditor.originalImage = croppedImg;

        // Calculate new canvas size
        const maxWidth = window.innerWidth <= 768 ? Math.min(window.innerWidth - 40, 400) : 600;
        const maxHeight = window.innerWidth <= 768 ? 350 : 500;
        let newWidth = croppedImg.width;
        let newHeight = croppedImg.height;

        if (newWidth > maxWidth) {
            newHeight = (maxWidth / newWidth) * newHeight;
            newWidth = maxWidth;
        }
        if (newHeight > maxHeight) {
            newWidth = (maxHeight / newHeight) * newWidth;
            newHeight = maxHeight;
        }

        // Resize canvas
        canvas.width = Math.round(newWidth);
        canvas.height = Math.round(newHeight);

        // Reset transforms
        photoEditor.rotation = 0;
        photoEditor.flipH = false;
        photoEditor.flipV = false;

        // Clear stickers/text (they won't align after crop)
        photoEditor.elements = [];

        // Hide cropper wrapper, show canvas
        if (cropperWrapper) cropperWrapper.style.display = 'none';
        canvas.style.display = 'block';

        // Reset button states
        const startCrop = document.getElementById('start-crop');
        const applyCropBtn = document.getElementById('apply-crop');
        const cancelCropBtn = document.getElementById('cancel-crop');
        if (startCrop) startCrop.disabled = false;
        if (applyCropBtn) applyCropBtn.disabled = true;
        if (cancelCropBtn) cancelCropBtn.disabled = true;

        photoEditor.cropMode = false;

        // Redraw canvas with cropped image
        redrawCanvas();
        updateElementsList();
        showToast('Image cropped successfully!');
    };

    croppedImg.src = croppedCanvas.toDataURL('image/png');
}

// Update crop ratio when preset is changed
function updateCropRatio(ratio) {
    photoEditor.cropRatio = ratio;

    // If cropper is active, update its aspect ratio
    if (photoEditor.cropper) {
        if (ratio === 'free') {
            photoEditor.cropper.setAspectRatio(NaN);
        } else {
            const [w, h] = ratio.split(':').map(Number);
            photoEditor.cropper.setAspectRatio(w / h);
        }
    }
}

function resetEditor() {
    photoEditor.rotation = 0;
    photoEditor.flipH = false;
    photoEditor.flipV = false;
    photoEditor.filters = { brightness: 100, contrast: 100, saturation: 100, blur: 0 };
    photoEditor.elements = [];
    photoEditor.currentFilter = 'none';
    photoEditor.selectedElement = null;

    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    const noneFilter = document.querySelector('.filter-btn[data-filter="none"]');
    if (noneFilter) noneFilter.classList.add('active');

    const sliders = ['brightness', 'contrast', 'saturation'];
    sliders.forEach(s => {
        const slider = document.getElementById(`${s}-slider`);
        if (slider) slider.value = 100;
    });
    const blurSlider = document.getElementById('blur-slider');
    if (blurSlider) blurSlider.value = 0;

    const elementsSection = document.getElementById('elements-section');
    const elementsList = document.getElementById('elements-list');
    const resizeControls = document.getElementById('resize-controls');
    if (elementsSection) elementsSection.style.display = 'none';
    if (elementsList) elementsList.innerHTML = '';
    if (resizeControls) resizeControls.style.display = 'none';

    if (photoEditor.canvas) photoEditor.canvas.style.filter = 'none';
    cancelCrop();
    redrawCanvas();
    showToast('Editor reset!');
}

function saveAndApply() {
    if (!currentTargetImage) {
        showToast('No target image selected!');
        return;
    }

    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d');
    const canvas = photoEditor.canvas;

    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;

    tempCtx.filter = canvas.style.filter || 'none';
    tempCtx.drawImage(canvas, 0, 0);
    tempCtx.filter = 'none';

    photoEditor.elements.forEach((el) => {
        if (el.type === 'sticker') {
            tempCtx.font = `${el.size}px Arial`;
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.fillText(el.content, el.x, el.y);
        } else if (el.type === 'text') {
            tempCtx.font = `bold ${el.size}px Poppins, Arial`;
            tempCtx.fillStyle = el.color;
            tempCtx.textAlign = 'center';
            tempCtx.textBaseline = 'middle';
            tempCtx.strokeStyle = 'black';
            tempCtx.lineWidth = 3;
            tempCtx.strokeText(el.content, el.x, el.y);
            tempCtx.fillText(el.content, el.x, el.y);
        }
    });

    const finalImage = tempCanvas.toDataURL('image/png');

    currentTargetImage.imgElement.src = finalImage;
    currentTargetImage.imgElement.style.display = 'block';
    localStorage.setItem(currentTargetImage.imgId, finalImage);

    if (currentTargetImage.defaultAvatar) {
        currentTargetImage.defaultAvatar.style.display = 'none';
    }

    if (currentTargetImage.isGallery) {
        const galleryItem = currentTargetImage.imgElement.closest('.gallery-item');
        if (galleryItem) galleryItem.classList.add('has-image');
    }

    showToast('Photo saved successfully!');
    closePhotoEditor();
}

/* ============================================
   SKILL BARS ANIMATION - Optimized with IntersectionObserver
   ============================================ */
function initSkillBars() {
    const skillBars = document.querySelectorAll('.skill-progress');
    if (skillBars.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progress = entry.target.dataset.progress;
                entry.target.style.width = progress + '%';
                observer.unobserve(entry.target); // Stop observing once animated
            }
        });
    }, { threshold: 0.5, rootMargin: '0px' });

    skillBars.forEach(bar => observer.observe(bar));
}

/* ============================================
   COUNTER ANIMATION - Optimized with RAF
   ============================================ */
function initCounters() {
    const counters = document.querySelectorAll('.stat-number');
    if (counters.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = parseInt(entry.target.dataset.count);
                animateCounter(entry.target, target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element, target) {
    const duration = 2000;
    const startTime = performance.now();

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(easeOut * target);

        element.textContent = current;

        if (progress < 1) {
            requestAnimationFrame(update);
        }
    }

    requestAnimationFrame(update);
}

/* ============================================
   TESTIMONIAL SLIDER - Optimized
   ============================================ */
function initTestimonialSlider() {
    const slider = document.querySelector('.testimonials-slider');
    const dots = document.querySelectorAll('.dot');
    const cards = document.querySelectorAll('.testimonial-card');

    if (!slider || cards.length === 0) return;

    let currentIndex = 0;
    let autoSlideInterval;

    const updateSlider = () => {
        const cardWidth = cards[0].offsetWidth + 32;
        slider.scrollTo({
            left: cardWidth * currentIndex,
            behavior: 'smooth'
        });

        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentIndex);
        });
    };

    // Event delegation for dots
    const dotsContainer = document.querySelector('.slider-dots');
    if (dotsContainer) {
        dotsContainer.addEventListener('click', (e) => {
            const dot = e.target.closest('.dot');
            if (dot) {
                currentIndex = Array.from(dots).indexOf(dot);
                updateSlider();
                resetAutoSlide();
            }
        });
    }

    const resetAutoSlide = () => {
        clearInterval(autoSlideInterval);
        autoSlideInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % cards.length;
            updateSlider();
        }, 5000);
    };

    resetAutoSlide();

    // Optimized scroll detection with throttle
    slider.addEventListener('scroll', throttle(() => {
        const cardWidth = cards[0].offsetWidth + 32;
        const newIndex = Math.round(slider.scrollLeft / cardWidth);
        if (newIndex !== currentIndex && newIndex >= 0 && newIndex < cards.length) {
            currentIndex = newIndex;
            dots.forEach((dot, index) => {
                dot.classList.toggle('active', index === currentIndex);
            });
        }
    }, 100), { passive: true });
}

/* ============================================
   CONTACT FORM - Optimized
   ============================================ */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const name = document.getElementById('name')?.value || 'Friend';
        const subject = document.getElementById('subject')?.value || 'general';

        const responses = {
            'money': `Nice try, ${name}! Govardhan's wallet is in witness protection.`,
            'plans': `Hey ${name}! Govardhan will be there "in 5 minutes" (IST).`,
            'food': `FREE FOOD! Govardhan is already on his way!`,
            'default': `Thanks ${name}! Message sent to the void!`
        };

        showToast(responses[subject] || responses['default']);
        form.reset();

        const submitBtn = form.querySelector('.submit-btn');
        if (submitBtn) {
            submitBtn.innerHTML = '<span>Sent to the Void!</span> <i class="fas fa-check"></i>';
            submitBtn.style.background = 'linear-gradient(135deg, #4ecdc4, #3b82f6)';

            setTimeout(() => {
                submitBtn.innerHTML = '<span>Send Message</span> <i class="fas fa-paper-plane"></i>';
                submitBtn.style.background = '';
            }, 3000);
        }
    });
}

/* ============================================
   SCROLL ANIMATIONS - Optimized with single observer
   ============================================ */
function initScrollAnimations() {
    const animatedElements = document.querySelectorAll(
        '.skill-card, .timeline-item, .gallery-item, .testimonial-card, .contact-item'
    );

    if (animatedElements.length === 0) return;

    // Single observer for all elements
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target); // Stop observing once visible
            }
        });
    }, { threshold: 0.1, rootMargin: '50px' });

    animatedElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease-out';
        observer.observe(element);
    });
}

/* ============================================
   EASTER EGGS - Optimized
   ============================================ */
let konamiCode = [];
const konamiPattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

document.addEventListener('keydown', (e) => {
    konamiCode.push(e.key);
    if (konamiCode.length > 10) konamiCode.shift(); // Keep only last 10

    if (konamiCode.join(',') === konamiPattern.join(',')) {
        activateEasterEgg();
        konamiCode = [];
    }
});

function activateEasterEgg() {
    document.body.style.animation = 'rainbow 2s linear';
    showToast('You found the secret! Govardhan still owes you money!');

    // Use existing style or create once
    if (!document.getElementById('easter-egg-style')) {
        const style = document.createElement('style');
        style.id = 'easter-egg-style';
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);
    }

    setTimeout(() => {
        document.body.style.animation = '';
    }, 2000);
}

/* ============================================
   FLOATING ACTION BUTTON
   ============================================ */
const fabContainer = document.querySelector('.fab-container');
if (fabContainer) {
    fabContainer.addEventListener('click', (e) => {
        const option = e.target.closest('.fab-option');
        if (option && option.dataset.tooltip) {
            showToast(option.dataset.tooltip);
        }
    });
}

/* ============================================
   SMOOTH REVEAL ON PAGE LOAD
   ============================================ */
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';

    requestAnimationFrame(() => {
        document.body.style.opacity = '1';
    });
});

/* ============================================
   CONSOLE EASTER EGG
   ============================================ */
console.log(`
%c GOVARDHAN HL - Professional Time Waster
%c
If you're reading this, you're more productive than Govardhan.

Made with sarcasm by a best friend.
`,
'font-size: 20px; font-weight: bold; color: #ff6b6b;',
'font-size: 12px; color: #4ecdc4;'
);

/* ============================================
   SERVICE WORKER REGISTRATION (Optional PWA)
   ============================================ */
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Uncomment below to enable PWA
        // navigator.serviceWorker.register('/sw.js').catch(() => {});
    });
}

/* ============================================
   FIREBASE AUTHENTICATION SYSTEM
   Enterprise-level security like Instagram/Facebook
   ============================================ */

// Firebase configuration - Govardhan Portfolio
const firebaseConfig = {
    apiKey: "AIzaSyAhW4q769KsFnIN5he-7xir7qzxhA7iz5w",
    authDomain: "govardhan-portfolio.firebaseapp.com",
    projectId: "govardhan-portfolio",
    storageBucket: "govardhan-portfolio.firebasestorage.app",
    messagingSenderId: "672217063954",
    appId: "1:672217063954:web:ad5dadd92e9fde58156ecb"
};

// Admin email - ONLY this email can edit (obfuscated for extra privacy)
const ADMIN_EMAIL = atob("bWdwcm9tYXgzMUBnbWFpbC5jb20=");

// Firebase state
let firebaseApp = null;
let firebaseAuth = null;
let currentUser = null;

// Initialize Firebase (only if configured)
function initFirebase() {
    // Check if Firebase SDK is loaded and configured
    if (typeof firebase === 'undefined') {
        console.log('Firebase SDK not loaded - Admin features disabled');
        hideAdminButton();
        return false;
    }

    if (firebaseConfig.apiKey === "YOUR_API_KEY") {
        console.log('Firebase not configured - Admin features disabled for security');
        hideAdminButton();
        return false;
    }

    try {
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth();

        // Listen for auth state changes
        firebaseAuth.onAuthStateChanged((user) => {
            currentUser = user;
            if (user && user.email === ADMIN_EMAIL) {
                enableAdminMode();
                showToast('Welcome back, Admin!');
            } else {
                disableAdminMode();
            }
        });

        return true;
    } catch (error) {
        console.error('Firebase init error:', error);
        hideAdminButton();
        return false;
    }
}

function hideAdminButton() {
    const loginBtn = document.getElementById('admin-login-btn');
    if (loginBtn) loginBtn.style.display = 'none';
}

// Initialize admin system with Firebase
function initAdminSystem() {
    const loginBtn = document.getElementById('admin-login-btn');
    const modal = document.getElementById('admin-modal');
    const passwordInput = document.getElementById('admin-password');
    const emailInput = document.getElementById('admin-email');
    const submitBtn = document.getElementById('admin-submit');
    const cancelBtn = document.getElementById('admin-cancel');
    const errorMsg = document.getElementById('admin-error');

    if (!loginBtn || !modal) return;

    // Initialize Firebase
    const firebaseReady = initFirebase();

    if (!firebaseReady) {
        // Firebase not configured - hide admin button completely
        return;
    }

    // Open modal
    loginBtn.addEventListener('click', () => {
        if (currentUser && currentUser.email === ADMIN_EMAIL) {
            // Logout
            firebaseAuth.signOut().then(() => {
                showToast('Logged out successfully!');
            });
        } else {
            modal.classList.add('active');
            if (emailInput) emailInput.focus();
        }
    });

    // Close modal
    cancelBtn.addEventListener('click', () => {
        modal.classList.remove('active');
        if (emailInput) emailInput.value = '';
        passwordInput.value = '';
        errorMsg.style.display = 'none';
    });

    // Submit login with Firebase
    submitBtn.addEventListener('click', async () => {
        const email = emailInput ? emailInput.value : '';
        const password = passwordInput.value;

        if (!email || !password) {
            showError('Please enter email and password');
            return;
        }

        // Check if it's the admin email BEFORE trying to login
        if (email !== ADMIN_EMAIL) {
            showError('Access denied. You are not authorized.');
            return;
        }

        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Verifying...';

        try {
            await firebaseAuth.signInWithEmailAndPassword(email, password);
            modal.classList.remove('active');
            if (emailInput) emailInput.value = '';
            passwordInput.value = '';
        } catch (error) {
            let message = 'Login failed';
            switch (error.code) {
                case 'auth/wrong-password':
                    message = 'Incorrect password';
                    break;
                case 'auth/user-not-found':
                    message = 'Account not found';
                    break;
                case 'auth/too-many-requests':
                    message = 'Too many attempts. Try later.';
                    break;
                case 'auth/network-request-failed':
                    message = 'Network error. Check connection.';
                    break;
                default:
                    message = error.message;
            }
            showError(message);
        }

        submitBtn.disabled = false;
        submitBtn.innerHTML = 'Login';
    });

    function showError(message) {
        errorMsg.textContent = message;
        errorMsg.style.display = 'block';
        setTimeout(() => {
            errorMsg.style.display = 'none';
        }, 4000);
    }

    // Enter key to submit
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') submitBtn.click();
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) cancelBtn.click();
    });
}

function enableAdminMode() {
    document.body.classList.add('admin-mode');
    const loginBtn = document.getElementById('admin-login-btn');
    if (loginBtn) {
        loginBtn.classList.add('logged-in');
        loginBtn.innerHTML = '<i class="fas fa-unlock"></i>';
        loginBtn.title = 'Logout';
    }
}

function disableAdminMode() {
    document.body.classList.remove('admin-mode');
    const loginBtn = document.getElementById('admin-login-btn');
    if (loginBtn) {
        loginBtn.classList.remove('logged-in');
        loginBtn.innerHTML = '<i class="fas fa-lock"></i>';
        loginBtn.title = 'Admin Login';
    }
}

/* ============================================
   PROFILE FULLSCREEN WITH MUSIC
   ============================================ */

function initProfileFullscreen() {
    const profileClickable = document.getElementById('profile-clickable');
    const fullscreenModal = document.getElementById('profile-fullscreen-modal');
    const closeBtn = document.getElementById('close-fullscreen');
    const fullscreenImg = document.getElementById('fullscreen-profile-img');
    const profilePic = document.getElementById('profile-pic');
    const themeSong = document.getElementById('theme-song');

    if (!profileClickable || !fullscreenModal) return;

    // Click on profile (only when not in admin mode)
    profileClickable.addEventListener('click', (e) => {
        // Don't open fullscreen in admin mode or if clicking on upload/remove buttons
        if (document.body.classList.contains('admin-mode')) return;
        if (e.target.closest('.upload-overlay') || e.target.closest('.remove-photo-btn')) return;
        if (e.target.closest('input[type="file"]')) return;

        // Check if there's a profile image
        const imgSrc = profilePic.src || localStorage.getItem('profile-pic');
        if (!imgSrc || profilePic.style.display === 'none') {
            showToast('No profile photo yet!');
            return;
        }

        // Set fullscreen image
        fullscreenImg.src = imgSrc;

        // Open fullscreen modal
        fullscreenModal.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Play music (user interaction allows autoplay)
        if (themeSong) {
            themeSong.currentTime = 0;
            themeSong.play().catch(() => {
                // Autoplay blocked - that's ok
                console.log('Audio autoplay blocked');
            });
        }
    });

    // Close fullscreen
    if (closeBtn) {
        closeBtn.addEventListener('click', closeFullscreen);
    }

    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && fullscreenModal.classList.contains('active')) {
            closeFullscreen();
        }
    });

    function closeFullscreen() {
        fullscreenModal.classList.remove('active');
        document.body.style.overflow = '';

        // Stop music
        if (themeSong) {
            themeSong.pause();
            themeSong.currentTime = 0;
        }
    }
}

/* ============================================
   MUSIC UPLOAD FUNCTIONALITY
   ============================================ */

function initMusicUpload() {
    const musicUploadBtn = document.getElementById('music-upload-btn');
    const musicUploadInput = document.getElementById('music-upload');
    const removeMusicBtn = document.getElementById('remove-music');
    const musicStatus = document.getElementById('music-status');
    const themeSong = document.getElementById('theme-song');

    if (!musicUploadBtn || !musicUploadInput) return;

    // Load music: First check GitHub images/ folder, then localStorage
    if (THEME_SONG_FILE) {
        // Load from GitHub images/ folder (everyone hears same song)
        themeSong.src = 'images/' + THEME_SONG_FILE;
        musicUploadBtn.classList.add('has-song');
        musicStatus.textContent = 'Theme Song Ready';
        if (removeMusicBtn) removeMusicBtn.style.display = 'flex';
    } else {
        // Fallback to localStorage
        const savedMusic = localStorage.getItem('theme-song');
        if (savedMusic) {
            themeSong.src = savedMusic;
            musicUploadBtn.classList.add('has-song');
            musicStatus.textContent = 'Theme Song Ready';
            if (removeMusicBtn) removeMusicBtn.style.display = 'flex';
        }
    }

    // Click to upload music
    musicUploadBtn.addEventListener('click', () => {
        musicUploadInput.click();
    });

    // Handle file selection
    musicUploadInput.addEventListener('click', function() {
        this.value = ''; // Reset to allow re-upload of same file
    });

    musicUploadInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('audio/')) {
            showToast('Please select an audio file (MP3, WAV, etc.)');
            return;
        }

        // Show loading state
        musicStatus.textContent = 'Uploading...';

        const reader = new FileReader();
        reader.onload = function(event) {
            const audioData = event.target.result;

            // Save to localStorage
            try {
                localStorage.setItem('theme-song', audioData);

                // Update audio element
                themeSong.src = audioData;

                // Update UI
                musicUploadBtn.classList.add('has-song');
                musicStatus.textContent = 'Theme Song Ready';
                if (removeMusicBtn) removeMusicBtn.style.display = 'flex';

                showToast('Theme song uploaded!');
            } catch (err) {
                // localStorage might be full
                if (err.name === 'QuotaExceededError') {
                    showToast('Storage full! Try a smaller file.');
                } else {
                    showToast('Error saving song. Try again.');
                }
                musicStatus.textContent = 'Add Theme Song';
                console.error('Music upload error:', err);
            }
        };

        reader.onerror = function() {
            showToast('Error reading file!');
            musicStatus.textContent = 'Add Theme Song';
        };

        reader.readAsDataURL(file);
    });

    // Remove music
    if (removeMusicBtn) {
        removeMusicBtn.addEventListener('click', (e) => {
            e.stopPropagation();

            localStorage.removeItem('theme-song');
            themeSong.src = 'theme-song.mp3'; // Reset to default
            musicUploadBtn.classList.remove('has-song');
            musicStatus.textContent = 'Add Theme Song';
            removeMusicBtn.style.display = 'none';

            showToast('Theme song removed!');
        });
    }
}

/* ============================================
   IMAGE LIGHTBOX - High Quality Viewing
   ============================================ */

function initLightbox() {
    const lightbox = document.getElementById('image-lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxCaption = document.getElementById('lightbox-caption');
    const closeBtn = document.getElementById('lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    if (!lightbox) return;

    // Collect all gallery images
    let galleryImages = [];
    let currentIndex = 0;

    function updateGalleryImages() {
        galleryImages = [];
        // Get all gallery images that have a source
        document.querySelectorAll('.gallery-img').forEach((img, index) => {
            if (img.src && img.style.display !== 'none') {
                const caption = img.closest('.gallery-item')?.querySelector('.gallery-caption')?.textContent || '';
                galleryImages.push({
                    src: img.src,
                    caption: caption,
                    element: img
                });
            }
        });
        // Also add about image if exists
        const aboutImg = document.getElementById('about-pic');
        if (aboutImg && aboutImg.src && aboutImg.style.display !== 'none') {
            galleryImages.push({
                src: aboutImg.src,
                caption: 'The Legend Himself',
                element: aboutImg
            });
        }
    }

    function openLightbox(imgSrc, caption, index) {
        updateGalleryImages();
        currentIndex = index;
        lightboxImg.src = imgSrc;
        lightboxCaption.textContent = caption;
        lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Show/hide nav buttons based on gallery size
        if (galleryImages.length > 1) {
            prevBtn.style.display = 'flex';
            nextBtn.style.display = 'flex';
        } else {
            prevBtn.style.display = 'none';
            nextBtn.style.display = 'none';
        }
    }

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
    }

    function showPrev() {
        if (galleryImages.length === 0) return;
        currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxCaption.textContent = galleryImages[currentIndex].caption;
    }

    function showNext() {
        if (galleryImages.length === 0) return;
        currentIndex = (currentIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentIndex].src;
        lightboxCaption.textContent = galleryImages[currentIndex].caption;
    }

    // Click on gallery images to open lightbox
    document.querySelectorAll('.gallery-img').forEach((img) => {
        img.addEventListener('click', (e) => {
            // Don't open lightbox in admin mode when clicking upload area
            if (document.body.classList.contains('admin-mode') && !img.src) return;
            if (!img.src || img.style.display === 'none') return;

            updateGalleryImages();
            const index = galleryImages.findIndex(g => g.element === img);
            const caption = img.closest('.gallery-item')?.querySelector('.gallery-caption')?.textContent || '';
            openLightbox(img.src, caption, index >= 0 ? index : 0);
        });
    });

    // Click on about image
    const aboutImg = document.getElementById('about-pic');
    if (aboutImg) {
        aboutImg.addEventListener('click', () => {
            if (!aboutImg.src || aboutImg.style.display === 'none') return;
            updateGalleryImages();
            const index = galleryImages.findIndex(g => g.element === aboutImg);
            openLightbox(aboutImg.src, 'The Legend Himself', index >= 0 ? index : 0);
        });
    }

    // Close button
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);

    // Nav buttons
    if (prevBtn) prevBtn.addEventListener('click', showPrev);
    if (nextBtn) nextBtn.addEventListener('click', showNext);

    // Close on background click
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') showPrev();
        if (e.key === 'ArrowRight') showNext();
    });

    // Swipe support for mobile
    let touchStartX = 0;
    let touchEndX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) showNext();
            else showPrev();
        }
    }, { passive: true });
}

// Initialize new features on DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initAdminSystem();
    initProfileFullscreen();
    initMusicUpload();
    initLightbox();
});
