window.SekaiConfig = {
    COLLECTION: 'products',

    LEGACY_API_URL: 'https://6afee7e93a0e70bc8d542c7a.mockapi.io/products',

    ALLOWED_UID: 'r7Odks38mCVEaTFVb9uEKyPmXS92',

    FIREBASE_CONFIG: {
        apiKey: 'AIzaSyCQMMRDzq_7cuGcIow8ekXu3oCO4RT06xs',
        authDomain: 'proyectos-testing-f0a11.firebaseapp.com',
        projectId: 'proyectos-testing-f0a11',
        storageBucket: 'proyectos-testing-f0a11.firebasestorage.app',
        messagingSenderId: '363768578991',
        appId: '1:363768578991:web:bf20fd61359e70f3f2e55a',
        measurementId: 'G-J2633G0HLX'
    },

    UNIT_CHARACTERS: {
        'VIRTUAL SINGER': ['Miku', 'Rin', 'Len', 'Luka', 'MEIKO', 'KAITO'],
        'Leo/need': ['Ichika', 'Saki', 'Honami', 'Shiho'],
        'MORE MORE JUMP!': ['Minori', 'Haruka', 'Airi', 'Shizuku'],
        'Vivid Bad Squad': ['Kohane', 'An', 'Akito', 'Toya'],
        'Wonderlands x Showtime': ['Tsukasa', 'Emu', 'Nene', 'Rui'],
        '25-ji Nightcord de': ['Kanade', 'Mafuyu', 'Ena', 'Mizuki'],
        'Todos': [
            'Miku', 'Rin', 'Len', 'Luka', 'MEIKO', 'KAITO',
            'Ichika', 'Saki', 'Honami', 'Shiho',
            'Minori', 'Haruka', 'Airi', 'Shizuku',
            'Kohane', 'An', 'Akito', 'Toya',
            'Tsukasa', 'Emu', 'Nene', 'Rui',
            'Kanade', 'Mafuyu', 'Ena', 'Mizuki'
        ]
    },

    formatPrice(product) {
        const symbols = { BOB: 'Bs', JPY: '¥', USD: '$' };
        const currency = product.currency || 'BOB';
        const symbol = symbols[currency] || currency;
        const decimals = currency === 'JPY' ? 0 : 2;
        return `${symbol}${(Number(product.price) || 0).toFixed(decimals)}`;
    }
};
