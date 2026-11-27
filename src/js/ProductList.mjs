// Shared helper that renders any list with a template function.
import { renderListWithTemplate, qs } from "./utils.mjs";

// Turns "sleeping-bags" into "Sleeping Bags"
function formatCategory(category) {
  return category
    .split("-") // ["sleeping", "bags"]
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1)) // ["Sleeping", "Bags"]
    .join(" "); // "Sleeping Bags"
}

// Returns a sorted copy of the products. sortBy is a <select> value
// such as "price-asc". [...list] copies the array so the original order
// from the API is kept.
function sortProducts(list, sortBy) {
  const sorted = [...list];
  switch (sortBy) {
    case "name-asc":
      return sorted.sort((a, b) => a.Name.localeCompare(b.Name));
    case "name-desc":
      return sorted.sort((a, b) => b.Name.localeCompare(a.Name));
    case "price-asc":
      return sorted.sort((a, b) => a.FinalPrice - b.FinalPrice);
    case "price-desc":
      return sorted.sort((a, b) => b.FinalPrice - a.FinalPrice);
    default:
      return sorted;
  }
}

// ProductList.mjs - builds the list of product cards from product data.

// Returns the HTML for one product card as a string.
// Each ${...} inserts a value from the product object (the template literal).
// The markup and class names match the old hard-coded cards in index.html,
// so the existing CSS still styles them.
function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="../product_pages/?product=${product.Id}">
      <img src="${product.Images.PrimaryMedium}" alt="Image of ${product.Name}" />
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
    const list = await this.dataSource.getData(this.category);
    // Keep the products so they can be re-sorted without another API call.
    this.products = list;

    // Render using the dropdown's current choice, then re-render on change.
    const sortSelect = qs("#sort");
    this.renderList(sortProducts(this.products, sortSelect.value));
    sortSelect.addEventListener("change", () => {
      this.renderList(sortProducts(this.products, sortSelect.value));
    });

    // Show the category in the heading, e.g. "Top Products: Backpacks"
    const categoryName = formatCategory(this.category);
    qs(".products h2").textContent = `Top Products: ${categoryName}`;
    document.title = `Sleep Outside | ${categoryName}`;
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
