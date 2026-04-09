// ==========================
// MENU MOBILE
// ==========================
const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

document.querySelectorAll("#navMenu a").forEach(link => {
  link.addEventListener("click", () => {
    navMenu.classList.remove("active");
  });
});

// ==========================
// FITUR KERANJANG BELANJA
// ==========================

let cart = JSON.parse(localStorage.getItem("masAllFruitCart")) || [];

const cartSidebar = document.getElementById("cartSidebar");
const cartOverlay = document.getElementById("cartOverlay");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const cartTotal = document.getElementById("cart-total");

// ==========================
// HELPER
// ==========================

function formatRupiah(number) {
  return "Rp " + number.toLocaleString("id-ID");
}

function saveCart() {
  localStorage.setItem("masAllFruitCart", JSON.stringify(cart));
}

function updateCartCount() {
  const totalItems = cart.reduce((total, item) => total + item.qty, 0);
  if (cartCount) cartCount.textContent = totalItems;
}

// ==========================
// BUKA & TUTUP KERANJANG
// ==========================

function openCart() {
  cartSidebar.classList.add("active");
  cartOverlay.classList.add("active");
}

function closeCart() {
  cartSidebar.classList.remove("active");
  cartOverlay.classList.remove("active");
}

function toggleCart() {
  cartSidebar.classList.toggle("active");
  cartOverlay.classList.toggle("active");
}

if (cartOverlay) {
  cartOverlay.addEventListener("click", closeCart);
}

// ==========================
// RENDER CART
// ==========================

function renderCart() {
  if (!cartItems || !cartTotal) return;

  cartItems.innerHTML = "";

  if (cart.length === 0) {
    cartItems.innerHTML = `<p class="empty-cart">Keranjang masih kosong.</p>`;
    cartTotal.textContent = "Rp 0";
    updateCartCount();
    saveCart();
    return;
  }

  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    const div = document.createElement("div");
    div.style.padding = "18px 0";
    div.style.borderBottom = "1px solid #eee";

    div.innerHTML = `
      <h4 style="margin:0 0 8px 0; font-size:16px;">
        ${item.name}
      </h4>

      <p style="margin:0; color:#666; font-size:14px;">
        ${formatRupiah(item.price)} x ${item.qty}
      </p>

      <p style="margin:8px 0; font-weight:bold; color:#2e7d32;">
        Subtotal: ${formatRupiah(subtotal)}
      </p>

      <div style="display:flex; align-items:center; gap:8px;">
        
        <button onclick="changeQty(${index}, -1)" 
          style="width:32px; height:32px; border:none; border-radius:8px; background:#e0e0e0; cursor:pointer; font-weight:bold;">
          −
        </button>

        <button onclick="changeQty(${index}, 1)" 
          style="width:32px; height:32px; border:none; border-radius:8px; background:#2e7d32; color:white; cursor:pointer; font-weight:bold;">
          +
        </button>

        <button onclick="removeFromCart(${index})" 
          style="margin-left:10px; padding:6px 14px; border:none; border-radius:8px; background:#e53935; color:white; cursor:pointer; font-size:13px;">
          Hapus
        </button>

      </div>
    `;

    cartItems.appendChild(div);
  });

  cartTotal.textContent = formatRupiah(total);

  updateCartCount();
  saveCart();
}

// ==========================
// AKSI KERANJANG
// ==========================

function addToCart(name, price) {
  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({
      name: name,
      price: price,
      qty: 1
    });
  }

  renderCart();
  openCart();
}

function changeQty(index, change) {
  if (!cart[index]) return;

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1);
  }

  renderCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  renderCart();
}

function clearCart() {
  cart = [];
  renderCart();
}

// ==========================
// CHECKOUT WHATSAPP
// ==========================

function checkoutWhatsApp() {
  if (cart.length === 0) {
    alert("Keranjang masih kosong!");
    return;
  }

  let message = "Halo FreshFruit, saya ingin pesan:%0A%0A";
  let total = 0;

  cart.forEach((item, index) => {
    const subtotal = item.price * item.qty;
    total += subtotal;

    message += `${index + 1}. ${item.name} (${item.qty} x ${formatRupiah(item.price)}) = ${formatRupiah(subtotal)}%0A`;
  });

  message += `%0ATotal: ${formatRupiah(total)}%0A%0ATerima kasih 🙏`;

  const phoneNumber = "6283848743225";
  window.open(`https://wa.me/${phoneNumber}?text=${message}`, "_blank");
}

// ==========================
// INIT
// ==========================

document.addEventListener("DOMContentLoaded", () => {
  renderCart();
});