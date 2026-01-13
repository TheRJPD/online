const menuData = {
  "Paneer Tikka": { price: 300, category: "Starter Veg" },
  "Veg Spring Roll": { price: 200, category: "Starter Veg" },
  "Chicken Tikka": { price: 350, category: "Starter Non-Veg" },
  "Fish Amritsari": { price: 400, category: "Starter Non-Veg" },
  "Dal Makhani": { price: 250, category: "Main Course Veg" },
  "Paneer Butter Masala": { price: 300, category: "Main Course Veg" },
  "Butter Chicken": { price: 350, category: "Main Course Non-Veg" },
  "Mutton Rogan Josh": { price: 450, category: "Main Course Non-Veg" }
};

let cart = JSON.parse(localStorage.getItem("cart")) || {};

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateMenuQty();
  renderCart();
  updateFloatingCartTotal();
  updateCartTotalUI();
}

function updateFloatingCartTotal() {
  let total = 0;
  Object.keys(cart).forEach(item => {
    total += menuData[item].price * cart[item];
  });

  // Update the side floating cart total
  const floatingTotalEl = document.getElementById("cartTotal");
  if (floatingTotalEl) floatingTotalEl.innerText = `₹${total}`;

  // Update the navigation cart total
  const navTotalEl = document.getElementById("navCartTotal");
  if (navTotalEl) navTotalEl.innerText = `₹${total}`;
}
<!--Commented
function increase(item) {
  cart[item] = (cart[item] || 0) + 1;
  saveCart();
}

function decrease(item) {
  if (!cart[item]) return;
  cart[item]--;
  if (cart[item] <= 0) delete cart[item];
  saveCart();
}
-->

function increase(item, portion) {
  const cartKey = `${item} (${portion})`; // Example: "Paneer Tikka (Half)"
  cart[cartKey] = (cart[cartKey] || 0) + 1;
  saveCart();
}

function decrease(item, portion) {
  const cartKey = `${item} (${portion})`;
  if (!cart[cartKey]) return;
  cart[cartKey]--;
  if (cart[cartKey] <= 0) delete cart[cartKey];
  saveCart();
}

function updateMenuQty() {
  Object.keys(menuData).forEach(item => {
    const el = document.getElementById(`qty-${item}`);
    if (el) el.innerText = cart[item] || 0;
  });
}

function renderCart() {
  const el = document.getElementById("cartItems");
  if (!el) return;

  if (Object.keys(cart).length === 0) {
    el.innerHTML = "Cart is empty";
    return;
  }

  let total = 0;
  el.innerHTML = "";

  Object.keys(cart).forEach(item => {
    const { price, category } = menuData[item];
    const qty = cart[item];
    const itemTotal = price * qty;
    total += itemTotal;

    el.innerHTML += `
      <div class="cart-item">
        <div>
          <strong>${item}</strong><br>
          <small>${category} • ₹${price}</small>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="decrease('${item}')">−</button>
          <span class="qty-number">${qty}</span>
          <button class="qty-btn" onclick="increase('${item}')">+</button>
        </div>
        <strong>₹${itemTotal}</strong>
      </div>
    `;
  });

  el.innerHTML += `<h3>Total: ₹${total}</h3>`;
}

function orderText() {
  let text = "";
  let total = 0;

  Object.keys(cart).forEach(item => {
    const { price } = menuData[item];
    const qty = cart[item];
    const t = price * qty;
    total += t;
    text += `${item} x ${qty} = ₹${t}\n`;
  });

  return text + `\nTotal: ₹${total}`;
}

function clearCart() {
  cart = {};
  saveCart();
}

function updateCartTotalUI() {
  let total = 0;
  Object.keys(cart).forEach(item => {
    total += menuData[item].price * cart[item];
  });

  const cartBtn = document.getElementById("floatingCart");

  if (cartBtn) {
    if (total === 0) {
      cartBtn.classList.add("floating-cart-hidden");
    } else {
      cartBtn.classList.remove("floating-cart-hidden");
    }
  }
}


function sendWhatsApp() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone || Object.keys(cart).length === 0) {
    alert("Fill details & add items");
    return;
  }

  const msg =
`New Order – The Rajputana Darbar
Name: ${name}
Phone: ${phone}

${orderText()}`;

  window.open(`https://wa.me/917795566237?text=${encodeURIComponent(msg)}`);
  clearCart();
}

function sendEmail() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;

  if (!name || !phone || Object.keys(cart).length === 0) {
    alert("Fill details & add items");
    return;
  }

  const subject = "New Order | The Rajputana Darbar";
  const body =
`Name: ${name}
Phone: ${phone}

${orderText()}`;

  window.location.href =
    `mailto:YOUR_EMAIL@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  clearCart();
}

document.addEventListener("DOMContentLoaded", () => {
  updateMenuQty();            // sync menu quantities
  renderCart();               // render cart if on cart page
  updateFloatingCartTotal();  // update floating ₹ total
  updateCartTotalUI();
});

// Redirect to Home page on browser refresh
if (performance.getEntriesByType("navigation")[0]?.type === "reload") {
  if (!window.location.pathname.endsWith("index.html")) {
    window.location.href = "index.html";
  }
}

