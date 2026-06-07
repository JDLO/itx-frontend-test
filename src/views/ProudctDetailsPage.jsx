import { createContext, useContext, useEffect, useState } from "react";
import { data, Link, useParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { productService } from "../services/productService";

function ProductDetailsPage() {
  const { id } = useParams();

  const { setCartCount } = useContext(CartContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedStorage, setSelectedStorage] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    productService.getProductById(id)
      .then(data => {
        setProduct(data);

        if (data.options && data.options.storages) {
          if (data.options.storages.length === 1) {
            setSelectedStorage(data.options.storages[0].code);
          } else {
            setSelectedStorage(data.options.storages[0].code);
          }
        }

        if (data.options && data.options.colors) {
          if (data.options.colors.length === 1) {
            setSelectedColor(data.options.colors[0].code);
          } else {
            setSelectedColor(data.options.colors[0].code);
          }
        }

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  const handleAddToCart = async (e) => {
    e.preventDefault();

    if (!selectedStorage || !selectedColor) {
      alert('Por favor, seleccione opciones validas.')
      return;
    }

    setIsSubmitting(true);

    try {
      const body = {
        id: product.id,
        colorCode: parseInt(selectedColor, 10),
        storageCode: parseInt(selectedStorage, 10)
      };

      const result = await productService.addToCart(body);

      setCartCount(result.count);
      alert('Producto agregado con exito al carrito!');

    } catch (error) {
      console.error(error);
      alert('Hubo un error al agregar el producto al carrito.')
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <p>Cargando detalles del dispositivo...</p>;
  if (!product) return <p>No se encontro la informacion del producto.</p>

  return (
    <div>
      <div>
        <Link
          to="/"
          style={{
            color: '#0070f3',
            textDecoration: 'none',
            fontWeight: 'bold'
          }}
        >
          ← Volver al listado de productos
        </Link>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px', marginTop: '20px' }}>

        {/* COLUMNA 1: Imagen del Producto */}
        <div style={{ flex: '1 1 300px', textAlign: 'center', border: '1px solid #eaeaea', padding: '20px', borderRadius: '8px' }}>
          <img
            src={product.imgUrl}
            alt={`${product.brand} ${product.model}`}
            style={{ maxWidth: '100%', height: 'auto', maxHeight: '400px', objectFit: 'contain' }}
          />
        </div>

        {/* COLUMNA 2: Detalles y Acciones */}
        <div style={{ flex: '1 1 400px' }}>

          {/* Ficha Técnica (Description) */}
          <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Ficha Técnica</h2>
            <ul style={{ listStyleType: 'none', padding: 0, lineHeight: '1.8' }}>
              <li><strong>Marca:</strong> {product.brand}</li>
              <li><strong>Modelo:</strong> {product.model}</li>
              <li><strong>Precio:</strong> {product.price ? `${product.price}€` : 'No disponible'}</li>
              <li><strong>CPU:</strong> {product.cpu || 'N/A'}</li>
              <li><strong>RAM:</strong> {product.ram || 'N/A'}</li>
              <li><strong>Sistema Operativo:</strong> {product.os || 'N/A'}</li>
              <li><strong>Resolución de Pantalla:</strong> {product.displayResolution || 'N/A'}</li>
              <li><strong>Batería:</strong> {product.battery || 'N/A'}</li>
              <li><strong>Cámaras:</strong> {Array.isArray(product.internalMemory) ? product.internalMemory.join(', ') : product.cameras || 'N/A'}</li>
              <li><strong>Dimensiones:</strong> {product.dimentions || 'N/A'}</li>
              <li><strong>Peso:</strong> {product.weight ? `${product.weight}g` : 'N/A'}</li>
            </ul>
          </section>

          {/* Selector de Opciones y Botón (Actions) */}
          <section style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px' }}>
            <h3>Personaliza tu dispositivo</h3>
            <form onSubmit={handleAddToCart}>

              {/* Selector de Almacenamiento */}
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Almacenamiento:</label>
                <select
                  value={selectedStorage}
                  onChange={(e) => setSelectedStorage(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                >
                  {product.options?.storages?.map(storage => (
                    <option key={storage.code} value={storage.code}>
                      {storage.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Selector de Color */}
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Color disponible:</label>
                <select
                  value={selectedColor}
                  onChange={(e) => setSelectedColor(e.target.value)}
                  style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
                >
                  {product.options?.colors?.map(color => (
                    <option key={color.code} value={color.code}>
                      {color.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Botón de Añadir */}
              <button
                type="submit"
                disabled={isSubmitting}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: isSubmitting ? '#ccc' : '#2ecc71',
                  color: '#white',
                  border: 'none',
                  borderRadius: '4px',
                  fontWeight: 'bold',
                  cursor: isSubmitting ? 'not-allowed' : 'pointer'
                }}
              >
                {isSubmitting ? 'Añadiendo...' : 'Añadir al Carrito'}
              </button>

            </form>
          </section>

        </div>
      </div>
    </div>
  );

}

export default ProductDetailsPage;
