// product-listing.js - entry script for product_listing/index.html
import ProductData from "./ProductData.mjs";
import ProductList from "./ProductList.mjs";
import { loadHeaderFooter, getParam } from "./utils.mjs";

loadHeaderFooter();

// Read the category from the URL, e.g. ?category=backpacks
const category = getParam("category");

const dataSource = new ProductData();
const element = document.querySelector(".product-list");
const productList = new ProductList(category, dataSource, element);
productList.init();
