document.addEventListener('DOMContentLoaded', () => {
    // 1. DOM Elements
    const header = document.querySelector('.site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-nav');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');
    const enquiryForm = document.getElementById('enquiry-form');
    const formMessage = document.getElementById('form-message');

    // 2. Header Shrink & Translucent Effect on Scroll
    const handleScroll = () => {
        if (window.scrollY > 40) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check scroll position on mount

    // 3. Mobile Menu Toggle
    const toggleMenu = () => {
        menuToggle.classList.toggle('open');
        mainNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked (Mobile view)
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mainNav.classList.contains('open')) {
                toggleMenu();
            }
        });
    });

    // 4. Scroll Spy - Active Nav Link Highlighting
    const scrollSpy = () => {
        const scrollPosition = window.scrollY + 120; // offset for the sticky header

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    window.addEventListener('scroll', scrollSpy);
    scrollSpy(); // Run initially to highlight active link

    // 5. Dynamic Gallery Rendering & Filtering
    const renderGalleryGrid = async () => {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        const catalog = await window.ProductCatalog.getAll();
        grid.innerHTML = '';

        catalog.forEach(item => {
            const card = document.createElement('div');
            card.className = 'product-card';
            card.setAttribute('data-material', item.material);
            card.innerHTML = `
                <div class="product-img-wrapper arch-frame" style="cursor: pointer;">
                    <img src="${item.img}" alt="${item.name}" class="product-img">
                </div>
                <h4 class="product-title" style="cursor: pointer;">${item.name}</h4>
            `;

            // Bind click handler directly to open details modal
            const handleCardClick = () => {
                if (window.openProductDetailsModal) {
                    window.openProductDetailsModal(item.name);
                }
            };

            const imgWrapper = card.querySelector('.product-img-wrapper');
            const titleEl = card.querySelector('.product-title');

            if (imgWrapper) imgWrapper.addEventListener('click', handleCardClick);
            if (titleEl) titleEl.addEventListener('click', handleCardClick);

            grid.appendChild(card);
        });
    };

    let activeCategory = 'all';
    let searchQuery = '';

    const filterGallery = (category) => {
        if (category !== undefined) {
            activeCategory = category;
        }

        // Update active class on filter buttons dynamically
        const filterButtons = document.querySelectorAll('.filter-btn');
        filterButtons.forEach(btn => {
            if (btn.getAttribute('data-filter') === activeCategory) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        // Query product cards dynamically so new elements are selected
        const productCards = document.querySelectorAll('.product-card');
        productCards.forEach(card => {
            const productMaterial = card.getAttribute('data-material');
            const titleEl = card.querySelector('.product-title');
            const productName = titleEl ? titleEl.textContent.toLowerCase() : '';

            const matchesCategory = (activeCategory === 'all' || productMaterial === activeCategory);
            const matchesSearch = (!searchQuery || productName.includes(searchQuery));

            if (matchesCategory && matchesSearch) {
                card.style.display = 'flex';
                setTimeout(() => {
                    card.style.opacity = '1';
                    card.style.transform = 'scale(1)';
                }, 50);
            } else {
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    card.style.display = 'none';
                }, 400);
            }
        });
    };

    const renderCategoriesAndFilters = async () => {
        const categoriesGrid = document.getElementById('categories-grid');
        const galleryFilters = document.getElementById('gallery-filters');
        if (!categoriesGrid || !galleryFilters) return;

        const categories = await window.ProductCatalog.getCategories();

        // 1. Render Categories Showcase
        categoriesGrid.innerHTML = '';
        categories.forEach(cat => {
            const card = document.createElement('div');
            card.className = 'category-card';
            card.setAttribute('data-category', cat.id);
            card.innerHTML = `
                <div class="category-img-wrapper arch-frame-small">
                    <img src="${cat.img}" alt="${cat.name} Category" class="category-img">
                </div>
                <h3 class="category-title">${cat.name.toUpperCase()}</h3>
            `;
            
            card.addEventListener('click', () => {
                const gallerySection = document.getElementById('gallery');
                if (gallerySection) {
                    const headerOffset = 100;
                    const elementPosition = gallerySection.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: 'smooth'
                    });
                }
                filterGallery(cat.id);
            });
            categoriesGrid.appendChild(card);
        });

        // 2. Render Gallery Filters
        galleryFilters.innerHTML = '';
        
        // "All" filter button
        const allBtn = document.createElement('button');
        allBtn.className = 'filter-btn active';
        allBtn.setAttribute('data-filter', 'all');
        allBtn.textContent = 'All';
        allBtn.addEventListener('click', (e) => {
            filterGallery('all');
        });
        galleryFilters.appendChild(allBtn);

        // Individual category filter buttons
        categories.forEach(cat => {
            const btn = document.createElement('button');
            btn.className = 'filter-btn';
            btn.setAttribute('data-filter', cat.id);
            btn.textContent = cat.name;
            btn.addEventListener('click', (e) => {
                filterGallery(cat.id);
            });
            galleryFilters.appendChild(btn);
        });
    };

    // Initial render calls
    const initHomepage = async () => {
        await renderCategoriesAndFilters();
        await renderGalleryGrid();

        // Bind instant search input
        const searchInput = document.getElementById('gallery-search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                searchQuery = e.target.value.toLowerCase().trim();
                filterGallery();
            });
        }

        // Update floating WhatsApp button dynamically with settings phone number
        try {
            const settings = await window.ProductCatalog.getSettings();
            if (settings && settings.phone) {
                let cleaned = settings.phone.replace(/\D/g, '');
                if (cleaned.startsWith('00')) {
                    cleaned = cleaned.substring(2);
                }
                if (cleaned.length === 10) {
                    cleaned = '91' + cleaned;
                }
                if (cleaned.length === 11 && cleaned.startsWith('0')) {
                    cleaned = '91' + cleaned.substring(1);
                }
                const floatingWaBtn = document.querySelector('.floating-whatsapp-btn');
                if (floatingWaBtn) {
                    floatingWaBtn.href = `https://api.whatsapp.com/send?phone=${cleaned}`;
                }
            }
        } catch (err) {
            console.warn('[Homepage] Failed to update floating WhatsApp button:', err);
        }
    };
    initHomepage();
    
    // Expose render function so admin dashboard updates trigger homepage updates
    window.refreshGalleryGrid = async () => {
        await renderCategoriesAndFilters();
        await renderGalleryGrid();
    };
});
