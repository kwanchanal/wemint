/**
 * wemint.app - Bio-native Monetization Platform
 * JavaScript Application
 */

// ========================================
// Product Data
// ========================================

const products = [
    {
        id: 1,
        title: 'Instagram Templates Pack',
        description: '50+ ready-to-use Canva templates for Instagram. Perfect for growing your social media presence with professional-looking posts, stories, and reels covers.',
        price: 19,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        badge: 'Best Seller',
        features: [
            '50+ editable Canva templates',
            'Story, Post, and Reel covers',
            'Mobile-friendly design',
            'Step-by-step video tutorial',
            'Lifetime updates'
        ],
        license: 'Personal License'
    },
    {
        id: 2,
        title: 'Lightroom Presets Bundle',
        description: '30 professional Lightroom presets for mobile and desktop. Transform your photos with one click. Works with both free and paid versions of Lightroom.',
        price: 29,
        image: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&h=400&fit=crop',
        badge: null,
        features: [
            '30 unique presets',
            'Mobile + Desktop compatible',
            'Works with free Lightroom',
            'Installation guide included',
            'Before/after examples'
        ],
        license: 'Personal License'
    },
    {
        id: 3,
        title: '3D Icon Pack',
        description: '200+ premium 3D icons for web and mobile applications. High-resolution PNG files with transparent backgrounds. Perfect for modern UI designs.',
        price: 39,
        image: 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=600&h=400&fit=crop',
        badge: 'New',
        features: [
            '200+ 3D icons',
            'PNG + SVG formats',
            'Multiple sizes included',
            'Figma file included',
            'Regular updates'
        ],
        license: 'Personal License'
    },
    {
        id: 4,
        title: 'Social Media Growth Guide',
        description: 'Complete e-book guide to growing from 0 to 10K followers in 90 days. Learn proven strategies, content planning, and engagement tactics.',
        price: 15,
        image: 'https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?w=600&h=400&fit=crop',
        badge: null,
        features: [
            '80+ page PDF guide',
            'Content calendar template',
            'Hashtag strategy guide',
            'Growth tracking spreadsheet',
            'Bonus: DM scripts'
        ],
        license: 'Personal License'
    }
];

// Current state
let currentProduct = null;

// ========================================
// Modal Functions
// ========================================

/**
 * Open product detail modal
 */
function openProductModal(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentProduct = product;

    // Update modal content
    document.getElementById('modalProductImage').src = product.image;
    document.getElementById('modalProductImage').alt = product.title;
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductPrice').textContent = `$${product.price}`;
    document.getElementById('modalProductDescription').textContent = product.description;
    document.getElementById('modalCheckoutPrice').textContent = `$${product.price}`;

    // Update features list
    const featuresList = document.getElementById('modalProductFeatures');
    featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

    // Show modal
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close product modal
 */
function closeProductModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    if (!currentProduct) return;

    // Update checkout modal
    document.getElementById('checkoutProductName').textContent = currentProduct.title;
    document.getElementById('checkoutSubtotal').textContent = `$${currentProduct.price}`;
    document.getElementById('checkoutTotal').textContent = `$${currentProduct.price}`;
    document.getElementById('payAmount').textContent = `$${currentProduct.price}`;

    // Close product modal, open checkout
    closeProductModal();
    document.getElementById('checkoutModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
    document.getElementById('checkoutModal').classList.remove('active');
    document.body.style.overflow = '';
}

/**
 * Close success modal
 */
function closeSuccessModal() {
    document.getElementById('successModal').classList.remove('active');
    document.body.style.overflow = '';
    currentProduct = null;
}

// ========================================
// Form Handlers
// ========================================

/**
 * Handle email subscription
 */
function handleEmailSubmit(event) {
    event.preventDefault();
    const email = event.target.querySelector('input[type="email"]').value;

    // Simulate subscription
    alert(`Thanks for subscribing! We'll send updates to ${email}`);
    event.target.reset();
}

/**
 * Handle checkout form submission
 */
function handleCheckout(event) {
    event.preventDefault();

    const email = document.getElementById('checkoutEmail').value;
    const paymentMethod = document.querySelector('input[name="payment"]:checked').value;

    // Simulate payment processing
    const submitBtn = event.target.querySelector('.btn-pay');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
        // Reset button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        // Close checkout, show success
        closeCheckoutModal();

        // Update success modal
        document.getElementById('successEmail').textContent = email;
        document.getElementById('successModal').classList.add('active');
        document.body.style.overflow = 'hidden';

    }, 2000);
}

/**
 * Handle download button click
 */
function handleDownload() {
    // Simulate download
    alert('Download started! (This is a demo)');
}

// ========================================
// Payment Method Toggle
// ========================================

function initPaymentMethodToggle() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const cardFields = document.getElementById('cardPaymentFields');
    const promptpayFields = document.getElementById('promptpayFields');

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Update selected state
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            // Check the radio
            const radio = this.querySelector('input[type="radio"]');
            radio.checked = true;

            // Toggle payment fields
            if (radio.value === 'card') {
                cardFields.style.display = 'block';
                promptpayFields.style.display = 'none';
            } else {
                cardFields.style.display = 'none';
                promptpayFields.style.display = 'block';
            }
        });
    });
}

// ========================================
// Modal Click Outside to Close
// ========================================

function initModalClickOutside() {
    const modals = document.querySelectorAll('.modal');

    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
}

// ========================================
// Keyboard Events
// ========================================

function initKeyboardEvents() {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open modal
            document.querySelectorAll('.modal.active').forEach(modal => {
                modal.classList.remove('active');
            });
            document.body.style.overflow = '';
        }
    });
}

// ========================================
// Product Card Click
// ========================================

function initProductCardClick() {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't trigger if clicking the buy button
            if (e.target.classList.contains('btn-buy')) return;

            const productId = parseInt(this.dataset.productId);
            openProductModal(productId);
        });
    });
}

// ========================================
// Card Number Formatting
// ========================================

function initCardFormatting() {
    const cardInput = document.querySelector('input[placeholder="1234 5678 9012 3456"]');
    if (cardInput) {
        cardInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '').replace(/\D/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || '';
            e.target.value = formatted;
        });
    }

    const expiryInput = document.querySelector('input[placeholder="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2);
            }
            e.target.value = value;
        });
    }

    const cvcInput = document.querySelector('input[placeholder="123"]');
    if (cvcInput) {
        cvcInput.addEventListener('input', function(e) {
            e.target.value = e.target.value.replace(/\D/g, '');
        });
    }
}

// ========================================
// Analytics (Placeholder)
// ========================================

function trackEvent(eventName, eventData) {
    console.log('Track Event:', eventName, eventData);
    // Implement real analytics here
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    initPaymentMethodToggle();
    initModalClickOutside();
    initKeyboardEvents();
    initProductCardClick();
    initCardFormatting();

    console.log('wemint.app initialized');
});

// ========================================
// Dashboard Functions (for dashboard.html)
// ========================================

/**
 * Initialize dashboard
 */
function initDashboard() {
    // Add any dashboard-specific initialization here
    console.log('Dashboard initialized');
}

/**
 * Toggle product status
 */
function toggleProductStatus(productId) {
    console.log('Toggle status for product:', productId);
    // Implement status toggle
}

/**
 * Delete product
 */
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        console.log('Delete product:', productId);
        // Implement delete
    }
}

/**
 * Edit product
 */
function editProduct(productId) {
    console.log('Edit product:', productId);
    // Implement edit modal or redirect
}

/**
 * Add new product
 */
function addNewProduct() {
    console.log('Add new product');
    // Implement add product modal
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        products,
        openProductModal,
        closeProductModal,
        proceedToCheckout
    };
}
