// ============================================
// COCOMAC RAW ORGANICS - MAIN APPLICATION
// Premium E-commerce with WhatsApp Ordering
// ============================================

// Initialize Lucide icons if available
document.addEventListener('DOMContentLoaded', function() {
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
    init();
});

// ============================================
// PRODUCT DATA REPOSITORY
// ============================================
const products = [
    {
        id: 1,
        name: "Tallow & Baobab Balm",
        slug: "tallow-balm",
        category: "face",
        price: 2400,
        ingredients: [
            "Grass-Fed Tallow (60%)", 
            "Baobab Oil (35%)", 
            "Vitamin E (4%)", 
            "Rosemary (1%)"
        ],
        description: "A multi-functional powerhouse replacing your moisturizer, night cream, and barrier repair. Within three days, customers report noticeably softer skin with the kind of lasting hydration that feels fundamentally different from conventional lotions.",
        badges: ["6 Ingredients", "Biocompatible"],
        image: "images/products/tallow-balm-jar.png",
        inStock: true
    },
    {
        id: 2,
        name: "Organic Baobab Powder",
        slug: "baobab-powder",
        category: "wellness",
        price: 1200,
        ingredients: ["100% Organic Baobab Fruit Pulp"],
        description: "Skincare starts in the gut. High-fiber prebiotic support for radiant skin from within.",
        badges: ["Single Origin", "Gut Health"],
        image: "images/products/baobab-powder-sachet.png",
        inStock: true
    },
    {
        id: 3,
        name: "Bentonite Clay Mask",
        slug: "bentonite-clay",
        category: "face",
        price: 900,
        ingredients: ["100% Pure Bentonite Clay", "Aqua"],
        description: "Pure, detoxifying volcanic ash. Draws out impurities and resets oily skin without harsh chemicals.",
        badges: ["Targeted Treatment", "Detoxifying"],
        image: "images/products/bentonite-clay-mask-jar.png",
        inStock: true
    },
    {
        id: 4,
        name: "Pure Coconut Oil (500ml)",
        slug: "coconut-oil-500ml",
        category: "body",
        price: 1500,
        ingredients: ["100% Cold-Pressed Coconut Oil"],
        description: "The ultimate multitasker. Deeply moisturizing for hair and body, cold-pressed to retain all its nutrients.",
        badges: ["Cold-Pressed", "Multi-Use"],
        image: "images/products/coconut-oil-500ml-bottle.png",
        inStock: true
    },
    {
        id: 5,
        name: "Pure Coconut Oil (250ml)",
        slug: "coconut-oil-250ml",
        category: "body",
        price: 850,
        ingredients: ["100% Cold-Pressed Coconut Oil"],
        description: "Perfect size for daily use. Pure, unrefined coconut oil for glowing skin and healthy hair.",
        badges: ["Cold-Pressed", "Travel Friendly"],
        image: "images/products/coconut-oil-250ml-bottle.png",
        inStock: true
    },
    {
        id: 6,
        name: "Baobab Oil",
        slug: "baobab-oil",
        category: "face",
        price: 1800,
        ingredients: ["100% Pure Baobab Oil"],
        description: "A nutrient-dense oil that supports skin elasticity and barrier health. Rich in Omega 3, 6, and 9 fatty acids, it absorbs fully to nourish without leaving a greasy residue.",
        badges: ["Barrier Support", "Fast Absorbing"],
        image: "images/products/baobab-oil-bottle.png",
        inStock: true
    },
    {
        id: 7,
        name: "Castor Oil",
        slug: "castor-oil",
        category: "hair",
        price: 1200,
        ingredients: ["100% Pure Castor Oil"],
        description: "Promotes hair growth and thickens lashes/brows. A thick, rich oil known for its strengthening properties.",
        badges: ["Hair Growth", "Strengthening"],
        image: "images/products/castor-oil-bottle.png",
        inStock: true
    },
    {
        id: 8,
        name: "Shea Butter (Raw Nilotica)",
        slug: "shea-butter",
        category: "body",
        price: 1600,
        ingredients: ["100% Raw Shea Nilotica Butter"],
        description: "Unlike hard West African shea, our Ugandan Shea Nilotica is naturally soft, creamy, and easy to spread. Deeply moisturizing and rich in vitamins A and E.",
        badges: ["Raw Nilotica", "Fair Trade"],
        image: "images/products/shea-butter-jar-200g.png",
        inStock: true
    },
    {
        id: 9,
        name: "Tamarind Anti-Oxidant Mask",
        slug: "tamarind-sauce",
        category: "face",
        price: 1200,
        ingredients: ["100% Organic Tamarind Concentrate"],
        description: "Nature's powerful exfoliant and brightener. Rich in Tartaric Acid (AHA) and Vitamin C to dissolve dead skin cells and fight free radicals.",
        badges: ["Natural AHA", "Brightening"],
        image: "images/products/tamarind-sauce-jar-200g.png",
        inStock: true
    }
];

// ============================================
// CART STATE MANAGEMENT (with localStorage)
// ============================================
const CART_STORAGE_KEY = 'cocomac_cart';
const WHATSAPP_NUMBER = '254780980201';

// Get cart from localStorage
function getCart() {
    try {
        const cartData = localStorage.getItem(CART_STORAGE_KEY);
        return cartData ? JSON.parse(cartData) : {};
    } catch (e) {
        console.error('Error reading cart:', e);
        return {};
    }
}

// Save cart to localStorage
function saveCart(cart) {
    try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
        console.error('Error saving cart:', e);
    }
}

// ============================================
// CART OPERATIONS
// ============================================
function addToCart(productId) {
    const cart = getCart();
    cart[productId] = (cart[productId] || 0) + 1;
    saveCart(cart);
    updateCartUI();
    
    // Visual feedback
    const btn = event.target;
    showAddedFeedback(btn);
}

function removeFromCart(productId) {
    const cart = getCart();
    delete cart[productId];
    saveCart(cart);
    updateCartUI();
    renderCartModal();
}

function updateQuantity(productId, delta) {
    const cart = getCart();
    const newQty = (cart[productId] || 0) + delta;
    
    if (newQty <= 0) {
        delete cart[productId];
    } else {
        cart[productId] = newQty;
    }
    
    saveCart(cart);
    updateCartUI();
    renderCartModal();
}

function clearCart() {
    saveCart({});
    updateCartUI();
}

function getCartItemCount() {
    const cart = getCart();
    return Object.values(cart).reduce((sum, qty) => sum + qty, 0);
}

function getCartTotal() {
    const cart = getCart();
    let total = 0;
    
    Object.entries(cart).forEach(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            total += product.price * quantity;
        }
    });
    
    return total;
}

// ============================================
// UI UPDATES
// ============================================
function updateCartUI() {
    const countElements = document.querySelectorAll('.cart-count, #cart-count');
    const totalCount = getCartItemCount();
    
    countElements.forEach(el => {
        el.textContent = totalCount;
    });
}

function showAddedFeedback(button) {
    if (!button) return;
    
    const originalText = button.innerText;
    const originalBackground = button.style.background;
    
    button.innerText = "Added!";
    button.style.background = "var(--color-soft-black)";
    
    setTimeout(() => {
        button.innerText = originalText;
        button.style.background = originalBackground || "";
    }, 1000);
}

// ============================================
// PRODUCT RENDERING (with filter/search)
// ============================================
let currentFilter = 'all';
let currentSearch = '';

function setFilter(category) {
    currentFilter = category;
    updateFilterButtons();
    renderProducts();
}

function setSearch(query) {
    currentSearch = query.toLowerCase();
    renderProducts();
}

function updateFilterButtons() {
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.category === currentFilter);
    });
}

function renderProducts() {
    const grid = document.getElementById('product-grid');
    if (!grid) return;
    
    const stockFilter = document.getElementById('stock-filter');
    const showInStockOnly = stockFilter ? stockFilter.checked : false;

    const availableProducts = products.filter(product => {
        // Stock filter
        if (showInStockOnly && !product.inStock) return false;
        
        // Category filter
        if (currentFilter !== 'all' && product.category !== currentFilter) return false;
        
        // Search filter
        if (currentSearch) {
            const searchTerms = product.name.toLowerCase() + ' ' + product.description.toLowerCase();
            if (!searchTerms.includes(currentSearch)) return false;
        }
        
        return true;
    });
    
    if (availableProducts.length === 0) {
        grid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <p style="font-size: 18px; color: var(--color-charcoal);">No products found matching your criteria.</p>
                <button class="btn btn-secondary" style="margin-top: 16px;" onclick="setFilter('all'); setSearch(''); document.getElementById('product-search').value = '';">
                    Clear Filters
                </button>
            </div>
        `;
        return;
    }
    
    const productsHTML = availableProducts.map(product => {
        const badgesHTML = product.badges
            .map(badge => `<span class="badge">${badge}</span>`)
            .join('');
        
        const ingredientsText = product.ingredients.join(' • ');
        
        return `
            <div class="product-card">
                <a href="products/${product.slug}.html" class="product-image-link">
                    <div class="product-image">
                        <img src="${product.image}" alt="${product.name}" loading="lazy">
                        <div class="product-badges">
                            ${badgesHTML}
                        </div>
                    </div>
                </a>
                <div class="product-info">
                    <div class="product-header">
                        <h3 class="product-title"><a href="products/${product.slug}.html">${product.name}</a></h3>
                        <span class="price">KES ${product.price.toLocaleString()}</span>
                    </div>
                    <p class="product-desc">${product.description}</p>
                    
                    <div class="product-ingredients">
                        <div class="product-ingredients-label">Full Ingredient List</div>
                        <div class="text-small">${ingredientsText}</div>
                    </div>

                    <button 
                        class="btn btn-primary" 
                        style="width: 100%; justify-content: center;" 
                        onclick="addToCart(${product.id})"
                        aria-label="Add ${product.name} to cart">
                        Add to Cart
                    </button>
                </div>
            </div>
        `;
    }).join('');
    
    grid.innerHTML = productsHTML;
}

// ============================================
// CART MODAL
// ============================================
function openCartModal() {
    let modal = document.getElementById('cart-modal');
    
    if (!modal) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.id = 'cart-modal';
        modal.className = 'cart-modal';
        modal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-modal-header">
                    <h2>Your Cart</h2>
                    <button class="cart-close-btn" onclick="closeCartModal()">&times;</button>
                </div>
                <div class="cart-modal-body" id="cart-modal-body"></div>
                <div class="cart-modal-footer">
                    <button class="btn btn-secondary" onclick="closeCartModal()">Continue Shopping</button>
                    <button class="btn btn-primary" onclick="handleCheckout()">Send Order to WhatsApp</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    renderCartModal();
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeCartModal() {
    const modal = document.getElementById('cart-modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
}

function renderCartModal() {
    const body = document.getElementById('cart-modal-body');
    if (!body) return;
    
    const cart = getCart();
    const cartItems = Object.entries(cart);
    
    if (cartItems.length === 0) {
        body.innerHTML = `
            <div class="cart-empty">
                <p>Your cart is empty</p>
                <p class="text-small">Add some products to get started!</p>
            </div>
        `;
        return;
    }
    
    let tableHTML = `
        <table class="cart-table">
            <thead>
                <tr>
                    <th>Product</th>
                    <th>Qty</th>
                    <th>Price</th>
                    <th>Subtotal</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
    `;
    
    cartItems.forEach(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            const subtotal = product.price * quantity;
            tableHTML += `
                <tr>
                    <td>${product.name}</td>
                    <td>
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, -1)">-</button>
                        <span style="margin: 0 8px;">${quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${product.id}, 1)">+</button>
                    </td>
                    <td>KES ${product.price.toLocaleString()}</td>
                    <td>KES ${subtotal.toLocaleString()}</td>
                    <td>
                        <button class="remove-btn" onclick="removeFromCart(${product.id})" title="Remove">×</button>
                    </td>
                </tr>
            `;
        }
    });
    
    tableHTML += `
            </tbody>
        </table>
        <div class="cart-total">
            <strong>Total: KES ${getCartTotal().toLocaleString()}</strong>
        </div>
    `;
    
    body.innerHTML = tableHTML;
}

// ============================================
// CHECKOUT FUNCTIONALITY
// ============================================
function handleCheckout() {
    const cart = getCart();
    const totalItems = getCartItemCount();
    
    if (totalItems === 0) {
        alert('Your cart is empty! Please add some products before checking out.');
        return;
    }
    
    // Build the order summary
    const orderLines = [];
    let total = 0;
    
    Object.entries(cart).forEach(([productId, quantity]) => {
        const product = products.find(p => p.id === parseInt(productId));
        if (product) {
            const subtotal = product.price * quantity;
            total += subtotal;
            orderLines.push(`• ${product.name} (x${quantity}) - KES ${subtotal.toLocaleString()}`);
        }
    });
    
    const message = `Hi Cocomac! I'd like to order:\r
\r
${orderLines.join('\\n')}\r
\r
*Total: KES ${total.toLocaleString()}*\r
\r
My delivery location is: [Please specify your area]`;
    
    const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    
    // Show thank-you modal
    showThankYouModal(orderLines, total, whatsappURL);
    
    // Clear cart after checkout
    clearCart();
    closeCartModal();
}

// Thank You Modal
function showThankYouModal(orderLines, total, whatsappURL) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('thank-you-modal');
    
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'thank-you-modal';
        modal.className = 'thank-you-modal';
        document.body.appendChild(modal);
    }
    
    modal.innerHTML = `
        <div class="thank-you-content">
            <div class="thank-you-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M22 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
            </div>
            <h2>Order Ready!</h2>
            <p style="margin-bottom: 24px;">Your order has been prepared. Click below to send it via WhatsApp.</p>
            <div style="background: var(--color-cream); padding: 16px; border-radius: 8px; margin-bottom: 24px; text-align: left;">
                <p style="font-size: 14px; margin-bottom: 8px;"><strong>Order Summary:</strong></p>
                <p style="font-size: 14px; margin: 0; white-space: pre-line;">${orderLines.join('\n')}</p>
                <p style="font-size: 16px; margin-top: 12px; font-weight: 600; color: var(--color-forest);">Total: KES ${total.toLocaleString()}</p>
            </div>
            <a href="${whatsappURL}" target="_blank" rel="noopener" class="btn btn-primary" style="width: 100%; margin-bottom: 12px;" onclick="closeThankYouModal()">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right: 8px;">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
                Send Order via WhatsApp
            </a>
            <button class="btn btn-secondary" style="width: 100%;" onclick="closeThankYouModal()">Close</button>
        </div>
    `;
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeThankYouModal() {
    const modal = document.getElementById('thank-you-modal');
    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// ============================================
// MOBILE MENU
// ============================================
function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.mobile-menu');
    
    if (toggle && menu) {
        toggle.addEventListener('click', () => {
            const isExpanded = menu.classList.contains('active');
            menu.classList.toggle('active');
            toggle.setAttribute('aria-expanded', !isExpanded);
        });
        
        // Close menu when clicking links
        menu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                menu.classList.remove('active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
}

// ============================================
// SMOOTH SCROLL
// ============================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// ============================================
// CART LINK HANDLERS
// ============================================
function initCartLinks() {
    // Cart icon click
    document.querySelectorAll('.cart-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    });
    
    // Checkout button click
    const checkoutBtn = document.getElementById('checkout-btn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            openCartModal();
        });
    }
}

// ============================================
// CONTACT FORM (WhatsApp-based)
// ============================================
function initContactForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const name = document.getElementById('name')?.value.trim() || '';
        const email = document.getElementById('email')?.value.trim() || '';
        const subject = document.getElementById('subject')?.value.trim() || 'General Inquiry';
        const message = document.getElementById('message')?.value.trim() || '';
        
        // Validation
        if (!name || !message) {
            alert('Please fill in your name and message.');
            return;
        }
        
        const whatsappMessage = `Hi Cocomac!

*New Inquiry from Website*

Name: ${name}
Email: ${email}
Subject: ${subject}

Message:
${message}`;
        
        const whatsappURL = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
        window.open(whatsappURL, '_blank');
        
        // Show confirmation
        alert('Opening WhatsApp to send your message...');
        form.reset();
    });
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
    renderProducts();
    updateCartUI();
    initMobileMenu();
    initSmoothScroll();
    initCartLinks();
    initCartLinks();
    initContactForm();

    // Update Copyright Year
    const yearEl = document.getElementById('copyright-year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
    
    // Close cart modal when clicking outside
    document.addEventListener('click', (e) => {
        const modal = document.getElementById('cart-modal');
        if (modal && e.target === modal) {
            closeCartModal();
        }
    });
    
    // Close cart modal with Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeCartModal();
        }
    });
}

// Export for external use if needed
window.CocomacCart = {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCart,
    getCartItemCount,
    getCartTotal,
    openCartModal,
    closeCartModal
};