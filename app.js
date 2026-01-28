/**
 * wemint.app - Bio-native Monetization Platform
 * JavaScript Application
 */

// ========================================
// Default Product Data
// ========================================

const defaultProducts = [
    {
        id: 1,
        title: 'Instagram Templates Pack',
        description: '50+ ready-to-use Canva templates for Instagram. Perfect for growing your social media presence with professional-looking posts, stories, and reels covers.',
        price: 19,
        image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop',
        badge: 'Best Seller',
        status: 'active',
        sales: 68,
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
        badge: '',
        status: 'active',
        sales: 42,
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
        status: 'active',
        sales: 12,
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
        badge: '',
        status: 'draft',
        sales: 20,
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

// ========================================
// Default Quick Links Data
// ========================================

const defaultQuickLinks = [
    {
        id: 1,
        title: 'Watch my latest YouTube video',
        url: 'https://youtube.com/',
        icon: '📺',
        clicks: 127,
        status: 'active'
    },
    {
        id: 2,
        title: 'Follow me on Instagram',
        url: 'https://instagram.com/',
        icon: '📸',
        clicks: 86,
        status: 'active'
    },
    {
        id: 3,
        title: 'View my portfolio',
        url: 'https://behance.net/',
        icon: '💼',
        clicks: 42,
        status: 'active'
    },
    {
        id: 4,
        title: 'Contact for collaborations',
        url: 'mailto:hello@wemint.app',
        icon: '📧',
        clicks: 15,
        status: 'draft'
    }
];

// ========================================
// Section Visibility
// ========================================

const defaultSectionVisibility = {
    affiliate: true,
    products: true,
    links: true,
    mint: true
};

function getSectionVisibility() {
    const saved = localStorage.getItem('wemint_sections');
    if (saved) {
        return { ...defaultSectionVisibility, ...JSON.parse(saved) };
    }
    localStorage.setItem('wemint_sections', JSON.stringify(defaultSectionVisibility));
    return { ...defaultSectionVisibility };
}

function saveSectionVisibility(data) {
    localStorage.setItem('wemint_sections', JSON.stringify(data));
}

function applySectionVisibility() {
    const visibility = getSectionVisibility();
    const map = {
        affiliate: 'affiliate-section',
        products: 'products-section',
        links: 'links-section',
        mint: 'mint-section'
    };

    Object.entries(map).forEach(([key, id]) => {
        const section = document.getElementById(id);
        if (!section) return;
        section.style.display = visibility[key] ? '' : 'none';
    });
}

function initSectionToggles() {
    const visibility = getSectionVisibility();
    const affiliateToggle = document.getElementById('toggleAffiliate');
    const productsToggle = document.getElementById('toggleProducts');
    const linksToggle = document.getElementById('toggleLinks');
    const mintToggle = document.getElementById('toggleMint');

    if (affiliateToggle) affiliateToggle.checked = !!visibility.affiliate;
    if (productsToggle) productsToggle.checked = !!visibility.products;
    if (linksToggle) linksToggle.checked = !!visibility.links;
    if (mintToggle) mintToggle.checked = !!visibility.mint;
}

function toggleSectionVisibility(key, checkbox) {
    const visibility = getSectionVisibility();
    visibility[key] = checkbox ? checkbox.checked : !visibility[key];
    saveSectionVisibility(visibility);

    applySectionVisibility();

    if (typeof refreshPreview === 'function') {
        refreshPreview();
    }
}

// ========================================
// Product Management
// ========================================

/**
 * Get products from localStorage or use defaults
 */
function getProducts() {
    const saved = localStorage.getItem('wemint_products');
    if (saved) {
        return JSON.parse(saved);
    }
    // Initialize with defaults
    localStorage.setItem('wemint_products', JSON.stringify(defaultProducts));
    return defaultProducts;
}

/**
 * Save products to localStorage
 */
function saveProducts(products) {
    localStorage.setItem('wemint_products', JSON.stringify(products));
}

// ========================================
// Quick Links Management
// ========================================

function getQuickLinks() {
    const saved = localStorage.getItem('wemint_quick_links');
    if (saved) {
        return JSON.parse(saved);
    }
    localStorage.setItem('wemint_quick_links', JSON.stringify(defaultQuickLinks));
    return defaultQuickLinks;
}

function saveQuickLinks(links) {
    localStorage.setItem('wemint_quick_links', JSON.stringify(links));
}

function addQuickLink(linkData) {
    const links = getQuickLinks();
    const newId = Math.max(...links.map(l => l.id), 0) + 1;
    const newLink = {
        id: newId,
        title: linkData.title || 'New Link',
        url: linkData.url || '#',
        icon: linkData.icon || '🔗',
        clicks: 0,
        status: linkData.status || 'active'
    };
    links.push(newLink);
    saveQuickLinks(links);
    return newLink;
}

function updateQuickLink(id, updates) {
    const links = getQuickLinks();
    const index = links.findIndex(l => l.id === parseInt(id));
    if (index === -1) return null;
    links[index] = { ...links[index], ...updates };
    saveQuickLinks(links);
    return links[index];
}

function deleteQuickLink(id) {
    const links = getQuickLinks().filter(l => l.id !== parseInt(id));
    saveQuickLinks(links);
    return links;
}

function getQuickLinkById(id) {
    const links = getQuickLinks();
    return links.find(l => l.id === parseInt(id));
}

function renderQuickLinksBio() {
    const list = document.getElementById('quickLinksList');
    if (!list) return;

    const links = getQuickLinks().filter(l => l.status === 'active');
    list.innerHTML = links.map(link => `
        <a href="${link.url}" class="link-item" target="_blank" rel="noopener">
            <span class="link-icon">${link.icon || '🔗'}</span>
            <span class="link-text">${link.title}</span>
            <span class="link-arrow">→</span>
        </a>
    `).join('');
}

function renderQuickLinksDashboard() {
    const tbody = document.getElementById('linksTableBody');
    if (!tbody) return;

    const links = getQuickLinks();
    tbody.innerHTML = links.map(link => `
        <tr data-link-id="${link.id}">
            <td>
                <div class="product-cell">
                    <span class="product-thumb" style="display: inline-flex; align-items: center; justify-content: center; font-size: 1.1rem; background: var(--bg-tertiary);">${link.icon || '🔗'}</span>
                    <span class="product-name">${link.title}</span>
                </div>
            </td>
            <td style="max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${link.url}</td>
            <td>${link.clicks || 0}</td>
            <td><span class="status-badge ${link.status}">${link.status === 'active' ? 'Active' : 'Draft'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editQuickLink(${link.id})" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="toggleQuickLinkStatus(${link.id})" title="Toggle Status">
                        ${link.status === 'active' ? '🔴' : '🟢'}
                    </button>
                    <button class="btn-icon" onclick="deleteQuickLinkRow(${link.id})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

let editingQuickLinkId = null;

function openAddLinkModal() {
    const modal = document.getElementById('addLinkModal');
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeAddLinkModal() {
    const modal = document.getElementById('addLinkModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    const title = document.getElementById('linkTitle');
    const url = document.getElementById('linkUrl');
    const icon = document.getElementById('linkIcon');
    const status = document.getElementById('linkStatus');
    if (title) title.value = '';
    if (url) url.value = '';
    if (icon) icon.value = '';
    if (status) status.value = 'active';
}

function handleAddLink(event) {
    event.preventDefault();
    const title = document.getElementById('linkTitle')?.value?.trim();
    const url = document.getElementById('linkUrl')?.value?.trim();
    const icon = document.getElementById('linkIcon')?.value?.trim();
    const status = document.getElementById('linkStatus')?.value || 'active';

    if (!title || !url) return;
    addQuickLink({ title, url, icon, status });
    renderQuickLinksDashboard();
    renderQuickLinksBio();
    closeAddLinkModal();
}

function editQuickLink(id) {
    const link = getQuickLinkById(id);
    if (!link) return;
    editingQuickLinkId = id;
    document.getElementById('editLinkTitle').value = link.title;
    document.getElementById('editLinkUrl').value = link.url;
    document.getElementById('editLinkIcon').value = link.icon || '';
    document.getElementById('editLinkStatus').value = link.status;
    document.getElementById('editLinkModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditLinkModal() {
    const modal = document.getElementById('editLinkModal');
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
    editingQuickLinkId = null;
}

function saveEditedLink(event) {
    event.preventDefault();
    if (!editingQuickLinkId) return;
    const title = document.getElementById('editLinkTitle')?.value?.trim();
    const url = document.getElementById('editLinkUrl')?.value?.trim();
    const icon = document.getElementById('editLinkIcon')?.value?.trim();
    const status = document.getElementById('editLinkStatus')?.value || 'active';
    if (!title || !url) return;
    updateQuickLink(editingQuickLinkId, { title, url, icon, status });
    renderQuickLinksDashboard();
    renderQuickLinksBio();
    closeEditLinkModal();
}

function deleteQuickLinkRow(id) {
    const link = getQuickLinkById(id);
    if (!link) return;
    if (confirm(`Delete "${link.title}"?`)) {
        deleteQuickLink(id);
        renderQuickLinksDashboard();
        renderQuickLinksBio();
    }
}

function toggleQuickLinkStatus(id) {
    const link = getQuickLinkById(id);
    if (!link) return;
    const nextStatus = link.status === 'active' ? 'draft' : 'active';
    updateQuickLink(id, { status: nextStatus });
    renderQuickLinksDashboard();
    renderQuickLinksBio();
}

/**
 * Get single product by ID
 */
function getProductById(id) {
    const products = getProducts();
    return products.find(p => p.id === parseInt(id));
}

/**
 * Add new product
 */
function addProduct(productData) {
    const products = getProducts();
    const newId = Math.max(...products.map(p => p.id), 0) + 1;
    const newProduct = {
        id: newId,
        title: productData.title || 'New Product',
        description: productData.description || '',
        price: parseFloat(productData.price) || 0,
        image: productData.image || 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=400&fit=crop',
        badge: productData.badge || '',
        status: productData.status || 'draft',
        sales: 0,
        features: productData.features || [],
        license: productData.license || 'Personal License'
    };
    products.push(newProduct);
    saveProducts(products);
    return newProduct;
}

/**
 * Update existing product
 */
function updateProduct(id, updates) {
    const products = getProducts();
    const index = products.findIndex(p => p.id === parseInt(id));
    if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        saveProducts(products);
        return products[index];
    }
    return null;
}

/**
 * Delete product
 */
function deleteProductById(id) {
    let products = getProducts();
    products = products.filter(p => p.id !== parseInt(id));
    saveProducts(products);
}

// ========================================
// Current State
// ========================================

let currentProduct = null;
let editingProductId = null;

// ========================================
// Modal Functions (Bio Page)
// ========================================

/**
 * Open product detail modal
 */
function openProductModal(productId) {
    const product = getProductById(productId);
    if (!product) return;

    currentProduct = product;

    // Update modal content
    const modalImage = document.getElementById('modalProductImage');
    const modalTitle = document.getElementById('modalProductTitle');
    const modalPrice = document.getElementById('modalProductPrice');
    const modalDesc = document.getElementById('modalProductDescription');
    const modalCheckoutPrice = document.getElementById('modalCheckoutPrice');
    const featuresList = document.getElementById('modalProductFeatures');

    if (modalImage) modalImage.src = product.image;
    if (modalImage) modalImage.alt = product.title;
    if (modalTitle) modalTitle.textContent = product.title;
    if (modalPrice) modalPrice.textContent = `$${product.price}`;
    if (modalDesc) modalDesc.textContent = product.description;
    if (modalCheckoutPrice) modalCheckoutPrice.textContent = `$${product.price}`;
    if (featuresList) featuresList.innerHTML = product.features.map(f => `<li>${f}</li>`).join('');

    // Show modal
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close product modal
 */
function closeProductModal() {
    const modal = document.getElementById('productModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Proceed to checkout
 */
function proceedToCheckout() {
    if (!currentProduct) return;

    // Update checkout modal
    const checkoutName = document.getElementById('checkoutProductName');
    const checkoutSubtotal = document.getElementById('checkoutSubtotal');
    const checkoutTotal = document.getElementById('checkoutTotal');
    const payAmount = document.getElementById('payAmount');

    if (checkoutName) checkoutName.textContent = currentProduct.title;
    if (checkoutSubtotal) checkoutSubtotal.textContent = `$${currentProduct.price}`;
    if (checkoutTotal) checkoutTotal.textContent = `$${currentProduct.price}`;
    if (payAmount) payAmount.textContent = `$${currentProduct.price}`;

    // Close product modal, open checkout
    closeProductModal();
    const checkoutModal = document.getElementById('checkoutModal');
    if (checkoutModal) {
        checkoutModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close checkout modal
 */
function closeCheckoutModal() {
    const modal = document.getElementById('checkoutModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Close success modal
 */
function closeSuccessModal() {
    const modal = document.getElementById('successModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
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
    alert(`Thanks for subscribing! We'll send updates to ${email}`);
    event.target.reset();
}

/**
 * Handle checkout form submission
 */
function handleCheckout(event) {
    event.preventDefault();

    const email = document.getElementById('checkoutEmail').value;

    // Simulate payment processing
    const submitBtn = event.target.querySelector('.btn-pay');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = 'Processing...';
    submitBtn.disabled = true;

    setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;

        closeCheckoutModal();

        // Update success modal
        const successEmail = document.getElementById('successEmail');
        if (successEmail) successEmail.textContent = email;

        const successModal = document.getElementById('successModal');
        if (successModal) {
            successModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        // Update sales count
        if (currentProduct) {
            updateProduct(currentProduct.id, { sales: (currentProduct.sales || 0) + 1 });
        }

    }, 2000);
}

/**
 * Handle download button click
 */
function handleDownload() {
    alert('Download started! (This is a demo)');
}

// ========================================
// Dashboard Functions
// ========================================

/**
 * Render products table in dashboard
 */
function renderProductsTable() {
    const tbody = document.querySelector('#productsTable tbody');
    if (!tbody) return;

    const products = getProducts();

    tbody.innerHTML = products.map(product => `
        <tr data-product-id="${product.id}">
            <td>
                <div class="product-cell">
                    <img src="${product.image}" alt="${product.title}" class="product-thumb">
                    <span class="product-name">${product.title}</span>
                </div>
            </td>
            <td>$${product.price}</td>
            <td>${product.sales || 0}</td>
            <td>$${(product.price * (product.sales || 0)).toLocaleString()}</td>
            <td><span class="status-badge ${product.status}">${product.status === 'active' ? 'Active' : 'Draft'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="btn-icon" onclick="editProduct(${product.id})" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="toggleProductStatus(${product.id})" title="Toggle Status">
                        ${product.status === 'active' ? '🔴' : '🟢'}
                    </button>
                    <button class="btn-icon" onclick="deleteProduct(${product.id})" title="Delete">🗑️</button>
                </div>
            </td>
        </tr>
    `).join('');
}

/**
 * Edit product - open modal with product data
 */
function editProduct(productId) {
    const product = getProductById(productId);
    if (!product) return;

    editingProductId = productId;

    // Fill form with product data
    document.getElementById('editProductTitle').value = product.title;
    document.getElementById('editProductDescription').value = product.description;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductImage').value = product.image;
    document.getElementById('editProductBadge').value = product.badge || '';
    document.getElementById('editProductStatus').value = product.status;
    document.getElementById('editProductFeatures').value = product.features.join('\n');

    // Update preview
    document.getElementById('editProductImagePreview').src = product.image;

    // Show modal
    document.getElementById('editProductModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

/**
 * Close edit product modal
 */
function closeEditProductModal() {
    document.getElementById('editProductModal').classList.remove('active');
    document.body.style.overflow = '';
    editingProductId = null;
}

/**
 * Save edited product
 */
function saveEditedProduct(event) {
    event.preventDefault();

    if (!editingProductId) return;

    const updates = {
        title: document.getElementById('editProductTitle').value,
        description: document.getElementById('editProductDescription').value,
        price: parseFloat(document.getElementById('editProductPrice').value),
        image: document.getElementById('editProductImage').value,
        badge: document.getElementById('editProductBadge').value,
        status: document.getElementById('editProductStatus').value,
        features: document.getElementById('editProductFeatures').value.split('\n').filter(f => f.trim())
    };

    updateProduct(editingProductId, updates);

    // Show success
    const btn = event.target.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Saved!';
    btn.style.background = 'var(--accent)';

    setTimeout(() => {
        btn.innerHTML = originalText;
        btn.style.background = '';
        closeEditProductModal();
        renderProductsTable();
        refreshPreview();
    }, 1000);
}

/**
 * Toggle product status
 */
function toggleProductStatus(productId) {
    const product = getProductById(productId);
    if (!product) return;

    const newStatus = product.status === 'active' ? 'draft' : 'active';
    updateProduct(productId, { status: newStatus });
    renderProductsTable();
    refreshPreview();
}

/**
 * Delete product
 */
function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product? This cannot be undone.')) {
        deleteProductById(productId);
        renderProductsTable();
        refreshPreview();
    }
}

/**
 * Handle add product form
 */
function handleAddProduct(event) {
    event.preventDefault();

    const form = event.target;
    const productData = {
        title: form.querySelector('input[placeholder*="Instagram"]').value || 'New Product',
        description: form.querySelector('textarea').value || '',
        price: parseFloat(form.querySelector('input[type="number"]').value) || 0,
        status: 'draft',
        features: []
    };

    addProduct(productData);

    // Show success
    const btn = form.querySelector('button[type="submit"]');
    const originalText = btn.innerHTML;
    btn.innerHTML = '✅ Created!';

    setTimeout(() => {
        btn.innerHTML = originalText;
        closeAddProductModal();
        renderProductsTable();
        refreshPreview();
        form.reset();
    }, 1000);
}

/**
 * Open add product modal
 */
function openAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
}

/**
 * Close add product modal
 */
function closeAddProductModal() {
    const modal = document.getElementById('addProductModal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

/**
 * Refresh preview iframe
 */
function refreshPreview() {
    const iframe = document.getElementById('previewIframe');
    if (iframe) {
        iframe.src = iframe.src;
    }
}

// ========================================
// Bio Page - Render Products
// ========================================

/**
 * Render products grid on bio page
 */
function renderBioProducts() {
    const grid = document.querySelector('.products-grid');
    if (!grid) return;

    const products = getProducts().filter(p => p.status === 'active');

    grid.innerHTML = products.map(product => `
        <div class="product-card" data-product-id="${product.id}">
            <div class="product-image">
                <img src="${product.image}" alt="${product.title}">
                ${product.badge ? `<span class="product-badge ${product.badge === 'New' ? 'new' : ''}">${product.badge}</span>` : ''}
            </div>
            <div class="product-info">
                <h3 class="product-title">${product.title}</h3>
                <p class="product-description">${product.description.substring(0, 60)}...</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price}</span>
                    <button class="btn-buy" onclick="openProductModal(${product.id})">Buy Now</button>
                </div>
            </div>
        </div>
    `).join('');

    // Re-init click handlers
    initProductCardClick();
}

// ========================================
// Payment Method Toggle
// ========================================

function initPaymentMethodToggle() {
    const paymentOptions = document.querySelectorAll('.payment-option');
    const cardFields = document.getElementById('cardPaymentFields');
    const promptpayFields = document.getElementById('promptpayFields');

    if (!paymentOptions.length) return;

    paymentOptions.forEach(option => {
        option.addEventListener('click', function() {
            paymentOptions.forEach(opt => opt.classList.remove('selected'));
            this.classList.add('selected');

            const radio = this.querySelector('input[type="radio"]');
            if (radio) radio.checked = true;

            if (cardFields && promptpayFields) {
                if (radio && radio.value === 'card') {
                    cardFields.style.display = 'block';
                    promptpayFields.style.display = 'none';
                } else {
                    cardFields.style.display = 'none';
                    promptpayFields.style.display = 'block';
                }
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
// Dashboard Stats
// ========================================

function updateDashboardStats() {
    const products = getProducts();
    const totalSales = products.reduce((sum, p) => sum + (p.sales || 0), 0);
    const totalRevenue = products.reduce((sum, p) => sum + (p.price * (p.sales || 0)), 0);

    const revenueEl = document.querySelector('.stat-value');
    if (revenueEl && revenueEl.parentElement.querySelector('.stat-label')?.textContent === 'Total Revenue') {
        revenueEl.textContent = `$${totalRevenue.toLocaleString()}`;
    }
}

// ========================================
// Initialize
// ========================================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize products in localStorage if not exists
    getProducts();

    // Bio page initialization
    if (document.querySelector('.products-grid')) {
        renderBioProducts();
    }

    // Dashboard initialization
    if (document.querySelector('#productsTable')) {
        renderProductsTable();
        updateDashboardStats();
    }

    applySectionVisibility();
    initSectionToggles();

    if (document.getElementById('quickLinksList')) {
        renderQuickLinksBio();
    }

    if (document.getElementById('linksTableBody')) {
        renderQuickLinksDashboard();
    }

    // Common initializations
    initPaymentMethodToggle();
    initModalClickOutside();
    initKeyboardEvents();
    initProductCardClick();
    initCardFormatting();

    console.log('wemint.app initialized');
});

// ========================================
// Export for use in other files
// ========================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getProducts,
        addProduct,
        updateProduct,
        deleteProductById,
        openProductModal,
        closeProductModal,
        proceedToCheckout
    };
}
