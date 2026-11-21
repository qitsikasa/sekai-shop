(function () {
    const config = SekaiConfig;

    firebase.initializeApp(config.FIREBASE_CONFIG);

    const auth = firebase.auth();
    const provider = new firebase.auth.GoogleAuthProvider();

    async function login() {
        try {
            const result = await auth.signInWithPopup(provider);
            const user = result.user;

            if (!user || user.uid !== config.ALLOWED_UID) {
                alert('⛔ Acceso denegado. Esta cuenta no está autorizada.');
                await auth.signOut();
                return false;
            }

            console.log('Bienvenido, admin:', user.email);
            return true;
        } catch (error) {
            if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
                return false;
            }
            console.error('Error en login:', error);
            alert('Error al iniciar sesión. Inténtalo de nuevo.');
            return false;
        }
    }

    async function logout() {
        try {
            await auth.signOut();
            console.log('Sesión cerrada correctamente.');
        } catch (error) {
            console.error('Error al cerrar sesión:', error);
        }
    }

    function onAdminAuthChange(callback) {
        auth.onAuthStateChanged(async (user) => {
            if (user && user.uid === config.ALLOWED_UID) {
                callback(true);
                return;
            }

            if (user) await auth.signOut();
            callback(false);
        });
    }

    window.SekaiAuth = {
        login,
        logout,
        onAdminAuthChange
    };
})();
