// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}
// get a parameter from the URL query string, e.g. ?product=880RR
export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  return urlParams.get(param);
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener("touchend", (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener("click", callback);
}

// Render a list of items into a parent element using a template function.
// templateFn:    function that takes one item and returns an HTML string
// parentElement: the element to insert the HTML into
// list:          the array of items to render
// position:      where to insert (default "afterbegin"); see insertAdjacentHTML
// clear:         if true, empty parentElement before inserting (default false)
export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = "afterbegin",
  clear = false,
) {
  // Optionally remove anything already in the parent element.
  if (clear) {
    parentElement.innerHTML = "";
  }
  // Build one HTML string per item, then insert them all at once.
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(""));
}

// Render a single template (not a list) into a parent element.
// template:      HTML string to insert
// parentElement: the element to fill
// data:          optional data to pass to the callback
// callback:      optional function to run after the template is inserted
export function renderWithTemplate(template, parentElement, data, callback) {
  // Replace whatever is in the parent with the template.
  parentElement.innerHTML = template;
  // If a callback was given, run it (e.g. to fill in data or add listeners).
  if (callback) {
    callback(data);
  }
}

// Fetch an HTML file and return its contents as a string.
// path: the URL of the file, e.g. "/partials/header.html"
export async function loadTemplate(path) {
  const res = await fetch(path);
  // .text() (not .json()) because the file is HTML, not JSON.
  const template = await res.text();
  return template;
}

// Load the shared header and footer into the current page.
// Each page needs <header id="main-header"> and <footer id="main-footer">.
export async function loadHeaderFooter() {
  // 1. Fetch both partials. Absolute paths work from any page depth.
  const headerTemplate = await loadTemplate("/partials/header.html");
  const footerTemplate = await loadTemplate("/partials/footer.html");

  // 2. Find the placeholder elements in this page.
  const headerElement = document.querySelector("#main-header");
  const footerElement = document.querySelector("#main-footer");

  // 3. Insert the HTML into the placeholders.
  renderWithTemplate(headerTemplate, headerElement);
  renderWithTemplate(footerTemplate, footerElement);
}

// Show a dismissible message at the top of <main>
export function alertMessage(message, scroll = true) {
  const alert = document.createElement("div");
  alert.classList.add("alert");
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  // Clicking the X removes this alert
  alert.addEventListener("click", function (e) {
    if (e.target.tagName === "SPAN") {
      this.remove();
    }
  });

  const main = document.querySelector("main");
  main.prepend(alert);

  // Scroll to the top so the user sees the message
  if (scroll) window.scrollTo(0, 0);
}
