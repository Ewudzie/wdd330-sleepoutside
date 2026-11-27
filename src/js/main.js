// main.js - entry script for the home page (index.html)
import {
  loadHeaderFooter,
  getLocalStorage,
  setLocalStorage,
} from "./utils.mjs";

loadHeaderFooter();

// Newsletter sign up
const newsletterForm = document.querySelector("#newsletter-form");

newsletterForm.addEventListener("submit", (event) => {
  // Stop the page from reloading
  event.preventDefault();

  const email = newsletterForm.email.value.trim();

  // Save the email (no newsletter server yet, so we keep a list in localStorage)
  const subscribers = getLocalStorage("so-newsletter") || [];
  if (!subscribers.includes(email)) {
    subscribers.push(email);
    setLocalStorage("so-newsletter", subscribers);
  }

  // Replace the form with a thank-you message
  newsletterForm.outerHTML = `<p class="newsletter-thanks">Thanks for signing up! Watch <strong>${email}</strong> for our next newsletter.</p>`;
});
