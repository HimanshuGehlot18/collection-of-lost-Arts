document.addEventListener('DOMContentLoaded', () => {
    // 2. DOM ELEMENTS
    const modal = document.getElementById('product-modal');
    const modalCloseBtn = document.getElementById('product-modal-close');
    const headerEnquiryBtn = document.querySelector('.btn-enquiry');
    
    // View containers
    const detailsView = document.getElementById('modal-details-view');
    const formView = document.getElementById('modal-form-view');
    const whatsappView = document.getElementById('modal-whatsapp-view');
    
    // View Switch buttons
    const toEnquiryBtn = document.getElementById('modal-to-enquiry-btn');
    const whatsappBtn = document.getElementById('modal-whatsapp-btn');
    const backBtn = document.getElementById('modal-back-btn');
    const waBackBtn = document.getElementById('modal-wa-back-btn');
    
    // Details layout nodes
    const sliderWrapper = document.getElementById('modal-slider-wrapper');
    const prevArrow = document.getElementById('modal-prev-arrow');
    const nextArrow = document.getElementById('modal-next-arrow');
    const sliderDots = document.getElementById('modal-slider-dots');
    
    const modalMaterial = document.getElementById('modal-product-material');
    const modalTitle = document.getElementById('modal-product-title');
    const modalDesc = document.getElementById('modal-product-desc');
    const modalSize = document.getElementById('modal-product-size');
    const modalPrice = document.getElementById('modal-product-price');
    const modalQty = document.getElementById('modal-product-qty');
    
    // Form elements (Email)
    const modalForm = document.getElementById('modal-enquiry-form');
    const modalItemInput = document.getElementById('modal-item');
    const modalFormMessage = document.getElementById('modal-form-message');

    // Form elements (WhatsApp)
    const waForm = document.getElementById('modal-whatsapp-form');
    const waItemInput = document.getElementById('wa-item');
    const waFormMessage = document.getElementById('wa-form-message');
    
    // Inline Page Contact Form
    const inlineForm = document.getElementById('enquiry-form');
    const inlineFormMessage = document.getElementById('form-message');

    // Slider State Variables
    let currentSlideIndex = 0;
    let currentImagesList = [];
    let currentProduct = null;
    let activeSettings = null;

    // Prefetch settings on load
    const prefetchSettings = async () => {
        try {
            activeSettings = await window.ProductCatalog.getSettings();
        } catch (err) {
            console.warn('[Modal] Failed to prefetch settings:', err);
        }
    };
    prefetchSettings();

    // 3. UTILITY FUNCTIONS

    const updateSliderPosition = () => {
        if (sliderWrapper) {
            sliderWrapper.style.transform = `translateX(-${currentSlideIndex * 100}%)`;
        }
        
        // Highlight active dot
        const dots = sliderDots.querySelectorAll('.slider-dot');
        dots.forEach((dot, idx) => {
            if (idx === currentSlideIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    // (Local logEnquiryRequest helper removed. Powered by window.ProductCatalog.addEnquiry)

    const openModalInDetailsView = async (productName) => {
        const catalog = await window.ProductCatalog.getAll();
        const data = catalog.find(item => item.name === productName);
        if (!data) return;
        
        currentProduct = data;
        
        // Populate modal text details
        modalMaterial.textContent = data.material.toUpperCase();
        modalTitle.textContent = productName;
        modalDesc.textContent = data.desc || '';
        modalSize.textContent = data.size || '-';
        modalPrice.textContent = data.price || '-';
        modalQty.textContent = data.quantity || '-';
        
        // Setup form subjects
        modalItemInput.value = productName;
        waItemInput.value = productName;
        
        // Get images array or fallback
        currentImagesList = data.images || (data.img ? [data.img] : []);
        currentSlideIndex = 0;
        
        // Populate slide images dynamically
        sliderWrapper.innerHTML = '';
        currentImagesList.forEach((src, idx) => {
            const img = document.createElement('img');
            img.src = src;
            img.alt = `${productName} Photo ${idx + 1}`;
            img.className = 'slider-slide';
            sliderWrapper.appendChild(img);
        });

        // Populate pagination dots and toggle control button displays
        sliderDots.innerHTML = '';
        if (currentImagesList.length > 1) {
            currentImagesList.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.type = 'button';
                dot.className = 'slider-dot' + (idx === 0 ? ' active' : '');
                dot.setAttribute('aria-label', `Go to slide ${idx + 1}`);
                dot.addEventListener('click', () => {
                    currentSlideIndex = idx;
                    updateSliderPosition();
                });
                sliderDots.appendChild(dot);
            });
            
            // Show slideshow buttons
            prevArrow.style.display = 'flex';
            nextArrow.style.display = 'flex';
            sliderDots.style.display = 'flex';
        } else {
            // Hide slideshow buttons if single image
            prevArrow.style.display = 'none';
            nextArrow.style.display = 'none';
            sliderDots.style.display = 'none';
        }

        // Reset positions
        sliderWrapper.style.transform = 'translateX(0)';
        
        // Reset active views
        formView.classList.remove('active');
        whatsappView.classList.remove('active');
        detailsView.classList.add('active');
        
        // Open overlay
        modal.classList.add('open');
        document.body.classList.add('no-scroll');
    };
    
    // Expose to window
    window.openProductDetailsMock = openModalInDetailsView; // Keep alias
    window.openProductDetailsModal = openModalInDetailsView;

    const openModalInEnquiryView = (subjectName) => {
        modalItemInput.value = subjectName || 'General Enquiry';
        
        // Show form, hide other views
        detailsView.classList.remove('active');
        whatsappView.classList.remove('active');
        formView.classList.add('active');
        
        // Open overlay
        modal.classList.add('open');
        document.body.classList.add('no-scroll');
    };

    const closeModal = () => {
        modal.classList.remove('open');
        document.body.classList.remove('no-scroll');
        if (modalForm) modalForm.reset();
        if (waForm) waForm.reset();
        
        if (modalFormMessage) {
            modalFormMessage.textContent = '';
            modalFormMessage.className = 'form-message';
        }
        if (waFormMessage) {
            waFormMessage.textContent = '';
            waFormMessage.className = 'form-message';
        }
    };

    const sendEmail = async (name, contact, subject, message) => {
        let receiver = "sonidiv1993@gmail.com";
        try {
            const settings = await window.ProductCatalog.getSettings();
            if (settings && settings.email) {
                receiver = settings.email;
            }
        } catch (err) {
            console.warn('[Modal] Failed to get receiver email, using fallback:', err);
        }
        const emailSubject = `Enquiry: ${subject}`;
        const emailBody = `Name: ${name}\nContact: ${contact}\n\nEnquiry details:\n${message}\n\n---\nSent from Website Contact System.`;
        
        const mailtoUrl = `mailto:${receiver}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
        window.location.href = mailtoUrl;
    };

    const sendWhatsAppMessage = (productName, clientNumber) => {
        let adminWhatsAppNumber = "918946866094"; // fallback owner number
        if (activeSettings && activeSettings.phone) {
            // Strip non-digits for wa.me formatting
            adminWhatsAppNumber = activeSettings.phone.replace(/\D/g, '');
        }
        
        let message = `Hello, I am interested in inquiring about this product from Collection of Lost Arts:\n\n`;
        message += `*Product Name:* ${productName}\n`;
        
        if (currentProduct) {
            if (currentProduct.size) message += `*Size:* ${currentProduct.size}\n`;
            if (currentProduct.price) message += `*Price:* ${currentProduct.price}\n`;
            if (currentProduct.quantity) message += `*Availability:* ${currentProduct.quantity}\n`;
            const description = currentProduct.desc || currentProduct.desc_text;
            if (description) message += `*Description:* ${description}\n`;
            
            // Format photo link dynamically (using window origin so it translates well locally/staged)
            const absolutePhotoUrl = `${window.location.origin}/${currentProduct.img}`;
            message += `*Photo Link:* ${absolutePhotoUrl}\n`;
        }
        
        message += `\nMy contact number is: ${clientNumber}\nPlease get back to me. Thank you!`;
        
        const waUrl = `https://wa.me/${adminWhatsAppNumber}?text=${encodeURIComponent(message)}`;
        window.open(waUrl, '_blank');
    };

    // 4. EVENT LISTENERS
    
    // Header Enquiry button click
    if (headerEnquiryBtn) {
        headerEnquiryBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openModalInEnquiryView('General Enquiry');
        });
    }

    // Modal view switcher clicks
    if (toEnquiryBtn) {
        toEnquiryBtn.addEventListener('click', () => {
            detailsView.classList.remove('active');
            formView.classList.add('active');
        });
    }
    if (whatsappBtn) {
        whatsappBtn.addEventListener('click', () => {
            detailsView.classList.remove('active');
            whatsappView.classList.add('active');
        });
    }
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            formView.classList.remove('active');
            detailsView.classList.add('active');
        });
    }
    if (waBackBtn) {
        waBackBtn.addEventListener('click', () => {
            whatsappView.classList.remove('active');
            detailsView.classList.add('active');
        });
    }

    // Modal Details slide controls bindings
    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            if (currentImagesList.length <= 1) return;
            currentSlideIndex = (currentSlideIndex - 1 + currentImagesList.length) % currentImagesList.length;
            updateSliderPosition();
        });
    }
    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            if (currentImagesList.length <= 1) return;
            currentSlideIndex = (currentSlideIndex + 1) % currentImagesList.length;
            updateSliderPosition();
        });
    }

    // Modal closing bindings
    if (modalCloseBtn) {
        modalCloseBtn.addEventListener('click', closeModal);
    }
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Handle modal email form submission
    if (modalForm) {
        modalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const item = document.getElementById('modal-item').value;
            const name = document.getElementById('modal-name').value;
            const email = document.getElementById('modal-email').value;
            const message = document.getElementById('modal-message').value;

            if (!name || !email || !message) {
                showModalFeedback('Please fill out all fields.', 'error');
                return;
            }

            const submitBtn = modalForm.querySelector('.modal-submit-btn');
            submitBtn.textContent = 'Opening Mail...';
            submitBtn.disabled = true;

            setTimeout(async () => {
                await window.ProductCatalog.addEnquiry(item, email, 'Email');
                await sendEmail(name, email, item, message);
                showModalFeedback(`Opening mail client... Thank you, ${name}!`, 'success');
                
                setTimeout(() => {
                    closeModal();
                    submitBtn.textContent = 'Submit Enquiry';
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }

    // Handle modal WhatsApp form submission
    if (waForm) {
        waForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const item = document.getElementById('wa-item').value;
            const clientNumber = document.getElementById('wa-client-number').value;

            if (!clientNumber) {
                showWaFeedback('Please enter your phone number.', 'error');
                return;
            }

            // Open WhatsApp immediately and synchronously to prevent browser popup blockers
            sendWhatsAppMessage(item, clientNumber);

            const submitBtn = waForm.querySelector('.modal-whatsapp-btn');
            const originalBtnHtml = submitBtn.innerHTML;
            submitBtn.textContent = 'Connecting WhatsApp...';
            submitBtn.disabled = true;

            setTimeout(async () => {
                // Log request in cloud DB / Local fallback asynchronously in background
                try {
                    await window.ProductCatalog.addEnquiry(item, clientNumber, 'WhatsApp');
                } catch (err) {
                    console.error('[Modal] Failed to log enquiry:', err);
                }
                
                showWaFeedback(`Opening WhatsApp chat... Thank you!`, 'success');
                
                setTimeout(() => {
                    closeModal();
                    submitBtn.innerHTML = originalBtnHtml;
                    submitBtn.disabled = false;
                }, 2000);
            }, 1000);
        });
    }

    // Handle inline page contact form submission
    if (inlineForm) {
        inlineForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;

            if (!name || !email || !message) {
                showInlineFeedback('Please fill out all fields.', 'error');
                return;
            }

            const submitBtn = inlineForm.querySelector('.btn-submit');
            submitBtn.textContent = 'Opening Mail...';
            submitBtn.disabled = true;

            setTimeout(async () => {
                await window.ProductCatalog.addEnquiry('General Workshop Enquiry', email, 'Email');
                await sendEmail(name, email, 'General Workshop Enquiry', message);
                showInlineFeedback(`Thank you, ${name}! Mail client is opening to send your enquiry.`, 'success');
                inlineForm.reset();
                submitBtn.textContent = 'Send Enquiry';
                submitBtn.disabled = false;
            }, 1000);
        });
    }

    function showModalFeedback(text, type) {
        if (modalFormMessage) {
            modalFormMessage.textContent = text;
            modalFormMessage.className = 'form-message';
            modalFormMessage.classList.add(type);
        }
    }

    function showWaFeedback(text, type) {
        if (waFormMessage) {
            waFormMessage.textContent = text;
            waFormMessage.className = 'form-message';
            waFormMessage.classList.add(type);
        }
    }

    function showInlineFeedback(text, type) {
        if (inlineFormMessage) {
            inlineFormMessage.textContent = text;
            inlineFormMessage.className = 'form-message';
            inlineFormMessage.classList.add(type);
            if (type === 'success') {
                setTimeout(() => {
                    inlineFormMessage.textContent = '';
                    inlineFormMessage.className = 'form-message';
                }, 6000);
            }
        }
    }
});
