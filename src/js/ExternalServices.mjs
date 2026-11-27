// Base URL of the API, read from src/.env (VITE_SERVER_URL)
const baseURL = import.meta.env.VITE_SERVER_URL;

async function convertToJson(res) {
  // Read the body first, so we keep the server's message even when the request fails
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  // No constructor needed any more: the category is passed to getData instead.

  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // Send an order to the server. payload is a plain object with the
  // exact keys the server expects (fname, lname, street, ..., items).
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }
}
