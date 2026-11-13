// Shared helper that renders any list with a template function.
import { renderListWithTemplate } from "./utils.mjs";

// ProductList.mjs - builds the list of product cards from product data.

// Returns the HTML for one product card as a string.
// Each ${...} inserts a value from the product object (the template literal).
// The markup and class names match the old hard-coded cards in index.html,
// so the existing CSS still styles them.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="product_pages/?product=${product.Id}">
      <img src="${product.Image}" alt="Image of ${product.Name}" />
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  // category:    which kind of product this list shows (e.g. "Tents")
  // dataSource:  a ProductData instance that fetches the products
  // listElement: the HTML element the cards are inserted into
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  // Fetching data is asynchronous, and a constructor can't be async,
  // so the fetch happens here instead. Call init() after creating the list.
  async init() {
    // Wait for the JSON data to arrive (an array of product objects).
    const list = await this.dataSource.getData();
    // Turn the data into cards on the page.
    this.renderList(list);
  }

  // Builds a card for every product and inserts them into listElement.
  // The real work is done by the shared renderListWithTemplate utility.
  renderList(list) {
    renderListWithTemplate(
      productCardTemplate,
      this.listElement,
      list,
      "afterbegin",
      true,
    );
  }
}
