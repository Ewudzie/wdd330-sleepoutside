// main.js - entry script for the home page (index.html)

// ProductData knows how to fetch product JSON for a category.
import ProductData from "./ProductData.mjs";
// ProductList turns that data into product cards on the page.
import ProductList from "./ProductList.mjs";

// Data source for tents. ProductData builds the path ../json/tents.json.
const dataSource = new ProductData("tents");

// The <ul class="product-list"> where the product cards will be inserted.
const element = document.querySelector(".product-list");

// Create the list (category, where the data comes from, where to render it)
// and start it. init() fetches the data and renders the cards.
const productList = new ProductList("Tents", dataSource, element);
productList.init();
