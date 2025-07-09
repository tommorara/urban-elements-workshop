document.addEventListener("DOMContentLoaded", async () => {
  const productList = document.getElementById("product-list");

  try {
    const res = await fetch("/api/products");
    const products = await res.json();

    productList.innerHTML = "";

    if (!products.length) {
      productList.innerHTML = "<p>No products available.</p>";
      return;
    }

    products.forEach(product => {
      const card = document.createElement("div");
      card.className = "product";
      card.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <p><strong>Ksh ${product.price}</strong></p>
      `;
      productList.appendChild(card);
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    productList.innerHTML = "<p>Failed to load products.</p>";
  }
});

