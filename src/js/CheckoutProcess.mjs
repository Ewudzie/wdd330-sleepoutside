import { getLocalStorage } from "./utils.mjs";
import ExternalServices from "./ExternalServices.mjs";

// Turn a <form> into a plain object: { fname: "Ann", zip: "83440", ... }
// The input name="..." attributes become the keys.
function formDataToJSON(formElement) {
  const formData = new FormData(formElement);
  const convertedJSON = {};
  formData.forEach((value, key) => {
    convertedJSON[key] = value;
  });
  return convertedJSON;
}

// Simplify the cart items to the four fields the server wants.
// The cart stores one entry per item added, so each has quantity 1.
function packageItems(items) {
  return items.map((item) => ({
    id: item.Id,
    name: item.Name,
    price: item.FinalPrice,
    quantity: 1,
  }));
}

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
    summary.querySelector("#subtotal").innerText =
      `$${this.itemTotal.toFixed(2)}`;
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
    summary.querySelector("#shipping").innerText =
      `$${this.shipping.toFixed(2)}`;
    summary.querySelector("#orderTotal").innerText =
      `$${this.orderTotal.toFixed(2)}`;
  }

  async checkout(form) {
    // Make sure tax, shipping and total are calculated even if the
    // customer never left the zip field.
    this.calculateOrderTotal();

    const order = formDataToJSON(form);
    order.orderDate = new Date().toISOString();
    order.items = packageItems(this.list);
    order.orderTotal = this.orderTotal.toFixed(2);
    order.shipping = this.shipping;
    order.tax = this.tax.toFixed(2);

    const services = new ExternalServices();
    const response = await services.checkout(order);
    console.log(response);
    return response;
  }
}
