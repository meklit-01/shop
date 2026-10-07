const state = {
    products: [],
    wishList: [],
    search: ""
};

const API = "https://dummyjson.com/products";

const productEl = document.getElementById("products");
const wishEl = document.getElementById("wish-list");
const searchEl = document.getElementById("searchInput");
const formEl = document.getElementById("searchForm");
const messageEl = document.getElementById("message");


async function loadProduct(query) {
    messageEl.innerHTML = "Loading...";

    try {
        const response = await fetch(`${API}/search?q=${query}`);

        if (!response.ok) {
            throw new Error("Failed to load products");
        }

        const data = await response.json();


        state.products = data.products;

        messageEl.innerHTML = "";

        render();

    } catch (error) {
        messageEl.innerHTML = "Could not load Products.";
        console.log(error);
    }
}


function createCard(product) {
    const image = product.thumbnail;

    const isWished = state.wishList.some(
        (wish) => wish.id === product.id
    );

    return `
        <article class="card">
            <img src="${image}" alt="${product.title}">

            <div class="card-content">
                <h3>${product.title}</h3>

                <p>${product.category}</p>

                <p>$${product.price}</p>

                <p>
                    Rating: ${product.rating ?? "N/A"}
                </p>

                <button onclick="addOrRemoveWish(${product.id})">
                    ${isWished ? "Remove" : "Wish"}
                </button>
            </div>
        </article>
    `;
}


function render() {
    const title = state.search.toLowerCase();

    const filteredProducts = state.products.filter((product) =>
        product.title.toLowerCase().includes(title)
    );

    productEl.innerHTML = filteredProducts
        .map((product) => createCard(product))
        .join("");

    wishEl.innerHTML = state.wishList
        .map((product) => createCard(product))
        .join("");
}


function saveWishs() {
    localStorage.setItem(
        "wishs",
        JSON.stringify(state.wishList)
    );
}


function loadWishs() {
    state.wishList =
        JSON.parse(localStorage.getItem("wishs")) || [];
}


function addOrRemoveWish(id) {
    const exists = state.wishList.find(
        (product) => product.id === id
    );

    if (exists) {
        state.wishList = state.wishList.filter(
            (product) => product.id !== id
        );
    } else {
        const product = state.products.find(
            (product) => product.id === id
        );

        if (product) {
            state.wishList.push(product);
        }
    }

    saveWishs();
    render();
}


formEl.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = searchEl.value.trim();

    if (!query) {
        return;
    }

    state.search = query;

    loadProduct(query);
});
function goToWishlist() {
    document.getElementById("wish-list").scrollIntoView({
        behavior: "smooth"
    });
}

function init() {
    loadWishs();

    state.search = "";

    loadProduct("");
}


init();

