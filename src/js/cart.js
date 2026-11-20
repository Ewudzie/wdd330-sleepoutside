// cart.js - entry script for the cart page (cart/index.html)

import { loadHeaderFooter } from "./utils.mjs";
// ShoppingCart renders the cart items and the total.
import ShoppingCart from "./ShoppingCart.mjs";

// Fill the #main-header and #main-footer placeholders.
loadHeaderFooter();

// The <ul class="product-list"> where the cart items are rendered.
const listElement = document.querySelector(".product-list");

// Create the cart (localStorage key, where to render) and draw it.
const cart = new ShoppingCart("so-cart", listElement);
cart.init();
