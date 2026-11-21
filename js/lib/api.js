(function () {
    const db = SekaiFirebase.db;
    const productsRef = db.collection(SekaiConfig.COLLECTION);

    function normalize(product) {
        const characters = Array.isArray(product.characters)
            ? product.characters
            : (product.characters ? String(product.characters).split(',').map(s => s.trim()).filter(Boolean) : []);
        return { ...product, characters };
    }

    function toProduct(doc) {
        return normalize({ id: doc.id, ...doc.data() });
    }

    async function fetchProducts() {
        const snapshot = await productsRef.get();
        return snapshot.docs
            .map(toProduct)
            .sort((a, b) => {
                const aTime = a.createdAt && a.createdAt.seconds ? a.createdAt.seconds : 0;
                const bTime = b.createdAt && b.createdAt.seconds ? b.createdAt.seconds : 0;
                return bTime - aTime;
            });
    }

    async function createProduct(data) {
        await productsRef.add({
            ...data,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        });
    }

    async function updateProduct(id, data) {
        await productsRef.doc(String(id)).set({
            ...data,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp()
        }, { merge: true });
    }

    async function decrementStock(id) {
        const ref = productsRef.doc(String(id));

        return db.runTransaction(async transaction => {
            const snapshot = await transaction.get(ref);
            if (!snapshot.exists) throw new Error('Producto no encontrado');

            const currentStock = Number(snapshot.data().stock) || 0;
            if (currentStock <= 0) throw new Error('Sin stock');

            const newStock = currentStock - 1;
            transaction.update(ref, { stock: newStock });
            return newStock;
        });
    }

    async function removeProduct(id) {
        await productsRef.doc(String(id)).delete();
    }

    window.SekaiApi = {
        fetchProducts,
        createProduct,
        updateProduct,
        decrementStock,
        removeProduct
    };
})();
