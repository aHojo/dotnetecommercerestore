import { Product } from '../../app/models/Product';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, CardHeader, Avatar } from '@mui/material';
import { Link } from "react-router-dom";
import agent from '../../app/api/agent';
import { useState } from 'react';
import { LoadingButton } from '@mui/lab';
import { useStoreContext } from '../../context/StoreContext';
import {useAppDispatch, useAppSelector} from "../../app/store/configureStore";
import {addBasketItemAsync} from "../BasketPage/basketslice";
// import {toast} from "react-toastify";
// import loading = toast.loading;


interface ProductProps {
  product: Product;
}


export default function ProductCard({ product }: ProductProps) {
    const {status} = useAppSelector(state => state.basket)
    const dispatch = useAppDispatch();

    // const { setBasket } = useStoreContext();
  // const [loading, setLoading] = useState(false);

  // function handleAddItem(productId: number) {
  //   setLoading(true);
  //   agent.Basket.addItem(productId)
  //     .then(basket => dispatch(setBasket(basket)))
  //     .catch(err => console.error(err))
  //     .finally(() => setLoading(false));
  // }

  return (
    <Card>
      <CardHeader avatar={
        <Avatar sx={{ bgcolor: 'secondary.main' }}>
          {product.name.charAt(0).toUpperCase()}
        </Avatar>
      }
        title={product.name}
        titleTypographyProps={{
          sx: { fontWeight: 'bold', color: 'primary.main' }
        }}
      />
      <CardMedia
        component="img"
        height="140"
        image={product.pictureUrl}
        title={product.name}
        sx={{ backgroundSize: 'contain' }}
      />
      <CardContent>
        <Typography gutterBottom color="secondary" variant="h5">
          ${(product.price / 100).toFixed(2)}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {product.brand}/{product.type}
        </Typography>
      </CardContent>
      <CardActions>
        <LoadingButton loading={status.includes("pendingAddItem" + product.id)} onClick={() => dispatch(addBasketItemAsync({productId: product.id}))} size="small">Add Product</LoadingButton>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}