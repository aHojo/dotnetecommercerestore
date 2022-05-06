import { Grid } from '@mui/material';

import { Product } from '../../app/models/Product';
import ProductCard from './ProductCard';


interface ProductListProps {
  products: Product[];
}


export default function ProductList({ products }: ProductListProps) {

  return (
    <Grid container spacing={4} >
      {products.map((product) => {
        return (
          <Grid item xs={3} key={product.id}>
            <ProductCard product={product} />
          </Grid>
        )
      })}
    </Grid>
  )
}