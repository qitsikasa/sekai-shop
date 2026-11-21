(function () {
    const STORE_VIEWS = ['home', 'shop'];
    const ACTIVE_NAV = 'text-pastel-dark font-bold border-b-2 border-pastel-dark pb-1 transition';
    const INACTIVE_NAV = 'text-gray-500 hover:text-pastel-dark font-medium transition';

    let currentRoute = null;
    let adminLoadPromise = null;

    function getRoute() {
        const hash = window.location.hash.replace('#', '');
        if (hash === 'admin') return 'admin';
        if (hash === 'shop') return 'shop';
        return 'home';
    }

    function updateNav(viewName) {
        const navHome = document.getElementById('nav-home');
        const navShop = document.getElementById('nav-shop');
        const navAdmin = document.getElementById('nav-admin');

        if (navHome) navHome.className = viewName === 'home' ? ACTIVE_NAV : INACTIVE_NAV;
        if (navShop) navShop.className = viewName === 'shop' ? ACTIVE_NAV : INACTIVE_NAV;
        if (navAdmin) {
            navAdmin.className = viewName === 'admin'
                ? 'text-pastel-dark'
                : 'text-gray-600 hover:text-pastel-dark';
        }
    }

    function hideStoreViews() {
        STORE_VIEWS.forEach(view => {
            const el = document.getElementById(`view-${view}`);
            if (el) el.classList.add('hidden');
        });
    }

    function renderRoute(viewName) {
        if (viewName === currentRoute) return;
        currentRoute = viewName;

        updateNav(viewName);
        document.title = viewName === 'admin'
            ? 'Project Sekai Shop - Administración'
            : 'Project Sekai Shop - Tienda';

        if (viewName !== 'shop') {
            const buyModal = document.getElementById('buy-modal');
            if (buyModal) buyModal.classList.add('hidden');
        }

        if (viewName === 'admin') {
            hideStoreViews();
            loadAdmin()
                .then(() => {
                    if (getRoute() === 'admin') {
                        SekaiAdmin.open();
                    } else {
                        SekaiAdmin.close();
                    }
                })
                .catch(error => {
                    console.error(error);
                    alert('No se pudo cargar el panel de administración.');
                    navigate('home');
                });
            return;
        }

        if (window.SekaiAdmin) SekaiAdmin.close();

        hideStoreViews();
        const target = document.getElementById(`view-${viewName}`);
        if (target) target.classList.remove('hidden');
    }

    function navigate(viewName) {
        if (viewName === 'home') {
            if (window.location.hash) {
                try {
                    history.pushState(null, '', window.location.pathname + window.location.search);
                } catch (error) {
                    window.location.hash = '';
                }
            }
            renderRoute('home');
            return;
        }

        if (window.location.hash === `#${viewName}`) {
            renderRoute(viewName);
            return;
        }

        window.location.hash = viewName;
    }

    function loadScript(src) {
        return new Promise((resolve, reject) => {
            const absolute = new URL(src, window.location.href).href;
            const existing = Array.from(document.scripts).find(script => script.src === absolute);

            if (existing) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = src;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`No se pudo cargar ${src}`));
            document.body.appendChild(script);
        });
    }

    function loadAdmin() {
        if (window.SekaiAdmin) return Promise.resolve();
        if (adminLoadPromise) return adminLoadPromise;

        adminLoadPromise = (async () => {
            await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js');
            await loadScript('https://www.gstatic.com/firebasejs/9.23.0/firebase-auth-compat.js');
            await loadScript('js/lib/auth.js');
            await loadScript('js/pages/admin.js');
        })().catch(error => {
            adminLoadPromise = null;
            throw error;
        });

        return adminLoadPromise;
    }

    document.querySelectorAll('[data-view]').forEach(el => {
        el.addEventListener('click', () => navigate(el.dataset.view));
    });

    window.addEventListener('hashchange', () => renderRoute(getRoute()));
    window.addEventListener('popstate', () => renderRoute(getRoute()));

    renderRoute(getRoute());
})();
