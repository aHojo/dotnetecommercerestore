
import React, { useEffect, useState } from "react";
import { Product } from "../../app/models/Product";
import ProductList from "./ProductList";
import agent from "../../app/api/agent";

function Catalog() {
  const [products, setProducts] = useState<Product[]>([]);


  useEffect(() => {
    agent.Catalog.list().then(products => setProducts(products));
  }, [])


  return (
    <React.Fragment>
      <ProductList products={products} />
    </React.Fragment>

  );
}

export default Catalog;