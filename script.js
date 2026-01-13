const menuData = {
  "Paneer Tikka": { category: "Starter Veg", portions: { "Half": 150, "Full": 300 } },
  "Veg Spring Roll": { category: "Starter Veg", portions: { "Full": 200 } },
  "Chicken Tikka": { category: "Starter Non-Veg", portions: { "Half": 200, "Full": 350 } },
  "Fish Amritsari": { category: "Starter Non-Veg", portions: { "Full": 400 } },
  "Dal Makhani": { category: "Main Course Veg", portions: { "Half": 150, "Full": 250 } },
  "Paneer Butter Masala": { category: "Main Course Veg", portions: { "Half": 180, "Full": 300 } },
  "Butter Chicken": { category: "Main Course Non-Veg", portions: { "Half": 220, "Full": 350 } },
  "Mutton Rogan Josh": { category: "Main Course Non-Veg", portions: { "Half": 280, "Full": 450, "KG": 1600 } }
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

//
const cartBtn = document.getElementById("floatingCart");
if (cartBtn) {
    total === 0 ? cartBtn.classList.add("floating-cart-hidden") : cartBtn.classList.remove("floating-cart-hidden");
  }
}

// Accepts 'portion' (Half/Full/KG)
function increase(item, portion) {
  const key = `${item} (${portion})`;
  cart[key] = (cart[key] || 0) + 1;
  saveCart();
}

function decrease(item, portion) {
  const key = `${item} (${portion})`;
  if (!cart[key]) return;
  cart[key]--;
  if (cart[key] <= 0) delete cart[key];
  saveCart();
}

function updateMenuQty() {
  Object.keys(menuData).forEach(item => {
    Object.keys(menuData[item].portions).forEach(portion => {
      const el = document.getElementById(`qty-${item}-${portion}`);
      if (el) {
        const key = `${item} (${portion})`;
        el.innerText = cart[key] || 0;
      }
    });
  });
}

function updateCartTotalUI() {
  let total = 0;
  Object.keys(cart).forEach(key => {
    // Extracts item name and portion from "Item (Portion)"
    const match = key.match(/(.*) \((.*)\)/);
    if (match) {
      const itemName = match[1];
      const portion = match[2];
      const price = menuData[itemName].portions[portion];
      total += price * cart[key];
    }
  });
  
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

