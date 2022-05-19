import { createAsyncThunk, createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { Product, ProductParams } from "../../app/models/Product";
import agent from "../../app/api/agent";
import { RootState } from "../../app/store/configureStore";
import { MetaData } from "../../app/models/Pagination";

interface CatalogState {
  productsLoaded: boolean;
  filtersLoaded: boolean;
  status: string;
  brands: string[];
  types: string[];
  productParams: ProductParams;
  metaData: MetaData | null
}
/*
* This createEntityAdapter normalizes our data, so that we don't always have to load.
* */
const productsApapter = createEntityAdapter<Product>();

function getAxiosParams(productParams: ProductParams) {
  const params = new URLSearchParams();
  params.append('pageNumber', productParams.pageNumber.toString());
  params.append('pageSize', productParams.pageSize.toString());
  params.append('orderBy', productParams.orderBy);

  // optional
  if (productParams.searchTerm) params.append('searchTerm', productParams.searchTerm);
  if (productParams.types.length > 0) params.append('types', productParams.types.toString());
  if (productParams.brands.length > 0) params.append('brands', productParams.brands.toString());

  return params;
}
export const fetchProductsAsync = createAsyncThunk<Product[], void, { state: RootState }>(
  'catalog/fetchProductsAsync',
  async (_, thunkAPI) => {
    const params = getAxiosParams(thunkAPI.getState().catalog.productParams)
    try {
      const response = await agent.Catalog.list(params);
      thunkAPI.dispatch(setMetaData(response.metaData));
      return response.items;

    } catch (err: any) {
      return thunkAPI.rejectWithValue({ error: err.data })
    }
  }
)
// second arg in the generic is the id - something we pass to it
export const fetchProductAsync = createAsyncThunk<Product, number>(
  'catalog/fetchProductAsync',
  async (prodiuctId, thunkAPI) => {
    try {
      return await agent.Catalog.details(prodiuctId);
    } catch (err: any) {
      return thunkAPI.rejectWithValue({ error: err.data })
    }
  }
)

export const fetchFiltersAync = createAsyncThunk(
  'catalog/fetchFilters',
  async (_, thunkAPI) => {
    try {
      return agent.Catalog.fetchFilters();
    } catch (error: any) {
      return thunkAPI.rejectWithValue({ error: error.data })
    }
  }
)

function initParams() {
  return {
    pageNumber: 1,
    pageSize: 6,
    orderBy: "name",
    brands: [],
    types: [],
  }
}
export const catalogSlice = createSlice({
  name: 'catalog',
  /* This is the initial state
  *   ids(pin):
      entities(pin):
      productsLoaded(pin):false
      status(pin):"idle"
   */
  initialState: productsApapter.getInitialState<CatalogState>({
    productsLoaded: false,
    status: "idle",
    filtersLoaded: false,
    brands: [],
    types: [],
    productParams: initParams(),
    metaData: null
  }),
  reducers: {
    setProductParams: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload, pageNumber: 1 };
    },
    setPageNumber: (state, action) => {
      state.productsLoaded = false;
      state.productParams = { ...state.productParams, ...action.payload };
    },
    resetProductParams: (state) => {
      state.productParams = initParams();
    },
    setMetaData: (state, action) => {
      state.metaData = action.payload
    }
  },
  extraReducers: (builder => {
    builder.addCase(fetchProductsAsync.pending, (state) => {
      state.status = "pendingFetchProducts";
    })
    builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
      productsApapter.setAll(state, action.payload);
      state.status = "idle";
      state.productsLoaded = true;
    })
    builder.addCase(fetchProductsAsync.rejected, (state, action) => {
      console.log(action.payload);
      state.status = "idle";
    })
    builder.addCase(fetchProductAsync.pending, (state) => {
      state.status = "pendingFetchProduct";
    })
    builder.addCase(fetchProductAsync.fulfilled, (state, action) => {
      productsApapter.upsertOne(state, action.payload)
      state.status = "idle";
    })
    builder.addCase(fetchProductAsync.rejected, (state, action) => {
      console.log(action)
      state.status = "idle";
    })
    builder.addCase(fetchFiltersAync.pending, (state) => { state.status = 'pendingFetchFilters' })
    builder.addCase(fetchFiltersAync.fulfilled, (state, action) => {
      state.brands = action.payload.brands;
      state.types = action.payload.types;
      state.filtersLoaded = true;
      state.status = 'idle';
    })
    builder.addCase(fetchFiltersAync.rejected, (state, action) => {
      state.status = 'idle'
      console.log(action.payload);
    })
  })
})

export const productSelectors = productsApapter.getSelectors((state: RootState) => state.catalog);

export const { setProductParams, resetProductParams, setMetaData, setPageNumber } = catalogSlice.actions;