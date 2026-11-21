(function () {
    const VIEWS = ['home', 'shop'];
    const ACTIVE_NAV = 'text-pastel-dark font-bold border-b-2 border-pastel-dark pb-1 transition';
    const INACTIVE_NAV = 'text-gray-500 hover:text-pastel-dark font-medium transition';

    function updateNav(viewName) {
        const navHome = document.getElementById('nav-home');
        const navShop = document.getElementById('nav-shop');

        if (navHome) navHome.className = viewName === 'home' ? ACTIVE_NAV : INACTIVE_NAV;
        if (navShop) navShop.className = viewName === 'shop' ? ACTIVE_NAV : INACTIVE_NAV;
    }

    function showView(viewName) {
        VIEWS.forEach(view => {
            const el = document.getElementById(`view-${view}`);
            if (el) el.classList.add('hidden');
        });

        const target = document.getElementById(`view-${viewName}`);
        if (target) target.classList.remove('hidden');

        updateNav(viewName);
    }

    document.querySelectorAll('[data-view]').forEach(el => {
        el.addEventListener('click', () => showView(el.dataset.view));
    });

    showView('home');
})();
