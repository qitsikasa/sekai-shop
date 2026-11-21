(function () {
    if (!firebase.apps.length) {
        firebase.initializeApp(SekaiConfig.FIREBASE_CONFIG);
    }

    window.SekaiFirebase = {
        app: firebase.app(),
        db: firebase.firestore()
    };
})();
