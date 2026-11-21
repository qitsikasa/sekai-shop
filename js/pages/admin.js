(function () {
    const UNIT_CHARACTERS = SekaiConfig.UNIT_CHARACTERS;
    const MERCH_TYPES = SekaiConfig.MERCH_TYPES;
    const store = SekaiStore;
    const api = SekaiApi;

    let isAdmin = false;
    let modal;
    let form;

    function showAdminView(viewName) {
        ['login', 'dashboard'].forEach(view => {
            const el = document.getElementById(`view-${view}`);
            if (el) el.classList.add('hidden');
        });

        if (viewName === 'dashboard' && !isAdmin) viewName = 'login';

        const target = document.getElementById(`view-${viewName}`);
        if (target) target.classList.remove('hidden');

        const logoutButton = document.getElementById('btn-logout');
        if (logoutButton) logoutButton.classList.toggle('hidden', !isAdmin);
    }

    async function handleAuthChange(admin) {
        isAdmin = admin;

        if (admin) {
            showAdminView('dashboard');
            await refreshInventory();
        } else {
            showAdminView('login');
        }
    }

    async function refreshInventory() {
        try {
            await store.loadProducts();
        } catch (error) {
            console.error('Error cargando productos:', error);
        }
        loadAdminTable();
    }

    function loadAdminTable() {
        const tbody = document.getElementById('admin-table-body');

        if (store.state.products.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400">No hay productos. ¡Usa el botón de Testing!</td></tr>';
            return;
        }

        tbody.innerHTML = store.state.products.map(p => `
            <tr class="hover:bg-pastel-light transition">
                <td class="px-6 py-4">
                    <div class="flex items-center">
                        <img src="${p.imageUrl}" class="h-10 w-10 rounded object-cover mr-3">
                        <span class="text-sm font-medium text-gray-800 truncate max-w-[150px]">${p.name}</span>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-gray-500">${p.unit}</td>
                <td class="px-6 py-4 text-sm text-gray-500 max-w-[120px] truncate">${p.characters.join(', ')}</td>
                <td class="px-6 py-4">
                    <span class="px-2 py-1 text-xs font-bold rounded-full ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}">${p.stock}</span>
                </td>
                <td class="px-6 py-4 text-sm font-bold text-gray-800">Bs${parseFloat(p.price).toFixed(2)}</td>
                <td class="px-6 py-4 text-sm font-medium">
                    <button data-action="edit" data-id="${p.id}" class="text-blue-500 hover:text-blue-700 mr-3"><i class="fa-solid fa-pen"></i></button>
                    <button data-action="delete" data-id="${p.id}" class="text-red-500 hover:text-red-700"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`).join('');
    }

    async function seedDatabase() {
        if (!confirm('¿Estás seguro? Esto agregará 20 productos aleatorios.')) return;

        const allUnits = Object.keys(UNIT_CHARACTERS);

        for (let i = 0; i < 20; i++) {
            const unit = allUnits[Math.floor(Math.random() * allUnits.length)];
            const possibleChars = UNIT_CHARACTERS[unit];
            const numChars = Math.random() > 0.5 ? 2 : 1;
            const shuffled = [...possibleChars].sort(() => 0.5 - Math.random());
            const selectedChars = shuffled.slice(0, numChars);
            const merch = MERCH_TYPES[Math.floor(Math.random() * MERCH_TYPES.length)];
            const name = `${merch.name} - ${selectedChars.join(' & ')}`;
            const price = merch.basePrice + (Math.random() * 10 - 5);
            const stock = Math.floor(Math.random() * 15);

            const productData = {
                name,
                unit,
                characters: selectedChars,
                price: parseFloat(price.toFixed(2)),
                currency: 'BOB',
                stock,
                imageUrl: `https://placehold.co/300x300/FFD1DC/000000?text=${encodeURIComponent(selectedChars[0])}`,
                isNew: Math.random() > 0.7
            };

            await api.createProduct(productData);
        }

        alert('¡Se han generado 20 productos de prueba!');
        await refreshInventory();
    }

    function openModal(isEdit = false) {
        modal.classList.remove('hidden');

        if (!isEdit) {
            form.reset();
            document.getElementById('product-id').value = '';
            document.getElementById('modal-title').innerText = 'Nuevo Producto';
        }
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    function editProduct(id) {
        const product = store.findProduct(id);
        if (!product) return;

        document.getElementById('product-id').value = product.id;
        document.getElementById('p-name').value = product.name;
        document.getElementById('p-unit').value = product.unit;
        document.getElementById('p-stock').value = product.stock;
        document.getElementById('p-characters').value = product.characters.join(', ');
        document.getElementById('p-price').value = product.price;
        document.getElementById('p-currency').value = product.currency;
        document.getElementById('p-image').value = product.imageUrl;
        document.getElementById('modal-title').innerText = 'Editar Producto';

        openModal(true);
    }

    async function handleSaveProduct(event) {
        event.preventDefault();

        const id = document.getElementById('product-id').value;
        const charString = document.getElementById('p-characters').value;
        const charArray = charString.split(',').map(s => s.trim()).filter(s => s !== '');

        const data = {
            name: document.getElementById('p-name').value,
            unit: document.getElementById('p-unit').value,
            stock: parseInt(document.getElementById('p-stock').value, 10),
            characters: charArray,
            price: parseFloat(document.getElementById('p-price').value),
            currency: document.getElementById('p-currency').value,
            imageUrl: document.getElementById('p-image').value,
            isNew: true
        };

        try {
            if (id) {
                await api.updateProduct(id, data);
            } else {
                await api.createProduct(data);
            }

            closeModal();
            await refreshInventory();
        } catch (error) {
            console.error('Error al guardar:', error);
            alert('Hubo un error al guardar en la API.');
        }
    }

    async function handleDelete(id) {
        if (!confirm('¿Eliminar producto?')) return;

        try {
            await api.removeProduct(id);
            await refreshInventory();
        } catch (error) {
            console.error('Error al eliminar:', error);
        }
    }

    function bindEvents() {
        document.getElementById('google-login').addEventListener('click', () => SekaiAuth.login());
        document.getElementById('btn-logout').addEventListener('click', () => SekaiAuth.logout());
        document.getElementById('btn-seed').addEventListener('click', seedDatabase);
        document.getElementById('btn-new-product').addEventListener('click', () => openModal());
        document.getElementById('modal-cancel').addEventListener('click', closeModal);

        form.addEventListener('submit', handleSaveProduct);

        document.getElementById('admin-table-body').addEventListener('click', event => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;

            if (button.dataset.action === 'edit') editProduct(button.dataset.id);
            if (button.dataset.action === 'delete') handleDelete(button.dataset.id);
        });
    }

    function init() {
        modal = document.getElementById('crud-modal');
        form = document.getElementById('product-form');

        bindEvents();
        SekaiAuth.onAdminAuthChange(handleAuthChange);
        showAdminView('login');
    }

    window.SekaiAdmin = { init };
    init();
})();
