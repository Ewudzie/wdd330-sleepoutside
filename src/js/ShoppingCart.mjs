// ShoppingCart.mjs - renders the items in the shopping cart and the cart total.

import { getLocalStorage, renderListWithTemplate } from "./utils.mjs";

// Returns the HTML for one cart item as a string.
// Same markup as before, so the existing CSS still styles it.
function cartItemTemplate(item) {
  return `<li class="cart-card divider">
    <a href="#" class="cart-card__image">
      <img src="${item.Images?.PrimarySmall ?? item.Image}" alt="${item.Name}" />
    </a>
    <a href="#">
      <h2 class="card__name">${item.Name}</h2>
    </a>
    <p class="cart-card__color">${item.Colors[0].ColorName}</p>
    <p class="cart-card__quantity">qty: 1</p>
    <p class="cart-card__price">$${item.FinalPrice}</p>
  </li>`;
}

export default class ShoppingCart {
  // key:         the localStorage key the cart is saved under (e.g. "so-cart")
  // listElement: the element the cart items are rendered into
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  // Read the cart, then draw the items and the total.
  init() {
    const cartItems = this.getCartItems();
    this.renderCartContents(cartItems);
    this.renderCartTotal(cartItems);
  }

  // Always returns an array, even if the cart is empty or was saved
  // as a single object by older code.
  getCartItems() {
    const cartItems = getLocalStorage(this.key) || [];
    return Array.isArray(cartItems) ? cartItems : [cartItems];
  }

  // Render every cart item using the shared list utility.
  // clear = true empties the list first, so re-rendering never duplicates items.
  renderCartContents(cartItems) {
    renderListWithTemplate(
      cartItemTemplate,
      this.listElement,
      cartItems,
      "afterbegin",
      true,
    );
  }

  // Show the cart total, but only when the cart has items.
  renderCartTotal(cartItems) {
    const footer = document.querySelector(".cart-footer");

    // Empty cart: keep the total hidden and stop here.
    if (cartItems.length === 0) {
      footer.classList.add("hide");
      return;
    }

    // reduce() keeps a running sum of FinalPrice, starting at 0.
    const total = cartItems.reduce((sum, item) => sum + item.FinalPrice, 0);
    document.querySelector(".cart-total__amount").textContent =
      total.toFixed(2);
    footer.classList.remove("hide");
  }
}
