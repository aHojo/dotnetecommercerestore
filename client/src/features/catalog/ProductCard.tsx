import { Product } from '../../app/models/Product';
import { Card, CardMedia, CardContent, Typography, CardActions, Button, CardHeader, Avatar } from '@mui/material';
import {Link} from "react-router-dom";


interface ProductProps {
  product: Product;
}


export default function ProductCard({ product }: ProductProps) {

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
        <Button size="small">Add Product</Button>
        <Button component={Link} to={`/catalog/${product.id}`} size="small">View</Button>
      </CardActions>
    </Card>
  )
}