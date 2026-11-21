(function () {
    const UNIT_CHARACTERS = SekaiConfig.UNIT_CHARACTERS;
    const store = SekaiStore;
    const api = SekaiApi;

    function renderFilters() {
        const unitContainer = document.getElementById('filter-units');
        unitContainer.innerHTML = Object.keys(UNIT_CHARACTERS).map(unit => `
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="${unit}" class="accent-pastel-dark w-4 h-4">
                <span>${unit}</span>
            </label>
        `).join('');

        renderCharacterFilters();
    }

    function renderCharacterFilters() {
        const container = document.getElementById('filter-characters');
        const unit = store.state.filters.unit;

        if (!unit) {
            container.innerHTML = '<p class="text-xs text-gray-400 italic">Selecciona una unidad primero</p>';
            return;
        }

        container.innerHTML = UNIT_CHARACTERS[unit].map(character => `
            <label class="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" value="${character}" class="accent-pastel-dark w-4 h-4">
                <span>${character}</span>
            </label>
        `).join('');
    }

    function handleUnitChange(event) {
        const checkbox = event.target.closest('input[type="checkbox"]');
        if (!checkbox) return;

        document.querySelectorAll('#filter-units input').forEach(cb => {
            if (cb !== checkbox) cb.checked = false;
        });

        store.state.filters.unit = checkbox.checked ? checkbox.value : null;
        store.state.filters.character = null;

        renderCharacterFilters();
        applyFilters();
    }

    function handleCharacterChange(event) {
        const checkbox = event.target.closest('input[type="checkbox"]');
        if (!checkbox) return;

        document.querySelectorAll('#filter-characters input').forEach(cb => {
            if (cb !== checkbox) cb.checked = false;
        });

        store.state.filters.character = checkbox.checked ? checkbox.value : null;
        applyFilters();
    }

    function applyFilters() {
        const filters = store.state.filters;
        filters.onlyStock = document.getElementById('filter-instock').checked;

        let filtered = store.state.products;
        if (filters.unit) filtered = filtered.filter(p => p.unit === filters.unit);
        if (filters.character) filtered = filtered.filter(p => p.characters.includes(filters.character));
        if (filters.onlyStock) filtered = filtered.filter(p => p.stock > 0);

        document.getElementById('product-count').innerText = `${filtered.length} productos`;
        renderShopGrid(filtered);
    }

    function renderShopGrid(items) {
        const grid = document.getElementById('product-grid');

        if (items.length === 0) {
            grid.innerHTML = '<div class="col-span-full text-center py-10 text-gray-400">No hay productos.</div>';
            return;
        }

        grid.innerHTML = items.map(p => {
            const isOutOfStock = p.stock <= 0;

            return `
            <div class="bg-white rounded-xl shadow-sm hover:shadow-lg transition overflow-hidden group relative flex flex-col">
                ${isOutOfStock ? '<div class="absolute inset-0 bg-white bg-opacity-60 z-10 flex items-center justify-center"><span class="bg-red-500 text-white px-3 py-1 rounded-full font-bold transform -rotate-12">AGOTADO</span></div>' : ''}
                <div class="relative h-64 bg-pastel-light overflow-hidden">
                    <img src="${p.imageUrl}" class="w-full h-full object-cover group-hover:scale-105 transition duration-300">
                    ${p.isNew && !isOutOfStock ? `<span class="absolute top-3 left-3 bg-sekai-green text-white text-xs font-bold px-2 py-1 rounded">NEW</span>` : ''}
                </div>
                <div class="p-4 flex flex-col flex-1 justify-between">
                    <div>
                        <p class="text-xs text-pastel-dark font-bold mb-1">${p.unit}</p>
                        <h3 class="text-sm font-bold text-gray-800 line-clamp-2 h-10 mb-2">${p.name}</h3>
                        <div class="flex flex-wrap gap-1 mb-2">
                            ${p.characters.map(c => `<span class="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">${c}</span>`).join('')}
                        </div>
                    </div>
                    <div>
                        <div class="flex justify-between items-center mt-2 border-t pt-2 mb-3">
                            <span class="text-xs text-gray-500">Stock: ${p.stock}</span>
                            <span class="font-bold text-gray-800">Bs${parseFloat(p.price).toFixed(2)}</span>
                        </div>
                        <button data-buy-id="${p.id}" ${isOutOfStock ? 'disabled' : ''} class="w-full py-2 rounded-lg font-bold text-white transition ${isOutOfStock ? 'bg-gray-300 cursor-not-allowed' : 'bg-pastel-dark hover:bg-opacity-90 shadow-md'}">
                            ${isOutOfStock ? 'Sin Stock' : 'Comprar'}
                        </button>
                    </div>
                </div>
            </div>`;
        }).join('');
    }

    function openBuyModal(id) {
        const product = store.findProduct(id);
        if (!product || product.stock <= 0) return;

        document.getElementById('buy-product-id').value = product.id;
        document.getElementById('buy-product-stock').value = product.stock;
        document.getElementById('buy-image').src = product.imageUrl;
        document.getElementById('buy-name').innerText = product.name;
        document.getElementById('buy-price').innerText = `Bs ${parseFloat(product.price).toFixed(2)}`;

        document.getElementById('buy-modal').classList.remove('hidden');
    }

    function closeBuyModal() {
        document.getElementById('buy-modal').classList.add('hidden');
    }

    async function handleBuy(event) {
        event.preventDefault();

        const id = document.getElementById('buy-product-id').value;
        const currentStock = parseInt(document.getElementById('buy-product-stock').value, 10);

        if (currentStock <= 0) {
            alert('Lo sentimos, alguien más acaba de comprar el último.');
            return;
        }

        const product = store.findProduct(id);
        if (!product) return;

        const newStock = currentStock - 1;

        try {
            await api.updateProduct(id, { ...product, stock: newStock });

            alert(`¡Gracias por tu compra, ${document.getElementById('buy-client-name').value}! El stock ha bajado a ${newStock}.`);

            closeBuyModal();
            document.getElementById('buy-form').reset();

            await store.loadProducts();
            applyFilters();
        } catch (error) {
            console.error(error);
            alert('Hubo un error de conexión al procesar tu compra.');
        }
    }

    function bindEvents() {
        document.getElementById('filter-instock').addEventListener('change', applyFilters);
        document.getElementById('filter-units').addEventListener('change', handleUnitChange);
        document.getElementById('filter-characters').addEventListener('change', handleCharacterChange);

        document.getElementById('product-grid').addEventListener('click', event => {
            const button = event.target.closest('[data-buy-id]');
            if (!button) return;
            openBuyModal(button.dataset.buyId);
        });

        document.getElementById('buy-form').addEventListener('submit', handleBuy);
        document.getElementById('buy-cancel').addEventListener('click', closeBuyModal);
    }

    async function init() {
        renderFilters();
        bindEvents();

        try {
            await store.loadProducts();
        } catch (error) {
            console.error('Error cargando productos:', error);
        }

        applyFilters();
    }

    window.SekaiShop = { init, applyFilters };
    init();
})();
