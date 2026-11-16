import { getLocalStorage } from "./utils.mjs";

function renderCartContents() {
  let cartItems = getLocalStorage("so-cart") || [];
  if (!Array.isArray(cartItems)) {
    cartItems = [cartItems];
  }
  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector(".product-list").innerHTML = htmlItems.join("");
  // Update the total to match the items just rendered.
  renderCartTotal(cartItems);
}

function cartItemTemplate(item) {
  const newItem = `<li class="cart-card divider">
  <a href="#" class="cart-card__image">
    <img
      src="${item.Image}"
      alt="${item.Name}"
    />
  </a>
  <a href="#">
    <h2 class="card__name">${item.Name}</h2>
  </a>
  <p class="cart-card__color">${item.Colors[0].ColorName}</p>
  <p class="cart-card__quantity">qty: 1</p>
  <p class="cart-card__price">$${item.FinalPrice}</p>
</li>`;

  return newItem;
}

// Show the cart total, but only when the cart has items.
// cartItems: the array of products currently in the cart
function renderCartTotal(cartItems) {
  const footer = document.querySelector(".cart-footer");

  // Empty cart: keep the total hidden and stop here.
  if (cartItems.length === 0) {
    footer.classList.add("hide");
    return;
  }

  // reduce() walks the array and keeps a running sum.
  // sum starts at 0; for each item we add its FinalPrice.
  const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);

  // toFixed(2) formats the number with 2 decimals, e.g. 379.98
  document.querySelector(".cart-total__amount").textContent = total.toFixed(2);

  // Remove the hide class so the total becomes visible.
  footer.classList.remove("hide");
}
renderCartContents();
