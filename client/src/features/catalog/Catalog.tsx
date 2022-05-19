
import React, { useEffect, useState } from "react";
// import { Product } from "../../app/models/Product";
import ProductList from "./ProductList";
// import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import {fetchProductsAsync, productSelectors} from "./catalogSlice";

function Catalog() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  const products = useAppSelector(productSelectors.selectAll);
  const {productsLoaded, status} = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();


  useEffect(() => {
    // agent.Catalog.list()
    //     .then(products => setProducts(products))
    //     .catch(err => console.log(err))
    //     .finally(() => setLoading(false))
    if(!productsLoaded) dispatch(fetchProductsAsync());
  }, [productsLoaded, dispatch])

  // if (loading) return <Loading />
  if (status.includes("pending")) return <Loading />

  return (
      <React.Fragment>
      <ProductList products={products} />
    </React.Fragment>

  );
}

export default Catalog;