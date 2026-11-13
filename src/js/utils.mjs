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
