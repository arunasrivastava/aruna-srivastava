// Theme Toggle Functionality
(function() {
    const themeToggle = document.getElementById('themeToggle');
    const html = document.documentElement;

    // Check for saved theme preference or default to system preference
    const getPreferredTheme = () => {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme) {
            return savedTheme;
        }
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    };

    // Apply theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            html.setAttribute('data-theme', 'dark');
        } else {
            html.removeAttribute('data-theme');
        }
        localStorage.setItem('theme', theme);
    };

    // Initialize theme
    setTheme(getPreferredTheme());

    // Toggle theme on button click
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            const currentTheme = html.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            setTheme(newTheme);
        });
    }

    // Listen for system theme changes
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
            setTheme(e.matches ? 'dark' : 'light');
        }
    });
})();

// Menu Toggle Functionality
(function() {
    const menuToggle = document.getElementById('menuToggle');
    const menuOverlay = document.getElementById('menuOverlay');

    if (!menuToggle || !menuOverlay) return;

    function openMenu() {
        menuToggle.classList.add('active');
        menuOverlay.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        menuToggle.classList.remove('active');
        menuOverlay.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        if (menuOverlay.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    // Toggle menu on button click
    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when clicking on the overlay background (not the content)
    menuOverlay.addEventListener('click', (e) => {
        if (e.target === menuOverlay) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && menuOverlay.classList.contains('active')) {
            closeMenu();
        }
    });

    // Close menu when clicking a link
    const menuLinks = menuOverlay.querySelectorAll('.menu-link');
    menuLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });
})();

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add subtle parallax effect to graph paper on mouse move (optional enhancement)
document.addEventListener('mousemove', (e) => {
    const graphPaper = document.querySelector('.graph-paper');
    if (graphPaper && window.innerWidth > 768) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.005;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.005;
        graphPaper.style.transform = `translate(${moveX}px, ${moveY}px)`;
    }
});

// Re-trigger animations when returning to page (optional)
document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
        const content = document.querySelector('.content');
        if (content) {
            content.style.animation = 'none';
            content.offsetHeight; // Trigger reflow
            content.style.animation = '';
        }
    }
});

// Papers Carousel
(function() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const cards = Array.from(track.querySelectorAll('.paper-card'));
    const prevBtn = document.querySelector('.carousel-prev');
    const nextBtn = document.querySelector('.carousel-next');

    let currentIndex = 0;
    const totalCards = cards.length;
    const cardWidth = 220;
    const gap = 24; // 1.5rem

    function updateCarousel() {
        // Calculate offset to center the current card
        const offset = currentIndex * (cardWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;

        // Update active state
        cards.forEach((card, index) => {
            card.classList.toggle('active', index === currentIndex);
        });
    }

    function goToNext() {
        currentIndex = (currentIndex + 1) % totalCards;
        updateCarousel();
    }

    function goToPrev() {
        currentIndex = (currentIndex - 1 + totalCards) % totalCards;
        updateCarousel();
    }

    // Event listeners
    nextBtn.addEventListener('click', goToNext);
    prevBtn.addEventListener('click', goToPrev);

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        const readingSection = document.getElementById('reading');
        const rect = readingSection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;

        if (isInView) {
            if (e.key === 'ArrowRight') goToNext();
            if (e.key === 'ArrowLeft') goToPrev();
        }
    });

    // Initialize
    updateCarousel();
})();

// Photo Gallery Shuffle
(function() {
    const shuffleBtn = document.getElementById('shuffleBtn');
    const gallery = document.querySelector('.photo-gallery');
    const photographySection = document.getElementById('photography');
    if (!shuffleBtn || !gallery || !photographySection) return;

    let isShuffling = false;

    // Show/hide shuffle button based on scroll position
    function updateShuffleButtonVisibility() {
        const rect = photographySection.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight * 0.8 && rect.bottom > 100;

        if (isInView) {
            shuffleBtn.classList.add('visible');
        } else {
            shuffleBtn.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', updateShuffleButtonVisibility, { passive: true });
    updateShuffleButtonVisibility();

    function shuffleArray(array) {
        const newArray = [...array];
        for (let i = newArray.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
        }
        return newArray;
    }

    async function shuffleGallery() {
        if (isShuffling) return;
        isShuffling = true;

        const items = Array.from(gallery.querySelectorAll('.photo-item'));
        gallery.classList.add('is-shuffling');

        // Fade out all items with stagger
        items.forEach((item, index) => {
            item.style.transition = `opacity 0.3s ease ${index * 0.02}s, transform 0.3s ease ${index * 0.02}s`;
            item.classList.add('shuffling');
        });

        // Wait for fade out
        await new Promise(resolve => setTimeout(resolve, 400));

        // Shuffle the items
        const shuffledItems = shuffleArray(items);

        // Remove all items from DOM
        items.forEach(item => item.remove());

        // Add shuffled items back
        shuffledItems.forEach(item => {
            gallery.appendChild(item);
        });

        // Small delay before fade in
        await new Promise(resolve => setTimeout(resolve, 50));

        // Fade in with stagger
        shuffledItems.forEach((item, index) => {
            item.style.transition = `opacity 0.4s ease ${index * 0.03}s, transform 0.4s ease ${index * 0.03}s`;
            item.classList.remove('shuffling');
        });

        // Wait for fade in to complete
        await new Promise(resolve => setTimeout(resolve, 600));

        // Clean up
        shuffledItems.forEach(item => {
            item.style.transition = '';
        });
        gallery.classList.remove('is-shuffling');
        isShuffling = false;
    }

    shuffleBtn.addEventListener('click', shuffleGallery);
})();

// Story Gallery Carousel for Blog Posts
(function() {
    const gallery = document.querySelector('.story-gallery');
    if (!gallery) return;

    const images = gallery.querySelectorAll('.story-gallery-images img');
    const nextBtn = gallery.querySelector('.story-gallery-next');
    const dots = gallery.querySelectorAll('.story-gallery-dots .dot');

    if (images.length < 2) return;

    let currentIndex = 0;

    function showImage(index) {
        images.forEach((img, i) => {
            img.classList.toggle('active', i === index);
        });
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
        currentIndex = index;
    }

    function nextImage() {
        const next = (currentIndex + 1) % images.length;
        showImage(next);
    }

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        nextImage();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', (e) => {
            e.stopPropagation();
            showImage(index);
        });
    });
})();

// Fullscreen Image Lightbox for Blog Posts
(function() {
    const storyImage = document.querySelector('.story-image') || document.querySelector('.story-gallery');
    if (!storyImage) return;

    const img = storyImage.querySelector('img');
    if (!img) return;

    // Create lightbox elements
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';

    const lightboxImg = document.createElement('img');
    lightboxImg.alt = img.alt;

    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.setAttribute('aria-label', 'Close fullscreen');
    closeBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

    const hint = document.createElement('div');
    hint.className = 'lightbox-hint';
    hint.textContent = 'Press ESC or click anywhere to close';

    overlay.appendChild(lightboxImg);
    overlay.appendChild(closeBtn);
    overlay.appendChild(hint);
    document.body.appendChild(overlay);

    // Open lightbox - show currently active image for galleries
    storyImage.addEventListener('click', (e) => {
        // Don't open if clicking navigation buttons
        if (e.target.closest('.story-gallery-next') || e.target.closest('.story-gallery-dots')) return;

        // Get the active image (for galleries) or first image
        const activeImg = storyImage.querySelector('img.active') || storyImage.querySelector('img');
        if (activeImg) {
            lightboxImg.src = activeImg.src;
            lightboxImg.alt = activeImg.alt;
        }
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });

    // Close lightbox functions
    function closeLightbox() {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    overlay.addEventListener('click', closeLightbox);
    closeBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && overlay.classList.contains('active')) {
            closeLightbox();
        }
    });
})();

// Scroll Reveal Animation for Photos (waits for image to load)
(function() {
    const photos = document.querySelectorAll('.photo-item');
    if (!photos.length) return;

    const observerOptions = {
        root: null,
        rootMargin: '50px',
        threshold: 0.1
    };

    const revealWhenReady = (photoItem, delay) => {
        const img = photoItem.querySelector('img');

        const reveal = () => {
            setTimeout(() => {
                photoItem.classList.add('revealed');
            }, delay);
        };

        // If image already loaded (cached), reveal immediately
        if (img.complete && img.naturalHeight !== 0) {
            reveal();
        } else {
            // Wait for image to load
            img.addEventListener('load', reveal, { once: true });
            // Fallback: reveal after timeout if load event doesn't fire
            setTimeout(reveal, 3000);
        }
    };

    const revealPhoto = (entries, observer) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const visibleItems = Array.from(photos).filter(p =>
                    p.getBoundingClientRect().top < window.innerHeight &&
                    !p.classList.contains('revealed')
                );
                const staggerIndex = visibleItems.indexOf(entry.target);
                const delay = Math.max(0, staggerIndex) * 80;

                revealWhenReady(entry.target, delay);
                observer.unobserve(entry.target);
            }
        });
    };

    const observer = new IntersectionObserver(revealPhoto, observerOptions);

    photos.forEach(photo => {
        observer.observe(photo);
    });
})();

// Greeting Typing Animation
(function() {
    const greetingEl = document.getElementById('greetingText');
    if (!greetingEl) return;

    const greetings = [
        'Hi!',
        'こんにちは!',
        'Hola!',
        'Bonjour!',
        '你好!',
        '안녕하세요!',
        'Ciao!'
    ];

    let currentIndex = 0;
    let currentText = '';
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const fullText = greetings[currentIndex];

        if (isDeleting) {
            currentText = fullText.substring(0, currentText.length - 1);
            typeSpeed = 50;
        } else {
            currentText = fullText.substring(0, currentText.length + 1);
            typeSpeed = 100;
        }

        greetingEl.textContent = currentText;

        if (!isDeleting && currentText === fullText) {
            // Pause at end of word
            typeSpeed = 2000;
            isDeleting = true;
        } else if (isDeleting && currentText === '') {
            isDeleting = false;
            currentIndex = (currentIndex + 1) % greetings.length;
            typeSpeed = 300;
        }

        setTimeout(type, typeSpeed);
    }

    // Start after initial fade-in animation completes
    setTimeout(type, 1500);
})();
