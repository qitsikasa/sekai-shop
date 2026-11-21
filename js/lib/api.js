(function () {
    const API_URL = SekaiConfig.API_URL;
    const isRemote = !API_URL.includes('TU_ID');
    let localProducts = [];

    function normalize(product) {
        const characters = Array.isArray(product.characters)
            ? product.characters
            : (product.characters ? product.characters.split(',').map(s => s.trim()).filter(Boolean) : []);
        return { ...product, characters };
    }

    async function fetchProducts() {
        if (!isRemote) return localProducts.map(normalize);

        const response = await fetch(API_URL);
        if (!response.ok) throw new Error('Error en API');
        const data = await response.json();
        return data.map(normalize);
    }

    async function createProduct(data) {
        if (!isRemote) {
            localProducts.unshift({ ...data, id: String(Date.now() + localProducts.length) });
            return;
        }

        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    async function updateProduct(id, data) {
        if (!isRemote) {
            const index = localProducts.findIndex(p => String(p.id) === String(id));
            if (index !== -1) localProducts[index] = { ...localProducts[index], ...data };
            return;
        }

        await fetch(`${API_URL}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    async function removeProduct(id) {
        if (!isRemote) {
            localProducts = localProducts.filter(p => String(p.id) !== String(id));
            return;
        }

        await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    }

    window.SekaiApi = {
        isRemote,
        fetchProducts,
        createProduct,
        updateProduct,
        removeProduct
    };
})();
