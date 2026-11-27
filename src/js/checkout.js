// checkout.js - entry script for the checkout page

// Shared helper that loads the header and footer partials into the page.
import { loadHeaderFooter } from "./utils.mjs";
import CheckoutProcess from "./CheckoutProcess.mjs";

// Fill the #main-header and #main-footer placeholders.
loadHeaderFooter();

const order = new CheckoutProcess("so-cart", "#order-summary");
order.init();

// When the customer leaves the zip field, calculate tax, shipping and total.
document
  .querySelector("#zip")
  .addEventListener("blur", order.calculateOrderTotal.bind(order));

// Submit the order without reloading the page.
document.forms["checkout"].addEventListener("submit", (event) => {
  event.preventDefault();
  order.checkout(event.target);
});
