import { getLocalStorage } from "./utils.mjs";

export default class CheckoutProcess {
  // key:            localStorage key of the cart ("so-cart")
  // outputSelector: the element that holds the summary ("#order-summary")
  constructor(key, outputSelector) {
    this.key = key;
    this.outputSelector = outputSelector;
    this.list = [];
    this.itemTotal = 0;
    this.shipping = 0;
    this.tax = 0;
    this.orderTotal = 0;
  }

  init() {
    this.list = getLocalStorage(this.key) || [];
    this.calculateItemSubTotal();
  }

  // Subtotal and item count: shown as soon as the page loads.
  calculateItemSubTotal() {
    this.itemTotal = this.list.reduce((sum, item) => sum + item.FinalPrice, 0);

    const summary = document.querySelector(this.outputSelector);
    summary.querySelector("#num-items").innerText = this.list.length;
    summary.querySelector("#subtotal").innerText = `$${this.itemTotal.toFixed(2)}`;
  }

  // Tax, shipping and total: shown once the customer enters a zip code.
  calculateOrderTotal() {
    this.tax = this.itemTotal * 0.06;
    // $10 for the first item + $2 for each additional item (0 if cart is empty)
    this.shipping = this.list.length > 0 ? 10 + (this.list.length - 1) * 2 : 0;
    this.orderTotal = this.itemTotal + this.tax + this.shipping;

    this.displayOrderTotals();
  }

  displayOrderTotals() {
    const summary = document.querySelector(this.outputSelector);
    summary.querySelector("#tax").innerText = `$${this.tax.toFixed(2)}`;
    summary.querySelector("#shipping").innerText = `$${this.shipping.toFixed(2)}`;
    summary.querySelector("#orderTotal").innerText = `$${this.orderTotal.toFixed(2)}`;
  }
}
