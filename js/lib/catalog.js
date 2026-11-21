(function () {
    const units = SekaiConfig.UNIT_CHARACTERS;
    const allCharacters = [...units['Todos']];
    const virtualSingers = [...units['VIRTUAL SINGER']];
    const leoNeed = [...units['Leo/need']];
    const moreMoreJump = [...units['MORE MORE JUMP!']];
    const vividBadSquad = [...units['Vivid Bad Squad']];
    const wonderlands = [...units['Wonderlands x Showtime']];
    const nightcord = [...units['25-ji Nightcord de']];

    const sourceUrl = 'https://pjsekai.sega.jp/creatorsfesta2026/goods/index.html';

    window.SekaiCatalog = [
        {
            catalogId: 'cf2026-001',
            name: 'Acrylic Stand (26 modelos)',
            unit: 'Todos',
            characters: allCharacters,
            price: 1600,
            currency: 'JPY',
            stock: 12,
            imageUrl: 'assets/products/cf2026-001.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-002',
            name: 'Colección de badges holográficos A',
            unit: 'Todos',
            characters: [...virtualSingers, ...leoNeed],
            price: 500,
            currency: 'JPY',
            stock: 20,
            imageUrl: 'assets/products/cf2026-002.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-003',
            name: 'Colección de badges holográficos B',
            unit: 'Todos',
            characters: [...moreMoreJump, ...vividBadSquad],
            price: 500,
            currency: 'JPY',
            stock: 20,
            imageUrl: 'assets/products/cf2026-003.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-004',
            name: 'Colección de badges holográficos C',
            unit: 'Todos',
            characters: [...wonderlands, ...nightcord],
            price: 500,
            currency: 'JPY',
            stock: 20,
            imageUrl: 'assets/products/cf2026-004.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-005',
            name: 'ePick card series (52 modelos)',
            unit: 'Todos',
            characters: allCharacters,
            price: 300,
            currency: 'JPY',
            stock: 30,
            imageUrl: 'assets/products/cf2026-005.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-006',
            name: 'Carpeta transparente (26 modelos)',
            unit: 'Todos',
            characters: allCharacters,
            price: 500,
            currency: 'JPY',
            stock: 18,
            imageUrl: 'assets/products/cf2026-006.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-007',
            name: 'Carpeta transparente [Key Visual]',
            unit: 'Todos',
            characters: allCharacters,
            price: 500,
            currency: 'JPY',
            stock: 18,
            imageUrl: 'assets/products/cf2026-007.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-008',
            name: 'Panel acrílico glitter [Key Visual]',
            unit: 'Todos',
            characters: allCharacters,
            price: 2600,
            currency: 'JPY',
            stock: 8,
            imageUrl: 'assets/products/cf2026-008.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-009',
            name: 'Bolsa de compras',
            unit: 'Todos',
            characters: allCharacters,
            price: 1400,
            currency: 'JPY',
            stock: 10,
            imageUrl: 'assets/products/cf2026-009.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-010',
            name: 'Set de stickers con pouch (6 modelos)',
            unit: 'VIRTUAL SINGER',
            characters: virtualSingers,
            price: 1000,
            currency: 'JPY',
            stock: 15,
            imageUrl: 'assets/products/cf2026-010.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-011',
            name: 'Llavero acrílico (26 modelos)',
            unit: 'Todos',
            characters: allCharacters,
            price: 800,
            currency: 'JPY',
            stock: 16,
            imageUrl: 'assets/products/cf2026-011.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-012',
            name: 'Banda de goma',
            unit: 'VIRTUAL SINGER',
            characters: ['Miku'],
            price: 750,
            currency: 'JPY',
            stock: 14,
            imageUrl: 'assets/products/cf2026-012.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-101',
            name: 'CRPG EDIT TAPE (2 modelos)',
            unit: 'VIRTUAL SINGER',
            characters: virtualSingers,
            price: 900,
            currency: 'JPY',
            stock: 12,
            imageUrl: 'assets/products/cf2026-101.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-102',
            name: 'CRPG MULTI CLOTH',
            unit: 'VIRTUAL SINGER',
            characters: ['Miku'],
            price: 1000,
            currency: 'JPY',
            stock: 12,
            imageUrl: 'assets/products/cf2026-102.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-103',
            name: 'CRPG TABLET CASE (2 modelos)',
            unit: 'VIRTUAL SINGER',
            characters: ['Miku'],
            price: 800,
            currency: 'JPY',
            stock: 12,
            imageUrl: 'assets/products/cf2026-103.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-104',
            name: 'CRPG KEY CAP CHARM (3 modelos aleatorios)',
            unit: 'VIRTUAL SINGER',
            characters: ['Miku', 'Rin', 'Len'],
            price: 600,
            currency: 'JPY',
            stock: 24,
            imageUrl: 'assets/products/cf2026-104.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-105',
            name: 'CRPG STICKER PACK',
            unit: 'VIRTUAL SINGER',
            characters: virtualSingers,
            price: 1100,
            currency: 'JPY',
            stock: 15,
            imageUrl: 'assets/products/cf2026-105.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-106',
            name: 'CRPG KV TEE',
            unit: 'VIRTUAL SINGER',
            characters: ['Miku'],
            price: 5800,
            currency: 'JPY',
            stock: 6,
            imageUrl: 'assets/products/cf2026-106.webp',
            isNew: true,
            sourceUrl
        },
        {
            catalogId: 'cf2026-107',
            name: 'CRPG DESK MAT',
            unit: 'VIRTUAL SINGER',
            characters: ['Miku'],
            price: 3500,
            currency: 'JPY',
            stock: 8,
            imageUrl: 'assets/products/cf2026-107.webp',
            isNew: true,
            sourceUrl
        }
    ];
})();
