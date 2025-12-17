// ──────────────────────────────────────────
// DOM Elements
// ──────────────────────────────────────────

const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const filterBtns = document.querySelectorAll('.filter-btn');
const productsGrid = document.getElementById('productsGrid');
const productModal = document.getElementById('productModal');
const modalBody = document.getElementById('modalBody');
const modalClose = document.getElementById('modalClose');
const modalClose2 = document.getElementById('modalClose2');
const cartPanel = document.getElementById('cartPanel');
const cartOverlay = document.getElementById('cartOverlay');
const cartClose = document.getElementById('cartClose');
const cartItems = document.getElementById('cartItems');
const cartTotal = document.getElementById('cartTotal');
const checkoutBtn = document.getElementById('checkoutBtn');

// ──────────────────────────────────────────
// Mobile Navigation Toggle
// ──────────────────────────────────────────

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('active');
});

// Close mobile menu when clicking nav link
document.querySelectorAll('.nav-menu a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
  });
});

// ──────────────────────────────────────────
// Render Products Grid
// ──────────────────────────────────────────

function renderProducts(category = 'all') {
  productsGrid.innerHTML = '';
  const filtered = category === 'all' 
    ? products 
    : products.filter(p => p.category === category);

  filtered.forEach(product => {
    const priceFormatted = `Rp${product.price.toLocaleString('id-ID')}`;
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" data-id="${product.id}" />
      <div class="card-body">
        <span class="category">${product.category}</span>
        <h4>${product.name}</h4>
        <div class="price">${priceFormatted}</div>
        <button class="btn btn-outline btn-add" data-id="${product.id}">Pilih Produk</button>
      </div>
    `;
    productsGrid.appendChild(card);
  });

  // Add event listeners to "Pilih Produk" buttons
  document.querySelectorAll('.btn-add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const product = products.find(p => p.id === id);
      if (product) openProductModal(product);
    });
  });

  // Add click listeners to images (also open modal)
  document.querySelectorAll('.product-card img').forEach(img => {
    img.addEventListener('click', (e) => {
      const id = e.target.dataset.id;
      const product = products.find(p => p.id === id);
      if (product) openProductModal(product);
    });
  });
}

// Initial render
renderProducts();

// ──────────────────────────────────────────
// Product Modal
// ──────────────────────────────────────────

function openProductModal(product) {
  const priceFormatted = `Rp${product.price.toLocaleString('id-ID')}`;
  modalBody.innerHTML = `
    <div class="product-modal-header">
      <img src="${product.image}" alt="${product.name}" />
      <div class="modal-info">
        <h2>${product.name}</h2>
        <div class="price-large">${priceFormatted}</div>
        <p><strong>Kategori:</strong> ${product.category}</p>
        <p>${product.description}</p>
        
        <h3>Manfaat Utama</h3>
        <ul>
          ${product.benefits.map(b => `<li>✅ ${b}</li>`).join('')}
        </ul>
        
        <h3>Komposisi</h3>
        <p>${product.composition}</p>
      </div>
    </div>
    
    <div style="text-align:center; margin-top:30px;">
      <button class="btn btn-primary" id="addToCartBtn" data-id="${product.id}">
        ➕ Tambah ke Keranjang
      </button>
      <button class="btn btn-whatsapp" style="margin-left:12px;" 
              onclick="window.open('https://wa.me/6282241900467?text=Saya%20mau%20pesan%20${encodeURIComponent(product.name)}%2C%20harga%20${priceFormatted}.', '_blank')">
        📲 Langsung ke WhatsApp
      </button>
    </div>
  `;

  productModal.style.display = 'block';

  // Add to cart from modal
  document.getElementById('addToCartBtn')?.addEventListener('click', () => {
    addToCart(product);
    productModal.style.display = 'none';
  });
}

modalClose.addEventListener('click', () => {
  productModal.style.display = 'none';
});
modalClose2.addEventListener('click', () => {
  productModal.style.display = 'none';
});

// Close modal on ESC
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && productModal.style.display === 'block') {
    productModal.style.display = 'none';
  }
});

// Close modal on outside click
window.addEventListener('click', (e) => {
  if (e.target === productModal) {
    productModal.style.display = 'none';
  }
});

// ──────────────────────────────────────────
// Cart System (localStorage)
// ──────────────────────────────────────────

function loadCart() {
  const cart = JSON.parse(localStorage.getItem('herbaprimaCart') || '[]');
  updateCartDisplay(cart);
  return cart;
}

function saveCart(cart) {
  localStorage.setItem('herbaprimaCart', JSON.stringify(cart));
}

function addToCart(product) {
  const cart = loadCart();
  const existing = cart.find(item => item.id === product.id);
  
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }
  
  saveCart(cart);
  updateCartDisplay(cart);
  showCartPanel();
}

function removeItem(id) {
  let cart = loadCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartDisplay(cart);
}

function updateCartDisplay(cart) {
  // Update cart items UI
  if (cart.length === 0) {
    cartItems.innerHTML = '<p style="text-align:center; color:#6b7280;">Keranjang masih kosong</p>';
  } else {
    cartItems.innerHTML = cart.map(item => {
      const total = item.price * item.quantity;
      const totalFormatted = `Rp${total.toLocaleString('id-ID')}`;
      return `
        <div class="cart-item">
          <img src="${item.image}" alt="${item.name}" />
          <div class="cart-info">
            <h4>${item.name}</h4>
            <div class="price">${totalFormatted}</div>
            <div>x${item.quantity}</div>
          </div>
          <button class="cart-remove" data-id="${item.id}">×</button>
        </div>
      `;
    }).join('');
    
    // Add remove listeners
    document.querySelectorAll('.cart-remove').forEach(btn => {
      btn.addEventListener('click', (e) => {
        removeItem(e.target.dataset.id);
      });
    });
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  cartTotal.textContent = `Rp${total.toLocaleString('id-ID')}`;

  // Update checkout button
  if (cart.length > 0) {
    const itemsList = cart.map(item => 
      `• ${item.name} x${item.quantity} = Rp${(item.price * item.quantity).toLocaleString('id-ID')}`
    ).join('%0A');
    const totalRp = `Total: Rp${total.toLocaleString('id-ID')}`;
    checkoutBtn.href = `https://wa.me/6282241900467?text=Halo%20Herbaprima%2C%20saya%20mau%20pesan%3A%0A${itemsList}%0A%0A${totalRp}`;
  } else {
    checkoutBtn.href = '#';
    checkoutBtn.classList.add('disabled');
  }
}

// Initial cart load
loadCart();

// Cart panel toggles
function showCartPanel() {
  cartPanel.classList.add('active');
  cartOverlay.style.display = 'block';
}

cartClose.addEventListener('click', () => {
  cartPanel.classList.remove('active');
  cartOverlay.style.display = 'none';
});

cartOverlay.addEventListener('click', () => {
  cartPanel.classList.remove('active');
  cartOverlay.style.display = 'none';
});

// ──────────────────────────────────────────
// Category Filter
// ──────────────────────────────────────────

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    filterBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    renderProducts(btn.dataset.category);
  });
});

// ──────────────────────────────────────────
// Smooth Scroll for Anchor Links
// ──────────────────────────────────────────

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
      // Close mobile menu if open
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});