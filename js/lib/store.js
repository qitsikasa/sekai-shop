(function () {
    const state = {
        products: [],
        filters: {
            unit: null,
            character: null,
            onlyStock: false
        }
    };

    async function loadProducts() {
        state.products = await SekaiApi.fetchProducts();
        return state.products;
    }

    function findProduct(id) {
        return state.products.find(p => String(p.id) === String(id));
    }

    window.SekaiStore = {
        state,
        loadProducts,
        findProduct
    };
})();
