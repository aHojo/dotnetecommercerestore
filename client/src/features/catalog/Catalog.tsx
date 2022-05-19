
import React, { useEffect } from "react";
// import { Product } from "../../app/models/Product";
import ProductList from "./ProductList";
// import agent from "../../app/api/agent";
import Loading from "../../app/layout/Loading";
import { useAppDispatch, useAppSelector } from "../../app/store/configureStore";
import { fetchFiltersAync, fetchProductsAsync, productSelectors, setPageNumber, setProductParams } from "./catalogSlice";
import { Box, Checkbox, FormControl, FormControlLabel, FormGroup, FormLabel, Grid, Pagination, Paper, Radio, RadioGroup, Typography } from "@mui/material";
import ProductSearch from "./ProductSearch";
import RadioButtonGroup from "../../app/components/RadioButtonGroup";
import CheckboxButtons from "../../app/components/CheckboxButtons";
import AppPagination from "../../app/components/AppPagination";


const sortOptions = [
  { value: "name", label: "Alphabetical" },
  { value: "priceDesc", label: "Price - High to low" },
  { value: "price", label: "Price - Low to high" },
]

function Catalog() {
  // const [products, setProducts] = useState<Product[]>([]);
  // const [loading, setLoading] = useState(true);
  const products = useAppSelector(productSelectors.selectAll);
  const { productsLoaded, status, filtersLoaded, brands, types, productParams, metaData } = useAppSelector(state => state.catalog);
  const dispatch = useAppDispatch();


  useEffect(() => {
    // agent.Catalog.list()
    //     .then(products => setProducts(products))
    //     .catch(err => console.log(err))
    //     .finally(() => setLoading(false))
    if (!productsLoaded) dispatch(fetchProductsAsync());

  }, [productsLoaded, dispatch])

  useEffect(() => {
    if (!filtersLoaded) dispatch(fetchFiltersAync());
  }, [dispatch, filtersLoaded])

  // if (loading) return <Loading />
  if (!filtersLoaded) return <Loading />

  return (
    <React.Fragment>
      <Grid container columnSpacing={4}>
        <Grid item xs={3}>
          <Paper sx={{ mb: 2 }}>
            <ProductSearch />
          </Paper>
          <Paper sx={{ mb: 2, p: 2 }}>
            <RadioButtonGroup selectedValue={productParams.orderBy} options={sortOptions} onChange={(e) => dispatch(setProductParams({ orderBy: e.target.value }))} />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <CheckboxButtons items={brands} checked={productParams.brands} onChange={(items: string[]) => dispatch(setProductParams({ brands: items }))} />
          </Paper>
          <Paper sx={{ p: 2, mb: 2 }}>
            <FormGroup>
              <CheckboxButtons items={types} checked={productParams.types} onChange={(items: string[]) => dispatch(setProductParams({ types: items }))} />
            </FormGroup>
          </Paper>
        </Grid>
        <Grid item xs={9}>
          <ProductList products={products} />
        </Grid>
        <Grid item xs={3}></Grid>
        <Grid item xs={9} sx={{ mb: 2 }}>
          {metaData &&
            <AppPagination
              metaData={metaData}
              onPageChange={(page: number) => dispatch(setPageNumber({ pageNumber: page }))}
            />}
        </Grid>
      </Grid>
    </React.Fragment>

  );
}

export default Catalog;