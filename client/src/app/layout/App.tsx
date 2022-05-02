import { useEffect, useState } from 'react';
import { Product } from '../models/Product';

function App() {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setProducts(data)
      })
  }, [])

  function addProduct() {

    setProducts(prevState =>
      [...prevState,
      {
        id: prevState.length + 101,
        name: 'product' + (prevState.length + 1),
        price: (prevState.length * 100) + 100,
        brand: "somebrand",
        description: "some description",
        pictureUrl: "http://picsum.photos/200"
      },
      ])
  }
  return (
    <div>
      <h1>Re-Store</h1>

      <ul>
        {products.map((product, index) => {
          return (
            <li key={product.id}>{product.name} - {product.price}</li>
          )
        })}
      </ul>
      <button onClick={addProduct}>Add Product</button>

    </div>
  );
}

export default App;