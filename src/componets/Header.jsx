import { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';

function Header(){
    const { cartCount } = useContext(CartContext);
    const location = useLocation();

    const isHome = location.pathname === '/';

    return (
        <header style={{ border: '1px solid #ccc', padding: '10px', marginBottom: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1>
                    <Link to="/">📱 MovilShop</Link>
                </h1>
                <div>
                    🛒 Carrito: <strong>{cartCount}</strong> ítems
                </div>
            </div>
            <nav style={{  }}>
                <Link to="/">Home</Link>
                {!isHome && <span>/ Detalle del producto</span>}
            </nav>
        </header>
    )
}

export default Header;
