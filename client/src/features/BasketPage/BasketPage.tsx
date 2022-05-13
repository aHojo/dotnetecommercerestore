import { Typography } from "@mui/material";
import { useEffect, useState } from "react"
import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { Basket } from "../../app/models/Basket";

export default function BasketPage() {

  const [loading, setLoading] = useState(true);
  const [basket, setBasket] = useState<Basket | null>(null);

  useEffect(() => {
    agent.Basket.get()
      .then(basket => {
        setBasket(basket)
      })
      .catch(err => console.log(err))
      .finally(() => setLoading(false));
  }, [])


  if (loading) return <Loading message="Loading basket..." />
  if (!basket) return <Typography variant="h3">Your basket is empty</Typography>
  return (
    <h1>
      BuyerId = {basket.buyerId}
    </h1>
  )
}