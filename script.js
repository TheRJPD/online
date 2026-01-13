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

// Helper: Calculate Grand Total
function calculateTotal() {
  let total = 0;
  Object.keys(cart).forEach(key => {
    const match = key.match(/(.*) \((.*)\)/);
    if (match) {
      const itemName = match[1];
      const portion = match[2];
      if (menuData[itemName]) {
        total += menuData[itemName].portions[portion] * cart[key];
      }
    }
  });
  return total;
}

// Update UI (Nav Total and Floating Cart Visibility)
function updateUI() {
  const total = calculateTotal();
  const cartBtn = document.getElementById("floatingCart");
  const cartTotalDisplay = document.getElementById("cartTotal");

  if (cartTotalDisplay) cartTotalDisplay.innerText = `₹${total}`;
  
  if (cartBtn) {
    total > 0 ? cartBtn.classList.remove("hidden") : cartBtn.classList.add("hidden");
  }
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateUI();
  updateMenuQtyDisplay();
  if (document.getElementById("cartItems")) renderCart();
}

function increase(item, portion) {
  const key = `${item} (${portion})`;
  cart[key] = (cart[key] || 0) + 1;
  saveCart();
}

function decrease(item, portion) {
  const key = `${item} (${portion})`;
  if (cart[key] > 0) {
    cart[key]--;
    if (cart[key] === 0) delete cart[key];
    saveCart();
  }
}

function updateMenuQtyDisplay() {
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

function renderCart() {
  const el = document.getElementById("cartItems");
  if (!el) return;

  if (Object.keys(cart).length === 0) {
    el.innerHTML = "<div class='empty-msg'>Your cart feels light. Add some royalty to it!</div>";
    return;
  }

  let html = "";
  Object.keys(cart).forEach(key => {
    const match = key.match(/(.*) \((.*)\)/);
    const itemName = match[1];
    const portion = match[2];
    const price = menuData[itemName].portions[portion];
    const qty = cart[key];

    html += `
      <div class="cart-item">
        <div class="item-info">
          <span class="item-name">${itemName}</span>
          <span class="item-meta">${portion} • ₹${price}</span>
        </div>
        <div class="qty-control">
          <button class="qty-btn" onclick="decrease('${itemName}', '${portion}')">−</button>
          <span class="qty-number">${qty}</span>
          <button class="qty-btn" onclick="increase('${itemName}', '${portion}')">+</button>
        </div>
        <div class="item-price">₹${price * qty}</div>
      </div>`;
  });

  el.innerHTML = html + `<div class="cart-total-footer">Grand Total: ₹${calculateTotal()}</div>`;
}

function sendWhatsApp() {
  const name = document.getElementById("name").value;
  const phone = document.getElementById("phone").value;
  const address = document.getElementById("address")?.value || "Not provided";

  if (!name || !phone || Object.keys(cart).length === 0) {
    alert("Please enter details and add items to your order.");
    return;
  }

  let orderDetails = "";
  Object.keys(cart).forEach(key => {
    orderDetails += `• ${key} x ${cart[key]}\n`;
  });

  const msg = `*New Order - The Rajputana Darbar*\n\n*Customer:* ${name}\n*Phone:* ${phone}\n*Address:* ${address}\n\n*Items:*\n${orderDetails}\n*Total Amount: ₹${calculateTotal()}*`;
  
  window.open(`https://wa.me/917795566237?text=${encodeURIComponent(msg)}`);
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}

document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  updateMenuQtyDisplay();
  if (document.getElementById("cartItems")) renderCart();
});
