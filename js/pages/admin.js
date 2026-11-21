(function () {
    const UNIT_CHARACTERS = SekaiConfig.UNIT_CHARACTERS;
    const store = SekaiStore;
    const api = SekaiApi;

    let isAdmin = false;
    let isActive = false;
    let modal;
    let detailModal;
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

        if (!isActive) return;

        if (admin) {
            showAdminView('dashboard');
            await refreshInventory();
        } else {
            if (modal) modal.classList.add('hidden');
            if (detailModal) detailModal.classList.add('hidden');
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
            tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-400">No hay productos. ¡Usa "Cargar Catálogo Real"!</td></tr>';
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
                <td class="px-6 py-4 text-sm font-bold text-gray-800">${SekaiConfig.formatPrice(p)}</td>
                <td class="px-6 py-4 text-sm font-medium">
                    <button data-action="view" data-id="${p.id}" class="text-gray-500 hover:text-pastel-dark mr-3" title="Ver detalle"><i class="fa-solid fa-eye"></i></button>
                    <button data-action="edit" data-id="${p.id}" class="text-blue-500 hover:text-blue-700 mr-3" title="Editar"><i class="fa-solid fa-pen"></i></button>
                    <button data-action="delete" data-id="${p.id}" class="text-red-500 hover:text-red-700" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                </td>
            </tr>`).join('');
    }

    async function importCatalog() {
        const catalog = window.SekaiCatalog || [];
        if (!catalog.length) {
            alert('No hay catálogo real configurado.');
            return;
        }

        if (!confirm(`¿Cargar ${catalog.length} productos reales de Project Sekai? Se omitirán los que ya existan.`)) return;

        try {
            const existingCatalogIds = new Set(store.state.products.map(p => p.catalogId).filter(Boolean));
            let imported = 0;
            let skipped = 0;

            for (const product of catalog) {
                if (existingCatalogIds.has(product.catalogId)) {
                    skipped++;
                    continue;
                }

                await api.createProduct({
                    ...product,
                    characters: [...product.characters]
                });

                existingCatalogIds.add(product.catalogId);
                imported++;
            }

            alert(`Catálogo cargado: ${imported} productos nuevos, ${skipped} omitidos.`);
            await refreshInventory();
        } catch (error) {
            console.error('Error importando el catálogo real:', error);
            alert('No se pudo cargar el catálogo real.');
        }
    }

    async function importLegacyProducts() {
        const legacyUrl = SekaiConfig.LEGACY_API_URL;
        if (!legacyUrl || legacyUrl.includes('TU_ID')) {
            alert('No hay una API antigua configurada para importar.');
            return;
        }

        if (!confirm('¿Importar los productos de MockAPI a Firestore? Se omitirán los que ya hayan sido importados.')) return;

        try {
            const response = await fetch(legacyUrl);
            if (!response.ok) throw new Error('No se pudo leer la API antigua');

            const legacyProducts = await response.json();
            const existingLegacyIds = new Set(store.state.products.map(p => p.legacyId).filter(Boolean));
            let imported = 0;
            let skipped = 0;

            for (const product of legacyProducts) {
                const legacyId = String(product.id);
                if (existingLegacyIds.has(legacyId)) {
                    skipped++;
                    continue;
                }

                const characters = Array.isArray(product.characters)
                    ? product.characters
                    : (product.characters ? String(product.characters).split(',').map(s => s.trim()).filter(Boolean) : []);

                await api.createProduct({
                    name: product.name,
                    unit: product.unit,
                    characters,
                    price: parseFloat(product.price),
                    currency: product.currency || 'BOB',
                    stock: Number(product.stock) || 0,
                    imageUrl: product.imageUrl,
                    isNew: Boolean(product.isNew),
                    legacyId
                });

                existingLegacyIds.add(legacyId);
                imported++;
            }

            alert(`Importación terminada: ${imported} productos nuevos, ${skipped} omitidos.`);
            await refreshInventory();
        } catch (error) {
            console.error('Error importando productos:', error);
            alert('No se pudieron importar los productos de MockAPI.');
        }
    }

    function openModal(isEdit = false) {
        closeDetailModal();
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

    function openProductDetail(id) {
        const product = store.findProduct(id);
        if (!product) return;

        if (modal) modal.classList.add('hidden');

        document.getElementById('detail-image').src = product.imageUrl;
        document.getElementById('detail-image').alt = product.name;
        document.getElementById('detail-unit').innerText = product.unit;
        document.getElementById('detail-name').innerText = product.name;
        document.getElementById('detail-price').innerText = SekaiConfig.formatPrice(product);
        document.getElementById('detail-id').innerText = product.id;

        const charactersContainer = document.getElementById('detail-characters');
        charactersContainer.innerHTML = product.characters.length
            ? product.characters.map(c => `<span class="text-[11px] bg-gray-100 text-gray-600 px-2 py-1 rounded">${c}</span>`).join('')
            : '<span class="text-xs text-gray-400 italic">Sin personajes</span>';

        const newBadge = document.getElementById('detail-new');
        newBadge.classList.toggle('hidden', !product.isNew);

        const stockElement = document.getElementById('detail-stock');
        stockElement.innerText = product.stock > 0 ? `${product.stock} en stock` : 'Agotado';
        stockElement.className = `text-lg font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`;

        detailModal.classList.remove('hidden');
    }

    function closeDetailModal() {
        if (detailModal) detailModal.classList.add('hidden');
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
        document.getElementById('btn-seed').addEventListener('click', importCatalog);
        document.getElementById('btn-import').addEventListener('click', importLegacyProducts);
        document.getElementById('btn-new-product').addEventListener('click', () => openModal());
        document.getElementById('modal-cancel').addEventListener('click', closeModal);
        document.getElementById('detail-close').addEventListener('click', closeDetailModal);
        document.getElementById('detail-cancel').addEventListener('click', closeDetailModal);

        detailModal.addEventListener('click', event => {
            if (event.target === detailModal) closeDetailModal();
        });

        form.addEventListener('submit', handleSaveProduct);

        document.getElementById('admin-table-body').addEventListener('click', event => {
            const button = event.target.closest('button[data-action]');
            if (!button) return;

            if (button.dataset.action === 'view') openProductDetail(button.dataset.id);
            if (button.dataset.action === 'edit') editProduct(button.dataset.id);
            if (button.dataset.action === 'delete') handleDelete(button.dataset.id);
        });
    }

    function open() {
        if (isActive) return;
        isActive = true;

        if (isAdmin) {
            showAdminView('dashboard');
            refreshInventory();
        } else {
            showAdminView('login');
        }
    }

    function close() {
        isActive = false;

        ['login', 'dashboard'].forEach(view => {
            const el = document.getElementById(`view-${view}`);
            if (el) el.classList.add('hidden');
        });

        if (modal) modal.classList.add('hidden');
        if (detailModal) detailModal.classList.add('hidden');
    }

    function init() {
        modal = document.getElementById('crud-modal');
        detailModal = document.getElementById('detail-modal');
        form = document.getElementById('product-form');

        bindEvents();
        SekaiAuth.onAdminAuthChange(handleAuthChange);
    }

    window.SekaiAdmin = { init, open, close };
    init();
})();
