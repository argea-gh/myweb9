// ──────────────────────────────────────────
// Admin Panel Logic (localStorage-based)
// ──────────────────────────────────────────

// DOM Elements
const form = document.getElementById('productForm');
const formTitle = document.getElementById('form-title');
const productIdInput = document.getElementById('productId');
const nameInput = document.getElementById('productName');
const categoryInput = document.getElementById('productCategory');
const priceInput = document.getElementById('productPrice');
const imageInput = document.getElementById('productImage');
const descInput = document.getElementById('productDesc');
const benefitsInput = document.getElementById('productBenefits');
const compositionInput = document.getElementById('productComposition');
const previewImg = document.getElementById('previewImg');
const imagePreview = document.getElementById('imagePreview');
const btnReset = document.getElementById('btnReset');
const productTableBody = document.getElementById('productTableBody');
const productCount = document.getElementById('productCount');
const btnExport = document.getElementById('btnExport');

// ⚠️ Ganti sumber produk: ambil dari localStorage, fallback ke default
let products = JSON.parse(localStorage.getItem('herbaprimaProducts')) || 
               (typeof products !== 'undefined' ? products : []);

// ──────────────────────────────────────────
// Helper: Render Product Table
// ──────────────────────────────────────────

function renderProductTable() {
  productTableBody.innerHTML = '';
  productCount.textContent = products.length;

  products.forEach((product, index) => {
    const priceFormatted = `Rp${product.price.toLocaleString('id-ID')}`;
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><img src="${product.image}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/60?text=No+Image'" /></td>
      <td><strong>${product.name}</strong><br><small>${product.category}</small></td>
      <td>${product.category}</td>
      <td>${priceFormatted}</td>
      <td>
        <button class="btn btn-sm btn-edit" data-index="${index}">
          <i class="fas fa-edit"></i> Edit
        </button>
        <button class="btn btn-sm btn-delete" data-index="${index}">
          <i class="fas fa-trash"></i> Hapus
        </button>
      </td>
    `;
    productTableBody.appendChild(row);
  });

  // Add event listeners
  document.querySelectorAll('.btn-edit').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('button').dataset.index;
      editProduct(index);
    });
  });

  document.querySelectorAll('.btn-delete').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const index = e.target.closest('button').dataset.index;
      deleteProduct(index);
    });
  });
}

// ──────────────────────────────────────────
// Helper: Fill Form with Product Data
// ──────────────────────────────────────────

function fillForm(product, index = null) {
  productIdInput.value = index !== null ? index : '';
  nameInput.value = product.name || '';
  categoryInput.value = product.category || '';
  priceInput.value = product.price || '';
  imageInput.value = product.image || '';
  descInput.value = product.description || '';
  benefitsInput.value = product.benefits ? product.benefits.join(', ') : '';
  compositionInput.value = product.composition || '';

  // Update preview
  if (product.image) {
    previewImg.src = product.image;
    previewImg.style.display = 'block';
    imagePreview.style.display = 'block';
  } else {
    previewImg.style.display = 'none';
    imagePreview.style.display = 'none';
  }
}

// ──────────────────────────────────────────
// Action: Tambah/Edit Produk
// ──────────────────────────────────────────

form.addEventListener('submit', (e) => {
  e.preventDefault();

  // Validasi wajib
  if (!nameInput.value.trim() || !categoryInput.value || !priceInput.value || !imageInput.value) {
    alert('⚠️ Nama, kategori, harga, dan URL gambar wajib diisi!');
    return;
  }

  const product = {
    id: nameInput.value.trim().toLowerCase().replace(/\s+/g, '-'),
    name: nameInput.value.trim(),
    category: categoryInput.value,
    price: parseInt(priceInput.value),
    image: imageInput.value.trim(),
    description: descInput.value.trim(),
    benefits: benefitsInput.value
      ? benefitsInput.value.split(',').map(b => b.trim()).filter(b => b)
      : [],
    composition: compositionInput.value.trim()
  };

  const index = productIdInput.value;

  if (index !== '') {
    // Edit
    products[index] = product;
  } else {
    // Tambah
    products.push(product);
  }

  saveProducts();
  renderProductTable();
  form.reset();
  imagePreview.style.display = 'none';
  formTitle.textContent = '➕ Tambah Produk Baru';
  productIdInput.value = '';
});

// ──────────────────────────────────────────
// Action: Reset Form
// ──────────────────────────────────────────

btnReset.addEventListener('click', () => {
  form.reset();
  imagePreview.style.display = 'none';
  formTitle.textContent = '➕ Tambah Produk Baru';
  productIdInput.value = '';
});

// ──────────────────────────────────────────
// Action: Edit Produk
// ──────────────────────────────────────────

function editProduct(index) {
  const product = products[index];
  fillForm(product, index);
  formTitle.textContent = '✏️ Edit Produk';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ──────────────────────────────────────────
// Action: Hapus Produk
// ──────────────────────────────────────────

function deleteProduct(index) {
  if (confirm(`Hapus produk "${products[index].name}"? Tindakan ini tidak bisa dikembalikan.`)) {
    products.splice(index, 1);
    saveProducts();
    renderProductTable();
  }
}

// ──────────────────────────────────────────
// Simpan ke localStorage
// ──────────────────────────────────────────

function saveProducts() {
  localStorage.setItem('herbaprimaProducts', JSON.stringify(products));
}

// ──────────────────────────────────────────
// Preview Gambar Saat Input URL Berubah
// ──────────────────────────────────────────

imageInput.addEventListener('input', () => {
  const url = imageInput.value.trim();
  if (url && (url.endsWith('.jpg') || url.endsWith('.jpeg') || url.endsWith('.png') || url.endsWith('.webp'))) {
    previewImg.src = url;
    previewImg.style.display = 'block';
    imagePreview.style.display = 'block';
  } else {
    previewImg.style.display = 'none';
    imagePreview.style.display = 'none';
  }
});

// ──────────────────────────────────────────
// Ekspor ke JSON
// ──────────────────────────────────────────

btnExport.addEventListener('click', () => {
  const dataStr = JSON.stringify(products, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `herbaprima-products-${new Date().toISOString().slice(0,10)}.json`;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 100);
});

// ──────────────────────────────────────────
// Inisialisasi
// ──────────────────────────────────────────

renderProductTable();