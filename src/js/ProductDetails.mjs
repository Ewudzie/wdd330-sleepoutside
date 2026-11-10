import { getLocalStorage, setLocalStorage, qs } from "./utils.mjs";

export default class ProductDetails {
  constructor(productId, dataSource) {
    // which product this page is about (from the URL, e.g. "880RR")
    this.productId = productId;
    // empty for now; filled in once the data has been fetched
    this.product = {};
    // where to get product data from (an instance of ProductData)
    this.dataSource = dataSource;
  }

  async init() {
    // findProductById returns a promise, so wait for the product details
    this.product = await this.dataSource.findProductById(this.productId);

    // the details are needed before the HTML can be rendered
    this.renderProductDetails();

    // once the HTML is rendered, listen for clicks on Add to Cart.
    // .bind(this) keeps `this` pointing at this ProductDetails object
    // when the browser calls the method as an event handler.
    document
      .getElementById("addToCart")
      .addEventListener("click", this.addProductToCart.bind(this));
  }

  addProductToCart() {
    // read the existing cart (or start a new one) and add this product to it
    let cartItems = getLocalStorage("so-cart") || [];
    if (!Array.isArray(cartItems)) {
      cartItems = [cartItems];
    }
    cartItems.push(this.product);
    setLocalStorage("so-cart", cartItems);
  }

  renderProductDetails() {
    const product = this.product;

    document.title = `Sleep Outside | ${product.Name}`;

    qs(".product-detail h3").textContent = product.Brand.Name;
    qs(".product-detail h2").textContent = product.NameWithoutBrand;

    const image = qs(".product-detail img");
    image.src = product.Image;
    image.alt = product.NameWithoutBrand;

    qs(".product-card__price").textContent = `$${product.FinalPrice}`;
    qs(".product__color").textContent = product.Colors[0].ColorName;
    // the description contains HTML entities like &#39; so use innerHTML
    qs(".product__description").innerHTML = product.DescriptionHtmlSimple;

    qs("#addToCart").dataset.id = product.Id;
  }
}
