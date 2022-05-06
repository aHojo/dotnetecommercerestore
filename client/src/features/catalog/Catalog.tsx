
import React, { useEffect, useState } from "react";
import { Product } from "../../app/models/Product";
import Button from '@mui/material/Button';
import ProductList from "./ProductList";

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    fetch('http://localhost:5000/api/products')
      .then(response => response.json())
      .then(data => {
        console.log(data)
        setProducts(data)
      })
  }, [])


  return (
    <React.Fragment>
      <ProductList products={products} />
    </React.Fragment>

  );
}

export default Catalog;