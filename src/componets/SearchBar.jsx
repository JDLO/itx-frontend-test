function SearchBar({value, onChange}){
    return (
        <div>
            <input
                type="text"
                placeholder="Buscar por marca o modelo"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                style={{padding: '8px', width: '300px', borderRadius: '4px', border: '1px solid #ccc'}}
            />
        </div>
    );
}

export default SearchBar;
