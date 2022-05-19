import {createAsyncThunk, createEntityAdapter, createSlice} from "@reduxjs/toolkit";
import {Product} from "../../app/models/Product";
import agent from "../../app/api/agent";
import {RootState} from "../../app/store/configureStore";

/*
* This createEntityAdapter normalizes our data, so that we don't always have to load.
* */
const productsApapter = createEntityAdapter<Product>();

export const fetchProductsAsync = createAsyncThunk<Product[]>(
    'catalog/fetchProductsAsync',
        async (_, thunkAPI) => {
            try {
                return await agent.Catalog.list();
            } catch (err: any) {
                return thunkAPI.rejectWithValue({error: err.data})
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
            return thunkAPI.rejectWithValue({error: err.data})
        }
    }
)
export const catalogSlice = createSlice({
    name: 'catalog',
    /* This is the initial state
    *   ids(pin):
        entities(pin):
        productsLoaded(pin):false
        status(pin):"idle"
     */
    initialState: productsApapter.getInitialState({
        productsLoaded: false,
        status: "idle"
    }),
    reducers: {},
    extraReducers: (builder => {
        builder.addCase(fetchProductsAsync.pending, (state) => {
            state.status = "pendingFetchProducts";
        })
        builder.addCase(fetchProductsAsync.fulfilled, (state, action) => {
            productsApapter.setAll(state, action.payload);
            state.status = "idle";
            state.productsLoaded = true;
        })
        builder.addCase(fetchProductsAsync.rejected, (state,action) => {
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
    })
})

export const productSelectors = productsApapter.getSelectors((state: RootState) => state.catalog);