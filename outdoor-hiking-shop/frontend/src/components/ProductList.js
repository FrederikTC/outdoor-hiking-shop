const products = [
    { id: 1, name: "Hiking Boots", price: 99.99 },
    { id: 2, name: "Backpack", price: 49.99 },
    { id: 3, name: "Tent", price: 129.99 }
  ];
  
  function ProductList() {
    return (
      <div>
        <h2>Products</h2>
        <ul>
          {products.map((product) => (
            <li key={product.id}>
              {product.name} - ${product.price}
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default ProductList;
  