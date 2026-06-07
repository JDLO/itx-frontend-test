import { cacheManager } from "./cache";

export const productService = {
    getProducts: async () => {
        const cacheKey = 'product_list';
        const cacheData = cacheManager.get(cacheKey);

        if(cacheData) {
            return cacheData;
        }

        const response  = await fetch('/api/product');
        if(!response.ok) throw new Error('Error al obtener productos');

        const data = await response.json();

        cacheManager.set(cacheKey, data);
        return data;
    },

    getProductById: async () =>{
        const cacheKey = `prodcut_detail_{id}`;
        const cacheData = cacheManager.get(cacheKey);

        if(cacheData) return cacheData;

        const response = await fetch(`/api/product/{id}`);
        if(!response.ok) throw new Error('Error al obtener el detalle del producto');

        const data = await response.json();
        cacheManager.set(cacheKey, data);

        return data
    },

    addToCart: async (productData) => {
        const response = await fetch('/api/cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
        });

        if (!response.ok) throw new Error('Error al agregar al carrito');

        return await response.json();
    }
}