import { useEffect, useState } from "react";
import { productService } from "../services/productService";
import SearchBar from "../componets/SearchBar";

function ProductListPage() {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(()=>{
        productService.getProducts()
            .then(data => {
                setProducts(data);
                setLoading(false);
            })
            .catch(err =>{
                console.error(err);
                setLoading(false);
            });
    }, []);

    const filteredProducts = products.filter(product => {
        const term = searchTerm.toLowerCase();
        return (
            product.brand.toLowerCase().includes(term) ||
            product.model.toLowerCase().includes(term)
        );
    });

    if(loading) return <p>Cargando catalogo...</p>;

    return (
        <div>
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <div style ={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '20px'
            }}>
                {filteredProducts.map (product => (
                    <div 
                        key={product.id}
                        style={{
                            border: '1px solid #ddd',
                            padding: '15px',
                            borderRadius: '8px',
                            textAlign: 'center'
                        }}>
                        <Link
                            to={`/product/${product.id}`}
                            style={{
                                display: 'inline-block',
                                marginTop: '10px',
                                padding: '8px 12px',
                                backgroundColor: '#0070f3',
                                color: '#fff',
                                textDecoration: 'none',
                                borderRadius: '4px'
                            }}>
                            Ver detalles
                        </Link>
                    </div>
                ))}
            </div>
            {filteredProducts.length === 0 && (
                <p style={{ textAlign: 'center', marginTop: '4px' }}>No se encontraron dispositivos que coincidan.</p>
            )}
        </div>
    )
}

export default ProductListPage;
