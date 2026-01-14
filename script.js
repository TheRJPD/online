const menuData = {
  // Starters
  "Litti Chokha Dal Ghee": { portions: { "Full": 100 } },
  "Litti Chicken": { portions: { "Full": 150 } },
  "Chicken Kabab Paratha": { portions: { "Set": 50 } },
  "Paneer Paratha": { portions: { "Full": 80 } },
  "Aloo Paratha": { portions: { "Full": 60 } },
  "Dal Paratha": { portions: { "Full": 60 } },
  "Pyaz Paratha": { portions: { "Full": 60 } },
  "Maggie/Wai-Wai": { portions: { "Full": 50 } },
  "Kulhad Chai": { portions: { "Cup": 15 } },
  "Bun Makkhan": { portions: { "Full": 50 } },

  // Main Course
  "Paneer": { portions: { "Half": 140, "Full": 280, "KG": 800 } },
  "Mutton Handi": { portions: { "Half": 200, "Full": 400, "KG": 1500 } },
  "Chicken Handi": { portions: { "Half": 120, "Full": 240, "KG": 900 } },
  "Chicken Thali": { portions: { "Full": 200 } },
  "Mutton Thali": { portions: { "Full": 280 } },
  "Veg Thali": { portions: { "Full": 120 } },
  "Rice": { portions: { "Half": 45, "Full": 90 } },
  "Roti": { portions: { "Plain": 10, "Ghee": 15 } }
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

  // Update the text
  if (cartTotalDisplay) {
    cartTotalDisplay.innerText = `₹${total}`;
  }
  
  // Toggle visibility
  if (cartBtn) {
    if (total > 0) {
      cartBtn.classList.remove("hidden"); // Show it
    } else {
      cartBtn.classList.add("hidden");    // Hide it if empty
    }
  }
  
  console.log("Current Total:", total); // Check your browser console (F12) to see this
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
  
  window.open(`https://wa.me/916388442976?text=${encodeURIComponent(msg)}`);
  localStorage.removeItem("cart");
  window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", () => {
  updateUI();
  updateMenuQtyDisplay();
  if (document.getElementById("cartItems")) renderCart();
});

/*
document.addEventListener("DOMContentLoaded", () => {
  // ... your existing initialization (updateUI, etc.)
  updateUI();
  updateMenuQtyDisplay();
  if (document.getElementById("cartItems")) renderCart();
  
  // Automatic Navigation Highlighting logic
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const navLinks = document.querySelectorAll(".nav-container a");

  navLinks.forEach(link => {
    const linkPath = link.getAttribute("href");
    
    // Remove existing active classes first
    link.classList.remove("active");

    // Compare link href with current filename
    if (linkPath === currentPath) {
      link.classList.add("active");
    }
  });
});
*/

document.addEventListener("DOMContentLoaded", () => {
    const currentPath = window.location.pathname.split("/").pop();
    const navLinks = document.querySelectorAll(".nav-container a");

    navLinks.forEach(link => {
        const linkPath = link.getAttribute("href");
        if (linkPath === currentPath) {
            link.classList.add("active");
        }
        // Handle the case for the home page if path is empty
        if (currentPath === "" && linkPath === "index.html") {
            link.classList.add("active");
        }
    });
});
